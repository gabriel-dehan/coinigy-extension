var balanceTable;
var option_showNils = 1;
var option_group = 1;
var option_dust = 0;
var _selectedAccounts = "";
var remainingToRefresh = 0;
var refreshErrored = 0;
var selected = "";
var sub_view_name = "";
var balanceChartType = "stack";
var existingPalette = [];
var modifiedBalanceIDs = [];
var flotClickBound = false;
var conversion_curr = getCookie("balanceQuoteCurr") || "BTC";
var conversion_rate = 1;
view_name = "balances";
option_showNils = getCookie("showNilBalances") || 1;
option_group = getCookie("showGroupedBalances") || 1;

function initOptionUI() {
    if (option_showNils == "undefined") {
        option_showNils = 1
    }
    if (option_group == "undefined") {
        option_group = 1
    }
    $('#chkShowNilValues option[value="' + option_showNils + '"]').prop("selected", true);
    $('#chkGroup option[value="' + option_group + '"]').prop("selected", true)
}

function setOptions() {
    option_showNils = $("#chkShowNilValues :selected").val();
    setCookie("showNilBalances", option_showNils, 30);
    option_group = $("#chkGroup :selected").val();
    setCookie("showGroupedBalances", option_group, 30);
    option_dust = $("#chkShowDustbin :selected").val();
    setCookie("showDustbin", option_dust, 30);
    var b = getCookieAccounts();
    var a = base_url + "getjson/balancetable/";
    if (typeof balanceTable != "undefined") {
        balanceTable.fnDestroy();
        getBalanceTable()
    } else {
        getBalanceChartData()
    }
}

function changeBalancesExchange(a) {
    balances_exchange_id = a;
    $("#balances_market_list").html("");
    getAPIAccounts("markets")
}

function refreshSelectedBalance() {
    var c = $("#ddlExchanges").val();
    var b = String(c).split(":")[0];
    var a = $("#ddlExchanges option:selected").text();
    if (b > 0 && a != "Select...") {
        $("#refresh_button").removeClass("icon-refresh");
        $("#refresh_button").addClass("icon-refreshing");
        refreshBalanceMarkets(b, 0);
        setTimeout(function() {
            getOverviewBalanceTable(b)
        }, 2000)
    }
}

function changeAPIAccount(a) {
    active_auth_id = a
}

function getOverviewBalanceTable(a) {
    if (a === null) {
        $("#balances_market_list").html("No Balances Found");
        $("#balances_btc_total").html("0")
    } else {
        getAccountBalance(a)
    }
}

function getAccountBalance(c) {
    var a = base_url + "getjson/balance/" + c;
    var b = 0;
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: a,
        success: function(d) {
            $("#balances_market_list").html("");
            $("#balances_btc_total").html("0");
            $.each(d.aaData, function(e, f) {
                $("#balances_market_list").append('<a class="list-item" style="padding:10px;cursor:pointer;min-width:135px;"><div><b>' + f.balance_curr_code + '</b> <div style="float:right;">' + f.balance_amount_avail + "</div></div></a>");
                if (f.balance_amount_held > 0) {
                    $("#balances_market_list").append('<a class="list-item" style="padding:10px;min-width:135px;cursor:pointer;"><div style="overflow:hidden;"><em>' + f.balance_curr_code + ' held:</em> <div style="float:right;">' + f.balance_amount_held + "</div></div></a>")
                }
                var g = parseFloat(f.btc_balance);
                b = b + g
            });
            $("#balances_btc_total").html(parseFloat(parseFloat(b).toFixed(8)).noExponents())
        },
        error: function(d, f, e) {
            console.log("1error: " + e)
        }
    })
}

function setEmailOption() {
    var a = $("#chkEmailUpdate :selected").val();
    var c = {
        email_option: a,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    var b = base_url + "post/UpdateBalanceEmailOption";
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        data: c,
        url: b,
        success: function(d) {},
        error: function(d, f, e) {
            console.log("error: " + e)
        }
    })
}

function getPortfolioRefreshDate() {
    var a = base_url + "getjson/getPortfolioRefreshDate";
    var b = "";
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: a,
        success: function(c) {
            $.each(c.aaData, function(f, g) {
                b = g.timestamp
            });
            var e = "Last Updated: " + b + " Click to update";
            $("#refresh_button").attr("title", e).tooltip("fixTitle");
            var d = base_url + "getjson/balanceChartData";
            getBalanceChartData()
        },
        error: function(c, e, d) {
            console.log("1error: " + d)
        }
    })
}

function getPortfolioBalance() {
    var a = base_url + "getjson/getPortfolioBalance";
    var b = 0;
    var c = "";
    var d = {
        csrf_coinigy: $("#csrf_coinigy").val(),
        quotecurr: conversion_curr
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: a,
        data: d,
        success: function(e) {
            $("#portfolio_btc_total").html("");
            conversion_rate = parseFloat(e[1].conversion_rate);
            conversion_curr = e[1].conversion_curr;
            $.each(e[0], function(g, h) {
                var i = parseFloat(h.btc_balance) * conversion_rate;
                c = h.timestamp;
                b = b + i
            });
            if (typeof $("#portfolio_btc_total") != "undefined") {
                $("#portfolio_btc_total").append(parseFloat(parseFloat(b).toFixed(8)).noExponents())
            }
            var f = "Last Updated: " + c + " Click to update";
            $("#refresh_button").attr("title", f).tooltip("fixTitle")
        },
        error: function(e, g, f) {
            console.log("1error: " + f)
        }
    })
}

