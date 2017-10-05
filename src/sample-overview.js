var isSorting = false;
$(document).ready(function() {
    setContainerHeights();
    $(".sortMarketWatch").live("click", function() {
        var a = $(this).data("sortmetric");
        var b = "";
        if ($(this).hasClass("sorting")) {
            b = "sorting"
        }
        if ($(this).hasClass("sorting_asc")) {
            b = "sorting_asc"
        }
        if ($(this).hasClass("sorting_desc")) {
            b = "sorting_desc"
        }
        $(".sortMarketWatch").removeClass("sorting_asc");
        $(".sortMarketWatch").removeClass("sorting_desc");
        $(".sortMarketWatch").addClass("sorting");
        switch (b) {
            case "sorting":
                $(this).removeClass("sorting");
                $(this).removeClass("sorting_desc");
                $(this).addClass("sorting_asc");
                sortMarketWatch(a, "asc");
                break;
            case "sorting_asc":
                $(this).removeClass("sorting_asc");
                $(this).removeClass("sorting");
                $(this).addClass("sorting_desc");
                sortMarketWatch(a, "desc");
                break;
            case "sorting_desc":
                $(this).removeClass("sorting_asc");
                $(this).removeClass("sorting_desc");
                $(this).addClass("sorting");
                sortMarketWatch(a, "default");
                break;
            default:
                break
        }
    });
    $("#api_select_box").live("change", function() {
        if ($(this).val() != "Select Account") {
            getOverviewBalanceTable($(this).val());
            setCookie("selected_overview_balance_account", $(this).val(), 30);
            getAPIAccounts("overview", $("#api_select_box").val())
        }
    });
    getAPIAccounts("overview", $("#api_select_box").val());
    getMarketWatch(0);
    getBalanceChartData();
    getPortfolioBalance();
    getProfit();
    loadMarketWatchSearch();
    if ($("#add_api_acct_overview").length) {
        $("<a href='" + base_url + "user/api' class='addAPIOverview'><div style='padding:65px 10px 0px 50px;font-size:18px;'><div style='float:left;font-size:45px;width:50px;height:50px;'><i class='icon-plus-sign'></i></div><div style='float:left;width:165px;height:50px;margin-top:8px;'>Add your first API Account to enable</div></div></a>").css({
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "rgba(0,0,0,0.5)"
        }).appendTo($("#portfolio_at_a_glance").css("position", "relative"));
        $("<a href='" + base_url + "user/api' class='addAPIOverview'><div style='padding:75px 10px 0px 50px;font-size:18px;'><div style='float:left;font-size:45px;width:50px;height:50px;'><i class='icon-plus-sign'></i></div><div style='float:left;width:165px;height:50px;margin-top:8px;'>Add your first API Account to enable</div></div></a>").css({
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "rgba(0,0,0,0.5)"
        }).appendTo($("#portfolio_distribution").css("position", "relative"));
        $("<a href='" + base_url + "user/api' class='addAPIOverview'><div style='padding:85px 10px 0px 50px;font-size:18px;'><div style='float:left;font-size:45px;width:50px;height:50px;'><i class='icon-plus-sign'></i></div><div style='float:left;width:165px;height:50px;margin-top:8px;'>Add your first API Account to enable</div></div></a>").css({
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "rgba(0,0,0,0.5)"
        }).appendTo($("#historical_portfolio_value").css("position", "relative"))
    }
    $(".overviewSection").live("click", function() {
        $(this).nextAll(".overviewChart").first().slideToggle();
        var b = 180;
        $(this).find(".icon-caret-up").toggleClass("rotate-180");
        var a = $(this).nextAll(".overviewChart").first().find(".chartDiv").prop("id");
        createCandlestickChart(a, initialData, false)
    });
    $(document).on("mouseenter", ".overviewSection", function() {
        $(this).find(".tiny_close_button").show();
        $(this).find(".careticon").hide()
    });
    $(document).on("mouseleave", ".overviewSection", function() {
        $(this).find(".tiny_close_button").hide();
        $(this).find(".careticon").show()
    });
    $(document).on("mouseenter", ".tiny_close_button", function() {
        $(this).find(".tiny_close_button_img").attr("src", base_url + "assets/img/icons/tiny_close_button_hover.png")
    });
    $(document).on("mouseleave", ".tiny_close_button", function() {
        $(this).find(".tiny_close_button_img").attr("src", base_url + "assets/img/icons/tiny_close_button.png")
    });
    $(".tiny_close_button").live("click", function(c) {
        c.stopPropagation();
        $(this).find(".tiny_close_button_img").effect("highlight");
        $(this).closest(".overviewSection").fadeOut();
        var a = $(this).data("exchid");
        var b = $(this).data("mktid");
        deleteFavoriteMarketWatch(a, b)
    });
    $("#toggleCharts").click(function(a) {
        a.preventDefault();
        $(".swappable").slideToggle()
    });
    $("#addFavoriteMarketWatch").click(function(a) {
        a.preventDefault();
        addFavoriteMarketWatch();
        mixpanel.track("Favorited a Market (Overview)");
        ga("send", "event", "action", "favoritedmarket", "Favorited a market", 0)
    });
    $("body").tooltip({
        selector: "[rel=tooltip]"
    });
    $("#marketWatchSearch").bind("enterKey", function(a) {
        $("#addFavoriteMarketWatch").click()
    });
    $("#marketWatchSearch").keyup(function(a) {
        if (a.keyCode == 13) {
            $(this).trigger("enterKey")
        }
    })
});
$(window).on("resize", function() {
    setContainerHeights()
});
$(".btnTimePeriod").click(function() {
    $(".btnTimePeriod").removeClass("active");
    $(this).addClass("active");
    var b = $(this).html();
    $(".watchTimePeriod").html(b);
    var a = $(this).data("timeperiod");
    switchTimePeriod(a)
});
var overview_time_period = 0;
setInterval(function() {
    updateCharts(overview_time_period)
}, 180000);

