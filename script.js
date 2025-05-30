const menu = [
    {
        img: 'images/chicken-lollipop.jpg',
        name: 'Chicken Lollipop',
        price: '₹50'
    },
    {
        img: 'images/chicken-momos.jpg',
        name: 'Chicken Momo',
        price: '₹40'
    },
    {
        img: 'images/chicken-pakoda.jpg',
        name: 'Chicken Pakoda',
        price: '₹30'
    },
    {
        img: 'images/egg-fried-rice.jpg',
        name: 'Egg Fried Rice',
        price: '₹70'
    },
    {
        img: 'images/egg-roll.jpg',
        name: 'Egg Roll',
        price: '₹25'
    },
    {
        img: 'images/veg-hakka-noodles.jpg',
        name: 'Veg Chowmein',
        price: '₹40'
    }
]

function makeItem(x) {
    const div = document.createElement("div");
    div.id = 'div1';

    const divv = document.createElement("div");
    divv.id = 'item-image';
    divv.style.backgroundImage = `url(${x.img})`;

    const divvv = document.createElement("div");
    divvv.id = 'item-info';

    const h3 = document.createElement("h3");
    h3.innerHTML = x.name;

    const p = document.createElement("p");
    p.id = 'price';
    p.innerHTML = x.price;

    // Assemble them together
    divvv.appendChild(h3);
    divvv.appendChild(p);
    div.appendChild(divv);
    div.appendChild(divvv);
    document.getElementById('menu').appendChild(div);
}
menu.forEach(item => makeItem(item));
function showItems() {
    const menu = document.getElementById('menu');
    const styl = getComputedStyle(menu).display;
    menu.style.display = (styl === 'none') ? 'flex' : 'none';
    document.querySelector('.menu-option').innerHTML = (document.querySelector('.menu-option').innerHTML.trim() === '+ Expand') ? '- Collapse' : '+ Expand'
}


function handleToggle() {

    const nav = document.querySelector('.head-nav');
    const height = getComputedStyle(nav).height;
    nav.style.height = (height === '80px') ? '300px' : '80px';
    const options = document.querySelector('#bar');
    options.classList.contains('box') ? options.classList.replace('box', 'bar') : options.classList.replace('bar', 'box');
    document.querySelector('toggle').innerHTML = (document.querySelector('toggle').innerHTML === '<img src="images/menu.png" alt="Menu">') ? '&times;' : '<img src="images/menu.png" alt="Menu">';
}