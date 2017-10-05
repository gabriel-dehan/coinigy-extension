//"vendor/plot/jquery.flot.js", "vendor/plot/JUMflot.js", "vendor/plot/jquery.flot.pie.js", "vendor/plot/jquery.flot.time.js", "vendor/plot/jquery.flot.resize.js", "vendor/plot/jquery.flot.tooltip.js", 

const getCurrenciesRates = (function() {
  let currencies = $("#balance_table tbody tr td:nth-child(2)").map((i,el) => $(el).text());
  let rates = $("#balance_table tbody tr td:nth-child(7)").map((i,el) => parseFloat($(el).text()));
  return _.zipObject(currencies, rates);
});

const computeChangesSinceLastRefresh = (function(currency, currentRates, newRates) {
  var changes = _.fromPairs(_.map(newRates, (newRate, cur) => {
    // Gets the stored rate
    let currentData = currentRates[currency];

    if (!_.isEmpty(currentData) && currentData.rates) {
      let currentRate = currentData.rates[cur];
      // Get the %difference or if we didn't find a stored rate, the diffrence is 0%
      if (currentRate) {
        let currentChange = currentRates[currency].changes[cur];
        return [cur, (currentRate == newRate ? currentChange : (newRate / currentRate * 100 - 100))];
      } 
    }
    return [cur, 0];
  }));
  return { changes, rates: newRates };
});

/*
const computeChangesSince24h = (function(currency, currentRates, newRates) {
  var dayHasPassed = moment(currentRates.lastUpdateTime).add(1, 'days').isBefore(moment());

  var changes = _.fromPairs(_.map(newRates, (newRate, cur) => {
    // Gets the stored rate
    let currentData = currentRates[currency];

    if (!_.isEmpty(currentData) && currentData.rates24) {
      let rate24h = currentData.rates24[cur];
      // Get the %difference or if we didn't find a stored rate, the diffrence is 0%
      if (rate24h) {
        return [cur, (newRate / rate24h * 100 - 100)];
      } 
    }
    return [cur, 0];
  }));

  if (currentRates[currency]) {
    return { changes, rates: dayHasPassed ? newRates : currentRates[currency].rates24 };
  } else {
    return { changes, rates: newRates };
  }
});
*/

const fetchChangesSince24h = (function(rates) {
  const URL = "https://api.coinmarketcap.com/v1/ticker/?convert=EUR";
  return fetch(URL).then((data) => data.json()).then((data) => {
    
    var changes = _.fromPairs(_.map(rates, (rate, cur) => {
      var fetchedData = _.find(data, (currencyData) => { return _.upperCase(currencyData.symbol) == _.upperCase(cur); });
      return [cur, fetchedData ? parseFloat(fetchedData.percent_change_24h) : 0.0];
    }));

    return { changes, rates };
  });
});

// Update rates, from refresh and 24h rates
const updateRates = (function(currency, rates, cb) {
  // Get current rates
  chrome.storage.sync.get('current_rates', function(store) {
    // If no current rates were in db init
    currentRates = store.current_rates || {};

    fetchChangesSince24h(rates).then((dataSince24h) => {
      var dataSinceLastRefresh = computeChangesSinceLastRefresh(currency, currentRates, rates);
      var data = {
        rates,
        changes: dataSinceLastRefresh.changes,
        rates24: dataSince24h.rates, // changes every 24h
        changes24: dataSince24h.changes
      };

      // Change stored data
      currentRates[currency] = data;
      // Sync stored data
      chrome.storage.sync.set({ current_rates: currentRates }, function(savedRates) {
        cb(savedRates);
      });

    });

  });
});