function switchTimePeriod(a) {
    overview_time_period = a;
    $("#marketWatch").fadeTo("slow", 0.5);
    getMarketWatch(a);
    $("#marketWatch").fadeTo("slow", 1);
    sortMarketWatch("sortmarket", "asc");
    $(".sortMarketWatch").removeClass("sorting_asc");
    $(".sortMarketWatch").removeClass("sorting_desc");
    $(".sortMarketWatch").removeClass("sorting");
    $(".sortMarketWatch").addClass("sorting");
    $("#sortByMarket").removeClass("sorting");
    $("#sortByMarket").addClass("sorting_asc")
}

function removeZeroes(c, b) {
    b = 8;
    z = "";
    r = "";
    new_r = "";
    r = parseFloat(c).toFixed(b);
    if (r.match(/\./)) {
        new_r = r.replace(/\.?0+$/, "");
        var a = r.match(/\.?0+$/);
        if (a == null) {
            a = ""
        }
        z = ""
    }
    return new_r + z
}

function createTools(f, h, n, o, c, g, e, a, j) {
    $("#" + f).find(".knobby").knob({
        width: 25,
        height: 25,
        fgColor: h,
        displayInput: false
    });
    $("#" + f).find(".knobby").val(Math.abs(Math.ceil(n))).trigger("change");
    var b = o;
    var m = g;
    var d = c;
    if (o < 1) {
        b = o * 100000000;
        m = g * 100000000;
        d = c * 100000000
    }
    $("#" + f).find(".priceRange").sparkline([b, d, m], {
        type: "box",
        width: "80px",
        height: "20px",
        boxFillColor: "rgba(0,0,0,0)",
        whiskerColor: "rgba(0,0,0,0)",
        boxLineColor: "rgba(0,0,0,0)",
        medianColor: "#ffffff"
    });
    if (j[0] < 1) {
        var k = "y.8"
    } else {
        var k = "y"
    }
    $("#" + f).find(".priceLine").sparkline(j, {
        type: "line",
        lineColor: "#ffffff",
        fillColor: "rgba(255,255,255,0.1)",
        lineWidth: 2,
        height: 25,
        width: 280,
        spotColor: undefined,
        minSpotColor: undefined,
        maxSpotColor: undefined,
        highlightSpotColor: undefined,
        highlightLineColor: undefined,
        chartRangeMin: Math.min.apply(Math, j),
        chartRangeMax: Math.max.apply(Math, j),
        drawNormalOnTop: false,
        tooltipFormat: "{{" + k + "}}",
    });
    var l = Math.abs(Math.ceil(a));
    $("#" + f).find(".volChange").sparkline([50, l, 100], {
        type: "bullet",
        width: "60px",
        height: "20px",
        targetColor: "rgba(0,0,0,0.1)",
        performanceColor: e,
        rangeColors: ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]
    })
}

function searchArrExchMkt(d, c, b) {
    for (var a = 0; a < b.length; a++) {
        if (b[a].exch_code == d) {
            if (b[a].mkt_name == c) {
                return b[a]
            }
        }
    }
}

