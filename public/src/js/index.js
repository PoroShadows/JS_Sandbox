//import * as WaterLily from "./WaterLily";
/*window.customElements.define('v-element', class extends HTMLElement {
 constructor() {
 super();
 }
 })*/
var body = WaterLily('body')
var test = WaterLily('<test class="hi">', { id: 'dat-boi' }, 'testing...', 'oh a node')
body.appendChild(test)
console.log(test)
function render(html) {
    let match, reg = /<\/?([A-Za-z0-9\-]+)>?/g, nextMatch, current, unParsedTags = [], tree = [], tags = []
    const getCurrentChildrenArray = () => {
        let arr = unParsedTags
        for (let i = 0; i < tree.length; i++)
            arr = arr[tree[i]].children
        return arr
    }
    const element = start => {
        if (!WaterLily.is(start, Object, true)) return start
        let res = WaterLily.create(start.element)
        for (let i = 0; i < start.children.length; i++)
            res.appendChild(element(start.children[i]))
        return res
    }
    do {
        let obj = { tag: '', element: '', children: [] }
        let text = null
        if (match === undefined) match = reg.exec(html)
        nextMatch = reg.exec(html)
        let element = html.slice(match.index, nextMatch === null ? html.length : nextMatch.index)
        if (/[^>]/.test(element[element.length - 1])) {
            const reverse = s => s.split("").reverse().join("");
            [text, element] = reverse(element).split('>', 2).map(reverse)
            element += '>'
        }

        if (element[1] === '/') {
            tree.pop()
            if (text || !/\s*/.test(text)) getCurrentChildrenArray().push(document.createTextNode(text))
        } else {
            obj.tag = match[1]
            obj.element = element
            if (text || /\s*/.test(text)) obj.children.push(document.createTextNode(text))
            let arr = getCurrentChildrenArray()
            tree.push(arr.length)
            arr.push(obj)
        }
        match = nextMatch
    } while (match !== null)
    console.log(unParsedTags);
    for (let i = 0; i < unParsedTags.length; i++)
        tags.push(element(unParsedTags[i]))
    return tags
}
WaterLily.notify().then(() => {
    console.log(1)
}).catch(console.error)