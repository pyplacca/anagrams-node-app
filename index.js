const globals = require('./globals')
const helpers = require('./helpers')


let generator = new globals.Trie()
// access src and create dictionary
let dictionary = helpers.parseJSON(
    './assets/webster.json'
)
// populate generator
if (dictionary) {
    for (word in dictionary) {
        generator.insert(word)
    }
}

// get and set last used ui color
last_applied_color = localStorage.getItem('uiColor')
if (last_applied_color) {
    helpers.applyColor(last_applied_color)
}

// show app colors
const ui_colors = helpers.parseJSON(
    './assets/colors.json'
) 

let colors_div = document.querySelector('.app-colors')
for (let color in ui_colors) {
    let child = `
        <div 
            class="color-option" 
            id=${color} 
            style="background-color: ${ui_colors[color].light}"
            >
        </div>
    `
    colors_div.insertAdjacentHTML('beforeend', child)
}
colors_div.addEventListener('click', helpers.changeAppUIColor)

// Functions
function displayResults(obj) {
    const main = document.querySelector('.display-area')
    main.innerHTML = '' // clear previous result

    getDefinition( { target: { innerText:'Definition' } } ) // using this as careof to reset the definition display area

    const obj_keys = globals.reversed(
        Object.keys( obj )
    )
    for (const key of obj_keys) {
        // create container for generated anagrams based on groups
        const html = new DOMParser().parseFromString(
            `
            <section class="word-group">
                <h3 class="letter-count" title="Click to toggle view">
                    ${key} letters
                    <span id="word-count"></span>
                </h3>
                <div class="anagrams">
                </div>
            </section>
            `, 'text/html'
        ).body.firstChild

        const anagrams_container = html.querySelector('.anagrams')
        // append generated words (anagrams)
        globals.sorted(obj[key]).forEach(
            word => anagrams_container.insertAdjacentHTML(
                'beforeend',
                `<p class="word">${word}</p>`
            )
        )
        // add click event to words
        anagrams_container.addEventListener(
            'click', e => {
                // listens to show definition
                e.target.classList.contains('word') ?
                    getDefinition(e) : null
            }
        )

        showWordCount(html, obj[key])
        helpers.makeCollapsable( 
            html.querySelector('.letter-count') 
        ) // add collapse support
        
        main.appendChild( html )
    }
}

function generateWords(event) {
    event.preventDefault() // prevents page refresh
    // generate anagrams
    const jumble = document.getElementById('jumble').value
    const anagrams = generator.getAll(jumble.toLowerCase())
    // update result count
    document.getElementById('result-count').innerText = anagrams.length
    
    helpers.updateTitle(jumble, `${anagrams.length} words`)

    displayResults(globals.groupByLength(anagrams))
}

function getDefinition(event) {
    // remove class name from previous element
    elem = event.target
    switchWordHighlight(elem, 'active')

    word = elem.innerText
    temp_obj = {
        highlight: word, 
        definition: word in dictionary ? 
            dictionary[word] : 'Select a word to see it\'s definition'
    }
    for (let id in temp_obj) {
        document.getElementById(id).innerText = temp_obj[id]
    }
}

function switchWordHighlight(elem, cls) {
    prev = document.querySelector('.' + cls)
    if (prev) {
        prev.classList.remove(cls)
    }
    if (elem.classList) {
        elem.classList.add(cls)
    }
}

// Primary Event Listeners
document.getElementById('generate').addEventListener(
    'click', generateWords
);

document.addEventListener('scroll', event => {
    let doc = event.path[1];
    const header = document.querySelector('header')
    
    doc.scrollY ? 
        header.classList.add('smaller') :
            header.attributes.removeNamedItem('class')
})

// update app title
helpers.updateTitle()