function createCandlestickChart(n, k, h) {
    var c = n.split("_");
    var g = c[1];
    var j = c[2] + "/" + c[3];
    if (h == true) {
        var d = k
    } else {
        var d = searchArrExchMkt(g, j, initialData)
    }
    var l = [];
    for (var f = 0; f < d.ChartData.length; f++) {
        var o = d.ChartData[f].time_start.split(/[- :]/);
        var a = new Date(o[0], o[1] - 1, o[2], o[3], o[4], o[5]);
        l.push([a.getTime(), parseFloat(d.ChartData[f].open), parseFloat(d.ChartData[f].close), parseFloat(d.ChartData[f].low), parseFloat(d.ChartData[f].high)])
    }
    l.reverse();
    var b = 5;
    var e = $.plot.candlestick.createCandlestick({
        label: "",
        data: l,
        candlestick: {
            show: true
        }
    });
    var p = {
        series: {
            editMode: "v",
            editable: false,
            candlestick: {
                active: true,
                rangeColor: "#FFFFFF",
                upColor: "#FFFFFF",
                downColor: "#FFFFFF",
                neutralColor: "#FFFFFF"
            }
        },
        xaxis: {
            mode: "time",
            min: l[0][0] - 1000000,
            max: l[l.length - 1][0] + 1000000
        },
        yaxis: {
            tickFormatter: function(s, q) {
                return parseFloat(parseFloat(s).toFixed(8)).noExponents()
            }
        },
        grid: {
            hoverable: true,
            clickable: false,
            editable: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "<span style='color:black;'>%s %x %y</span>"
        }
    };
    var m = $.plot($("#" + n), e, p)
}

function setContainerHeights() {
    var a = 310;
    $("#industry_news").css("height", a + "px");
    $("#video_news").css("height", a + "px");
    $("#change_log").css("height", a + "px")
}

function formatAMPM(b) {
    var d = b.split(" ");
    var f = d[0].split("-");
    var k = d[1].split(":");
    var a = new Date(f[0], f[1], f[2], k[0], k[1], k[2], 0);
    var e = new Date(a + " UTC");
    var j = e.getHours();
    var c = e.getMinutes();
    var g = j >= 12 ? "PM" : "AM";
    j = j % 12;
    j = j ? j : 12;
    c = c < 10 ? "0" + c : c;
    var h = j + ":" + c + " " + g;
    return h
}

function getRSSFeeds() {
    var b = "Jan 1, 1901";
    var a = "";
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "getjson/rss_feed",
        async: false,
        success: function(d) {
            var c = [];
            $.each(d, function(e, f) {
                if (b != f.pubDate) {
                    b = f.pubDate;
                    a += '<div class="header"><h2>' + f.pubDate + "</h2></div>"
                }
                var g = formatAMPM(f.published_date);
                a += '<a href="' + f.url + '" class="list-item tipl" target="_blank" title="' + f.feed_name + '"><div class="list-info"><img src="' + base_url + "assets/img/news/" + f.feed_image + '" class="img-circle img-thumbnail"/><div class="news_time">' + g + '</div></div></div><div class="list-text"><span class="list-text-name">' + f.title + "</span></div></a>"
            });
            $("#industry_news").append(a)
        },
        error: function(c, e, d) {
            console.log("error2")
        }
    })
}

function getVideoFeeds() {
    var b = "Jan 1, 1901";
    var a = "";
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "getjson/video_feed",
        async: false,
        success: function(d) {
            var c = [];
            $.each(d, function(e, f) {
                if (b != f.pubDate) {
                    b = f.pubDate;
                    a += '<div class="header"><h2>' + f.pubDate + "</h2></div>"
                }
                var g = formatAMPM(f.published_date);
                a += '<a href="' + f.link + '" class="list-item tipl" target="_blank" title="' + f.feed_name + '"><div class="list-text"><span class="list-text-name">' + f.title + "</span><div><center>" + f.embed_code + "</center></div></div></a>"
            });
            $("#video_news").append(a)
        },
        error: function(c, e, d) {
            console.log("error2")
        }
    })
}

function getTop10Bottom10() {
    var a = "";
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "getjson/top10_bottom10",
        async: false,
        success: function(b) {
            $.each(b, function(d, e) {
                var c = "red";
                if (d < 10) {
                    c = "green"
                }
                if (d == 10) {
                    a += '<div class="list-item" style="height:20px;"></div>'
                }
                a += '<div class="list-item" style="padding:10px;color:' + c + ';">' + e.exchange_name + " - " + e.market + " " + e.percent_change + "% (" + e.last_price + ")";
                "</div>"
            });
            $("#top10bottom10").append(a)
        },
        error: function(b, d, c) {
            console.log("error2")
        }
    })
}

