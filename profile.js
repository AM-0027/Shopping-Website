// ==========================
// LOAD MEMBERSHIP DETAILS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadMembership();
});

function loadMembership() {
  // get selected membership from localStorage
  const selectedPlan = JSON.parse(localStorage.getItem("selectedMembership"));

  const planName = document.getElementById("planName");
  const planPrice = document.getElementById("planPrice");
  const planDuration = document.getElementById("planDuration");
  const planBenefits = document.getElementById("planBenefits");
  const finalTotal = document.getElementById("finalTotal");

  if (selectedPlan) {
    planName.textContent = selectedPlan.name || "No Plan";
    planPrice.textContent = selectedPlan.price || 0;
    planDuration.textContent = selectedPlan.duration || "-";
    planBenefits.textContent = selectedPlan.benefits || "-";
    finalTotal.textContent = selectedPlan.price || 0;
  } else {
    planName.textContent = "No Membership Selected";
    planPrice.textContent = "0";
    planDuration.textContent = "-";
    planBenefits.textContent = "-";
    finalTotal.textContent = "0";
  }
}

// ==========================
// PAY MEMBERSHIP
// ==========================
function payMembership() {
  const selectedPlan = JSON.parse(localStorage.getItem("selectedMembership"));

  if (!selectedPlan) {
    showToast("⚠ No membership selected!");
    return;
  }

  // get selected payment method
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  // save active membership
  const activeMembership = {
    ...selectedPlan,
    paymentMethod: paymentMethod,
    status: "Active",
    activatedOn: new Date().toLocaleDateString()
  };

  localStorage.setItem("activeMembership", JSON.stringify(activeMembership));

  showToast("✅ Membership Activated Successfully!");

  createMembershipCard(activeMembership);

  // optional: scroll to card
  setTimeout(() => {
    const card = document.querySelector(".active-membership-card");
    if (card) {
      card.scrollIntoView({ behavior: "smooth" });
    }
  }, 500);
}

// ==========================
// CREATE ACTIVE MEMBERSHIP CARD
// ==========================
function createMembershipCard(plan) {
  // remove old card if already exists
  const oldCard = document.querySelector(".active-membership-card");
  if (oldCard) oldCard.remove();

  const paymentBox = document.querySelector(".payment-box");

  const card = document.createElement("div");
  card.className = "active-membership-card";

  card.innerHTML = `
    <h2>🎉 Active Membership</h2>
    <div class="mini-card">
      <p><strong>Plan:</strong> ${plan.name}</p>
      <p><strong>Price:</strong> ₹${plan.price}</p>
      <p><strong>Duration:</strong> ${plan.duration}</p>
      <p><strong>Benefits:</strong> ${plan.benefits}</p>
      <p><strong>Payment:</strong> ${plan.paymentMethod}</p>
      <p><strong>Status:</strong> <span class="active-status">${plan.status}</span></p>
      <p><strong>Activated On:</strong> ${plan.activatedOn}</p>
    </div>
  `;

  paymentBox.appendChild(card);
}

// ==========================
// TOAST MESSAGE
// ==========================
function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}