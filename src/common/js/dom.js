export function addClass(el, className) {
  if (hasClass(el, className)) return
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el,name,val) {
  let prefix = 'data-'
  name = prefix + name
  if(val) {
    return el.setAttribute(name,val)
  } else {
    return el.getAttribute(name)
  }
}
let elementStyle = document.createElement('div').style

// 返回值为 key值或者布尔值
let vendor = (()=>{
  // 定义浏览器的前缀
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  // 遍历前缀，判断浏览器是否支持
  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  // 都不支持，则返回false
  return false
})()

export function prefixStyle(style) {
  if(vendor === false) {
    return false
  }
  // 如果为标准的standard，则不需要改变 style
  if(vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}