export function setAttribute(element, {attribute, value}) {
  if (value !== false) {
    element.setAttribute(attribute, value)
  } else {
    element.removeAttribute(attribute)
  }
}

export function classList(element, {className, predicat}) {
  if (predicat) {
    element.classList.add(className)
  } else {
    element.classList.remove(className)
  }
}

export function sort({
  container,
  elements,
  sortFn,
  eachFn} = {}
  ) {
  Array.from(elements)
    .sort((element1, element2) => {
      if (sortFn) {
        return sortFn(element1, element2)
      }
      return Number(element1.dataset.position) - Number(element2.dataset.position)
    })
    .forEach((element, idx) => {
      container.appendChild(element)
      if (eachFn) {
        eachFn(element, idx)
      }
    })
}

export class Node {
  element = null

  constructor(tag, options = {}) {
    this.element = document.createElement(tag)

    if (options.data) {
      this.element._data = options.data
    }

    const {
      attrs = {},
      on = {},
      classNames = [],
      children = []
    } = options

    for (const className of classNames) {
      if (typeof className === "string") {
        this.element.classList.add(className)
      } else {
        for (const key in className) {
          classList(this.element, {className: key, predicat: className[key]})
        }
      }
    }

    for (const attr in attrs) {
      if (attrs[attr] !== false) {
        setAttribute(this.element, {attribute: attr, value: attrs[attr]})
      }
    }

    for (const child of children) {
      this.element.appendChild(child.element || child)
    }

    for (const event in on) {
      this.element.addEventListener(event, options.on[event])
    }
  }
}
