import { HelmSubcommand, GithubActionInputType, GithubActionInputEntry } from "../src/models";

export const PARSE_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: 'boolean',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    }, {
        name: 'number',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Number,
        },
    }, {
        name: 'string',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    }, {
        name: 'time',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Time,
        },
    }, {
        name: 'file',
        value: {
            description: 'client-side default throttling limit (default 100)',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
]