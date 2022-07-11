import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener(
    'input', 
        debounce((e) => {getInputValue(e)}, DEBOUNCE_DELAY)
);

function countriesListTpl(items) {
    return items.map(item => 
        `<li class="list-item">
        <img src="${item.flags.svg}" width = "50" height = "25" alt="${item.name}">
        <h2 class="card-name">${item.name.official}</h2>
    </li>`).join('');
}

function countriesCardTpl(id) {
    languagesId(id.languages);
    return `<div class="card-img">
        <img src="${id.flags.svg}" width = "150" height = "75" alt="${id.name}">
        <h2 class="card-name">${id.name.official}</h2>
    </div>
    <div class="card-body">
        <p class="card-text">Capital: ${id.capital}</p>
        <p class="card-text">Population: ${id.population}</p>
        <p class="card-text">Languages: </p>
    </div>`
};

function languagesId(elementId) {
    for (key in elementId) {
        const lastEl = document.createElement("li");
        lastEl.textContent = `${elementId[key]}`;
        refs.countryInfo.append(lastEl);
    }
}

function getInputValue(evt) {
    let inputValue = refs.searchBox.value.toLowerCase().trim();
    fetchCountries(inputValue)
        .then(countries => {
            renderCountriesCard(countries)
        })   
        .catch(error => {
        return Notiflix.Notify.failure('Oops, there is no country with that name')
            console.log(error);
        })
}

function renderCountriesCard(countries) {
    refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
    if (countries.length >= 2 && countries.length <= 10) {
        return refs.countryList.innerHTML = countriesListTpl(countries);
    } else 
    if (countries.length === 1) {
        return refs.countryList.innerHTML = countriesCardTpl(...countries);
    } else 
    if (countries.length === 0) {
        refs.searchBox.value = '';
        return Notiflix.Notify.failure('Oops, there is no country with that name')
    }
    
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
   
}


