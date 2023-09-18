var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { expectError, expectType } from './index';
import { defineComponent } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { renderToString } from '../src';
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
let html = renderToString(AppWithDefine, {
    props: { a: 'Hello', b: 2 }
});
// html is properly typed
expectType(html);
// allow extra props, like using `h()`
renderToString(AppWithDefine, {
    props: { a: 'Hello', c: 2 }
});
expectError(renderToString(AppWithDefine, {
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
expectType(renderToString(AppWithProps, {
    props: { a: 'Hello' }
}));
// allow extra props, like using `h()`
renderToString(AppWithProps, {
    props: { a: 'Hello', b: 2 }
});
expectError(renderToString(AppWithProps, {
    // @ts-expect-error wrong prop type should not compile
    props: { a: 2 }
}));
const AppWithArrayProps = {
    props: ['a'],
    template: ''
};
// accept props
html = renderToString(AppWithArrayProps, {
    props: { a: 'Hello' }
});
expectType(html);
// can receive extra props
// as they are declared as `string[]`
renderToString(AppWithArrayProps, {
    props: { a: 'Hello', b: 2 }
});
const AppWithoutProps = {
    template: ''
};
// allow extra props, like using `h()`
html = renderToString(AppWithoutProps, {
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
expectType(renderToString(ClassComponent));
// No `attachTo` mounting option
expectError(renderToString(AppWithProps, {
    // @ts-expect-error should not have attachTo mounting option
    attachTo: 'body'
}));
