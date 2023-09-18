var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineComponent, h, computed } from 'vue';
// match return type of router.resolve: RouteLocation & { href: string }
const defaultRoute = {
    path: '/',
    name: undefined,
    redirectedFrom: undefined,
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    href: '/'
};
// TODO: Borrow typings from vue-router-next
export const RouterLinkStub = defineComponent({
    name: 'RouterLinkStub',
    compatConfig: { MODE: 3 },
    props: {
        to: {
            type: [String, Object],
            required: true
        },
        custom: {
            type: Boolean,
            default: false
        }
    },
    render() {
        var _a, _b;
        const route = computed(() => defaultRoute);
        // mock reasonable return values to mimic vue-router's useLink
        const children = (_b = (_a = this.$slots) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.call(_a, {
            route,
            href: computed(() => route.value.href),
            isActive: computed(() => false),
            isExactActive: computed(() => false),
            navigate: () => __awaiter(this, void 0, void 0, function* () { })
        });
        return this.custom ? children : h('a', undefined, children);
    }
});
