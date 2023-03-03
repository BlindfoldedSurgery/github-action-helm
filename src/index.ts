const fs = require('fs');
const core = require('@actions/core');
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "./input_definitions";
import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "./models";
import { writeTmpfile, deleteTmpfile } from "./tmpfile";
import { execSync } from 'child_process';


function parseInputs(subcommand: HelmSubcommand): GithubActionInputEntry[] {
    const result = GITHUB_ACTIONS_INPUT_CONFIGURATION.map((input: GithubActionInputEntry) => {
        if (input.value.value === undefined || input.value.value === "") {
            input.value.value = input.value.default;
        }
        input.value.value = parseValueByType(input);
        validateInput(input, subcommand);
        return input;
    });

    const genName = getValueForName("generate_name", result);
    const releaseName = getInputEntry("release_name", result);
    const releaseNameValue = releaseName.value.value;

    // several subcommands (e.g. uninstall) only accept release_name, this is ensured by the `supported_subcommands`
    // a release name must be existent and these are the only two flags which can set it
    if (((!genName && !releaseNameValue) || (genName && releaseNameValue)) && subcommand !== HelmSubcommand.None) {
        if (releaseName.value.supported_subcommands.includes(subcommand)) {
            throw Error("(only) one of `generate_name` or `release_name` must be set");
        }
    }

    return handleFileInputs(result);
}

function parseValueByType(input: GithubActionInputEntry): string | boolean | number | undefined {
    const value = core.getInput(input.name);
    // requirement validation will be done in `validateInput`
    if (value === "" || value === undefined) {
        if (input.value.type === GithubActionInputType.Boolean) {
            return false;
        }

        return input.value.value;
    }

    switch (input.value.type) {
        case GithubActionInputType.Boolean:
            if (input.value.value === false || input.value.value === true) {
                return input.value.value;
            }

            const val = <string>input.value.value;
            return val.toLowerCase() === "true";
        case GithubActionInputType.Number:
            return Number(value);
        case GithubActionInputType.File:
            return value;
        case GithubActionInputType.Time:
            return value;
        case GithubActionInputType.String:
            return value;
    }
}

function handleFileInputs(inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.map((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        if (fs.existsSync(<string>entry.value.value)) {
            console.info(`handle value from '${entry.name}' as filepath`)
            return entry;
        } else {
            console.info(`handle value from ${entry.name} as file content (generating temporary file)`)
            const path = writeTmpfile(<string>entry.value.value);
            entry.value.value = path;
            return entry;
        }
    })
}

function cleanupFiles(inputs: GithubActionInputEntry[]) {
    return inputs.forEach((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        deleteTmpfile(<string>entry.value.value);
    })
}

function validateInput(input: GithubActionInputEntry, subcommand: HelmSubcommand): boolean {
    // since we support files for the subcommand, we should stil
    if (subcommand === HelmSubcommand.None && input.value.type !== GithubActionInputType.File) {
        return true;
    }
    const isSupportedSubcommand = input.value.supported_subcommands.includes(subcommand) || input.value.supported_subcommands.includes(HelmSubcommand.All);
    const hasValue = input.value.value !== "" && input.value.value !== undefined;
    const isFalseBoolean = input.value.type === GithubActionInputType.Boolean && input.value.value === false;

    if (input.name === "kubeconfig") {
        console.log(isSupportedSubcommand);
        console.log(input.value.supported_subcommands.includes(HelmSubcommand.All));
        console.log(HelmSubcommand.All);
        console.log(input.value.supported_subcommands);
    }
    // default case is already handled in `parseInputs`
    if (input.value.required && isSupportedSubcommand && !hasValue) {
        throw Error(`${input.name} is required for ${subcommand} but has no (or empty) value`)
    } else if (!isSupportedSubcommand && hasValue && !isFalseBoolean) {
        // boolean is set to false by default and will not be passed as a flag
        throw Error(`${input.name} is not supported for ${subcommand}`);
    }

    return isSupportedSubcommand || subcommand === HelmSubcommand.None;
}

function inputsToHelmFlags(inputs: GithubActionInputEntry[]): string[] {
    return <string[]>inputs.map((input: GithubActionInputEntry) => {
        const flag = `--${input.name.replace(/_/g, "-")}`
        if (input.name === "ref" || input.name === "release_name") {
            return undefined;
        }
        else if (input.value.type === GithubActionInputType.Boolean) {
            if (input.value.value) {
                return flag;
            }
        } else if (input.value.value !== "") {
            const value = input.value.value || input.value.default;

            return `${flag}=${value}`
        } else {
            return undefined;
        }
    }).filter((item) => item);
}

function getInputEntry(name: string, inputs: GithubActionInputEntry[]): GithubActionInputEntry {
    return <GithubActionInputEntry>inputs.find((item) => item.name === name);
}

function getValueForName(name: string, inputs: GithubActionInputEntry[]): string | number | boolean | undefined {
    const item = getInputEntry(name, inputs);

    return item.value.value;
}

function getInputsByType(type: GithubActionInputType, inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.filter((item: GithubActionInputEntry) => item.value.type === type)
}

function executeHelm(args: string): string {
    args = args.replace(/^helm /, "")
    const command = `helm ${args}`;
    console.log(`executing ${command}`)
    const stdout = execSync(command).toString();
    console.log(stdout);

    return stdout;
}

let inputs = null;
try {
    const rawSubcommand: string = core.getInput("subcommand");
    const subcommand = rawSubcommand as HelmSubcommand;
    const rawCommand = core.getInput("raw_command");

    inputs = parseInputs(subcommand);
    if (subcommand === HelmSubcommand.None && rawCommand === "") {
        throw Error("either `subcommand` or `raw_command` has to be set");
    }
    let command = "";
    if (rawCommand !== "") {
        const fileInputs = getInputsByType(GithubActionInputType.File, inputs);
        const fileArgs = inputsToHelmFlags(fileInputs);

        command = `${rawCommand} ${fileArgs}`
    } else {
        const releaseName = getValueForName("release_name", inputs);
        const ref = getInputEntry("ref", inputs);
        if ((ref.value.value === "" || ref.value.value === undefined) && ref.value.supported_subcommands.includes(subcommand)) {
            throw Error(`'ref' has to be set for ${subcommand}`)
        }

        const flags = inputsToHelmFlags(inputs).join(" ");
        command = `${rawSubcommand} ${releaseName} ${ref.value.value} ${flags}`;
    }

    executeHelm(command);

} catch (error: any) {
    core.setFailed(error.message);
}

if (inputs !== null) {
    cleanupFiles(inputs);
}
