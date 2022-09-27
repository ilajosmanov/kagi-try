export class Form {
  #formElement = null

  #editMode = false
  #values = {}

  constructor(selector, {onSubmit}) {
    this.#formElement = document.querySelector(selector)

    this.#formElement.addEventListener("submit", (event) => {
      event.preventDefault()
      onSubmit(Object.assign(this.#values, this.#getValues()), this.#editMode)

      this.#editMode = false
      this.#setButtonLabel()

      this.#formElement.reset()
      this.clear()
    })
  }

  #getValues() {
    const values = {}

    Array.from(this.#formElement.elements).forEach((element) => {
      if (element.name) {
        values[element.name] = element.value
      }
    })

    return values
  }

  #setButtonLabel() {
    this.#formElement.submit.textContent = this.#editMode ? "Save" : "Add"
  }

  #setValues(values) {
    this.#values = values

    Array.from(this.#formElement.elements).forEach((element) => {
      if (element.name && values[element.name]) {
        element.value = values[element.name]
      }
    })
  }

  fillForm(values) {
    this.#setValues(values)
    this.#editMode = true
    this.#setButtonLabel()
  }

  clear() {
    this.#editMode = false
    this.#setButtonLabel()

    this.#setValues({})
    this.#formElement.reset()
  }
}
