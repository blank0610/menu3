const monthYear = document.getElementById('monthYear');
const daysContainer = document.getElementById('days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDateInput = document.getElementById('eventDate');
const eventTextInput = document.getElementById('eventText');
const addEventButton = document.getElementById('addEvent');

let currentDate = new Date();
const events = {};

function renderCalendar() {
    daysContainer.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        daysContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('day');
        if (day === currentDate.getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            dayCell.classList.add('today');
        }

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (events[dateString]) {
            events[dateString].forEach((event, index) => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.textContent = event.text;
                eventDiv.onclick = () => editEvent(dateString, index); // Edit event on click
                dayCell.appendChild(eventDiv);
            });
        }

        daysContainer.appendChild(dayCell);
    }
}

prevButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

addEventButton.addEventListener('click', () => {
    const date = eventDateInput.value;
    const text = eventTextInput.value;

    if (date && text) {
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push({ text }); // Add new event
        eventTextInput.value = ''; // Clear input
        renderCalendar();
    } else {
        alert('Please enter both date and event description.');
    }
});

function editEvent(date, index) {
    const newText = prompt("Edit Event:", events[date][index].text);
    if (newText !== null) {
        if (newText.trim() === "") {
            events[date].splice(index, 1); // Remove event if empty
        } else {
            events[date][index].text = newText; // Update event text
        }
        renderCalendar();
    }
}

renderCalendar();