/* SABO Mock Data & Frontend Logic */

// Mock Products Data
const products = [
    {
        id: 1,
        name: "Tabiiy Sigir Suti (1L)",
        category: "sut",
        price: 9000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
        description: "3.2% yog'li, toza fermer suti."
    },
    {
        id: 2,
        name: "Uy Qatig'i (1L)",
        category: "qatiq",
        price: 11000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
        description: "An'anaviy usulda achitilgan quyuq qatiq."
    },
    {
        id: 3,
        name: "Sarhil Qaymoq (400g)",
        category: "sut",
        price: 28000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
        description: "Tabiiy qaymoq, non bilan juda mazali."
    },
    {
        id: 4,
        name: "Fermer Pishlog'i (300g)",
        category: "pishloq",
        price: 32000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=80",
        description: "Sifatli pishloq, sun'iy qo'shimchalarsiz."
    },
    {
        id: 5,
        name: "Tvorog (500g)",
        category: "qatiq",
        price: 15000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=500&q=80",
        description: "Yog'sizlantirilgan foydali tvorog."
    },
    {
        id: 6,
        name: "Sariyog' (200g)",
        category: "sut",
        price: 24000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
        description: "100% tabiiy sigir sariyog'i."
    }
];

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('sabo_cart')) || [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        renderProducts(products);
    }
    updateCartCount();
});

// Render Products
function renderProducts(items) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = items.map(p => `
        <div class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col group">
            <div class="relative overflow-hidden h-56 bg-slate-100">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shadow">
                    <i class="fa-solid fa-star text-amber-400 mr-1"></i> ${p.rating}
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="font-extrabold text-lg text-slate-900 mb-1">${p.name}</h3>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">${p.description}</p>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span class="text-xl font-extrabold text-brand-600">${p.price.toLocaleString()} so'm</span>
                    <button onclick="addToCart(${p.id})" class="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 text-sm">
                        <i class="fa-solid fa-cart-plus"></i> Qo'shish
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white', 'shadow');
        btn.classList.add('bg-slate-100', 'text-slate-600');
    });
    event.target.classList.remove('bg-slate-100', 'text-slate-600');
    event.target.classList.add('bg-brand-600', 'text-white', 'shadow');

    if (category === 'all') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === category));
    }
}

// Toggle Cart Drawer
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        renderCartItems();
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartCount();
    showToast(`${product.name} savatchaga qo'shildi!`);
}

// Render Cart Items
function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400"><i class="fa-solid fa-cart-shopping text-4xl mb-3"></i><p>Savatchangiz bo'sh</p></div>`;
        totalEl.innerText = `0 so'm`;
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="font-bold text-slate-900 text-sm">${item.name}</h4>
                    <span class="text-xs text-brand-600 font-semibold">${item.price.toLocaleString()} so'm</span>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="changeQty(${index}, -1)" class="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600">-</button>
                        <span class="text-sm font-bold">${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    totalEl.innerText = `${total.toLocaleString()} so'm`;
}

// Change Quantity
function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Save Cart
function saveCart() {
    localStorage.setItem('sabo_cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = count;
    }
}

// Checkout simulation
function checkout() {
    if (cart.length === 0) {
        alert("Savatcha bo'sh!");
        return;
    }
    alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada operatorimiz bog'lanadi.");
    cart = [];
    saveCart();
    toggleCart();
    updateCartCount();
}

// Auth mock actions
function handleLogin(e) {
    e.preventDefault();
    alert("Muvaffaqiyatli kirildi!");
    window.location.href = "pages.html?tab=profile";
}

function handleRegister(e) {
    e.preventDefault();
    alert("Hisobingiz muvaffaqiyatli yaratildi!");
    window.location.href = "pages.html?tab=profile";
}

function handleLogout() {
    alert("Tizimdan chiqildi.");
    window.location.href = "index.html";
}

// Toast helper
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce text-sm font-semibold';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
