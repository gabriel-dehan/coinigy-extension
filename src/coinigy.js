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


// Update rates, from refresh and 24h rates
const updateRates = (function(currency, rates, cb) {
  // Get current rates
  chrome.storage.sync.get('current_rates', function(store) {
    // If no current rates were in db init
    currentRates = store.current_rates || {};

    var dataSinceLastRefresh = computeChangesSinceLastRefresh(currency, currentRates, rates);

    // If 24h have passed or this is the first time, we update the date
    if (!currentRates.lastUpdateTime || moment(currentRates.lastUpdateTime).add(1, 'days').isBefore(moment()) ) {
      currentRates.lastUpdateTime = moment().format();
    }

    var dataSince24h = computeChangesSince24h(currency, currentRates, rates);

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

const displayChanges = (function(changes, title, klass) {
  title = title || "Changes";
  klass = klass || "percentage-change";

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
    let changeAsHTML = `<td class="${klass}-display ${change < 0 ? 'change-negative-num' : 'change-positive-num'}">${change < 0 ? '' : '+'}${+change.toFixed(2)}%</td>`;

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
            }, 1500);
          }
        }, 400); 

      });
    });

  });

});

// Bootstrap
(function(){
  init();

  // todo: 24h + %change total/global, better UI hiding the current refresh button and triggering it automaticaly
  // todo: when sorting, automaticaly hit "refresh"
})();
