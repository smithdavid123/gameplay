import store from '@/store';

const context = '@@permissionContext';

function handleClick(el, binding, vnode) {
    function handle(e) {
        const {
            validate,
            fn,
            args
        } = binding.value;
        if (parseInt(binding.arg, 10) === parseInt(store.getters.level, 10) || parseInt(store.getters.level, 10) >= 4) {
            try {
                validate() && fn(args);
            } catch (error) {
                fn(args);
            }
        } else {
            vnode.context.$message.error('用户无权限!');
        }
    }

    if (!el[context]) {
        el[context] = {
            removeHandle: handle
        };
    } else {
        el[context].removeHandle = handle;
    }

    return handle;
}

export default {
    bind(el, binding, vnode) {
        el.addEventListener('click', handleClick(el, binding, vnode), false);
    },
    update(el, binding, vnode) {
        el.removeEventListener('click', el[context].removeHandle, false);
        el.addEventListener('click', handleClick(el, binding, vnode), false);
    },
    unbind(el) {
        el.removeEventListener('click', el[context].removeHandle, false);
        el[context] = null;
        delete el[context];
    }
};