import { expectError } from './index';
import { config } from '../src';
function PluginWithOptions(wrapper, options) {
    return {};
}
function PluginWithoutOptions(wrapper) {
    return {};
}
function PluginWithOptionalOptions(wrapper, options = { msg: 'hi' }) {
    return {};
}
function PluginWithOptionalOptions2(wrapper, options) {
    return {};
}
config.plugins.VueWrapper.install(PluginWithOptions, { msg: 'Hello' });
config.plugins.VueWrapper.install(PluginWithoutOptions);
config.plugins.VueWrapper.install(PluginWithOptionalOptions);
config.plugins.VueWrapper.install(PluginWithOptionalOptions2);
config.plugins.VueWrapper.install(PluginWithOptionalOptions, { msg: 'hello' });
config.plugins.VueWrapper.install(PluginWithOptionalOptions2, { msg: 'hello' });
// uncertain if it is possible to forbid this usage
// expectError(config.plugins.VueWrapper.install(PluginWithoutOptions, {}))
// @ts-expect-error option has the wrong type
expectError(config.plugins.VueWrapper.install(PluginWithOptions, { msg: true }));
// @ts-expect-error option is mandatory
expectError(config.plugins.VueWrapper.install(PluginWithOptions, {}));
// @ts-expect-error option is mandatory
expectError(config.plugins.VueWrapper.install(PluginWithOptionalOptions, {}));
// @ts-expect-error option is mandatory
expectError(config.plugins.VueWrapper.install(PluginWithOptionalOptions2, {}));
