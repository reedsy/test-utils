var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { expectError, expectType } from './index';
import { defineComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { shallowMount } from '../src';
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
// accept props
// vm is properly typed
expectType(shallowMount(AppWithDefine, {
    props: { a: 'Hello', b: 2 }
}).vm.a);
// allow extra props, like using `h()`
shallowMount(AppWithDefine, {
    props: { a: 'Hello', c: 2 }
});
expectError(shallowMount(AppWithDefine, {
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
// accept props
// vm is properly typed
expectType(shallowMount(AppWithProps, {
    props: { a: 'Hello' }
}).vm.a);
// allow extra props, like using `h()`
shallowMount(AppWithProps, {
    props: { a: 'Hello', b: 2 }
});
expectError(shallowMount(AppWithProps, {
    // @ts-expect-error wrong prop type should not compile
    props: { a: 2 }
}));
const AppWithArrayProps = {
    props: ['a'],
    template: ''
};
// accept props
// vm is properly typed
expectType(shallowMount(AppWithArrayProps, {
    props: { a: 'Hello' }
}).vm.a);
// can receive extra props
// as they are declared as `string[]`
shallowMount(AppWithArrayProps, {
    props: { a: 'Hello', b: 2 }
});
const AppWithoutProps = {
    template: ''
};
// allow extra props, like using `h()`
shallowMount(AppWithoutProps, {
    props: { b: 'Hello' }
});
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
expectError(shallowMount(ClassComponent, {}).vm.changeMessage());
shallowMount(ClassComponent, {}).vm.changeMessage('');
