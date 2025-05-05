let menuData = {}; // 菜单数据对象
let calendarData = []; // 日历数据数组



// 每种菜系的背景图

// 从文件中获取 JSON 数据
function init() {
loadFromLocalStorage();
loadCalendarFromLocalStorage(); // Load calendar data from local storage
displayMenuItems(); // Display specific cuisine menu items
displayAllDishes(); // Display all dishes
displayCalendarItems();
setBackground();
calculateShoppingList();

}



function loadDefaultData() {
        fetch('en_menu.json') // 调整路径如果需要
            .then(response => response.json()) // 解析 JSON 响应
            .then(data => {
                mergeMenuData(data); // 合并获取的菜单数据
                localStorage.setItem('menuData', JSON.stringify(menuData)); // 保存更新的菜单数据到本地存储
                console.log("Fetched Menu Data:", menuData); // 调试输出获取的菜单数据
                displayMenuItems(); // 显示特定菜系的菜单项
                displayAllDishes(); // 显示所有菜品
                displayCalendarItems(); // 显示日历项
                alert("Default data has been loaded."); // 提示用户
            })
            .catch(error => console.error('Error loading the JSON data:', error)); // 错误处理
    }

    const backgroundImages = {
        Chinese: "url('png/cn8.jpg')", // 中餐背景图
        Japanese: "url('png/jp3.jpg')", // 日本餐背景图
        HongKong: "url('png/hk5.jpg')", // 香港餐背景图
        Italy: "url('png/italy5.jpg')", // 意大利餐背景图
        Western: "url('png/w1.png')",
        Dessert: "url('png/d6.jpg')", // 甜点背景图
        Drink: "url('png/drink3.jpg')", // 饮料背景图
        Sauce: "url('png/s4.jpg')", // 酱料背景图
        alldish: "url('png/cal10.png')", // 所有菜品背景图
        index: "url('png/cal11.png')" // 首页背景图
    };
    
    const landscapeBackgroundImages = {
        Chinese: "url('png/cnv1.jpg')", // 中餐横屏背景图
        Japanese: "url('png/jpv1.jpg')", // 日本餐横屏背景图
        HongKong: "url('png/hkv2.jpg')", // 香港餐横屏背景图
        Italy: "url('png/iv3.jpg')", // 意大利餐横屏背景图
        Dessert: "url('png/dv5.jpg')", // 甜点横屏背景图
        Drink: "url('png/drinkv1.jpg')", // 饮料横屏背景图
        Sauce: "url('png/sv2.jpg')", // 酱料横屏背景图
        Western: "url('png/wv1.png')",
        alldish: "url('png/mainv.jpg')", // 所有菜品横屏背景图
        index: "url('png/calv3.png')" // 首页横屏背景图
    };
    
    const urlParams = new URLSearchParams(window.location.search); // 获取 URL 参数
    const style = urlParams.get('style'); // 获取样式参数
    
    

// 根据样式和设备类型设置背景
function setBackground() {
    const isMobile = window.innerWidth <= 768; // 判断是否为移动设备
    const styleImage = backgroundImages[style] || "none"; // 获取样式对应的背景图
    const landscapeImage = landscapeBackgroundImages[style] || "none"; // 获取样式对应的横屏背景图

    document.body.style.backgroundImage = isMobile ? landscapeImage : styleImage; // 设置背景图
    document.body.style.backgroundSize = isMobile ? "150%" : "cover"; // 设置背景大小
    document.body.style.backgroundPosition = isMobile ? "middle" : "center"; // 设置背景位置
}

setBackground(); // 初始化设置背景
window.addEventListener('resize', setBackground); // 监听窗口大小变化，重新设置背景

// 从本地存储加载菜单数据
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('menuData'); // 获取本地存储中的菜单数据
    if (storedData) {
        menuData = JSON.parse(storedData); // 解析并存储菜单数据
        console.log("Loaded menuData from localStorage:", menuData); // 调试输出加载的菜单数据
    }
}

// 从本地存储加载日历数据
document.addEventListener('DOMContentLoaded', () => {
    loadCalendarFromLocalStorage(); // Load calendar data from local storage
    calculateShoppingList(); // Automatically calculate and display the shopping list
});

