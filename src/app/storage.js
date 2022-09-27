export class LocalStorage {
  #key = "state";

  #state = null

  constructor(key = "state") {
    this.#key = key
    this.#state = JSON.parse(
      localStorage.getItem(this.#key)
    )
  }

  get({key, fn}) {
    if (this.#state === null) {
      return null
    }

    const value = this.#state[key] || null

    if (fn) {
      return fn(this.#state, value)
    }

    return value
  }

  set({key, value}) {
    let state = this.#state

    if (state === null) {
      state = {
        [key]: value
      }
    } else {
      state[key] = value
    }

    this.#state = state


    localStorage.setItem(
      this.#key,
      JSON.stringify(this.#state)
    )

    return this.#state
  }
}
