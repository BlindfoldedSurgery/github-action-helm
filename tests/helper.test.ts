const fs = require('fs');
import { cleanupFiles, executeHelm, getInputsByType, getPriority, handleFileInputs, inputsToHelmFlags, isHelpOutput, parseInputs, populateInputConfigValues, sortInputs, validateReleaseName } from "../src/helper";
import { PARSE_INPUTS_CONFIG, findInputConfig, SORT_INPUTS_CONFIG, VALIDATE_NAME_INPUTS_CONFIG, FLAGS_INPUTS_CONFIG } from "./fixtures";
import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "../src/models";
import { parse } from "path";

function setEnvVar(inputName: string, value: string) {
    const name = `INPUT_${inputName.toLocaleUpperCase()}`;
    process.env[name] = value;
}

function resetEnvironment() {
    for (const key in process.env) {
        if (key.startsWith("INPUT_")) {
            process.env[key] = "";
        }
    }
}

afterEach(() => {
    resetEnvironment();
});

describe("testing helper#getPriority", () => {
    test("should return 0 when priority is undefined", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        input.value.priority = undefined;
        expect(getPriority(input)).toBe(0);
    });
    test("should return priority when priority is defined", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        input.value.priority = 1;
        expect(getPriority(input)).toBe(1);
    });
});

describe("testing helper#parseInputs", () => {
    test("input with type boolean and value `true` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "true");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(HelmSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(true);
    });
    test("input with type boolean and value `false` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "false");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(HelmSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(false);
    });
    test("input with type boolean and value `1` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "1");
        let inputs = populateInputConfigValues([input]);

        expect(() => parseInputs(HelmSubcommand.All, inputs)).toThrow();
    });
    test("input with type number and value `1` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "1");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(HelmSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(1);
    });
    test("input with type number and value `testString` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "testString");
        let inputs = populateInputConfigValues([input]);
        expect(() => parseInputs(HelmSubcommand.All, inputs)).toThrow();
    });
    test("input with type number and value `true` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "true");
        let inputs = populateInputConfigValues([input]);
        expect(() => parseInputs(HelmSubcommand.All, inputs)).toThrow();
    });
    test("input with type string and value `testString` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[2];
        setEnvVar(input.name, "testString");
        let inputs = populateInputConfigValues(PARSE_INPUTS_CONFIG);
        inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe("testString");
    });
});

describe("testing helper#validateReleaseName", () => {
    test("subcommand.ALL should throw when nothing is set", () => {
        let inputs = parseInputs(HelmSubcommand.All, []);
        const subcommand = HelmSubcommand.All;

        expect(() => validateReleaseName(subcommand, inputs)).toThrow();
    });
    test("subcommand.ALL should throw when generate name and release name are set", () => {
        setEnvVar("release_name", "test");
        setEnvVar("generate_name", "true");
        let inputs = populateInputConfigValues(VALIDATE_NAME_INPUTS_CONFIG);
        inputs = parseInputs(HelmSubcommand.All, inputs);
        const subcommand = HelmSubcommand.All;

        expect(() => validateReleaseName(subcommand, inputs)).toThrow();
    });
    test("subcommand.ALL should succeed when generate name is set (not release name)", () => {
        setEnvVar("generate_name", "true");
        let inputs = populateInputConfigValues(VALIDATE_NAME_INPUTS_CONFIG);
        inputs = parseInputs(HelmSubcommand.All, inputs);
        const subcommand = HelmSubcommand.All;

        validateReleaseName(subcommand, inputs);
    });
    test("subcommand.ALL should succeed when release name is set (not generate name)", () => {
        setEnvVar("release_name", "test");
        let inputs = populateInputConfigValues(VALIDATE_NAME_INPUTS_CONFIG);
        inputs = parseInputs(HelmSubcommand.All, inputs);
        const subcommand = HelmSubcommand.All;

        validateReleaseName(subcommand, inputs);
    });
});

describe("testing helper#sortInputs", () => {
    test("inputs should be sorted by priority", () => {
        let inputs = populateInputConfigValues(SORT_INPUTS_CONFIG);
        inputs = sortInputs(inputs);

        expect(inputs[0].value.priority).toBe(3);
        expect(inputs[1].value.priority).toBe(2);
        expect(inputs[2].value.priority).toBe(1);
    });
});

