const fs = require('fs');
const core = require('@actions/core');
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "./input_definitions";
import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "./models";
import { writeTmpfile, deleteTmpfile } from "./tmpfile";
import { execSync } from 'child_process';


export function getPriority(input: GithubActionInputEntry): number {
    if (input.value.priority === undefined) {
        return 0;
    } else {
        return input.value.priority;
    }
}

export function validateReleaseName(subcommand: HelmSubcommand, inputs: GithubActionInputEntry[]) {
    const genName = getValueForName("generate_name", inputs);
    const releaseName = getInputEntry("release_name", inputs);

    const releaseNameIsSome = releaseName.value.value !== "";
    const twoSet = (genName === true) && releaseNameIsSome;
    const noneSet = !genName && !releaseNameIsSome;
    // several subcommands (e.g. uninstall) only accept release_name, this is ensured by the `supported_subcommands`
    // a release name must be existent and these are the only two flags which can set it
    if ((twoSet || noneSet) && subcommand !== HelmSubcommand.None) {
        if (releaseName.value.supported_subcommands.includes(subcommand)) {
            throw Error("(only) one of `generate_name` or `release_name` must be set");
        }
    }
}

export function sortInputs(inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.sort((item1, item2) => getPriority(item2) - getPriority(item1));
}

export function populateInputConfigValues(config: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION): GithubActionInputEntry[] {
    return config.map((input: GithubActionInputEntry) => {
        input.value.value = core.getInput(input.name);

        return input;
    })
}

export function parseInputs(subcommand: HelmSubcommand, config: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION): GithubActionInputEntry[] {
    const result = config.map((input: GithubActionInputEntry) => {
        input.value.value = parseValueByType(input);
        validateInput(input, subcommand);
        return input;
    });

    return handleFileInputs(result);
}

export function validateInput(input: GithubActionInputEntry, subcommand: HelmSubcommand): boolean {
    if (subcommand === HelmSubcommand.None && input.value.type !== GithubActionInputType.File) {
        return true;
    }
    const isSupportedSubcommand = input.value.supported_subcommands.includes(subcommand) || input.value.supported_subcommands.includes(HelmSubcommand.All);
    const hasValue = input.value.value !== "" && input.value.value !== undefined;
    const isFalseBoolean = input.value.type === GithubActionInputType.Boolean && input.value.value === false;

    if (!isSupportedSubcommand && hasValue && !isFalseBoolean) {
        // boolean is set to false by default and will not be passed as a flag
        throw Error(`${input.name} is not supported for ${subcommand}`);
    }

    if (input.value.type === GithubActionInputType.Boolean) {
        if (!(input.value.value === true || input.value.value === false)) {
            throw Error(`'${input.name}' with type 'Boolean' must be 'true' or 'false'`)
        }
    } else if (input.value.type === GithubActionInputType.Number) {
        if (Number.isNaN(<Number>input.value.value)) {
            throw Error(`'${input.name}' with type 'Number' must not be 'NaN'`)
        }
    }

    return isSupportedSubcommand || subcommand === HelmSubcommand.None;
}

export function parseValueByType(input: GithubActionInputEntry): string | boolean | number | undefined {
    const value = input.value.value;
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

            const val = <string>value;
            switch (val.toLowerCase()) {
                case "true":
                    return true;
                case "false":
                    return false;
                default:
                    return undefined;
            }
        case GithubActionInputType.Number:
            const strval = String(value).toLowerCase();
            if (strval === "true" || strval === "false") {
                throw Error("boolean value won't be auto-converted to a number, use `0`/`1` respectively");
            }
            return Number(value);
        case GithubActionInputType.File:
            return value;
        case GithubActionInputType.Time:
            return value;
        case GithubActionInputType.String:
            return value;
    }
}

export function handleFileInputs(inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.map((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        if (fs.existsSync(<string>entry.value.value)) {
            console.info(`handle value from '${entry.name}' as filepath`)
            return entry;
        } else {
            if ((<string>entry.value.value).length === 0) {
                throw Error(`value for ${entry.name} is empty (content for file arguments should not be empty, omit file argument instead)`);
            }

            console.info(`handle value from ${entry.name} as file content (generating temporary file)`)
            const path = writeTmpfile(<string>entry.value.value);
            entry.value.value = path;
            return entry;
        }
    })
}

export function cleanupFiles(inputs: GithubActionInputEntry[]) {
    return inputs.forEach((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        const value = <string>entry.value.value;
        if (value !== undefined) {
            deleteTmpfile(value);
        }
    })
}

export function inputsToHelmFlags(inputs: GithubActionInputEntry[]): string[] {
    return <string[]>inputs.map((input: GithubActionInputEntry) => {
        const flag = `--${input.name.replace(/_/g, "-")}`
        if (input.name === "ref" || input.name === "release_name" || input.name === "revision" || input.name == "path") {
            return input.value.value;
        } else if (input.value.type === GithubActionInputType.Boolean) {
            if (input.value.value) {
                return flag;
            }
        } else if (input.value.value !== "") {
            const value = input.value.value;

            return `${flag}=${value}`
        } else {
            return undefined;
        }
    }).filter((item) => item);
}

export function getInputEntry(name: string, inputs: GithubActionInputEntry[]): GithubActionInputEntry {
    return <GithubActionInputEntry>inputs.find((item) => item.name === name);
}

export function getValueForName(name: string, inputs: GithubActionInputEntry[]): string | number | boolean | undefined {
    const item = getInputEntry(name, inputs);

    return item.value.value;
}

export function getInputsByType(type: GithubActionInputType, inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.filter((item: GithubActionInputEntry) => item.value.type === type)
}

export function executeHelm(args: string): string {
    args = args.replace(/^helm /, "")
    const command = `helm ${args}`;
    console.log(`executing ${command}`)
    const stdout = execSync(command).toString();
    console.log(stdout);

    return stdout;
}

export function isHelpOutput(stdout: string): boolean {
    stdout = stdout.toLowerCase();
    return stdout.includes("available commands") && stdout.includes("usage") && stdout.includes("helm [command]");
}