function getOverviewChartData() {
    jQuery.ajax({
        type: "GET",
        dataType: "JSON",
        url: base_url + "getjson/overviewChartData",
        async: false,
        success: function(g) {
            var f = g[0];
            var n = g[1];
            var e = g[3];
            var a = g[2];
            var m = new Array();
            var c = new Array();
            var h = new Array();
            var d = new Array();
            $.each(f, function(o, p) {
                m.push([o, p.close])
            });
            $.each(n, function(o, p) {
                c.push([o, p.close])
            });
            $.each(e, function(o, p) {
                h.push([o, p.close])
            });
            $.each(a, function(o, p) {
                d.push([o, p.close])
            });
            m.pop();
            c.pop();
            h.pop();
            d.pop();
            var l = $.plot($("#chart_CI_BTC_USD"), [{
                data: m,
                label: "CI_BTC_USD"
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
                    ticks: []
                },
                yaxis: {
                    tickFormatter: function(p, o) {
                        return parseFloat(parseFloat(p).toFixed(8)).noExponents()
                    }
                }
            });
            var k = $.plot($("#chart_CI_LTC_BTC"), [{
                data: c,
                label: "CI_LTC_BTC"
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
                    ticks: []
                },
                yaxis: {
                    tickFormatter: function(p, o) {
                        return parseFloat(parseFloat(p).toFixed(8)).noExponents()
                    }
                }
            });
            var b = $.plot($("#chart_CI_LTC_USD"), [{
                data: h,
                label: "CI_LTC_USD"
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
                    ticks: []
                },
                yaxis: {
                    tickFormatter: function(p, o) {
                        return parseFloat(parseFloat(p).toFixed(8)).noExponents()
                    }
                }
            });
            var j = $.plot($("#chart_CI_DOGE_BTC"), [{
                data: d,
                label: "CI_DOGE_BTC"
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
                    ticks: []
                },
                yaxis: {
                    tickFormatter: function(p, o) {
                        return parseFloat(parseFloat(p).toFixed(8)).noExponents()
                    }
                }
            })
        },
        error: function(a, c, b) {
            console.log(a + " " + b)
        }
    })
}
var initialData = [];

// b time period
function updateCharts(b) {
    var a = {
        time_period: b,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        data: a,
        url: base_url + "getjson/get_current_user_overview_charts",
        async: false,
        success: function(c) {
            $.each(c, function(h, j) {
                var g = "chart_" + j.exch_code + "_" + j.mkt_name.replace("/", "_");
                var k = "watch_" + j.exch_code + "_" + j.mkt_name.replace("/", "_");
                var f = [];
                for (var h = 0, d = j.ChartData.length; h < d; h++) {
                    f.push(j.ChartData[h].close)
                }
                var e = j.ChartData[0].close;
                $("#" + k).find(".item_last_price").data("openprice", e);
                $("#" + k).find(".priceLine").sparkline(f, {
                    type: "line",
                    lineColor: "#FFFFFF",
                    fillColor: "rgba(255,255,255,0.1)",
                    lineWidth: 2,
                    height: 25,
                    width: 280,
                    spotColor: undefined,
                    minSpotColor: undefined,
                    maxSpotColor: undefined,
                    highlightSpotColor: undefined,
                    highlightLineColor: undefined,
                    chartRangeMin: Math.min.apply(Math, f),
                    chartRangeMax: Math.max.apply(Math, f),
                    drawNormalOnTop: false
                });
                if ($("#" + g).is(":visible")) {
                    createCandlestickChart(g, j, true)
                }
            })
        },
        error: function(c, e, d) {
            console.log("error2")
        }
    })
}

function getSortMetric() {
    var b = [];
    var c = $(".overviewSection1").find(".sorting_desc").data("sortmetric");
    var a = $(".overviewSection1").find(".sorting_asc").data("sortmetric");
    if (typeof c !== "undefined") {
        b.metric = c;
        b.sort = "desc"
    }
    if (typeof a !== "undefined") {
        b.metric = a;
        b.sort = "asc"
    }
    if (typeof b.metric === "undefined") {
        b.metric = "sortmarket";
        b.sort = "asc"
    }
    return b
}

function sortMarketWatch(g, b) {
    var h = $(".overviewSection1");
    var a = $(".overviewSection");
    var f = $(".overviewChart");
    var e = b;
    if (e == "default") {
        g = "sortmarket";
        e = "asc"
    }
    a.sort(function(k, j) {
        var l = k.getAttribute("data-" + g),
            m = j.getAttribute("data-" + g);
        if (g != "sortmarket") {
            l = parseFloat(l);
            m = parseFloat(m)
        }
        if (e == "asc") {
            if (l > m) {
                return 1
            }
            if (l < m) {
                return -1
            }
        } else {
            if (e == "desc") {
                if (l > m) {
                    return -1
                }
                if (l < m) {
                    return 1
                }
            }
        }
        return 0
    });
    var d = [];
    for (i = 0; i < a.length; ++i) {
        var c = a[i].id.replace("watch_", "xchart_");
        d.push(a[i]);
        for (x = 0; x < f.length; ++x) {
            if (f[x].id == c) {
                d.push(f[x])
            }
        }
    }
    $("#marketWatch").append(d)
}

