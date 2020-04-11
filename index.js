const { readFileSync } = require('fs');
const extras = require('./extras')

let generator = new extras.Trie()
// access and create dictionary
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

function groupByLength(arr) {
    // returns an object of items 
    let result = new extras.DefaultDict( Array )

    for (let item of arr) {
        result[item.length].push(item)
    }
    return result
}

function getDefinition(event) {
    word = event.target.innerText
    temp_obj = {
        highlight: word, 
        definition: word in dictionary ? 
            dictionary[word] : 'Select a word to see it\'s definition'
    }
    for (let id in temp_obj) {
        document.querySelector(`#${id}`).innerText = temp_obj[id]
    }
}

function generateWords(event) {
    event.preventDefault() // prevents page refresh
    // generate anagrams
    const jumble = document.querySelector('#jumble').value
    const anagrams = generator.getAll(jumble)
    // update result count
    document.querySelector('#result-count').innerText = anagrams.length

    displayResults(groupByLength(anagrams))
}

function displayResults(obj) {
    const main = document.querySelector('.display-area')
    main.innerHTML = '' // clear previous result
    getDefinition({target:{innerText:'Definition'}}) // using this as careof to reset the definition display area

    const obj_keys = extras.sorted(
        Object.keys( obj ), { reverse: true }
    )
    for (const key of obj_keys) {
        // create container for generated anagrams based on groups
        const html = new DOMParser().parseFromString(
            `
            <section class="word-group">
                <h3 class="letter-count">
                    ${key} letters
                    <span class="chevron">
                    </span>
                </h3>
                <div class="anagrams">
                </div>
            </section>
            `, 'text/html'
        ).body.firstChild

        // append individual words (anagrams)
        const container = html.querySelector('.anagrams')
        for (const word of extras.sorted(obj[key])) {
            const word_elem = new DOMParser().parseFromString(
                `<p class="word">${word}</p>`, 'text/html'
            ).body.firstChild
            // create word click event for definition search
            word_elem.addEventListener(
                'click', getDefinition
            )
            // add chevron click event
            container.appendChild(word_elem)
        }
        main.appendChild(html)
    }
}

// Event listeners
/*
event_elems = {
    '#generate': {
        event: 'click',
        func: generateWords,
    },
    '.word': {
        event: 'click',
        func: getDefinition,
    }
}
// create events
Object.keys(event_elems).forEach((key) => {
    console.log(key)
    const elem = event_elems[key]
    document.querySelector(key).addEventListener(elem.event, elem.func)
})
*/
document.querySelector('#generate').addEventListener(
    'click', generateWords
)
