let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const subtotalAmount = document.getElementById("subtotalAmount");
const shippingAmount = document.getElementById("shippingAmount");
const finalTotal = document.getElementById("finalTotal");

let subtotal = 0;
const shipping = 50;

// Load cart items in checkout page
function loadCheckout() {
  orderSummary.innerHTML = "";
  subtotal = 0;

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Your cart is empty 😢</p>";
    subtotalAmount.textContent = "0";
    shippingAmount.textContent = "0";
    finalTotal.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const qty = item.qty || 1;
    const size = item.size || "N/A";
    const price = Number(item.price) || 0;
    const itemSubtotal = price * qty;

    subtotal += itemSubtotal;

    orderSummary.innerHTML += `
      <div class="order-item">
        <div class="order-left">
          <strong>${item.name}</strong>
          <small>Size: ${size} | Qty: ${qty} | ₹${price} each</small>
        </div>
        <div>₹${itemSubtotal}</div>
      </div>
    `;
  });

  const total = subtotal + shipping;

  subtotalAmount.textContent = subtotal;
  shippingAmount.textContent = shipping;
  finalTotal.textContent = total;
}

// Place order
function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!name || !email || !phone || !address) {
    alert("Please fill all billing details!");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderData = {
    customer: {
      name,
      email,
      phone,
      address,
      paymentMethod
    },
    items: cart,
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping
  };



  console.log("Order Placed:", orderData);

  localStorage.setItem("lastOrder", JSON.stringify(orderData));
  localStorage.removeItem("cart");

  alert("Order placed successfully!");
  window.location.href = "success.html";
}

// Load on page open
loadCheckout();

// checkout.js

const paymentMethod = document.getElementById("paymentMethod");
const placeBtn = document.querySelector(".place-btn");

// Container to insert payment fields
const paymentFieldsContainer = document.createElement("div");
paymentFieldsContainer.id = "paymentFields";
paymentFieldsContainer.style.marginTop = "15px";
paymentMethod.parentElement.appendChild(paymentFieldsContainer);

// Listen for payment method change
paymentMethod.addEventListener("change", () => {
  const method = paymentMethod.value;
  paymentFieldsContainer.innerHTML = ""; // Clear previous fields

  if (method === "UPI") {
    const upiInput = document.createElement("input");
    upiInput.type = "text";
    upiInput.id = "upiId";
    upiInput.placeholder = "Enter your UPI ID";
    upiInput.required = true;
    paymentFieldsContainer.appendChild(upiInput);
  } 
  else if (method === "Card") {
    const cardNumber = document.createElement("input");
    cardNumber.type = "text";
    cardNumber.id = "cardNumber";
    cardNumber.placeholder = "Card Number";
    cardNumber.maxLength = 16;
    cardNumber.required = true;

    const expiry = document.createElement("input");
    expiry.type = "text";
    expiry.id = "expiry";
    expiry.placeholder = "MM/YY";
    expiry.maxLength = 5;
    expiry.required = true;

    const cvv = document.createElement("input");
    cvv.type = "password";
    cvv.id = "cvv";
    cvv.placeholder = "CVV";
    cvv.maxLength = 3;
    cvv.required = true;

    paymentFieldsContainer.appendChild(cardNumber);
    paymentFieldsContainer.appendChild(expiry);
    paymentFieldsContainer.appendChild(cvv);
  }
});

// Place order function
function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const method = paymentMethod.value;

  if (!name || !email || !phone || !address) {
    alert("Please fill in all billing details.");
    return;
  }

  if (method === "UPI") {
    const upiId = document.getElementById("upiId").value.trim();
    if (!upiId) {
      alert("Please enter your UPI ID.");
      return;
    }
    alert(`Payment of ₹${document.getElementById("finalTotal").textContent} received via UPI (${upiId}). Order placed successfully!`);
  } 
  else if (method === "Card") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill all card details.");
      return;
    }
    alert(`Payment of ₹${document.getElementById("finalTotal").textContent} received via Card ending ${cardNumber.slice(-4)}. Order placed successfully!`);
  } 
  else {
    alert(`Order placed successfully with Cash on Delivery. Total: ₹${document.getElementById("finalTotal").textContent}`);
  }

  // Optionally, clear cart & redirect
  localStorage.removeItem("cart");
  window.location.href = "success.html";
}