// Ganti angka ini dengan nomor WhatsApp kamu: kode negara tanpa tanda + atau spasi.
const WHATSAPP_NUMBER = "0895359634700";

const menu = [
  { id: 1, name: "Nasi Goreng Kampung", category: "Nasi", price: 22000, emoji: "🍳", description: "Nasi goreng, telur, ayam suwir, dan acar segar.", tag: "Best seller" },
  { id: 2, name: "Nasi Padang Komplit", category: "Nasi", price: 32000, emoji: "🍛", description: "Rendang, sayur nangka, sambal ijo, dan nasi hangat.", tag: "Favorit" },
  { id: 3, name: "Ayam Bakar Madu", category: "Lauk", price: 28000, emoji: "🍗", description: "Ayam bakar bumbu manis gurih dengan lalapan.", tag: "Baru" },
  { id: 4, name: "Soto Ayam Lamongan", category: "Lauk", price: 20000, emoji: "🍲", description: "Kuah kuning gurih, suwiran ayam, koya, dan jeruk.", tag: "Hangat" },
  { id: 5, name: "Es Cendol Gula Aren", category: "Minuman", price: 14000, emoji: "🥤", description: "Cendol lembut, santan, dan gula aren asli.", tag: "Segar" },
  { id: 6, name: "Teh Manis Jawa", category: "Minuman", price: 8000, emoji: "🍵", description: "Teh wangi melati dengan manis yang pas.", tag: "Klasik" }
];

let cart = [];
const rupiah = (value) => `Rp${value.toLocaleString("id-ID")}`;
const menuGrid = document.querySelector("#menuGrid");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartBackdrop = document.querySelector("#cartBackdrop");
const emptyCart = document.querySelector("#emptyCart");
const checkoutArea = document.querySelector("#checkoutArea");

function renderMenu(category = "Semua") {
  const visibleMenu = category === "Semua" ? menu : menu.filter((item) => item.category === category);
  menuGrid.innerHTML = visibleMenu.map((item) => `
    <article class="menu-card">
      <div class="food-visual"><span aria-hidden="true">${item.emoji}</span><span class="food-tag">${item.tag}</span></div>
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-bottom"><span class="price">${rupiah(item.price)}</span><button class="add-button" data-add="${item.id}" type="button"><span aria-hidden="true">+</span> Tambah</button></div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = rupiah(total);
  emptyCart.classList.toggle("visible", cart.length === 0);
  checkoutArea.style.display = cart.length ? "block" : "none";
  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <span class="cart-item-emoji" aria-hidden="true">${item.emoji}</span>
      <div class="cart-item-info"><strong>${item.name}</strong><small>${rupiah(item.price * item.quantity)}</small></div>
      <div class="qty-control"><button data-decrease="${item.id}" type="button" aria-label="Kurangi ${item.name}">−</button><span>${item.quantity}</span><button data-increase="${item.id}" type="button" aria-label="Tambah ${item.name}">+</button></div>
    </div>
  `).join("");
}

function updateQuantity(id, change) {
  const selected = cart.find((item) => item.id === id);
  if (!selected) return;
  selected.quantity += change;
  if (selected.quantity <= 0) cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
}

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const selected = menu.find((item) => item.id === Number(button.dataset.add));
  const existing = cart.find((item) => item.id === selected.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...selected, quantity: 1 });
  renderCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase) updateQuantity(Number(increase.dataset.increase), 1);
  if (decrease) updateQuantity(Number(decrease.dataset.decrease), -1);
});

document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".category-tab.active").classList.remove("active");
    tab.classList.add("active");
    renderMenu(tab.dataset.category);
  });
});

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCart(); });

document.querySelector("#orderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.length) return;
  const customerName = document.querySelector("#customerName").value.trim();
  const note = document.querySelector("#orderNote").value.trim();
  const orderLines = cart.map((item) => `- ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}`).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Halo Warung Rasa Ibu, saya mau pesan:\n\n${orderLines}\n\nTotal: ${rupiah(total)}\nNama: ${customerName}${note ? `\nCatatan: ${note}` : ""}\n\nMohon dikonfirmasi ya. Terima kasih!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

document.querySelector("#contactWhatsapp").addEventListener("click", () => {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo Warung Rasa Ibu, saya mau tanya tentang menu hari ini.")}`, "_blank");
});

renderMenu();
renderCart();