describe("testing helper#parseValueByType", () => {
    test("boolean input with value undefined should be false", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = undefined;
        expect(parseInputs(HelmSubcommand.All, [input])[0].value.value).toBe(false);
    });
    test("boolean input with value false should be false", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = false;
        expect(parseInputs(HelmSubcommand.All, [input])[0].value.value).toBe(false);
    });
    test("boolean input with value true should be true", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = true;
        expect(parseInputs(HelmSubcommand.All, [input])[0].value.value).toBe(true);
    });
    test("boolean input with value 1 should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = 1;
        expect(() => parseInputs(HelmSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("number input with value 1 should be 1", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = 1;
        expect(parseInputs(HelmSubcommand.All, [input])[0].value.value).toBe(1);
    });
    test("number input with value 'ads' should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = "ads";
        expect(() => parseInputs(HelmSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("number input with value 'true' should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = true;
        expect(() => parseInputs(HelmSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("string input with value 'true' should return 'true'", () => {
        let input = <GithubActionInputEntry>findInputConfig("string", PARSE_INPUTS_CONFIG);
        input.value.value = "true";
        expect(parseInputs(HelmSubcommand.All, [input])[0].value.value).toBe("true");
    });
});

describe("testing helper#isHelpOutput", () => {
    test("should be help output if no args are passed", () => {
        const stdout = executeHelm("");

        expect(isHelpOutput(stdout)).toBe(true);
    });
    test("should not be help output if an empty string is passed", () => {
        expect(isHelpOutput("")).toBe(false);
    });
});

describe("testing helper#getInputsByType", () => {
    test("should return only boolean", () => {
        expect(getInputsByType(GithubActionInputType.Boolean, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.Boolean);
    });
    test("should return only number", () => {
        expect(getInputsByType(GithubActionInputType.Number, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.Number);
    });
    test("should return only string", () => {
        expect(getInputsByType(GithubActionInputType.String, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.String);
    });
    test("should return only file", () => {
        expect(getInputsByType(GithubActionInputType.File, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.File);
    });
});

describe("testing helper#inputsForHelmFlags", () => {
    test("check that ref is treated as value only", () => {
        let input = <GithubActionInputEntry>findInputConfig("ref", FLAGS_INPUTS_CONFIG);
        input.value.value = "test";
        expect(inputsToHelmFlags([input])[0]).toBe("test")
    });
    test("check that revision is treated as value only", () => {
        let input = <GithubActionInputEntry>findInputConfig("revision", FLAGS_INPUTS_CONFIG);
        input.value.value = "test";
        expect(inputsToHelmFlags([input])[0]).toBe("test")
    });
    test("check that release_name is treated as value only", () => {
        let input = <GithubActionInputEntry>findInputConfig("release_name", FLAGS_INPUTS_CONFIG);
        input.value.value = "test";
        expect(inputsToHelmFlags([input])[0]).toBe("test")
    });
    test("check that truthy boolean is converted to a flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("atomic", FLAGS_INPUTS_CONFIG);
        input.value.value = true;
        expect(inputsToHelmFlags([input])[0]).toBe("--atomic")
    });
    test("check that falsy boolean is not converted to a flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("atomic", FLAGS_INPUTS_CONFIG);
        input.value.value = false;
        expect(inputsToHelmFlags([input])).toStrictEqual([])
    });
    test("check that number is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("timeout", FLAGS_INPUTS_CONFIG);
        input.value.value = 60;
        expect(inputsToHelmFlags([input])[0]).toBe("--timeout=60")
    });
    test("check that string is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("namespace", FLAGS_INPUTS_CONFIG);
        input.value.value = "asd";
        expect(inputsToHelmFlags([input])[0]).toBe("--namespace=asd")
    });
    test("check that string is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = "/tmp/asd";
        expect(inputsToHelmFlags([input])[0]).toBe("--kubeconfig=/tmp/asd")
    });
});

describe("testing helper#handleFileInputs", () => {
    test("existing file should be treated as a file", () => {
        const path = "testHandleFileInputs";
        fs.writeFileSync(path, "");
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = path;

        input = handleFileInputs([input])[0];
        expect(input.value.value).toBe(path);
        fs.unlinkSync(path);
    });
    test("existing file should be treated as a file", () => {
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = "test123asd";

        input = handleFileInputs([input])[0];
        const content = fs.readFileSync(input.value.value).toString();
        expect(content).toBe("test123asd");
        cleanupFiles([input]);
    });
});
