const isArray = Array.isArray;
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const publicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.vnode.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers);
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.vnode.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    //patch
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(vnode, instance, container);
}
function setupRenderEffect(vnode, instance, container) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
    //subTree -> el
    vnode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    if (isArray(vnode.children)) {
        mountChildren(vnode, el);
    }
    else {
        el.textContent = vnode.children;
    }
    //props
    const props = vnode.props;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //component to vnode
            const vnode = createVnode(rootComponent);
            const container = document.querySelector(rootContainer);
            render(vnode, container);
        }
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
