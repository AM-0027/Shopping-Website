function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Get cart + membership from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const membership = JSON.parse(localStorage.getItem("selectedMembership")) || null;

let cartTotal = 0;
let membershipPrice = 0;

// Show cart items
const cartItemsContainer = document.getElementById("cartItems");

if (cart.length === 0) {
  cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
} else {
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    cartTotal += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Total: ₹${itemTotal}</p>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });
}

document.getElementById("cartTotal").textContent = cartTotal;

// Show membership
if (membership) {
  document.getElementById("planName").textContent = membership.plan;
  document.getElementById("planPrice").textContent = membership.price;
  document.getElementById("planDuration").textContent = membership.duration;
  document.getElementById("planBenefits").textContent = membership.benefits;
  membershipPrice = membership.price;
}

// Final total
const finalTotal = cartTotal + membershipPrice;
document.getElementById("finalTotal").textContent = finalTotal;

// Payment function
async function payMembership() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const payBtn = document.getElementById("payBtn");

  payBtn.textContent = "Processing...";
  payBtn.disabled = true;

  const finalData = {
    cart,
    membership,
    cartTotal,
    membershipPrice,
    finalTotal,
    paymentMethod
  };

  try {
    const response = await fetch("/save-membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalData)
    });

    const result = await response.json();

    if (result.success) {
      showToast(`Payment successful via ${paymentMethod}!`);

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);
    } else {
      showToast("Failed to save payment.");
    }

  } catch (error) {
    console.error("Error:", error);
    showToast("Server error. Try again.");
  }

  payBtn.textContent = "Pay Now";
  payBtn.disabled = false;
}