function getProfit() {
    var a = base_url + "getjson/getProfit";
    var b = 0;
    var c = "";
    var d = {
        csrf_coinigy: $("#csrf_coinigy").val(),
        quotecurr: conversion_curr
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: a,
        data: d,
        success: function(i) {
            var j = i[0][0];
            conversion_rate = parseFloat(i[1].conversion_rate);
            conversion_curr = i[1].conversion_curr;
            var l = j.profit_24hour;
            var e = j.profit_72hour;
            var h = j.profit_30day;
            var f = (parseFloat(j.value_24hour) * conversion_rate).toFixed(4);
            var g = (parseFloat(j.value_72hour) * conversion_rate).toFixed(4);
            var k = (parseFloat(j.value_30day) * conversion_rate).toFixed(4);
            if (j) {
                $("#profit_24hr").html(l + "% (" + f + " " + conversion_curr + ")");
                $("#profit_72hr").html(e + "% (" + g + " " + conversion_curr + ")");
                $("#profit_30day").html(h + "% (" + k + " " + conversion_curr + ")")
            }
        },
        error: function(e, g, f) {
            console.log("1error: " + f)
        }
    })
}

function deDupeArray(b) {
    var d = {};
    for (var e = 0; e < b.length; e++) {
        d[b[e]] = true
    }
    var f = [];
    for (var c in d) {
        f.push(c)
    }
    return f
}