// Function to load calendar data from local storage
function loadCalendarFromLocalStorage() {
    const storedCalendarData = localStorage.getItem('calendarData'); // 获取本地存储中的日历数据
    if (storedCalendarData) {
        calendarData = JSON.parse(storedCalendarData); // 解析并存储日历数据
        console.log("Loaded calendarData from localStorage:", calendarData); // 调试输出加载的日历数据
    }
}

// 合并获取的 JSON 数据与本地存储数据
function mergeMenuData(jsonData) {
    jsonData.forEach(dish => { // 遍历每道菜
        dish.tags.forEach(tag => { // 遍历每道菜的标签
            if (!menuData[tag]) {
                menuData[tag] = []; // 如果标签不存在，初始化为空数组
            }
            if (!menuData[tag].some(existingDish => existingDish.name === dish.name)) {
                menuData[tag].push(dish); // 将菜品按标签添加到菜单中
            }
        });
    });
}

// 显示特定菜系的菜单项
function displayMenuItems() {
    const menuContainer = document.getElementById('menuContainer'); // 获取菜单容器
    if (!menuContainer) return; // 如果没有菜单容器，则退出

    menuContainer.innerHTML = ''; // 清空现有项

    // 使用 "style" 参数过滤菜系
    const style = new URLSearchParams(window.location.search).get('style') || 'Chinese'; // 默认菜系为 'Chinese'
    
    if (menuData[style]) {
        menuData[style].forEach(item => { // 遍历特定菜系的每道菜
            const div = document.createElement('div'); // 创建新的 div 元素
            div.className = 'menu-item'; // 设置类名
            div.innerHTML = `
            <button class="dish-button" onclick="showDetails('${item.name}', '${style}')">
                <h3>${item.name}</h3>
                <ul class="diff">${item.difficulty}</ul>
                <ul class="time">${item.time}</ul>
                <button class="edit" onclick="editItem('${item.name}'); event.stopPropagation();">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete" onclick="deleteItem('${item.name}'); event.stopPropagation();">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="showdetail" onclick="showDetails('${item.name}', '${style}')">
                    <i class="fa fa-bars"></i>
                </button>
                <button class="add-calendar" onclick="addToCalendar('${item.name}'); event.stopPropagation();">
                    <i class="fas fa-calendar-plus"></i>
                </button>
            </button>
        `; // 设置菜单项的 HTML
            menuContainer.appendChild(div); // 将新元素添加到菜单容器中
        });
    } else {
        menuContainer.innerHTML = '<p></p>'; // 如果没有找到菜品，显示信息
    }

    // 添加菜品按钮
    const addButtonDiv = document.createElement('div'); // 创建添加按钮的 div
    addButtonDiv.className = 'menu-item-bottom'; // 设置类名
    addButtonDiv.innerHTML = `
        <button class="add-page-button" onclick="addpage()">
            <i class="fa fa-plus"></i>
        </button>
    `;
    menuContainer.appendChild(addButtonDiv); // 将添加按钮添加到菜单容器中
}

// 显示所有菜品
function displayAllDishes() {
    const allDishesContainer = document.getElementById('allDishesContainer'); // 获取所有菜品容器
    if (!allDishesContainer) return; // 如果没有容器，则退出

    allDishesContainer.innerHTML = ''; // 清空现有项
    const uniqueDishes = new Set(); // 用于跟踪唯一菜品

    for (const cuisine in menuData) { // 遍历每种菜系
        menuData[cuisine].forEach(item => { // 遍历每道菜
            // Check if the dish has already been added
            if (!uniqueDishes.has(item.name)) {
                uniqueDishes.add(item.name); // Add to the set to track uniqueness

                const div = document.createElement('div'); // 创建新的 div 元素
                div.className = 'all-menu-item'; // 设置类名
                div.innerHTML = `
                <button class="dish-button" onclick="showDetails('${item.name}', '${cuisine}')">
                    <h3>${item.name}</h3>
                    <ul class="diff">${item.difficulty}</ul>
                    <ul class="time">${item.time}</ul>
                    <button class="edit" onclick="editItem('${item.name}'); event.stopPropagation();">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" onclick="deleteItem('${item.name}'); event.stopPropagation();">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="showdetail" onclick="showDetails('${item.name}', '${cuisine}')">
                        <i class="fa fa-bars"></i>
                    </button>
                    <button class="add-calendar" onclick="addToCalendar('${item.name}'); event.stopPropagation();">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </button>
                `; // 设置所有菜品的 HTML

                allDishesContainer.appendChild(div); // 将新元素添加到容器中
            }
        });
    }
}

