const multiStepForm = document.querySelector('[data-multi-step-form]')
const formSteps = [...multiStepForm.querySelectorAll('[data-step]')]

let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active')
})
console.log(currentStep)
if(currentStep < 0){
    currentStep = 0
    showCurrentStep()
}
console.log(currentStep)

multiStepForm.addEventListener('click', e => {
    e.preventDefault()
    if(e.target.matches('[data-next]')){
        currentStep += 1
    } else if(e.target.matches('[data-prev]')){
        currentStep -= 1
    }
    showCurrentStep()
})

function showCurrentStep () {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep)
    })
}