function getBalanceChartData() {
    var c = base_url + "getjson/balanceChartData";
    if (sub_view_name == "balances_chart") {
        if (balanceChartType == "line") {
            c = base_url + "getjson/balanceChartDataByApi"
        } else {
            c = base_url + "getjson/balanceBarChartDataByApi"
        }
    } else {
        balanceChartType = "line"
    }
    var a = getCookieAccounts();
    var b = {
        selected_auth_ids: a,
        csrf_coinigy: $("#csrf_coinigy").val(),
        start_date: $("#dateBalanceStart").val(),
        end_date: $("#dateBalanceEnd").val(),
        quotecurr: conversion_curr
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: c,
        data: b,
        async: false,
        success: function(I) {
            var y = new Array();
            var x = I[0];
            balance_history_chart_data = new Array();
            conversion_rate = parseFloat(I[3].conversion_rate);
            conversion_curr = I[3].conversion_curr;
            $(".conversion_curr").text(conversion_curr);
            if (balanceChartType == "line") {
                $.each(x, function(M, N) {
                    balance_history_chart_data.push([M, N.btc_balance * conversion_rate]);
                    y.push([M, N.balance_date])
                });
                var e = $.plot($("#chart_Portfolio_Balance"), [{
                    data: balance_history_chart_data,
                    label: "Balance History"
                }], {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    legend: {
                        show: false
                    },
                    xaxis: {
                        ticks: y,
                        mode: "time",
                        minTickSize: [1, "day"]
                    },
                    yaxis: {
                        tickFormatter: function(M, i) {
                            return parseFloat(parseFloat(M).toFixed(8)).noExponents()
                        }
                    },
                    grid: {
                        clickable: true,
                        hoverable: true
                    },
                    tooltip: {
                        show: true,
                        cssClass: "pieTip",
                        content: "<div style='width:100%;height:100%;color:#000000;font-size:18px;'>%y (" + conversion_curr + ")</div>"
                    }
                })
            } else {
                var C = ["rgb(33, 150, 243)", "rgb(63, 81, 181)", "rgb(103, 58, 183)", "rgb(156, 39, 176)", "rgb(233, 30, 99)", "rgb(244, 67, 54)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(38, 50, 56)", "rgb(121, 85, 72)", "rgb(255, 87, 34)", "rgb(255, 152, 0)", "rgb(255, 193, 7)", "rgb(255, 235, 59)"];

                function H(i) {
                    return new Date(i).getTime()
                }
                var m = [
                    [H("2015-05-01"), 1],
                    [H("2015-05-02"), 2],
                    [H("2015-05-03"), 4],
                    [H("2015-05-04"), 3]
                ];
                var s = [];
                var L, q;
                var w = 0;
                for (L in x) {
                    var g = [];
                    var E = 0;
                    for (q in x[L]) {
                        var f = parseFloat(x[L][q] * conversion_rate).toFixed(8);
                        g.push([H(q), parseFloat(f)]);
                        E++
                    }
                    s.push({
                        label: L,
                        data: g,
                        color: C[w]
                    });
                    w++
                }
                var E;
                for (E = 0; E < s.length; E++) {
                    for (t = 0; t < s[E]["data"].length; t++) {
                        y.push(s[E]["data"][t][0])
                    }
                }
                y = deDupeArray(y);
                var D = [];
                for (E = 0; E < y.length; E++) {
                    D.push([E, y[E]])
                }
                for (var E = 0; E < s.length; E++) {
                    var F = [];
                    for (var t = 0; t < D.length; t++) {
                        var n = D[t][1];
                        var A = false;
                        var j = 0;
                        for (var v = 0; v < s[E].data.length; v++) {
                            if (s[E].data[v][0] == n) {
                                F.push([n, s[E].data[v][1]]);
                                var A = true
                            }
                        }
                        if (A == false) {
                            F.push([n, 0])
                        }
                    }
                    s[E].data = F
                }
                var h = {
                    series: {
                        stack: true,
                        bars: {
                            show: true
                        }
                    },
                    bars: {},
                    xaxis: {
                        mode: "time",
                        tickLength: 10,
                        color: "black",
                        axisLabel: "Date",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: "Verdana, Arial",
                        axisLabelPadding: 10
                    },
                    yaxis: {
                        color: "#CCCCCC",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: "Verdana, Arial",
                        axisLabelPadding: 10,
                        tickFormatter: function(M, i) {
                            return parseFloat(parseFloat(M).toFixed(8)).noExponents()
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true,
                        borderWidth: 2,
                        backgroundColor: {
                            colors: ["rgba(255,255,255,0.8)", "#EDF5FF"]
                        }
                    },
                    tooltip: {
                        show: true,
                        cssClass: "pieTip",
                        content: "<div style='width:100%;height:100%;color:#000000;font-size:18px;'><span style='font-weight:bold;'>%s</span>: %y (" + conversion_curr + ")</div>"
                    },
                    bars: {
                        align: "center",
                        barWidth: 24 * 60 * 60 * 600,
                        lineWidth: 1
                    }
                };
                var e = $.plot($("#chart_Portfolio_Balance"), s, h);
                if (s.length < 1) {
                    $("#chart_Portfolio_Balance").html('<div style="font-size:18px;color:#779EFF;width:100%;text-align:center;padding-top:90px;">Please select atleast one account to view this chart.</div>')
                }
                if (balanceChartType != "line") {
                    var p = e.getData();
                    for (var E = 0; E < p.length; ++E) {
                        if (p[E].color != "") {
                            existingPalette[p[E].label] = p[E].color
                        }
                    }
                }
            }
            $("#chart_Portfolio_Balance").unbind("plotclick");
            $("#chart_Portfolio_Balance").bind("plotclick", function(N, Q, M) {
                if (M) {
                    if (balanceChartType == "line") {
                        var i = y[M.datapoint[0]][1]
                    } else {
                        var i = Number(D[M.dataIndex][1]);
                        var P = new Date(i);
                        var i = P.toISOString().slice(0, 10)
                    }
                    var O = M.datapoint[1];
                    getBalanceEditInfo(i, O)
                }
            });
            $("#chart_Portfolio_Balance").bind("plothover", function(M, N, i) {
                if (i) {
                    document.body.style.cursor = "pointer"
                } else {
                    document.body.style.cursor = "default"
                }
            });
            var G = I[1];
            var K = new Array();
            $.each(G, function(M, N) {
                K[M] = {
                    label: N.balance_curr_code,
                    data: parseFloat(N.btc_share).toFixed(8),
                    color: existingPalette[N.balance_curr_code]
                }
            });
            if (G.length > 0) {
                $.plot("#chart_Portfolio_Distribution", K, {
                    series: {
                        pie: {
                            radius: 1,
                            show: true,
                            label: {
                                show: true,
                                radius: 2 / 3,
                                formatter: l,
                                threshold: 0.05
                            },
                            gradient: {
                                radial: true,
                                colors: [{
                                    opacity: 1
                                }, {
                                    opacity: 1
                                }, {
                                    opacity: 0.7
                                }]
                            }
                        }
                    },
                    grid: {
                        hoverable: true
                    },
                    tooltip: {
                        show: true,
                        cssClass: "pieTip",
                        content: "<div style='width:100%;height:100%;color:#000000;font-size:18px;'><span style='font-weight:bold;'>%s</span>: %n (" + conversion_curr + ")</div>"
                    },
                    legend: {
                        show: false
                    }
                })
            } else {
                $("#chart_Portfolio_Distribution").html('<div style="font-size:18px;color:#779EFF;width:100%;text-align:center;">No accounts selected.</div>')
            }
            var o = I[2];
            var k = new Array();
            $.each(o, function(M, N) {
                if (N.exch_name == "Global Digital Asset Exchange") {
                    N.exch_name = "GDAX"
                }
                k[M] = {
                    label: N.exch_name,
                    data: parseFloat(N.btc_share * conversion_rate).toFixed(8)
                }
            });

            function l(i, M) {
                return "<div style='font-size: 12px; text-align:center; padding:5px; color: #FFF; line-height: 13px;' title='" + i + " " + Math.round(M.percent) + "'><b>" + i + "</b><br/>" + Math.round(M.percent) + "%</div>"
            }
            if (o.length > 0) {
                $.plot("#chart_Exchange_Distribution", k, {
                    series: {
                        pie: {
                            radius: 1,
                            show: true,
                            label: {
                                show: true,
                                radius: 2 / 3,
                                formatter: l,
                                threshold: 0.05
                            },
                            gradient: {
                                radial: true,
                                colors: [{
                                    opacity: 1
                                }, {
                                    opacity: 1
                                }, {
                                    opacity: 0.7
                                }]
                            }
                        }
                    },
                    grid: {
                        hoverable: true
                    },
                    tooltip: {
                        show: true,
                        cssClass: "pieTip",
                        content: "<div style='width:100%;height:100%;color:#000000;font-size:18px;'><span style='font-weight:bold;'>%s</span>: %n " + conversion_curr + "</div>"
                    },
                    legend: {
                        show: false
                    }
                })
            } else {
                $("#chart_Exchange_Distribution").html('<div style="font-size:18px;color:#779EFF;width:100%;text-align:center;">No accounts selected.</div>')
            }
            var u = [];
            if (balanceChartType == "line") {
                var B = parseFloat(x[x.length - 1].btc_balance * conversion_rate).toFixed(8);
                var J = parseFloat(x[0].btc_balance * conversion_rate).toFixed(8);
                var d = ((B - J) / J * 100);
                u.push({
                    currency: "Portfolio",
                    qty: B,
                    change: d
                })
            } else {
                $.each(G, function(Q, R) {
                    var M = G[Q]["balance_curr_code"];
                    var O = parseFloat(G[Q]["btc_share"] * conversion_rate).toFixed(8);
                    var P = Object.keys(x[M])[0];
                    var N = parseFloat(x[M][P] * conversion_rate).toFixed(8);
                    var S = ((O - N) / N * 100);
                    u.push({
                        currency: M,
                        qty: O,
                        change: S
                    })
                })
            }
            if (typeof gainersTable != "undefined") {
                gainersTable.fnClearTable();
                gainersTable.fnAddData(u)
            } else {
                gainersTable = $("#gainers_table").dataTable({
                    bAutoWidth: false,
                    aaData: u,
                    bPaginate: true,
                    bSort: true,
                    iDisplayLength: 10,
                    aaSorting: [
                        [3, "desc"]
                    ],
                    fnRowCallback: function(N, O, Q, T) {
                        var i = "background: -moz-linear-gradient(top, #ff3019 0%, #cf0404 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ff3019), color-stop(100%,#cf0404));background: -webkit-linear-gradient(top, #ff3019 0%,#cf0404 100%);background: -o-linear-gradient(top, #ff3019 0%,#cf0404 100%);background: -ms-linear-gradient(top, #ff3019 0%,#cf0404 100%);background: linear-gradient(to bottom, #ff3019 0%,#cf0404 100%);";
                        var M = "background: -moz-linear-gradient(top, #d2ff52 0%, #91e842 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d2ff52), color-stop(100%,#91e842));background: -webkit-linear-gradient(top, #d2ff52 0%,#91e842 100%);background: -o-linear-gradient(top, #d2ff52 0%,#91e842 100%);background: -ms-linear-gradient(top, #d2ff52 0%,#91e842 100%);background: linear-gradient(to bottom, #d2ff52 0%,#91e842 100%);";
                        var R = "";
                        if (O.change > 100) {
                            O.change = 100
                        }
                        if (O.change < -100) {
                            O.change = -100
                        }
                        if (O.change < 0) {
                            R = i
                        } else {
                            R = M
                        }
                        var P = Math.abs(O.change);
                        var S = parseFloat(O.change).toFixed(2);
                        $("td:eq(3)", N).html('<div style="width:' + P + "%;" + R + 'height:10px;" data-toggle="tooltip" title="' + S + '%"></div>');
                        $("td:eq(0)", N).html('<div class="dataCircle" style="background-color:' + existingPalette[O.currency] + ';"></div>');
                        return N
                    },
                    aoColumns: [{
                        mData: null,
                        sWidth: "15px",
                        bSortable: false
                    }, {
                        mDataProp: "currency",
                        bSearchable: false,
                        bSortable: true,
                        sClass: "left"
                    }, {
                        mDataProp: "qty",
                        bSearchable: false,
                        bSortable: true,
                        sClass: "left"
                    }, {
                        mDataProp: "change",
                        bSearchable: false,
                        bSortable: true,
                        sClass: "left"
                    }, ],
                    sDom: "rtpis"
                })
            }
        },
        error: function(d, f, e) {
            console.log(d + " " + e)
        }
    })
}

