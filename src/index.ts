const fs = require('fs');
const core = require('@actions/core');
import { getInputsByType, parseInputs, inputsToHelmFlags, executeHelm, cleanupFiles, validateReleaseName, sortInputs, populateInputConfigValues } from "./helper";
import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "./models";

let inputs: GithubActionInputEntry[] = [];
try {
    const rawSubcommand: string = core.getInput("subcommand");
    const subcommand = rawSubcommand as HelmSubcommand;
    const rawCommand = core.getInput("raw_command");

    if (subcommand === HelmSubcommand.None && rawCommand === "") {
        throw Error("either `subcommand` or `raw_command` has to be set");
    }

    populateInputConfigValues();
    let command = `${rawSubcommand}`;
    if (rawCommand !== "") {
        inputs = getInputsByType(GithubActionInputType.File, inputs);

        command = `${rawCommand}`
    } else {
        inputs = sortInputs(parseInputs(subcommand));
        validateReleaseName(subcommand, inputs);
    }
    const flags = inputsToHelmFlags(inputs).join(" ");

    executeHelm(`${rawSubcommand} ${flags}`);
} catch (error: any) {
    core.setFailed(error.message);
}

if (inputs.length > 0) {
    cleanupFiles(inputs);
}