const displayChanges = (function(changes, title, klass) {
  title = title || "Changes";
  klass = klass || "percentage-change";

  generateChart = function() {
    var html = $(`<div id="watch_BTRX_DGB_BTC" class="head-panel nm overviewSection"` +
                      `style="padding-top:10px;border-bottom:1px solid rgba(255,255,255,0.1);height:50px;overflow:hidden;"` +
                      `data-sortmarket="DGB/BTC"` +
                      `data-sortprice="0.00000353"` +
                      `data-sortpricechange="0"` +
                      `data-sortpricerange="0"` +
                      `data-sortvolume="1797853374.850"` +
                      `data-sortvolumechange="-47.74">` +
                   `<div class="hp-info" style="">` +
                     `<div class="overview_sparkchart" style="">` +
                       `<div class="priceLine" style="float:left;"><canvas style="display: inline-block; width: 280px; height: 25px; vertical-align: top;" width="280" height="25"></canvas></div>` +
                       `</div>` +
                     `</div>` +
                   `</div>`);

    $(".header").append(html);
    window.updateCharts();
  };

//  generateChart();

  // Handle table headers
  $header = $("#balance_table thead tr");

  if ($header.find(`.${klass}-header`).length == 0) {
    if ($header.find('th:last-child').text() == "") {
      $header.find('th:last-child').replaceWith(`<th class='${klass}-header'>${title}</th>`);
    } else {
      $header.append(`<th class='${klass}-header'>${title}</th>`);
    }
  }

  var columnIndex = $header.find(`th.${klass}-header`).index();

  // Handle table content
  _.each(changes, (change, currency) => {
    let changeAsHTML = `<td class="${klass}-display ${change < 0 ? 'change-negative-num' : (change == 0 ? 'change-neutral-num' : 'change-positive-num')}">${change <= 0 ? '' : '+'}${+change.toFixed(2)}%</td>`;

    $tableLine = $("#balance_table tbody td").filter(function() {
      return $(this).text() == currency;
    }).parent("tr");

    $column = $tableLine.find(`td:eq(${columnIndex})`);

    if ($column.length > 0) {
      $column.replaceWith(changeAsHTML);
    } else {
      $tableLine.append(changeAsHTML);      
    }

  });
});

const init = (function(currency) {
  $("#refresh_button").hide(); // hide the default refresh button

  // Add reset button
  $(".header.enjoyhint_balancesaccts").prepend($('<div class="hp-info hp-one reset-progression tip" style="float:left;">Reset</div>'));
  // Reset button event
  $(".reset-progression").on("click", (e) => {
    chrome.storage.sync.set({ current_rates: {} });
    $(".refresh-progression").trigger('click');
  });


  // Add refresh button
  $(".header.enjoyhint_balancesaccts").prepend($('<div class="hp-info hp-one refresh-progression tip" style="float:left;">Refresh</div>'));

  // Refresh button event
  $(".refresh-progression").on("click", (e) => {
    var quoteCurrency = $(".quote_currency").first().text();
    let rates = getCurrenciesRates();

    updateRates(quoteCurrency, rates, () => {
      chrome.storage.sync.get('current_rates', function({current_rates}) {
        //console.log(current_rates);
        $("#refresh_button").trigger("click");

        var isRefreshing = setInterval(function() {
          if ($('.icon-refreshing').length <= 0) {
            clearInterval(isRefreshing);
            // Wait for the re-render to finish
            setTimeout(function(){
              displayChanges(current_rates[quoteCurrency].changes);
              displayChanges(current_rates[quoteCurrency].changes24, "Changes 24h", "percentage-change24");
            }, 1900);
          }
        }, 300); 

      });
    });

  });

});

// Bootstrap
(function(){
/*  document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/jquery.flot.js";
  setTimeout(() => {
    document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/jquery.flot.pie.js";
    document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/jquery.flot.resize.js";
    document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/jquery.flot.time.js";
    document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/jquery.flot.tooltip.js";
    document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/plugins/flot/JUMflot.js";
    setTimeout(() => {
      document.body.appendChild(document.createElement('script')).src = "https://www.coinigy.com/assets/javascripts/app/overview.js";
    }, 1000);
    }, 1000);*/
  init();

  // todo: Display the 0s but add a 5mn condition OR THOSE THAT DID NOT CHANGE IN GREY
  // todo: onload, hit "refresh"
  // todo: %change total/global
  // todo: when sorting, automaticaly hit "refresh"
  // todo: when changing currency, automaticaly hit "refresh"
})();
