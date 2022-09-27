export class Popup {
  #activeClass = "active"
  #offset = {
    top: 10,
    left: -10,
    right: 0,
    bottom: 0
  }

  #triggers = []
  #hooks = {
    closed: () => {},
    opened: () => {}
  }

  #floatElement = null
  #body = null
  #position = {}

  constructor(trigger, body, options = {}) {
    if (Array.isArray(trigger)) {
      this.#triggers = trigger.map(selector => document.querySelector(selector))
    } else {
      this.#triggers = [document.querySelector(trigger)]
    }

    this.#body = document.querySelector(body)

    const {floatElement = null, ..._options} = options

    this.#floatElement = document.querySelector(floatElement) ?? this.#triggers[0]

    if (_options.offset) {
      Object.assign(this.#offset, _options.offset)
    }

    if (_options.hooks) {
      Object.assign(this.#hooks, _options.hooks)
    }

    this.#bind()
  }

  get #isOpened() {
    return this.#body.classList.contains(this.#activeClass)
  }

  open() {
    this.#calculatePosition()
    this.#body.classList.add(this.#activeClass)

    this.#hooks.opened()
  }

  close(node) {
    this.#body.classList.remove(this.#activeClass)

    this.#body.style = {}
    this.#position = {}

    this.#hooks.closed(node)
  }


  #calculatePosition() {
    const rect = this.#floatElement.getBoundingClientRect()

    const bodyWidth = document.body.clientWidth
    const contentWidth = this.#body.clientWidth

    const top = rect.top + this.#offset.top
    const left = (bodyWidth >= (rect.right + this.#offset.left + contentWidth))
      ? rect.right + this.#offset.left
      : rect.left - this.#body.clientWidth + this.#offset.right

    Object.assign(this.#position, {top, left})

    for (const key in this.#position) {
      this.#body.style[key] = `${this.#position[key]}px`
    }
  }

  /** Handlers **/

  #handleResize = () => {
    if (this.#isOpened) {
      this.#calculatePosition()
    }
  }

  #handleClick = (evt) => {
    if (!this.#isOpened) {
      if (this.#triggers.includes(evt.target.closest(".trigger"))) {
        this.open()
      }
      return
    }

    if (
      (evt.target.closest(".popup") !== this.#body || !evt.target.closest(".popup")) ||
      this.#triggers.includes(evt.target.closest(".trigger"))
    ) {
      this.close(evt.target)
    }
  }

  #bind() {
    document.addEventListener("click", this.#handleClick)
    window.addEventListener("resize", this.#handleResize)
  }
}
