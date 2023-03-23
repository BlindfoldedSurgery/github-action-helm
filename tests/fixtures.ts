import { HelmSubcommand, GithubActionInputType, GithubActionInputEntry } from "../src/models";
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "../src/input_definitions";

export function findInputConfig(name: string): GithubActionInputEntry | undefined {
    return GITHUB_ACTIONS_INPUT_CONFIGURATION.find((entry: GithubActionInputEntry) => {
        return entry.name === name;
    });
}

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

export const VALIDATE_NAME_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: 'generate_name',
        value: {
            description: '',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    }, {
        name: 'release_name',
        value: {
            description: '',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    }
]

export const SORT_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: '2',
        value: {
            description: '',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Boolean,
            priority: 2,
        },
    }, {
        name: '1',
        value: {
            description: '',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
            priority: 1,
        },
    }, {
        name: '3',
        value: {
            description: '',
            required: false,
            default: '',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
            priority: 3,
        },
    }
];
