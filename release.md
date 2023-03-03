Adds support for `uninstall`

Several bugfixes for how inputs are handled.

This now validates that only supported input parameters are passed to a command (e.g. `atomic` can't be passed to `uninstall`)