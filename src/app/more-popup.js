import { events } from "./events"
import { Popup } from "./lib/popup"
import { Node, setAttribute, sort } from "./lib/dom"
import { faviconUrl } from "./lib/favicon"

export class MorePopup extends Popup {
  #state = []
  #map = null

  #body = null

  constructor(provider) {
    super(
      ".nav__btn--more-btn",
      ".search-menu",
      {
        hooks: {
          opened: () => {
            this.#syncState()
          }
        }
      }
    )

    this.#body = document.querySelector(".search-menu")

    provider.on(events.RECEIVED, (state) => {
      this.#state = state

      this.#map = new Map(
        this.#state.map(engine => [engine.id, engine])
      )
    })
  }

  #syncState() {
    this.#state
      .filter(engine => engine.selected && this.#body.querySelector(`li[data-id="${engine.id}"]`) === null)
      .forEach(engine => {
        this.#listContainer.appendChild(this.#createListItem(engine))
      })

    sort({
      container: this.#listContainer,
      elements: Array.from(this.#listContainer.children),
      sortFn: (element1, element2) => {
        // WARGING: NOT PURE FUNCTION
        const id1 = element1.dataset.id
        const id2 = element2.dataset.id

        const engine1 = this.#map.get(id1)
        const engine2 = this.#map.get(id2)

        if (engine1) {
          setAttribute(element1, {attribute: "data-position", value: engine1.position})
        }

        if (engine2) {
          setAttribute(element2, {attribute: "data-position", value: engine2.position})
        }

        return Number(element1.dataset.position) - Number(element2.dataset.position)
      },
      eachFn: (element) => {
        const engine = this.#map.get(element.dataset.id)

        if (!engine) {
          this.#listContainer.removeChild(element)
        }

        if (engine && !engine.selected) {
          this.#listContainer.removeChild(element)
        }
      }
    })
  }

  open() {
    super.open()
  }

  close() {
    super.close()
  }

  get #listContainer() {
    return this.#body.querySelector(".popup__section-list")
  }

  #createListItem(engine) {
    return new Node("li", {
      classNames: ["popup__section-item"],
      attrs: {
        "data-id": engine.id,
        "data-position": engine.position
      },
      children: [
        new Node("a", {
          classNames: ["popup__action"],
          attrs: {
            href: engine.href,
            target: "_blank"
          },
          children: [
            new Node("span", {
              classNames: ["popup__icon", `popup__icon--${engine.icon}`],
              attrs: {
                style: faviconUrl(engine.href)
              }
            }),
            new Node("span", {
              children: [document.createTextNode(engine.label)]
            })
          ]
        })
      ]
    }).element
  }
}