function getMarketWatch(c) {
    var a = "";
    var b = {
        time_period: c,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "JSON",
        data: b,
        url: base_url + "getjson/get_current_user_overview",
        async: false,
        success: function(d) {
            initialData = d;
            $.each(d, function(w, C) {
                var j = "watch_" + C.exch_code + "_" + C.mkt_name.replace("/", "_");
                var q = "chart_" + C.exch_code + "_" + C.mkt_name.replace("/", "_");
                var t;
                var o;
                var l = "#FFFFFF";
                var m = [];
                for (var w = 0, y = C.ChartData.length; w < y; w++) {
                    m.push(C.ChartData[w].close)
                }
                var f = removeZeroes(parseFloat(C.last_price).toFixed(8));
                var k = removeZeroes(parseFloat(C.open_price).toFixed(8));
                var p = Math.min.apply(Math, m);
                var g = Math.max.apply(Math, m);
                var h = parseFloat(C.volume_current);
                var n = parseFloat(C.volume_long) - parseFloat(C.volume_current);
                var B = removeZeroes(f - k);
                var e = (((f - k) / k) * 100).toFixed(2);
                var H = (((h - n) / n) * 100).toFixed(2);
                if (B > 0) {
                    t = "+";
                    l = "#78FF8A"
                } else {
                    t = "";
                    l = "#F85760"
                }
                if (e > 0) {
                    o = "+"
                } else {
                    o = ""
                }
                var E = 18;
                var s = ("" + f).length;
                if (s > 6) {
                    E = 16
                }
                var u = 16;
                var G = ("" + h).length;
                if (G > 5) {
                    u = 14
                }
                if (G > 10) {
                    u = 12
                }
                var A = 20;
                if (C.mkt_name.length > 7) {
                    A = 18
                }
                var D = 10;
                if (p < 1) {
                    D = 8;
                    p = parseFloat(p).toFixed(8);
                    g = parseFloat(g).toFixed(8)
                }
                var v = (((f - p) / (g - p)) * 100).toFixed(2);
                if (H > 0) {
                    volume_change_percent_symbol = "+";
                    volume_change_color = "#78FF8A"
                } else {
                    volume_change_percent_symbol = "";
                    volume_change_color = "#F85760"
                }
                if (h > 1) {
                    h = h.toFixed(3)
                } else {
                    h = h.toFixed(8)
                }
                if (C.last_price < 1) {
                    C.last_price = parseFloat(C.last_price).toFixed(8)
                }
                if (isNaN(H)) {
                    H = 0
                }
                if (isNaN(e)) {
                    e = 0
                }
                if (isNaN(v)) {
                    v = 0
                }
                var F = '<!-- row --><div id="' + j + '" class="head-panel nm overviewSection" style="padding-top:10px;border-bottom:1px solid rgba(255,255,255,0.1);height:50px;overflow:hidden;" data-sortmarket="' + C.display_name + '" data-sortprice="' + C.last_price + '" data-sortpricechange="' + e + '" data-sortpricerange="' + v + '" data-sortvolume="' + h + '" data-sortvolumechange="' + volume_change_percent_symbol + H + '"><div class="hp-info" style=""><div class="tiny_close_button" data-exchid="' + C.exch_id + '" data-mktid="' + C.mkt_id + '" style="display:none;position:absolute;top:0px;right:0px;margin-top:-2px;margin-right:10px;z-index:9999;"><img class="tiny_close_button_img" src="' + base_url + 'assets/img/icons/tiny_close_button.png" title="Remove from Favorites"></div><div class="overviewSection1" style="float:left;"><div style="width:150px;float:left;"><div style="width:50px;text-align:right;float:left;padding-right:0px;padding-top:2px;"><span style="font-size:16px;color:rgba(255,255,255,0.6);">' + C.exch_code + '</span></div><div style="width:100px;text-align:left;float:left;padding-left:0px;"><span style="font-size:' + A + 'px;font-weight:bold;margin-left:5px;">' + C.display_name + '</span></div></div><div style="width:130px;float:left;text-align:right;padding-right:5px;"><span class="item_last_price" style="font-size:' + E + 'px;font-weight:bold;" data-openprice="' + k + '">' + C.last_price + '</span><span class="price_arrow icon-arrow-up" style="opacity:0;color:#78FF8A;font-size:15px;margin-left:5px;"></span></div><div class="swappable" style="width:110px;float:left;"><div style="width:25px;float:left;"><input class="knobby" type="text" data-fgColor="#CCCCCC" data-min="0" data-max="100" data-width="25" data-height="25"  data-readOnly="true" /></div><div style="width:60px;height:25px;float:left;margin-left:5px;line-height:13px;"><span class="priceChangeAmount" style="color:' + l + ';">' + t + B + '</span><br/><span class="priceChangePercentage" style="color:' + l + ';">' + o + e + '%</span></div></div><div class="swappable" style="width:90px;float:left;padding:0px;"><div class="priceRange" style="height:20px;width:80px;margin-left:auto;margin-right:auto;background-color:rgba(0,0,0,0.2);margin-bottom:0px;padding:0px;"></div><div style="float:left;text-align:left;font-size:' + D + 'px;margin-top:-5px;" class="lowPriceRange">' + removeZeroes(p) + '</div><div style="float:right;text-align:right;font-size:' + D + 'px;margin-top:-5px;" class="highPriceRange">' + removeZeroes(g) + '</div></div></div><div class="overview_volume swappable" style="text-align:right;"><span class="item_last_volume" style="font-size:' + u + 'px;font-weight:bold;">' + h + '</span></div><div class="overview_volume_change swappable" style=""><div class="volChange" style="height:20px;width:60px;margin-left:auto;margin-right:auto;background-color:rgba(0,0,0,0.2);"></div><div class="volumeChangePercent" style="float:left;text-align:left;font-size:10px;margin-top:-7px;color:' + volume_change_color + ';">' + volume_change_percent_symbol + parseFloat(H) + '%</div><div style="float:right;text-align:right;font-size:8px;"></div></div><div class="overview_sparkchart" style=""><div class="priceLine" style="float:left;"></div><div class="careticon icon-caret-up" style="float:left;font-size:20px;margin-left:15px;margin-top:5px;"></div></div></div></div><!-- row --><!-- chart --><div id="x' + q + '" class="block block-drop-shadow overviewChart" style="display:none;"><div class="head bg-default bg-light-rtl"><div class="head-panel nm"><h2>' + C.exch_name + " - " + C.mkt_name + '</h2><a class="btn btn-default btn-clean" style="float:right;font-weight:bold;" href="' + base_url + "main/markets/" + C.exch_code + "/" + C.mkt_name + '" target="_blank"><span class="icon-bar-chart"></span> Launch</a><span style="margin-left:6px;font-size:10px;"></span><div id="' + q + '" class="chartDiv" style="clear:both;margin-left:auto;margin-right:auto;height: 150px; width: 100%; padding: 0px;"></div></div></div></div><!-- chart -->';
                $("#" + j).remove();
                $("#" + q).closest(".overviewChart").remove();
                $("#marketWatch").append(F);
                createTools(j, l, e, p, f, g, volume_change_color, H, m)
            });
            $("#marketWatch").slideDown("slow")
        },
        error: function(d, f, e) {
            console.log("error2")
        }
    })
}

