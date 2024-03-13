const multiStepForm = document.querySelector('[data-multi-step-form]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]
const stepCount = [...document.querySelectorAll('[data-step-number]')]

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

if(currentStepCount < 0) {
    currentStepCount = 0
}

showCurrentCountStep()

multiStepForm.addEventListener('click', e => {
    e.preventDefault()
    let incrementor

    if(e.target.matches('[data-next]')){
        incrementor = 1    
    } else if(e.target.matches('[data-prev]')){
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
    return currentStepCount
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
