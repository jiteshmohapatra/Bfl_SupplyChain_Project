// Knockout JavaScript library v2.2.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function () {
  function i(v) { throw v; } const l = !0; const n = null; const q = !1; function t(v) { return function () { return v; }; } const w = window; const x = document; const fa = navigator; const E = window.jQuery; const H = void 0;
  function K(v) {
    function ga(a, d, c, e, f) { const g = []; var a = b.j(() => { const a = d(c, f) || []; g.length > 0 && (b.a.Xa(L(g), a), e && b.r.K(e, n, [c, a, f])); g.splice(0, g.length); b.a.P(g, a); }, n, { W: a, Ja() { return g.length == 0 || !b.a.X(g[0]); } }); return { M: g, j: a.oa() ? a : H }; } function L(a) { for (;a.length && !b.a.X(a[0]);)a.splice(0, 1); if (a.length > 1) { for (var d = a[0], c = a[a.length - 1], e = [d]; d !== c;) { d = d.nextSibling; if (!d) return; e.push(d); }Array.prototype.splice.apply(a, [0, a.length].concat(e)); } return a; } function R(a, b, c, e, f) {
      let g = Math.min;
      let h = Math.max; let j = []; let k; const m = a.length; let p; let r = b.length; let u = r - m || 1; const F = m + r + 1; let I; let z; let y; for (k = 0; k <= m; k++) { z = I; j.push(I = []); y = g(r, k + u); for (p = h(0, k - 1); p <= y; p++)I[p] = p ? k ? a[k - 1] === b[p - 1] ? z[p - 1] : g(z[p] || F, I[p - 1] || F) + 1 : p + 1 : k + 1; }g = []; h = []; u = []; k = m; for (p = r; k || p;)r = j[k][p] - 1, p && r === j[k][p - 1] ? h.push(g[g.length] = { status: c, value: b[--p], index: p }) : k && r === j[k - 1][p] ? u.push(g[g.length] = { status: e, value: a[--k], index: k }) : (g.push({ status: 'retained', value: b[--p] }), --k); if (h.length && u.length) {
        for (var a = 10 * m, s, b = c = 0; (f || b < a) && (s = h[c]); c++) {
          for (e = 0; j = u[e]; e++) if (s.value === j.value) { s.moved = j.index; j.moved = s.index; u.splice(e, 1); b = e = 0; break; }b += e;
        }
      } return g.reverse();
    } function S(a, d, c, e, f) {
      var f = f || {}; var g = a && M(a); var g = g && g.ownerDocument; const h = f.templateEngine || N; b.ya.ub(c, h, g); c = h.renderTemplate(c, e, f, g); (typeof c.length !== 'number' || c.length > 0 && typeof c[0].nodeType !== 'number') && i(Error('Template engine must return an array of DOM nodes')); g = q; switch (d) {
        case 'replaceChildren': b.e.N(a, c); g = l; break; case 'replaceNode': b.a.Xa(a, c); g = l; break; case 'ignoreTargetNode': break;
        default: i(Error(`Unknown renderMode: ${d}`));
      }g && (T(c, e), f.afterRender && b.r.K(f.afterRender, n, [c, e.$data])); return c;
    } function M(a) { return a.nodeType ? a : a.length > 0 ? a[0] : n; } function T(a, d) { if (a.length) { const c = a[0]; const e = a[a.length - 1]; U(c, e, (a) => { b.Ca(d, a); }); U(c, e, (a) => { b.s.hb(a, [d]); }); } } function U(a, d, c) { for (var e, d = b.e.nextSibling(d); a && (e = a) !== d;)a = b.e.nextSibling(e), (e.nodeType === 1 || e.nodeType === 8) && c(e); } function V(a, d, c) {
      for (var a = b.g.aa(a), e = b.g.Q, f = 0; f < a.length; f++) {
        let g = a[f].key; if (e.hasOwnProperty(g)) {
          const h = e[g]; typeof h === 'function' ? (g = h(a[f].value)) && i(Error(g)) : h || i(Error(`This template engine does not support the '${g}' binding within its templates`));
        }
      }a = `ko.__tr_ambtns(function($context,$element){return(function(){return{ ${b.g.ba(a)} } })()})`; return c.createJavaScriptEvaluatorBlock(a) + d;
    } function W(a, d, c, e) {
      function f(a) { return function () { return j[a]; }; } function g() { return j; } let h = 0; let j; let k; b.j(() => {
        const m = c && c instanceof b.z ? c : new b.z(b.a.d(c)); const p = m.$data; e && b.cb(a, m); if (j = (typeof d === 'function'
          ? d(m, a) : d) || b.J.instance.getBindings(a, m)) {
          if (h === 0) { h = 1; for (var r in j) { var u = b.c[r]; u && a.nodeType === 8 && !b.e.I[r] && i(Error(`The binding '${r}' cannot be used with virtual elements`)); if (u && typeof u.init === 'function' && (u = (0, u.init)(a, f(r), g, p, m)) && u.controlsDescendantBindings)k !== H && i(Error(`Multiple bindings (${k} and ${r}) are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.`)), k = r; }h = 2; } if (h === 2) {
            for (r in j) {
              (u = b.c[r]) && typeof u.update
=== 'function' && (0, u.update)(a, f(r), g, p, m);
            }
          }
        }
      }, n, { W: a }); return { Mb: k === H };
    } function X(a, d, c) { let e = l; const f = d.nodeType === 1; f && b.e.Sa(d); if (f && c || b.J.instance.nodeHasBindings(d))e = W(d, n, a, c).Mb; e && Y(a, d, !f); } function Y(a, d, c) { for (let e = b.e.firstChild(d); d = e;)e = b.e.nextSibling(d), X(a, d, c); } function Z(a, b) { const c = $(a, b); return c ? c.length > 0 ? c[c.length - 1].nextSibling : a.nextSibling : n; } function $(a, b) {
      for (let c = a, e = 1, f = []; c = c.nextSibling;) { if (G(c) && (e--, e === 0)) return f; f.push(c); A(c) && e++; }b || i(Error(`Cannot find closing comment tag to match: ${
        a.nodeValue}`)); return n;
    } function G(a) { return a.nodeType == 8 && (J ? a.text : a.nodeValue).match(ha); } function A(a) { return a.nodeType == 8 && (J ? a.text : a.nodeValue).match(ia); } function O(a, b) { for (let c = n; a != c;)c = a, a = a.replace(ja, (a, c) => b[c]); return a; } function ka() { const a = []; const d = []; this.save = function (c, e) { const f = b.a.i(a, c); f >= 0 ? d[f] = e : (a.push(c), d.push(e)); }; this.get = function (c) { c = b.a.i(a, c); return c >= 0 ? d[c] : H; }; } function aa(a, b, c) {
      function e(e) {
        const g = b(a[e]); switch (typeof g) {
          case 'boolean': case 'number': case 'string': case 'function': f[e] = g; break; case 'object': case 'undefined': var h = c.get(g); f[e] = h !== H ? h : aa(g, b, c);
        }
      }c = c || new ka(); a = b(a); if (!(typeof a === 'object' && a !== n && a !== H && !(a instanceof Date))) return a; var f = a instanceof Array ? [] : {}; c.save(a, f); const g = a; if (g instanceof Array) { for (var h = 0; h < g.length; h++)e(h); typeof g.toJSON === 'function' && e('toJSON'); } else for (h in g)e(h); return f;
    } function ba(a, d) {
      if (a) {
        if (a.nodeType == 8) { var c = b.s.Ta(a.nodeValue); c != n && d.push({ rb: a, Eb: c }); } else if (a.nodeType == 1) {
          for (var c = 0, e = a.childNodes, f = e.length; c < f; c++) {
            ba(e[c],
              d);
          }
        }
      }
    } function P(a, d, c, e) { b.c[a] = { init(a) { b.a.f.set(a, ca, {}); return { controlsDescendantBindings: l }; }, update(a, g, h, j, k) { var h = b.a.f.get(a, ca); var g = b.a.d(g()); var j = !c !== !g; const m = !h.Ya; if (m || d || j !== h.pb)m && (h.Ya = b.a.Ha(b.e.childNodes(a), l)), j ? (m || b.e.N(a, b.a.Ha(h.Ya)), b.Da(e ? e(k, g) : k, a)) : b.e.Y(a), h.pb = j; } }; b.g.Q[a] = q; b.e.I[a] = l; } function da(a, d, c) { c && d !== b.k.q(a) && b.k.T(a, d); d !== b.k.q(a) && b.r.K(b.a.Aa, n, [a, 'change']); } var b = typeof v !== 'undefined' ? v : {}; b.b = function (a, d) {
      for (var c = a.split('.'), e = b, f = 0; f
< c.length - 1; f++)e = e[c[f]]; e[c[c.length - 1]] = d;
    }; b.p = function (a, b, c) { a[b] = c; }; b.version = '2.2.0'; b.b('version', b.version); b.a = new function () {
      function a(a, d) { if (b.a.u(a) !== 'input' || !a.type || d.toLowerCase() != 'click') return q; const c = a.type; return c == 'checkbox' || c == 'radio'; } const d = /^(\s|\u00A0)+|(\s|\u00A0)+$/g; var c = {}; const e = {}; c[/Firefox\/2/i.test(fa.userAgent) ? 'KeyboardEvent' : 'UIEvents'] = ['keyup', 'keydown', 'keypress']; c.MouseEvents = 'click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave'.split(' ');
      for (var f in c) { var g = c[f]; if (g.length) for (let h = 0, j = g.length; h < j; h++)e[g[h]] = f; } const k = { propertychange: l }; let m; var c = 3; f = x.createElement('div'); for (g = f.getElementsByTagName('i'); f.innerHTML = `<\!--[if gt IE ${++c}]><i></i><![endif]--\>`, g[0];);m = c > 4 ? c : H; return {
        Ma: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],
        o(a, b) { for (let d = 0, c = a.length; d < c; d++)b(a[d]); },
        i(a, b) {
          if (typeof Array.prototype.indexOf === 'function') return Array.prototype.indexOf.call(a, b); for (let d = 0, c = a.length; d
< c; d++) if (a[d] === b) return d; return -1;
        },
        kb(a, b, d) { for (let c = 0, e = a.length; c < e; c++) if (b.call(d, a[c])) return a[c]; return n; },
        ga(a, d) { const c = b.a.i(a, d); c >= 0 && a.splice(c, 1); },
        Fa(a) { for (var a = a || [], d = [], c = 0, e = a.length; c < e; c++)b.a.i(d, a[c]) < 0 && d.push(a[c]); return d; },
        V(a, b) { for (var a = a || [], d = [], c = 0, e = a.length; c < e; c++)d.push(b(a[c])); return d; },
        fa(a, b) { for (var a = a || [], d = [], c = 0, e = a.length; c < e; c++)b(a[c]) && d.push(a[c]); return d; },
        P(a, b) {
          if (b instanceof Array) {
            a.push.apply(a,
              b);
          } else for (let d = 0, c = b.length; d < c; d++)a.push(b[d]); return a;
        },
        extend(a, b) { if (b) for (const d in b)b.hasOwnProperty(d) && (a[d] = b[d]); return a; },
        ka(a) { for (;a.firstChild;)b.removeNode(a.firstChild); },
        Gb(a) { for (var a = b.a.L(a), d = x.createElement('div'), c = 0, e = a.length; c < e; c++)d.appendChild(b.A(a[c])); return d; },
        Ha(a, d) { for (var c = 0, e = a.length, g = []; c < e; c++) { const f = a[c].cloneNode(l); g.push(d ? b.A(f) : f); } return g; },
        N(a, d) { b.a.ka(a); if (d) for (let c = 0, e = d.length; c < e; c++)a.appendChild(d[c]); },
        Xa(a, d) { const c = a.nodeType ? [a] : a; if (c.length > 0) { for (var e = c[0], g = e.parentNode, f = 0, h = d.length; f < h; f++)g.insertBefore(d[f], e); f = 0; for (h = c.length; f < h; f++)b.removeNode(c[f]); } },
        ab(a, b) { m < 7 ? a.setAttribute('selected', b) : a.selected = b; },
        D(a) { return (a || '').replace(d, ''); },
        Qb(a, d) { for (var c = [], e = (a || '').split(d), f = 0, g = e.length; f < g; f++) { const h = b.a.D(e[f]); h !== '' && c.push(h); } return c; },
        Nb(a, b) { a = a || ''; return b.length > a.length ? q : a.substring(0, b.length) === b; },
        sb(a, b) {
          if (b.compareDocumentPosition) {
            return (b.compareDocumentPosition(a) & 16)
== 16;
          } for (;a != n;) { if (a == b) return l; a = a.parentNode; } return q;
        },
        X(a) { return b.a.sb(a, a.ownerDocument); },
        u(a) { return a && a.tagName && a.tagName.toLowerCase(); },
        n(b, d, c) {
          const e = m && k[d]; if (!e && typeof E !== 'undefined') { if (a(b, d)) var f = c; var c = function (a, b) { const d = this.checked; b && (this.checked = b.mb !== l); f.call(this, a); this.checked = d; }; E(b).bind(d, c); } else {
            !e && typeof b.addEventListener === 'function' ? b.addEventListener(d, c, q) : typeof b.attachEvent !== 'undefined' ? b.attachEvent(`on${
              d}`, (a) => { c.call(b, a); }) : i(Error("Browser doesn't support addEventListener or attachEvent"));
          }
        },
        Aa(b, d) {
          (!b || !b.nodeType) && i(Error('element must be a DOM node when calling triggerEvent')); if (typeof E !== 'undefined') { var c = []; a(b, d) && c.push({ mb: b.checked }); E(b).trigger(d, c); } else {
            typeof x.createEvent === 'function' ? typeof b.dispatchEvent === 'function' ? (c = x.createEvent(e[d] || 'HTMLEvents'), c.initEvent(d, l, l, w, 0, 0, 0, 0, 0, q, q, q, q, 0, b), b.dispatchEvent(c)) : i(Error("The supplied element doesn't support dispatchEvent"))
              : typeof b.fireEvent !== 'undefined' ? (a(b, d) && (b.checked = b.checked !== l), b.fireEvent(`on${d}`)) : i(Error("Browser doesn't support triggering events"));
          }
        },
        d(a) { return b.$(a) ? a() : a; },
        ta(a) { return b.$(a) ? a.t() : a; },
        da(a, d, c) { if (d) { const e = /[\w-]+/g; const f = a.className.match(e) || []; b.a.o(d.match(e), (a) => { const d = b.a.i(f, a); d >= 0 ? c || f.splice(d, 1) : c && f.push(a); }); a.className = f.join(' '); } },
        bb(a, d) {
          let c = b.a.d(d); if (c === n || c === H)c = ''; if (a.nodeType === 3)a.data = c; else {
            const e = b.e.firstChild(a);
            !e || e.nodeType != 3 || b.e.nextSibling(e) ? b.e.N(a, [x.createTextNode(c)]) : e.data = c; b.a.vb(a);
          }
        },
        $a(a, b) { a.name = b; if (m <= 7) try { a.mergeAttributes(x.createElement(`<input name='${a.name}'/>`), q); } catch (d) {} },
        vb(a) { m >= 9 && (a = a.nodeType == 1 ? a : a.parentNode, a.style && (a.style.zoom = a.style.zoom)); },
        tb(a) { if (m >= 9) { const b = a.style.width; a.style.width = 0; a.style.width = b; } },
        Kb(a, d) { for (var a = b.a.d(a), d = b.a.d(d), c = [], e = a; e <= d; e++)c.push(e); return c; },
        L(a) {
          for (var b = [], d = 0, c = a.length; d
< c; d++)b.push(a[d]); return b;
        },
        Ob: m === 6,
        Pb: m === 7,
        Z: m,
        Na(a, d) { for (var c = b.a.L(a.getElementsByTagName('input')).concat(b.a.L(a.getElementsByTagName('textarea'))), e = typeof d === 'string' ? function (a) { return a.name === d; } : function (a) { return d.test(a.name); }, f = [], g = c.length - 1; g >= 0; g--)e(c[g]) && f.push(c[g]); return f; },
        Hb(a) { return typeof a === 'string' && (a = b.a.D(a)) ? w.JSON && w.JSON.parse ? w.JSON.parse(a) : (new Function(`return ${a}`))() : n; },
        wa(a, d, c) {
          (typeof JSON === 'undefined' || typeof JSON.stringify === 'undefined')
&& i(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js")); return JSON.stringify(b.a.d(a), d, c);
        },
        Ib(a, d, c) {
          var c = c || {}; const e = c.params || {}; const f = c.includeFields || this.Ma; var g = a; if (typeof a === 'object' && b.a.u(a) === 'form') for (var g = a.action, h = f.length - 1; h >= 0; h--) for (let j = b.a.Na(a, f[h]), k = j.length - 1; k >= 0; k--)e[j[k].name] = j[k].value; var d = b.a.d(d); const m = x.createElement('form');
          m.style.display = 'none'; m.action = g; m.method = 'post'; for (var v in d)a = x.createElement('input'), a.name = v, a.value = b.a.wa(b.a.d(d[v])), m.appendChild(a); for (v in e)a = x.createElement('input'), a.name = v, a.value = e[v], m.appendChild(a); x.body.appendChild(m); c.submitter ? c.submitter(m) : m.submit(); setTimeout(() => { m.parentNode.removeChild(m); }, 0);
        },
      };
    }(); b.b('utils', b.a); b.b('utils.arrayForEach', b.a.o); b.b('utils.arrayFirst', b.a.kb); b.b('utils.arrayFilter', b.a.fa); b.b('utils.arrayGetDistinctValues', b.a.Fa); b.b('utils.arrayIndexOf',
      b.a.i); b.b('utils.arrayMap', b.a.V); b.b('utils.arrayPushAll', b.a.P); b.b('utils.arrayRemoveItem', b.a.ga); b.b('utils.extend', b.a.extend); b.b('utils.fieldsIncludedWithJsonPost', b.a.Ma); b.b('utils.getFormFields', b.a.Na); b.b('utils.peekObservable', b.a.ta); b.b('utils.postJson', b.a.Ib); b.b('utils.parseJson', b.a.Hb); b.b('utils.registerEventHandler', b.a.n); b.b('utils.stringifyJson', b.a.wa); b.b('utils.range', b.a.Kb); b.b('utils.toggleDomNodeCssClass', b.a.da); b.b('utils.triggerEvent', b.a.Aa); b.b('utils.unwrapObservable',
      b.a.d); Function.prototype.bind || (Function.prototype.bind = function (a) { const b = this; const c = Array.prototype.slice.call(arguments); var a = c.shift(); return function () { return b.apply(a, c.concat(Array.prototype.slice.call(arguments))); }; }); b.a.f = new function () {
      let a = 0; const d = `__ko__${(new Date()).getTime()}`; const c = {}; return {
        get(a, d) { const c = b.a.f.getAll(a, q); return c === H ? H : c[d]; },
        set(a, d, c) { c === H && b.a.f.getAll(a, q) === H || (b.a.f.getAll(a, l)[d] = c); },
        getAll(b, f) {
          let g = b[d]; if (!g || !(g !== 'null' && c[g])) {
            if (!f) return H;
            g = b[d] = `ko${a++}`; c[g] = {};
          } return c[g];
        },
        clear(a) { const b = a[d]; return b ? (delete c[b], a[d] = n, l) : q; },
      };
    }(); b.b('utils.domData', b.a.f); b.b('utils.domData.clear', b.a.f.clear); b.a.F = new function () {
      function a(a, d) { let e = b.a.f.get(a, c); e === H && d && (e = [], b.a.f.set(a, c, e)); return e; } function d(c) {
        var e = a(c, q); if (e) for (var e = e.slice(0), j = 0; j < e.length; j++)e[j](c); b.a.f.clear(c); typeof E === 'function' && typeof E.cleanData === 'function' && E.cleanData([c]); if (f[c.nodeType]) {
          for (e = c.firstChild; c = e;) {
            e = c.nextSibling, c.nodeType === 8
&& d(c);
          }
        }
      } var c = `__ko_domNodeDisposal__${(new Date()).getTime()}`; const e = { 1: l, 8: l, 9: l }; var f = { 1: l, 9: l }; return {
        Ba(b, d) { typeof d !== 'function' && i(Error('Callback must be a function')); a(b, l).push(d); }, Wa(d, e) { const f = a(d, q); f && (b.a.ga(f, e), f.length == 0 && b.a.f.set(d, c, H)); }, A(a) { if (e[a.nodeType] && (d(a), f[a.nodeType])) { const c = []; b.a.P(c, a.getElementsByTagName('*')); for (let j = 0, k = c.length; j < k; j++)d(c[j]); } return a; }, removeNode(a) { b.A(a); a.parentNode && a.parentNode.removeChild(a); },
      };
    }(); b.A = b.a.F.A;
    b.removeNode = b.a.F.removeNode; b.b('cleanNode', b.A); b.b('removeNode', b.removeNode); b.b('utils.domNodeDisposal', b.a.F); b.b('utils.domNodeDisposal.addDisposeCallback', b.a.F.Ba); b.b('utils.domNodeDisposal.removeDisposeCallback', b.a.F.Wa); b.a.sa = function (a) {
      let d; if (typeof E !== 'undefined') { if ((d = E.clean([a])) && d[0]) { for (a = d[0]; a.parentNode && a.parentNode.nodeType !== 11;)a = a.parentNode; a.parentNode && a.parentNode.removeChild(a); } } else {
        let c = b.a.D(a).toLowerCase(); d = x.createElement('div'); c = c.match(/^<(thead|tbody|tfoot)/)
&& [1, '<table>', '</table>'] || !c.indexOf('<tr') && [2, '<table><tbody>', '</tbody></table>'] || (!c.indexOf('<td') || !c.indexOf('<th')) && [3, '<table><tbody><tr>', '</tr></tbody></table>'] || [0, '', '']; a = `ignored<div>${c[1]}${a}${c[2]}</div>`; for (typeof w.innerShiv === 'function' ? d.appendChild(w.innerShiv(a)) : d.innerHTML = a; c[0]--;)d = d.lastChild; d = b.a.L(d.lastChild.childNodes);
      } return d;
    }; b.a.ca = function (a, d) {
      b.a.ka(a); d = b.a.d(d); if (d !== n && d !== H) {
        if (typeof d !== 'string' && (d = d.toString()), typeof E !== 'undefined')E(a).html(d); else {
          for (let c = b.a.sa(d), e = 0; e < c.length; e++)a.appendChild(c[e]);
        }
      }
    }; b.b('utils.parseHtmlFragment', b.a.sa); b.b('utils.setHtml', b.a.ca); const Q = {}; b.s = {
      qa(a) { typeof a !== 'function' && i(Error('You can only pass a function to ko.memoization.memoize()')); const b = (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1) + (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1); Q[b] = a; return `<\!--[ko_memo:${b}]--\>`; },
      gb(a, b) {
        const c = Q[a]; c === H && i(Error(`Couldn't find any memo with ID ${a}. Perhaps it's already been unmemoized.`));
        try { return c.apply(n, b || []), l; } finally { delete Q[a]; }
      },
      hb(a, d) { const c = []; ba(a, c); for (let e = 0, f = c.length; e < f; e++) { const g = c[e].rb; const h = [g]; d && b.a.P(h, d); b.s.gb(c[e].Eb, h); g.nodeValue = ''; g.parentNode && g.parentNode.removeChild(g); } },
      Ta(a) { return (a = a.match(/^\[ko_memo\:(.*?)\]$/)) ? a[1] : n; },
    }; b.b('memoization', b.s); b.b('memoization.memoize', b.s.qa); b.b('memoization.unmemoize', b.s.gb); b.b('memoization.parseMemoText', b.s.Ta); b.b('memoization.unmemoizeDomNodeAndDescendants', b.s.hb); b.La = {
      throttle(a,
        d) { a.throttleEvaluation = d; let c = n; return b.j({ read: a, write(b) { clearTimeout(c); c = setTimeout(() => { a(b); }, d); } }); },
      notify(a, d) { a.equalityComparer = d == 'always' ? t(q) : b.m.fn.equalityComparer; return a; },
    }; b.b('extenders', b.La); b.eb = function (a, d, c) { this.target = a; this.ha = d; this.qb = c; b.p(this, 'dispose', this.B); }; b.eb.prototype.B = function () { this.Bb = l; this.qb(); }; b.S = function () {
      this.w = {}; b.a.extend(this, b.S.fn); b.p(this, 'subscribe', this.xa); b.p(this, 'extend', this.extend); b.p(this, 'getSubscriptionsCount',
        this.xb);
    }; b.S.fn = {
      xa(a, d, c) { var c = c || 'change'; var a = d ? a.bind(d) : a; var e = new b.eb(this, a, (() => { b.a.ga(this.w[c], e); })); this.w[c] || (this.w[c] = []); this.w[c].push(e); return e; },
      notifySubscribers(a, d) { d = d || 'change'; this.w[d] && b.r.K(function () { b.a.o(this.w[d].slice(0), (b) => { b && b.Bb !== l && b.ha(a); }); }, this); },
      xb() { let a = 0; let b; for (b in this.w) this.w.hasOwnProperty(b) && (a += this.w[b].length); return a; },
      extend(a) {
        let d = this; if (a) {
          for (const c in a) {
            const e = b.La[c]; typeof e
=== 'function' && (d = e(d, a[c]));
          }
        } return d;
      },
    }; b.Pa = function (a) { return typeof a.xa === 'function' && typeof a.notifySubscribers === 'function'; }; b.b('subscribable', b.S); b.b('isSubscribable', b.Pa); const B = []; b.r = {
      lb(a) { B.push({ ha: a, Ka: [] }); }, end() { B.pop(); }, Va(a) { b.Pa(a) || i(Error('Only subscribable things can act as dependencies')); if (B.length > 0) { const d = B[B.length - 1]; d && !(b.a.i(d.Ka, a) >= 0) && (d.Ka.push(a), d.ha(a)); } }, K(a, b, c) { try { return B.push(n), a.apply(b, c || []); } finally { B.pop(); } },
    }; const la = {
      undefined: l,
      boolean: l,
      number: l,
      string: l,
    }; b.m = function (a) { function d() { if (arguments.length > 0) { if (!d.equalityComparer || !d.equalityComparer(c, arguments[0]))d.H(), c = arguments[0], d.G(); return this; }b.r.Va(d); return c; } var c = a; b.S.call(d); d.t = function () { return c; }; d.G = function () { d.notifySubscribers(c); }; d.H = function () { d.notifySubscribers(c, 'beforeChange'); }; b.a.extend(d, b.m.fn); b.p(d, 'peek', d.t); b.p(d, 'valueHasMutated', d.G); b.p(d, 'valueWillMutate', d.H); return d; }; b.m.fn = {
      equalityComparer(a, b) {
        return a === n || typeof a
in la ? a === b : q;
      },
    }; const D = b.m.Jb = '__ko_proto__'; b.m.fn[D] = b.m; b.la = function (a, d) { return a === n || a === H || a[D] === H ? q : a[D] === d ? l : b.la(a[D], d); }; b.$ = function (a) { return b.la(a, b.m); }; b.Qa = function (a) { return typeof a === 'function' && a[D] === b.m || typeof a === 'function' && a[D] === b.j && a.yb ? l : q; }; b.b('observable', b.m); b.b('isObservable', b.$); b.b('isWriteableObservable', b.Qa); b.R = function (a) {
      arguments.length == 0 && (a = []); a !== n && (a !== H && !('length' in a)) && i(Error('The argument passed when initializing an observable array must be an array, or null, or undefined.'));
      const d = b.m(a); b.a.extend(d, b.R.fn); return d;
    }; b.R.fn = {
      remove(a) { for (var b = this.t(), c = [], e = typeof a === 'function' ? a : function (b) { return b === a; }, f = 0; f < b.length; f++) { const g = b[f]; e(g) && (c.length === 0 && this.H(), c.push(g), b.splice(f, 1), f--); }c.length && this.G(); return c; },
      removeAll(a) { if (a === H) { const d = this.t(); const c = d.slice(0); this.H(); d.splice(0, d.length); this.G(); return c; } return !a ? [] : this.remove((d) => b.a.i(a, d) >= 0); },
      destroy(a) {
        const b = this.t(); const c = typeof a === 'function' ? a : function (b) {
          return b
=== a;
        }; this.H(); for (let e = b.length - 1; e >= 0; e--)c(b[e]) && (b[e]._destroy = l); this.G();
      },
      destroyAll(a) { return a === H ? this.destroy(t(l)) : !a ? [] : this.destroy((d) => b.a.i(a, d) >= 0); },
      indexOf(a) { const d = this(); return b.a.i(d, a); },
      replace(a, b) { const c = this.indexOf(a); c >= 0 && (this.H(), this.t()[c] = b, this.G()); },
    }; b.a.o('pop push reverse shift sort splice unshift'.split(' '), (a) => { b.R.fn[a] = function () { let b = this.t(); this.H(); b = b[a].apply(b, arguments); this.G(); return b; }; }); b.a.o(['slice'],
      (a) => { b.R.fn[a] = function () { const b = this(); return b[a].apply(b, arguments); }; }); b.b('observableArray', b.R); b.j = function (a, d, c) {
      function e() { b.a.o(y, (a) => { a.B(); }); y = []; } function f() { const a = h.throttleEvaluation; a && a >= 0 ? (clearTimeout(s), s = setTimeout(g, a)) : g(); } function g() {
        if (!p) {
          if (m && v())z(); else {
            p = l; try {
              const a = b.a.V(y, (a) => a.target); b.r.lb((c) => { let d; (d = b.a.i(a, c)) >= 0 ? a[d] = H : y.push(c.xa(f)); }); for (var c = r.call(d), e = a.length - 1; e >= 0; e--)a[e] && y.splice(e, 1)[0].B(); m = l; h.notifySubscribers(k,
                'beforeChange'); k = c;
            } finally { b.r.end(); }h.notifySubscribers(k); p = q; y.length || z();
          }
        }
      } function h() { if (arguments.length > 0) return typeof u === 'function' ? u.apply(d, arguments) : i(Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")), this; m || g(); b.r.Va(h); return k; } function j() { return !m || y.length > 0; } let k; var m = q; var p = q; var r = a; r && typeof r === 'object' ? (c = r, r = c.read) : (c = c || {}, r || (r = c.read)); typeof r !== 'function' && i(Error('Pass a function that returns the value of the ko.computed'));
      var u = c.write; const F = c.disposeWhenNodeIsRemoved || c.W || n; var v = c.disposeWhen || c.Ja || t(q); var z = e; var y = []; var s = n; d || (d = c.owner); h.t = function () { m || g(); return k; }; h.wb = function () { return y.length; }; h.yb = typeof c.write === 'function'; h.B = function () { z(); }; h.oa = j; b.S.call(h); b.a.extend(h, b.j.fn); b.p(h, 'peek', h.t); b.p(h, 'dispose', h.B); b.p(h, 'isActive', h.oa); b.p(h, 'getDependenciesCount', h.wb); c.deferEvaluation !== l && g(); if (F && j()) { z = function () { b.a.F.Wa(F, arguments.callee); e(); }; b.a.F.Ba(F, z); const C = v; var v = function () { return !b.a.X(F) || C(); }; } return h;
    };
    b.Ab = function (a) { return b.la(a, b.j); }; v = b.m.Jb; b.j[v] = b.m; b.j.fn = {}; b.j.fn[v] = b.j; b.b('dependentObservable', b.j); b.b('computed', b.j); b.b('isComputed', b.Ab); b.fb = function (a) { arguments.length == 0 && i(Error('When calling ko.toJS, pass the object you want to convert.')); return aa(a, (a) => { for (let c = 0; b.$(a) && c < 10; c++)a = a(); return a; }); }; b.toJSON = function (a, d, c) { a = b.fb(a); return b.a.wa(a, d, c); }; b.b('toJS', b.fb); b.b('toJSON', b.toJSON); b.k = {
      q(a) {
        switch (b.a.u(a)) {
          case 'option': return a.__ko__hasDomDataOptionValue__
=== l ? b.a.f.get(a, b.c.options.ra) : b.a.Z <= 7 ? a.getAttributeNode('value').specified ? a.value : a.text : a.value; case 'select': return a.selectedIndex >= 0 ? b.k.q(a.options[a.selectedIndex]) : H; default: return a.value;
        }
      },
      T(a, d) {
        switch (b.a.u(a)) {
          case 'option': switch (typeof d) {
            case 'string': b.a.f.set(a, b.c.options.ra, H); '__ko__hasDomDataOptionValue__' in a && delete a.__ko__hasDomDataOptionValue__; a.value = d; break; default: b.a.f.set(a, b.c.options.ra, d), a.__ko__hasDomDataOptionValue__ = l, a.value = typeof d === 'number'
              ? d : '';
          } break; case 'select': for (let c = a.options.length - 1; c >= 0; c--) if (b.k.q(a.options[c]) == d) { a.selectedIndex = c; break; } break; default: if (d === n || d === H)d = ''; a.value = d;
        }
      },
    }; b.b('selectExtensions', b.k); b.b('selectExtensions.readValue', b.k.q); b.b('selectExtensions.writeValue', b.k.T); var ja = /\@ko_token_(\d+)\@/g; const ma = ['true', 'false']; const na = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i; b.g = {
      Q: [],
      aa(a) {
        var d = b.a.D(a); if (d.length < 3) return []; d.charAt(0) === '{' && (d = d.substring(1, d.length - 1)); for (var a = [],
          c = n, e, f = 0; f < d.length; f++) { var g = d.charAt(f); if (c === n) switch (g) { case '"': case "'": case '/': c = f, e = g; } else if (g == e && d.charAt(f - 1) !== '\\') { g = d.substring(c, f + 1); a.push(g); var h = `@ko_token_${a.length - 1}@`; var d = d.substring(0, c) + h + d.substring(f + 1); var f = f - (g.length - h.length); var c = n; } }e = c = n; for (var j = 0, k = n, f = 0; f < d.length; f++) {
          g = d.charAt(f); if (c === n) switch (g) { case '{': c = f; k = g; e = '}'; break; case '(': c = f; k = g; e = ')'; break; case '[': c = f, k = g, e = ']'; }g === k ? j++ : g === e && (j--, j === 0 && (g = d.substring(c, f + 1), a.push(g), h = `@ko_token_${a.length
- 1}@`, d = d.substring(0, c) + h + d.substring(f + 1), f -= g.length - h.length, c = n));
        }e = []; d = d.split(','); c = 0; for (f = d.length; c < f; c++)j = d[c], k = j.indexOf(':'), k > 0 && k < j.length - 1 ? (g = j.substring(k + 1), e.push({ key: O(j.substring(0, k), a), value: O(g, a) })) : e.push({ unknown: O(j, a) }); return e;
      },
      ba(a) {
        for (var d = typeof a === 'string' ? b.g.aa(a) : a, c = [], a = [], e, f = 0; e = d[f]; f++) {
          if (c.length > 0 && c.push(','), e.key) {
            var g; a: { g = e.key; var h = b.a.D(g); switch (h.length && h.charAt(0)) { case "'": case '"': break a; default: g = `'${h}'`; } }e = e.value;
            c.push(g); c.push(':'); c.push(e); e = b.a.D(e); b.a.i(ma, b.a.D(e).toLowerCase()) >= 0 ? e = q : (h = e.match(na), e = h === n ? q : h[1] ? `Object(${h[1]})${h[2]}` : e); e && (a.length > 0 && a.push(', '), a.push(`${g} : function(__ko_value) { ${e} = __ko_value; }`));
          } else e.unknown && c.push(e.unknown);
        } d = c.join(''); a.length > 0 && (d = `${d}, '_ko_property_writers' : { ${a.join('')} } `); return d;
      },
      Db(a, d) { for (let c = 0; c < a.length; c++) if (b.a.D(a[c].key) == d) return l; return q; },
      ea(a, d, c, e, f) {
        if (!a || !b.Qa(a)) {
          if ((a = d()._ko_property_writers)
&& a[c])a[c](e);
        } else (!f || a.t() !== e) && a(e);
      },
    }; b.b('expressionRewriting', b.g); b.b('expressionRewriting.bindingRewriteValidators', b.g.Q); b.b('expressionRewriting.parseObjectLiteral', b.g.aa); b.b('expressionRewriting.preProcessBindings', b.g.ba); b.b('jsonExpressionRewriting', b.g); b.b('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', b.g.ba); var J = x.createComment('test').text === '<\!--test--\>'; var ia = J ? /^<\!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\>$/ : /^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/; var ha = J ? /^<\!--\s*\/ko\s*--\>$/
      : /^\s*\/ko\s*$/; const oa = { ul: l, ol: l }; b.e = {
      I: {},
      childNodes(a) { return A(a) ? $(a) : a.childNodes; },
      Y(a) { if (A(a)) for (var a = b.e.childNodes(a), d = 0, c = a.length; d < c; d++)b.removeNode(a[d]); else b.a.ka(a); },
      N(a, d) { if (A(a)) { b.e.Y(a); for (let c = a.nextSibling, e = 0, f = d.length; e < f; e++)c.parentNode.insertBefore(d[e], c); } else b.a.N(a, d); },
      Ua(a, b) { A(a) ? a.parentNode.insertBefore(b, a.nextSibling) : a.firstChild ? a.insertBefore(b, a.firstChild) : a.appendChild(b); },
      Oa(a, d, c) {
        c ? A(a) ? a.parentNode.insertBefore(d,
          c.nextSibling) : c.nextSibling ? a.insertBefore(d, c.nextSibling) : a.appendChild(d) : b.e.Ua(a, d);
      },
      firstChild(a) { return !A(a) ? a.firstChild : !a.nextSibling || G(a.nextSibling) ? n : a.nextSibling; },
      nextSibling(a) { A(a) && (a = Z(a)); return a.nextSibling && G(a.nextSibling) ? n : a.nextSibling; },
      ib(a) { return (a = A(a)) ? a[1] : n; },
      Sa(a) {
        if (oa[b.a.u(a)]) {
          let d = a.firstChild; if (d) {
            do {
              if (d.nodeType === 1) {
                var c; c = d.firstChild; let e = n; if (c) {
                  do {
                    if (e)e.push(c); else if (A(c)) { var f = Z(c, l); f ? c = f : e = [c]; } else {
                      G(c)
&& (e = [c]);
                    }
                  } while (c = c.nextSibling);
                } if (c = e) { e = d.nextSibling; for (f = 0; f < c.length; f++)e ? a.insertBefore(c[f], e) : a.appendChild(c[f]); }
              }
            } while (d = d.nextSibling);
          }
        }
      },
    }; b.b('virtualElements', b.e); b.b('virtualElements.allowedBindings', b.e.I); b.b('virtualElements.emptyNode', b.e.Y); b.b('virtualElements.insertAfter', b.e.Oa); b.b('virtualElements.prepend', b.e.Ua); b.b('virtualElements.setDomNodeChildren', b.e.N); b.J = function () { this.Ga = {}; }; b.a.extend(b.J.prototype, {
      nodeHasBindings(a) {
        switch (a.nodeType) {
          case 1: return a.getAttribute('data-bind')
!= n; case 8: return b.e.ib(a) != n; default: return q;
        }
      },
      getBindings(a, b) { const c = this.getBindingsString(a, b); return c ? this.parseBindingsString(c, b, a) : n; },
      getBindingsString(a) { switch (a.nodeType) { case 1: return a.getAttribute('data-bind'); case 8: return b.e.ib(a); default: return n; } },
      parseBindingsString(a, d, c) {
        try { let e; if (!(e = this.Ga[a])) { const f = this.Ga; const g = `with($context){with($data||{}){return{${b.g.ba(a)}}}}`; e = f[a] = new Function('$context', '$element', g); } return e(d, c); } catch (h) {
          i(Error(`Unable to parse bindings.\nMessage: ${
            h};\nBindings value: ${a}`));
        }
      },
    }); b.J.instance = new b.J(); b.b('bindingProvider', b.J); b.c = {}; b.z = function (a, d, c) { d ? (b.a.extend(this, d), this.$parentContext = d, this.$parent = d.$data, this.$parents = (d.$parents || []).slice(0), this.$parents.unshift(this.$parent)) : (this.$parents = [], this.$root = a, this.ko = b); this.$data = a; c && (this[c] = a); }; b.z.prototype.createChildContext = function (a, d) { return new b.z(a, this, d); }; b.z.prototype.extend = function (a) { const d = b.a.extend(new b.z(), this); return b.a.extend(d, a); }; b.cb = function (a, d) {
      if (arguments.length
== 2)b.a.f.set(a, '__ko_bindingContext__', d); else return b.a.f.get(a, '__ko_bindingContext__');
    }; b.Ea = function (a, d, c) { a.nodeType === 1 && b.e.Sa(a); return W(a, d, c, l); }; b.Da = function (a, b) { (b.nodeType === 1 || b.nodeType === 8) && Y(a, b, l); }; b.Ca = function (a, b) { b && (b.nodeType !== 1 && b.nodeType !== 8) && i(Error('ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node')); b = b || w.document.body; X(a, b, l); }; b.ja = function (a) {
      switch (a.nodeType) {
        case 1: case 8: var d = b.cb(a); if (d) return d;
          if (a.parentNode) return b.ja(a.parentNode);
      } return H;
    }; b.ob = function (a) { return (a = b.ja(a)) ? a.$data : H; }; b.b('bindingHandlers', b.c); b.b('applyBindings', b.Ca); b.b('applyBindingsToDescendants', b.Da); b.b('applyBindingsToNode', b.Ea); b.b('contextFor', b.ja); b.b('dataFor', b.ob); const ea = { class: 'className', for: 'htmlFor' }; b.c.attr = {
      update(a, d) {
        const c = b.a.d(d()) || {}; let e; for (e in c) {
          if (typeof e === 'string') {
            const f = b.a.d(c[e]); const g = f === q || f === n || f === H; g && a.removeAttribute(e); b.a.Z <= 8 && e in ea ? (e = ea[e], g ? a.removeAttribute(e)
              : a[e] = f) : g || a.setAttribute(e, f.toString()); e === 'name' && b.a.$a(a, g ? '' : f.toString());
          }
        }
      },
    }; b.c.checked = {
      init(a, d, c) { b.a.n(a, 'click', () => { let e; if (a.type == 'checkbox')e = a.checked; else if (a.type == 'radio' && a.checked)e = a.value; else return; const f = d(); const g = b.a.d(f); a.type == 'checkbox' && g instanceof Array ? (e = b.a.i(g, a.value), a.checked && e < 0 ? f.push(a.value) : !a.checked && e >= 0 && f.splice(e, 1)) : b.g.ea(f, c, 'checked', e, l); }); a.type == 'radio' && !a.name && b.c.uniqueName.init(a, t(l)); },
      update(a, d) {
        const c = b.a.d(d());
        a.type == 'checkbox' ? a.checked = c instanceof Array ? b.a.i(c, a.value) >= 0 : c : a.type == 'radio' && (a.checked = a.value == c);
      },
    }; b.c.css = { update(a, d) { let c = b.a.d(d()); if (typeof c === 'object') for (const e in c) { const f = b.a.d(c[e]); b.a.da(a, e, f); } else c = String(c || ''), b.a.da(a, a.__ko__cssValue, q), a.__ko__cssValue = c, b.a.da(a, c, l); } }; b.c.enable = { update(a, d) { const c = b.a.d(d()); c && a.disabled ? a.removeAttribute('disabled') : !c && !a.disabled && (a.disabled = l); } }; b.c.disable = { update(a, d) { b.c.enable.update(a, () => !b.a.d(d())); } };
    b.c.event = { init(a, d, c, e) { const f = d() || {}; let g; for (g in f)(function () { const f = g; typeof f === 'string' && b.a.n(a, f, function (a) { let g; const m = d()[f]; if (m) { const p = c(); try { const r = b.a.L(arguments); r.unshift(e); g = m.apply(e, r); } finally { g !== l && (a.preventDefault ? a.preventDefault() : a.returnValue = q); }p[`${f}Bubble`] === q && (a.cancelBubble = l, a.stopPropagation && a.stopPropagation()); } }); }()); } }; b.c.foreach = {
      Ra(a) {
        return function () {
          const d = a(); const c = b.a.ta(d); if (!c || typeof c.length === 'number') return { foreach: d, templateEngine: b.C.na };
          b.a.d(d); return {
            foreach: c.data, as: c.as, includeDestroyed: c.includeDestroyed, afterAdd: c.afterAdd, beforeRemove: c.beforeRemove, afterRender: c.afterRender, beforeMove: c.beforeMove, afterMove: c.afterMove, templateEngine: b.C.na,
          };
        };
      },
      init(a, d) { return b.c.template.init(a, b.c.foreach.Ra(d)); },
      update(a, d, c, e, f) { return b.c.template.update(a, b.c.foreach.Ra(d), c, e, f); },
    }; b.g.Q.foreach = q; b.e.I.foreach = l; b.c.hasfocus = {
      init(a, d, c) {
        function e(e) {
          a.__ko_hasfocusUpdating = l; let f = a.ownerDocument; 'activeElement'
in f && (e = f.activeElement === a); f = d(); b.g.ea(f, c, 'hasfocus', e, l); a.__ko_hasfocusUpdating = q;
        } const f = e.bind(n, l); const g = e.bind(n, q); b.a.n(a, 'focus', f); b.a.n(a, 'focusin', f); b.a.n(a, 'blur', g); b.a.n(a, 'focusout', g);
      },
      update(a, d) { const c = b.a.d(d()); a.__ko_hasfocusUpdating || (c ? a.focus() : a.blur(), b.r.K(b.a.Aa, n, [a, c ? 'focusin' : 'focusout'])); },
    }; b.c.html = { init() { return { controlsDescendantBindings: l }; }, update(a, d) { b.a.ca(a, d()); } }; var ca = '__ko_withIfBindingData'; P('if'); P('ifnot', q, l); P('with', l, q, (a,
      b) => a.createChildContext(b)); b.c.options = {
      update(a, d, c) {
        b.a.u(a) !== 'select' && i(Error('options binding applies only to SELECT elements')); for (var e = a.length == 0, f = b.a.V(b.a.fa(a.childNodes, (a) => a.tagName && b.a.u(a) === 'option' && a.selected), (a) => b.k.q(a) || a.innerText || a.textContent), g = a.scrollTop, h = b.a.d(d()); a.length > 0;)b.A(a.options[0]), a.remove(0); if (h) {
          var c = c(); let j = c.optionsIncludeDestroyed; typeof h.length !== 'number' && (h = [h]); if (c.optionsCaption) {
            var k = x.createElement('option');
            b.a.ca(k, c.optionsCaption); b.k.T(k, H); a.appendChild(k);
          } for (var d = 0, m = h.length; d < m; d++) { let p = h[d]; if (!p || !p._destroy || j) { var k = x.createElement('option'); const r = function (a, b, c) { const d = typeof b; return d == 'function' ? b(a) : d == 'string' ? a[b] : c; }; const u = r(p, c.optionsValue, p); b.k.T(k, b.a.d(u)); p = r(p, c.optionsText, u); b.a.bb(k, p); a.appendChild(k); } }h = a.getElementsByTagName('option'); d = j = 0; for (m = h.length; d < m; d++)b.a.i(f, b.k.q(h[d])) >= 0 && (b.a.ab(h[d], l), j++); a.scrollTop = g; e && 'value' in c && da(a, b.a.ta(c.value), l); b.a.tb(a);
        }
      },
    };
    b.c.options.ra = '__ko.optionValueDomData__'; b.c.selectedOptions = { init(a, d, c) { b.a.n(a, 'change', () => { const e = d(); const f = []; b.a.o(a.getElementsByTagName('option'), (a) => { a.selected && f.push(b.k.q(a)); }); b.g.ea(e, c, 'value', f); }); }, update(a, d) { b.a.u(a) != 'select' && i(Error('values binding applies only to SELECT elements')); const c = b.a.d(d()); c && typeof c.length === 'number' && b.a.o(a.getElementsByTagName('option'), (a) => { const d = b.a.i(c, b.k.q(a)) >= 0; b.a.ab(a, d); }); } }; b.c.style = {
      update(a,
        d) { const c = b.a.d(d() || {}); let e; for (e in c) if (typeof e === 'string') { const f = b.a.d(c[e]); a.style[e] = f || ''; } },
    }; b.c.submit = { init(a, d, c, e) { typeof d() !== 'function' && i(Error('The value for a submit binding must be a function')); b.a.n(a, 'submit', (b) => { let c; const h = d(); try { c = h.call(e, a); } finally { c !== l && (b.preventDefault ? b.preventDefault() : b.returnValue = q); } }); } }; b.c.text = { update(a, d) { b.a.bb(a, d()); } }; b.e.I.text = l; b.c.uniqueName = {
      init(a, d) {
        if (d()) {
          const c = `ko_unique_${++b.c.uniqueName.nb}`; b.a.$a(a,
            c);
        }
      },
    }; b.c.uniqueName.nb = 0; b.c.value = {
      init(a, d, c) {
        function e() { h = q; const e = d(); const f = b.k.q(a); b.g.ea(e, c, 'value', f); } let f = ['change']; let g = c().valueUpdate; var h = q; g && (typeof g === 'string' && (g = [g]), b.a.P(f, g), f = b.a.Fa(f)); if (b.a.Z && (a.tagName.toLowerCase() == 'input' && a.type == 'text' && a.autocomplete != 'off' && (!a.form || a.form.autocomplete != 'off')) && b.a.i(f, 'propertychange') == -1)b.a.n(a, 'propertychange', () => { h = l; }), b.a.n(a, 'blur', () => { h && e(); }); b.a.o(f, (c) => {
          let d = e; b.a.Nb(c, 'after') && (d = function () {
            setTimeout(e,
              0);
          }, c = c.substring(5)); b.a.n(a, c, d);
        });
      },
      update(a, d) { const c = b.a.u(a) === 'select'; const e = b.a.d(d()); let f = b.k.q(a); let g = e != f; e === 0 && (f !== 0 && f !== '0') && (g = l); g && (f = function () { b.k.T(a, e); }, f(), c && setTimeout(f, 0)); c && a.length > 0 && da(a, e, q); },
    }; b.c.visible = { update(a, d) { const c = b.a.d(d()); const e = a.style.display != 'none'; c && !e ? a.style.display = '' : !c && e && (a.style.display = 'none'); } }; b.c.click = { init(a, d, c, e) { return b.c.event.init.call(this, a, () => { const a = {}; a.click = d(); return a; }, c, e); } }; b.v = function () {}; b.v.prototype.renderTemplateSource = function () { i(Error('Override renderTemplateSource')); }; b.v.prototype.createJavaScriptEvaluatorBlock = function () { i(Error('Override createJavaScriptEvaluatorBlock')); }; b.v.prototype.makeTemplateSource = function (a, d) { if (typeof a === 'string') { var d = d || x; const c = d.getElementById(a); c || i(Error(`Cannot find template with ID ${a}`)); return new b.l.h(c); } if (a.nodeType == 1 || a.nodeType == 8) return new b.l.O(a); i(Error(`Unknown template type: ${a}`)); }; b.v.prototype.renderTemplate = function (a, b, c, e) {
      a = this.makeTemplateSource(a, e);
      return this.renderTemplateSource(a, b, c);
    }; b.v.prototype.isTemplateRewritten = function (a, b) { return this.allowTemplateRewriting === q ? l : this.makeTemplateSource(a, b).data('isRewritten'); }; b.v.prototype.rewriteTemplate = function (a, b, c) { a = this.makeTemplateSource(a, c); b = b(a.text()); a.text(b); a.data('isRewritten', l); }; b.b('templateEngine', b.v); const pa = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi; const qa = /<\!--\s*ko\b\s*([\s\S]*?)\s*--\>/g; b.ya = {
      ub(a,
        d, c) { d.isTemplateRewritten(a, c) || d.rewriteTemplate(a, (a) => b.ya.Fb(a, d), c); },
      Fb(a, b) { return a.replace(pa, (a, e, f, g, h, j, k) => V(k, e, b)).replace(qa, (a, e) => V(e, '<\!-- ko --\>', b)); },
      jb(a) { return b.s.qa((d, c) => { d.nextSibling && b.Ea(d.nextSibling, a, c); }); },
    }; b.b('__tr_ambtns', b.ya.jb); b.l = {}; b.l.h = function (a) { this.h = a; }; b.l.h.prototype.text = function () {
      var a = b.a.u(this.h); var a = a === 'script' ? 'text' : a === 'textarea' ? 'value' : 'innerHTML'; if (arguments.length == 0) return this.h[a];
      const d = arguments[0]; a === 'innerHTML' ? b.a.ca(this.h, d) : this.h[a] = d;
    }; b.l.h.prototype.data = function (a) { if (arguments.length === 1) return b.a.f.get(this.h, `templateSourceData_${a}`); b.a.f.set(this.h, `templateSourceData_${a}`, arguments[1]); }; b.l.O = function (a) { this.h = a; }; b.l.O.prototype = new b.l.h(); b.l.O.prototype.text = function () { if (arguments.length == 0) { const a = b.a.f.get(this.h, '__ko_anon_template__') || {}; a.za === H && a.ia && (a.za = a.ia.innerHTML); return a.za; }b.a.f.set(this.h, '__ko_anon_template__', { za: arguments[0] }); }; b.l.h.prototype.nodes = function () { if (arguments.length == 0) return (b.a.f.get(this.h, '__ko_anon_template__') || {}).ia; b.a.f.set(this.h, '__ko_anon_template__', { ia: arguments[0] }); }; b.b('templateSources', b.l); b.b('templateSources.domElement', b.l.h); b.b('templateSources.anonymousTemplate', b.l.O); let N; b.va = function (a) { a != H && !(a instanceof b.v) && i(Error('templateEngine must inherit from ko.templateEngine')); N = a; }; b.ua = function (a, d, c, e, f) {
      c = c || {}; (c.templateEngine || N) == H && i(Error('Set a template engine before calling renderTemplate'));
      f = f || 'replaceChildren'; if (e) { let g = M(e); return b.j(() => { var h = d && d instanceof b.z ? d : new b.z(b.a.d(d)); const j = typeof a === 'function' ? a(h.$data, h) : a; var h = S(e, f, j, h, c); f == 'replaceNode' && (e = h, g = M(e)); }, n, { Ja() { return !g || !b.a.X(g); }, W: g && f == 'replaceNode' ? g.parentNode : g }); } return b.s.qa((e) => { b.ua(a, d, c, e, 'replaceNode'); });
    }; b.Lb = function (a, d, c, e, f) {
      function g(a, b) { T(b, j); c.afterRender && c.afterRender(b, a); } function h(d, e) {
        j = f.createChildContext(b.a.d(d), c.as); j.$index = e; const g = typeof a === 'function'
          ? a(d, j) : a; return S(n, 'ignoreTargetNode', g, j, c);
      } let j; return b.j(() => { let a = b.a.d(d) || []; typeof a.length === 'undefined' && (a = [a]); a = b.a.fa(a, (a) => c.includeDestroyed || a === H || a === n || !b.a.d(a._destroy)); b.r.K(b.a.Za, n, [e, a, h, c, g]); }, n, { W: e });
    }; b.c.template = {
      init(a, d) { let c = b.a.d(d()); if (typeof c !== 'string' && !c.name && (a.nodeType == 1 || a.nodeType == 8))c = a.nodeType == 1 ? a.childNodes : b.e.childNodes(a), c = b.a.Gb(c), (new b.l.O(a)).nodes(c); return { controlsDescendantBindings: l }; },
      update(a,
        d, c, e, f) { var d = b.a.d(d()); var c = {}; var e = l; let g; let h = n; typeof d !== 'string' && (c = d, d = c.name, 'if' in c && (e = b.a.d(c.if)), e && 'ifnot' in c && (e = !b.a.d(c.ifnot)), g = b.a.d(c.data)); 'foreach' in c ? h = b.Lb(d || a, e && c.foreach || [], c, a, f) : e ? (f = 'data' in c ? f.createChildContext(g, c.as) : f, h = b.ua(d || a, f, c, a)) : b.e.Y(a); f = h; (g = b.a.f.get(a, '__ko__templateComputedDomDataKey__')) && typeof g.B === 'function' && g.B(); b.a.f.set(a, '__ko__templateComputedDomDataKey__', f && f.oa() ? f : H); },
    }; b.g.Q.template = function (a) {
      a = b.g.aa(a); return a.length == 1 && a[0].unknown
|| b.g.Db(a, 'name') ? n : 'This template engine does not support anonymous templates nested within its templates';
    }; b.e.I.template = l; b.b('setTemplateEngine', b.va); b.b('renderTemplate', b.ua); b.a.Ia = function (a, b, c) { a = a || []; b = b || []; return a.length <= b.length ? R(a, b, 'added', 'deleted', c) : R(b, a, 'deleted', 'added', c); }; b.b('utils.compareArrays', b.a.Ia); b.a.Za = function (a, d, c, e, f) {
      function g(a, b) { s = k[b]; v !== b && (y[a] = s); s.ma(v++); L(s.M); r.push(s); z.push(s); } function h(a, c) {
        if (a) {
          for (var d = 0, e = c.length; d < e; d++) {
            c[d] && b.a.o(c[d].M,
              (b) => { a(b, d, c[d].U); });
          }
        }
      } for (var d = d || [], e = e || {}, j = b.a.f.get(a, 'setDomNodeChildrenFromArrayMapping_lastMappingResult') === H, k = b.a.f.get(a, 'setDomNodeChildrenFromArrayMapping_lastMappingResult') || [], m = b.a.V(k, (a) => a.U), p = b.a.Ia(m, d), r = [], u = 0, v = 0, A = [], z = [], d = [], y = [], m = [], s, C = 0, B, D; B = p[C]; C++) {
        switch (D = B.moved, B.status) {
          case 'deleted': D === H && (s = k[u], s.j && s.j.B(), A.push.apply(A, L(s.M)), e.beforeRemove && (d[C] = s, z.push(s))); u++; break; case 'retained': g(C, u++); break; case 'added': D !== H ? g(C,
            D) : (s = { U: B.value, ma: b.m(v++) }, r.push(s), z.push(s), j || (m[C] = s));
        }
      }h(e.beforeMove, y); b.a.o(A, e.beforeRemove ? b.A : b.removeNode); for (var C = 0, j = b.e.firstChild(a), G; s = z[C]; C++) { s.M || b.a.extend(s, ga(a, c, s.U, f, s.ma)); for (u = 0; p = s.M[u]; j = p.nextSibling, G = p, u++)p !== j && b.e.Oa(a, p, G); !s.zb && f && (f(s.U, s.M, s.ma), s.zb = l); }h(e.beforeRemove, d); h(e.afterMove, y); h(e.afterAdd, m); b.a.f.set(a, 'setDomNodeChildrenFromArrayMapping_lastMappingResult', r);
    }; b.b('utils.setDomNodeChildrenFromArrayMapping', b.a.Za); b.C = function () {
      this.allowTemplateRewriting = q;
    }; b.C.prototype = new b.v(); b.C.prototype.renderTemplateSource = function (a) { const d = !(b.a.Z < 9) && a.nodes ? a.nodes() : n; if (d) return b.a.L(d.cloneNode(l).childNodes); a = a.text(); return b.a.sa(a); }; b.C.na = new b.C(); b.va(b.C.na); b.b('nativeTemplateEngine', b.C); b.pa = function () {
      const a = this.Cb = (function () { if (typeof E === 'undefined' || !E.tmpl) return 0; try { if (E.tmpl.tag.tmpl.open.toString().indexOf('__') >= 0) return 2; } catch (a) {} return 1; }()); this.renderTemplateSource = function (b, c, e) {
        e = e || {}; a < 2 && i(Error('Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.'));
        let f = b.data('precompiled'); f || (f = b.text() || '', f = E.template(n, `{{ko_with $item.koBindingContext}}${f}{{/ko_with}}`), b.data('precompiled', f)); b = [c.$data]; c = E.extend({ koBindingContext: c }, e.templateOptions); c = E.tmpl(f, b, c); c.appendTo(x.createElement('div')); E.fragments = {}; return c;
      }; this.createJavaScriptEvaluatorBlock = function (a) { return `{{ko_code ((function() { return ${a} })()) }}`; }; this.addTemplate = function (a, b) { x.write(`<script type='text/html' id='${a}'>${b}<\/script>`); }; a > 0 && (E.tmpl.tag.ko_code = { open: "__.push($1 || '');" }, E.tmpl.tag.ko_with = { open: 'with($1) {', close: '} ' });
    }; b.pa.prototype = new b.v(); v = new b.pa(); v.Cb > 0 && b.va(v); b.b('jqueryTmplTemplateEngine', b.pa);
  } typeof require === 'function' && typeof exports === 'object' && typeof module === 'object' ? K(module.exports || exports) : typeof define === 'function' && define.amd ? define(['exports'], K) : K(w.ko = {}); l;
}());