function overviewSection(a) {
    this.updatePrice = function(d, e) {
        var c = parseFloat($("#" + a).find(".item_last_price").html());
        $("#" + a).find(".item_last_price").html(d);
        if (d > c) {
            $("#" + a).find(".item_last_price").effect("highlight", {
                color: "#78FF8A"
            });
            $("#" + a).find(".price_arrow").css("color", "#78FF8A");
            $("#" + a).find(".price_arrow").css("opacity", "1.0");
            $("#" + a).find(".price_arrow").removeClass("icon-arrow-down");
            $("#" + a).find(".price_arrow").addClass("icon-arrow-up");
            $("#" + a).find(".price_arrow").fadeTo(5000, 0);
            $("#" + a).attr("data-sortprice", d);
            if (isSorting === false) {
                var b = getSortMetric();
                if (b.metric == "sortprice") {
                    sortMarketWatch(b.metric, b.sort);
                    isSorting = true;
                    setTimeout(function() {
                        isSorting = false
                    }, 5000)
                }
            }
            return "priceUp"
        } else {
            if (d < c) {
                $("#" + a).find(".item_last_price").effect("highlight", {
                    color: "#F85760"
                });
                $("#" + a).find(".price_arrow").css("color", "#F85760");
                $("#" + a).find(".price_arrow").css("opacity", "1.0");
                $("#" + a).find(".price_arrow").removeClass("icon-arrow-up");
                $("#" + a).find(".price_arrow").addClass("icon-arrow-down");
                $("#" + a).find(".price_arrow").fadeTo(5000, 0);
                $("#" + a).attr("data-sortprice", d);
                if (isSorting === false) {
                    var b = getSortMetric();
                    if (b.metric == "sortprice") {
                        sortMarketWatch(b.metric, b.sort);
                        isSorting = true;
                        setTimeout(function() {
                            isSorting = false
                        }, 5000)
                    }
                }
                return "priceDown"
            } else {
                return "noChange"
            }
        }
    };
    this.updatePriceRange = function(e, h, j) {
        var f = e;
        var d = parseFloat($("#" + a).find(".lowPriceRange").html());
        var k = parseFloat($("#" + a).find(".highPriceRange").html());
        if (e < d) {
            d = e
        }
        if (e > k) {
            k = e
        }
        var m = d;
        var g = k;
        if (d < 1) {
            m = parseFloat(m).toFixed(8);
            g = parseFloat(g).toFixed(8)
        }
        $("#" + a).find(".lowPriceRange").html(m);
        $("#" + a).find(".highPriceRange").html(g);
        if (d < 1) {
            d = d * 100000000;
            k = k * 100000000;
            f = f * 100000000
        }
        var l = "#FFFFFF";
        if (h == "priceUp") {
            l = "#78FF8A"
        } else {
            if (h == "priceDown") {
                l = "#F85760"
            }
        }
        $("#" + a).find(".priceRange").sparkline([d, f, k], {
            type: "box",
            width: "80px",
            height: "20px",
            minValue: d,
            maxValue: k,
            boxFillColor: "rgba(0,0,0,0)",
            whiskerColor: "rgba(0,0,0,0)",
            boxLineColor: "rgba(0,0,0,0)",
            medianColor: l
        });
        var b = (((f - d) / (k - d)) * 100).toFixed(2);
        if (isNaN(b)) {
            b = 0
        }
        $("#" + a).attr("data-sortpricerange", b);
        if (isSorting === false) {
            var c = getSortMetric();
            if (c.metric == "sortpricerange") {
                sortMarketWatch(c.metric, c.sort);
                isSorting = true;
                setTimeout(function() {
                    isSorting = false
                }, 5000)
            }
        }
    };
    this.updatePricePercentage = function(e, h) {
        var d = e;
        var l;
        var f;
        var g = "#FFFFFF";
        var j = $("#" + a).find(".item_last_price").data("openprice");
        var b = removeZeroes(d - j);
        var k = (((d - j) / j) * 100).toFixed(2);
        if (b > 0) {
            l = "+";
            g = "#78FF8A"
        } else {
            l = "";
            g = "#F85760"
        }
        if (k > 0) {
            f = "+"
        } else {
            f = ""
        }
        $("#" + a).find(".priceChangeAmount").css("color", g);
        $("#" + a).find(".priceChangeAmount").html(l + b);
        $("#" + a).find(".priceChangePercentage").css("color", g);
        $("#" + a).find(".priceChangePercentage").html(f + k + "%");
        $("#" + a).find(".knobby").trigger("configure", {
            fgColor: g
        });
        $("#" + a).find(".knobby").val(Math.abs(Math.ceil(k))).trigger("change");
        if (isNaN(k)) {
            k = 0
        }
        $("#" + a).attr("data-sortpricechange", k);
        if (isSorting === false) {
            var c = getSortMetric();
            if (c.metric == "sortpricechange") {
                sortMarketWatch(c.metric, c.sort);
                isSorting = true;
                setTimeout(function() {
                    isSorting = false
                }, 5000)
            }
        }
    };
    this.updateVolume = function(c) {
        var d = parseFloat($("#" + a).find(".item_last_volume").html());
        $("#" + a).find(".item_last_volume").html(c);
        if (c > d) {
            $("#" + a).find(".item_last_volume").effect("highlight", {
                color: "#78FF8A"
            })
        } else {
            if (c < d) {
                $("#" + a).find(".item_last_volume").effect("highlight", {
                    color: "#F85760"
                })
            }
        }
        $("#" + a).attr("data-sortvolume", c);
        if (isSorting === false) {
            var b = getSortMetric();
            if (b.metric == "sortvolume") {
                sortMarketWatch(b.metric, b.sort);
                isSorting = true;
                setTimeout(function() {
                    isSorting = false
                }, 5000)
            }
        }
    };
    this.updateVolumePercentage = function(d) {
        volume_change_percent = d;
        if (volume_change_percent > 0) {
            volume_change_percent_symbol = "+";
            volume_change_color = "#78FF8A"
        } else {
            volume_change_percent_symbol = "";
            volume_change_color = "#F85760"
        }
        if (isNaN(volume_change_percent)) {
            volume_change_percent = 0
        }
        var b = Math.abs(Math.ceil(d));
        $("#" + a).find(".volChange").sparkline([50, b, 100], {
            type: "bullet",
            width: "60px",
            height: "20px",
            targetColor: "rgba(0,0,0,0.1)",
            performanceColor: volume_change_color,
            rangeColors: ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]
        });
        $("#" + a).find(".volumeChangePercent").css("color", volume_change_color);
        $("#" + a).find(".volumeChangePercent").html(volume_change_percent_symbol + "" + parseFloat(volume_change_percent).toFixed(2) + "%");
        if (isNaN(volume_change_percent)) {
            volume_change_percent = 0
        }
        $("#" + a).attr("data-sortvolumechange", volume_change_percent);
        if (isSorting === false) {
            var c = getSortMetric();
            if (c.metric == "sortvolumechange") {
                sortMarketWatch(c.metric, c.sort);
                isSorting = true;
                setTimeout(function() {
                    isSorting = false
                }, 5000)
            }
        }
    }
}

