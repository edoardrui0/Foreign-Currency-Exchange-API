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
  fetch(
    `https://data.fixer.io/api/convert?access_key=${apiKey}&from=${currentCurrency}&to=${foreignCurrency}&amount=${currencyAmount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((responseJson) => displayCurrencies(responseJson))
    .catch((error) => console.warn("error" + error));
}

function getSymbols() {
  fetch(
    `https://data.fixer.io/api/symbols?access_key=${apiKey}`,
    requestOptions
  )
    .then((symbols) => symbols.json())
    .then((symbolsJson) => displaySymbols(symbolsJson))
    .catch((error) => console.warn("error" + error));
}

function displaySymbols(symbolsJson) {
  $(".results").empty();

  const keys = Object.keys(symbolsJson.symbols);
  for (const value of keys) {
    $(".currentCurrencyName").append(
      `<option value="${value}">${value}</option>`
    );

    $(".foreignCurrencyName").append(
      `<option value="${value}">${value}</option>`
    );
  }
}

function displayCurrencies(responseJson) {
  $(".results").empty();

  if (responseJson.success === true) {
    $(".results").append(
      `<div class="exchangeInfo">
        <h3>This is your conversion:</h3>
        <p>You are giving ${responseJson.query.amount} ${responseJson.query.from}</p>
        <p>Which will be converted to ${responseJson.result} ${responseJson.query.to}</p>
       </div>`
    );
  }

  //display the results section
  $(".results").removeClass("hidden");
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    let defaultCurrency = $('select[name="currentCurrencyName"]').val();
    let outsideCurrency = $('select[name="foreignCurrencyName"]').val();
    let currencyTotal = $('input[name="currencyAmount"]').val();
    getCurrencies(defaultCurrency, outsideCurrency, currencyTotal);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
  getSymbols();
});
