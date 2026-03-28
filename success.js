const order = JSON.parse(localStorage.getItem("lastOrder"));

if (!order) {
  alert("No order found!");
  window.location.href = "home.html";
}

// Customer Details
document.getElementById("customerName").textContent = order.customer.name || "N/A";
document.getElementById("customerEmail").textContent = order.customer.email || "N/A";
document.getElementById("customerPhone").textContent = order.customer.phone || "N/A";
document.getElementById("customerAddress").textContent = order.customer.address || "N/A";
document.getElementById("paymentMethod").textContent = order.customer.paymentMethod || "N/A";

// Ordered Items
const orderedItems = document.getElementById("orderedItems");

order.items.forEach(item => {
  const qty = item.qty || 1;
  const size = item.size || "N/A";
  const price = Number(item.price) || 0;
  const itemTotal = price * qty;

  orderedItems.innerHTML += `
    <div class="order-item">
      <div class="order-left">
        <strong>${item.name}</strong>
        <small>Size: ${size} | Qty: ${qty} | ₹${price} each</small>
      </div>
      <div>₹${itemTotal}</div>
    </div>
  `;
});

// Bill
document.getElementById("subtotal").textContent = order.subtotal || "0";
document.getElementById("shipping").textContent = order.shipping || "0";
document.getElementById("total").textContent = order.total || "0";