function getBalanceChartDataByDate() {
    var c = base_url + "getjson/balanceChartDataByApiByDate";
    var a = getCookieAccounts();
    var b = {
        selected_auth_ids: a,
        start_date: $("#dateBalanceStart").val(),
        end_date: $("#dateBalanceEnd").val(),
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: c,
        data: b,
        async: false,
        success: function(g) {
            var d = new Array();
            var h = g[0];
            var f = new Array();
            $.each(h, function(j, k) {
                f.push([j, k.btc_balance]);
                d.push([j, k.balance_date])
            });
            var e = $.plot($("#chart_Portfolio_Balance"), [{
                data: f,
                label: "Balance History"
            }], {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                legend: {
                    show: false
                },
                xaxis: {
                    ticks: d,
                    mode: "time",
                    minTickSize: [1, "day"]
                },
                yaxis: {
                    tickFormatter: function(j, i) {
                        return parseFloat(parseFloat(j).toFixed(8)).noExponents()
                    }
                }
            })
        }
    })
}

function modifyBalanceValues(d, f) {
    f = f || "";
    var g = parseFloat($("#amtOwned_" + d).val());
    var a = parseFloat($("#exchRate_" + d).val());
    var e = parseFloat($("#totalBTC_" + d).val());
    var h = g * a;
    var c = e / g;
    var b = e / a;
    if (isNaN(h)) {
        h = 0
    }
    if (isNaN(c)) {
        c = 0
    }
    if (isNaN(b)) {
        b = 0
    }
    if (f == "") {
        $("#exchRate_" + d).val(parseFloat(c).toFixed(8))
    }
    if (f == "amtOwned") {
        $("#totalBTC_" + d).val(parseFloat(h).toFixed(8));
        $("#balEditRow_" + d).addClass("balEditActive")
    }
    if (f == "exchRate") {
        $("#totalBTC_" + d).val(parseFloat(h).toFixed(8));
        $("#balEditRow_" + d).addClass("balEditActive")
    }
    if (f == "totalBTC") {
        $("#amtOwned_" + d).val(parseFloat(b).toFixed(8));
        $("#balEditRow_" + d).addClass("balEditActive")
    }
    var i = 0;
    $(".totalBTC").each(function(j) {
        var k = parseFloat($(this).val());
        i = i + k
    });
    $(".balanceEditTotal").html(parseFloat(i).toFixed(8))
}

