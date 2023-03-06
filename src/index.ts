const fs = require('fs');
const core = require('@actions/core');
import { getInputsByType, parseInputs, inputsToHelmFlags, executeHelm, cleanupFiles, validateReleaseName, sortInputs, populateInputConfigValues } from "./helper";
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "./input_definitions";
import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "./models";

let inputs: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION;
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
        validateReleaseName(subcommand, inputs);
    }
    inputs = sortInputs(parseInputs(subcommand, inputs));
    const flags = inputsToHelmFlags(inputs).join(" ");

    executeHelm(`${command} ${flags}`);
} catch (error: any) {
    core.setFailed(error.message);
}

cleanupFiles(inputs);
