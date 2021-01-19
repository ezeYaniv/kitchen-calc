//jshint esversion:6

module.exports = createList;

function createList(list, ulid) {
    for(let i=0; i<list.length; i++) {
        let ul = $(dom.window.document).getElementById(ulid);
        let li = $(dom.window.document).createElement('li');
        li.textContent = list[i];
        li.addClass("results__item");
        ul.appendChild(li);
        console.log(li);
    }
    
}
