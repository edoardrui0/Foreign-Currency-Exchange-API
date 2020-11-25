/* globals $ */

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

let state = {
  symbols: {},
};

$(document).ready(function () {
  // Handler for .ready() called.
  console.log("App loaded! Waiting for submit!");

  // Fetch the currency symbols for the forms <select>s
  todaysDate();
  getSymbols();

  // Attach click handlers to display the various forms
  $(".latest-btn").click(displayLatestRatesForm);
  $(".historical-btn").click(displayHistoricalRatesForm);
  $(".convert-btn").click(displayConversionRatesForm);

  // Attach click handlres to submit the forms
  $(".latest-rates-form").on("click", ".latest-submit", getLatestRates);
  $(".historical-rates-form").on(
    "click",
    ".historical-submit",
    getHistoricalRates
  );
  $(".conversion-rates-form").on(
    "click",
    ".currency-submit",
    getConversionRates
  );
});

function getSymbols() {
  // fetched the symbols endpoint here.
  // We use these symbols and import it into a dropdown menu
  fetch(
    `https://data.fixer.io/api/symbols?access_key=${apiKey}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      state.symbols = data.symbols;
    })
    .catch((error) => console.warn("error" + error));
}

function displayLatestRatesForm(event) {
  event.preventDefault();
  $(".latest-base").empty();
  $(".latest-foreign").empty();

  const entries = Object.entries(state.symbols);
  for (const [currencySymbol, countryName] of entries) {
    $(".latest-base").append(`
          <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
    $(".latest-foreign").append(`
          <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
  }

  $(".latest-rates-form").removeClass("hidden");
  $(".historical-rates-form").addClass("hidden");
  $(".conversion-rates-form").addClass("hidden");
  $(".latest-results").addClass("hidden");
  $(".historical-results").addClass("hidden");
  $(".conversion-results").addClass("hidden");
}

function displayHistoricalRatesForm(event) {
  event.preventDefault();
  $(".historical-base").empty();
  $(".historical-foreign").empty();

  const entries = Object.entries(state.symbols);
  for (const [currencySymbol, countryName] of entries) {
    $(".historical-base").append(`
            <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
    $(".historical-foreign").append(`
            <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
  }

  $(".historical-rates-form").removeClass("hidden");
  $(".latest-rates-form").addClass("hidden");
  $(".conversion-rates-form").addClass("hidden");
  $(".latest-results").addClass("hidden");
  $(".historical-results").addClass("hidden");
  $(".conversion-results").addClass("hidden");
}

function displayConversionRatesForm(event) {
  event.preventDefault();
  $(".currentCurrencyName").empty();
  $(".foreignCurrencyName").empty();

  const entries = Object.entries(state.symbols);
  for (const [currencySymbol, countryName] of entries) {
    $(".currentCurrencyName").append(`
            <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
    $(".foreignCurrencyName").append(`
            <option value="${currencySymbol}">${currencySymbol} - ${countryName}</option>`);
  }

  $(".conversion-rates-form").removeClass("hidden");
  $(".latest-rates-form").addClass("hidden");
  $(".historical-rates-form").addClass("hidden");
  $(".latest-results").addClass("hidden");
  $(".historical-results").addClass("hidden");
  $(".conversion-results").addClass("hidden");
}

function getLatestRates(event) {
  event.preventDefault();

  let defaultCurrency = $('select[name="latest-base"]').val();
  let outsideCurrency = $('select[name="latest-foreign"]').val();

  // fetched the convert endpoint here
  fetch(
    `https://data.fixer.io/api/latest?access_key=${apiKey}&base=${defaultCurrency}&symbols=${outsideCurrency}`,
    requestOptions
  )
    .then((latestRateResponse) => latestRateResponse.json())
    .then((latestRateResponseJson) =>
      displayLatestRates(latestRateResponseJson)
    )
    .catch((error) => console.warn("error" + error));
}

function getHistoricalRates(event) {
  event.preventDefault();
  // this isnt done yet
  let historicalDate = $('input[name="historical-rate-date"]').val();
  let defaultCurrency = $('select[name="historical-base"]').val();
  let outsideCurrency = $('select[name="historical-foreign"]').val();

  // fetched the convert endpoint here
  fetch(
    `https://data.fixer.io/api/${historicalDate}?access_key=${apiKey}&base=${defaultCurrency}&symbols=${outsideCurrency}`,
    requestOptions
  )
    .then((historicalRateResponse) => historicalRateResponse.json())
    .then((historicalRateResponseJson) =>
      displayHistoricalRates(historicalRateResponseJson)
    )

    .catch((error) => {
      if (historicalDate === "") {
        $(".historical-results").append(`<h3>Error! Please enter a date</h3>`);
        $(".historical-results").removeClass("hidden");
      }
    });
}

function getConversionRates(event) {
  event.preventDefault();
  // get the value of each other the select's/input's so we can put it into the API URL
  let defaultCurrency = $('select[name="currentCurrencyName"]').val();
  let outsideCurrency = $('select[name="foreignCurrencyName"]').val();
  let currencyTotal = $('input[name="currencyAmount"]').val();

  // fetched the convert endpoint here
  fetch(
    `https://data.fixer.io/api/convert?access_key=${apiKey}&from=${defaultCurrency}&to=${outsideCurrency}&amount=${currencyTotal}`,
    requestOptions
  )
    .then((conversionRateResponse) => conversionRateResponse.json())
    .then((conversionRateResponseJson) =>
      displayConversionRates(conversionRateResponseJson)
    )
    .catch((error) => console.warn("error" + error));
}

function displayLatestRates(latestRateResponseJson) {
  $(".latest-results").empty();

  const entries = Object.entries(latestRateResponseJson.rates);
  if (latestRateResponseJson.success === true) {
    $(".latest-results").append(
      `<h3>Here is the latest exchange rate between the two currencies, updated every 60 seconds:</h3>
      <p>1 ${latestRateResponseJson.base} equals ${entries[0][1]} ${entries[0][0]}</p>`
    );
  }

  $(".latest-results").removeClass("hidden");
}

function displayHistoricalRates(historicalRateResponseJson) {
  $(".historical-results").empty();

  const entries = Object.entries(historicalRateResponseJson.rates);
  if (historicalRateResponseJson.success === true) {
    $(".historical-results").append(`
    <h3>This is the exchange rate between the two currencies on ${historicalRateResponseJson.date}</h3>
    <p>On ${historicalRateResponseJson.date}</p>
    <p>1 ${historicalRateResponseJson.base} equaled ${entries[0][1]} ${entries[0][0]}</p>`);
  }
  console.log(historicalRateResponseJson);

  $(".historical-results").removeClass("hidden");
}

function displayConversionRates(conversionRateResponseJson) {
  $(".conversion-results").empty();

  // pretty self explanatory here.
  // the "amount", "from" and "to" are all values that show the users input
  if (conversionRateResponseJson.success === true) {
    $(".conversion-results").append(
      `<div class="exchangeInfo">
        <h3>This is your conversion:</h3>
        <p>You are converting ${conversionRateResponseJson.query.amount} ${conversionRateResponseJson.query.from} to ${conversionRateResponseJson.query.to}</p>
        <p>The conversion will be ${conversionRateResponseJson.result} ${conversionRateResponseJson.query.to}</p>
       </div>`
    );
  }
  //display the results section
  $(".conversion-results").removeClass("hidden");
}

function todaysDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("datefield").setAttribute("max", today);
}
