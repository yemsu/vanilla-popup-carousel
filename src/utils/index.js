 
export const domSetActiveIndex = (parentNode, className, activeIndex) => {
  const elements = parentNode.querySelectorAll(className)
  const activeElement = parentNode.querySelector(`${className}.active`)
  activeElement && activeElement.classList.remove('active')
  elements[activeIndex].classList.add('active')
}
export const checkLoad = (elem) => {
  return new Promise((resolve, reject) => {
    elem.onload = () => resolve(true)
    elem.onerror = reject
  })
}
export const newElement = (tagName, className) => {
  const newElement = document.createElement(tagName)
  newElement.classList.add(className)
  return newElement
}