function getBalanceEditInfo(a, e) {
    modifiedBalanceIDs = [];
    var d = base_url + "getjson/getBalanceEditInfo";
    var b = getCookieAccounts();
    var c = {
        selected_auth_ids: b,
        start_date: $("#dateBalanceStart").val(),
        end_date: $("#dateBalanceEnd").val(),
        balDate: a,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: d,
        data: c,
        async: false,
        success: function(m) {
            $("#balanceEditContent").html("");
            var p = "";
            var l = 0;
            for (var n = 0; n < m.length; n++) {
                p = m[n].balance_date;
                if (!m[n].exch_name) {
                    var h = m[n].balance_curr_code + " Wallet"
                } else {
                    var h = m[n].exch_name
                }
                if (l != m[n].balance_auth_id) {
                    var g = 0.2;
                    var k = ["rgba(33, 150, 243, " + g + ")", "rgba(63, 81, 181, " + g + ")", "rgba(103, 58, 183, " + g + ")", "rgba(156, 39, 176, " + g + ")", "rgba(233, 30, 99, " + g + ")", "rgba(244, 67, 54, " + g + ")", "rgba(3, 169, 244, " + g + ")", "rgba(0, 188, 212, " + g + ")", "rgba(0, 150, 136, " + g + ")", "rgba(76, 175, 80, " + g + ")", "rgba(139, 195, 74, " + g + ")", "rgba(205, 220, 57, " + g + ")", "rgba(38, 50, 56, " + g + ")", "rgba(121, 85, 72, " + g + ")", "rgba(255, 87, 34, " + g + ")", "rgba(255, 152, 0, " + g + ")", "rgba(255, 193, 7, " + g + ")", "rgba(255, 235, 59, " + g + ")"];
                    var o = Math.floor(Math.random() * k.length);
                    var j = k[o];
                    g = 0.1;
                    var k = ["rgba(33, 150, 243, " + g + ")", "rgba(63, 81, 181, " + g + ")", "rgba(103, 58, 183, " + g + ")", "rgba(156, 39, 176, " + g + ")", "rgba(233, 30, 99, " + g + ")", "rgba(244, 67, 54, " + g + ")", "rgba(3, 169, 244, " + g + ")", "rgba(0, 188, 212, " + g + ")", "rgba(0, 150, 136, " + g + ")", "rgba(76, 175, 80, " + g + ")", "rgba(139, 195, 74, " + g + ")", "rgba(205, 220, 57, " + g + ")", "rgba(38, 50, 56, " + g + ")", "rgba(121, 85, 72, " + g + ")", "rgba(255, 87, 34, " + g + ")", "rgba(255, 152, 0, " + g + ")", "rgba(255, 193, 7, " + g + ")", "rgba(255, 235, 59, " + g + ")"];
                    var q = k[o];
                    var f = '<div class="form-row" style="background-color:' + q + ';margin-top:10px;margin-bottom:0px;"><div class="col-md-12 balanceEditAccountTitle" style="background-color:' + j + ';"><span class="balanceEditAccountName">' + m[n].auth_nickname + '</span> (<span class="balanceEditExchangeName">' + h + "</span>)</div></div>";
                    l = m[n].balance_auth_id
                } else {
                    var f = ""
                }
                $("#balanceEditContent").append(f + '<div class="form-row" style="background-color:' + q + ';margin-bottom:0px;height:40px;padding-top:5px;" id="balEditRow_' + m[n].balance_id + '"><div class="col-md-3 balEditCurrCode">' + m[n].balance_curr_code + '</div><div class="col-md-3">    <input type="text" id="amtOwned_' + m[n].balance_id + '" class="form-control amtOwned balEditField" data-balid="' + m[n].balance_id + '" data-fieldnm="amtOwned" value="' + m[n].balance_amount_total + '"/></div><div class="col-md-3">    <input type="text" id="exchRate_' + m[n].balance_id + '" class="form-control exchRate balEditField" data-balid="' + m[n].balance_id + '" data-fieldnm="exchRate" value=""/></div><div class="col-md-3">    <input type="text" id="totalBTC_' + m[n].balance_id + '" class="form-control totalBTC balEditField" data-balid="' + m[n].balance_id + '" data-fieldnm="totalBTC" value="' + m[n].btc_balance + '"/></div></div>')
            }
            $("#editBalancesDate").html(p);
            $(".amtOwned").each(function(i) {
                var s = $(this).data("balid");
                modifyBalanceValues(s)
            });
            $("#modal_edit_balance").modal("show")
        }
    })
}

function saveEditedBalances() {
    var a = $("#editBalancesDate").html();
    var c = base_url + "post/saveEditedBalances";
    var b = {
        balDate: a,
        editedBalances: modifiedBalanceIDs,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        url: c,
        data: b,
        async: false,
        success: function(d) {
            if (d.error == false) {
                $("#modal_edit_balance").modal("hide");
                getBalanceChartData()
            } else {
                notify_error("Failed to update balances", "We were unable to update your historical balances.")
            }
        }
    })
}

function exportBalanceChartDataByDate() {
    var c = base_url + "getjson/exportBalanceChartDataByApiByDate";
    var a = getCookieAccounts();
    var b = {
        selected_auth_ids: a,
        start_date: $("#dateBalanceStart").val(),
        end_date: $("#dateBalanceEnd").val(),
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        url: c,
        data: b,
        async: false,
        success: function(h, i, o) {
            var e = "";
            var f = o.getResponseHeader("Content-Disposition");
            if (f && f.indexOf("attachment") !== -1) {
                var g = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var k = g.exec(f);
                if (k != null && k[1]) {
                    e = k[1].replace(/['"]/g, "")
                }
            }
            var m = o.getResponseHeader("Content-Type");
            var d = new Blob([h], {
                type: m
            });
            if (typeof window.navigator.msSaveBlob !== "undefined") {
                window.navigator.msSaveBlob(d, e)
            } else {
                var l = window.URL || window.webkitURL;
                var j = l.createObjectURL(d);
                if (e) {
                    var n = document.createElement("a");
                    if (typeof n.download === "undefined") {
                        window.location = j
                    } else {
                        n.href = j;
                        n.download = e;
                        document.body.appendChild(n);
                        n.click()
                    }
                } else {
                    window.location = j
                }
                setTimeout(function() {
                    l.revokeObjectURL(j)
                }, 100)
            }
        }
    })
}

function refreshBalancesStatistics() {
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "cron/routines/CreateUserBalanceSnapshot/0",
        success: function(a) {
            getBalanceChartData();
            getPortfolioBalance();
            getProfit();
            $("#refresh_button").removeClass("icon-refreshing");
            $("#refresh_button").addClass("icon-refresh")
        },
        error: function(a, c, b) {
            console.log("error: " + c + ": " + b);
            console.log(a)
        }
    })
}