// 显示详细信息的模态框
function showDetails(name, cuisine) {
    let item;

    if (cuisine === 'Calendar') {
        // Find the item in calendarData
        item = calendarData.find(d => d.name === name);
    } else if (menuData[cuisine]) {
        // Otherwise, find it in menuData
        item = menuData[cuisine].find(dish => dish.name === name);
    }

    if (item) {
        const modalTitle = document.getElementById('modalTitle');
        const modalItem = document.getElementById('modalItem');
        const modalRecipe = document.getElementById('modalRecipe');
        const modalNote = document.getElementById('modalNote');
        const detailModal = document.getElementById('detailModal');

        // Check if modal elements exist before setting their innerText
        if (modalTitle && modalItem && modalRecipe && modalNote && detailModal) {
            modalTitle.innerText = item.name; // 设置模态框标题
            modalItem.innerText = item.item ? `Ingredients:\n${item.item.join('\n')}` : ''; // 显示成分
            modalRecipe.innerText = item.recipe ? `Recipe:\n${item.recipe.join('\n')}` : ''; // 显示食谱
            modalNote.innerText = item.note ? `Note: ${item.note}` : ''; // 显示备注
            detailModal.classList.remove('hidden'); // 显示模态框
        } else {
            console.error("One or more modal elements are missing in the DOM.");
        }
    } else {
        alert("Dish not found."); // 如果未找到菜品，显示警告
    }
}

// 关闭模态框
function closeModal(event) {
    if (event && event.target === document.getElementById('detailModal')) {
        document.getElementById('detailModal').classList.add('hidden'); // Hide detail modal
    } else if (event && event.target === document.getElementById('addFoodForm')) {
        document.getElementById('addFoodForm').classList.add('hidden'); // Hide add food form
    } else {
        document.getElementById('detailModal').classList.add('hidden'); // Hide detail modal
    }
}
// 添加新菜品的表单处理

function addpage() {
    const addFoodForm = document.getElementById('addFoodForm'); // Get the add food form
    addFoodForm.classList.remove('hidden'); // Show the add food form

    // Get the current style, defaulting to 'Chinese' if not found
    const currentStyle = new URLSearchParams(window.location.search).get('style') || 'Chinese'; 

    // Clear previous values
    document.getElementById('foodName').value = '';
    document.getElementById('fooditem').value = '';
    document.getElementById('foodRecipe').value = '';
    document.getElementById('diff').value = '';
    document.getElementById('time').value = '';
    document.getElementById('foodnote').value = '';
    
    // Set the tags input to include the current style
    document.getElementById('tags').value = currentStyle; 

    // Focus on the first input field
    document.getElementById('foodName').focus();
}

let editingDishName = ''; // Global variable to track the dish being edited

