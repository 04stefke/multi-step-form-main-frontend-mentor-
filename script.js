// calling all needed elements
const multiStepForm = document.querySelector("[data-multi-step-form]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
const stepCount = [...document.querySelectorAll("[data-step-number]")];
const changeBtn = document.querySelector(".changeBtn");
const billingCycleCheckbox = document.getElementById("billingCycle");
const formPlans = [...multiStepForm.querySelectorAll("[data-plan]")];
const summaryPlan = document.querySelector(".chosen-product");
const summaryPlanPrice = document.querySelector(".final-product-price");
const addOnCheckBox = document.querySelectorAll(
  '.add-on-choice input[type="checkbox"]'
);

let selectedAddOns = [];
// setting the current steps and count

let currentStep = formSteps.findIndex((step) =>
  step.classList.contains("active")
);

let currentStepCount = stepCount.findIndex((count) =>
  count.classList.contains("active")
);

let currentPlan = formPlans.findIndex((plan) =>
  plan.classList.contains("active")
);

let totalPrice = 0;
let currentPlanPrice = parseFloat(
  formPlans[0]
    .querySelector(".price")
    .dataset.payment.split(", ")
    [billingCycleCheckbox.checked ? 1 : 0].slice(1)
    .replace(/[^0-9.]/g, "")
);

// Handle initial step and count selection
initializeStep();

// Function to handle initial step and count selection
multiStepForm.addEventListener("click", handleStepChange);

billingCycleCheckbox.addEventListener("change", () => updatePriceDisplay());

changeBtn.addEventListener("click", () => {
  currentStep = 1;
  currentStepCount = 1;
  showCurrentStep();
  showCurrentCountStep();
});

addOnCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const addOn = e.target.closest(".add-on-choice");
    if (e.target.checked) {
      selectedAddOns.push(addOn);
      addOn.classList.add("active");
    } else {
      selectedAddOns = selectedAddOns.filter((item) => item !== addOn);
      addOn.classList.remove("active");
    }

    updateChosenServices();
  });
});

function calculateTotalPrice() {
  totalPrice = 0;
  totalPrice += currentPlanPrice;

  selectedAddOns.forEach((addon) => {
    const addOnPriceElem = addon.querySelector(".price-choice");
    const addOnPrice =
      addOnPriceElem.dataset.payment.split(", ")[
        billingCycleCheckbox.checked ? 1 : 0
      ];
    const addOnPriceNumber = parseFloat(
      addOnPrice.slice(1).replace(/[^0-9.]/g, "")
    );
    totalPrice += addOnPriceNumber;
  });

  const totalPriceElem = document.querySelector(".totalOfProducts");
  totalPriceElem.textContent = billingCycleCheckbox.checked
    ? `$${totalPrice.toFixed(2)}/yr`
    : `$${totalPrice.toFixed(2)}/mo`;
  const totalDef = document.querySelector(".total-def");
  totalDef.textContent = billingCycleCheckbox.checked
    ? "(per year)"
    : "(per month)";
}

function handleStepChange(event) {
  if (!event.target.matches("[data-next],[data-prev]")) return;

  event.preventDefault();
  const incrementor = event.target.matches("[data-next]") ? 1 : -1;

  const inputs = [...formSteps[currentStep].querySelectorAll("input")];
  const allValid = inputs.every((input) => input.reportValidity());

  if (allValid) {
    currentStep += incrementor;
    currentStepCount = currentStep;
    showCurrentStep();
    showCurrentCountStep();
    updatePlanSelection(formPlans[currentPlan]);
    calculateTotalPrice();
  }
}

// showCurrentStep gives the selected step an active class to apply styles
function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });
}

// showCurrentCountStep gives the selected stepCount an active class to apply styles

function showCurrentCountStep() {
  stepCount.forEach((count, index) => {
    count.classList.toggle("active", index === currentStepCount);
  });
}

// for every plan giving an event listener to update the currentPlan value to the selected one

formPlans.forEach((plan, index) => {
  plan.addEventListener("click", () => {
    currentPlan = index;
    updatePlanSelection(plan);
    updatePriceDisplay();
    showCurrentPlan();
  });
});

// this gives the plan an active class to apply different styles

function showCurrentPlan() {
  formPlans.forEach((plan, index) => {
    plan.classList.toggle("active", index === currentPlan);
  });
}

