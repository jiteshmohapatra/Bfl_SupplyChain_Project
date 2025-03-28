/// Knockout Mapping plugin v2.3.3
/// (c) 2012 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
/// License: MIT (http://www.opensource.org/licenses/mit-license.php)
(function (e) { typeof require === 'function' && typeof exports === 'object' && typeof module === 'object' ? e(require('knockout'), exports) : typeof define === 'function' && define.amd ? define(['', 'exports'], e) : e(ko, ko.mapping = {}); }((e, f) => {
  function x(b, c) {
    let a; let d; for (d in c) {
      if (c.hasOwnProperty(d) && c[d]) {
        if (a = f.getType(b[d]), d && b[d] && a !== 'array' && a !== 'string')x(b[d], c[d]); else if (f.getType(b[d]) === 'array' && f.getType(c[d]) === 'array') {
          a = b; for (var e = d, i = b[d], j = c[d], l = {}, g = i.length - 1; g >= 0; --g)l[i[g]] = i[g]; for (g = j.length - 1; g >= 0; --g)l[j[g]] = j[g]; i = []; j = void 0; for (j in l)i.push(l[j]); a[e] = i;
        } else b[d] = c[d];
      }
    }
  } function E(b, c) { const a = {}; x(a, b); x(a, c); return a; } function y(b, c) { for (var a = E({}, b), d = K.length - 1; d >= 0; d--) { const e = K[d]; a[e] && (a[''] instanceof Object || (a[''] = {}), a[''][e] = a[e], delete a[e]); }c && (a.ignore = r(c.ignore, a.ignore), a.include = r(c.include, a.include), a.copy = r(c.copy, a.copy)); a.ignore = r(a.ignore, h.ignore); a.include = r(a.include, h.include); a.copy = r(a.copy, h.copy); a.mappedProperties = a.mappedProperties || {}; return a; }
  function r(b, c) { f.getType(b) !== 'array' && (b = f.getType(b) === 'undefined' ? [] : [b]); f.getType(c) !== 'array' && (c = f.getType(c) === 'undefined' ? [] : [c]); return e.utils.arrayGetDistinctValues(b.concat(c)); } function F(b, c, a, d, D, i, j) {
    var l = f.getType(e.utils.unwrapObservable(c)) === 'array'; var i = i || ''; if (f.isMapped(b)) var g = e.utils.unwrapObservable(b)[p]; var a = E(g, a); const q = j || D; const h = function () { return a[d] && a[d].create instanceof Function; }; const r = function (b) {
      const f = G; const g = e.dependentObservable; e.dependentObservable = function (a, b, c) {
        c = c
|| {}; a && typeof a === 'object' && (c = a); var d = c.deferEvaluation; let L = !1; c.deferEvaluation = !0; a = new H(a, b, c); if (!d) { const g = a; var d = e.dependentObservable; e.dependentObservable = H; a = e.isWriteableObservable(g); e.dependentObservable = d; a = H({ read() { L || (e.utils.arrayRemoveItem(f, g), L = !0); return g.apply(g, arguments); }, write: a && function (a) { return g(a); }, deferEvaluation: !0 }); f.push(a); } return a;
      }; e.dependentObservable.fn = H.fn; e.computed = e.dependentObservable; b = e.utils.unwrapObservable(D) instanceof Array ? a[d].create({
        data: b
|| c,
        parent: q,
        skip: M,
      }) : a[d].create({ data: b || c, parent: q }); e.dependentObservable = g; e.computed = e.dependentObservable; return b;
    }; const t = function () { return a[d] && a[d].update instanceof Function; }; const v = function (b, f) { const g = { data: f || c, parent: q, target: e.utils.unwrapObservable(b) }; e.isWriteableObservable(b) && (g.observable = b); return a[d].update(g); }; if (j = I.get(c)) return j; d = d || ''; if (l) {
      var l = []; var s = !1; let k = function (a) { return a; }; a[d] && a[d].key && (k = a[d].key, s = !0); e.isObservable(b) || (b = e.observableArray([]), b.mappedRemove = function (a) {
        const c = typeof a === 'function' ? a : function (b) { return b === k(a); }; return b.remove((a) => c(k(a)));
      }, b.mappedRemoveAll = function (a) { const c = B(a, k); return b.remove((a) => e.utils.arrayIndexOf(c, k(a)) != -1); }, b.mappedDestroy = function (a) { const c = typeof a === 'function' ? a : function (b) { return b === k(a); }; return b.destroy((a) => c(k(a))); }, b.mappedDestroyAll = function (a) { const c = B(a, k); return b.destroy((a) => e.utils.arrayIndexOf(c, k(a)) != -1); }, b.mappedIndexOf = function (a) {
        const c = B(b(), k);
        var a = k(a); return e.utils.arrayIndexOf(c, a);
      }, b.mappedCreate = function (a) { if (b.mappedIndexOf(a) !== -1) throw Error('There already is an object with the key that you specified.'); let c = h() ? r(a) : a; t() && (a = v(c, a), e.isWriteableObservable(c) ? c(a) : c = a); b.push(c); return c; }); j = B(e.utils.unwrapObservable(b), k).sort(); g = B(c, k); s && g.sort(); var s = e.utils.compareArrays(j, g); var j = {}; let u; var z = e.utils.unwrapObservable(c); const x = {}; let y = !0; var g = 0; for (u = z.length; g < u; g++) { var n = k(z[g]); if (void 0 === n || n instanceof Object) { y = !1; break; }x[n] = z[g]; } var z = []; let A = 0; var g = 0; for (u = s.length; g < u; g++) {
        var n = s[g]; var m; let w = `${i}[${g}]`; switch (n.status) { case 'added': var C = y ? x[n.value] : J(e.utils.unwrapObservable(c), n.value, k); m = F(void 0, C, a, d, b, w, D); h() || (m = e.utils.unwrapObservable(m)); w = N(e.utils.unwrapObservable(c), C, j); m === M ? A++ : z[w - A] = m; j[w] = !0; break; case 'retained': C = y ? x[n.value] : J(e.utils.unwrapObservable(c), n.value, k); m = J(b, n.value, k); F(m, C, a, d, b, w, D); w = N(e.utils.unwrapObservable(c), C, j); z[w] = m; j[w] = !0; break; case 'deleted': m = J(b, n.value, k); }l.push({
          event: n.status,
          item: m,
        });
      }b(z); a[d] && a[d].arrayChanged && e.utils.arrayForEach(l, (b) => { a[d].arrayChanged(b.event, b.item); });
    } else if (O(c)) {
      b = e.utils.unwrapObservable(b); if (!b) { if (h()) return s = r(), t() && (s = v(s)), s; if (t()) return v(s); b = {}; }t() && (b = v(b)); I.save(c, b); if (t()) return b; P(c, (d) => {
        const f = i.length ? `${i}.${d}` : d; if (e.utils.arrayIndexOf(a.ignore, f) == -1) {
          if (e.utils.arrayIndexOf(a.copy, f) != -1)b[d] = c[d]; else {
            var g = I.get(c[d]); const j = F(b[d], c[d], a, d, b, f, b); var g = g || j; if (e.isWriteableObservable(b[d]))b[d](e.utils.unwrapObservable(g));
            else b[d] = g; a.mappedProperties[f] = !0;
          }
        }
      });
    } else switch (f.getType(c)) { case 'function': t() ? e.isWriteableObservable(c) ? (c(v(c)), b = c) : b = v(c) : b = c; break; default: if (e.isWriteableObservable(b)) return m = t() ? v(b) : e.utils.unwrapObservable(c), b(m), m; h() || t(); b = h() ? r() : e.observable(e.utils.unwrapObservable(c)); t() && b(v(b)); } return b;
  } function N(b, c, a) { for (let d = 0, e = b.length; d < e; d++) if (!0 !== a[d] && b[d] === c) return d; return null; } function Q(b, c) { let a; c && (a = c(b)); f.getType(a) === 'undefined' && (a = b); return e.utils.unwrapObservable(a); }
  function J(b, c, a) { for (var b = e.utils.unwrapObservable(b), d = 0, f = b.length; d < f; d++) { const i = b[d]; if (Q(i, a) === c) return i; } throw Error(`When calling ko.update*, the key '${c}' was not found!`); } function B(b, c) { return e.utils.arrayMap(e.utils.unwrapObservable(b), (a) => (c ? Q(a, c) : a)); } function P(b, c) { if (f.getType(b) === 'array') for (var a = 0; a < b.length; a++)c(a); else for (a in b)c(a); } function O(b) { const c = f.getType(b); return (c === 'object' || c === 'array') && b !== null; } function S() {
    const b = []; const c = []; this.save = function (a,
      d) { const f = e.utils.arrayIndexOf(b, a); f >= 0 ? c[f] = d : (b.push(a), c.push(d)); }; this.get = function (a) { a = e.utils.arrayIndexOf(b, a); return a >= 0 ? c[a] : void 0; };
  } function R() { const b = {}; const c = function (a) { let c; try { c = a; } catch (e) { c = '$$$'; }a = b[c]; void 0 === a && (a = new S(), b[c] = a); return a; }; this.save = function (a, b) { c(a).save(a, b); }; this.get = function (a) { return c(a).get(a); }; } var p = '__ko_mapping__'; var H = e.dependentObservable; let A = 0; let G; let I; var K = ['create', 'update', 'key', 'arrayChanged']; var M = {}; const u = { include: ['_destroy'], ignore: [], copy: [] }; var h = u; f.isMapped = function (b) {
    return (b = e.utils.unwrapObservable(b)) && b[p];
  }; f.fromJS = function (b) { if (arguments.length == 0) throw Error('When calling ko.fromJS, pass the object you want to convert.'); window.setTimeout(() => { A = 0; }, 0); A++ || (G = [], I = new R()); let c; let a; arguments.length == 2 && (arguments[1][p] ? a = arguments[1] : c = arguments[1]); arguments.length == 3 && (c = arguments[1], a = arguments[2]); a && (c = E(c, a[p])); c = y(c); let d = F(a, b, c); a && (d = a); --A || window.setTimeout(() => { for (;G.length;) { const a = G.pop(); a && a(); } }, 0); d[p] = E(d[p], c); return d; }; f.fromJSON = function (b) { const c = e.utils.parseJson(b); arguments[0] = c; return f.fromJS.apply(this, arguments); }; f.updateFromJS = function () { throw Error('ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!'); }; f.updateFromJSON = function () { throw Error('ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!'); }; f.toJS = function (b, c) {
    h || f.resetDefaultOptions(); if (arguments.length == 0) throw Error('When calling ko.mapping.toJS, pass the object you want to convert.');
    if (f.getType(h.ignore) !== 'array') throw Error('ko.mapping.defaultOptions().ignore should be an array.'); if (f.getType(h.include) !== 'array') throw Error('ko.mapping.defaultOptions().include should be an array.'); if (f.getType(h.copy) !== 'array') throw Error('ko.mapping.defaultOptions().copy should be an array.'); c = y(c, b[p]); return f.visitModel(b, (a) => e.utils.unwrapObservable(a), c);
  }; f.toJSON = function (b, c) { const a = f.toJS(b, c); return e.utils.stringifyJson(a); }; f.defaultOptions = function () {
    if (arguments.length > 0) {
      h = arguments[0];
    } else return h;
  }; f.resetDefaultOptions = function () { h = { include: u.include.slice(0), ignore: u.ignore.slice(0), copy: u.copy.slice(0) }; }; f.getType = function (b) { if (b && typeof b === 'object') { if (b.constructor == (new Date()).constructor) return 'date'; if (Object.prototype.toString.call(b) === '[object Array]') return 'array'; } return typeof b; }; f.visitModel = function (b, c, a) {
    a = a || {}; a.visitedObjects = a.visitedObjects || new R(); let d; const h = e.utils.unwrapObservable(b); if (O(h)) {
      a = y(a, h[p]), c(b, a.parentName), d = f.getType(h) === 'array'
        ? [] : {};
    } else return c(b, a.parentName); a.visitedObjects.save(b, d); const i = a.parentName; P(h, (b) => {
      if (!(a.ignore && e.utils.arrayIndexOf(a.ignore, b) != -1)) {
        const l = h[b]; let g = a; let q = i || ''; f.getType(h) === 'array' ? i && (q += `[${b}]`) : (i && (q += '.'), q += b); g.parentName = q; if (!(e.utils.arrayIndexOf(a.copy, b) === -1 && e.utils.arrayIndexOf(a.include, b) === -1 && h[p] && h[p].mappedProperties && !h[p].mappedProperties[b] && f.getType(h) !== 'array')) {
          switch (f.getType(e.utils.unwrapObservable(l))) {
            case 'object': case 'array': case 'undefined': g = a.visitedObjects.get(l); d[b] = f.getType(g) !== 'undefined' ? g : f.visitModel(l, c, a); break; default: d[b] = c(l, a.parentName);
          }
        }
      }
    }); return d;
  };
}));
