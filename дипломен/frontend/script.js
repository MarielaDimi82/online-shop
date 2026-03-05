/******************************
 *  CART SYSTEM
 ******************************/
const cart = [];

// Форматиране на цена
function fmt(v) {
    return '€' + v.toFixed(2);
}

// Добавяне в количката
function addToCart(id) {
    const p = products.find(x => x.id === +id);
    if (!p) return;

    const found = cart.find(i => i.id === p.id);
    if (found) found.qty++;
    else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });

    updateCartCount();
}

// Обновяване броя на количката
function updateCartCount() {
    const cnt = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartBtn').textContent = `Cart (${cnt})`;
}

// Отваряне/затваряне на количката
function openCart() {
    document.getElementById('cartModal').setAttribute('aria-hidden', 'false');
    renderCart();
}

function closeCart() {
    document.getElementById('cartModal').setAttribute('aria-hidden', 'true');
}

// Рендериране на количката
function renderCart() {
    const list = document.getElementById('cartList');
    list.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="width:48px;height:48px;background:#f0edf7;border-radius:8px;"></div>
            <div style="flex:1">
                <strong>${item.name}</strong>
                <div style="color:#666">${fmt(item.price)} × ${item.qty}</div>
            </div>
            <div>${fmt(item.price * item.qty)}</div>
        `;
        list.appendChild(li);
        total += item.price * item.qty;
    });

    document.getElementById('cartTotal').textContent = fmt(total);
}

/******************************
 *  PRODUCT DATA
 ******************************/
const products = [
    {
        id: 1,
        name: "Розов букет",
        price: 45,
        colors: ["pink"],
        type: "roses",
        category: "romantic",
        image: "frontend/images/pexels-amina-filkins-5410132.jpg"
    },
    {
        id: 2,
        name: "Пролетен букет",
        price: 55,
        colors: ["yellow"],
        type: "tulips",
        category: "special",
        image: "frontend/images/bouquet2.jpg"
    },
    {
        id: 3,
        name: "Романтичен букет",
        price: 60,
        colors: ["red"],
        type: "roses",
        category: "wedding",
        image: "frontend/images/bouquet3.jpg"
    }
];

/******************************
 *  PRODUCT RENDERING
 ******************************/
function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = "";

    list.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.price} лв.</p>
                <button class="add-btn" data-id="${p.id}">Добави в количката</button>
            </div>
        `;
    });
}

/******************************
 *  FILTER SYSTEM
 ******************************/
function getUnique(field) {
    const set = new Set();
    products.forEach(p => {
        if (Array.isArray(p[field])) p[field].forEach(v => set.add(v));
        else if (p[field]) set.add(p[field]);
    });
    return Array.from(set).sort();
}

function populateFilterOptions() {
    const colorSelect = document.getElementById('filterColor');
    const typeSelect = document.getElementById('filterType');

    if (colorSelect) {
        const colors = getUnique('colors');
        colors.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c[0].toUpperCase() + c.slice(1);
            colorSelect.appendChild(opt);
        });
    }

    if (typeSelect) {
        const types = getUnique('type');
        types.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t[0].toUpperCase() + t.slice(1);
            typeSelect.appendChild(opt);
        });
    }
}

function applyFilters() {
    const color = document.getElementById('filterColor')?.value || 'any';
    const type = document.getElementById('filterType')?.value || 'any';
    const min = parseFloat(document.getElementById('priceMin')?.value || '') || 0;
    const maxRaw = document.getElementById('priceMax')?.value || '';
    const max = maxRaw === '' ? Infinity : parseFloat(maxRaw);

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';

    const out = products.filter(p => {
        if (category !== 'all' && p.category !== category) return false;
        if (color !== 'any' && !(p.colors || []).includes(color)) return false;
        if (type !== 'any' && p.type !== type) return false;
        if (p.price < min) return false;
        if (p.price > max) return false;
        return true;
    });

    renderProducts(out);
}

function resetFilters() {
    document.getElementById('filterColor').value = 'any';
    document.getElementById('filterType').value = 'any';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    applyFilters();
}

/******************************
 *  EVENT LISTENERS
 ******************************/
document.addEventListener('click', e => {
    if (e.target.matches('.add-btn')) addToCart(e.target.dataset.id);
    if (e.target.id === 'cartBtn') openCart();
    if (e.target.id === 'closeCart') closeCart();
    if (e.target.id === 'checkout') {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        window.location.href = 'checkout.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    populateFilterOptions();
    applyFilters();
});
