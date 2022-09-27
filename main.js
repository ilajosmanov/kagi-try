import { nanoid } from "nanoid"

import { events } from "./src/app/events"
import { LocalStorage } from "./src/app/storage"
import { EventEmitter } from "./src/app/emitter"

import { MorePopup } from "./src/app/more-popup"
import { EditPopup } from "./src/app/edit-popup"

export const defaultState = [
  {position: 0, id: nanoid(), selected: true, icon: "wiki", href: "https://wikipedia.org", label: "Wikipedia"},
  {position: 1, id: nanoid(), selected: true, icon: "youtube", href: "https://youtube.com", label: "YouTube"},
  {position: 2, id: nanoid(), selected: true, icon: "bing", href: "https://bing.com", label: "Bing"},
  {position: 3, id: nanoid(), selected: true, icon: "wolfram", href: "https://wolframalpha.com/", label: "WolframAlpha"},
  {position: 4, id: nanoid(), selected: true, icon: "duckduckgo", href: "https://duckduckgo.com", label: "DuckDuckGo"}
]

function init() {
  const Storage = new LocalStorage()
  const Emitter = new EventEmitter()
  const key = "engines"

  const MorePopupContext = new MorePopup(Emitter)
  const EditPopupContext = new EditPopup(Emitter)

  EditPopupContext.listeners.on(events.OPENED, () => {
    MorePopupContext.close()
  })

  EditPopupContext.listeners.on(events.CLOSED, () => {
    MorePopupContext.open()
  })

  Emitter.on(events.UPDATE, (state) => {
    const value = state.sort((a, b) => a.position - b.position)
    Storage.set({ key, value })

    Emitter.emit(events.RECEIVED, value)
  })

  Emitter.on(events.CONNECT, () => {
    console.info("Connect to LocalStorage...")
    const engines = Storage.get({ key })

    const value = (engines ?? defaultState)
      .sort((a, b) => a.position - b.position)

    if (engines === null) {
      console.info("No data in LocalStorage, set default state...")
      Storage.set({ key, value })
    }

    Emitter.emit(events.RECEIVED, value)
  })

  Emitter.emit(events.CONNECT)
}

window.addEventListener("DOMContentLoaded", init)