function updateOverview(m) {
    var j = "watch_" + m.exch_code + "_" + m.mkt_name.replace("/", "_");
    var k = document.getElementById(j);
    if (k != null) {
        var l = new overviewSection(j);
        if (typeof m.last_price !== "undefined") {
            var f = removeZeroes(parseFloat(m.last_price).toFixed(8));
            if (f < 1) {
                f = parseFloat(f).toFixed(8)
            }
            var h = l.updatePrice(f);
            l.updatePriceRange(f, h);
            l.updatePricePercentage(f)
        }
        var d = "24H";
        switch (overview_time_period) {
            case 0:
                d = "24H";
                break;
            case 7:
                d = "7D";
                break;
            case 30:
                d = "30D";
                break;
            default:
        }
        var g = "volume_current";
        var a = "volume_long";
        if (typeof m[g] !== "undefined" && m.data_type == d) {
            var b = removeZeroes(parseFloat(m[g]).toFixed(8));
            var e = removeZeroes(parseFloat(m[a]).toFixed(8));
            if (b > 1) {
                b = parseFloat(b).toFixed(3)
            } else {
                b = parseFloat(b).toFixed(8)
            }
            l.updateVolume(b);
            volume_previous = e - b;
            var c = (((b - volume_previous) / volume_previous) * 100).toFixed(2);
            l.updateVolumePercentage(c)
        }
    }
}

