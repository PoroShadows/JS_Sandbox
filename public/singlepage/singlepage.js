'use strict';
document.title = 'Application';

Basic.ready(() => {
    //TODO Start on design :)
    /*$.handleHash('test', function () {
        console.log('hi');
    });*/
    //$.localStorage('test', 'testing');
    //console.log($.localStorage('test'));
    /** @type {Element} */
    let body = Basic.element(`body`);
    /** @type {Element} */
    let test = Basic.more(`<a href="#/test">`).text('test').parent(body).get();
    Basic.more(`<br>`).parent(body);
    let test2 = Basic.more(`<a href="#/test2">`).text('test2').parent(body).get();
    Basic.more(`<br>`).parent(body);
    let div = Basic.more('<div>').text('Content: ').parent(body).get();
    Basic.more('<span>').parent(div);
    if (!window.history) {
        Basic.hash('test', function () {
            Basic.more(`span`).text('gnmklfdsjdf');
        });
        Basic.hash('test2', function () {
            Basic.more(`span`).text('oyituryeujksdfgj');
        });
    } else {
        if (history.state == null) {
            history.replaceState({foo:'start'}, document.title, window.location.pathname)
        }
        Basic.more(test).on('click', function (e) {
            history.pushState({foo:'bar'}, document.title + ' / Test', Basic.more(e.target).attr('href').substring(1));
            console.log(history.state);
            e.preventDefault();
        });
        Basic.more(test2).on('click', function (e) {
            history.pushState({foo:'bar'}, document.title + ' / Test2', Basic.more(e.target).attr('href').substring(1));
            console.log(history.state);
            e.preventDefault();
        });
        window.addEventListener('popstate', function (event) {
            console.log(history.state);
            console.log(event);
        });
        console.log(history.state);
    }
    //history.pushState({}, document.title, '/test');
});