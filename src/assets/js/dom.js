export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(" ");
  newClass.push(className);
  el.className = newClass.join(" ");
}
export function hasClass(el, className) {
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.calssName);
}

export function getData(el, name, val) {
  //获取或者设置自定义data
  const prefix = "data-";
  name = prefix + name;
  if (val) {
    //有val为设置
    return el.setAttribute(name, val);
  } else {
    //获取
    return el.getAttribute(name);
  }
}
