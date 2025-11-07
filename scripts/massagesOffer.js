const offerSectionContainer = document.querySelector('.offer-section-container')

fetch('../data/massagesOffer.json')
    .then(res => res.json())
    .then(data => printMassagesOffer(data))

const printMassagesOffer = (allMessages) => {
    allMessages.forEach(({title, description, img, altDescription, subpageLink}) => {
        offerSectionContainer.innerHTML += `
            <a href="${subpageLink}" class="offer-link-container">
                <img src="${img}" alt="${altDescription}">
                <h3>${title}</h3>
                <p>${description}</p>
            </a>
        `
    })
}
