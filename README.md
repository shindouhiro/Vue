## 3.2 初别渲染器
```vue
h('div','hello')  -> 渲染器 -> 真实DOM
```

```js
{
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

renderer(vnode, document.b
```

## 3.3 组件的本质
```js
{
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
```

## 3.4 模板的工作原理
+ template 解析到script
+ vdom 转 dom


## 4.1 响应式数据与副作用函数
+ 会产生副作用的函数,effect 的函数  对全局变量产生了影响
+ 响应式是obj.text重新赋值后，副作用会自动重新执行

```js
const obj = { text: 'hello world' }
function effect() {
  document.body.innerText = obj.text
}
obj.text = 'hello vue3'

```

+ 实现了响应式
  缺点:
   1.需要effeact获取副作用,不灵活,副作用名字可以任意取
```js


const bucket = new Set()

const obj = { text: 'hello world' }
const data = new Proxy(obj, {
  get(target, key) {
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }

})



function effect() {
  document.body.innerText = data.text
}

effect()
setTimeout(() => {
  data.text = 'hello vue3'
}, 1000)
```

- 解决具名副作用
    1.全局变量activeEffect

```js
let activeEffect
function effect(fn) {
  activeEffect = fn
    fn()
}
```
+ 缺点:
 1. 不存在的属性依然会触发副作用

```js

let activeEffect

const bucket = new Set()

const obj = { text: 'hello world' }
const data = new Proxy(obj, {
  get(target, key) {
    activeEffect && bucket.add(activeEffect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn && fn())
    return true
  }

})


function effect(fn) {
  activeEffect = fn
  fn && fn()
}

// function effect() {
//   document.body.innerText = data.text
// }

effect(() => {
  document.body.innerText = data.text
})
setTimeout(() => {
  data.text = 'hello vue3'
}, 1000)

setTimeout(()=> {
   data.notExist = 'hello vue3'
  },1000)
```



- 重新设置数据结构
  1. 被操作读取的代理对象obj
  2. 被操作读取的字段名text
  3. 使用effect函数注册的副作用函数effectFn
