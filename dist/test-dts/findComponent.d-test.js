import { expectType } from './index';
import { defineComponent } from 'vue';
import { mount } from '../src';
const FuncComponent = () => 'hello';
const ComponentToFind = defineComponent({
    props: {
        a: {
            type: String,
            required: true
        }
    },
    template: ''
});
const ComponentWithEmits = defineComponent({
    emits: {
        hi: () => true
    },
    props: [],
    template: ''
});
const AppWithDefine = defineComponent({
    template: ''
});
const wrapper = mount(AppWithDefine);
// find by type - component definition
const componentByType = wrapper.findComponent(ComponentToFind);
expectType(componentByType);
// find by type - component definition with emits
const componentWithEmitsByType = wrapper.findComponent(ComponentWithEmits);
expectType(componentWithEmitsByType);
// find by type - functional
const functionalComponentByType = wrapper.findComponent(FuncComponent);
expectType(functionalComponentByType);
// find by string
const componentByString = wrapper.findComponent('.foo');
expectType(componentByString);
// findi by string with specifying component
const componentByStringWithParam = wrapper.findComponent('.foo');
expectType(componentByStringWithParam);
const functionalComponentByStringWithParam = wrapper.findComponent('.foo');
expectType(functionalComponentByStringWithParam);
// find by ref
const componentByRef = wrapper.findComponent({ ref: 'foo' });
expectType(componentByRef);
// find by ref with specifying component
const componentByRefWithType = wrapper.findComponent({
    ref: 'foo'
});
expectType(componentByRefWithType);
// find by name
const componentByName = wrapper.findComponent({ name: 'foo' });
expectType(componentByName);
// find by name with specifying component
const componentByNameWithType = wrapper.findComponent({
    name: 'foo'
});
expectType(componentByNameWithType);