function refreshBalancesStatisticsSilent() {
    jQuery.ajax({
        type: "GET",
        dataType: "HTML",
        url: base_url + "cron/routines/CreateUserBalanceSnapshot/1",
        success: function(a) {
            if (view_name == "overview" || sub_view_name == "balances_chart") {
                getBalanceChartData();
                getPortfolioBalance()
            }
            if (view_name == "overview") {
                getProfit()
            }
        },
        error: function(a, c, b) {
            console.log("error: " + c + ": " + b);
            console.log(a)
        }
    })
}

function refreshBalances() {
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "getjson/get_current_user_api_keys_active",
        success: function(a) {
            refreshAllBalances(a)
        },
        error: function(a, c, b) {
            console.log("error: " + c + ": " + b);
            console.log(a)
        }
    })
}

function refreshAllBalances(d) {
    $("#refresh_button").removeClass("icon-refresh");
    $("#refresh_button").addClass("icon-refreshing");
    remainingToRefresh = d.aaData.length;
    for (var b = 0; b < d.aaData.length; b++) {
        var f = d.aaData[b];
        var e = f.auth_id;
        var a = f.auth_nickname;
        refreshBalance(e, a, true)
    }
    var c = getCookieAccounts()
}

function refreshBalance(b, a, c) {
    $("#refresh_button_" + b).addClass("icon-refreshing");
    $("#refresh_button_" + b).removeClass("icon-refresh");
    jQuery.ajax({
        type: "GET",
        dataType: "HTML",
        url: base_url + "cron/routines/UpdateBalance/" + b,
        success: function(e) {
            if (view_name == "marketsv2") {
                remainingToRefresh = 1
            }
            var d = getCookieAccounts();
            $("#refresh_button_" + b).removeClass("icon-refreshing");
            $("#refresh_button_" + b).addClass("icon-refresh");
            $("#refreshOrderBalances").addClass("icon-refresh");
            $("#refreshOrderBalances").removeClass("icon-refreshing");
            remainingToRefresh -= 1;
            if (remainingToRefresh <= 0) {
                setSelectedAccounts();
                refreshBalancesStatisticsSilent();
                $("#refresh_button").removeClass("icon-refreshing");
                $("#refresh_button").addClass("icon-refresh");
                if (view_name == "marketsv2") {
                    refreshTables(true)
                }
                mixpanel.track("Refreshed a Balance");
                ga("send", "event", "action", "refreshedbalance", "Refreshed a balance", 0)
            }
        },
        error: function(d, f, e) {
            refreshErrored += 1;
            if (remainingToRefresh - refreshErrored <= 0) {
                $("#refresh_button_" + b).removeClass("icon-refreshing");
                $("#refresh_button_" + b).addClass("icon-refresh")
            }
        }
    })
}

function refreshBalanceMarkets(b, a) {
    $("#refreshOrderBalances").removeClass("icon-refresh");
    $("#refreshOrderBalances").addClass("icon-refreshing");
    if (typeof a === "undefined" || a === null) {
        a = 1
    }
    jQuery.ajax({
        type: "GET",
        dataType: "HTML",
        url: base_url + "cron/routines/UpdateBalance/" + b + "/" + a,
        success: function(c) {
            jQuery.ajax({
                type: "GET",
                dataType: "HTML",
                url: base_url + "cron/routines/UpdateOrders/" + b + "/" + a,
                success: function(d) {
                    if (view_name == "marketsv2") {
                        getMarketsBalanceTable(current_auth_id);
                        refreshTables(true)
                    } else {
                        if (view_name == "orders") {
                            ordersTable.fnReloadAjax();
                            priorordersTable.fnReloadAjax()
                        }
                    }
                    $("#refreshOrderBalances").removeClass("icon-refreshing");
                    $("#refreshOrderBalances").addClass("icon-refresh")
                },
                error: function(d, f, e) {}
            })
        },
        error: function(c, e, d) {}
    })
}

function getAPIAccounts(b, c) {
    var a = "getjson/get_current_user_api_keys_active";
    if (b == "markets") {
        a = "getjson/get_current_user_api_keys_byExchange/" + balances_exchange_id
    }
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + a,
        success: function(d) {
            if (b == "markets") {
                outputAPIAccounts_MarketsList(d)
            } else {
                if (b == "balances") {
                    outputAPIAccounts(d)
                } else {
                    if (b == "overview") {
                        outputAPIAccounts_Overview(d, c)
                    }
                }
            }
        },
        error: function(d, f, e) {}
    })
}

function outputAPIAccounts(f) {
    var j = $("#apiList");
    j.append("<table class='table table-first-column-number data-table small table-striped sortable_simple'><thead><tr><th></th><th></th><th></th></tr></thead><tbody id='balanceBody'>");
    var d = getCookieAccounts();
    var h = d.split("_");
    var k = "";
    for (var g = 0; g < f.aaData.length; g++) {
        var e = f.aaData[g];
        var a = e.auth_id;
        var c = escapeHtml(e.auth_nickname);
        if (h.indexOf(a) > -1 || d == "") {
            k = "checked"
        }
        if (sub_view_name == "balances_chart") {
            var b = ""
        } else {
            var b = "<span id='refresh_button_" + a + "' class='icon-refresh balance-refresh' data-authid='" + a + "' data-nickname='" + c + "' style='cursor:pointer;'></span>"
        }
        $("#balanceBody").append("<tr><td><input type='checkbox' style='width:25px;height:15px;' id='chk_" + a + "' name='api_keys_chk_group' " + k + " value ='" + a + "' label='auth_nickname'></td><td><span style='font-size:14px;'>" + e.auth_nickname + "</span></td><td>" + b + "</td></tr>");
        k = ""
    }
    if (d == "") {
        var d = getSelectedAccounts();
        setCookie("selected_accounts", d, 30)
    }
    getBalanceTable()
}

