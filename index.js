const menuData = {
    Chinese: [
        { name: "Kung Pao Chicken", recipe: "Chicken, peanuts, vegetables, soy sauce." },
        { name: "Fried Rice", recipe: "Rice, vegetables, eggs, soy sauce." },
        { name: "Spring Rolls", recipe: "Vegetables wrapped in rice paper." },
    ],
    Japanese: [
        { name: "Sushi", recipe: "Rice, seaweed, fish, vegetables." },
        { name: "Ramen", recipe: "Noodles, broth, meat, vegetables." },
        { name: "Tempura", recipe: "Battered and fried vegetables or seafood." },
    ],

};

const urlParams = new URLSearchParams(window.location.search);
const style = urlParams.get('style');
document.getElementById('menuHeader').innerText = style + ' Menu';

const menuContainer = document.getElementById('menuContainer');
menuData[style].forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `<h3>${item.name}</h3><p>${item.recipe}</p><button onclick="addToCalendar('${item.name}')">Add to Calendar</button>`;
    menuContainer.appendChild(div);
});

const calendarList = document.getElementById('calendarList');

function addToCalendar(food) {
    const listItem = document.createElement('li');
    listItem.textContent = food;
    calendarList.appendChild(listItem);
}
