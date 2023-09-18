import { expectType } from './index';
import { defineComponent } from 'vue';
import { mount } from '../src';
const AppWithDefine = defineComponent({
    template: ''
});
const wrapper = mount(AppWithDefine);
const domWrapper = wrapper.find('#other');
// find Vue wrapper
// HTML element selector
let inputMaybe = wrapper.find('input');
expectType(inputMaybe.element);
// SVG element selector
let lineMaybe = wrapper.find('line');
expectType(lineMaybe.element);
// string selector
let byClassMaybe = wrapper.find('.todo');
expectType(byClassMaybe.element);
// find DOM wrapper
// HTML element selector
inputMaybe = domWrapper.find('input');
expectType(inputMaybe.element);
// SVG element selector
lineMaybe = domWrapper.find('line');
expectType(lineMaybe.element);
// string selector
byClassMaybe = domWrapper.find('.todo');
expectType(byClassMaybe.element);
// findAll
// HTML element selector
let inputArray = wrapper.findAll('input');
expectType(inputArray[0].element);
// SVG element selector
let lineArray = wrapper.findAll('line');
expectType(lineArray[0].element);
// string selector
let byClassArray = wrapper.findAll('.todo');
expectType(byClassArray[0].element);
// findAll DOM wrapper
// HTML element selector
inputArray = domWrapper.findAll('input');
expectType(inputArray[0].element);
// SVG element selector
lineArray = domWrapper.findAll('line');
expectType(lineArray[0].element);
// string selector
byClassArray = domWrapper.findAll('.todo');
expectType(byClassArray[0].element);
// emitted
// event name without specific type
let incrementEventWithoutType = wrapper.emitted('increment');
expectType(incrementEventWithoutType);
// event name
let incrementEvent = wrapper.emitted('increment');
expectType(incrementEvent);
expectType(incrementEvent[0]);
// without event name
let allEvents = wrapper.emitted();
expectType(allEvents);
// get
// HTML element selector
let input = wrapper.get('input');
expectType(input.element);
// SVG element selector
let line = wrapper.get('line');
expectType(line.element);
// string selector
let byClass = wrapper.get('.todo');
expectType(byClass.element);
// get DOM wrapper
// HTML element selector
input = domWrapper.get('input');
expectType(input.element);
// SVG element selector
line = domWrapper.get('line');
expectType(line.element);
// string selector
byClass = domWrapper.get('.todo');
expectType(byClass.element);
// attributes
expectType(wrapper.attributes());
expectType(wrapper.attributes('key'));
expectType(domWrapper.attributes());
expectType(domWrapper.attributes('key'));
// classes
expectType(wrapper.classes());
expectType(wrapper.classes('class'));
expectType(domWrapper.classes());
expectType(domWrapper.classes('class'));
// props
expectType(wrapper.props());
const ComponentWithProps = defineComponent({
    props: {
        foo: String,
        bar: Number,
    },
});
const propsWrapper = mount(ComponentWithProps);
propsWrapper.setProps({ foo: 'abc' });
propsWrapper.setProps({ foo: 'abc', bar: 123 });
// @ts-expect-error :: should require string
propsWrapper.setProps({ foo: 123 });
// @ts-expect-error :: unknown prop
propsWrapper.setProps({ badProp: true });
expectType(propsWrapper.props().foo);
expectType(propsWrapper.props().bar);
// @ts-expect-error :: unknown prop
expectType(propsWrapper.props().badProp);
expectType(propsWrapper.props('foo'));
expectType(propsWrapper.props('bar'));
// @ts-expect-error :: unknown prop
expectType(propsWrapper.props('badProp'));
