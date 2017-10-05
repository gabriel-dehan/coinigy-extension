﻿(function (e) {
    function x(a, f) { var b, c, d; d = f ? f : 1; b = Number.POSITIVE_INFINITY; c = Number.NEGATIVE_INFINITY; for (var h = 0; h < a.length; h++) b = Math.min(b, a[h][d]), c = Math.max(c, a[h][d]); return { min: b, max: c, diff: c - b } } function u(a, f, b) { e("#FLOTtooltip").remove(); e('<div id="FLOTtooltip">' + b + "</div>").css({ position: "absolute", display: "none", top: f + 5, left: a + 5, border: "1px solid #fdd", padding: "2px", "background-color": "#fee", opacity: 0.8 }).appendTo("body").fadeIn(200) } function r(a, f, b) {
        function c(d, c) { return d[1] - c[1] } function d(d,
        c) { return c[1] - d[1] } for (var h = [], g = 0; g < a.length; g++) h.push(a[g]); b ? h.sort(b) : "a" === f ? h.sort(c) : h.sort(d); return h
    } function t(a) { for (var f = [], b = 0; b < a.length; b++) a[b][2] ? f.push([a[b][0], a[b][2]]) : f.push(a[b][0], a[b][0]); return f } function p(a) { var f, b, c = []; f = x(a); for (var d = 0; d < a.length; d++) b = 100 * ((a[d][1] - f.min) / f.diff), c.push([a[d][0], b]); return c } function q(a) {
        function f(b) {
            var c; if ("object" === typeof b) if ("undefined" !== typeof b.image) c = a.ctx.createPattern(b.image, b.repeat); else {
                c = a.radius ? a.ctx.createRadialGradient(a.left,
                a.top, 0, a.left, a.top, a.radius) : a.ctx.createLinearGradient(0, 0, a.width, a.height); for (var d = 0; d < b.colors.length; d++) { var h = b.colors[d]; "string" !== typeof h && (h = e.color.parse(a.defaultColor), null !== b.brightness && h.scale("rgb", b.brightness), null !== b.opacity && (h *= b.opacity), h = h.toString()); c.addColorStop(d / (b.colors.length - 1), h) }
            } else c = "string" === typeof b ? b : a.colors[b]; return c
        } return "object" === typeof a ? "undefined" !== typeof a.dataIndex ? "undefined" !== typeof a.serie.data[a.dataIndex].color ? f(a.serie.data[a.dataIndex].color) :
        a.colors[a.dataIndex] : "undefined" !== typeof a.serieIndex ? "undefined" !== typeof a.serie.color ? f(a.serie.color) : a.colors[a.serieIndex] : "undefined" !== typeof a.color ? f(a.color) : "darkgreen" : f(a)
    } function m(a, f) { for (var b in f) a[b] ? "object" === typeof f[b] && m(a[b], f[b]) : a[b] = f[b] } function k(a, f, b, c, d) { var h; a = b.xaxis.p2c(b.x); b = b.yaxis.p2c(b.y); h = c.xaxis.p2c(c.x); c = c.yaxis.p2c(c.y); f.beginPath(); f.strokeStyle = d.strokeStyle; f.lineWidth = d.lineWidth; f.moveTo(a, b); f.lineTo(h, c); f.stroke() } e.plot.JUMlib = {}; e.plot.JUMlib.library =
    {}; e.plot.JUMlib.library.between = function (a, f, b) { return b > f ? a >= f && a <= b : a >= b && a <= f }; e.plot.JUMlib.library.getMinMax = x; e.plot.JUMlib.library.showHover = function (a, f, b, c, d) { if (b) { a = b.series.data[b.dataIndex]; if (d) d = d(a); else if (d = "X:" + a[0] + "<br>Y:" + a[1], 2 < a.length) for (b = 2; b < a.length; b++) d += "<br>" + a[b]; u(f.pageX, f.pageY, d) } else !0 === c ? (d = f.x1 + " / " + f.y1, u(f.pageX, f.pageY, d)) : e("#FLOTtooltip").remove() }; e.plot.JUMlib.library.showTooltip = u; e.plot.JUMlib.library.loadScripts = function (a, f, b) {
        function c(c, b) {
            var a =
            e.Deferred(), h; h = setInterval(function () { clearInterval(h); a.reject() }, f); e.getScript(c).done(function () { d[b] = !0; a.resolve() }).fail(function (h, g, y) { console.log(c, h); d[b] = !1; a.reject() }); return a.promise()
        } for (var d = {}, h = [], g = 0; g < a.length; g++) h.push(c(a[g].path, a[g].name)); e.when.apply(null, h).then(function () { b(d) })
    }; e.plot.JUMlib.library.loadJSON = function (a, f, b) {
        function c(c, a) {
            var b = e.Deferred(), h; h = setInterval(function () { clearInterval(h); b.reject() }, f); e.getJSON(c, function (c) {
                d[a] = {
                    data: c, name: a,
                    loaded: !0
                }
            }).done(function () { b.resolve() }).fail(function (c, h, g) { d[a] = { name: a, loaded: !1 }; b.reject() }); return b.promise()
        } for (var d = {}, h = [], g = 0; g < a.length; g++) h.push(c(a[g].path, a[g].name)); e.when.apply(null, h).then(function () { b(d) })
    }; e.plot.JUMlib.prepareData = {}; e.plot.JUMlib.prepareData.createQuartile = function (a, f, b) {
        var c = [], d = [], h = [], g = [], n = [], l = [], s, y, k, w, z; s = (0.25 * a.length).toFixed(0); y = (0.5 * a.length).toFixed(0); k = (0.75 * a.length).toFixed(0); w = a.length - 1; for (var v = 0; v < a[0].length; v++) {
            z = []; for (var B =
            0; B < a.length; B++) z.push(a[B][v]); z.sort(function (c, d) { return c - d }); d.push([v, z[s]]); h.push([v, z[y]]); g.push([v, z[k]]); n.push([v, z[w]]); c.push([v, z[0]]); l.push([v, a[f][v]])
        } return [{ data: n }, { data: g }, { data: h }, { data: d }, { data: c, color: "#ffffff" }, { label: b, points: { show: !0 }, lines: { fill: null, steps: !1 }, data: l }]
    }; e.plot.JUMlib.prepareData.createPercentile = function (a, f, b, c) {
        var d = [], h = [], g = [], n, l; if (c.length) for (g.push([0]), d.push([]), n = 0; n < c.length; n++) g.push(parseInt(a.length * c[n], 0)), d.push([]); else for (n =
        0; n < c; n++) g.push(parseInt(a.length / c * n, 0)), d.push([]); g.push(a.length - 1); d.push([]); for (n = 0; n < a[0].length; n++) { c = []; for (l = 0; l < a.length; l++) c.push(a[l][n]); c.sort(function (c, d) { return c - d }); for (l = 0; l < d.length; l++) d[l].push([n, c[g[l]]]); h.push([n, a[f][n]]) } a = []; for (n = d.length - 1; 0 < n; n--) a.push({ data: d[n] }); a.push({ data: d[0], color: "#ffffff" }); a.push({ label: b, points: { show: !0 }, lines: { fill: null, steps: !1 }, data: h }); return a
    }; e.plot.JUMlib.prepareData.createSimiliarity = function (a, f, b) {
        var c = []; a = p(a); f = p(f);
        for (var d, h = 0; h < a.length; h++) { switch (b) { case "diff": d = a[h][1] - f[h][1]; break; case "abs": d = Math.abs(a[h][1] - f[h][1]); break; default: d = 0 } c.push([a[h][0], d]) } return c
    }; e.plot.JUMlib.prepareData.createWaterfall = function (a, f) {
        var b = [], c = [], d = [], h = [], g = 0, n = Number.POSITIVE_INFINITY, l; for (l = 0; l < a.length; l++) a[l][2] ? "undefined" === typeof a[l][1] ? b.push([l, g]) : (b.push([l, a[l][1]]), g = a[l][1]) : 0 < a[l][1] ? (h.push([l, -a[l][1]]), g += a[l][1], c.push([l, g]), d.push([l, 0])) : (d.push([l, -a[l][1]]), g += a[l][1], c.push([l, g])),
        n = Math.min(n, g); g = []; for (l = 0; l < a.length; l++) g.push([l, a[l][0]]); return { data: [{ data: b, color: f.fixed }, { data: c, bars: { show: !1 }, lines: { show: !1 } }, { data: d, color: f.negative }, { data: h, color: f.positive }], ticks: g, yaxismin: n }
    }; e.plot.JUMlib.prepareData.avg = function (a, f) { for (var b = [], c = [], d, h, g = 0; g < a.length; g++) { d = g < f ? 0 : g - f + 1; c = []; c.push(a[g][0]); for (var n = 1; n < a[g].length; n++) { h = 0; for (var l = d; l <= g; l++) h += a[l][n]; c.push(h / (g - d + 1)) } b.push(c) } return b }; e.plot.JUMlib.prepareData.max = function (a, f) {
        for (var b = [], c = [],
        d, h, g = 0; g < a.length; g++) { d = g < f ? 0 : g - f + 1; c = []; c.push(a[g][0]); for (var n = 1; n < a[g].length; n++) { h = -Number.MAX_VALUE; for (var l = d; l <= g; l++) a[l][n] > h && (h = a[l][n]); c.push(h) } b.push(c) } return b
    }; e.plot.JUMlib.prepareData.min = function (a, f) { for (var b = [], c = [], d, h, g = 0; g < a.length; g++) { d = g < f ? 0 : g - f + 1; c = []; c.push(a[g][0]); for (var n = 1; n < a[g].length; n++) { h = Number.MAX_VALUE; for (var l = d; l <= g; l++) a[l][n] < h && (h = a[l][n]); c.push(h) } b.push(c) } return b }; e.plot.JUMlib.prepareData.sort = r; e.plot.JUMlib.prepareData.sortTicks = function (a,
    f, b) { a = r(a, f, b); for (f = 0; f < a.length; f++) a[f][0] = f; return { data: a, ticks: t(a) } }; e.plot.JUMlib.prepareData.pareto = function (a, f, b, c, d) { var h = [], g = "Others", n = !0, l = [], h = r(a, "d"); 0 < f.length && (g = f); n = b; if (c) { for (a = 0; a < c; a++) l.push(h[a]); d = 0; for (a = c; a < h.length; a++) d += h[a][1]; n && l.push([c, d, g]); h = l } else if (d) { b = f = c = 0; var s; for (a = 0; a < h.length; a++) c += h[a][1]; c = c * d / 100; for (a = 0; a < h.length; a++) f < c ? (l.push(h[a]), f += h[a][1], s = a) : b += h[a][1]; s++; n && l.push([s, b, g]); h = l } for (a = 0; a < h.length; a++) h[a][0] = a; return { data: h, ticks: t(h) } };
    e.plot.JUMlib.prepareData.normalize = p; e.plot.JUMlib.prepareData.combineData = function (a, f) { for (var b = [], c = 0; c < a.length; c++) { for (var d = [], h = 0; h < a[c].length; h++) d.push([f[h], a[c][h]]); b.push(d) } return b }; e.plot.JUMlib.data = {}; e.plot.JUMlib.data.createFont = function (a) { return { style: a.css("font-style"), size: Math.round(0.8 * (+a.css("font-size").replace("px", "") || 13)), variant: a.css("font-variant"), weight: a.css("font-weight"), family: a.css("font-family") } }; e.plot.JUMlib.data.createColors = function (a, f) {
        for (var b,
        c = [], d = a.colors, h = d.length, g = 0, n = 0; n < h; n++) c[n] = d[n]; if (h < f) for (n = h; n < f; n++) b = e.color.parse(d[n % h] || "#666"), 0 === n % h && n && (g = 0 <= g ? 0.5 > g ? -g - 0.2 : 0 : -g), c[n] = b.scale("rgb", 1 + g).toString(); return c
    }; e.plot.JUMlib.data.getColor = q; e.plot.JUMlib.data.loadImages = function (a, f, b) {
        function c(c) {
            var a = e.Deferred(), b, h; h = c.path + c.name + "." + c.type; b = setInterval(function () { clearInterval(b); a.reject() }, f); e("<img />").attr("src", h).load(function () { d[c.name] = this; a.resolve() }).error(function (b, g, s) {
                console.log(h, b); d[c.name] =
                null; a.reject()
            }); return a.promise()
        } for (var d = {}, h = [], g = 0; g < a.length; g++) h.push(c(a[g])); e.when.apply(null, h).then(function () { b(d) })
    }; e.plot.JUMlib.data.getCanvases = function (a) { return { background: e(a).children(".flot-background"), base: e(a).children(".flot-base"), overlay: e(a).children(".flot-overlay") } }; e.plot.JUMlib.data.extendEmpty = m; e.plot.JUMlib.drawing = {}; e.plot.JUMlib.drawing.drawLine = k; e.plot.JUMlib.drawing.drawRect = function (a, f, b, c, d, h) {
        function g(c, d, a, b) {
            c = b.image; "undefined" !== typeof c &&
            d.drawImage(c, a.x, a.y, a.width(), a.height())
        } function n(c, d, a, b) { color = q({ ctx: d, color: b.color, left: a.x, top: a.y, height: a.height, width: a.width }); d.fillStyle = color; d.fillRect(a.x, a.y, a.width, a.height) } b = { x: b.p2c(d.x), y: c.p2c(d.y), width: b.p2c(d.x + d.width) - b.p2c(d.x), height: c.p2c(d.y + d.height) - c.p2c(d.y) }; switch (h.mode) { case "image": g(a, f, b, h); break; case "color": n(a, f, b, h); break; case "userdefined": h.boxDraw(a, f, b, h); break; default: n(a, f, b, h) }
    }; e.plot.JUMlib.drawing.drawLines = function (a, f) {
        var b, c, d; b = a.getPlotOffset();
        c = a.getData(); d = a.getCanvas().getContext("2d"); d.translate(b.left, b.top); for (b = 0; b < f.length; b++) {
            var h = c[f[b].from.seriesIndex], g = c[f[b].to.seriesIndex], n = f[b].from, l = f[b].to; n.dataFieldX || (n.dataFieldX = 0); n.dataFieldY || (n.dataFieldY = 1); l.dataFieldX || (l.dataFieldX = 0); l.dataFieldY || (l.dataFieldY = 1); k(a, d, { xaxis: h.xaxis, yaxis: h.yaxis, x: h.data[n.dataIndex][n.dataFieldX], y: h.data[n.dataIndex][n.dataFieldY] }, { xaxis: g.xaxis, yaxis: g.yaxis, x: g.data[l.dataIndex][l.dataFieldX], y: g.data[l.dataIndex][l.dataFieldY] },
            { strokeStyle: "red", lineWidth: 5 })
        }
    }; e.plot.plugins.push({ init: function () { }, options: {}, name: "JUMlib", version: "0.5" })
})(jQuery); (function (e) {
    e.plot.plugins.push({
        init: function (e) {
            function r(c) { c = m(c); if (c[1]) { var d = c[1].series; !1 !== d.points.show || d.lines.show && !1 !== d.lines.show || !1 !== d.bars.show || b.trigger("plotclick", c) } } function t(c) {
                if (k.grid.editable) {
                    c = m(c); if (c[1]) {
                        var d = null; if (c[1].series.editable) { d = c[1].dataIndex.length ? c[1].series.data[c[1].dataIndex[0]] : c[1].series.data[c[1].dataIndex]; switch (c[1].series.editMode) { case "x": c[0].y = d[1]; c[0].y1 = d[1]; break; case "y": c[0].x = d[0], c[0].x1 = d[0] } k.series.justEditing = c } b.trigger("plotdown",
                        c)
                    } b.css("cursor", "auto")
                }
            } function p(c) { if (k.series.justEditing && (b.trigger("plotup", k.series.justEditing), b.trigger("datadrop", k.series.justEditing), c = k.series.justEditing[1].series, !0 === c.autoEdit)) { var d = k.series.justEditing[0]; c.data[c.dataIndex] = [d.x1, d.y1] } k.series.justEditing = null; e.triggerRedrawOverlay() } function q(c) {
                var d; c = m(c); if (k.series.justEditing) switch (d = k.series.justEditing[1].seriesIndex, e.getData()[d].editMode) {
                    case "none": break; case "x": k.series.justEditing[0].x = c[0].x; k.series.justEditing[0].x1 =
                    c[0].x1; k.series.justEditing[0].pageX = c[0].pageX; break; case "y": k.series.justEditing[0].y = c[0].y; k.series.justEditing[0].y1 = c[0].y1; k.series.justEditing[0].pageY = c[0].pageY; break; case "v": c[1] && (k.series.justEditing[0] = c[0], k.series.justEditing[0].value = c[1].value); break; case "xy": k.series.justEditing[0] = c[0]; break; default: k.series.justEditing[0] = c[0]
                } else if (c[1]) {
                    k.series.justMoving = c; switch (c[1].series.editMode) {
                        case "x": b.css("cursor", "col-resize"); break; case "y": b.css("cursor", "row-resize");
                            break; default: b.css("cursor", "crosshair")
                    } d = c[1].series; !1 !== d.points.show || d.lines.show && !1 !== d.lines.show || !1 !== d.bars.show || b.trigger("plothover", c)
                } else b.css("cursor", "auto"), k.series.justMoving = null; e.triggerRedrawOverlay()
            } function m(c) {
                var d, b = null, g = a.offset(), n = c.pageX - g.left - f.left, l = c.pageY - g.top - f.top; d = e.c2p({ left: n, top: l }); d.pageX = c.pageX; d.pageY = c.pageY; c = null; for (var s, b = 0; b < e.getData().length; b++) { var y = e.getData()[b]; null !== y.nearBy.findItem && (c = y.nearBy.findItem(n, l, b, y)); if (c) break } c ?
                (b = c[0], n = c[1], l = e.getData()[b].datapoints.pointsize, 2 < c.length && (s = c[2]), b = { datapoint: e.getData()[b].datapoints.points.slice(n * l, (n + 1) * l), dataIndex: n, series: e.getData()[b], seriesIndex: b, value: s }) : b = null; b && (b.pageX = parseInt(b.series.xaxis.p2c(b.datapoint[0]) + g.left + e.getPlotOffset().left, 0), b.pageY = parseInt(b.series.yaxis.p2c(b.datapoint[1]) + g.top + e.getPlotOffset().top, 0)); return [d, b]
            } var k = null, a = null, f = null, b = null; e.hooks.bindEvents.push(function (c, d) {
                k = c.getOptions(); a = d; f = c.getPlotOffset(); b =
                c.getPlaceholder(); if (k.grid.editable || k.grid.clickable || k.grid.hoverable) a.mousedown(t), a.mouseup(p), a.mousemove(q), a.click(r)
            }); e.hooks.drawOverlay.push(function (c, d) {
                var b, a, n; d.save(); d.clearRect(0, 0, c.getPlaceholder().width, c.getPlaceholder().height); d.translate(c.getPlotOffset().left, c.getPlotOffset().top); k.series.justEditing ? (b = c.getData()[k.series.justEditing[1].seriesIndex], a = k.series.justEditing[0].x1, n = k.series.justEditing[0].y1, b.nearBy.drawEdit && b.nearBy.drawEdit(d, a, n, b)) : k.series.justMoving &&
                (b = c.getData()[k.series.justMoving[1].seriesIndex], b.nearBy.drawHover && b.nearBy.drawHover(d, b, k.series.justMoving[1].dataIndex)); d.restore()
            })
        }, options: {
            series: {
                editable: null, editMode: "xy", justEditing: null, justMoving: null, autoSet: !1, nearBy: {
                    distance: 6, findItem: function (e, r, t, p) {
                        var q = p.nearBy.distance, m = q * q + 1, k = null, a, f, b = p.xaxis, c = p.yaxis, d = p.datapoints.points, h = p.datapoints.pointsize, g = b.c2p(e), n = c.c2p(r), l = q / b.scale, s = q / c.scale; b.options.inverseTransform && (l = Number.MAX_VALUE); c.options.inverseTransform &&
                        (s = Number.MAX_VALUE); for (q = 0; q < d.length; q += h) if (a = d[q], f = d[q + 1], null !== a) switch (p.nearBy.findMode) {
                            case "circle": if (a - g > l || a - g < -l) continue; if (f - n > s || f - n < -s) continue; a = Math.abs(b.p2c(a) - e); f = Math.abs(c.p2c(f) - r); f = a * a + f * f; f < m && (m = f, k = [t, q / h]); break; case "vertical": x(e, b.p2c(a), b.p2c(a + p.nearBy.width)) && (f = Math.abs(c.p2c(f) - r), f < p.nearBy.distance && (k = [t, q / h])); break; case "horizontal": var y = 0 > c.datamin ? Math.max(0, c.datamin) : Math.min(0, c.datamin); x(r, c.p2c(f), c.p2c(y)) && (f = Math.abs(b.p2c(a) - e), f <= p.nearBy.distance &&
                            (k = [t, q / h]))
                        } return k
                    }, findMode: "circle", drawEdit: function (u, r, t, p) {
                        var q = p.xaxis, m = p.yaxis; if (!(r < q.min || r > q.max || t < m.min || t > m.max)) switch (p.nearBy.findMode) {
                            case "circle": var k = p.points.radius + p.points.lineWidth / 2; u.lineWidth = k; u.strokeStyle = e.color.parse(p.color).scale("a", 0.5).toString(); p = 1.5 * k; r = q.p2c(r); t = m.p2c(t); u.beginPath(); u.arc(r, t, p, 0, 2 * Math.PI, !1); u.fillStyle = "#ff8080"; u.fill(); u.lineWidth = 2; u.moveTo(r, t - p); u.lineTo(r, t + p); u.moveTo(r - p, t); u.lineTo(r + p, t); u.closePath(); u.stroke(); break;
                            case "vertical": u.lineWidth = 2; u.strokeStyle = e.color.parse(p.color).scale("a", 0.5).toString(); u.beginPath(); u.moveTo(q.p2c(r), m.p2c(t)); u.lineTo(q.p2c(r + p.nearBy.width), m.p2c(t)); u.closePath(); u.stroke(); break; case "horizontal": u.lineWidth = 4, u.strokeStyle = e.color.parse(p.color).scale("a", 0.5).toString(), u.beginPath(), u.moveTo(q.p2c(r), m.p2c(t)), t = 0 > m.datamin ? Math.max(0, m.datamin) : Math.min(0, m.datamin), u.lineTo(q.p2c(r), m.p2c(t)), u.closePath(), u.stroke()
                        }
                    }, drawHover: function (e, r, t) { }
                }
            }, grid: { editable: !1 }
        },
        name: "mouse", version: "0.2"
    }); var x = e.plot.JUMlib.library.between
})(jQuery); (function (e) {
    e.plot.plugins.push({
        init: function (x, u) {
            function r(b, c) {
                a = b.getOptions(); var d = a.grid.background.setZIndex; m = new q("flot-background", b.getPlaceholder()); !0 === e.isNumeric(d) ? (e(b.getPlaceholder().children(".flot-overlay")).css("z-index", d + 1), e(b.getCanvas()).css("z-index", d), e(m.element).css("z-index", d - 1)) : !0 === a.grid.background.setZIndex ? (e(b.getPlaceholder().children(".flot-overlay")).css("z-index", 2), e(b.getCanvas()).css("z-index", 1), e(m.element).css("z-index", 0)) : e(m.element).css("z-index",
                -1); k = m.context; f = b.getPlotOffset(); k.save(); k.translate(f.left, f.top); switch (a.grid.background.mode) { case "image": d = a.grid.background.image; "undefined" !== typeof d && k.drawImage(d, 0, 0, b.width(), b.height()); break; case "color": t(b, k); break; case "userdefined": a.grid.background.fncDraw(b, k, b.width(), b.height()); break; default: t(b, k) } k.restore()
            } function t(b, c) {
                var d = e.plot.JUMlib.data.getColor({ ctx: c, color: a.grid.background.color, left: 0, top: 0, height: b.height(), width: b.width() }); c.fillStyle = d; c.fillRect(0,
                0, b.width(), b.height())
            } function p(b, c) { var d = a.grid.overlay.image, h = '<div style="position:absolute;width:' + b.width() + ";height:" + b.height() + ";top:" + f.top + ";left:" + f.left + ';">', h = e(h); e(d).css("opacity", a.grid.overlay.opacity).width(b.width()).height(b.height()); e(d).css("top", f.top).css("position", "absolute").css("left", f.left); e(d).appendTo(h); h.appendTo(b.getPlaceholder()) } var q, m, k, a, f; q = u.Canvas; x.hooks.processOptions.push(function (b, c) {
                !0 === c.grid.background.active && (a = c, b.hooks.drawBackground.push(r),
                !0 === c.grid.overlay.active && b.hooks.draw.push(p))
            })
        }, options: { grid: { background: { active: !1, mode: "color", color: { colors: ["white", "yellow", "orange", "blue"] }, image: null, fncDraw: null, setZIndex: !1 }, overlay: { active: !1, image: null, opacity: 0.2 } } }, name: "background", version: "0.4"
    })
})(jQuery); (function (e) {
    var x = { series: { lines: { show: !1 } } }, u = { series: { editMode: "y", nearBy: { distance: 7, findItem: null, findMode: "circle", drawHover: null } } }, r = e.plot.JUMlib.library.between; e.plot.plugins.push({
        init: function (t) {
            function p(c, d, b, g) { !0 === d.bandwidth.show && (d.nearBy.findItem = k, d.nearBy.drawHover = a) } function q(c, d, b) {
                if (b.bandwidth.show) {
                    if ("string" === typeof b.bandwidth.lineWidth) b.bandwidth.barWidth = parseInt(b.bandwidth.lineWidth, 0), b.nearBy.width = b.bandwidth.barWidth; else {
                        var a = b.xaxis.p2c(b.xaxis.min +
                        b.bandwidth.lineWidth) - b.xaxis.p2c(b.xaxis.min); b.bandwidth.barWidth = a; b.nearBy.width = b.bandwidth.lineWidth
                    } f = c.getPlotOffset(); for (c = 0; c < b.data.length; c++) m(d, b, c, b.color)
                }
            } function m(c, d, b, a) { var n, l; l = b.length ? d.data[b[0]] : d.data[b]; b = f.left + d.xaxis.p2c(l[0]); n = f.top + d.yaxis.p2c(l[1]); l = f.top + d.yaxis.p2c(l[2]); d.bandwidth.drawBandwidth(c, d.bandwidth, b, n, l, a) } function k(c, d, a, g) {
                function n(c, d, a, l) { c = null; return c = [a, b.series.justEditing[1].dataIndex] } function l(c, b, d, a) {
                    var l = null; if (a.bandwidth.show) for (var g =
                    0; g < a.data.length; g++) { var h, n, s; s = a.data[g]; h = a.xaxis.p2c(s[0]) - a.bandwidth.barWidth / 2; n = a.yaxis.p2c(s[1]) - a.bandwidth.barWidth / 2; s = a.yaxis.p2c(s[2]) - a.bandwidth.barWidth / 2; r(c, h, h + a.bandwidth.barWidth) && (r(b, n, s) && (l = [d, g], a.editMode = "x", a.nearBy.findMode = "horizontal"), r(b, n, n + a.bandwidth.barWidth) && (l = [d, [g, 1]], a.editMode = "y", a.nearBy.findMode = "vertical"), r(b, s, s + a.bandwidth.barWidth) && (l = [d, [g, 2]], a.editMode = "y", a.nearBy.findMode = "vertical")) } return l
                } function s(c, b, d, a) {
                    var g = null; if (a.bandwidth.show) for (var l =
                    0; l < a.data.length; l++) { var h, n, s; s = a.data[l]; h = a.xaxis.p2c(s[0]) - a.bandwidth.barWidth / 2; n = a.yaxis.p2c(s[1]); s = a.yaxis.p2c(s[2]); r(c, h, h + a.bandwidth.barWidth) && r(b, n, s) && (g = [d, l]) } return g
                } var f = null; b.series.justEditing ? b.series.justEditing[1].seriesIndex === a && (f = n(c, d, a, g)) : f = b.grid.editable ? l(c, d, a, g) : s(c, d, a, g); return f
            } function a(c, b, a) { c.save(); c.translate(-f.left, -f.top); m(c, b, a, "rgba(255,255,255," + b.bandwidth.highlight.opacity + ")"); c.restore() } var f = null, b = null; t.hooks.processOptions.push(function (c,
            a) { a.series.bandwidth.active && (e.extend(!0, a, x), e.plot.JUMlib.data.extendEmpty(a, u), b = a, c.hooks.processRawData.push(p), c.hooks.drawSeries.push(q)) })
        }, options: { series: { bandwidth: { active: !1, show: !1, fill: !0, lineWidth: "4px", highlight: { opacity: 0.5 }, drawBandwidth: function (e, p, q, m, k, a) { e.beginPath(); e.strokeStyle = a; e.lineWidth = p.barWidth; e.lineCap = "round"; e.moveTo(q, m); e.lineTo(q, k); e.stroke() } } } }, name: "bandwidth", version: "0.5"
    })
})(jQuery); (function (e) {
    var x = { series: { editMode: "xy", nearBy: { distance: 6, findMode: "circle" } } }; e.plot.plugins.push({
        init: function (u) {
            function r(e, p, k, a) { } function t(e, m, k) { if (k.bubbles.show) for (p = e.getPlotOffset(), e = 0; e < k.data.length; e++) { var a = m, f = k, b = k.data[e], c = k.color, d = void 0, h = void 0, g = void 0, n = void 0, d = p.left + f.xaxis.p2c(b[0]), h = p.top + f.yaxis.p2c(b[1]), n = b[2], g = parseInt(f.yaxis.scale * b[2] / 2, 0); f.bubbles.drawbubble(a, f, d, h, n, g, c, void 0) } } var p = null; u.hooks.processOptions.push(function (p, m) {
                m.series.bubbles.active &&
                (e.plot.JUMlib.data.extendEmpty(m, x), p.hooks.processRawData.push(r), p.hooks.drawSeries.push(t))
            })
        }, options: {
            series: {
                bubbles: {
                    active: !1, show: !1, fill: !0, lineWidth: 2, highlight: { opacity: 0.5 }, drawbubble: function (e, r, t, p, q, m, k, a) { e.fillStyle = k; e.strokeStyle = k; e.lineWidth = r.bubbles.lineWidth; e.beginPath(); e.arc(t, p, m, 0, 2 * Math.PI, !0); e.closePath(); r.bubbles.fill ? e.fill() : e.stroke(); r.bubbles.bubblelabel.show && (e.fillStyle = r.bubbles.bubblelabel.fillStyle, r = e.measureText(q), e.fillText(q, t - r.width / 2, p + 4)) },
                    bubblelabel: { show: !1, fillStyle: "black" }
                }
            }
        }, name: "bubbles", version: "0.3"
    })
})(jQuery); (function (e) {
    var x = { series: { lines: { show: !1 } }, legend: { show: !1 } }, u = e.plot.JUMlib.library.between; e.plot.candlestick = {}; e.plot.candlestick.createCandlestick = function (e) { for (var t = [], p = [], q = 0; q < e.data.length; q++) t.push([e.data[q][0], e.data[q][3]]), p.push([e.data[q][0], e.data[q][4]]); return [e, { label: "Max", data: p, lines: { show: !1 }, candlestick: { show: !1 }, nearBy: { findItem: null } }, { label: "Min", data: t, lines: { show: !1 }, candlestick: { show: !1 }, nearBy: { findItem: null } }] }; e.plot.plugins.push({
        init: function (r) {
            function t(a,
            b, c, d) { !0 === b.candlestick.show && (b.nearBy.findItem = q, b.nearBy.drawHover = m) } function p(a, b, c) {
                if (!0 === c.candlestick.show) {
                    if ("string" === typeof c.candlestick.lineWidth) c.candlestick.barWidth = parseInt(c.candlestick.lineWidth, 0), c.nearBy.width = c.candlestick.barWidth; else { var d = c.xaxis.p2c(c.xaxis.min + c.candlestick.lineWidth) - c.xaxis.p2c(c.xaxis.min); c.candlestick.barWidth = d; c.nearBy.width = c.candlestick.lineWidth } k = a.getPlotOffset(); b.save(); b.translate(k.left, k.top); for (a = 0; a < c.data.length; a++) c.candlestick.drawCandlestick(b,
                    c, c.data[a], !1); b.restore()
                }
            } function q(f, b, c, d) {
                function h(c, b, d, l) { c = null; return c = [d, a.series.justEditing[1].dataIndex] } function g(c, a, b, d) {
                    var l = null; if (!0 === d.candlestick.show) for (var g = 0; g < d.data.length; g++) {
                        var h, n, f, e, k; k = d.data[g]; h = d.xaxis.p2c(k[0]) - d.candlestick.barWidth / 2; n = d.yaxis.p2c(k[1]) - d.candlestick.rangeWidth / 2; f = d.yaxis.p2c(k[2]) - d.candlestick.rangeWidth / 2; e = d.yaxis.p2c(k[3]) - d.candlestick.rangeWidth / 2; k = d.yaxis.p2c(k[4]) - d.candlestick.rangeWidth / 2; u(c, h, h + d.candlestick.barWidth) &&
                        (u(a, e, k) && (l = [b, g], d.editMode = "x", d.nearBy.findMode = "horizontal"), u(a, n, n + d.candlestick.rangeWidth) && (l = [b, [g, 1]], d.editMode = "y", d.nearBy.findMode = "vertical"), u(a, f, f + d.candlestick.rangeWidth) && (l = [b, [g, 2]], d.editMode = "y", d.nearBy.findMode = "vertical"), u(a, e, e + d.candlestick.rangeWidth) && (l = [b, [g, 3]], d.editMode = "y", d.nearBy.findMode = "vertical"), u(a, k, k + d.candlestick.rangeWidth) && (l = [b, [g, 4]], d.editMode = "y", d.nearBy.findMode = "vertical"))
                    } return l
                } function n(d, a, b, c) {
                    for (var l = null, g = 0; g < c.data.length; g++) {
                        var h,
                        n, f; f = c.data[g]; h = c.xaxis.p2c(f[0]) - c.candlestick.barWidth / 2; n = c.yaxis.p2c(f[3]); f = c.yaxis.p2c(f[4]); u(d, h, h + c.candlestick.barWidth) && u(a, n, f) && (l = [b, g])
                    } return l
                } var l = null; !0 === d.candlestick.show && (a.series.justEditing ? a.series.justEditing[1].seriesIndex === c && (l = h(f, b, c, d)) : l = a.grid.editable ? g(f, b, c, d) : n(f, b, c, d)); return l
            } function m(a, b, c) { a.save(); b.candlestick.drawCandlestick(a, b, c.length ? b.data[c[0]] : b.data[c], !0); a.restore() } var k = null, a = null; r.hooks.processOptions.push(function (f, b) {
                b.series.candlestick.active &&
                (e.extend(!0, b, x), a = b, f.hooks.processRawData.push(t), f.hooks.drawSeries.push(p))
            })
        }, options: {
            series: {
                candlestick: {
                    active: !1, show: !1, rangeWidth: 4, rangeColor: "rgb(0,128,128)", upColor: "rgb(255,0,0)", downColor: "rgb(0,255,0)", neutralColor: "rgb(0,0,0)", lineWidth: "8px", highlight: { opacity: 0.5 }, drawCandlestick: function (e, t, p, q) {
                        function m(a, b, c) {
                            var d, h; d = b.xaxis.p2c(c[0]); h = b.yaxis.p2c(c[3]); c = b.yaxis.p2c(c[4]); a.lineWidth = b.candlestick.rangeWidth; a.beginPath(); a.strokeStyle = b.candlestick.rangeColor; a.moveTo(d,
                            h); a.lineTo(d, c); a.stroke()
                        } function k(a, b, c) { var d, h, g, n; d = b.xaxis.p2c(c[0]); h = b.yaxis.p2c(c[1]); g = b.yaxis.p2c(c[2]); n = c[1] > c[2] ? b.candlestick.upColor : b.candlestick.downColor; c[1] == c[2] && (n = b.candlestick.neutralColor, g = h + 2); a.beginPath(); a.strokeStyle = n; a.lineWidth = b.candlestick.barWidth; a.moveTo(d, h); a.lineTo(d, g); a.stroke() } function a(a, b, c, d) {
                            var h, g; h = b.xaxis.p2c(c[0] - b.candlestick.barWidth / 2); g = b.yaxis.p2c(c[3]); c = b.yaxis.p2c(c[4]); a.beginPath(); a.strokeStyle = d; a.lineWidth = b.candlestick.barWidth;
                            a.moveTo(h, g); a.lineTo(h, c); a.stroke()
                        } !0 === q ? a(e, t, p, "rgba(255,255,255," + t.candlestick.highlight.opacity + ")") : (m(e, t, p), k(e, t, p))
                    }
                }
            }
        }, name: "candlestick", version: "0.3"
    })
})(jQuery); (function (e) {
    function x(e, q, m, k, a, f, b, c) { !1 === c && (e.beginPath(), e.lineWidth = q.gantt.barheight, e.strokeStyle = "rgb(0,0,0)", e.moveTo(k, a), e.lineTo(f, a), e.stroke()); e.beginPath(); e.strokeStyle = b; e.lineWidth = q.gantt.barheight - 2; e.lineCap = "butt"; e.moveTo(k + 1, a); e.lineTo(f - 1, a); e.stroke() } var u = { series: { lines: { show: !1 } } }, r = { series: { editMode: "y", nearBy: { distance: 6, findItem: null, findMode: "circle", drawHover: null } } }, t = e.plot.JUMlib.library.between; e.plot.plugins.push({
        init: function (p) {
            function q(d, c, b, g) {
                !0 ===
                c.gantt.show && (c.nearBy.findItem = a, c.nearBy.drawHover = f)
            } function m(a, c) {
                var s; d = a.getCanvas(); e(d).parent(); h = a.getAxes(); b = a.getPlotOffset(); g = a.getData(); for (var f = 0; f < g.length; f++) if (s = g[f], s.gantt.barheight = h.yaxis.p2c(1) / (h.yaxis.max - h.yaxis.min) * s.gantt.barHeight, s.gantt.show) {
                    for (var A = 0; A < s.data.length; A++) k(c, s, s.data[A], s.color, !1); if (s.gantt.connectSteps.show) for (var A = c, w = 0; w < s.data.length; w++) for (var z = 0; z < s.data.length; z++) if (s.data[w][2] == s.data[z][0]) {
                        var v = b.left + h.xaxis.p2c(s.data[w][2]),
                        B = b.top + h.yaxis.p2c(s.data[w][1]), C = b.top + h.yaxis.p2c(s.data[z][1]), m = A, D = s.gantt.connectSteps.lineWidth, p = s.gantt.connectSteps.color; m.beginPath(); m.lineWidth = D; m.strokeStyle = p; m.moveTo(v, B); m.lineTo(v, C); m.stroke()
                    }
                }
            } function k(a, c, d, g, e) {
                var f, k, v; f = b.left + h.xaxis.p2c(d[0]); f = Math.min(Math.max(b.left, f), b.left + p.width()); k = b.top + h.yaxis.p2c(d[1]); v = b.left + h.xaxis.p2c(d[2]); v = Math.min(Math.max(v, b.left), b.left + p.width()); if (v > b.left || f > b.left) if (f < b.left + p.width() || v < b.left + p.width()) 4 === d.length ?
                x(a, c, d, f, k, v, g, e) : c.gantt.drawstep(a, c, d, f, k, v, g, e)
            } function a(a, d, b, g) {
                function h(a, d, c, b) { var g = null; if (b.gantt.show) for (var l = 0; l < b.data.length; l++) { var n = b.data[l], s = b.xaxis.p2c(n[0]), e = b.xaxis.p2c(n[2]); Math.abs(b.yaxis.p2c(n[1]) - d) <= b.gantt.barheight / 2 && t(a, s, e) && (g = [c, l]) } return g } function e(a, d, c, b) {
                    var g = null; if (b.gantt.show) for (var l = 0; l < b.data.length; l++) {
                        var h = b.data[l], n = b.xaxis.p2c(h[0]), s = b.xaxis.p2c(h[2]); Math.abs(b.yaxis.p2c(h[1]) - d) <= b.gantt.barheight / 2 && (t(a, n, s) && (g = [c, l], b.editMode =
                        "y", b.nearBy.findMode = "vertical", b.nearBy.width = h[2] - h[0]), t(a, n, n + b.nearBy.distance) && (g = [c, [l, 1]], b.editMode = "x", b.nearBy.findMode = "horizontal"), t(a, s, s + b.nearBy.distance) && (g = [c, [l, 2]], b.editMode = "x", b.nearBy.findMode = "horizontal"))
                    } return g
                } function f(a, b, d, g) { a = null; return a = [d, c.series.justEditing[1].dataIndex] } var k = null; c.series.justEditing ? c.series.justEditing[1].seriesIndex === b && (k = f(a, d, b, g)) : k = c.grid.editable ? e(a, d, b, g) : h(a, d, b, g); return k
            } function f(a, d, c) {
                a.save(); a.translate(-b.left,
                -b.top); k(a, d, c.length ? d.data[c[0]] : d.data[c], "rgba(255,255,255, " + d.gantt.highlight.opacity + ")", !0); a.restore()
            } var b = null, c = null, d, h, g; p.hooks.processOptions.push(function (a, b) { b.series.gantt.active && (e.extend(!0, b, u), e.plot.JUMlib.data.extendEmpty(b, r), c = b, a.hooks.processRawData.push(q), a.hooks.draw.push(m)) })
        }, options: { series: { gantt: { active: !1, show: !1, connectSteps: { show: !1, lineWidth: 2, color: "rgb(0,0,0)" }, barHeight: 0.6, highlight: { opacity: 0.5 }, drawstep: x } } }, name: "gantt", version: "0.3"
    })
})(jQuery); (function (e) {
    e.plot.plugins.push({
        init: function (x) {
            function u() {
                function b() { if (1 === k.actualStep) for (var a = 0; a < k[l].data.length; a++) k[l].data[a][f] = k[l].dataOrg[a][g.valueIndex] } function c() {
                    if (k.actualStep <= k[l].grow.steps) for (var a = 0; a < k[l].data.length; a++) "up" === g.stepDirection ? k[l].data[a][g.valueIndex] = k[l].dataOrg[a][g.valueIndex] / k[l].grow.steps * k.actualStep : "down" === g.stepDirection && (k[l].data[a][g.valueIndex] = k[l].dataOrg[a][g.valueIndex] + (k[l].yaxis.max - k[l].dataOrg[a][g.valueIndex]) / k[l].grow.steps *
                    (k[l].grow.steps - k.actualStep))
                } function d() { if (k.actualStep <= k[l].grow.steps) for (var a = 0; a < k[l].data.length; a++) "up" === g.stepDirection ? k[l].data[a][g.valueIndex] = Math.min(k[l].dataOrg[a][g.valueIndex], k[l].yaxis.max / k[l].grow.steps * k.actualStep) : "down" === g.stepDirection && (k[l].data[a][g.valueIndex] = Math.max(k[l].dataOrg[a][g.valueIndex], k[l].yaxis.max / k[l].grow.steps * (k[l].grow.steps - k.actualStep))) } function h() {
                    if (k.actualStep == k[l].grow.steps) for (var a = 0; a < k[l].data.length; a++) k[l].data[a][g.valueIndex] =
                    k[l].dataOrg[a][g.valueIndex]
                } var g, n = new Date; if (k.actualStep < a.series.grow.steps) { k.actualStep++; for (var l = 0; l < k.length; l++) for (var s = 0; s < k[l].grow.growings.length; s++) g = k[l].grow.growings[s], "function" === typeof g.stepMode ? g.stepMode(k[l], k.actualStep, g) : "linear" === g.stepMode ? c() : "maximum" === g.stepMode ? d() : "delay" === g.stepMode ? h() : b(); m.setData(k); m.draw(); n = new Date - n; q = window.setTimeout(u, Math.max(0, a.series.grow.stepDelay - n)) } else window.clearTimeout(q), q = null
            } function r() {
                q && (window.clearTimeout(q),
                q = null)
            } function t(a) { if (null === a || "object" !== typeof a) return a; var c = new a.constructor, d; for (d in a) c[d] = t(a[d]); return c } var p = !1, q, m = x, k = null, a = null, f; x.hooks.bindEvents.push(function (b, c) {
                a = b.getOptions(); if (!0 === a.series.grow.active) {
                    for (var d = b.getData(), h = 0; h < k.length; h++) a.series.grow.steps = Math.max(a.series.grow.steps, d[h].grow.steps); 0 === a.series.grow.stepDelay && a.series.grow.stepDelay++; u(); a: { for (var d = e.plot.plugins, h = 0, g = d.length; h < g; h++) if ("resize" === d[h].name) { d = !0; break a } d = !1 } d &&
                    b.getPlaceholder().bind("resize", r)
                }
            }); x.hooks.drawSeries.push(function (b, c, d) { a = b.getOptions(); f = a.series.grow.valueIndex; if (!0 === a.series.grow.active && !1 === p) { k = b.getData(); k.actualStep = 0; for (c = k.growingIndex = 0; c < k.length; c++) for (k[c].dataOrg = t(k[c].data), d = 0; d < k[c].data.length; d++) k[c].data[d][f] = 0; b.setData(k); p = !0 } }); x.hooks.shutdown.push(function (a, c) { a.getPlaceholder().unbind("resize", r) })
        }, options: { series: { grow: { active: !1, stepDelay: 20, steps: 100, growings: [{ valueIndex: 1, stepMode: "linear", stepDirection: "up" }] } } },
        name: "grow", version: "0.4"
    })
})(jQuery); (function (e) {
    var x = { series: { nearBy: { distance: 6, findItem: null, findMode: "circle", drawHover: null } } }, u = { grid: { show: !1 } }, r = e.plot.JUMlib.library.between; e.plot.plugins.push({
        init: function (t) {
            function p(d, b, c, g) { !0 === b.pyramids.show && (b.nearBy.findItem = a, b.nearBy.drawHover = f) } function q(a, e, f) { if (f.pyramids.show) for (c = a.getPlotOffset(), h = f.data[0].value, n = e.canvas.height, l = e.canvas.width, d = e.canvas.height / f.data.length, g = e.canvas.width / 2, a = 0; a < f.data.length; a++) m(e, f, a, b.colors[a]) } function m(a, b, c, l) {
                var n,
                f, B; n = b.data[c].value * a.canvas.width / h; B = a.canvas.height - d * c; f = c + 1 == b.data.length ? 0 : b.data[c + 1].value * a.canvas.width / h; if (e.isFunction(b.pyramids.mode)) b.pyramids.mode(a, b, g, B, n, d, f, l); else switch (b.pyramids.mode) { case "pyramid": k(a, b, B, n, d, f, l); break; case "slice": f = d; var C = B - f / 2; a.save(); a.beginPath(); a.lineWidth = 1; a.fillStyle = l; a.strokeStyle = l; a.translate(g - n / 2, C - f / 2); a.scale(n / 2, f / 2); a.arc(1, 1, 1, 0, 2 * Math.PI, !1); a.closePath(); a.fill(); a.restore(); break; default: k(a, b, B, n, d, f, l) } if (!0 === b.pyramids.label.show) {
                    c =
                    b.data[c]; B -= d / 2; a.font = b.pyramids.label.font; a.fillStyle = b.pyramids.label.fillStyle; l = a.measureText(c.label); switch (b.pyramids.label.align) { case "center": b = a.canvas.width / 2 - l.width / 2; break; case "left": b = 0; break; case "right": b = a.canvas.width - l.width; break; default: b = a.canvas.width - l.width } a.fillText(c.label, b, B)
                }
            } function k(a, b, c, d, l, h, n) { a.beginPath(); a.lineWidth = 1; a.fillStyle = n; a.strokeStyle = n; a.moveTo(g - d / 2, c); a.lineTo(g + d / 2, c); a.lineTo(g + h / 2, c - l); a.lineTo(g - h / 2, c - l); a.closePath(); a.fill() } function a(a,
            b, c, f) { var e = null; b = Math.floor((n - b) / d); r(b, 0, f.data.length - 1) && (f = f.data[b].value * l / h, !0 === r(a, g - f / 2, g + f / 2) && (e = [c, b])); return e } function f(a, b, d) { a.save(); a.translate(-c.left, -c.top); m(a, b, d, "rgba(255,255,255," + b.pyramids.highlight.opacity + ")"); a.restore() } var b = null, c = null, d = null, h, g, n, l; t.hooks.processOptions.push(function (a, c) { !0 === c.series.pyramids.active && (e.extend(!0, c, u), e.plot.JUMlib.data.extendEmpty(c, x), b = c, a.hooks.processRawData.push(p), a.hooks.drawSeries.push(q)) })
        }, options: {
            series: {
                pyramids: {
                    active: !1,
                    show: !1, mode: "pyramid", fill: !0, highlight: { opacity: 0.5 }, label: { show: !1, align: "center", font: "20px Times New Roman", fillStyle: "Black" }
                }
            }
        }, name: "pyramids", version: "0.2"
    })
})(jQuery); (function (e) {
    var x = { grid: { show: !1 } }; e.plot.plugins.push({
        init: function (u) {
            function r(a, b, c, d) { } function t(g, h) {
                b = g.getData(); f = g.getOptions(); h.clearRect(0, 0, h.canvas.width, h.canvas.height); m = Math.min(h.canvas.width, h.canvas.height) / 2 * f.series.radar.radarSize; k = a = h.canvas.height / 2; h.beginPath(); h.lineWidth = 2; h.strokeStyle = f.series.radar.color; h.fillStyle = f.series.radar.backColor; h.arc(a, k, m, 0, 2 * Math.PI, !0); h.closePath(); h.fill(); c = document.createElement("canvas"); c.width = h.canvas.width; c.height = h.canvas.height;
                e(c).css({ position: "absolute", left: 0, top: 0 }); e(c).appendTo(u.getPlaceholder()); d = c.getContext("2d"); for (var l = 0; l < b.length; l++) for (var s = h, y = b[l], q = 0; q < y.data.length; q++) { var w = s, z = y, v = y.data[q], B = 2 * Math.PI * v[0] / 360, C = z.radar.itemSize, E = k + Math.round(Math.cos(B) * m * v[1] / 100) - C, v = a + Math.round(Math.sin(B) * m * v[1] / 100) - C; w.beginPath(); w.lineWidth = 1; w.fillStyle = z.color; w.strokeStyle = z.color; w.arc(E, v, C, 0, 2 * Math.PI, !0); w.closePath(); w.fill() } window.setInterval(p, f.series.radar.delay)
            } function p() {
                var a = f.series.radar.angleSize,
                b = f.series.radar.angleSteps, c, e; d.clearRect(0, 0, d.canvas.width, d.canvas.height); for (var k = d.lineWidth = 1; k <= b; k++) c = (b - k + 1) / 10, e = (k - 1) * a + h, q("rgba(255,255,255," + c + ")", e, a + e); q(f.series.radar.backColor, h + b * a, h); h += f.series.radar.angleStep; 359 < h && (h = 0)
            } function q(b, c, h) { c = 2 * Math.PI * c / 360; h = 2 * Math.PI * h / 360; var f = k + Math.round(Math.cos(c) * m), e = a + Math.round(Math.sin(c) * m); d.strokeStyle = b; d.fillStyle = b; d.beginPath(); d.moveTo(k, a); d.lineTo(f, e); d.arc(k, a, m, c, h); d.lineTo(k, a); d.closePath(); d.fill() } var m = null,
            k = null, a = null, f = null, b = null, c = null, d = null, h = 0; u.hooks.processOptions.push(function (a, b) { !0 === b.series.radar.active && (e.extend(!0, b, x), f = b, a.hooks.processRawData.push(r), a.hooks.draw.push(t)) })
        }, options: { series: { radar: { active: !1, show: !1, radarSize: 0.8, delay: 10, angleStep: 1, angleSize: 10, angleSteps: 6, color: "darkgreen", backColor: "darkgreen" } } }, name: "radar", version: "0.1"
    })
})(jQuery); (function (e) {
    var x = { grid: { show: !1 } }, u = { series: { nearBy: { distance: 6, findItem: null, findMode: "circle", drawEdit: null, drawHover: null } }, grid: { ranges: 5, font: "18px Times New Roman" } }, r = e.plot.JUMlib.library.between, t = e.plot.JUMlib.data.createColors, p = e.plot.JUMlib.data.getColor; e.plot.plugins.push({
        init: function (q) {
            function m(b, c, d) {
                var g, l, f, e, n; if (d.rose.show) {
                    h = d; for (var m = b = 0; m < d.data.length; m++) n = d.data[m], g = b + w, l = b + A - w, b += A, n.length ? (f = a(n[0]), e = { ctx: c, serie: d, serieIndex: m, colors: z, radius: f, left: s, top: y },
                    e = p(e), k(c, n[1], n[2], f, e)) : (f = a(n), e = { ctx: c, serie: d, serieIndex: m, colors: z, radius: f, left: s, top: y }, e = p(e), k(c, g, l, f, e))
                }
            } function k(a, b, c, d, h) { b = 2 * Math.PI * b / 360; c = 2 * Math.PI * c / 360; var g = s + Math.round(Math.cos(b) * d), l = y + Math.round(Math.sin(b) * d); a.strokeStyle = h; a.fillStyle = h; a.beginPath(); a.moveTo(s, y); a.lineTo(g, l); a.arc(s, y, d, b, c); a.lineTo(s, y); a.closePath(); a.fill() } function a(a) { return (a - d.series.rose.dataMin) / (d.series.rose.dataMax - d.series.rose.dataMin) * l } function f(a, b) {
                function c(a, b) {
                    a.beginPath();
                    a.moveTo(s, y); a.arc(s, y, l / d.grid.ranges * b, 0, 2 * Math.PI); a.closePath(); a.stroke()
                } function e(a, b) { var c = 2 * Math.PI * b / 360, d = s + Math.round(Math.cos(c) * l), c = y + Math.round(Math.sin(c) * l); a.beginPath(); a.moveTo(s, y); a.lineTo(d, c); a.closePath(); a.stroke() } function f(a, b, c) { a.font = d.grid.font; var h = 2 * Math.PI * b / 360, g = s + Math.round(Math.cos(h) * l), h = y + Math.round(Math.sin(h) * l), e = a.measureText(c); 180 > b && (h += 10); r(b, 90, 270) && (g -= e.width); a.fillText(c, g, h) } var k = 0, m; g = b; n = a.getData(); b.strokeStyle = d.grid.tickColor;
                b.fillStyle = d.grid.color; for (m = 1; m <= d.grid.ranges; m++) c(b, m), !0 === d.series.rose.drawGrid.drawValue && b.fillText(d.series.rose.dataMin + (d.series.rose.dataMax - d.series.rose.dataMin) / d.grid.ranges * m, s + l / d.grid.ranges * m, y - 1); for (m = 0; m < d.grid.tickLabel.length; m++) e(b, k), f(b, k + A * h.rose.drawGrid.labelPos, d.grid.tickLabel[m]), k += A
            } function b(b, c, d, h) {
                return function (b, c, d, h) {
                    function e(a, d) {
                        var h, l, f, n; g.save(); g.beginPath(); h = 2 * Math.PI * a / 360; l = 2 * Math.PI * (a + A) / 360; f = s + Math.round(Math.cos(h) * d); n = y + Math.round(Math.sin(h) *
                        d); g.moveTo(s, y); g.lineTo(f, n); g.arc(s, y, d, h, l); g.closePath(); h = g.isPointInPath(b, c); g.restore(); return h
                    } var f = null, k, v, m; for (m = k = 0; m < h.data.length; m++) { v = e(k, l); if (!0 === v) { f = [d, m]; for (d = 0; d < n.length; d++) v = a(n[d].data[m]), v = e(k, v), !0 === v && (f = [d, m]); break } k += A } return f
                }(b, c, d, h)
            } function c(a, b, c) { c *= A; k(a, c, c + A, l, "rgba(255,255,255," + b.rose.highlight.opacity + ")") } var d = null, h = null, g, n, l, s, y, A, w, z; q.hooks.processOptions.push(function (a, b) {
                !0 === b.series.rose.active && (e.extend(!0, b, x), e.plot.JUMlib.data.extendEmpty(b,
                u), d = b, a.hooks.drawSeries.push(m), a.hooks.draw.push(f))
            }); q.hooks.processRawData.push(function (a, h, g, f) { if (!0 === h.rose.show) { g = a.getCanvas(); l = Math.min(g.width, g.height) / 2 * d.series.rose.roseSize; s = y = g.height / 2; z = t(d, h.data[0].length); h.nearBy.findItem = b; h.nearBy.drawHover = c; a.getPlotOffset(); switch (d.series.rose.drawGrid.gridMode) { case "data": A = 360 / h.data.length; break; case "ticks": A = 360 / d.grid.tickLabel.length } w = A * (1 - d.series.rose.leafSize) / 2 } })
        }, options: {
            series: {
                rose: {
                    active: !1, show: !1, roseSize: 0.7,
                    leafSize: 0.7, dataMin: 0, dataMax: 100, drawGrid: { drawValue: !0, drawLabel: !0, labelPos: 0.5, gridMode: "data" }, highlight: { opacity: 0.5 }
                }
            }
        }, name: "rose", version: "0.1"
    })
})(jQuery); (function (e) {
    var x = { grid: { show: !1 }, xaxes: [{ min: 0, max: 100 }], yaxes: [{ min: 0, max: 100 }] }, u = { series: { editMode: "none", nearBy: { distance: 6, findMode: "circle" } } }, r = e.plot.JUMlib.library.between, t = e.plot.JUMlib.data.createFont, p = e.plot.JUMlib.data.createColors; e.plot.plugins.push({
        init: function (q) {
            function m(b, c, d, h) { !0 === c.rectangle.show && (c.nearBy.drawHover = a, c.nearBy.findItem = f) } function k(a, l, f) {
                var k = 0, m = 0, q = 100, z = 100; f.xaxis.options.font || (f.xaxis.options.font = t(a.getPlaceholder())); if (f.rectangle.show) {
                    d =
                    f; b = a.getPlotOffset(); h = p(c, f.data.length); for (a = g = 0; a < f.data.length; a++) g += f.data[a].data; for (a = 0; a < f.data.length; a++) {
                        var v, B, C, r; r = f.data[a]; switch (f.rectangle.directions[a % f.rectangle.directions.length]) {
                            case "t": v = m; B = k; C = q; r = 100 * (100 * (r.data / g) / q); k += r; z -= r; break; case "b": v = m; r = 100 * (100 * (r.data / g) / q); C = q; B = k - r + z; z -= r; break; case "l": v = m; B = k; C = 100 * (100 * (r.data / g) / z); r = z; m += C; q -= C; break; case "r": B = k; C = 100 * (100 * (r.data / g) / z); v = m + q - C; r = z; q -= C; break; default: v = m, B = k, C = q, r = 100 * (100 * (r.data / g) / q), k +=
                            r, z -= r
                        } var D; v = b.left + f.xaxis.p2c(v); B = b.top + f.yaxis.p2c(100 - B); C = f.xaxis.p2c(C) - f.xaxis.p2c(0); r = f.yaxis.p2c(0) - f.yaxis.p2c(r); D = e.plot.JUMlib.data.getColor({ ctx: l, serie: d, dataIndex: a, colors: h, left: v, top: B, height: r, width: C }); f.data[a].pos = { x: v, y: B, w: C, h: r, color: D }; f.rectangle.drawRectangle(l, f, a)
                    }
                }
            } function a(a, b, c) { b.rectangle.drawRectangle(a, b, c) } function f(a, b, c, d) { for (var h = null, g = 0; g < d.data.length; g++) { var f = d.data[g].pos; r(a, f.x, f.x + f.w) && r(b, f.y, f.y + f.h) && (h = [c, g]) } return h } var b = null, c = null,
            d = null, h, g; q.hooks.processOptions.push(function (a, b) { b.series.rectangle.active && (e.extend(!0, b, x), e.plot.JUMlib.data.extendEmpty(b, u), c = b, a.hooks.processRawData.push(m), a.hooks.drawSeries.push(k)) })
        }, options: {
            series: {
                rectangle: {
                    active: !1, show: !1, fill: !0, lineWidth: 2, directions: "tlbr", highlight: { opacity: 0.5 }, drawRectangle: function (e, m, k) {
                        k = m.data[k]; e.save(); e.linewidth = m.rectangle.lineWidth; !0 === m.rectangle.fill ? (e.fillStyle = k.pos.color, e.fillRect(k.pos.x, k.pos.y, k.pos.w, k.pos.h)) : (e.strokeStyle = k.pos.color,
                        e.strokeRect(k.pos.x, k.pos.y, k.pos.w, k.pos.h)); e.restore(); e.fillStyle = m.color; e.strokeStyle = m.color; e.lineWidth = m.rectangle.lineWidth; m.rectangle.label.show && (e.fillStyle = m.rectangle.label.fillStyle, m = m.xaxis.options.font, e.font = m.style + " " + m.variant + " " + m.weight + " " + m.size + "px '" + m.family + "'", m = e.measureText(k.label), e.fillText(k.label, k.pos.x + k.pos.w / 2 - m.width / 2, k.pos.y + k.pos.h / 2))
                    }, label: { show: !1, fillStyle: "black" }
                }
            }
        }, name: "rectangle", version: "0.3"
    })
})(jQuery); (function (e) {
    var x = { series: { spider: { active: !1, show: !1, spiderSize: 0.8, lineWidth: 3, lineStyle: "rgba(0,0,0,0.5)", pointSize: 6, scaleMode: "leg", legMin: null, legMax: null, connection: { width: 4 }, highlight: { opacity: 0.5, mode: "point" }, legs: { font: "20px Times New Roman", fillStyle: "Black", legScaleMin: 0.95, legScaleMax: 1.05, legStartAngle: 0 } } } }, u = { series: { editMode: "xy", nearBy: { distance: 6, findItem: null, findMode: "circle", drawEdit: null, drawHover: null } }, grid: { mode: "radar" } }, r = { grid: { show: !1, tickColor: "rgba(0,0,0,0.15)", ticks: 5 } },
    t = e.plot.JUMlib.library.between; e.plot.plugins.push({
        init: function (p) {
            function q(a, b, c, d) { !0 === b.spider.show && (b.nearBy.drawEdit = g, b.nearBy.findItem = h, b.nearBy.drawHover = n) } function m(a, c) {
                w = a.getData(); y = a.getOptions(); c.clearRect(0, 0, c.canvas.width, c.canvas.height); l = Math.min(c.canvas.width, c.canvas.height) / 2 * w[0].spider.spiderSize; s = A = c.canvas.height / 2; var d = [], h; if ("leg" === w[0].spider.scaleMode) for (h = 0; h < w[0].data.length; h++) d.push(k(h)); else {
                    var g; h = Number.POSITIVE_INFINITY; g = Number.NEGATIVE_INFINITY;
                    for (var f = 0; f < w[0].data.length; f++) for (var e = 0; e < w.length; e++) h = Math.min(h, w[e].data[f][1]), g = Math.max(g, w[e].data[f][1]); h *= w[0].spider.legs.legScaleMin; g *= w[0].spider.legs.legScaleMax; y.series.spider.legMin && (h = y.series.spider.legMin); y.series.spider.legMax && (g = y.series.spider.legMax); g = { min: h, max: g, range: g - h }; for (h = 0; h < w[0].data.length; h++) d.push(g)
                } w.ranges = d; b(c, y.grid)
            } function k(a) {
                for (var b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = 0; d < w.length; d++) b = Math.min(b, w[d].data[a][1]),
                c = Math.max(c, w[d].data[a][1]); b *= w[0].spider.legs.legScaleMin; c *= w[0].spider.legs.legScaleMax; y.series.spider.legMin && (b = y.series.spider.legMin); y.series.spider.legMax && (c = y.series.spider.legMax); return { min: b, max: c, range: c - b }
            } function a(a, b, h, g) { for (var f = 0; f < h.data.length; f++) { var e = a, l = b, k = h, n = f, m = g, s = void 0, s = c(k, w.ranges, n), s = d(l, n, s); e.beginPath(); e.lineWidth = 1; e.fillStyle = m; e.strokeStyle = m; e.arc(s.x, s.y, k.spider.pointSize, 0, 2 * Math.PI, !0); e.closePath(); e.fill() } } function f(a, b, h, g, f) {
                var e; f ||
                (f = !1); a.beginPath(); a.lineWidth = h.spider.connection.width; a.strokeStyle = g; a.fillStyle = g; e = c(h, w.ranges, 0); e = d(b, 0, e); a.moveTo(e.x, e.y); for (g = 1; g < h.data.length; g++) e = c(h, w.ranges, g), e = d(b, g, e), a.lineTo(e.x, e.y); e = c(h, w.ranges, 0); e = d(b, 0, e); a.lineTo(e.x, e.y); !0 === f ? a.fill() : !0 === h.spider.fill ? a.fill() : a.stroke()
            } function b(b, c) {
                function h(a, b) {
                    a.lineWidth = 1; a.strokeStyle = b.tickColor; for (var c = 1; c <= b.ticks; c++) a.beginPath(), a.arc(s, A, l / b.ticks * c, 0, 2 * Math.PI, !0), a.closePath(), a.stroke(); for (var f = c =
                    null, n = 0; n < k; n++) null === c && (c = d(k, n, 100), f = d(k, Math.floor(k / 4), 100)), g(a, n), e(a, n, c, f)
                } function g(a, b) { var c; a.beginPath(); a.lineWidth = x.series.spider.lineWidth; a.strokeStyle = x.series.spider.lineStyle; a.moveTo(A, s); c = d(k, b, 100); a.lineTo(c.x, c.y); a.stroke() } function e(a, b, c, h, g) {
                    var f, l; g = d(k, b, 100); a.font = w[0].spider.legs.font; a.fillStyle = w[0].spider.legs.fillStyle; f = a.measureText(w[0].spider.legs.data[b].label); l = g.y > c.y ? 15 : -15; t(g.y, c.y + 10, c.y - 10) && (l = 0); h = g.x < h.x ? -1 * f.width - f.width / 2 : 0; t(g.x, c.x +
                    10, c.x - 10) && (h = f.width / 2); a.fillText(w[0].spider.legs.data[b].label, g.x + h, g.y + l)
                } var k = w[0].data.length, n; for (n = 0; n < w.length; n++) f(b, k, w[n], w[n].color); for (n = 0; n < w.length; n++) a(b, k, w[n], w[n].color); (function (a, b) {
                    switch (b.mode) {
                        case "radar": h(a, b); break; case "spider": var c, f; a.linewidth = 1; a.strokeStyle = b.tickColor; for (c = 0; c <= b.ticks; c++) { var l = d(k, 0, 100 / b.ticks * c); a.beginPath(); a.moveTo(l.x, l.y); for (f = 1; f < k; f++) l = d(k, f, 100 / b.ticks * c), a.lineTo(l.x, l.y); a.closePath(); a.stroke() } l = c = null; for (f = 0; f < k; f++) null ===
                        c && (c = d(k, f, 100), l = d(k, Math.floor(k / 4), 100)), g(a, f), e(a, f, c, l); break; default: h(a, b)
                    }
                })(b, c)
            } function c(a, b, c, d) { d ? a = 100 * ((d - b[c].min) / b[c].range) : (a = Math.max(Math.min(a.data[c][1], b[c].max), b[c].min), a = 100 * ((a - b[c].min) / b[c].range)); return a } function d(a, b, c) { var d, h; h = 2 * Math.PI * y.series.spider.legs.legStartAngle / 360; d = s + Math.round(Math.cos(2 * Math.PI / a * b + h) * l * c / 100); a = A + Math.round(Math.sin(2 * Math.PI / a * b + h) * l * c / 100); return { x: d, y: a } } function h(a, b, h, g) {
                function f(a, b, h, g) {
                    var e, l, k, n = null, m = g.data.length;
                    for (e = 0; e < m; e++) l = d(m, e, c(g, w.ranges, e)), k = Math.abs(l.x - a), l = Math.abs(l.y - b), k = Math.sqrt(k * k + l * l), k <= g.nearBy.distance && (n = [h, e]); return n
                } function e(a, b, c, h) { var g, f, k, n = null; f = h.data.length; var m = y.series.justEditing[1].dataIndex; g = (a - s) * (a - s) + (b - A) * (b - A); g = Math.sqrt(g); k = g = 100 * (g / l); g = w.ranges[m]; g = g.min + g.range / 100 * k; f = d(f, m, k); a = Math.abs(f.x - a); b = Math.abs(f.y - b); Math.sqrt(a * a + b * b) <= h.spider.pointSize && (n = [c, m, g, 0]); return n } var k = null; y.series.justEditing ? y.series.justEditing[1].seriesIndex ===
                h && (k = e(a, b, h, g)) : k = f(a, b, h, g); return k
            } function g(a, b, h, g) { a.beginPath(); a.lineWidth = 1; b = "rgba(255, 0, 0, " + g.spider.highlight.opacity + ")"; a.fillStyle = b; a.strokeStyle = b; b = c(g, w.ranges, y.series.justEditing[1].dataIndex, y.series.justEditing[0].value); g = d(g.data.length, y.series.justEditing[1].dataIndex, b); a.arc(g.x, g.y, y.series.spider.pointSize, 0, 2 * Math.PI, !0); a.closePath(); a.fill() } function n(b, c, d) {
                if (!c.justEditing) {
                    d = "rgba(255, 255, 255, " + c.spider.highlight.opacity + ")"; var h = c.data.length; switch (c.spider.highlight.mode) {
                        case "point": a(b,
                        h, c, d); break; case "line": f(b, h, c, d, !1); break; case "area": f(b, h, c, c.color, !0)
                    }
                }
            } var l = null, s = null, y = null, A = null, w; p.hooks.processOptions.push(function (a, b) { b.series.spider.active && (e.extend(!0, b, r), e.plot.JUMlib.data.extendEmpty(b, u), y = b, a.hooks.processRawData.push(q), a.hooks.draw.push(m)) })
        }, options: x, name: "spider", version: "0.6"
    })
})(jQuery); (function (e) {
    var x = { series: { nearBy: { distance: 6, findItem: null, findMode: "circle", drawEdit: null, drawHover: null } } }, u = { grid: { show: !1 } }, r = e.plot.JUMlib.data.createColors, t = e.plot.JUMlib.data.getColor; e.plot.plugins.push({
        init: function (p) {
            function q(a, f, e) {
                if (e.spiral.show) {
                    c = e; a.getPlotOffset(); h = r(b, e.data.length); n = Math.min(f.canvas.width, f.canvas.height) / 2 * b.series.spiral.spiralSize; l = s = f.canvas.height / 2; d = f; for (a = g = 0; a < e.data.length; a++) g += e.data[a].data; for (a = 0; a < e.data.length; a++) w.push({
                        data: e.data[a].data,
                        size: 360 * (e.data[a].data / g)
                    })
                } A = y = 1; z = window.setInterval(m, b.series.spiral.delay)
            } function m() {
                var g, e, m, p; d.clearRect(0, 0, d.canvas.width, d.canvas.height); 0 === b.series.spiral.rotations ? (v = 0, m = b.series.spiral.steps) : (v = 360 * y / b.series.spiral.steps, m = b.series.spiral.steps * b.series.spiral.rotations); for (var q = 0; q < w.length; q++) e = (A - 1) * b.series.spiral.steps + y, g = e / m * n, e = e / m * w[q].size, p = t({ ctx: d, serie: c, dataIndex: q, colors: h, radius: g, left: l, top: s }), k(d, v, v + e, g, p), v += e; y++; y > b.series.spiral.steps && (y = 1, A++,
                A > b.series.spiral.rotations && (window.clearInterval(z), c.nearBy.findItem = a, c.nearBy.drawHover = f))
            } function k(a, b, c, d, h) { b = 2 * Math.PI * v / 360; c = 2 * Math.PI * c / 360; var g = l + Math.round(Math.cos(b) * d), f = s + Math.round(Math.sin(b) * d); a.strokeStyle = h; a.fillStyle = h; a.beginPath(); a.moveTo(l, s); a.lineTo(g, f); a.arc(l, s, d, b, c); a.lineTo(l, s); a.closePath(); a.fill() } function a(a, b, c, h) {
                a: {
                    h = null; var g; for (g = v = 0; g < w.length; g++) {
                        d.save(); d.beginPath(); var f = 2 * Math.PI * v / 360, e = 2 * Math.PI * (v + w[g].size) / 360, k = l + Math.round(Math.cos(f) *
                        n), m = s + Math.round(Math.sin(f) * n); d.moveTo(l, s); d.lineTo(k, m); d.arc(l, s, n, f, e); d.closePath(); if (d.isPointInPath(a, b)) { h = [c, g]; d.restore(); a = h; break a } v += w[g].size
                    } a = h
                } return a
            } function f(a, b, c) { for (var d = v = 0; d < c; d++) v += w[d].size; k(a, v, v + w[c].size, n, "rgba(255,255,255," + b.spiral.highlight.opacity + ")") } var b = null, c = null, d, h, g, n, l, s, y, A, w = [], z, v; p.hooks.processOptions.push(function (a, c) { !0 === c.series.spiral.active && (e.extend(!0, c, u), e.plot.JUMlib.data.extendEmpty(c, x), b = c, a.hooks.drawSeries.push(q)) })
        },
        options: { series: { spiral: { active: !1, show: !1, spiralSize: 0.8, rotations: 3, steps: 36, delay: 50, highlight: { opacity: 0.5 } } } }, name: "spiral", version: "0.3"
    })
})(jQuery); (function (e) {
    var x = { series: { nearBy: { distance: 6, findItemDefault: null, findMode: "circle", drawHover: null } } }; e.plot.plugins.push({
        init: function (u) {
            function r(a, c, d, h) { !0 === c.heatmap.show && (c.nearBy.findItemDefault = c.nearBy.findItem, c.nearBy.findItem = q, (new Image).src = m.series.heatmap.backImage) } function t(a, c) { var d; m.series.heatmap.backImage && (d = m.series.heatmap.backImage, k = a.getPlotOffset(), c.save(), c.translate(k.left, k.top), c.drawImage(d, 0, 0, a.width(), a.height()), c.restore()) } function p(b, c, d) {
                a = document.createElement("canvas");
                a.style.top = "0px"; a.style.left = "0px"; a.style.position = "absolute"; a.height = c.canvas.height; a.width = c.canvas.width; f = a.getContext("2d"); k = b.getPlotOffset(); for (var h = d.data.length - 1; 0 <= h; h--) {
                    var g = d.data[h], e = c, l = f, s = d.xaxis.p2c(g[0]), p = d.yaxis.p2c(g[1]), g = g[2], q = d.heatmap.radiusOut, r = l.createRadialGradient(s, p, d.heatmap.radiusIn, s, p, q), s = s - q, t = p - q, p = 2 * q; r.addColorStop(0, "rgba(0,0,0," + (g ? g / d.heatmap.max : "0.1") + ")"); r.addColorStop(1, "rgba(0,0,0,0)"); l.fillStyle = r; l.fillRect(s, t, p, p); p = s; q = t; g = k; r = b.width();
                    t = b.heigth; s = 2 * d.heatmap.radiusOut; p + s > r && (p = r - s); 0 > p && (p = 0); 0 > q && (q = 0); q + s > t && (q = t - s); for (var l = l.getImageData(p, q, s, s).data, r = l.length, p = p + g.left, q = q + g.top, s = e.getImageData(p, q, s, s), t = s.data, v = m.series.heatmap.gradient, u = m.series.heatmap.opacity, x = 3; x < r; x += 4) { var E = l[x]; if (g = 4 * E) t[x - 3] = v[g], t[x - 2] = v[g + 1], t[x - 1] = v[g + 2], t[x] = E < u ? E : u } s.data = t; e.putImageData(s, p, q)
                }
            } function q(a, c, d, h) { var g = null; return g = h.nearBy.findItemDefault(a, c, d, h) } var m = null, k = "7", a = null, f = null; u.hooks.processOptions.push(function (a,
            c) { if (c.series.heatmap.active) { e.plot.JUMlib.data.extendEmpty(c, x); m = c; a.hooks.processRawData.push(r); a.hooks.drawBackground.push(t); a.hooks.drawSeries.push(p); var d = document.createElement("canvas"); d.width = "1"; d.height = "256"; var h = d.getContext("2d"), g = h.createLinearGradient(0, 0, 1, 256), f = m.series.heatmap.gradient, l; for (l in f) g.addColorStop(l, f[l]); h.fillStyle = g; h.fillRect(0, 0, 1, 256); m.series.heatmap.gradient = h.getImageData(0, 0, 1, 256).data; delete d; delete g; delete h } })
        }, options: {
            series: {
                heatmap: {
                    active: !1,
                    show: !1, backImage: null, radiusIn: 10, radiusOut: 20, visible: !0, width: 0, height: 0, max: !1, gradient: { "0.45": "rgb(0,0,255)", "0.55": "rgb(0,255,255)", "0.65": "rgb(0,255,0)", "0.95": "yellow", 1: "rgb(255,0,0)" }, opacity: 180, highlight: { opacity: 0.5 }
                }
            }
        }, name: "heatmap", version: "0.3"
    })
})(jQuery); (function (e) {
    e.plot.plugins.push({
        init: function (e, u) {
            function r(e, a) { m = a; p = e.getOptions(); e.getPlotOffset() } function t(e, a) {
                function f() {
                    function a() { var h; f[e] = b; if (0 === b) m.putImageData(d.getImageData(0, 0, d.canvas.width, d.canvas.height), 0, 0), window.clearInterval(q); else if (h = Pixastic.process(d.canvas, p.animate.pixastic.mode, f).getContext("2d"), m.putImageData(h.getImageData(0, 0, h.canvas.width, h.canvas.height), 0, 0), b -= c, 0 < c && 0 >= b || 0 > c && 0 <= b) b = 0 } var b, c, f = {}, e, k = new Date; switch (p.animate.pixastic.mode) {
                        case "blurfast": b =
                        2.5 * Math.abs(p.animate.pixastic.maxValue); e = "amount"; f = { amount: 2.5 }; break; case "lighten": b = Math.min(1, Math.max(-1, p.animate.pixastic.maxValue)); e = "amount"; f = { amount: 1 }; break; case "emboss": b = 10 * Math.abs(p.animate.pixastic.maxValue); e = "strength"; f = { greyLevel: 127, direction: "topleft", blend: !0 }; break; case "mosaic": b = parseInt(100 * Math.abs(p.animate.pixastic.maxValue)); e = "blockSize"; f = { blockSize: 100 }; break; case "noise": b = Math.abs(p.animate.pixastic.maxValue); e = "strength"; f = { mono: !0, amount: 1, strength: 0.5 };
                            break; default: b = Math.min(1, Math.max(-1, p.animate.pixastic.maxValue))
                    } c = b / p.animate.steps; a(); q = window.setInterval(a, p.animate.stepDelay - (new Date - k))
                } function b(a) {
                    function b() {
                        m.putImageData(d.getImageData(c * k, f * r, k, r), c * k, f * r); switch (a.mode) {
                            case "lt": c++ >= a.x && (c = 0, f++ >= a.y && window.clearInterval(q)); break; case "tl": f++ >= a.y && (f = 0, c++ >= a.x && window.clearInterval(q)); break; case "rb": 0 > c-- && (c = a.x - 1, 0 > f-- && window.clearInterval(q)); break; case "br": 0 > f-- && (f = a.y - 1, 0 > c-- && window.clearInterval(q)); break;
                            case "random": if (0 === e.length) window.clearInterval(q); else { var g = parseInt(Math.random() * e.length); c = e[g][0]; f = e[g][1]; e.splice(g, 1) }
                        }
                    } var c, f, e = [], k = m.canvas.width / a.x, r = m.canvas.height / a.y, t = new Date, u = p.animate.stepDelay; switch (a.mode) { case "lt": f = c = 0; break; case "tl": f = c = 0; break; case "rb": c = a.x - 1; f = a.y - 1; break; case "br": c = a.x - 1; f = a.y - 1; break; case "random": for (var v = 0; v < a.x; v++) for (var x = 0; x < a.y; x++) e.push([v, x]); v = parseInt(Math.random() * e.length); c = e[v][0]; f = e[v][1]; e.splice(v, 1) } b(); u -= new Date -
                    t; q = window.setInterval(b, u)
                } function c(a) {
                    function b(a) { for (var c = 0, d = 0, f = [], g; c < a.length;) { for (d = 0; d < a.length - c - 1;) a[d] > a[d + 1] && (g = a[d], a[d] = a[d + 1], a[d + 1] = g, f.push([d, d + 1])), ++d; ++c } return f } function c(a) { function b(a, c, f) { var g; if (1 < a.length) { g = a[Math.floor((f + c) / 2)]; for (var e = c, h = f, k; e <= h;) { for (; a[e] < g;) e++; for (; a[h] > g;) h--; e <= h && (k = a[e], a[e] = a[h], a[h] = k, d.push([e, h]), e++, h--) } g = e; c < g - 1 && b(a, c, g - 1); g < f && b(a, g, f) } return a } var d = []; b(a, 0, a.length - 1); return d } function f(a) {
                        var b = a.length, c, d, g = [];
                        for (D = 0; D < b; D++) { c = D; for (d = D + 1; d < b; d++) a[d] < a[c] && (c = d); D != c && (d = a[D], a[D] = a[c], a[c] = d, g.push([D, c])) } return g
                    } function e() { var b, c, d, g, f, k; 0 === t.length ? window.clearInterval(q) : (g = Math.floor(t[0][0] / a.x), d = t[0][0] - g * a.x, k = Math.floor(t[0][1] / a.x), f = t[0][1] - k * a.x, t.splice(0, 1), b = m.getImageData(d * v, g * x, v, x), c = m.getImageData(f * v, k * x, v, x), m.putImageData(c, d * v, g * x), m.putImageData(b, f * v, k * x)) } for (var k = [], r = [], t = [], u = a.x * a.y, v = m.canvas.width / a.x, x = m.canvas.height / a.y, C = p.animate.stepDelay, E = new Date, D = 0; D <
                    u; D++) k.push(D); for (D = u - 1; 0 <= D; D--) u = Math.floor(Math.random() * D), r.push(k[u]), k.splice(u, 1); (function (b) { for (var c, g, f, e, k = 0; k < b.length; k++) g = Math.floor(b[k] / a.x), c = b[k] - g * a.x, e = Math.floor(k / a.x), f = k - e * a.y, m.putImageData(d.getImageData(c * v, g * x, v, x), f * v, e * x) })(r); switch (a.mode) { case "bubble": t = b(r); break; case "quick": t = c(r); break; case "selection": t = f(r); break; default: t = b(r) } e(); C -= new Date - E; q = window.setInterval(e, C)
                } var d; d = document.createElement("canvas").getContext("2d"); d.canvas.width = m.canvas.width;
                d.canvas.height = m.canvas.height; d.putImageData(m.getImageData(0, 0, m.canvas.width, m.canvas.height), 0, 0); m.clearRect(0, 0, m.canvas.width, m.canvas.height); switch (p.animate.mode) { case "tile": b(p.animate.tile); break; case "pixastic": f(p.animate.pixastic); break; case "sorting": c(p.animate.sorting); break; default: m.putImageData(d.getImageData(0, 0, d.canvas.width, d.canvas.height), 0, 0) }
            } var p, q, m; e.hooks.processOptions.push(function (e, a) {
                !0 === a.animate.active && (e.hooks.draw.push(r), e.hooks.bindEvents.push(t), p =
                a)
            })
        }, options: { animate: { active: !1, mode: "tile", tile: { x: 3, y: 3, mode: "lt" }, pixastic: { maxValue: 1, mode: "blurfast" }, sorting: { x: 5, y: 5, mode: "bubble" }, stepDelay: 500, steps: 20 } }, name: "animate", version: "0.2"
    })
})(jQuery); (function (e) {
    var x = { grid: { show: !1 } }, u = {}; e.plot.plugins.push({
        init: function (r, t) {
            function p(b, d) { var e, m; if (!0 === f.series.video.active && !1 === c) { a = b.getData(); for (e = 0; e < a.length; e++) if (!0 === a[e].video.show) for (h = Math.max(h, a[e].data.length), a[e].dataOrg = k(a[e].data), m = 0; m < a[e].data.length; m++) a[e].data[m] = null; b.setData(a); c = !0 } } function q(a, c) { !0 === f.series.video.active && (b = a, window.setTimeout(m, 0)) } function m() {
                function c(b) {
                    p = { seriesIndex: f, dataIndex: d, data: a[f].data[d], serie: a[f] }; "string" === typeof b.stepAction ?
                    k.push(b.stepCollection[b.stepAction].runStep(p, b.stepCollection[b.stepAction])) : "object" === typeof b.stepAction && k.push(b.stepAction.runStep(p, b.stepAction))
                } var f, k = [], p, q; for (f = 0; f < a.length; f++) !0 === a[f].video.show && (a[f].data[d] = a[f].dataOrg[d], b.setData(a), b.draw(), q = a[f].video, "byStep" === q.stepAction ? c(q.data[f].data[f][q.stepCollection.byStep.stepDataIndex]) : c(q.stepAction)); d++; d < h && e.when.apply(null, k).then(function () { m() })
            } function k(a) {
                if (null === a || "object" !== typeof a) return a; var b = new a.constructor,
                c; for (c in a) b[c] = k(a[c]); return b
            } var a = null, f = null, b = null, c = !1, d = 0, h = 0; r.hooks.processOptions.push(function (a, b) { b.series.video.active && (f = b, e.extend(!0, b, x), e.plot.JUMlib.data.extendEmpty(b, u), f = b, a.hooks.draw.push(p), a.hooks.bindEvents.push(q)) })
        }, options: {
            series: {
                video: {
                    active: !1, show: !1, stepAction: "simple", stepCollection: {
                        simple: {
                            runStep: function (r, t) {
                                var p; if (t.walkPad) return p = e.Deferred(), e(t.walkPad).append("<br>" + r.data[2]), window.setTimeout(function () { p.resolve() }, t.walkTime), p.promise();
                                alert(r.data[2])
                            }, walkPad: "#stepPad", walkTime: 2E3
                        }, youtube: {
                            runStep: function (r, t) {
                                function p() { jQuery(t.videoPad).tubeplayer("destroy"); q.resolve() } var q; if (t.videoPad) return q = e.Deferred(), 3 < r.data.length ? "string" === typeof r.data[3] && (jQuery.tubeplayer.defaults.afterReady = function () { jQuery(t.videoPad).tubeplayer("play") }, jQuery(t.videoPad).tubeplayer({ width: t.width, height: t.height, initialVideo: r.data[3], onPlayerEnded: p, onStop: p }), jQuery(t.videoPad).tubeplayer("play"), window.setTimeout(function () { p() },
                                t.maxDuration)) : window.setTimeout(function () { q.resolve() }, t.noVideoDuration), q.promise(); alert("no videoPad defined")
                            }, videoPad: "#videoPad", width: 400, height: 300, maxDuration: 2E4, noVideoDuration: 2E3
                        }, delay: { runStep: function (e, t) { var p; p = $Deferred(); window.setTimeout(function () { p.resolve() }, t.duration); return p.promise() }, duration: 1E3 }, byStep: { stepDataIndex: 2 }
                    }
                }
            }
        }, name: "video", version: "0.2"
    })
})(jQuery); (function (e) {
    var x = {}, u = { series: { editMode: "xy", nearBy: { distance: 7, findItem: null, findMode: "circle", drawHover: null } } }; e.plot.plugins.push({
        init: function (r) {
            function t(b, d, f, e) { !0 === d.contour.show && (d.nearBy.findItem = k, d.nearBy.drawHover = a) } function p(a, b, e) { if (e.contour.show) for (f = a.getPlotOffset(), a = 0; a < e.data.length; a++) m(b, e, a, e.color) } function q(a, d) {
                var h = b.grid.overlay.image, g = '<div style="position:absolute;width:' + a.width() + ";height:" + a.height() + ";top:" + f.top + ";left:" + f.left + ';">', g = e(g); e(h).css("opacity",
                b.grid.overlay.opacity).width(a.width()).height(a.height()); e(h).css("top", f.top).css("position", "absolute").css("left", f.left); e(h).appendTo(g); g.appendTo(a.getPlaceholder())
            } function m(a, b, e, g) {
                var k = b.data[e]; e = parseInt(f.left + b.xaxis.p2c(k[0]), 0); var l = parseInt(f.top + b.yaxis.p2c(k[1]), 0), m = parseInt(b.xaxis.scale * k[2], 0), p = parseInt(b.yaxis.scale * k[3], 0), k = k[4], q, r; b = b.contour.ellipseStep; m /= 2; r = p / 2; p = e + m * Math.cos(k); q = l + m * Math.sin(k); a.save(); a.beginPath(); a.fillStyle = g; a.moveTo(p, q); for (g = b; g <
                2 * Math.PI; g += b) p = e + m * Math.cos(g) * Math.cos(k) - r * Math.sin(g) * Math.sin(k), q = l + m * Math.cos(g) * Math.sin(k) + r * Math.sin(g) * Math.cos(k), a.lineTo(p, q); a.closePath(); a.fill(); a.restore()
            } function k(a, d, e, f) {
                function k(a, c, d, e) { a = null; return a = [d, b.series.justEditing[1].dataIndex] } function l(a, b, c, d) { if (d.contour.show) for (a = 0; a < d.data.length; a++); return null } function m(a, b, c, d) { if (d.contour.show) for (a = 0; a < d.data.length; a++); return null } var p = null; b.series.justEditing ? b.series.justEditing[1].seriesIndex === e &&
                (p = k(a, d, e, f)) : p = b.grid.editable ? l(a, d, e, f) : m(a, d, e, f); return p
            } function a(a, b, e) { a.save(); a.translate(-f.left, -f.top); m(a, b, e, "rgba(255,255,255," + b.bandwidth.highlight.opacity + ")"); a.restore() } var f = null, b = null; r.hooks.processOptions.push(function (a, d) { d.series.contour.active && (e.extend(!0, d, x), e.plot.JUMlib.data.extendEmpty(d, u), b = d, a.hooks.processRawData.push(t), a.hooks.drawSeries.push(p), b.grid.overlay.image && a.hooks.draw.push(q)) })
        }, options: {
            series: { contour: { active: !1, show: !1, ellipseStep: 0.1 } },
            grid: { overlay: { image: null, opacity: 0.2 } }
        }, name: "contour", version: "0.1"
    })
})(jQuery);