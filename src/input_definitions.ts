import { GithubActionInputEntry, GithubActionInputType, HelmSubcommand } from "./models";


export const GITHUB_ACTIONS_INPUT_CONFIGURATION: GithubActionInputEntry[] = [
    {
        name: 'burst_limit',
        value: {
            description: 'client-side default throttling limit (default 100)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Number,
        },
    },
    {
        name: 'debug',
        value: {
            description: 'enable verbose output',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'kube_apiserver',
        value: {
            description: 'the address and the port for the Kubernetes API server',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'kube_as_group',
        value: {
            description: 'group to impersonate for the operation, this flag can be repeated to specify multiple groups.',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'kube_as_user',
        value: {
            description: 'username to impersonate for the operation',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'kube_ca_file',
        value: {
            description: 'the certificate authority file for the Kubernetes API server connection',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'kube_context',
        value: {
            description: 'name of the kubeconfig context to use',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'kube_insecure_skip_tls_verify',
        value: {
            description: "if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure",
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'kube_token',
        value: {
            description: 'server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'kubeconfig',
        value: {
            description: 'path to the kubeconfig file',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'namespace',
        value: {
            description: 'namespace scope for this request',
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'registry_config',
        value: {
            description: "path to the registry config file (default '$HOME/.config/helm/registry/config.json')",
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'repository_config',
        value: {
            description: "path to the file containing repository names and URLs (default '$HOME.config/helm/repositories.yaml')",
            value: undefined,
            supported_subcommands: [HelmSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'atomic',
        value: {
            description: 'if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'ca_file',
        value: {
            description: 'verify certificates of HTTPS-enabled servers using this CA bundle',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'cert_file',
        value: {
            description: 'identify HTTPS client using this SSL certificate file',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'cleanup_on_fail',
        value: {
            description: 'allow deletion of new resources created in this upgrade when upgrade fails',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Rollback],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'create_namespace',
        value: {
            description: 'create the release namespace if not present',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'dependency_update',
        value: {
            description: 'update dependencies if they are missing before installing the chart',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'description',
        value: {
            description: 'add a custom description',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Uninstall],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'devel',
        value: {
            description: "use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored",
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'disable_openapi_validation',
        value: {
            description: 'if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schem',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'dry_run',
        value: {
            description: 'simulate an install',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Uninstall, HelmSubcommand.Rollback],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'force',
        value: {
            description: 'force resource updates through a replacement strategy',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Rollback],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'generate_name',
        value: {
            description: 'generate the name (and omit the NAME parameter)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'history_max',
        value: {
            description: 'limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Rollback],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'insecure_skip_tls_verify',
        value: {
            description: 'skip tls certificate checks for the chart download',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'install',
        value: {
            description: "if a release by this name doesn't already exist, run an install",
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'keep_history',
        value: {
            description: 'remove all associated resources and mark the release as deleted, but retain the release history',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Uninstall],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'key_file',
        value: {
            description: 'identify HTTPS client using this SSL key file',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'keyring',
        value: {
            description: 'location of public keys used for verification (default "$HOME/.gnupg/pubring.gpg")',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'name_template',
        value: {
            description: 'specify template used to name the release',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Install],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'no_hooks',
        value: {
            description: 'prevent hooks from running during install',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Uninstall, HelmSubcommand.Rollback],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'output',
        value: {
            description: 'prints the output in the specified format. Allowed values: table, json, yaml (default table)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'pass_credentials',
        value: {
            description: 'pass credentials to all domains',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'password',
        value: {
            description: 'chart repository password where to locate the requested chart',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'path',
        value: {
            description: 'path to a chart repository (e.g. url, absolute or relative path)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
            priority: 10
        },
    },
    {
        name: 'quiet',
        value: {
            description: 'print only warnings and errors',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Lint],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'recreate_pods',
        value: {
            description: 'performs pods restart for the resource if applicable',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Rollback],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'ref',
        value: {
            description: 'reference to a chart repository (e.g. url, absolute or relative path)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
            priority: 10
        },
    },
    {
        name: 'release_name',
        value: {
            description: 'name of the helm release',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Rollback, HelmSubcommand.Uninstall],
            type: GithubActionInputType.String,
            priority: 11
        },
    },
    {
        name: 'render_subchart_notes',
        value: {
            description: 'if set, render subchart notes along with the parent',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'replace',
        value: {
            description: 're-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'repo',
        value: {
            description: 'chart repository URL where to locate the requested chart',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'reset_values',
        value: {
            description: 'when upgrading, reset the values to the ones built into the chart',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'reuse_values',
        value: {
            description: "when upgrading, reuse the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' is specified, this is ignored",
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'revision',
        value: {
            description: "a revision (version) number. If this argument is omitted, it will roll back to the previous release",
            value: undefined,
            supported_subcommands: [HelmSubcommand.Rollback],
            type: GithubActionInputType.Number,
        },
    },
    {
        name: 'set',
        value: {
            description: 'set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Lint],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'set_file',
        value: {
            description: 'set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Lint],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'set_json',
        value: {
            description: 'set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Lint],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'set_string',
        value: {
            description: 'set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Lint],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'skip_crds',
        value: {
            description: 'if set, no CRDs will be installed when an upgrade is performed with install flag enabled. By default, CRDs are installed if not already present, when an upgrade is performed with install flag enabled',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'strict',
        value: {
            description: 'fail on lint warnings',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Lint],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'timeout',
        value: {
            description: 'time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Uninstall, HelmSubcommand.Rollback],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'username',
        value: {
            description: 'chart repository username where to locate the requested chart',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Lint],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'values',
        value: {
            description: 'specify values in a YAML file or a URL (can specify multiple)',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String, // we handle this as a string since `File` doesn't currently support existing files
        },
    },
    {
        name: 'verify',
        value: {
            description: 'verify the package before using it',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'version',
        value: {
            description: 'chart version to install. If this is not specified, the latest version is installed.',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'wait',
        value: {
            description: 'if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Uninstall, HelmSubcommand.Rollback],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'wait_for_jobs',
        value: {
            description: 'if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout',
            value: undefined,
            supported_subcommands: [HelmSubcommand.Upgrade, HelmSubcommand.Install, HelmSubcommand.Rollback],
            type: GithubActionInputType.Boolean,
        },
    }
]