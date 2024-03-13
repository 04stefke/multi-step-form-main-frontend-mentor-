const multiStepForm = document.querySelector('[data-multi-step-form]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]
const stepCount = [...document.querySelectorAll('[data-step-number]')]

const billingCycleCheckbox = document.getElementById('billingCycle')
const formPlans = [...multiStepForm.querySelectorAll('[data-plan]')]

let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active')
})

let currentStepCount = stepCount.findIndex(count => {
    return count.classList.contains('active')
})

if(currentStep < 0){
    currentStep = 0
    showCurrentStep()
}
console.log(currentStep)
if(currentStepCount < 0) {
    currentStepCount = 0
    showCurrentCountStep()
}
console.log(currentStepCount)

multiStepForm.addEventListener('click', e => {
    let incrementor

    if(e.target.matches('[data-next]')){
        e.preventDefault()
        incrementor = 1    
    } else if(e.target.matches('[data-prev]')){
        e.preventDefault()
        incrementor = -1
    }

    if(incrementor == null) return

    const inputs = [...formSteps[currentStep].querySelectorAll('input')]
    const allValid = inputs.every(input => input.reportValidity())

    if(allValid) {
        currentStep += incrementor
        currentStepCount = currentStep
        showCurrentStep()
        showCurrentCountStep()
    }
    
    showCurrentStep()
})

function showCurrentStep () {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep)
    })
}

function showCurrentCountStep( ){
    stepCount.forEach((count, index) => {
        count.classList.toggle('active', index === currentStepCount)
    })
}

let currentPlan = formPlans.findIndex(plan => {
    return plan.classList.contains('active')
})

if(currentPlan < 0) {
    currentPlan = 0
    showCurrentPlan()
}

formPlans.forEach((plan, index) => {
    plan.addEventListener('click', e => {
        currentPlan = index
        showCurrentPlan()
    })
})

function showCurrentPlan () {
    formPlans.forEach((plan, index) => {
        plan.classList.toggle('active', index === currentPlan)
    })
}



billingCycleCheckbox.addEventListener('change', function(){
    const priceData = document.querySelectorAll('.price')

    priceData.forEach((data) => {
        const priceElement = data.dataset.payment.split(', ')
        const monthlyPrice = priceElement[0]
        const yearlyPrice = priceElement[1]
        const bonus = document.querySelectorAll('.year-free')

        if(billingCycleCheckbox.checked){
            data.textContent = yearlyPrice
            // totalPrice.textContent = updateTotalPrice(yearlyPrice)
            bonus.forEach(item => item.classList.remove('hide'))
        } else {
            data.textContent = monthlyPrice
            // totalPrice.textContent = updateTotalPrice(monthlyPrice)
            bonus.forEach(item => item.classList.add('hide'))
        }
    
    })
    console.log(priceData)

    console.log()

    const chosenProductPrice = document.querySelector('.final-product-price')
    // const totalPrice = document.querySelector('.total p')
})

function updateTotalPrice(price){
    let total = parseFloat(price.slice(1))

    const addOnChoices = document.querySelectorAll('.add-on-choice input[type="checkbox"]')
    const addOnPrices = document.querySelectorAll('.add-on-choice .price-choice')

    for (let i = 0; i < addOnChoices.length; i++) {
        if(addOnChoices[i].checked){
            total += parseFloat(addOnPrices[i].textContent.slice(i))
        }
        
    }

    return '$' + total.toFixed(2)

}
