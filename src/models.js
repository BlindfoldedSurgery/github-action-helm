"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubActionInputType = exports.HelmSubcommand = void 0;
var HelmSubcommand;
(function (HelmSubcommand) {
    HelmSubcommand["All"] = "all";
    HelmSubcommand["Install"] = "install";
    HelmSubcommand["Upgrade"] = "upgrade";
    HelmSubcommand["None"] = "";
})(HelmSubcommand = exports.HelmSubcommand || (exports.HelmSubcommand = {}));
var GithubActionInputType;
(function (GithubActionInputType) {
    GithubActionInputType["Number"] = "number";
    GithubActionInputType["String"] = "string";
    GithubActionInputType["Time"] = "time";
    GithubActionInputType["File"] = "file";
    GithubActionInputType["Boolean"] = "boolean";
})(GithubActionInputType = exports.GithubActionInputType || (exports.GithubActionInputType = {}));
