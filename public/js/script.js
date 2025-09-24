// const catalog = document.querySelector('.catalog');
const detailImage = document.querySelector('.image');
const detailInfo = document.querySelector('.info');
const detail = document.querySelector('.detail');

// generateCatalog();

async function generateCatalog() {
    // let response = await fetch('/api/games');
    // let data = await response.json();
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="../images/vehicles/adventador.jpg" alt="Adventador" style="width:100%; height:150px; object-fit:cover; border-radius: 10px 10px 0 0;">
            <hr>
            <a href="#" class="car-link"><h3>Car make</h3></a>
            <p>Price: $2,300</p>
        `;
        // catalog.appendChild(card);
}

// const link = document.querySelector('.car-link');
// link.addEventListener('click', (event) => {
//     event.preventDefault();
//     populateDetail('../images/vehicles/adventador.jpg', 'Adventador');
// });

function populateDetail(imageSrc, infoText) {
    const carImage = document.createElement('img');
    const carName = document.createElement('h2');
    carName.innerText = infoText + ' Details';
    const price = document.createElement('p');
    price.innerText = 'Price: $2,300';
    price.classList.add('bg-highlight');


    const description = document.createElement('p');
    description.innerText = 'Description:This is a great car with excellent features and performance.';
    const color = document.createElement('p');
    color.innerText = 'Color: Red';
    color.classList.add('bg-highlight');
    const mileage = document.createElement('p');
    mileage.innerText = 'Mileage: 15,000 miles';

    carImage.src = '../images/vehicles/adventador.jpg';
    carImage.alt = 'Adventador';
    detailImage.appendChild(carImage);
    detailInfo.appendChild(carName);
    detailInfo.appendChild(price);
    detailInfo.appendChild(description);
    detailInfo.appendChild(color);
    detailInfo.appendChild(mileage);
    detail.appendChild(detailImage);
    detail.appendChild(detailInfo);
}