function outputAPIAccounts_Overview(d, a) {
    var h = $("#apiList").empty();
    var j = '<select class="form-control" name="api_select_box" id="api_select_box" style="margin-left:-2px;padding-left:5px;">';
    j += "<option>Select Account<option>";
    result_length = d.aaData.length;
    for (var e = 0; e < d.aaData.length; e++) {
        var c = d.aaData[e];
        var a = c.auth_id;
        if (e == 0) {
            active_auth_id = c.auth_id
        }
        var g = c.exch_id;
        var b = escapeHtml(c.auth_nickname);
        j = j + '<option value="' + a + '">' + b + "</option>"
    }
    j = j + "</select>";
    if (result_length == 0) {
        h.append('<center><a id="add_api_acct_overview" href="' + base_url + 'user/api" target="_blank">Add API account...</a></center>')
    } else {
        h.append(j);
        var f = getCookie("selected_overview_balance_account") || 0;
        if (f > 0) {
            $('#api_select_box option[value="' + f + '"]').prop("selected", "selected");
            $("#balance_acct_nickname").html($("#api_select_box option:selected").text())
        }
        getOverviewBalanceTable(f)
    }
}

function outputAPIAccounts_MarketsList(f) {
    var e = $("#apiList").empty();
    var a = '<select name="api_select_box" id="api_select_box" class="balances_select">';
    result_length = f.aaData.length;
    for (var d = 0; d < f.aaData.length; d++) {
        var h = f.aaData[d];
        var g = h.auth_id;
        if (d == 0) {
            active_auth_id = h.auth_id
        }
        var c = h.exch_id;
        var b = escapeHtml(h.auth_nickname);
        a = a + '<option value="' + g + '">' + b + "</option>"
    }
    a = a + "</select>";
    if (result_length == 0) {
        e.append('<center><a href="' + base_url + 'user/api" target="_blank">Add API account...</a></center>');
        active_auth_id = null;
        primary_trade_balance = "0.00";
        secondary_trade_balance = "0.00";
        updateTradeBalanceFields()
    } else {
        e.append(a)
    }
}

function formatNumber(e) {
    var a = e.split(".");
    var d = a[0];
    var b = a.length > 1 ? "." + a[1] : "";
    var c = /(\d+)(\d{3})/;
    while (c.test(d)) {
        d = d.replace(c, "$1,$2")
    }
    return d + b
}

function gzBalance(c, b) {
    b = 8;
    z = "";
    r = "";
    new_r = "";
    r = parseFloat(c).toFixed(b);
    if (r.match(/\./)) {
        new_r = '<span style="">' + r.replace(/\.?0+$/, "") + "</span>";
        var a = r.match(/\.?0+$/);
        if (a == null) {
            a = ""
        }
        z = '<span style="visibility:hidden;">' + a + "</span>&nbsp;"
    }
    return new_r + z
}
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "num-html-pre": function(c) {
        var b = c.replace(/\D/g, "");
        console.log(b);
        return parseFloat(b)
    },
    "num-html-asc": function(d, c) {
        return ((d < c) ? -1 : ((d > c) ? 1 : 0))
    },
    "num-html-desc": function(d, c) {
        return ((d < c) ? 1 : ((d > c) ? -1 : 0))
    }
});
$total_balance = 0;
var iTotalBtc = 0;

