"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSE_INPUTS_CONFIG = void 0;
const models_1 = require("../src/models");
exports.PARSE_INPUTS_CONFIG = [
    {
        name: 'boolean',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [models_1.HelmSubcommand.All],
            type: models_1.GithubActionInputType.Boolean,
        },
    }, {
        name: 'number',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [models_1.HelmSubcommand.All],
            type: models_1.GithubActionInputType.Number,
        },
    }, {
        name: 'string',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [models_1.HelmSubcommand.All],
            type: models_1.GithubActionInputType.String,
        },
    }, {
        name: 'time',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [models_1.HelmSubcommand.All],
            type: models_1.GithubActionInputType.Time,
        },
    }, {
        name: 'file',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [models_1.HelmSubcommand.All],
            type: models_1.GithubActionInputType.File,
        },
    },
];
