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
    `http://data.fixer.io/api/convert?access_key=${apiKey}&from=${currentCurrency}&to=${foreignCurrency}&amount=${currencyAmount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((responseJson) => console.log(responseJson))
    .catch((error) => console.log("error" + error));
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    let defaultCurrency = $('select[name="currenctCurrencyName"]')
      .val()
      .toUpperCase();
    let outsideCurrency = $('select[name="foreignCurrencyName"]')
      .val()
      .toUpperCase();
    let currencyTotal = $('input[name="currencyAmount"]').val();
    getCurrencies(defaultCurrency, outsideCurrency, currencyTotal);
  });
}

$(function () {
  //   let defaultCurrency = $('select[name="currenctCurrencyName"]')
  //     .val()
  //     .toUpperCase();
  //   let outsideCurrency = $('select[name="foreignCurrencyName"]')
  //     .val()
  //     .toUpperCase();
  //   let currencyTotal = $('input[name="currencyAmount"]').val();
  //   console.log(defaultCurrency, outsideCurrency, currencyTotal);
  console.log("App loaded! Waiting for submit!");
  watchForm();
});
