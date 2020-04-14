class DefaultDict {

  constructor(defaultInit) {
    return new Proxy({}, {
        get: (target, name) => name in target ? 
            target[name] : ( target[name] = typeof defaultInit === 'function' ? 
                new defaultInit().valueOf() : defaultInit)
    })
  }
}

class Trie {

    constructor () {
        this.children = new DefaultDict ( Trie )
        this.end = false
    }
    
    find (str) {
        return !str ? this.end : 
            !(str[0] in this.children) ? false : 
                this.children[str[0]].find(str.substr(1))
    }
    
    getAll ( check_str, found='', result=[] ) {
        if ( this.end ) {
            found.length > 1 ? result.push(found) :
            null
        }
        for ( const child in this.children ) {
            if ( check_str.includes( child ) ) {
                const index = check_str.indexOf( child )
                
                this.children[child].getAll(
                    check_str.substr( 0, index ) + check_str.substr( index + 1 ),
                    found + child,
                    result
                )
            }
        }
        return result
    }
    
    insert ( str ) {
        !str ? this.end = true : 
            this.children[str[0]].insert( str.slice(1) )
    }

    insertMany(...strings) {
        for (str of strings) {
            this.insert(str)
        }
    }
}

function groupByLength(arr) {
    // returns an object of items 
    let output = new Object()

    for (let item of arr) {
        n = item.length
        if (!(n in output)) {
            output[n] = new Array()
        }
        output[n].push(item)
    }
    return output
}

function sorted(arr, opts={ key:undefined, reverse:false }) {
    arr = new Array(...arr).sort(opts.key)
    if (opts.reverse) {
        arr.reverse()
    }
    return arr
}

function reversed(arr) {
    arr = new Array(...arr)
    arr.reverse()
    return arr
}

/*
function calcLightness(r, g, b, alpha) {
    alpha = alpha > 1 ? alpha / 100 : alpha

    let [red, green, blue] = [r, g, b].map(v =>
        (255 - v) * alpha + v
    )
    console.log(red, green, blue)
    if (red > 255 || green > 255 || blue > 255) {
        return r, g, b
    }
    return [red, green, blue].map(c => parseInt(c))
}
*/


module.exports = {
    Trie,
    DefaultDict,
    sorted,
    reversed,
    groupByLength,
}
