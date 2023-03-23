import { getPriority, parseInputs, populateInputConfigValues } from "../src/helper";
import { PARSE_INPUTS_CONFIG } from "./fixtures";
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
        populateInputConfigValues(PARSE_INPUTS_CONFIG);
        let inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe(true);
    });
    test("input with type boolean and value `false` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "false");
        populateInputConfigValues(PARSE_INPUTS_CONFIG);
        let inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe(false);
    });
    test("input with type boolean and value `1` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "1");
        populateInputConfigValues(PARSE_INPUTS_CONFIG);

        expect(() => parseInputs(HelmSubcommand.All, [input])).toThrow();
    });
    test("input with type number and value `1` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "1");
        populateInputConfigValues(PARSE_INPUTS_CONFIG);
        let inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe(1);
    });
    test("input with type number and value `testString` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "testString");
        populateInputConfigValues(PARSE_INPUTS_CONFIG);
        expect(() => parseInputs(HelmSubcommand.All, [input])).toThrow();
    });
    test("input with type string and value `testString` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[2];
        setEnvVar(input.name, "testString");
        populateInputConfigValues(PARSE_INPUTS_CONFIG);
        let inputs = parseInputs(HelmSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe("testString");
    });
});