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
    }, 0)
  }
}

//防抖
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