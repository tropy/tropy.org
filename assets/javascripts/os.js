(function () {
  'use strict'

  var UA = navigator.userAgent
  var button = document.querySelector('.download-button')
  var text = 'Download <strong>Tropy Beta</strong>'
  var href

  if ((/Mac/).test(UA) && !(/iP(hone|ad)/).test(UA)) {
    href = '/releases/tropy-1.0.0-beta.0.dmg'
    text = text + ' for <strong>macOS</strong>'

  } else if ((/Windows/).test(UA)) {
    href = '/releases/setup-tropy-1.0.0-beta.0.exe'
    text = text + ' for <strong>Windows</strong>'

  } else if ((/Linux/).test(UA) && !(/Android/).test(UA)) {
    href = '/releases/tropy-1.0.0-beta.0.tar.bz2'
    text = text + ' for <strong>Linux</strong>'
  }

  if (button != null && href != null) {
    button.setAttribute('href', href)
    button.innerHTML = text
  }

}())
