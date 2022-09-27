export function sortable(rootElement, onUpdate) {
  let dragElement, nextElement

  Array.from(rootElement.children).forEach((itemElement) => {
    if (itemElement.hasAttribute("draggable")) {
      itemElement.classList.add("draggable")
    }
  })

  function handleDragover(evt) {
    evt.preventDefault()
    evt.stopPropagation()
    evt.dataTransfer.dropEffect = "move"

    if (!evt.target) {
      return
    }

    const target = evt.target
    const parent = target.closest(".draggable")

    if (target && target !== dragElement && parent !== null) {
      const rect = target.getBoundingClientRect()
      const next = (evt.clientY - rect.top) / (rect.bottom - rect.top) > .5

      if (Math.floor(rootElement.getBoundingClientRect().bottom) === evt.clientY) {
        rootElement.appendChild(dragElement)
        return
      }

      rootElement.insertBefore(dragElement, next && parent.nextSibling || parent)
    }
  }

  function handleDragend(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    dragElement.classList.remove("ghost")
    rootElement.removeEventListener("dragover", handleDragover, false)
    rootElement.removeEventListener("dragend", handleDragend, false)

    if (nextElement !== dragElement.nextSibling) {
      onUpdate(dragElement)
    }
  }

  rootElement.addEventListener("dragstart", (evt) => {
    evt.stopPropagation()
    dragElement = evt.target
    nextElement = dragElement.nextSibling

    evt.dataTransfer.effectAllowed = "move"
    evt.dataTransfer.setData("Text", dragElement)

    rootElement.addEventListener("dragover", handleDragover, false)
    rootElement.addEventListener("dragend", handleDragend, false)

    setTimeout(() => {
      dragElement.classList.add("ghost")
    }, 0)
  }, false)
}
