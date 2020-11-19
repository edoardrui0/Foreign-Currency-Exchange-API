"use strict";

var myHeaders = new Headers();
myHeaders.append(
  "Cookie",
  "__cfduid=dece6c742836bb1559d13c983611d05531605215826"
);

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

let apiKey = "829db5a4a4e6684ed3818e72c0c8a7bd";

function getCurrencies(currentCurrency, foreignCurrency, currencyAmount) {
  // fetched the convert endpoint here
  fetch(
    `https://data.fixer.io/api/convert?access_key=${apiKey}&from=${currentCurrency}&to=${foreignCurrency}&amount=${currencyAmount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((responseJson) => displayCurrencies(responseJson))
    .catch((error) => console.warn("error" + error));
}

function getCountries() {
  fetch(`https://restcountries.eu/rest/v2/all`, requestOptions)
    .then((countries) => countries.json())
    .then((countriesJson) => displayCountries(countriesJson))
    .catch((error) => console.warn("error" + error));
}

function getHomeSymbols(homeCurrencySymbol) {
  fetch(
    `https://restcountries.eu/rest/v2/currency/${homeCurrencySymbol}`,
    requestOptions
  )
    .then((homeSymbols) => homeSymbols.json())
    .then((homeSymbolsJson) => displayHomeSymbols(homeSymbolsJson))
    .catch((error) => console.warn("error" + error));
}

function getVisitingSymbols(visitingCurrencySymbol) {
  fetch(
    `https://restcountries.eu/rest/v2/currency/${visitingCurrencySymbol}`,
    requestOptions
  )
    .then((visitingSymbols) => visitingSymbols.json())
    .then((visitingSymbolsJson) => displayVisitingSymbols(visitingSymbolsJson))
    .catch((error) => console.warn("error" + error));
}

function displayCountries(countriesJson) {
  for (let i = 0; i < countriesJson.length; i++) {
    $(".homeCountry").append(
      `<option value="${countriesJson[i].currencies[0].code}">${countriesJson[i].name}</option>`
    );

    $(".visitingCountry").append(
      `<option value="${countriesJson[i].currencies[0].code}">${countriesJson[i].name}</option>`
    );
  }
}

function displayHomeSymbols(homeSymbolsJson) {
  // $(".results").empty();

  for (let i = 0; i < homeSymbolsJson.length; i++) {
    $(".currentCurrencyName").append(
      `<option value="${homeSymbolsJson[i].currencies[0].code}">${homeSymbolsJson[i].currencies[0].code}</option>`
    );
  }

  $(".currencySymbolsDropdown").removeClass("hidden-currency");
}

function displayVisitingSymbols(visitingSymbolsJson) {
  // $(".results").empty();

  for (let i = 0; i < visitingSymbolsJson.length; i++) {
    $(".foreignCurrencyName").append(
      `<option value="${visitingSymbolsJson[i].currencies[0].code}">${visitingSymbolsJson[i].currencies[0].code}</option>`
    );
  }

  $(".currencySymbolsDropdown").removeClass("hidden-currency");
}

function displayCurrencies(responseJson) {
  $(".results").empty();

  // pretty self explanatory here.
  // the "amount", "from" and "to" are all values that show the users input
  if (responseJson.success === true) {
    $(".results").append(
      `<div class="exchangeInfo">
        <h3>This is your conversion:</h3>
        <p>You are converting ${responseJson.query.amount} ${responseJson.query.from} to ${responseJson.query.to}</p>
        <p>The conversion will be ${responseJson.result} ${responseJson.query.to}</p>
       </div>`
    );
  }

  //display the results section
  $(".results").removeClass("hidden");
}

function watchForm() {
  $(".currencySymbolsDropdown").submit((event) => {
    event.preventDefault();
    // get the value of each other the select's/input's so we can put it into the API URL
    let defaultCurrency = $('select[name="currentCurrencyName"]').val();
    let outsideCurrency = $('select[name="foreignCurrencyName"]').val();
    let currencyTotal = $('input[name="currencyAmount"]').val();
    getCurrencies(defaultCurrency, outsideCurrency, currencyTotal);
  });
}

function watchSymbols() {
  $(".countryDropdowns").submit((event) => {
    event.preventDefault();
    let homeCountry = $('select[name="currentCountry"]').val();
    let visitingCountry = $('select[name="foreignCountry"]').val();
    getHomeSymbols(homeCountry);
    getVisitingSymbols(visitingCountry);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
  getCountries();
  watchSymbols();
});
