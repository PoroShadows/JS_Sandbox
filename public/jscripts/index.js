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
        if (!is(start, Object, true)) return start
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
let elements = render(
    '<html lang="jp">' +
    '   <head>' +
    '      <meta charset="utf-8">' +
    '      <meta name="author" content="Martin Hövre">' +
    '      <meta name="description" content="A sandbox page for testing.">' +
    '      <meta name="keywords" content="sandbox">' +
    '      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no">' +
    '      <meta name="robots" content="noindex, nofollow">' +
    '      <title>Kano Official page replica</title>' +
    '      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">' +
    '      <link rel="stylesheet" href="/styles/kano.css">' +
    '   </head>' +
    '   <body>' +
    '       <img class="cover" src="/images/kano_main_bg03.jpg" alt="Artist cover">' +
    '       <a href="/kano" class="top">' +
    '           <p class="artist_name">KANO</p>' +
    '           <p>Warner Bros. Home Entertainment</p>' +
    '       </a>' +
    '       <img class="artist-logo" src="/images/kano_artist_logo.png">' +
    '       <nav>' +
    '           <ul class="links">' +
    '               <li><a class="active" href="/kano">Home</a></li>' +
    '               <li><a href="/kano/news">News & Topics</a></li>' +
    '               <li><a href="/kano/movie">Movie</a></li>' +
    '               <li><a href="/kano/biography">Biography</a></li>' +
    '               <li><a href="/kano/discography">Discography</a></li>' +
    '               <li><a href="/kano/live_event">Live & Event</a></li>' +
    '           </ul>' +
    '       </nav>' +
    '       <h2 class="news-info">News & Information</h2>' +
    '       <ul class="news-info">' +
    '           <li class="item-1"><span>2016/8/19</span><a href="/kano/newsinfo/45">Newシングル「nameless」発売記念 ツイキャス特番 9月8日21時から放送決定　※9/6更新</a></li>' +
    '           <li class="item-2"><span>2016/8/12</span><a href="/kano/newsinfo/44">animelo mixで「nameless」先行配信開始</a></li>' +
    '           <li class="item-3"><span>2016/8/12</span><a href="/kano/newsinfo/43">「RERE」MUSIC VIDEO解禁</a></li>' +
    '       </ul>' +
    '       <h2 class="live-event">Live & Event</h2>' +
    '       <ul class="live-event">' +
    '           <li class="item-1">2016/8/12<a href="/kano/newsinfo/67">New Single「nameless」発売記念 特典お渡し会 開催決定</a></li>' +
    '           <li class="item-2">2016/6/12<a href="/kano/newsinfo/66">鹿乃 ファーストライブ「ばんび～の」​ チケット一般発売開始</a></li>' +
    '       </ul>' +
    '   </body>' +
    '</html>'
)
each(elements, elem => body.appendChild(elem))
/*WaterLily.ajax('/kano').then(res => {
    res.data = res.data.replace('<!DOCTYPE html>', '')
    res.data = res.data.split('\n').join('')
    console.log(res.data)
    console.log(render(res.data.toString()));
    debugger
}).then(console.log)*/