function loadMarketWatchSearch() {
    $.ajax({
        type: "GET",
        url: base_url + "getjson/getmarkets/",
        dataType: "json",
        success: function(d) {
            markets_obj = d;
            var b = [];
            for (var e = 0; e < markets_obj.length; e++) {
                var h = markets_obj[e].mkt_id;
                var g = markets_obj[e].exch_code;
                var f = markets_obj[e].exch_name;
                var j = markets_obj[e].display_name;
                var k = markets_obj[e].mkt_name;
                var a = markets_obj[e].primary_curr_name;
                var c = markets_obj[e].secondary_curr_name;
                b.push(g + ":" + j)
            }
            $("#marketWatchSearch").autocomplete({
                source: b
            })
        }
    })
}

function addFavoriteMarketWatch() {
    var d = $("#marketWatchSearch").val();
    var e = d.match(/^([^:]*)[:]([^\/:]*)\/([^\/]*)/i);
    if (e === null) {
        notify_error("Incorrect Format<br/>Must be in the format 'EXCHANGE:QUOTE/BASE'.")
    } else {
        $("#marketWatchSearch").val("");
        $("#addFavoriteMarketWatch").effect("highlight", "slow");
        var a = markets_obj.filter(function(f) {
            return f.exch_code == e[1]
        });
        var c = a.filter(function(f) {
            return f.display_name == e[2] + "/" + e[3]
        });
        if (c !== null) {
            var b = {
                exch_id: c[0].exch_id,
                mkt_id: c[0].mkt_id,
                csrf_coinigy: $("#csrf_coinigy").val()
            };
            $.ajax({
                type: "post",
                datatype: "html",
                url: base_url + "post/insertfavorite",
                data: b,
                success: function(f) {
                    getMarketWatch(overview_time_period)
                },
                error: function(g, f, h) {
                    notify_error("error", "we were unable to add this market to your favorites.")
                }
            })
        }
    }
}

function deleteFavoriteMarketWatch(a, b) {
    var c = {
        exch_id: a,
        mkt_id: b,
        csrf_coinigy: $("#csrf_coinigy").val()
    };
    jQuery.ajax({
        type: "POST",
        dataType: "HTML",
        url: base_url + "post/deleteFavorite",
        data: c,
        success: function(d) {},
        error: function(d, f, e) {
            notify_error("Error", "We were unable to delete this market from your Favorites.")
        }
    })
};
