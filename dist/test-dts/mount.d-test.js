var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { expectError, expectType } from './index';
import { defineComponent, getCurrentInstance, h, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { mount } from '../src';
const AppWithDefine = defineComponent({
    props: {
        a: {
            type: String,
            required: true
        },
        b: Number
    },
    template: ''
});
// accept props - vm is properly typed
expectType(mount(AppWithDefine, {
    props: { a: 'Hello', b: 2 }
}).vm.a);
// accept propsData - vm is properly typed
expectType(mount(AppWithDefine, {
    propsData: { a: 'Hello', b: 2 }
}).vm.a);
// // no data provided
// expectError(
//   mount(AppWithDefine, {
//     data() {
//       return {
//         myVal: 1
//       }
//     }
//   })
// )
// allow extra props, like using `h()`
mount(AppWithDefine, {
    props: { a: 'Hello', c: 2 }
});
expectError(mount(AppWithDefine, {
    // @ts-expect-error wrong prop type should not compile
    props: { a: 2 }
}));
const AppWithProps = {
    props: {
        a: {
            type: String,
            required: true
        }
    },
    template: ''
};
// accept props - vm is properly typed
expectType(mount(AppWithProps, {
    props: { a: 'Hello' }
}).vm.a);
mount(AppWithProps, {
    props: { a: 'Hello', b: 2 }
});
expectError(mount(AppWithProps, {
    // @ts-expect-error wrong prop type should not compile
    props: { a: 2 }
}));
const AppWithArrayProps = {
    props: ['a'],
    template: ''
};
// accept props - vm is properly typed
expectType(mount(AppWithArrayProps, {
    props: { a: 'Hello' }
}).vm.a);
// can receive extra props
// as they are declared as `string[]`
expectType(mount(AppWithArrayProps, {
    props: { a: 'Hello', b: 2 }
}).vm.b);
// allow extra props, like using `h()`
mount({
    props: ['a']
}, {
    props: {
        b: 2
    }
});
const AppWithoutProps = {
    template: ''
};
// allow extra props, like using `h()`
mount(AppWithoutProps, {
    props: { b: 'Hello' }
});
// Functional tests
expectError(mount((props) => { }, {
    props: {
        // @ts-expect-error wrong props
        a: '222'
    }
}));
expectType(mount((props, ctx) => { }, {
    props: {
        a: 22
    }
}).vm.a);
// global config should accept a partial config
mount(AppWithProps, {
    props: { a: 'Hello' },
    global: {
        config: {
            isCustomElement: (tag) => true
        }
    }
});
mount(ShimComponent, {
    props: {
        msg: 1
    }
});
// TODO it should work
mount(ShimComponent, {
    data() {
        return {
            a: 1
        };
    }
});
mount(FunctionalComponent);
mount(defineComponent(FunctionalComponent));
mount(FunctionalComponentEmit);
mount(defineComponent(FunctionalComponentEmit));
// class component
let ClassComponent = class ClassComponent extends Vue {
    constructor() {
        super(...arguments);
        this.dataText = '';
    }
    get computedMsg() {
        return `Message: ${this.$props.msg}`;
    }
    changeMessage(text) {
        this.dataText = 'Updated';
    }
};
ClassComponent = __decorate([
    Options({
        props: {
            msg: String
        }
    })
], ClassComponent);
// @ts-expect-error changeMessage expects an argument
expectError(mount(ClassComponent, {}).vm.changeMessage());
mount(ClassComponent, {}).vm.changeMessage('');
// region custom class component implement
class CustomClassComponent {
    static get __vccOpts() {
        if (this.__vccValue)
            return this.__vccValue;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const CompConstructor = this;
        return (this.__vccValue = {
            name: CompConstructor.name,
            props: CompConstructor.defaultProps,
            setup(props, ctx) {
                const instance = new CompConstructor();
                return instance.render.bind(instance);
            }
        });
    }
    constructor() {
        const instance = getCurrentInstance();
        this.props = instance.props;
        // @ts-expect-error no explicit setupContext on instance
        this.context = instance.setupContext;
    }
    get $props() {
        return this.props;
    }
    render() { }
}
class NoPropCustomClassComponent extends CustomClassComponent {
    constructor() {
        super(...arguments);
        this.count = ref(0);
    }
    changeCount(count) {
        this.count.value = count;
    }
    render() {
        return h('div', `hello world ${this.count.value}`);
    }
}
// @ts-expect-error changeCount expects an argument
expectError(mount(NoPropCustomClassComponent, {}).vm.changeCount());
mount(NoPropCustomClassComponent, {}).vm.changeCount(2);
class WithPropCustomClassComponent extends CustomClassComponent {
    constructor() {
        super(...arguments);
        this.count = ref(0);
    }
    changeCount(count) {
        this.count.value = count;
    }
    render() {
        return h('div', `hello world ${this.count.value}${this.props.size}`);
    }
}
WithPropCustomClassComponent.defaultProps = ['size', 'age'];
expectError(mount(WithPropCustomClassComponent, {
    // @ts-expect-error should has props error
    props: {}
}));
mount(WithPropCustomClassComponent, {
    props: { size: 'small' }
});
// endregion
// default props
const Foo = defineComponent({
    props: {
        bar: Boolean,
        baz: String
    },
    template: ''
});
mount(Foo, {
    props: {
        baz: 'hello'
    }
});
mount(Foo, {
    props: {
        bar: true
    }
});
expectError(mount(defineComponent({
    props: {
        baz: String,
        bar: {
            type: Boolean,
            required: true
        }
    }
}), {
    // @ts-expect-error
    props: {
        baz: 'hello'
    }
}));
