import { isObjectComponent } from '../utils';
const noop = () => { };
export function createStubDirectivesTransformer({ directives = {} }) {
    if (Object.keys(directives).length === 0) {
        return (type) => type;
    }
    return function directivesTransformer(type) {
        if (isObjectComponent(type) && type.directives) {
            // We want to change component types as rarely as possible
            // So first we check if there are any directives we should stub
            const directivesToPatch = Object.keys(type.directives).filter((key) => key in directives);
            if (!directivesToPatch.length) {
                return type;
            }
            const replacementDirectives = Object.fromEntries(directivesToPatch.map((name) => {
                const directive = directives[name];
                return [name, typeof directive === 'boolean' ? noop : directive];
            }));
            return Object.assign(Object.assign({}, type), { directives: Object.assign(Object.assign({}, type.directives), replacementDirectives) });
        }
        return type;
    };
}
