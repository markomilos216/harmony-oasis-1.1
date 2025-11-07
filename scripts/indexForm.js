const form = document.getElementById('form')
const result = document.getElementById('result')
const allInputs = document.querySelectorAll('input')
const allSpanElementsFromForm = document.querySelectorAll('span')
const name = document.getElementById('name')
const surname = document.getElementById('surname')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const note = document.getElementById('note')
const personalDataAgreement = document.getElementById('personal-data-agreement')
const personalDataWarningSpan = document.querySelector('.personal-data-warning')
const sendBtn = document.getElementById('send-order')
const popUpWindow = document.querySelector('.popup-window')
const statusCircle = document.querySelector('.status-circle')
const popUpHeading = document.querySelector('.popup-heading')
const popUpMessage = document.querySelector('.popup-message')
const regexNumber = /\d/
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const regexPhoneNumber = /^\+421\s?\d{3}\s?\d{3}\s?\d{3}$|^0\d{3}\s?\d{3}\s?\d{3}$/
let isFormCorrect


const areAllFieldsFilledCorrectly = () => {
    const spanForNote = document.querySelector('.note-warning')
    isFormCorrect = true
    allInputs.forEach((input) => {
        let inputId = input.getAttribute('id')
        let currentWarningFormSpan = document.querySelector(`.${inputId}-warning`)
        if(currentWarningFormSpan){
            if(!input.value){
                currentWarningFormSpan.textContent = "Vyplňte prosim toto pole"
                input.style.border = "1px solid red"
                isFormCorrect = false
            }else if((inputId === 'name' || inputId === 'surname') && regexNumber.test(input.value)){
                currentWarningFormSpan.textContent = "Toto pole musí obsahovať iba písmená"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else if(inputId === 'email' && !regexEmail.test(email.value)){
                currentWarningFormSpan.textContent = "Zadaná emailová adresa nie je platná"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else if(inputId === 'phone' && !regexPhoneNumber.test(phone.value)){
                currentWarningFormSpan.textContent = "Neplatné telefónne číslo"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else{
                currentWarningFormSpan.textContent = ""
                input.style.border = "1px solid black"
            }
        } 
    })
    
    if(!note.value){
        spanForNote.textContent = "Vyplňte prosim toto pole"
        note.style.border = "1px solid red"
        isFormCorrect = false
    }else{
        spanForNote.textContent = ""
        note.style.border = "1px solid black"
    }

    if(!personalDataAgreement.checked){
        personalDataWarningSpan.textContent = "Potvrďte prosím spracovanie osobných údajov"
        isFormCorrect = false
    }else{
        personalDataWarningSpan.textContent = ""
    }
}

const sendFormDataToEmail = () => { 
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    }).then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            popUpStyleForSucces()
            popUpWindow.classList.add('open-popup')
        } else {
            popUpStyleForFailure()
            popUpWindow.classList.add('open-popup')
        }
    })
    .catch(error => {
        popUpStyleForFailure()
        popUpWindow.classList.add('open-popup')
        console.log(error);
    })
    .then(() => {
        form.reset();
        setTimeout(() => {
            popUpWindow.classList.remove('open-popup')
        }, 3000);
    });
}

const popUpStyleForSucces = () => {
    statusCircle.textContent = "✓"
    popUpHeading.textContent = "Ďakujeme!"
    popUpMessage.textContent = "Správa bola úspešne odoslaná."
    statusCircle.style.backgroundColor = 'green'
    popUpWindow.style.boxShadow = 'rgb(68, 150, 68) 0px 0px 13px'
}

const popUpStyleForFailure = () => {
    statusCircle.textContent = "X"
    popUpHeading.textContent = "Chyba!"
    popUpMessage.textContent = "Správa nebola odoslaná. Skúste to prosím znova."
    statusCircle.style.backgroundColor = 'red'
    popUpWindow.style.boxShadow = 'rgb(150, 68, 68) 0px 0px 13px'
}

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    areAllFieldsFilledCorrectly()
    if(isFormCorrect){
        sendFormDataToEmail()
    }
})


