(function () {
  'use strict'

  try {
    var UA = navigator.userAgent

    var button = document.querySelector('.download-button')
    var text = button.innerHTML

    var links = {
      mac: document.querySelector('.download-link.mac'),
      linux: document.querySelector('.download-link.linux'),
      win: document.querySelector('.download-link.win')
    }

    if ((/Mac/).test(UA) && !(/iP(hone|ad)/).test(UA)) {
      links.mac.style.display = 'none'
      button.setAttribute('href', links.mac.getAttribute('href'))
      button.innerHTML = text + ' for <strong>macOS</strong>'

    } else if ((/Windows/).test(UA)) {
      links.win.style.display = 'none'
      button.setAttribute('href', links.win.getAttribute('href'))
      button.innerHTML = text + ' for <strong>Windows</strong>'

    } else if ((/Linux/).test(UA) && !(/Android/).test(UA)) {
      links.linux.style.display = 'none'
      button.setAttribute('href', links.linux.getAttribute('href'))
      button.innerHTML = text + ' for <strong>Linux</strong>'
    }

  } catch (error) {
    // ignore
  }

}())