function submitFood() {
    const foodName = document.getElementById('foodName').value.trim();
    const fooditem = document.getElementById('fooditem').value.split(',').map(item => item.trim());
    const foodRecipe = document.getElementById('foodRecipe').value.split(',').map(recipe => recipe.trim());
    const diff = document.getElementById('diff').value.trim();
    const time = document.getElementById('time').value.trim();
    const note = document.getElementById('foodnote').value.trim();
    
    const currentStyle = new URLSearchParams(window.location.search).get('style') || 'Chinese'; 
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    // Include the current style in the tags
    if (!tags.includes(currentStyle)) {
        tags.push(currentStyle);
    }

    // Check if the dish name already exists
    const existingDish = Object.values(menuData).flat().find(dish => dish.name === foodName);
    if (existingDish && editingDishName !== foodName) {
        alert("A dish with this name already exists. Please change the name."); // Show warning
        return; // Exit the function to prevent further processing
    }

    if (foodName && foodRecipe.length > 0) {
        const newDish = {
            name: foodName,
            item: fooditem,
            recipe: foodRecipe,
            difficulty: diff,
            time: time,
            note: note,
            tags: tags // Include tags in the new dish
        };

        // Check if we're editing an existing dish
        if (editingDishName) {
            // Update existing dish
            let cuisine = Object.keys(menuData).find(c => menuData[c].some(dish => dish.name === editingDishName));
            if (cuisine) {
                const index = menuData[cuisine].findIndex(dish => dish.name === editingDishName);
                menuData[cuisine][index] = newDish; // Update the dish
            }
            // Clear the editingDishName
            editingDishName = '';
        } else {
            // Add the dish to the appropriate tags in menuData
            tags.forEach(tag => {
                if (!menuData[tag]) {
                    menuData[tag] = []; // Initialize if tag doesn't exist
                }

                if (!menuData[tag].some(dish => dish.name === newDish.name)) {
                    menuData[tag].push(newDish); // Add the dish to the corresponding tag
                }
            });
        }

        // Save the updated menuData to local storage
        localStorage.setItem('menuData', JSON.stringify(menuData));

        // Clear input fields
        document.getElementById('foodName').value = '';
        document.getElementById('fooditem').value = '';
        document.getElementById('foodRecipe').value = '';
        document.getElementById('diff').value = '';
        document.getElementById('time').value = '';
        document.getElementById('foodnote').value = '';
        document.getElementById('tags').value = ''; // Clear tags field

        // Hide the form after submission
        addFoodForm.classList.add('hidden');
        
        // Refresh the displays
        displayMenuItems();
        displayAllDishes();
    } else {
        alert("Please enter both food name and recipe.");
    }
}

function cancelAdd() {
    addFoodForm.classList.add('hidden'); // Hide the add food form
    // Clear input fields
    document.getElementById('foodName').value = '';
    document.getElementById('fooditem').value = '';
    document.getElementById('foodRecipe').value = '';
    document.getElementById('diff').value = '';
    document.getElementById('time').value = '';
    document.getElementById('foodnote').value = '';
    document.getElementById('tags').value = ''; // Clear tags field
}

// 编辑菜单项
function editItem(name) {
    // Find the cuisine that contains the dish in menuData
    let cuisine = Object.keys(menuData).find(c => menuData[c].some(dish => dish.name === name));
    let item;

    if (cuisine) {
        item = menuData[cuisine].find(dish => dish.name === name); // 查找指定菜品
    } else {
        // Otherwise, check in calendarData
        item = calendarData.find(dish => dish.name === name);
        cuisine = 'Calendar'; // Set cuisine as Calendar for the modal title
    }

    if (item) {
        // Populate the form with the existing dish details
        document.getElementById('foodName').value = item.name;
        document.getElementById('fooditem').value = item.item.join(', ');
        document.getElementById('foodRecipe').value = item.recipe.join(', ');
        document.getElementById('diff').value = item.difficulty;
        document.getElementById('time').value = item.time;
        document.getElementById('foodnote').value = item.note;

        // Set tags, including the current style
        const currentStyle = new URLSearchParams(window.location.search).get('style') || 'Chinese';
        const tags = item.tags || [];
        if (!tags.includes(currentStyle)) {
            tags.push(currentStyle);
        }
        document.getElementById('tags').value = tags.join(', ');

        // Show the add food form as a modal
        const addFoodForm = document.getElementById('addFoodForm');
        addFoodForm.classList.remove('hidden'); // Show the add food form

        // Set the editing state for submitFood function
        editingDishName = item.name; // Save the name of the dish being edited

        // Focus on the first input field
        document.getElementById('foodName').focus(); // Focus on the first input field
    } else {
        alert("Dish not found."); // If the dish is not found, show an alert
    }
}

