const { readFileSync } = require('fs');
const helpers = require('./helpers')

let generator = new helpers.Trie()
// access src and create dictionary
let dictionary = JSON.parse(readFileSync(
    './assets/webster.json', 
    (err, data) => {
        console.log(`error: ${err} data: ${data}`)
    }
))
// populate generator
if (dictionary) {
    for (let word in dictionary) {
        generator.insert(word)
    }
}


function displayResults(obj) {
    const main = document.querySelector('.display-area')
    main.innerHTML = '' // clear previous result

    getDefinition( { target: { innerText:'Definition' } } ) // using this as careof to reset the definition display area

    const obj_keys = helpers.reversed(
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

        // append individual words (anagrams)
        const container = html.querySelector('.anagrams')
        for (const word of helpers.sorted(obj[key])) {
            const word_elem = new DOMParser().parseFromString(
                `<p class="word">${word}</p>`, 'text/html'
            ).body.firstChild
            // create word click event for definition search
            word_elem.addEventListener(
                'click', getDefinition
            )
            container.appendChild(word_elem)
        }

        showWordCount(html, obj[key])

        makeCollapsable( 
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
    
    updateTitle(jumble, `${anagrams.length} words`)

    displayResults(helpers.groupByLength(anagrams))
}

function getDefinition(event) {
    // remove class name from previous element
    elem = event.target
    switchActiveWord(elem, 'active')

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

function makeCollapsable(tag) {
    tag.addEventListener(
        'click', (event) => {
            elem = event.target
            elem.classList.toggle('hidden-active')
            elem.nextElementSibling.classList.toggle('hidden')
        }
    )
}

function showWordCount(elem, arr) {
    console.log(elem)
    word_count = arr.length;
    elem.querySelector('#word-count').innerText = `\
        ${word_count} word${word_count > 1 ? 's' : ''}\
    `
}

function switchActiveWord(elem, cls) {
    prev = document.querySelector('.' + cls)
    if (prev) {
        prev.classList.remove(cls)
    }
    if (elem.classList) {
        elem.classList.add(cls)
    }
}

function updateTitle(...strs) {
    const title = document.querySelector('head title')
    title.innerText = ['Anagramator', ...strs].join(' - ')
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
