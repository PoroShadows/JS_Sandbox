//import * as WaterLily from "./WaterLily";
/*window.customElements.define('v-element', class extends HTMLElement {
    constructor() {
        super();
    }
})*/
/**
 *
 * @param {String} markup
 */
WaterLily.parse = function (markup) {
    /**
     *
     * @type {HTMLElement[]}
     */
    const elements = []
    let on = -1
    const tags = []

    const regexTag = /<[a-zA-Z0-9\-="' ]+>|<\/[a-zA-Z0-9\-]+>|>.+</g
    const endTag = /<\/[a-zA-Z0-9\-]+>/
    const separatorS = ':;|!#%¤.'
    const separatorE = '.¤%#!|;:'
    const gen = () => {
        let g = ''
        const elem = elements.slice(elements.length - tags.length)
        console.log('Hierarchy:', elem);
        if (elem.length === 0) return 0
        for (let i = 0, element = elem[i], idx; i < elem.length; i++, element = elem[i]) {
            g += i + (i == 0 ? (idx = elements.indexOf(elem[0])) != -1 ? idx : 0 : elem[i-1].children.length) + '_'
            console.log('Element:', element, 'g:', g.replace(/_$/, ''))
        }
        return g.replace(/_$/, '')
    }
    let lastIndex = 0

    markup = markup.replace(regexTag, function (match, index) {

        if (endTag.test(match)) {
            const tagName = match.replace(/\/|<|>/g, '').toLowerCase()
            if (tags.includes(tagName) && tags[tags.length - 1] === tagName && elements[elements.length - 1].tagName.toLowerCase() === tagName) {
                //console.log(elements, tags);
                if (elements.length > 1)
                    elements[elements.length - 2].appendChild(elements.pop())
                tags.pop()
            } else throw new TypeError('Could not parse the HTML structure')
        } else {
            elements.push(WaterLily.create(match))
            tags.push(elements[elements.length-1].tagName.toLowerCase())
        }
        lastIndex = index
        console.log('\n');
        console.log(match, tags)
        console.log('elements:', elements, 'tags:', tags)
        return separatorE + separatorS + '(' + gen() + ')'
    })
    markup.replace(new RegExp(separatorS + '\((.)\)\w+', 'g'))
    return elements.length > 1 ? elements : elements[0]
}
console.log(WaterLily.parse('<div class="testing" aria-checked>Bla Bla<span>OMG it works</span><span>OMG t works</span></div>jnvrnvjen<div></div>'));
var body = WaterLily('body')
var element = WaterLily('<test class="hi">', { id: 'dat-boi' }, 'testing...', 'oh a node')
body.appendChild(element)
console.log(element)