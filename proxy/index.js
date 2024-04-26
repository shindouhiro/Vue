
let activeEffect

const bucket = new WeakMap()

const obj = { text: 'hello world' }
const data = new Proxy(obj, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
    return true
  }

})


function track(target, key) {
  if (activeEffect) {
    let depsMap = bucket.get(target)
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const fns = depsMap.get(key)
  fns && fns.forEach(fn => fn())
}


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


setTimeout(() => {
  data.notExist = 'hello vue3'
}, 1000)
