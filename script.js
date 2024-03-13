// calling all needed elements 
const multiStepForm = document.querySelector('[data-multi-step-form]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]
const stepCount = [...document.querySelectorAll('[data-step-number]')]

const billingCycleCheckbox = document.getElementById('billingCycle')
const formPlans = [...multiStepForm.querySelectorAll('[data-plan]')]

// setting the current steps and count

let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active')
})

let currentStepCount = stepCount.findIndex(count => {
    return count.classList.contains('active')
})

// selecting the default values 

if(currentStep < 0){
    currentStep = 0
    showCurrentStep()
}

if(currentStepCount < 0) {
    currentStepCount = 0
    showCurrentCountStep()
}

// event listener for the prev, and next buttons 

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

// showCurrentStep gives the selected step an active class to apply styles

function showCurrentStep () {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep)
    })
}

// showCurrentCountStep gives the selected stepCount an active class to apply styles

function showCurrentCountStep( ){
    stepCount.forEach((count, index) => {
        count.classList.toggle('active', index === currentStepCount)
    })
}

// setting the current plan selected

let currentPlan = formPlans.findIndex(plan => {
    return plan.classList.contains('active')
})

// making the first value as default

if(currentPlan < 0) {
    currentPlan = 0
    showCurrentPlan()
}

// for every plan giving an event listener to update the currentPlan value to the selected one

formPlans.forEach((plan, index) => {
    plan.addEventListener('click', () => {
        currentPlan = index
        showCurrentPlan()
    })
})

// this gives the plan an active class to apply different styles 

function showCurrentPlan () {
    formPlans.forEach((plan, index) => {
        plan.classList.toggle('active', index === currentPlan)
    })
}

// event listener for the billing cycle checkbox which changes all the price values to the selected cycle

billingCycleCheckbox.addEventListener('change', function(){
    const priceData = document.querySelectorAll('.price')

    priceData.forEach((data) => {
        const priceElement = data.dataset.payment.split(', ')
        const monthlyPrice = priceElement[0]
        const yearlyPrice = priceElement[1]
        const bonus = document.querySelectorAll('.year-free')

        if(billingCycleCheckbox.checked){
            data.textContent = yearlyPrice
            bonus.forEach(item => item.classList.remove('hide'))
        } else {
            data.textContent = monthlyPrice
            bonus.forEach(item => item.classList.add('hide'))
        }
    
    })
})
