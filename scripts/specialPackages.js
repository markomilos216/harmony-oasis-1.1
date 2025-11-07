import setNumberOfItemsInBasket from './setNumberOfPackages.js'

const basketArr = JSON.parse(localStorage.getItem('basket')) || []
let currentPackage = {}

const addToBasket = (packageContent) => {
    const container = packageContent.closest('.packages-offer-section-container')
    const packageImage = container.querySelector('img').getAttribute('src')
    const packageTitle = container.querySelector('.package-title')
    const packageDescription = container.querySelector('.package-description')
    const packagePrice = container.querySelector('.price')
    currentPackage = {
        "package-image": packageImage,
        "package-title": packageTitle.textContent,
        "package-description": packageDescription.textContent,
        "package-price": packagePrice.textContent
    }
    basketArr.push(currentPackage)
    localStorage.setItem('basket', JSON.stringify(basketArr))
    currentPackage = {}
    setNumberOfItemsInBasket()
}

const showTooltip = (button) => {
    const tooltip = button.closest('.packages-offer-section-container').querySelector('.tooltip');
    tooltip.classList.toggle('show-tooltip')
}



window.showTooltip = showTooltip
window.addToBasket = addToBasket
