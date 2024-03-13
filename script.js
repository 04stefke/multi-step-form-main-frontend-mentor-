const multiStepForm = document.querySelector('[data-multi-step-form]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]

let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active')
})
console.log(currentStep)
if(currentStep < 0){
    currentStep = 0
    formSteps[currentStep].classList.add('active')
}

console.log(currentStep)
