let selectedMembership = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function togglePayment(plan, price, duration, benefits, button) {
  // Remove previous selected states
  document.querySelectorAll(".plan").forEach(planCard => {
    planCard.classList.remove("selected");
  });

  document.querySelectorAll(".plan button").forEach(btn => {
    btn.classList.remove("active-btn");
    btn.textContent = "Join Now";
  });

  // Select current card
  const selectedCard = button.closest(".plan");
  selectedCard.classList.add("selected");
  button.classList.add("active-btn");
  button.textContent = "Selected";

  // Save selected membership temporarily
  selectedMembership = {
    plan,
    price,
    duration,
    benefits
  };

  // Show payment section
  const paymentSection = document.getElementById("paymentSection");
  const selectedPlanText = document.getElementById("selectedPlanText");

  selectedPlanText.innerHTML = `
    <strong>Selected Plan:</strong> ${plan} <br>
    <strong>Amount:</strong> ₹${price} <br>
    <strong>Duration:</strong> ${duration}
  `;

  paymentSection.classList.remove("hidden");
  paymentSection.scrollIntoView({ behavior: "smooth" });

  showToast(`${plan} plan selected. Choose payment method.`);
}

async function payMembership() {
  if (!selectedMembership) {
    showToast("Please select a membership plan first.");
    return;
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  const payBtn = document.getElementById("payBtn");
  payBtn.textContent = "Processing...";
  payBtn.disabled = true;

  const finalData = {
    ...selectedMembership,
    paymentMethod
  };

  try {
    // Save in localStorage
    localStorage.setItem("selectedMembership", JSON.stringify(finalData));

    // OPTIONAL: send to backend
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
        window.location.href = "profile.html";// or success.html
      }, 1500);
    } else {
      showToast("Failed to save membership.");
    }

  } catch (error) {
    console.error("Error:", error);
    showToast("Server error. Try again.");
  }

  payBtn.textContent = "Pay Now";
  payBtn.disabled = false;
}