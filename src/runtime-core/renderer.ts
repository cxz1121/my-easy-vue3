import { isArray, isObject } from '../shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  //patch

  patch(vnode, container)
}

function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(vnode, instance, container)
}

function setupRenderEffect(vnode, instance, container) {
  const subTree = instance.render.call(instance.proxy)

  patch(subTree, container)

  //subTree -> el
  vnode.el = subTree.el
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))

  if (isArray(vnode.children)) {
    mountChildren(vnode, el)
  } else {
    el.textContent = vnode.children
  }
  //props
  const props = vnode.props
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}
