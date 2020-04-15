const { readFileSync } = require('fs');

const appname = 'Anagramator'

// apply ui color 
function applyColor(color) {
    const root = document.documentElement

    Object.entries(color).forEach(
        arg => root.style.setProperty(
            '--color-' + arg[0], arg[1]
        )
    )
}

// change ui colors based on color option selected
function changeAppUIColor(event) {
    const option = event.target

    if (option.className === 'color-option') {

        const color = ui_colors[
            option.attributes.getNamedItem('id').value
        ]
        applyColor(color)
    }
}

function makeCollapsable(tag) {
    tag.addEventListener(
        'click', (event) => {
            elem = event.target
            elem.classList.toggle('hidden-active')
            elem.nextElementSibling.classList.toggle('hidden')
        }
    )
}

function parseJSON(file) {
    return JSON.parse(readFileSync(
        file, 
        (err, data) => {
            console.log(`error: ${err} data: ${data}`)
        }
    ))
}

function showWordCount(elem, arr) {
    word_count = arr.length;
    elem.querySelector('#word-count').innerText = `\
        ${word_count} word${word_count > 1 ? 's' : ''}\
    `
}

function updateTitle(...strs) {
    const title = document.querySelector('head title')
    title.innerText = [appname, ...strs].join(' - ')
}

module.exports = {
    applyColor,
    changeAppUIColor,
    makeCollapsable,
    parseJSON,
    showWordCount,
    updateTitle,
}