(function () {
  'use strict'

  var isPassiveSupported = false

  try {
    var options = Object.defineProperty({}, 'passive', {
      get: function () { isPassiveSupported = true }
    })

    window.addEventListener('test', null, options)
  } catch(err) {
    // not supported
  }

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

  if (isPassiveSupported) {
    document.addEventListener('scroll', onScroll, { passive: true })
  } else {
    document.addEventListener('scroll', onScroll)
  }

  onResize()
  onScroll()
}())
