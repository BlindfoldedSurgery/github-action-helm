# github-action-helm

This action simplifies interaction with the helm command in a github action.

Any input which helm interacts with as a file (e.g. `kubeconfig`) will be written into a temporary file, this action will validate that the file is not empty. If the value is an existing path that file will be used.

## Example

examples can be found in the `examples/` directory

```yaml
deploy:
  name: "Publish to k8s"
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: install helm chart
      uses: BlindfoldedSurgery/github-action-helm@v0.1.0
      with:
        subcommand: upgrade
        ref: .
        release_name: test
        namespace: testns
        atomic: true
        install: true
        kubeconfig: ${{ secrets.KUBECONFIG_RAW }}
```

This results in the following output:

```bash
handle value from kubeconfig as file content (generating temporary file)
executing helm upgrade test . --kubeconfig=/tmp/VOhIOencxNL2KVCOiYkSnb46aNspaicSs1iEdRnmxtUIlQ6qbPFWBZ74DrAk8Box --namespace=testns --output=table --timeout=5m0s
Release "test" has been upgraded. Happy Helming!
NAME: test
LAST DEPLOYED: Thu Mar  2 18:49:48 2023
NAMESPACE: testns
STATUS: deployed
REVISION: 19
TEST SUITE: None

```


## Requirements

This action assumes that helm is already installed in the github action, this is the case for the default (ubuntu) image, see https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md#package-management for the helm version.

If you require a different helm version you should install this yourself before running this action, see [Installing Helm](https://helm.sh/docs/intro/install/)

## Support

> Note: There is a `raw_command` input which you can pass any subcommand/flags to, it will simply append the input to the helm binary (`helm {raw_command}`)

> Note: There is no interal list for supported commands, this list is simply commands which have the flags implemented and have been tested, it's likely better to use `raw_command` if you want to use a subcommand which isn't checked in this list.

currently the following subcommands are supported/tested:

- [x] install
- [x] lint
- [x] rollback
- [x] uninstall
- [x] upgrade
- [ ] create
- [ ] dependency
- [ ] diff
- [ ] get
- [ ] history
- [ ] list
- [ ] package
- [ ] plugin
- [ ] pull
- [ ] push
- [ ] registry
- [ ] repo
- [ ] show
- [ ] status
- [ ] template
- [ ] test
- [ ] verify

unimplemented flags:

- post-renderer
- post-renderer-args
- set-file with multiple arguments

### Unsupported actions

Some flags/subcommands aren't/won't be supported due to them not making sense in a CI/CD environment


#### subcommands

- completions
- env
- help
- search
- version

#### flags

- help
- repository-cache

## GHA Notes

[Creating a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)

The `node_modules` folder is [supposed to be in this repository](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github).

This means that renovate-bot can't really be used here without manual intervention, `node_modules` updates will be pushed to the renovate branch and merged into `master` afterwards.
