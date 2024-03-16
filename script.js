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

let currentPlan = 0;

// Handle initial step and count selection
initializeStep();

// Function to handle initial step and count selection

multiStepForm.addEventListener("click", handleStepChange);

billingCycleCheckbox.addEventListener("change", updatePriceDisplay);

changeBtn.addEventListener("click", () => {
  currentStep = 1;
  currentStepCount = 1;
  showCurrentStep()
  showCurrentCountStep()
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

function handleStepChange(event) {
  if (!event.target.matches("[data-next],[data-prev]")) return;

  event.preventDefault();
  const incrementor = event.target.matches("[data-next]") ? 1 : -1;

  const inputs = [...formSteps[currentStep].querySelectorAll("input")];
  const allValid = inputs.every((input) => input.reportValidity());
  console.log(allValid);
  if (allValid) {
    currentStep += incrementor;
    currentStepCount = currentStep;
    showCurrentStep();
    showCurrentCountStep();
    updateFinalPrice();
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

  summaryPlanPrice.textContent = selectedPlanPrice;
}

// Function to update price display based on billing cycle
function updatePriceDisplay() {
  const cycleTotal = document.querySelector("[data-cycle]");
  let discount = document.querySelectorAll(".year-free");
  const switchWrapper = document.querySelectorAll(".switch-wrapper span");
  cycleTotal.textContent = billingCycleCheckbox.checked ? "Yearly" : "Monthly";
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

  formPlans.forEach((plan) => updatePlanSelection(plan)); // Update all plan prices

  const addOnPrices = document.querySelectorAll(".add-on-choice .price-choice");
  addOnPrices.forEach((priceElement) => {
    const prices = priceElement.dataset.payment.split(", ");
    const selectedPrice = billingCycleCheckbox.checked ? prices[1] : prices[0];
    priceElement.textContent = selectedPrice;
  });
  updateChosenServices();
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
