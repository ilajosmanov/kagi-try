import { events } from "./events"

import { classList, Node, setAttribute, sort } from "./lib/dom"
import { sortable } from "./lib/sortable"
import { Popup } from "./lib/popup"
import { EventEmitter } from "./emitter"
import { Form } from "./lib/form"
import { nanoid } from "nanoid"
import { faviconUrl } from "./lib/favicon"

export class EditPopup extends Popup {
  listeners = new EventEmitter()
  provider = null

  #state = null

  #body = null
  #form = null
  #isInitialRender = true

  constructor(provider) {
    super(
      [".button-customize", ".edit-menu__form-action--cancel"],
      ".edit-menu",
      {
        floatElement: ".nav__btn--more-btn",
        hooks: {
          opened: () => {
            if (this.#isInitialRender) {
              this.#form = new Form(".edit-menu__form", {
                onSubmit: (engine, isEdit) => {
                  const id = nanoid()

                  if (!isEdit) {
                    this.#state.set(id, {
                      ...engine,
                      id,
                      position: 0,
                      selected: true,
                      icon: "fallback"
                    })

                    this.#listContainer.insertBefore(
                      this.#createListItem(this.#state.get(id)),
                      this.#listContainer.firstChild
                    )

                    this.#sortNodes()
                    this.#setChanges()
                  } else {
                    const {id: _id, ...data} = engine

                    const node = this.#body.querySelector(`[data-id="${_id}"]`)

                    this.#patchNode(node, {
                      id,
                      ...data
                    })

                    this.#state.set(id, { id, ...data })
                    this.#state.delete(_id)
                    this.#setChanges()
                  }
                }
              })

              this.render()

              sortable(this.#listContainer, () => {
                this.#state = new Map(
                  Array.from(this.#listContainer.children).map((element, idx) => [element._data.id, {
                    ...this.#state.get(element._data.id),
                    position: idx
                  }])
                )

                this.#setChanges()
              })
              this.#isInitialRender = false
            } else {
              this.#syncState()
            }

            this.listeners.emit(events.OPENED)
          },
          closed: (node) => {
            const isCancelButton = node.classList.contains("edit-menu__form-action--cancel")

            if (isCancelButton) {
              this.listeners.emit(events.CLOSED)
            }

            this.#form.clear()
          }
        }
      }
    )

    this.#body = document.querySelector(".edit-menu")

    this.provider = provider
    this.provider.on(events.RECEIVED, (state) => {
      this.#state = new Map(
        state.map(engine => [engine.id, engine])
      )
    })

    document.addEventListener("click", this.#handleClick)
  }

  render() {
    Array.from(this.#state.values()).forEach(engine => {
      this.#listContainer.appendChild(this.#createListItem(engine))
    })
  }

  get #listContainer() {
    return this.#body.querySelector(".popup__section-list")
  }

  #syncState() {
    sort({
      container: this.#listContainer,
      elements: Array.from(this.#listContainer.children),
      sortFn: (element1, element2) => {
        // WARGING: NOT PURE FUNCTION
        const input1 = element1.querySelector("input")
        const input2 = element2.querySelector("input")

        const id1 = input1.dataset.id
        const id2 = input2.dataset.id

        const engine1 = this.#state.get(id1)
        const engine2 = this.#state.get(id2)

        if (engine1) {
          setAttribute(input1, {attribute: "checked", value: engine1.selected})
          setAttribute(element1, {attribute: "data-position", value: engine1.position})
          setAttribute(element1, {attribute: "draggable", value: engine1.selected})
          classList(element1, {className: "draggable", predicat: engine1.selected})
        }

        if (engine2) {
          setAttribute(input2, {attribute: "checked", value: engine2.selected})
          setAttribute(element2, {attribute: "data-position", value: engine2.position})
          setAttribute(element2, {attribute: "draggable", value: engine2.selected})
          classList(element2, {className: "draggable", predicat: engine2.selected})
        }

        return Number(element1.dataset.position) - Number(element2.dataset.position)
      }
    })
  }

  #patchNode(node, data) {
    Object.assign(node._data, data)

    const [icon, content] = node.querySelector(".popup__section-item--clickable").children

    content.textContent = data.label

    setAttribute(node, {attribute: "data-id", value: data.id})
    setAttribute(icon, {attribute: "style", value: faviconUrl(data.href)})
  }

  #createListItem(engine) {
    return new Node("li", {
      data: engine,
      classNames: ["popup__section-item", {draggable: engine.selected}],
      attrs: {
        draggable: engine.selected,
        "data-position": engine.position,
        "data-id": engine.id
      },
      children: [
        new Node("div", {
          classNames: ["popup__action"],
          children: [
            new Node("label", {
              classNames: ["checkbox"],
              children: [
                new Node("input", {
                  classNames: ["widget__checkbox", "edit-popup__checkbox", "visually-hidden"],
                  attrs: {
                    type: "checkbox",
                    checked: engine.selected,
                    "data-id": engine.id
                  }
                }),
                new Node("span")
              ]
            }),
            new Node("span", {
              classNames: ["popup__section-item--clickable"],
              children: [
                new Node("span", {
                  classNames: ["popup__icon", `popup__icon--${engine.icon}`],
                  attrs: {
                    "aria-hidden": true,
                    style: faviconUrl(engine.href)
                  }
                }),
                new Node("span", {
                  classNames: ["line-clamp-1"],
                  children: [document.createTextNode(engine.label)]
                })
              ]
            }),
            new Node("span", {
              classNames: ["popup__icon", "popup__icon--drag"],
              attrs: {
                "aria-hidden": true
              }
            }),
            new Node("button", {
              classNames: ["edit-menu__delete"],
              children: [
                new Node("span", {
                  classNames: ["popup__icon", "popup__icon--delete"],
                  attrs: {
                    "aria-hidden": true
                  }
                })
              ]
            })
          ]
        })
      ]
    }).element
  }

  #sortNodes() {
    sort({
      container: this.#listContainer,
      elements: Array.from(this.#listContainer.children),
      eachFn: (element, idx) => {
        element.dataset.position = idx
        this.#state.set(element._data.id, {
          ...this.#state.get(element._data.id),
          position: idx
        })
      }
    })
  }

  #setChanges() {
    this.provider.emit(events.UPDATE, Array.from(this.#state.values()))
  }

  /** Handlers **/

  #handleCheckbox(evt) {
    const {id} = evt.target.dataset
    const engine = {...this.#state.get(id)}

    engine.selected = !engine.selected

    setAttribute(evt.target, {
      attribute: "checked",
      value: engine.selected
    })

    setAttribute(evt.target.closest(".popup__section-item"), {
      attribute: "draggable",
      value: engine.selected
    })

    classList(evt.target.closest(".popup__section-item"), {
      className: "draggable",
      predicat: engine.selected
    })

    this.#state.set(id, engine)

    const listItem = evt.target.closest("li")
    if (!engine.selected) {
      const pos = this.#listContainer.children.length + 1
      listItem.dataset.position = pos
      listItem._data.position = pos
      this.#listContainer.appendChild(listItem)
    } else {
      const pos = 0
      listItem.dataset.position = pos
      listItem._data.position = pos
      this.#listContainer.insertBefore(listItem, this.#listContainer.firstChild)
    }

    this.#sortNodes()
    this.#setChanges()
  }

  #handleDelete(evt) {
    const {id} = evt.target.closest(".popup__action").querySelector("input").dataset
    const listItem = evt.target.closest("li")

    this.#state.delete(id)

    listItem.remove()
    this.#setChanges()
  }

  #handleSelect(element) {
    const {id} = element.closest("li").dataset

    if (id && this.#state.has(id)) {
      this.#form.fillForm(this.#state.get(id))
    }
  }

  #handleClick = (evt) => {
    evt.stopPropagation()

    const isCheckbox = evt.target.classList.contains("edit-popup__checkbox")
    const isDelete = evt.target.closest(".edit-menu__delete")
    const isClickable = evt.target.closest(".popup__section-item--clickable")

    if (isCheckbox) {
      this.#handleCheckbox(evt)
      return
    }

    if (isDelete) {
      this.#handleDelete(evt)
      return
    }

    if (isClickable) {
      this.#handleSelect(isClickable)
    }
  }
}
