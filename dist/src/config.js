class Pluggable {
    constructor() {
        this.installedPlugins = [];
    }
    install(handler, options) {
        if (typeof handler !== 'function') {
            console.error('plugin.install must receive a function');
            handler = () => ({});
        }
        this.installedPlugins.push({ handler, options });
    }
    extend(instance) {
        const invokeSetup = ({ handler, options }) => {
            return handler(instance, options); // invoke the setup method passed to install
        };
        const bindProperty = ([property, value]) => {
            // eslint-disable-next-line no-extra-semi
            ;
            instance[property] =
                typeof value === 'function' ? value.bind(instance) : value;
        };
        const addAllPropertiesFromSetup = (setupResult) => {
            setupResult = typeof setupResult === 'object' ? setupResult : {};
            Object.entries(setupResult).forEach(bindProperty);
        };
        this.installedPlugins.map(invokeSetup).forEach(addAllPropertiesFromSetup);
    }
    /** For testing */
    reset() {
        this.installedPlugins = [];
    }
}
export const config = {
    global: {
        stubs: {
            transition: true,
            'transition-group': true
        },
        provide: {},
        components: {},
        config: {},
        directives: {},
        mixins: [],
        mocks: {},
        plugins: [],
        renderStubDefaultSlot: false
    },
    plugins: {
        VueWrapper: new Pluggable(),
        DOMWrapper: new Pluggable()
    }
};
