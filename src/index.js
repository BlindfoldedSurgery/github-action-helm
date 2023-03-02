"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const core = require('@actions/core');
const input_definitions_1 = require("./input_definitions");
const models_1 = require("./models");
const tmpfile_1 = require("./tmpfile");
const child_process_1 = require("child_process");
function parseInputs() {
    const result = input_definitions_1.GITHUB_ACTIONS_INPUT_CONFIGURATION.map((input) => {
        if (input.value.value === undefined || input.value.value === "") {
            input.value.value = input.value.default;
        }
        input.value.value = parseValueByType(input);
        validateInput(input);
        return input;
    });
    const genName = getValueForName("generate_name", result);
    const releaseName = getValueForName("release_name", result);
    // a release name must be existent and these are the only two flags which can set it
    if ((!genName && !releaseName) || (genName && releaseName)) {
        throw Error("(only) one of `generate_name` or `release_name` must be set");
    }
    return handleFileInputs(result);
}
function parseValueByType(input) {
    const value = core.getInput(input.name);
    // requirement validation will be done in `validateInput`
    if (value === "" || value === undefined) {
        if (input.value.type === models_1.GithubActionInputType.Boolean) {
            return false;
        }
        return input.value.value;
    }
    switch (input.value.type) {
        case models_1.GithubActionInputType.Boolean:
            if (input.value.value === false || input.value.value === true) {
                return input.value.value;
            }
            const val = input.value.value;
            return val.toLowerCase() === "true";
        case models_1.GithubActionInputType.Number:
            return Number(value);
        case models_1.GithubActionInputType.File:
            return value;
        case models_1.GithubActionInputType.Time:
            return value;
        case models_1.GithubActionInputType.String:
            return value;
    }
}
function handleFileInputs(inputs) {
    return inputs.map((entry) => {
        if (entry.value.type !== models_1.GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }
        if (fs.existsSync(entry.value.value)) {
            console.info(`handle value from '${entry.name}' as filepath`);
            return entry;
        }
        else {
            console.info(`handle value from ${entry.name} as file content (generating temporary file)`);
            const path = (0, tmpfile_1.writeTmpfile)(entry.value.value);
            entry.value.value = path;
            return entry;
        }
    });
}
function cleanupFiles(inputs) {
    return inputs.forEach((entry) => {
        if (entry.value.type !== models_1.GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }
        (0, tmpfile_1.deleteTmpfile)(entry.value.value);
    });
}
function validateInput(input) {
    // default case is already handled in `parseInputs`
    if (input.value.required && input.value.value === "") {
        throw Error(`${input.name} is required but has no (or empty) value`);
    }
    // TODO
    return true;
}
function inputsToHelmFlags(inputs) {
    return inputs.map((input) => {
        const flag = `--${input.name.replace(/_/g, "-")}`;
        if (input.name === "ref" || input.name === "release_name") {
            return undefined;
        }
        else if (input.value.type === models_1.GithubActionInputType.Boolean) {
            if (input.value.value) {
                return flag;
            }
        }
        else if (input.value.value !== "") {
            const value = input.value.value || input.value.default;
            return `${flag}=${value}`;
        }
        else {
            return undefined;
        }
    }).filter((item) => item);
}
function getValueForName(name, inputs, def = undefined) {
    const item = inputs.filter((item) => item.name === name)[0];
    if (item === undefined) {
        return def;
    }
    else {
        return parseValueByType(item);
    }
}
let inputs = null;
try {
    const subcommand = core.getInput("subcommand");
    const rawCommand = core.getInput("raw_command");
    inputs = parseInputs();
    if (subcommand === "" && rawCommand === "") {
        throw Error("either `subcommand` or `raw_command` has to be set");
    }
    if (rawCommand !== "") {
        const helmArgs = rawCommand.replace(/^helm /, '');
        const command = `helm ${helmArgs}`;
        console.log(`executing ${command}`);
        const stdout = (0, child_process_1.execSync)(command);
        console.log(stdout);
    }
    else {
        const releaseName = getValueForName("release_name", inputs, "");
        const ref = getValueForName("ref", inputs);
        const flags = inputsToHelmFlags(inputs).join(" ");
        const command = `helm ${subcommand} ${releaseName} ${ref} ${flags}`;
        console.log(`executing ${command}`);
        const stdout = (0, child_process_1.execSync)(command);
        console.log(stdout.toString());
    }
}
catch (error) {
    core.setFailed(error.message);
}
if (inputs !== null) {
    cleanupFiles(inputs);
}
