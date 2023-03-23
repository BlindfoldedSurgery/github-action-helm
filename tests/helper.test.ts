import { getPriority, parseInputs, populateInputConfigValues, validateReleaseName } from "../src/helper";
import { PARSE_INPUTS_CONFIG, findInputConfig, VALIDATE_NAME_INPUTS_CONFIG } from "./fixtures";
import { HelmSubcommand } from "../src/models";

function setEnvVar(inputName: string, value: string) {
    const name = `INPUT_${inputName.toLocaleUpperCase()}`;
    process.env[name] = value;
}

describe("testing index#getPriority", () => {
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

describe("testing index#parseInputs", () => {
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
    test("input with type string and value `testString` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[2];
        setEnvVar(input.name, "testString");
        let inputs = populateInputConfigValues(PARSE_INPUTS_CONFIG);
        inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe("testString");
    });
});

describe("testing index#validateReleaseName", () => {
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
});