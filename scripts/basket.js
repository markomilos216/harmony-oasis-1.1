import setNumberOfItemsInBasket from './setNumberOfPackages.js'
let allBasketItems = JSON.parse(localStorage.getItem('basket')) || []
const basketTableSection = document.querySelector('.basket-table')
const emptyBasketSection = document.querySelector('.empty-basket-section')
let basketTableItems = document.querySelector('.basket-table-items')

const renderPageContentAccordingBasketItems = () => {
    if(allBasketItems.length < 1){
        basketTableSection.classList.add('hide-content')
        emptyBasketSection.classList.remove('hide-content')
    }else{
        basketTableSection.classList.remove('hide-content')
        emptyBasketSection.classList.add('hide-content')
    }
}
renderPageContentAccordingBasketItems()

let currentBasketItems = allBasketItems.reduce((obj, item) => {
    if(!obj[item["package-title"]]){
        obj[item["package-title"]] = {count: 1, itemDetails: item}
    }else{
        obj[item["package-title"]].count++
    }
    return obj
}, {})

const countPriceForEachItem = (item) => {
    let result = parseInt(item.count) * parseInt(item.itemDetails["package-price"]) 
    return result.toString()
}

const countTotalPrice = () => {
    let result = 0
    Object.values(currentBasketItems).forEach((item) => {
        const pricePerItem = item.count * parseInt(item.itemDetails["package-price"])
        result += pricePerItem 
    })
    return result.toString() + " €"
}
countTotalPrice()

const countPriceForSelectedItem = (index) => {
    const itemKey = Object.keys(currentBasketItems)[index]
    const selectedItem = currentBasketItems[itemKey]
    const input = document.getElementById(`number-of-items-${index}`)
    const continueOrderBtn = document.querySelector('.order-continue-btn')
    const incorrectValue = document.getElementById(`incorrect-value-${index}`)

    if(input){
        if(input.value < 0){    
            incorrectValue.classList.remove('hide-content')
            input.style.border = "1px solid red"
            continueOrderBtn.style.display = "none"
        }else{
            incorrectValue.classList.add('hide-content')
            input.style.border = "1px solid black"
            continueOrderBtn.style.display = "block"
        }
        const newCount = parseInt(input.value)
        selectedItem.count = newCount
        currentBasketItems[itemKey] = selectedItem
        const updatedBasket = Object.values(currentBasketItems).reduce((acc, item) => {
            return acc.concat(Array(item.count).fill(item.itemDetails))
        }, []);
        localStorage.setItem('basket', JSON.stringify(updatedBasket))
        renderTableContent()
        setNumberOfItemsInBasket()
        countTotalPrice()
    }
}

const deleteItemFromBasketTable = (index) => {
    const itemKey = Object.keys(currentBasketItems)[index]
    if(itemKey){
        delete currentBasketItems[itemKey]
        const updatedBasket = Object.values(currentBasketItems).reduce((acc, item) => {
            return acc.concat(Array(item.count).fill(item.itemDetails))
        }, [])
        localStorage.setItem('basket', JSON.stringify(updatedBasket))
        allBasketItems = JSON.parse(localStorage.getItem('basket')) || []
        renderTableContent()
        countTotalPrice()
    }
    setNumberOfItemsInBasket()
    if(Object.keys(currentBasketItems).length === 0){
        renderPageContentAccordingBasketItems()
        countTotalPrice()
    }
}


const renderTableContent = () => {
    basketTableItems.innerHTML = ""
    Object.values(currentBasketItems).forEach((item, index) => {
        basketTableItems.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td class="product-description">
                    <img src="${item.itemDetails["package-image"]}" alt="image">
                    <td>${item.itemDetails["package-title"]}</td>
                </td>
                <td class="number-of-items">
                    <input type="number" 
                           name="number-of-products"
                           class="number-of-products" 
                           id="number-of-items-${index}"
                           min="1" 
                           value="${item.count}"
                           onChange="countPriceForSelectedItem(${index})">
                    <span class="hide-content incorrect-number-of-items" id="incorrect-value-${index}">Prosím zadajte kladné číslo.</span>
                </td>
                <td>${countPriceForEachItem(item)}€</td>
                <td><i class="fa-solid fa-xmark delete-item" onClick="deleteItemFromBasketTable(${index})"></i></td>
            </tr>
        `
    });
    const trElement = document.createElement('tr')
    basketTableItems.appendChild(trElement)
    for(let i = 0; i < 6; i++){
        const tdElement = document.createElement('td')
        trElement.appendChild(tdElement)
        if(i !== 3 && i !== 4) tdElement.style.borderBottom = 'none'  
        if(i === 3 ){
            tdElement.innerText = 'Spolu: '
            tdElement.style.fontWeight = 'bold'
        }
        if(i === 4) tdElement.innerHTML = countTotalPrice()
    }
}
renderTableContent()

window.deleteItemFromBasketTable = deleteItemFromBasketTable
window.countPriceForSelectedItem = countPriceForSelectedItem