function editItem(name) {
    // Find the cuisine that contains the dish in menuData
    let cuisine = Object.keys(menuData).find(c => menuData[c].some(dish => dish.name === name));
    let item;

    if (cuisine) {
        item = menuData[cuisine].find(dish => dish.name === name); // 查找指定菜品
    } else {
        // Otherwise, check in calendarData
        item = calendarData.find(dish => dish.name === name);
        cuisine = 'Calendar'; // Set cuisine as Calendar for the modal title
    }

    if (item) {
        // Populate the form with the existing dish details
        document.getElementById('foodName').value = item.name;
        document.getElementById('fooditem').value = item.item.join('\n'); // Use newline for ingredients
        document.getElementById('foodRecipe').value = item.recipe.join('\n'); // Use newline for recipes
        document.getElementById('diff').value = item.difficulty;
        document.getElementById('time').value = item.time;
        document.getElementById('foodnote').value = item.note;

        // Set tags, including the current style
        const currentStyle = new URLSearchParams(window.location.search).get('style') || 'Chinese';
        const tags = item.tags || [];
        if (!tags.includes(currentStyle)) {
            tags.push(currentStyle);
        }
        document.getElementById('tags').value = tags.join(', ');

        // Show the add food form as a modal
        const addFoodForm = document.getElementById('addFoodForm');
        addFoodForm.classList.remove('hidden'); // Show the add food form

        // Set the editing state for submitFood function
        editingDishName = item.name; // Save the name of the dish being edited

        // Focus on the first input field
        document.getElementById('foodName').focus(); // Focus on the first input field
    } else {
        alert("Dish not found."); // If the dish is not found, show an alert
    }
}

// 删除菜单项
function deleteItem(name) {
    // Find the cuisine that contains the dish in menuData
    let cuisine = Object.keys(menuData).find(c => menuData[c].some(dish => dish.name === name));

    if (cuisine) {
        const index = menuData[cuisine].findIndex(dish => dish.name === name); // 查找菜品索引
        if (index > -1) {
            menuData[cuisine].splice(index, 1); // 从菜单中删除菜品
            localStorage.setItem('menuData', JSON.stringify(menuData)); // 更新本地存储
            displayMenuItems(); // 更新菜单显示
            displayAllDishes(); // 更新所有菜品显示
        }
    } else {
        // Otherwise, check in calendarData
        const index = calendarData.findIndex(dish => dish.name === name); // 查找菜品索引
        if (index > -1) {
            calendarData.splice(index, 1); // 从日历中删除菜品
            localStorage.setItem('calendarData', JSON.stringify(calendarData)); // 更新本地存储
            displayCalendarItems(); // 更新日历显示
        }
    }
}

function deletecal(name) {
    const index = calendarData.findIndex(dish => dish.name === name); // Find the index of the dish in calendarData

    if (index > -1) {
        calendarData.splice(index, 1); // Remove the dish from calendarData
        localStorage.setItem('calendarData', JSON.stringify(calendarData)); // Update local storage
        displayCalendarItems(); // Refresh the calendar display
    } else {
        alert("Dish not found."); // If the dish is not found, show an alert
    }
}

function clearAllDishes() {
    if (confirm("Are you sure you want to clear all dishes? This action cannot be undone.")) {
        localStorage.removeItem('menuData'); // Clear menu data from local storage
        menuData = {}; // Reset the menuData object
        displayAllDishes(); // Refresh the display to show empty state
        alert("All dishes have been cleared."); // Notify the user
    }
}

// 将菜品添加到日历
function addToCalendar(dishName) {
    const cuisine = Object.keys(menuData).find(c => menuData[c].some(dish => dish.name === dishName)); // 查找包含菜品的菜系

    if (cuisine) {
        const item = menuData[cuisine].find(dish => dish.name === dishName);
        
        if (item) {
            const calendarItem = {
                name: item.name,
                difficulty: item.difficulty,
                time: item.time,
                note: item.note,
                item: item.item, // Add ingredients
                recipe: item.recipe // Add recipe
            };

            if (!calendarData.some(d => d.name === dishName)) {
                calendarData.push(calendarItem);
                localStorage.setItem('calendarData', JSON.stringify(calendarData));
                alert(`${dishName} has been added to your calendar.`);
                displayCalendarItems(); // Update calendar display
            } else {
                alert(`${dishName} is already in your calendar.`);
            }
        }
    } else {
        alert("Dish not found."); // If the dish is not found, show an alert
    }
}

