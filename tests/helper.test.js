"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../src/helper");
const fixtures_1 = require("./fixtures");
const models_1 = require("../src/models");
function setEnvVar(inputName, value) {
    const name = `INPUT_${inputName.toLocaleUpperCase()}`;
    process.env[name] = value;
}
describe("testing index#getPriority", () => {
    test("should return 0 when priority is undefined", () => {
        let input = fixtures_1.PARSE_INPUTS_CONFIG[0];
        input.value.priority = undefined;
        expect((0, helper_1.getPriority)(input)).toBe(0);
    });
    test("should return priority when priority is defined", () => {
        let input = fixtures_1.PARSE_INPUTS_CONFIG[0];
        input.value.priority = 1;
        expect((0, helper_1.getPriority)(input)).toBe(1);
    });
});
describe("testing index#parseInputs", () => {
    test("input with type boolean and value `true` should return the correct result", () => {
        let input = fixtures_1.PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "true");
        let inputs = (0, helper_1.parseInputs)(models_1.HelmSubcommand.All, [input]);
        expect(inputs[0].value.value).toBe(true);
    });
    test("input with type boolean and value `false` should return the correct result", () => {
        let input = fixtures_1.PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "false");
        let inputs = (0, helper_1.parseInputs)(models_1.HelmSubcommand.All, [input]);
        expect(inputs[0].value.value).toBe(false);
    });
});