// Function to update plan selection and summary
function updatePlanSelection(plan) {
  if (!plan) {
    return;
  }

  const selectedPlanName = plan.querySelector(".info p").textContent;
  const selectedPlanPrices = plan
    .querySelector(".price")
    .dataset.payment.split(", ");
  const selectedPlanPrice = billingCycleCheckbox.checked
    ? selectedPlanPrices[1]
    : selectedPlanPrices[0];

  summaryPlan.textContent = selectedPlanName;
  summaryPlanPrice.textContent = selectedPlanPrice;

  plan.querySelector(".price").textContent = selectedPlanPrice;
}

function updateFinalPrice() {
  const selectedPlanPrices = formPlans[currentPlan]
    .querySelector(".price")
    .dataset.payment.split(", ");
  const selectedPlanPrice = billingCycleCheckbox.checked
    ? selectedPlanPrices[1]
    : selectedPlanPrices[0];
  console.log(selectedPlanPrice);
}

// Function to update price display based on billing cycle
function updatePriceDisplay() {
  const cycleTotal = document.querySelector("[data-cycle]");
  let discount = document.querySelectorAll(".year-free");
  const switchWrapper = document.querySelectorAll(".switch-wrapper span");
  cycleTotal.textContent = billingCycleCheckbox.checked ? "(Yearly)" : "(Monthly)";
  discount.forEach((item) => {
    billingCycleCheckbox.checked
      ? item.classList.remove("hide")
      : item.classList.add("hide");
  });

  if (billingCycleCheckbox.checked) {
    switchWrapper[0].classList.remove("bold");
    switchWrapper[2].classList.add("bold");
  } else {
    switchWrapper[0].classList.add("bold");
    switchWrapper[2].classList.remove("bold");
  }

  formPlans.forEach((plan) => updatePlanSelection(plan));

  updatePlanSelection(formPlans[currentPlan]);

  const selectedPlanPrices = formPlans[currentPlan]
    .querySelector(".price")
    .dataset.payment.split(", ");
  currentPlanPrice = billingCycleCheckbox.checked
    ? parseFloat(selectedPlanPrices[1].slice(1).replace(/[^0-9.]/g, ""))
    : parseFloat(selectedPlanPrices[0].slice(1).replace(/[^0-9.]/g, ""));

  const addOnPrices = document.querySelectorAll(".add-on-choice .price-choice");
  addOnPrices.forEach((priceElement) => {
    const prices = priceElement.dataset.payment.split(", ");
    const selectedPrice = billingCycleCheckbox.checked ? prices[1] : prices[0];
    priceElement.textContent = selectedPrice;
  });

  updateChosenServices();
  calculateTotalPrice();
}

function updateChosenServices() {
  const chosenServices = document.querySelector(".chosen-services");
  chosenServices.innerHTML = "";

  if (selectedAddOns.length === 0) {
    chosenServices.textContent = "No Add-Ons Selected";
    return;
  }

  selectedAddOns.forEach((addOn) => {
    const addOnTitle = addOn.querySelector(".add-on-title").textContent;
    const addOnPriceElem = addOn.querySelector(".price-choice");
    const addOnPrice = addOnPriceElem.textContent;

    const serviceItem = document.createElement("div");
    serviceItem.classList.add("chosen-service-item");
    serviceItem.innerHTML = `<p>${addOnTitle}</p><span>${addOnPrice}</span>`;

    chosenServices.appendChild(serviceItem);
  });
}

updateChosenServices();

function initializeStep() {
  if (currentStep < 0) {
    currentStep = 0;
  }
  if (currentStepCount < 0) {
    currentStepCount = 0;
  }
  showCurrentStep();
  showCurrentCountStep();
  updatePlanSelection(formPlans[currentPlan]);
}

document.addEventListener(
  "invalid",
  (function () {
    return function (e) {
      e.preventDefault();
      const input = e.target;
      const errorSpan = input.nextElementSibling;
      input.classList.add("error");
      errorSpan.classList.remove("hide");
    };
  })(),
  true
);

const inputs = document.querySelectorAll(".input input");
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const errSpan = input.nextElementSibling;
    input.classList.remove("error");
    errSpan.classList.add("hide");
  });
});