function getBalanceTable() {
    var c = getCookieAccounts();
    var b = c.split("_").length;
    var a = base_url + "getjson/balancetable/";
    if (sub_view_name != "balances_chart") {
        var d = {
            auth_id: c,
            showNils: 0,
            group: 1,
            dustbin: option_dust,
            quote_curr: conversion_curr,
            csrf_coinigy: $("#csrf_coinigy").val()
        };
        balanceTable = $("#balance_table").dataTable({
            sAjaxSource: a,
            bPaginate: false,
            bLengthChange: false,
            bStateSave: true,
            iDisplayLength: 10000,
            fnServerData: function(e, f, g) {
                $("#DustNumber").parent().hide();
                request = $.ajax({
                    dataType: "JSON",
                    type: "POST",
                    url: e,
                    data: d,
                    success: g
                });
                request.success(function(i) {
                    var h = i.hiddenCount;
                    if (h > 0) {
                        $("#DustNumber").text(h).parent().show()
                    }
                })
            },
            fnDrawCallback: function(e) {
                iTotalBtc = 0
            },
            fnRowCallback: function(f, g, l, o) {
                var e = parseFloat(parseFloat($("td:eq(3)", f).html()).toFixed(8)).noExponents();
                var k = parseFloat(parseFloat($("td:eq(4)", f).html()).toFixed(8)).noExponents();
                var j = parseFloat(parseFloat($("td:eq(5)", f).html()).toFixed(8)).noExponents();
                var i = parseFloat(parseFloat($("td:eq(6)", f).html()).toFixed(8)).noExponents();
                var p = $("td:eq(7)", f).html().replace(/[^\d.-]/g, "");
                iTotalBtc += p * 1;
                var q = g.balance_id;
                var n = g.balance_hidden;
                var m = g.exch_id;
                if (n == 0) {
                    hide_balance = 1
                } else {
                    hide_balance = 0
                }
                if (g.has_image == 1) {
                    $("td:eq(0)", f).html('<img src="' + base_url + "assets/img/currency/" + g.balance_curr_code + '.png" width="20" />')
                } else {
                    $("td:eq(0)", f).html('<img src="' + base_url + 'assets/img/currency/empty.png" width="20" />')
                }
                var h = g.balance_curr_code;
                if (h == conversion_curr) {
                    $("td:eq(6)", f).html("-")
                }
                b = getSelectedAccounts().split("_").length;
                if (b == 1) {
                    if (hide_balance == 1) {
                        $("td:eq(8)", f).html("<div><button class='btn btn-small sweepDust' style='width:100px;' data-balancecurr='" + h + "' data-balancehidden='" + hide_balance + "' data-balanceid='" + q + "'>Sweep Dust</button></div>")
                    } else {
                        $("td:eq(8)", f).html("<div><button class='btn btn-small sweepDust' style='width:100px;' data-balancecurr='" + h + "' data-balancehidden='" + hide_balance + "' data-balanceid='" + q + "'>Recover</button></div>")
                    }
                } else {
                    $("td:eq(8)", f).html("")
                }
                return f
            },
            fnFooterCallback: function(h, i, g, f, e) {
                var j = parseFloat(parseFloat(iTotalBtc).toFixed(8)).noExponents();
                $("#balance_totals").html("Estimated Value: " + formatNumber(j) + " <span class='quote_currency'>" + conversion_curr + "</span>");
                $(".quote_currency").html(conversion_curr)
            },
            aoColumns: [{
                mData: null,
                sWidth: 20
            }, {
                mDataProp: "balance_curr_code",
                bSearchable: true,
                sWidth: 50
            }, {
                mDataProp: "curr_name",
                bSearchable: true
            }, {
                mDataProp: "balance_amount_avail",
                bSearchable: false,
                sType: "num-html",
                sClass: "balanceRight",
                fnRender: function(e) {
                    return formatNumber(gzBalance(e.aData.balance_amount_avail))
                }
            }, {
                mDataProp: "balance_amount_held",
                bSearchable: false,
                sType: "num-html",
                sClass: "balanceRight",
                fnRender: function(e) {
                    return formatNumber(gzBalance(e.aData.balance_amount_held))
                }
            }, {
                mDataProp: "balance_amount_total",
                bSearchable: false,
                sType: "num-html",
                sClass: "balanceRight",
                fnRender: function(e) {
                    return formatNumber(gzBalance(e.aData.balance_amount_total))
                }
            }, {
                mDataProp: "last_price",
                bSearchable: false,
                sType: "num-html",
                sClass: "balanceRight",
                fnRender: function(e) {
                    return formatNumber(gzBalance(e.aData.last_price))
                }
            }, {
                mDataProp: "btc_balance",
                bSearchable: false,
                sType: "num-html",
                sClass: "balanceRight",
                fnRender: function(e) {
                    return formatNumber(gzBalance(e.aData.btc_balance))
                }
            }, {
                mDataProp: "balance_hidden",
                bSearchable: false,
                bSortable: false,
                sWidth: 100
            }],
            sDom: ""
        })
    }
}

function getSelectedAccounts() {
    var a = "";
    $("input:checkbox[name=api_keys_chk_group]:checked").each(function() {
        a += $(this).val() + "_"
    });
    a = a.replace(/(^_)|(_$)/g, "");
    if (a.length == 0) {
        a = 0
    }
    return a
}

function getCookieAccounts() {
    var a = "";
    a = getCookie("selected_accounts");
    return a
}
$("#btnGetBalanceData").click(function() {
    getBalanceChartData()
});
$("#btnExportBalanceData").click(function() {
    exportBalanceChartDataByDate()
});
$(".balance-stats-refresh").live("click", function() {
    $("#refresh_button").removeClass("icon-refresh");
    $("#refresh_button").addClass("icon-refreshing");
    refreshBalances()
});
$(".balance-refresh").live("click", function() {
    var b = $(this).data("authid");
    var a = $(this).data("nickname");
    $("#chk_" + b).prop("checked", true);
    remainingToRefresh = 0;
    refreshBalance(b, a, true)
});
$(":checkbox").live("click", function() {
    setSelectedAccounts()
});
$("#exchangeRatesHelp").click(function() {
    $("#exchangeRatesModal").modal("show")
});
$("#dustHelp").click(function() {
    $("#DustInfoModal").modal("show")
});
$("#checkAll").click(function() {
    if (document.getElementById("checkAll").checked) {
        $("input[type=checkbox]").each(function() {
            this.checked = true
        })
    } else {
        $("input[type=checkbox]").each(function() {
            this.checked = false
        })
    }
    setSelectedAccounts()
});
$(".sweepDust").live("click", function() {
    var b = $(this).data("balanceid");
    var c = $(this).data("balancehidden");
    var a = $(this).data("balancecurr");
    sweepDust(b, c, a)
});
$("#quote_currency_select").change(function() {
    var a = $(this).find("option:selected").val();
    setCookie("balanceQuoteCurr", a, 30);
    conversion_curr = a;
    $(".quote_currency").html(a);
    $(".conversion_curr").text(conversion_curr);
    if (view_name == "overview") {
        getBalanceChartData();
        getPortfolioBalance();
        getProfit();
        return
    }
    if (balanceTable) {
        balanceTable.fnDestroy();
        getBalanceTable()
    } else {
        getBalanceChartData()
    }
});

function setSelectedAccounts() {
    selected = getSelectedAccounts();
    setCookie("selected_accounts", selected, 7);
    setOptions()
}
$(document).ready(function() {
    $("#quote_currency_select").val(conversion_curr);
    $("#filterBalances").keyup(function() {
        balanceTable.fnFilter(this.value)
    })
});

function sweepDust(c, d, a) {
    var e = {
        balance_id: c,
        balance_hidden: d,
        balance_curr: a,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    var b = base_url + "post/UpdateBalanceDust";
    jQuery.ajax({
        type: "POST",
        dataType: "HTML",
        data: e,
        url: b,
        success: function() {
            setTimeout(function() {
                setOptions()
            }, 300)
        },
        error: function(f, h, g) {
            console.log(g)
        }
    })
};
