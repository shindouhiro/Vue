const vnode = {
  tag: 'div',
  props: {
    onClick: () => alert('hello')
  },
  children: [
    {
      tag: 'span',
      props: {
        id: 'app'
      },
      children: 'good'
    }
  ]
}

function renderer(vnode, container) {
  const el = document.createElement(vnode.tag)
  // 事件
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(),
        vnode.props[key]
      )
    }
  }
  //children
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}

renderer(vnode, document.body)
