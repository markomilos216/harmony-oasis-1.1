let numberOfItemsInBasketContent = document.querySelector('.items-count')
const setNumberOfItemsInBasket = () => {
    let allPackageItemsFromLocalStorage = JSON.parse(localStorage.getItem('basket')) || []
    numberOfItemsInBasketContent.textContent = allPackageItemsFromLocalStorage.length.toString()
}
setNumberOfItemsInBasket()

export default setNumberOfItemsInBasket