//节流
function rafThrottle(fn) {
  let lock = false;
  return function (...args) {
    if (lock)
      return
    lock = true
    setTimeout(() => {
      fn.apply(this, args)
      lock = false
    }, 5000)
  }
}

//防抖 —— 只有过了一定间隔才会触发，你如果在cd时再触发，会继续刷新
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export { rafThrottle, debounce }