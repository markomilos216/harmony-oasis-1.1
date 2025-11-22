import setNumberOfItemsInBasket from './setNumberOfPackages.js'
const form = document.getElementById('order-form')
const allInputs = document.querySelectorAll('input')
const customerName = document.getElementById('customer-name')
const customerSurname = document.getElementById('customer-surname')
const customerEmail = document.getElementById('customer-email')
const customerPhone = document.getElementById('customer-phone')
const customerNote = document.getElementById('customer-note')
const customerPersonalDataAgreement = document.getElementById('customer-personal-data-agreement')
const sendOrderBtn = document.getElementById('send-customer-order')
const summaryOrderTable = document.querySelector('.order-summary-table-body')
const currentOrderItems = JSON.parse(localStorage.getItem('basket')) || []
const popUpWindow = document.querySelector('.popup-window')
const statusCircle = document.querySelector('.status-circle')
const popUpHeading = document.querySelector('.popup-heading')
const popUpMessage = document.querySelector('.popup-message')
const regexNumber = /\d/
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const regexPhoneNumber = /^\+421\s?\d{3}\s?\d{3}\s?\d{3}$|^0\d{3}\s?\d{3}\s?\d{3}$/
let isFormCorrect = undefined

const areAllFieldsFilledCorrectly = () => {
    const spanForNote = document.querySelector('.customer-note-warning')
    const spanForCustomerPersonalDataAgreement = document.querySelector('.customer-personal-data-warning')
    isFormCorrect = true
    allInputs.forEach((input) => {
        let inputId = input.getAttribute('id')
        let currentWarningFormSpan = document.querySelector(`.${inputId}-warning`)
        if(currentWarningFormSpan){
            if(!input.value){
                currentWarningFormSpan.textContent = "Vyplňte prosim toto pole"
                input.style.border = "1px solid red"
                isFormCorrect = false
            }else if((inputId === 'customer-name' || inputId === 'customer-surname') && regexNumber.test(input.value)){
                currentWarningFormSpan.textContent = "Toto pole musí obsahovať iba písmená"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else if(inputId === 'customer-email' && !regexEmail.test(customerEmail.value)){
                currentWarningFormSpan.textContent = "Zadaná emailová adresa nie je platná"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else if(inputId === 'customer-phone' && !regexPhoneNumber.test(customerPhone.value)){
                currentWarningFormSpan.textContent = "Neplatné telefónne číslo"
                input.style.border = "1px solid black"
                isFormCorrect = false
            }else{
                currentWarningFormSpan.textContent = ""
                input.style.border = "1px solid black"
            }
        }

        // if(!customerNote.value){
        //     spanForNote.textContent = "Vyplňte prosim toto pole"
        //     customerNote.style.border = "1px solid red"
        //     isFormCorrect = false
        // }else{
        //     spanForNote.textContent = ""
        //     customerNote.style.border = "1px solid black"
        // }

        if(!customerPersonalDataAgreement.checked){
            spanForCustomerPersonalDataAgreement.textContent = "Potvrďte prosím spracovanie osobných údajov"
            isFormCorrect = false
        }else{
            spanForCustomerPersonalDataAgreement.textContent = ""
        }
    })
}

let currentBasketItems = currentOrderItems.reduce((obj, item) => {
    if(!obj[item["package-title"]]){
        obj[item["package-title"]] = {count: 1, itemDetails: item}
    }else{
        obj[item["package-title"]].count++
    }
    return obj
}, {})

const sendOrderToEmail = () => {
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const currentOrder = {
        ...object, 
        order: {}
    };

    let orderText = '';
    for (let item in currentBasketItems) {
        const product = currentBasketItems[item];
        orderText += `${item}: Počet: ${product["count"]}, Cena: ${product["itemDetails"]["package-price"]} €\n`;
    }
    currentOrder.order = orderText;
    const json = JSON.stringify(currentOrder)
    
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
            localStorage.removeItem('basket')
            setNumberOfItemsInBasket()
        } else {
            popUpStyleForFailure()
            popUpWindow.classList.add('open-popup')
        }
    })
    .catch(error => {
        popUpStyleForFailure()
        popUpWindow.classList.add('open-popup')
    })
    .then(() => {
        form.reset();
        setTimeout(() => {
            popUpWindow.classList.remove('open-popup')
        }, 3000);
    });
}

const countTotalPrice = () => {
    let result = 0
    Object.values(currentBasketItems).forEach((item) => {
        const pricePerItem = item.count * parseInt(item.itemDetails["package-price"])
        result += pricePerItem 
    })
    return result.toString() + " €"
}

const renderSummaryTableContent = () => {
    summaryOrderTable.innerHTML = "" 
    Object.values(currentBasketItems).forEach((item) => {
        summaryOrderTable.innerHTML += `
            <tr>
                <td class="product-description">
                    <img src="${item.itemDetails["package-image"]}" alt="package-image">
                    <td>${item.itemDetails["package-title"]}</td>
                </td>
                <td class="number-of-items">${item.count}</td>
                <td>${item.count * parseInt(item.itemDetails["package-price"])} €</td>
            </tr>
        `
    })
    const trElement = document.createElement('tr')
    summaryOrderTable.appendChild(trElement)
    for(let i = 0; i < 4; i++){
        const tdElement = document.createElement('td')
        trElement.appendChild(tdElement)
        if(i !== 2 && i !== 3) tdElement.style.borderBottom = 'none'
        if(i === 2){
            tdElement.innerText = 'Spolu: '
            tdElement.style.fontWeight = 'bold'
        }
        if(i === 3) tdElement.innerHTML = countTotalPrice()
    }
}
renderSummaryTableContent()

const popUpStyleForSucces = () => {
    statusCircle.textContent = "✓"
    popUpHeading.textContent = "Ďakujeme!"
    popUpMessage.textContent = "Objednávka bola úspešne odoslaná."
    statusCircle.style.backgroundColor = 'green'
    popUpWindow.style.boxShadow = 'rgb(68, 150, 68) 0px 0px 13px'
}

const popUpStyleForFailure = () => {
    statusCircle.textContent = "X"
    popUpHeading.textContent = "Chyba!"
    popUpMessage.textContent = "Objednávka nebola odoslaná. Skúste to prosím znova."
    statusCircle.style.backgroundColor = 'red'
    popUpWindow.style.boxShadow = 'rgb(150, 68, 68) 0px 0px 13px'
}

sendOrderBtn.addEventListener('click', (e) => {
    e.preventDefault()
    areAllFieldsFilledCorrectly()
    if(isFormCorrect){
        sendOrderToEmail()
    }
})