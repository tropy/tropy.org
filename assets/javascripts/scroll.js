(function () {
  'use strict'

  var se = document.scrollingElement || document.documentElement
  var screenshot = document.querySelector('.screenshot')

  if (se == null || screenshot == null) return

  var offset = 0

  function onResize() {
    var bounds = screenshot.getBoundingClientRect()
    var middle = se.scrollTop + bounds.top + (bounds.height / 2)
    var viewport = document.documentElement.clientHeight
    offset = middle - (viewport / 2)
    onScroll()
  }

  function onScroll() {
    if (se.scrollTop < offset) {
      screenshot.classList.remove('item-mode')
    } else {
      screenshot.classList.add('item-mode')
    }
  }

  document.addEventListener('resize', onResize)
  document.addEventListener('scroll', onScroll, { passive: true })

  onResize()
  onScroll()
}())