function calculateShoppingList() {
    const ingredientCount = {};

    // Iterate over calendarData to aggregate ingredients
    calendarData.forEach(dish => {
        dish.item.forEach(ingredient => {
            // Check if the ingredient contains the word "serve" or "water"
            if (ingredient.toLowerCase().includes("serve") || ingredient.toLowerCase().includes("water")) {
                return; // Skip this ingredient if it contains "serve" or "water"
            }

            const parts = ingredient.split(' '); // Assuming ingredients are separated by spaces
            const base = parts[0]; // Use the first part as the base

            // Initialize the base in ingredientCount if it doesn't exist
            if (!ingredientCount[base]) {
                ingredientCount[base] = { ingredients: {}, dishes: [] };
            }

            // Count occurrences of each ingredient
            if (!ingredientCount[base].ingredients[ingredient]) {
                ingredientCount[base].ingredients[ingredient] = 0; // Initialize count
            }
            ingredientCount[base].ingredients[ingredient]++; // Increment count

            // Add the dish to the respective array if not already present
            if (!ingredientCount[base].dishes.includes(dish.name)) { // Assuming dish has a 'name' property
                ingredientCount[base].dishes.push(dish.name); // Store the name of the dish
            }
        });
    });

    // Display the total ingredients needed
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = ''; // Clear previous results

    for (const base in ingredientCount) {
        const { ingredients, dishes } = ingredientCount[base]; // Destructure the object

        // Create a new div for each unique ingredient grouping
        const div = document.createElement('div');
        div.className = 'ingredient-item';

        // Create a string with each ingredient and its count on a new line and related dishes below
        const ingredientLines = Object.entries(ingredients).map(([ingredient, count]) => `${ingredient} (x${count})`).join('<br>');

        div.innerHTML = `<strong>${base}:</strong><br>${ingredientLines}<br><br><em><strong>Related dishes:</strong> <br> ${dishes.join(', ')}</em>`;
        ingredientList.appendChild(div); // Append the new ingredient item div to the ingredient list
    }
}

// 取消添加菜品
function cancelAdd() {
    addFoodForm.classList.add('hidden'); // 隐藏添加食物表单
    // 清空输入框
    document.getElementById('foodName').value = '';
    document.getElementById('foodRecipe').value = '';
    document.getElementById('fooditem').value = ''; // Clear ingredients field
    document.getElementById('diff').value = ''; // Clear difficulty field
    document.getElementById('time').value = ''; // Clear time field
    document.getElementById('foodnote').value = ''; // Clear note field
}

// 显示日历项
function displayCalendarItems() {
    const calendarList = document.getElementById('calendarList');
    calendarList.innerHTML = ''; // 清空现有列表

    calendarData.forEach(dish => {
        const div = document.createElement('div');
        div.className = 'calendar-list';
        div.innerHTML = `
        <button class="all-detail-button" onclick="showDetails('${dish.name}', 'Calendar');">
            <h3>${dish.name}</h3>
            <ul class="diff">Difficulty: ${dish.difficulty}</ul>
            <ul class="time">Time: ${dish.time}</ul>
            <button class="delete" onclick="deletecal('${dish.name}'); event.stopPropagation();">
                <i class="fas fa-trash"></i>
            </button>
            <button class="calshowdetail" onclick="showDetails('${dish.name}', 'Calendar');">
                <i class="fa fa-bars"></i>
            </button>
        </button>
        `;
        calendarList.appendChild(div);
    });
}

// 清空日历中的所有项
function clearCalendar() {
    if (confirm("Are you sure you want to clear all calendar items?")) {
        calendarData = []; // 清空日历数据数组
        localStorage.removeItem('calendarData'); // 从本地存储中移除
        displayCalendarItems(); // 更新日历显示
        alert("All calendar items have been cleared."); // 显示清空消息
    }
}

// 页面加载时加载日历数据
if (localStorage.getItem('calendarData')) {
    loadCalendarFromLocalStorage();
}

init()
