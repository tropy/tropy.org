(function () {
  'use strict'

  function toggle() {
    document.body.classList.toggle('nav-opened')
  }

  try {
    document
      .querySelector('header.main-header .nav-toggle')
      .addEventListener('click', toggle)

    document
      .querySelector('.nav-cover')
      .addEventListener('click', toggle)

  } catch (error) {
    // ignore
  }
}())
