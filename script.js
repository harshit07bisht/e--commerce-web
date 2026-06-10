const searchBtn = document.getElementById("search-btn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const productCards = document.querySelectorAll(".product-card");
const cartCounter = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const total = document.getElementById("total-price");
const summaryCount = document.getElementById("summary-count");
const checkoutBtn = document.querySelector(".checkout-btn");
const CART_STORAGE_KEY = "fashionx_cart";

function getCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : { items: [], total: 0 };
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  if (!cartCounter) return;
  const cart = getCart();
  cartCounter.innerText = cart.items.length;
}

function renderCart() {
  if (!cartItems || !total) return;
  const cart = getCart();

  if (!cart.items.length) {
    cartItems.innerHTML = `\n      <p class="empty-cart">Your cart is currently empty.</p>\n    `;
    total.innerText = `Total: ₹0`;
    if (summaryCount) summaryCount.innerText = "0 items";
    return;
  }

  cartItems.innerHTML = "";
  cart.items.forEach((item, index) => {
    const entry = document.createElement("div");
    entry.classList.add("cart-item");
    entry.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${item.price}</p>
      </div>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartItems.appendChild(entry);
  });

  total.innerText = `Total: ₹${cart.total}`;
  if (summaryCount) summaryCount.innerText = `${cart.items.length} item${cart.items.length > 1 ? "s" : ""}`;
}

function addToCart(name, price, image, numericPrice) {
  const cart = getCart();
  cart.items.push({ name, price, image, numericPrice });
  cart.total += numericPrice;
  saveCart(cart);
  updateCartCount();
}

function removeFromCart(index) {
  const cart = getCart();
  if (index < 0 || index >= cart.items.length) return;
  cart.total -= cart.items[index].numericPrice;
  cart.items.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function clearCart() {
  saveCart({ items: [], total: 0 });
  updateCartCount();
  renderCart();
}

if (searchBtn && searchBox) {
  searchBtn.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
      searchInput.focus();
    }
  });
}

if (searchInput && productCards.length) {
  searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();
    productCards.forEach((card) => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      const category = card.dataset.category || "";
      const match = title.includes(value) || category.includes(value);
      card.style.display = match ? "grid" : "none";
    });
  });
}

updateCartCount();
renderCart();

const cartButtons = document.querySelectorAll(".add-cart");
cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.querySelector("h3").innerText;
    const price = card.querySelector(".price").innerText;
    const image = card.querySelector("img").src;
    const numericPrice = Number(price.replace("₹", ""));
    addToCart(name, price, image, numericPrice);
    renderCart();
    if (button.innerText.toLowerCase().includes("add")) {
      button.innerText = "Added";
      setTimeout(() => {
        button.innerText = "Add to Cart";
      }, 1200);
    }
  });
});

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
      const index = Number(event.target.dataset.index);
      removeFromCart(index);
    }
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.items.length) {
      alert("Your cart is empty.");
      return;
    }
    alert("Thank you! Your order has been placed.");
    clearCart();
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    contactForm.reset();
  });
}

const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Subscribed successfully!");
    newsletterForm.reset();
  });
}
