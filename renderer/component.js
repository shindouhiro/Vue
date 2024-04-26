const vnode = {
  tag: MyComponent
}


function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountEment(vnode, container)
  } else if (typeof vnode.tag === 'function') {
    mountComponent(vnode, container)
  } else if (typeof vnode.tag === 'object') {
    mountComponent(vnode, container)
  }
}

function mountEment(vnode, container) {
  const el = document.createElement(vnode.type)
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListner(key.slice(2).toLowerCase(), vnode.props[key])
    }
  }

  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}

function mountComponent(vnode, container) {
  const subtree = vnode.tag()
  renderder(subtree, container)
}
