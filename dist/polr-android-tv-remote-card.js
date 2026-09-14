/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis, Pe = re.ShadowRoot && (re.ShadyCSS === void 0 || re.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ce = Symbol(), je = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== Ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Pe && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = je.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && je.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const zt = (e) => new _t(typeof e == "string" ? e : e + "", void 0, Ce), he = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, s, n) => o + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[n + 1], e[0]);
  return new _t(i, e, Ce);
}, It = (e, t) => {
  if (Pe) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), s = re.litNonce;
    s !== void 0 && o.setAttribute("nonce", s), o.textContent = i.cssText, e.appendChild(o);
  }
}, Be = Pe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return zt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Lt, defineProperty: Rt, getOwnPropertyDescriptor: Ht, getOwnPropertyNames: Ut, getOwnPropertySymbols: Vt, getPrototypeOf: jt } = Object, pe = globalThis, We = pe.trustedTypes, Bt = We ? We.emptyScript : "", Wt = pe.reactiveElementPolyfillSupport, ee = (e, t) => e, le = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Bt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, De = (e, t) => !Lt(e, t), qe = { attribute: !0, type: String, converter: le, reflect: !1, useDefault: !1, hasChanged: De };
Symbol.metadata ??= Symbol("metadata"), pe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let q = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = qe) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), s = this.getPropertyDescriptor(t, o, i);
      s !== void 0 && Rt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: s, set: n } = Ht(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: s, set(a) {
      const l = s?.call(this);
      n?.call(this, a), this.requestUpdate(t, l, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? qe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ee("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ee("properties"))) {
      const i = this.properties, o = [...Ut(i), ...Vt(i)];
      for (const s of o) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [o, s] of i) this.elementProperties.set(o, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const s = this._$Eu(i, o);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const s of o) i.unshift(Be(s));
    } else t !== void 0 && i.push(Be(t));
    return i;
  }
  static _$Eu(t, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return It(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, o) {
    this._$AK(t, o);
  }
  _$ET(t, i) {
    const o = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, o);
    if (s !== void 0 && o.reflect === !0) {
      const n = (o.converter?.toAttribute !== void 0 ? o.converter : le).toAttribute(i, o.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const o = this.constructor, s = o._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const n = o.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : le;
      this._$Em = s;
      const l = a.fromAttribute(i, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, s = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (n = this[t]), o ??= a.getPropertyOptions(t), !((o.hasChanged ?? De)(n, i) || o.useDefault && o.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, o)))) return;
      this.C(t, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: o, reflect: s, wrapped: n }, a) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [s, n] of o) {
        const { wrapped: a } = n, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, q[ee("elementProperties")] = /* @__PURE__ */ new Map(), q[ee("finalized")] = /* @__PURE__ */ new Map(), Wt?.({ ReactiveElement: q }), (pe.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = globalThis, Ke = (e) => e, ce = Oe.trustedTypes, Fe = ce ? ce.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", M = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + M, qt = `<${gt}>`, j = document, ie = () => j.createComment(""), oe = (e) => e === null || typeof e != "object" && typeof e != "function", Me = Array.isArray, Kt = (e) => Me(e) || typeof e?.[Symbol.iterator] == "function", fe = `[ 	
\f\r]`, Z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ye = /-->/g, Xe = />/g, L = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ge = /'/g, Ze = /"/g, bt = /^(?:script|style|textarea|title)$/i, yt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), r = yt(1), Ft = yt(2), D = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Qe = /* @__PURE__ */ new WeakMap(), V = j.createTreeWalker(j, 129);
function wt(e, t) {
  if (!Me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Fe !== void 0 ? Fe.createHTML(t) : t;
}
const Yt = (e, t) => {
  const i = e.length - 1, o = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Z;
  for (let l = 0; l < i; l++) {
    const c = e[l];
    let p, _, h = -1, u = 0;
    for (; u < c.length && (a.lastIndex = u, _ = a.exec(c), _ !== null); ) u = a.lastIndex, a === Z ? _[1] === "!--" ? a = Ye : _[1] !== void 0 ? a = Xe : _[2] !== void 0 ? (bt.test(_[2]) && (s = RegExp("</" + _[2], "g")), a = L) : _[3] !== void 0 && (a = L) : a === L ? _[0] === ">" ? (a = s ?? Z, h = -1) : _[1] === void 0 ? h = -2 : (h = a.lastIndex - _[2].length, p = _[1], a = _[3] === void 0 ? L : _[3] === '"' ? Ze : Ge) : a === Ze || a === Ge ? a = L : a === Ye || a === Xe ? a = Z : (a = L, s = void 0);
    const v = a === L && e[l + 1].startsWith("/>") ? " " : "";
    n += a === Z ? c + qt : h >= 0 ? (o.push(p), c.slice(0, h) + ft + c.slice(h) + M + v) : c + M + (h === -2 ? l : v);
  }
  return [wt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class se {
  constructor({ strings: t, _$litType$: i }, o) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const l = t.length - 1, c = this.parts, [p, _] = Yt(t, i);
    if (this.el = se.createElement(p, o), V.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = V.nextNode()) !== null && c.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(ft)) {
          const u = _[a++], v = s.getAttribute(h).split(M), f = /([.?@])?(.*)/.exec(u);
          c.push({ type: 1, index: n, name: f[2], strings: v, ctor: f[1] === "." ? Gt : f[1] === "?" ? Zt : f[1] === "@" ? Qt : ue }), s.removeAttribute(h);
        } else h.startsWith(M) && (c.push({ type: 6, index: n }), s.removeAttribute(h));
        if (bt.test(s.tagName)) {
          const h = s.textContent.split(M), u = h.length - 1;
          if (u > 0) {
            s.textContent = ce ? ce.emptyScript : "";
            for (let v = 0; v < u; v++) s.append(h[v], ie()), V.nextNode(), c.push({ type: 2, index: ++n });
            s.append(h[u], ie());
          }
        }
      } else if (s.nodeType === 8) if (s.data === gt) c.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(M, h + 1)) !== -1; ) c.push({ type: 7, index: n }), h += M.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const o = j.createElement("template");
    return o.innerHTML = t, o;
  }
}
function Y(e, t, i = e, o) {
  if (t === D) return t;
  let s = o !== void 0 ? i._$Co?.[o] : i._$Cl;
  const n = oe(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(e), s._$AT(e, i, o)), o !== void 0 ? (i._$Co ??= [])[o] = s : i._$Cl = s), s !== void 0 && (t = Y(e, s._$AS(e, t.values), s, o)), t;
}
class Xt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: o } = this._$AD, s = (t?.creationScope ?? j).importNode(i, !0);
    V.currentNode = s;
    let n = V.nextNode(), a = 0, l = 0, c = o[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let p;
        c.type === 2 ? p = new X(n, n.nextSibling, this, t) : c.type === 1 ? p = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (p = new Jt(n, this, t)), this._$AV.push(p), c = o[++l];
      }
      a !== c?.index && (n = V.nextNode(), a++);
    }
    return V.currentNode = j, s;
  }
  p(t) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, i), i += o.strings.length - 2) : o._$AI(t[i])), i++;
  }
}
class X {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, o, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = o, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = Y(this, t, i), oe(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== D && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && oe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(j.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: o } = t, s = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = se.createElement(wt(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new Xt(s, this), a = n.u(this.options);
      n.p(i), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = Qe.get(t.strings);
    return i === void 0 && Qe.set(t.strings, i = new se(t)), i;
  }
  k(t) {
    Me(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, s = 0;
    for (const n of t) s === i.length ? i.push(o = new X(this.O(ie()), this.O(ie()), this, this.options)) : o = i[s], o._$AI(n), s++;
    s < i.length && (this._$AR(o && o._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const o = Ke(t).nextSibling;
      Ke(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ue {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, o, s, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = n, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = d;
  }
  _$AI(t, i = this, o, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = Y(this, t, i, 0), a = !oe(t) || t !== this._$AH && t !== D, a && (this._$AH = t);
    else {
      const l = t;
      let c, p;
      for (t = n[0], c = 0; c < n.length - 1; c++) p = Y(this, l[o + c], i, c), p === D && (p = this._$AH[c]), a ||= !oe(p) || p !== this._$AH[c], p === d ? t = d : t !== d && (t += (p ?? "") + n[c + 1]), this._$AH[c] = p;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Gt extends ue {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Zt extends ue {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Qt extends ue {
  constructor(t, i, o, s, n) {
    super(t, i, o, s, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = Y(this, t, i, 0) ?? d) === D) return;
    const o = this._$AH, s = t === d && o !== d || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== d && (o === d || s);
    s && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Jt {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Y(this, t);
  }
}
const ei = { I: X }, ti = Oe.litHtmlPolyfillSupport;
ti?.(se, X), (Oe.litHtmlVersions ??= []).push("3.3.3");
const ii = (e, t, i) => {
  const o = i?.renderBefore ?? t;
  let s = o._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    o._$litPart$ = s = new X(t.insertBefore(ie(), n), n, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = globalThis;
let N = class extends q {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ii(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
};
N._$litElement$ = !0, N.finalized = !0, Ne.litElementHydrateSupport?.({ LitElement: N });
const oi = Ne.litElementPolyfillSupport;
oi?.({ LitElement: N });
(Ne.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const si = { attribute: !0, type: String, converter: le, reflect: !1, hasChanged: De }, ni = (e = si, t, i) => {
  const { kind: o, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), o === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const c = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, c, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, e, l), l;
    } };
  }
  if (o === "setter") {
    const { name: a } = i;
    return function(l) {
      const c = this[a];
      t.call(this, l), this.requestUpdate(a, c, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function S(e) {
  return (t, i) => typeof i == "object" ? ni(e, t, i) : ((o, s, n) => {
    const a = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, o), a ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(e) {
  return S({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ai = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $t(e, t) {
  return (i, o, s) => {
    const n = (a) => a.renderRoot?.querySelector(e) ?? null;
    return ai(i, o, { get() {
      return n(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ze = { CHILD: 2, ELEMENT: 6 }, xt = (e) => (...t) => ({ _$litDirective$: e, values: t });
let At = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, o) {
    this._$Ct = t, this._$AM = i, this._$Ci = o;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ri } = ei, Je = (e) => e, li = (e) => e.strings === void 0, et = () => document.createComment(""), Q = (e, t, i) => {
  const o = e._$AA.parentNode, s = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const n = o.insertBefore(et(), s), a = o.insertBefore(et(), s);
    i = new ri(n, a, e, e.options);
  } else {
    const n = i._$AB.nextSibling, a = i._$AM, l = a !== e;
    if (l) {
      let c;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (c = e._$AU) !== a._$AU && i._$AP(c);
    }
    if (n !== s || l) {
      let c = i._$AA;
      for (; c !== n; ) {
        const p = Je(c).nextSibling;
        Je(o).insertBefore(c, s), c = p;
      }
    }
  }
  return i;
}, R = (e, t, i = e) => (e._$AI(t, i), e), ci = {}, di = (e, t = ci) => e._$AH = t, hi = (e) => e._$AH, ge = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = (e, t, i) => {
  const o = /* @__PURE__ */ new Map();
  for (let s = t; s <= i; s++) o.set(e[s], s);
  return o;
}, kt = xt(class extends At {
  constructor(e) {
    if (super(e), e.type !== ze.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let o;
    i === void 0 ? i = t : t !== void 0 && (o = t);
    const s = [], n = [];
    let a = 0;
    for (const l of e) s[a] = o ? o(l, a) : a, n[a] = i(l, a), a++;
    return { values: n, keys: s };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, o]) {
    const s = hi(e), { values: n, keys: a } = this.dt(t, i, o);
    if (!Array.isArray(s)) return this.ut = a, n;
    const l = this.ut ??= [], c = [];
    let p, _, h = 0, u = s.length - 1, v = 0, f = n.length - 1;
    for (; h <= u && v <= f; ) if (s[h] === null) h++;
    else if (s[u] === null) u--;
    else if (l[h] === a[v]) c[v] = R(s[h], n[v]), h++, v++;
    else if (l[u] === a[f]) c[f] = R(s[u], n[f]), u--, f--;
    else if (l[h] === a[f]) c[f] = R(s[h], n[f]), Q(e, c[f + 1], s[h]), h++, f--;
    else if (l[u] === a[v]) c[v] = R(s[u], n[v]), Q(e, s[h], s[u]), u--, v++;
    else if (p === void 0 && (p = tt(a, v, f), _ = tt(l, h, u)), p.has(l[h])) if (p.has(l[u])) {
      const x = _.get(a[v]), A = x !== void 0 ? s[x] : null;
      if (A === null) {
        const G = Q(e, s[h]);
        R(G, n[v]), c[v] = G;
      } else c[v] = R(A, n[v]), Q(e, s[h], A), s[x] = null;
      v++;
    } else ge(s[u]), u--;
    else ge(s[h]), h++;
    for (; v <= f; ) {
      const x = Q(e, c[f + 1]);
      R(x, n[v]), c[v++] = x;
    }
    for (; h <= u; ) {
      const x = s[h++];
      x !== null && ge(x);
    }
    return this.ut = a, di(e, c), D;
  }
}), ne = (e, t, i) => {
  e.dispatchEvent(
    new CustomEvent(t, { detail: i, bubbles: !0, composed: !0 })
  );
}, pi = (e, t) => ne(e, "hass-more-info", { entityId: t }), ui = (e, t, i = "var(--state-inactive-color, #9e9e9e)") => t === "unavailable" || t === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${e}-${t}-color, var(--state-icon-color, ${i}))`, vi = (e) => typeof e == "object" && e !== null && !Array.isArray(e), K = (e) => vi(e) && typeof e.action == "string", $e = (e) => e !== void 0 && e.action !== "none", Ie = (e) => {
  const t = (e ?? "").split(".");
  if (t.length !== 2) return null;
  const [i, o] = t;
  return !i || !o ? null : [i, o];
}, xe = (e, t, i) => ({
  action: "perform-action",
  perform_action: e,
  ...t ? { data: t } : {},
  ...i ? { target: i } : {}
}), Le = (e, t, i, o) => {
  switch (i.action) {
    case "none":
      return Promise.resolve();
    case "more-info": {
      const s = i.entity ?? o;
      return s && e && pi(e, s), Promise.resolve();
    }
    case "toggle": {
      const s = o;
      return s ? t.callService("homeassistant", "toggle", { entity_id: s }) : Promise.resolve();
    }
    case "navigate":
      return history.pushState(null, "", i.navigation_path), window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: !1 } })
      ), Promise.resolve();
    case "url":
      return window.open(i.url_path, "_blank", "noreferrer"), Promise.resolve();
    case "perform-action":
    case "call-service": {
      const s = i.action === "perform-action" ? i.perform_action : i.service, n = Ie(s);
      if (!n)
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${s}"`)
        );
      const [a, l] = n, c = i.action === "perform-action" ? i.data : i.data ?? i.service_data;
      return t.callService(a, l, c ?? {}, i.target);
    }
  }
}, C = {
  PAUSE: 1,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024
}, Tt = {
  up: "DPAD_UP",
  down: "DPAD_DOWN",
  left: "DPAD_LEFT",
  right: "DPAD_RIGHT",
  center: "DPAD_CENTER",
  home: "HOME",
  back: "BACK",
  menu: "MENU",
  power: "POWER",
  // v1 sent MUTE, not VOLUME_MUTE. Keep it.
  volume_mute: "MUTE",
  volume_up: "VOLUME_UP",
  volume_down: "VOLUME_DOWN",
  play_pause: "MEDIA_PLAY_PAUSE",
  next: "MEDIA_NEXT",
  previous: "MEDIA_PREVIOUS",
  // No media_player equivalent: its only seek service takes an absolute
  // position, which a TV cannot report. These are always key codes.
  rewind: "MEDIA_REWIND",
  fast_forward: "MEDIA_FAST_FORWARD"
}, mi = "text:", Et = (e, t) => {
  const i = e.entities?.[t.entity]?.device_id;
  if (!i) return null;
  for (const o of Object.values(e.entities ?? {}))
    if (o.device_id === i && o.entity_id.startsWith("media_player."))
      return o.entity_id;
  return null;
}, be = (e) => e === void 0 || e.state === "unavailable" || e.state === "unknown", _i = (e, t) => {
  const i = e.states?.[t.entity], o = Et(e, t), s = o ? e.states?.[o] : void 0, n = s?.attributes ?? {}, a = i?.attributes ?? {}, l = t.volume_entity ?? o, p = (t.volume_entity && t.volume_entity !== o ? e.states?.[t.volume_entity] : s)?.attributes ?? {}, _ = s && !be(s) ? s.state !== "off" : i?.state === "on";
  return {
    remoteId: t.entity,
    playerId: o,
    remote: i,
    player: s,
    found: i !== void 0,
    available: !be(i) && (s === void 0 || !be(s)),
    on: _,
    name: t.name ?? a.friendly_name ?? t.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read.
    appName: n.app_name ?? a.current_activity,
    appId: n.app_id,
    playing: s?.state === "playing",
    features: n.supported_features ?? 0,
    volumeId: l,
    volumeFeatures: p.supported_features ?? 0,
    volume: typeof p.volume_level == "number" ? p.volume_level : void 0,
    muted: typeof p.is_volume_muted == "boolean" ? p.is_volume_muted : void 0
  };
}, fi = /* @__PURE__ */ new Set([
  "off",
  "unavailable",
  "unknown",
  "idle",
  "standby",
  "none"
]), gi = (e, t) => {
  if (!t) return !1;
  const i = e.states?.[t]?.state;
  return i === void 0 ? !1 : !fi.has(i.toLowerCase());
}, F = (e, t) => (e.features & t) !== 0, it = (e, t) => (e.volumeFeatures & t) !== 0, ot = (e) => e.volume !== void 0, bi = (e, t) => {
  const i = Ie(t.service);
  return i ? e.callService(i[0], i[1], t.data ?? {}, t.target) : Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${t.service}"`)
  );
}, Re = (e, t, i) => e.callService("remote", "send_command", {
  entity_id: t.remoteId,
  command: i,
  // Home Assistant otherwise sleeps 400 ms after every command. A zero
  // delay preserves each rapid tap while the card's queue keeps its order.
  delay_secs: 0
}), ye = (e, t, i, o) => {
  const s = Tt[i];
  if (!s) return Promise.resolve();
  const n = o === "start" ? "START_LONG" : "END_LONG";
  return e.callService("remote", "send_command", {
    entity_id: t.remoteId,
    command: `${n}:${s}`,
    delay_secs: 0
  });
}, yi = (e, t, i) => Re(e, t, `${mi}${i}`), wi = (e, t, i, o, s) => {
  const n = t.overrides[o]?.tap_action;
  if ($e(n))
    return Le(s, e, n, i.remoteId);
  if (n && n.action === "none") return Promise.resolve();
  const a = i.playerId;
  switch (o) {
    case "power":
      return a && F(i, i.on ? C.TURN_OFF : C.TURN_ON) ? e.callService(
        "media_player",
        i.on ? "turn_off" : "turn_on",
        { entity_id: a }
      ) : e.callService("remote", i.on ? "turn_off" : "turn_on", {
        entity_id: i.remoteId
      });
    case "play_pause":
      if (a && F(i, C.PAUSE))
        return e.callService("media_player", "media_play_pause", {
          entity_id: a
        });
      break;
    case "next":
      if (a && F(i, C.NEXT_TRACK))
        return e.callService("media_player", "media_next_track", {
          entity_id: a
        });
      break;
    case "previous":
      if (a && F(i, C.PREVIOUS_TRACK))
        return e.callService("media_player", "media_previous_track", {
          entity_id: a
        });
      break;
    case "volume_up":
    case "volume_down":
      if (i.volumeId && it(i, C.VOLUME_STEP))
        return e.callService(
          "media_player",
          o === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: i.volumeId }
        );
      break;
    case "volume_mute":
      if (i.volumeId && i.muted !== void 0 && it(i, C.VOLUME_MUTE))
        return e.callService("media_player", "volume_mute", {
          entity_id: i.volumeId,
          is_volume_muted: !i.muted
        });
      break;
  }
  const l = Tt[o];
  return l ? Re(e, i, l) : Promise.resolve();
}, $i = (e, t, i, o) => {
  switch (i.action) {
    case "activity":
      return e.callService("remote", "turn_on", {
        entity_id: t.remoteId,
        activity: i.activity
      });
    case "app":
      return t.playerId ? e.callService("media_player", "play_media", {
        entity_id: t.playerId,
        media_content_type: "app",
        media_content_id: i.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found"
        )
      );
    case "key":
      return Re(e, t, i.key);
    // v1's shape.
    case "service":
      return bi(e, i);
    // Everything else is a Home Assistant action, run exactly as an override
    // would run it.
    default:
      return Le(o, e, i, t.remoteId);
  }
}, xi = (e) => {
  switch (e.action) {
    case "activity":
      return `Launch ${e.activity}`;
    case "app":
      return `Open app ${e.app_id}`;
    case "key":
      return `Send ${e.key}`;
    case "service":
      return `Call ${e.service}`;
    case "perform-action":
      return `Call ${e.perform_action}`;
    case "call-service":
      return `Call ${e.service}`;
    case "navigate":
      return `Go to ${e.navigation_path}`;
    case "url":
      return `Open ${e.url_path}`;
    case "toggle":
      return "Toggle the TV";
    case "more-info":
      return "Show more info";
    case "none":
      return "Do nothing";
  }
}, He = 1e3, Ae = 750, ke = 2e3;
class Ai {
  constructor() {
    this._state = "idle", this._session = 0;
  }
  get state() {
    return this._state;
  }
  get session() {
    return this._session;
  }
  /** Begin a fresh contact, invalidating every earlier timer token. */
  begin() {
    return this._session += 1, this._state = "pending", this._session;
  }
  /** Cross the hold threshold for this session exactly once. */
  hold(t) {
    if (!(t !== this._session || this._state !== "pending"))
      return this._state = "held", "start";
  }
  /** A physical release is a short tap while pending, or key-up while held. */
  release(t) {
    if (t === this._session) {
      if (this._state === "pending")
        return this._state = "idle", "short";
      if (this._state === "held")
        return this._state = "idle", "end";
    }
  }
  /** Cancellation suppresses a pending tap, but must release a held key. */
  cancel(t = this._session) {
    if (t === this._session) {
      if (this._state === "held")
        return this._state = "idle", "end";
      this._state === "pending" && (this._state = "idle");
    }
  }
}
const ki = ["buttons", "dpad", "touchpad"], Ti = ["repeat", "native", "none"], Ue = [
  "up",
  "down",
  "left",
  "right",
  "center",
  "home",
  "back",
  "menu",
  "previous",
  "rewind",
  "fast_forward",
  "next",
  "volume_up",
  "volume_down"
], Ei = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger"
}, Si = (e) => {
  const t = Ie(e);
  if (!t) return null;
  const i = Ei[t[0]];
  return i ? { service: `${t[0]}.${i}`, target: { entity_id: e } } : null;
}, g = {
  show_header: !0,
  show_power: !0,
  show_nav: !0,
  pad: "buttons",
  show_transport: !0,
  transport_buttons: ["previous", "rewind", "play_pause", "fast_forward", "next"],
  show_volume: !0,
  // Off by default: sending text needs a focused input on the TV *and*
  // `enable_ime` on the config entry, neither of which the card can detect.
  show_text_input: !1,
  show_apps: !0,
  apps_label: "Apps",
  show_section_labels: !1,
  app_columns: 5,
  hold_mode: "repeat",
  native_hold_buttons: [...Ue],
  native_touch_hold_delay_ms: He,
  haptics: !0
}, H = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, Te = Object.keys(H), St = (e) => {
  if (!e) return;
  const t = e.toLowerCase().replace(/[^a-z]/g, "");
  if (t)
    return Te.find((i) => t.includes(i) || i.includes(t));
}, Pt = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  center: "center",
  power: "power",
  home: "home",
  back: "back",
  favorite: "favorite",
  volumeup: "volume_up",
  volumedown: "volume_down",
  volumemute: "volume_mute"
}, Ct = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input"
}, Pi = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad"
}, k = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Dt = (e) => k(e) && typeof e.service == "string", st = (e, t) => {
  if (typeof e == "string") {
    const i = Si(e);
    if (i)
      return { tap_action: xe(i.service, void 0, i.target) };
    z(
      `override "${t}" points at ${e}, which cannot simply be pressed. Use an action config instead.`
    );
    return;
  }
  if (!k(e)) {
    e !== void 0 && z(`override "${t}" is not an entity id or an action config`);
    return;
  }
  if (K(e.tap_action) || K(e.hold_action) || K(e.double_tap_action)) {
    const i = {};
    for (const o of ["tap_action", "hold_action", "double_tap_action"]) {
      const s = e[o];
      K(s) && (i[o] = s);
    }
    return i;
  }
  if (Dt(e))
    return {
      tap_action: xe(
        e.service,
        k(e.data) ? e.data : void 0,
        k(e.target) ? e.target : void 0
      )
    };
  z(`override "${t}" is not an entity id or an action config`);
};
let nt = /* @__PURE__ */ new Set();
const z = (e) => {
  nt.has(e) || (nt.add(e), console.warn(`polr-android-tv-remote-card: ${e}`));
}, at = (e) => {
  if (typeof e == "string") {
    const n = H[e];
    return n ? {
      name: n.label,
      icon: `brand:${e}`,
      action: { action: "activity", activity: n.activity }
    } : (z(
      `unknown app "${e}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: e,
      icon: "mdi:application",
      action: { action: "activity", activity: e }
    });
  }
  if (!k(e)) return null;
  if (k(e.action))
    return e;
  const t = typeof e.icon == "string" ? e.icon : void 0, i = typeof e.name == "string" ? e.name : void 0, o = typeof e.color == "string" ? e.color : void 0, s = typeof e.entity == "string" ? e.entity : void 0;
  return Dt(e) ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    ...s ? { entity: s } : {},
    action: {
      action: "service",
      service: e.service,
      ...k(e.data) ? { data: e.data } : {},
      ...k(e.target) ? { target: e.target } : {}
    }
  } : typeof e.url == "string" ? {
    ...i ? { name: i } : {},
    ...t ? { icon: t } : {},
    ...o ? { color: o } : {},
    ...s ? { entity: s } : {},
    action: { action: "activity", activity: e.url }
  } : (z(`app entry has no action, url or service and was skipped: ${JSON.stringify(e)}`), null);
}, Ot = (e) => {
  if (!k(e))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const t = typeof e.entity == "string" ? e.entity : typeof e.entity_id == "string" ? e.entity_id : void 0;
  if (!t)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const i = typeof e.remote == "string" ? Pi[e.remote] : void 0;
  typeof e.remote == "string" && !i && z(`unknown remote style "${e.remote}" — falling back to ${g.pad}`);
  const o = ki.includes(e.pad) ? e.pad : i ?? g.pad, s = typeof e.volume == "boolean" ? e.volume : void 0, n = {};
  if (k(e.overrides))
    for (const [m, T] of Object.entries(e.overrides)) {
      const I = st(T, m);
      I && (n[m] = I);
    }
  for (const [m, T] of Object.entries(Pt)) {
    if (n[T]) continue;
    const I = st(e[m], m);
    I && (n[T] = I);
  }
  const a = {};
  for (const [m, T] of Object.entries(Ct))
    typeof e[m] == "boolean" && (a[T] = e[m]);
  const l = Array.isArray(e.transport_buttons) ? e.transport_buttons : Array.isArray(e.media_controls) ? e.media_controls : void 0, c = l ? l.filter(
    (m) => typeof m == "string" && g.transport_buttons.includes(m)
  ) : g.transport_buttons, p = (Array.isArray(e.sections) ? e.sections : []).map((m) => {
    if (!k(m))
      return z(`section is not an object and was skipped: ${JSON.stringify(m)}`), null;
    const T = (Array.isArray(m.buttons) ? m.buttons : []).map(at).filter((I) => I !== null);
    return {
      ...typeof m.name == "string" ? { name: m.name } : {},
      ...typeof m.columns == "number" && m.columns > 0 ? { columns: m.columns } : {},
      buttons: T
    };
  }).filter((m) => m !== null), h = (Array.isArray(e.apps) ? e.apps : []).map(at).filter((m) => m !== null), u = (m, T) => m === void 0 ? T : m, v = Ti.includes(e.hold_mode) ? e.hold_mode : e.hold_repeat === !1 ? "none" : g.hold_mode, f = new Set(Ue), x = Array.isArray(e.native_hold_buttons) ? [...new Set(e.native_hold_buttons)].filter(
    (m) => typeof m == "string" && f.has(m)
  ) : [...g.native_hold_buttons], A = e.native_touch_hold_delay_ms, G = typeof A == "number" && Number.isFinite(A) && A >= Ae && A <= ke ? A : g.native_touch_hold_delay_ms;
  return A !== void 0 && G !== A && z(
    `native_touch_hold_delay_ms must be between ${Ae} and ${ke}; using ${g.native_touch_hold_delay_ms}`
  ), {
    ...e,
    type: e.type,
    entity: t,
    ...typeof e.volume_entity == "string" ? { volume_entity: e.volume_entity } : {},
    ...typeof e.name == "string" ? { name: e.name } : {},
    show_header: u(e.show_header, g.show_header),
    show_power: u(e.show_power, g.show_power),
    show_nav: u(e.show_nav, a.show_nav ?? g.show_nav),
    pad: o,
    show_transport: u(e.show_transport, a.show_transport ?? g.show_transport),
    transport_buttons: c,
    show_volume: u(e.show_volume, a.show_volume ?? s ?? g.show_volume),
    show_text_input: u(
      e.show_text_input,
      a.show_text_input ?? g.show_text_input
    ),
    show_apps: u(e.show_apps, a.show_apps ?? g.show_apps),
    apps_label: typeof e.apps_label == "string" && e.apps_label.trim() ? e.apps_label.trim() : g.apps_label,
    show_section_labels: u(e.show_section_labels, g.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: n.favorite !== void 0,
    apps: h,
    sections: p,
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns: typeof e.app_columns == "number" && e.app_columns > 0 ? e.app_columns : g.app_columns,
    hold_mode: v,
    native_hold_buttons: x,
    native_touch_hold_delay_ms: G,
    // Keep the resolved legacy value truthful for old rendering paths and
    // third-party code that reads it from the editor's emitted config.
    hold_repeat: v === "repeat",
    haptics: u(e.haptics, g.haptics),
    overrides: n
  };
}, Ci = (e) => {
  const t = /* @__PURE__ */ new Set([
    "entity_id",
    "remote",
    "volume",
    "show_favorite",
    // Removed in v2: back/home/menu is always there.
    "show_navigation_row",
    // Removed: the player is always the one on the remote's own device.
    "media_player_entity",
    "showBasic",
    "media_controls",
    ...Object.keys(Ct),
    ...Object.keys(Pt)
  ]), i = {};
  for (const [o, s] of Object.entries(e))
    t.has(o) || (i[o] = s);
  return i;
}, W = (e) => Ft`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${e}" />
  </svg>
`, Ee = {
  disneyplus: W(
    "M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
  ),
  hbomax: W(
    "M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
  ),
  hulu: W(
    "m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
  ),
  netflix: W(
    "M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
  ),
  prime: W(
    "M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
  ),
  youtube: W(
    "M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
  )
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = (e, t) => {
  const i = e._$AN;
  if (i === void 0) return !1;
  for (const o of i) o._$AO?.(t, !1), te(o, t);
  return !0;
}, de = (e) => {
  let t, i;
  do {
    if ((t = e._$AM) === void 0) break;
    i = t._$AN, i.delete(e), e = t;
  } while (i?.size === 0);
}, Mt = (e) => {
  for (let t; t = e._$AM; e = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(e)) break;
    i.add(e), Mi(t);
  }
};
function Di(e) {
  this._$AN !== void 0 ? (de(this), this._$AM = e, Mt(this)) : this._$AM = e;
}
function Oi(e, t = !1, i = 0) {
  const o = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(o)) for (let n = i; n < o.length; n++) te(o[n], !1), de(o[n]);
  else o != null && (te(o, !1), de(o));
  else te(this, e);
}
const Mi = (e) => {
  e.type == ze.CHILD && (e._$AP ??= Oi, e._$AQ ??= Di);
};
class Ni extends At {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, o) {
    super._$AT(t, i, o), Mt(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), i && (te(this, t), de(this));
  }
  setValue(t) {
    if (li(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const rt = 500, lt = 220, ct = 40, zi = 15e3, dt = 500, ht = 750, Ii = 250, Li = 12, Ri = 24;
class Hi {
  claim(t) {
    if (this._active === t) return;
    const i = this._active;
    this._active = t, i?.cancelPress();
  }
  release(t) {
    this._active === t && (this._active = void 0);
  }
  cancel() {
    const t = this._active;
    this._active = void 0, t?.cancelPress();
  }
}
class Ui extends Ni {
  constructor(t) {
    if (super(t), this._repeats = 0, this._bound = !1, this._active = !1, this._resolved = !1, this._gestureId = 0, this._startX = 0, this._startY = 0, this._awaitingSecondTap = !1, this._native = new Ai(), this._onPointerDown = (i) => {
      if (i.button !== 0 || this._isDirectPointer(i.pointerType) && !i.isPrimary) return;
      const o = this._options;
      if (!o || o.disabled) return;
      const s = this._beginGesture(o, i.pointerType || "mouse");
      if (this._startX = i.clientX, this._startY = i.clientY, this._pointerId = i.pointerId, this._claimsTouch(o) && this._isDirectPointer(i.pointerType)) {
        i.preventDefault();
        try {
          this._element?.setPointerCapture(i.pointerId);
        } catch {
        }
      }
      if (this._armSafety(), this._isNative(o)) {
        const a = this._native.begin();
        this._nativeSession = a, this._holdTimer = window.setTimeout(
          () => this._startNative(s, a),
          this._nativeHoldDelay(o, this._pointerType)
        );
        return;
      }
      if (o.onHold) {
        this._holdTimer = window.setTimeout(() => {
          this._isCurrent(s) && (this._resolved = !0, this._fire(o.onHold, "medium", o));
        }, dt);
        return;
      }
      if (!o.repeat || !o.onPress) return;
      const n = o.onPress;
      this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
        this._isCurrent(s) && (this._resolved = !0, this._fire(n, "light", o), this._repeatTimer = window.setInterval(() => {
          if (!this._isCurrent(s) || this._repeats >= ct) {
            this.cancelPress();
            return;
          }
          this._repeats += 1, this._fire(n, "light", o);
        }, lt));
      }, rt);
    }, this._onPointerMove = (i) => {
      if (!this._active || this._pointerId !== void 0 && i.pointerId !== this._pointerId || this._native.state !== "idle") return;
      const o = i.clientX - this._startX, s = i.clientY - this._startY, n = this._claimsTouch(this._gestureOptions) ? Ri : Li;
      o * o + s * s > n * n && this.cancelPress();
    }, this._onPointerUp = (i) => {
      this._active && (this._pointerId !== void 0 && i.pointerId !== this._pointerId || this._release());
    }, this._onPointerCancel = (i) => {
      this._pointerId !== void 0 && i.pointerId !== this._pointerId || this.cancelPress();
    }, this._onWindowPointerUp = (i) => {
      this._onPointerUp(i);
    }, this._onWindowPointerCancel = (i) => {
      this._onPointerCancel(i);
    }, this._onWindowTouchEnd = (i) => {
      !this._active || !this._isDirectPointer(this._pointerType) || i.touches.length === 0 && this._release();
    }, this._onWindowTouchCancel = () => {
      this._active && this._isDirectPointer(this._pointerType) && this.cancelPress();
    }, this._onWindowMouseUp = (i) => {
      this._active && this._pointerType === "mouse" && i.button === 0 && this._release();
    }, this._onClick = (i) => {
      !this._active || this._pointerId === void 0 || (i.preventDefault(), this._release());
    }, this._onLostPointerCapture = (i) => {
      this._active && (this._pointerId !== void 0 && i.pointerId !== this._pointerId || this.cancelPress());
    }, this._onPointerLeave = () => {
      this._pointerId !== void 0 && this._element?.hasPointerCapture(this._pointerId) || this.cancelPress();
    }, this._onContextMenu = (i) => {
      i.preventDefault();
    }, this._onKeyDown = (i) => {
      if (i.key !== "Enter" && i.key !== " " || (i.preventDefault(), i.repeat)) return;
      const o = this._options;
      if (!o || o.disabled) return;
      const s = this._beginGesture(o, "keyboard");
      if (this._armSafety(), this._isNative(o)) {
        const a = this._native.begin();
        this._nativeSession = a, this._holdTimer = window.setTimeout(
          () => this._startNative(s, a),
          ht
        );
        return;
      }
      if (this._resolved = !0, this._tap(o), o.onHold) {
        this._holdTimer = window.setTimeout(() => {
          this._isCurrent(s) && this._fire(o.onHold, "medium", o);
        }, dt);
        return;
      }
      if (!o.repeat || !o.onPress) return;
      const n = o.onPress;
      this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
        this._repeatTimer = window.setInterval(() => {
          if (!this._isCurrent(s) || this._repeats >= ct) {
            this.cancelPress();
            return;
          }
          this._repeats += 1, this._fire(n, "light", o);
        }, lt);
      }, rt);
    }, this._onKeyUp = (i) => {
      i.key !== "Enter" && i.key !== " " || this._release();
    }, this.cancelPress = () => {
      this._active && (this._nativeSession !== void 0 ? this._finishNative(!1) : this._reset());
    }, this._onVisibilityChange = () => {
      document.hidden && this.cancelPress();
    }, t.type !== ze.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(t) {
    return D;
  }
  update(t, [i]) {
    if (this._element = t.element, i.disabled && this._active && this.cancelPress(), this._options = i, this._element.classList.toggle(
      "press-claim-touch",
      this._claimsTouch(i)
    ), !this._bound) {
      this._bound = !0;
      const o = this._element;
      o.addEventListener("pointerdown", this._onPointerDown), o.addEventListener("pointermove", this._onPointerMove), o.addEventListener("pointerup", this._onPointerUp), o.addEventListener("pointercancel", this._onPointerCancel), o.addEventListener("lostpointercapture", this._onLostPointerCapture), o.addEventListener("pointerleave", this._onPointerLeave), o.addEventListener("click", this._onClick), o.addEventListener("dragstart", this.cancelPress), o.addEventListener("keydown", this._onKeyDown), o.addEventListener("keyup", this._onKeyUp), o.addEventListener("blur", this.cancelPress), o.addEventListener("contextmenu", this._onContextMenu);
    }
    return D;
  }
  /* ------------------------------------------------------------------ state */
  _beginGesture(t, i) {
    return this._active && this.cancelPress(), t.coordinator?.claim(this), this._coordinator = t.coordinator, this._gestureOptions = t, this._active = !0, this._resolved = !1, this._pointerType = i, this._repeats = 0, this._gestureId += 1, this._element?.classList.add("pressed"), this._gestureId;
  }
  _isCurrent(t) {
    return this._active && t === this._gestureId;
  }
  _startNative(t, i) {
    if (!this._isCurrent(t) || this._native.hold(i) !== "start") return;
    const o = this._gestureOptions;
    o?.onPressStart && (this._resolved = !0, this._holdTimer = void 0, this._fireNative(o.onPressStart, "light", o), this._nativeTimer = window.setTimeout(() => {
      this._isCurrent(t) && this.cancelPress();
    }, zi));
  }
  /** Resolve a physical release as either one short tap or one native key-up. */
  _release() {
    if (!this._active) return;
    if (this._nativeSession !== void 0) {
      this._finishNative(!0);
      return;
    }
    const t = this._resolved, i = this._gestureOptions ?? this._options;
    this._reset(), !t && i && this._tap(i);
  }
  _finishNative(t) {
    const i = this._nativeSession, o = this._gestureOptions;
    if (i === void 0 || !o) {
      this._reset();
      return;
    }
    const s = t ? this._native.release(i) : this._native.cancel(i);
    this._reset(), s === "short" && o.onPress ? this._tap(o) : s === "end" && o.onPressEnd && this._fireNative(o.onPressEnd, void 0, o);
  }
  /* ------------------------------------------------------------------ firing */
  _tap(t) {
    if (!t.onPress) return;
    const i = t.onPress;
    if (!t.onDoubleTap) {
      this._fire(i, "light", t);
      return;
    }
    if (this._awaitingSecondTap) {
      window.clearTimeout(this._tapTimer), this._awaitingSecondTap = !1, this._fire(t.onDoubleTap, "light", t);
      return;
    }
    this._awaitingSecondTap = !0, this._tapTimer = window.setTimeout(() => {
      this._awaitingSecondTap = !1, this._fire(i, "light", t);
    }, Ii);
  }
  /** Never coalesce valid taps: transport ordering is handled by the card. */
  _fire(t, i, o) {
    o.haptics !== !1 && this._element && ne(this._element, "haptic", i), t();
  }
  _fireNative(t, i, o) {
    i && o.haptics !== !1 && this._element && ne(this._element, "haptic", i), t();
  }
  /* ---------------------------------------------------------------- teardown */
  _armSafety() {
    this._pointerId !== void 0 && (window.addEventListener("pointerup", this._onWindowPointerUp, !0), window.addEventListener("pointercancel", this._onWindowPointerCancel, !0), window.addEventListener("mouseup", this._onWindowMouseUp, !0), window.addEventListener("touchend", this._onWindowTouchEnd, !0), window.addEventListener("touchcancel", this._onWindowTouchCancel, !0)), window.addEventListener("pagehide", this.cancelPress), window.addEventListener("beforeunload", this.cancelPress), window.addEventListener("blur", this.cancelPress), document.addEventListener("freeze", this.cancelPress), document.addEventListener("visibilitychange", this._onVisibilityChange);
  }
  _reset() {
    const t = this._element, i = this._pointerId, o = this._pointerType, s = this._gestureId, n = this._coordinator;
    if (this._active = !1, this._resolved = !1, this._repeats = 0, this._nativeSession = void 0, this._gestureOptions = void 0, this._coordinator = void 0, t?.classList.remove("pressed"), n?.release(this), window.removeEventListener("pointerup", this._onWindowPointerUp, !0), window.removeEventListener("pointercancel", this._onWindowPointerCancel, !0), window.removeEventListener("mouseup", this._onWindowMouseUp, !0), window.removeEventListener("touchend", this._onWindowTouchEnd, !0), window.removeEventListener("touchcancel", this._onWindowTouchCancel, !0), window.removeEventListener("pagehide", this.cancelPress), window.removeEventListener("beforeunload", this.cancelPress), window.removeEventListener("blur", this.cancelPress), document.removeEventListener("freeze", this.cancelPress), document.removeEventListener("visibilitychange", this._onVisibilityChange), i !== void 0)
      try {
        t?.hasPointerCapture(i) && t.releasePointerCapture(i);
      } catch {
      }
    this._pointerId = void 0, this._pointerType = void 0, this._repeatTimer !== void 0 && (window.clearTimeout(this._repeatTimer), window.clearInterval(this._repeatTimer), this._repeatTimer = void 0), this._holdTimer !== void 0 && (window.clearTimeout(this._holdTimer), this._holdTimer = void 0), this._nativeTimer !== void 0 && (window.clearTimeout(this._nativeTimer), this._nativeTimer = void 0), t && this._isDirectPointer(o) && (t.blur(), window.setTimeout(() => {
      !this._active && this._gestureId === s && t.blur();
    }, 0));
  }
  _isNative(t) {
    return !!(t?.onPressStart && t.onPressEnd);
  }
  _claimsTouch(t) {
    return !!(t?.claimTouch || this._isNative(t));
  }
  _isDirectPointer(t) {
    return t === "touch" || t === "pen";
  }
  _nativeHoldDelay(t, i) {
    return this._isDirectPointer(i) ? t.nativeTouchHoldDelayMs ?? He : ht;
  }
  disconnected() {
    this.cancelPress(), this._tapTimer !== void 0 && (window.clearTimeout(this._tapTimer), this._tapTimer = void 0), this._awaitingSecondTap = !1;
  }
}
const U = xt(Ui), Nt = he`
  /*
   * Every section pads its own bottom and relies on the header for the top.
   * With the header hidden the first row sat flush against the card edge, so
   * the card supplies the padding itself in that case.
   */
  ha-card.headerless > *:first-child {
    padding-top: var(--ha-space-3, 12px);
  }

  /* --------------------------------------------------------- now playing -- */
  /* Brand logos are square art; match the kit's 24px --mdc-icon-size. */
  .tile-icon svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  /*
   * The pill stays tinted by state -- colour when on, grey when off, the same
   * language as every other tile card -- but the logo inside it does not. A
   * brand mark recoloured to Home Assistant's media-player purple reads as a
   * rendering bug, and the tinted pill already carries the state.
   */
  .tile-icon .brand-mark {
    display: flex;
    color: var(--primary-text-color);
  }

  /* ---------------------------------------------------------- nav region -- */
  .pad {
    /* Container queries, so the pad tracks the card and not the viewport. */
    container-type: inline-size;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }

  /*
   * The plus-shaped button pad.
   *
   * Keys are wide and short rather than square. A square key in a 3-column grid
   * is as tall as a third of the card is wide -- around 90px against the 40px
   * control buttons below it, which made the pad tower over everything else.
   * 52px is generous for a thumb, comfortably past the 44px touch-target
   * minimum, without that.
   *
   * Columns stretch to fill the card, so the pad lines up with the navigation,
   * transport, volume and app rows instead of floating in a centred 320px box.
   */
  .button-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .button-pad .pad-key {
    height: 52px;
  }
  .pad-key {
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    cursor: pointer;
    color: var(--primary-text-color);
    --mdc-icon-size: 24px;
    transition:
      box-shadow var(--duration) ease-in-out,
      transform var(--duration) ease-in-out;
  }
  /* Same tint recipe as the kit's .control-button, without its fixed 40px. */
  .pad-key::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .pad-key > * {
    position: relative;
  }
  .pad-key:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .pad-key.ok {
    border-radius: var(--radius-pill);
    color: var(--tile-color);
  }
  .pad-key.ok::before {
    background-color: var(--tile-color);
  }
  .pad-key.blank {
    visibility: hidden;
  }

  /* Circular d-pad. A CSS grid clipped to a circle rather than v1's rotated,
     skewed pie slices — those could not be focused, hit-tested unreliably at
     the seams, and carried a hardcoded #222222 puck invisible in light themes. */
  .dpad {
    position: relative;
    display: grid;
    grid-template-areas:
      ".    up    .    "
      "left ok    right"
      ".    down  .    ";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    aspect-ratio: 1;
    width: min(100%, 260px);
    margin: 0 auto;
    border-radius: var(--radius-pill);
    overflow: hidden;
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
  }
  .dpad .pad-key {
    height: 100%;
    border-radius: 0;
  }
  .dpad .pad-key::before {
    opacity: 0;
  }
  .dpad .pad-key.pressed::before {
    opacity: 0.18;
  }
  .dpad .pad-key:focus-visible {
    box-shadow: inset 0 0 0 2px var(--tile-color);
  }
  .dpad .up {
    grid-area: up;
  }
  .dpad .down {
    grid-area: down;
  }
  .dpad .left {
    grid-area: left;
  }
  .dpad .right {
    grid-area: right;
  }
  .dpad .ok {
    grid-area: ok;
    place-self: center;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-pill);
    background-color: var(--card-background-color, var(--ha-card-background, #fff));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    letter-spacing: 0.4px;
  }
  .dpad .ok::before {
    background-color: var(--tile-color);
    opacity: 0;
  }
  .dpad .ok.pressed::before {
    opacity: 0.2;
  }

  /* ------------------------------------------------------------ touchpad -- */
  /*
   * A swipe surface has to claim the gesture, so touch-action: none is
   * unavoidable -- every comparable card does the same. What it costs is page
   * scrolling: wherever the pad covers, a thumb drag moves the pointer instead
   * of the page.
   *
   * Softened two ways rather than surrendering up/down swipes to the browser:
   * the pad is shorter, and it leaves a gutter down each side. Together with
   * taps resolving on release -- which makes every button row draggable -- the
   * card is now scrollable from most of its area. The buttons pad avoids the
   * trade-off entirely for anyone who wants that.
   */
  .touchpad {
    position: relative;
    touch-action: none;
    aspect-ratio: 1 / 0.55;
    width: auto;
    margin: 0 var(--ha-space-5, 20px);
    border: none;
    padding: 0;
    border-radius: var(--radius-lg);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    overflow: hidden;
    cursor: pointer;
    outline: none;
  }
  .touchpad:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  /* Keeps the pad from reading as an empty grey hole before it is touched. */
  .touchpad-mark {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 40px;
    height: 40px;
    --mdc-icon-size: 40px;
    color: var(--secondary-text-color);
    opacity: 0.25;
    pointer-events: none;
    transition: opacity var(--duration) ease-in-out;
  }
  .touchpad-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    margin: -22px 0 0 -22px;
    border-radius: var(--radius-pill);
    background-color: var(--tile-color);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration) ease-in-out;
  }
  .touchpad-dot.visible {
    opacity: 0.35;
  }
  .touchpad-hint {
    position: absolute;
    inset: auto 0 var(--ha-space-3, 12px) 0;
    text-align: center;
    font-size: var(--ha-font-size-xs, 10px);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    pointer-events: none;
  }

  /* ----------------------------------------------------------- volume bar -- */
  .volume-bar {
    height: 3px;
    margin: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    border-radius: var(--radius-pill);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
    overflow: hidden;
  }
  .volume-bar > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background-color: var(--tile-color);
    transition: width var(--duration) ease-in-out;
  }
  /* Read-only by design: androidtv_remote supports VOLUME_STEP but not
     VOLUME_SET, so there is nothing to drag to. */
  .volume-bar.muted > span {
    filter: grayscale(1);
    opacity: 0.4;
  }

  /* ------------------------------------------------------------ app grid -- */
  /*
   * A fixed number of columns, so a button is the same width whether there are
   * two apps or ten, and a sixth app wraps onto a second row aligned with the
   * first. Buttons stretch to fill the card like every other control row.
   *
   * The earlier failure this avoids: sizing columns to the app *count* made two
   * apps into two half-card-wide logos.
   */
  .app-grid {
    display: grid;
    grid-template-columns: repeat(var(--app-per-row, 5), 1fr);
    /* Matches the kit's .features gap, so the app row lines up with the
       navigation, transport and volume rows above it. */
    gap: 12px;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .app-tile {
    /* Same 40px height as every other control row, rather than a big square.
       Square tiles scale their logo with the card, so two apps in a wide card
       became two enormous logos; a fixed size keeps the app row reading as a
       row of buttons, which is what it is. */
    width: 100%;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    height: 40px;
    margin: 0;
    padding: 8px;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    cursor: pointer;
    color: var(--primary-text-color);
    --mdc-icon-size: 24px;
    transition:
      box-shadow var(--duration) ease-in-out,
      transform var(--duration) ease-in-out;
  }
  .app-tile::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--app-color, var(--disabled-color, #9e9e9e));
    opacity: 0.2;
    transition: opacity var(--duration) ease-in-out;
  }
  /*
   * A tile bound to an entity that is on, tinted like the header pill so that
   * "this is on" reads the same everywhere on the card. Tiles with no entity
   * never get this class.
   */
  .app-tile.active {
    color: var(--app-color, var(--tile-color));
  }
  .app-tile.active::before {
    background-color: var(--app-color, var(--tile-color));
    opacity: 0.25;
  }
  .app-tile:focus-visible {
    box-shadow: 0 0 0 2px var(--app-color, var(--tile-color));
  }
  .app-tile > * {
    position: relative;
  }
  /* Logos are square art in a wider button, so height is the constraint. */
  .app-tile svg,
  .app-tile img {
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 24px;
    object-fit: contain;
  }
  .app-tile svg {
    fill: currentColor;
  }

  /* ---------------------------------------------------------- text input -- */
  .text-row {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .text-row input {
    flex: 1 1 auto;
    min-width: 0;
    height: 40px;
    padding: 0 var(--ha-space-3, 12px);
    border: none;
    border-radius: var(--radius-md);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
    color: var(--primary-text-color);
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    outline: none;
  }
  .text-row input:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .text-row .control-button {
    flex: 0 0 auto;
    width: 40px;
    padding: 0;
  }

  /* --------------------------------------------------------- press state -- */
  /*
   * This class exists before pointerdown, which is when the browser decides
   * whether a direct gesture belongs to page scrolling. Remote controls own
   * the contact; app tiles deliberately do not, so the app list remains a
   * convenient place to scroll the dashboard.
   */
  .press-claim-touch {
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .pressed {
    transform: scale(0.94);
  }
  .pad-key.pressed::before,
  .app-tile.pressed::before {
    opacity: 0.4;
  }

  /* Android WebView can keep :hover after a tap. Hover feedback is therefore
     available only on devices that really have a fine, hovering pointer. */
  @media (hover: hover) and (pointer: fine) {
    .pad-key:hover:not(.pressed)::before {
      opacity: 0.3;
    }
    .dpad .pad-key:hover:not(.pressed)::before {
      opacity: 0.18;
    }
    .dpad .ok:hover:not(.pressed)::before {
      opacity: 0.2;
    }
    .touchpad:hover .touchpad-mark {
      opacity: 0.35;
    }
    .app-tile:hover:not(.pressed)::before {
      opacity: 0.32;
    }
    .app-tile.active:hover:not(.pressed)::before {
      opacity: 0.35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pressed {
      transform: none;
    }
    .pad-key,
    .app-tile,
    .touchpad-dot,
    .volume-bar > span {
      transition: none;
    }
  }
`, Ve = he`
  :host {
    /* Mirrors hui-tile-card: inactive by default, state colour when active. */
    --tile-color: var(--state-inactive-color, #9e9e9e);

    --ha-space-1: var(--ha-space-1, 4px);
    --radius-md: var(--ha-border-radius-md, 8px);
    --radius-lg: var(--ha-border-radius-lg, 12px);
    --radius-pill: var(--ha-border-radius-pill, 9999px);
    --duration: 180ms;
  }

  ha-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ----------------------------------------------------- tile content row -- */
  .tile {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    min-height: 56px;
    gap: 10px;
    box-sizing: border-box;
  }

  .tile-icon {
    position: relative;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-pill);
    overflow: hidden;
    color: var(--tile-color);
    --mdc-icon-size: 24px;
    transition:
      transform var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .tile-icon::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--tile-color);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .tile-icon ha-icon {
    position: relative;
    display: flex;
  }
  .tile-icon.interactive {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .tile-icon.interactive:active {
    transform: scale(1.2);
  }
  .tile-icon:focus {
    outline: none;
  }
  .tile-icon:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  /* hui-tile-card pulses the icon for lock.jammed. */
  .tile-icon.pulse {
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tile-icon.pulse {
      animation: none;
    }
    .spin {
      animation: none;
    }
  }

  .tile-info {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  /* ha-tile-info makes these flex rows and puts the ellipsis on an inner span;
     centring the line box this way avoids the half-pixel drift you get from
     relying on line-height alone. */
  .primary,
  .secondary {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  }
  .primary > span,
  .secondary > span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .primary {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
  }
  .secondary {
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-normal, 400);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .primary.muted {
    color: var(--secondary-text-color);
    font-style: italic;
  }
  .primary.code {
    font-family: var(--ha-font-family-code, ui-monospace, SFMono-Regular, monospace);
    letter-spacing: 0.18em;
  }
  .strike {
    text-decoration: line-through;
    opacity: 0.6;
  }

  /* ------------------------------------------------- control buttons ------- */
  .features {
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
  }
  .control-button {
    position: relative;
    overflow: hidden;
    flex: 1 1 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    padding: 8px;
    margin: 0;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
    --mdc-icon-size: 20px;
    transition:
      box-shadow var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .control-button::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
    transition:
      background-color var(--duration) ease-in-out,
      opacity var(--duration) ease-in-out;
  }
  .control-button > * {
    position: relative;
  }
  .control-button:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .control-button:disabled {
    cursor: not-allowed;
    color: var(--disabled-text-color);
  }
  .control-button:disabled::before {
    opacity: 0.1;
  }
  .control-button.accent {
    color: var(--primary-color);
  }
  .control-button.accent::before {
    background-color: var(--primary-color);
  }
  .control-button.destructive {
    color: var(--error-color, #db4437);
  }
  .control-button.destructive::before {
    background-color: var(--error-color, #db4437);
  }
  .control-button.wide {
    width: 100%;
  }

  /* Square icon-only variant of a control button. */
  .icon-button {
    position: relative;
    overflow: hidden;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
    transition:
      box-shadow var(--duration) ease-in-out,
      color var(--duration) ease-in-out;
  }
  .icon-button::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0;
    transition: opacity var(--duration) ease-in-out;
  }
  .icon-button ha-icon {
    position: relative;
  }
  .icon-button:focus-visible {
    box-shadow: 0 0 0 2px var(--tile-color);
  }
  .icon-button:disabled {
    cursor: not-allowed;
    color: var(--disabled-text-color);
  }
  /* Touch WebViews commonly latch :hover until another element is touched.
     Restrict hover-only paint to hardware that can actually hover. */
  @media (hover: hover) and (pointer: fine) {
    .tile-icon.interactive:hover::before {
      opacity: 0.35;
    }
    .control-button:hover:not(:disabled)::before {
      opacity: 0.3;
    }
    .icon-button:hover:not(:disabled) {
      color: var(--primary-text-color);
    }
    .icon-button:hover:not(:disabled)::before {
      opacity: 0.2;
    }
    .icon-button.danger:hover:not(:disabled) {
      color: var(--error-color, #db4437);
    }
  }
  .spin {
    animation: spin 900ms linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ------------------------------------------------------------ sections -- */
  .section-head {
    display: flex;
    align-items: center;
    min-height: 40px;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-3, 12px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .section-head .count {
    text-transform: none;
    letter-spacing: 0.4px;
    font-weight: var(--ha-font-weight-normal, 400);
  }
  .section-head .grow {
    flex: 1 1 auto;
  }
  .section-head .icon-button {
    width: 32px;
    height: 32px;
    --mdc-icon-size: 20px;
  }

  ul.list {
    list-style: none;
    margin: 0;
    padding: 0 var(--ha-space-2, 8px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
  }
  li.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    min-height: 56px;
    padding: 0 var(--ha-space-1, 4px) 0 10px;
    border-radius: var(--radius-lg);
    box-sizing: border-box;
    /* Neutral surface on purpose: --tile-color signals entity state, and a list
       row is not the entity. Tinting every row swamps the card. */
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
  }
  li.row.inactive .primary {
    text-decoration: line-through;
    opacity: 0.6;
  }
  li.row.empty {
    background-color: transparent;
    border: 1px dashed rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.14);
  }

  /* Slot/user number, styled as a tile icon. */
  .slot-badge {
    position: relative;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 var(--ha-space-2, 8px);
    border-radius: var(--radius-pill);
    overflow: hidden;
    box-sizing: border-box;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
  }
  .slot-badge::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--disabled-color, #9e9e9e);
    opacity: 0.2;
  }
  /* Opt in to state colour where a badge really does represent the entity. */
  .slot-badge.accent {
    color: var(--tile-color);
  }
  .slot-badge.accent::before {
    background-color: var(--tile-color);
  }
  .slot-badge span {
    position: relative;
  }

  /*
   * .tile-icon and .chip were written for a div and a span, but both have
   * interactive variants and so get rendered as <button>. Neither resets the
   * UA's button chrome, which shows through as a 2px outset border and a
   * ButtonFace background — and with a pill radius plus overflow: hidden, that
   * border becomes a partial ring around the icon.
   *
   * .control-button and .icon-button already reset their own; these are the two
   * that were missed.
   */
  button.tile-icon,
  button.chip {
    margin: 0;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  button.tile-icon {
    padding: 0;
    background: none;
  }

  /* ---------------------------------------------------------------- chips -- */
  .chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ha-space-1, 4px);
    margin-top: 2px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: 20px;
    padding: 0 var(--ha-space-2, 8px);
    border-radius: var(--radius-pill);
    font-size: var(--ha-font-size-xs, 10px);
    font-weight: var(--ha-font-weight-medium, 500);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
    --mdc-icon-size: 13px;
  }
  .chip.accent {
    color: var(--primary-color);
    background-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.16);
  }
  .chip.warn {
    color: var(--error-color, #db4437);
    background-color: rgba(219, 68, 55, 0.16);
  }
  .chip button {
    display: grid;
    place-items: center;
    margin: 0 -3px 0 1px;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    --mdc-icon-size: 13px;
  }

  /* ----------------------------------------------------------------- form -- */
  /* A form rendered inline inside a list, directly under its row. */
  li.form-host {
    list-style: none;
    display: block;
  }
  li.form-host .form {
    margin: 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
    margin: 0 var(--ha-space-2, 8px);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--radius-lg);
    background-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
  }
  .form-title {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--ha-space-3, 12px);
  }
  label.field {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-s, 12px);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  label.field input,
  label.field select {
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    height: 40px;
    padding: 0 10px;
    border-radius: var(--radius-md);
    box-sizing: border-box;
    color: var(--primary-text-color);
    background-color: var(--card-background-color, #fff);
    border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.2);
    transition: box-shadow var(--duration) ease-in-out;
  }
  label.field input:focus,
  label.field select:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--primary-color);
  }
  label.check {
    flex-direction: row;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    align-self: end;
    height: 40px;
    font-size: var(--ha-font-size-m, 14px);
    color: var(--primary-text-color);
  }
  .form-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
  }
  .form-actions .control-button {
    flex: 0 0 auto;
    min-width: 88px;
  }
  .hint {
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }

  /* -------------------------------------------------------------- notices -- */
  .notice {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--ha-space-2, 8px);
    margin: 0 var(--ha-space-2, 8px);
    padding: 10px var(--ha-space-3, 12px);
    border-radius: var(--radius-lg);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-condensed, 1.2);
    letter-spacing: 0.4px;
    --mdc-icon-size: 18px;
  }
  .notice.error {
    color: var(--error-color, #db4437);
    background-color: rgba(219, 68, 55, 0.12);
  }
  .notice.warn {
    color: var(--warning-color, #ff9800);
    background-color: rgba(255, 152, 0, 0.12);
  }
  .notice ha-icon {
    flex: 0 0 auto;
  }
  .notice .grow {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .empty-state {
    padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
    text-align: center;
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    letter-spacing: 0.1px;
    color: var(--secondary-text-color);
  }

  /* Whichever element ends the card supplies the bottom breathing room. */
  .tail,
  ul.list:last-child,
  .empty-state:last-child,
  .form:last-child,
  .notice:last-child {
    margin-bottom: var(--ha-space-3, 12px);
  }

  .skeleton {
    height: 56px;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      90deg,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05) 25%,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1) 37%,
      rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05) 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.3s ease infinite;
  }
  @keyframes shimmer {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton {
      animation: none;
    }
  }
`;
var Vi = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, P = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? ji(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (o ? a(t, i, s) : a(s)) || s);
  return o && s && Vi(t, i, s), s;
};
const pt = 0.06, Bi = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let $ = class extends N {
  constructor() {
    super(...arguments), this.pad = "buttons", this.repeat = !0, this.nativeButtons = [], this.haptics = !0, this.nativeTouchHoldDelayMs = He, this._tracking = !1, this._startX = 0, this._startY = 0, this._onPointerDown = (e) => {
      e.button === 0 && (e.preventDefault(), this._touchpad?.setPointerCapture(e.pointerId), this._startX = e.clientX, this._startY = e.clientY, this._tracking = !0, this._moveDot(e));
    }, this._onPointerMove = (e) => {
      this._tracking && (e.preventDefault(), this._moveDot(e));
    }, this._onPointerUp = (e) => {
      if (!this._tracking) return;
      this._tracking = !1;
      const t = this._touchpad;
      if (!t) return;
      const i = t.getBoundingClientRect(), o = (e.clientX - this._startX) / i.width, s = (e.clientY - this._startY) / i.height;
      if (Math.abs(o) < pt && Math.abs(s) < pt) {
        this._emit("center");
        return;
      }
      Math.abs(o) >= Math.abs(s) ? this._emit(o < 0 ? "left" : "right") : this._emit(s < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (e) => {
      const t = Bi[e.key];
      t && (e.preventDefault(), this._emit(t));
    };
  }
  _emit(e, t = "short") {
    ne(this, "atv-nav", { direction: e, phase: t });
  }
  _pressOptions(e) {
    return this.nativeButtons.includes(e) ? {
      onPress: () => this._emit(e),
      onPressStart: () => this._emit(e, "start"),
      onPressEnd: () => this._emit(e, "end"),
      haptics: this.haptics,
      claimTouch: !0,
      nativeTouchHoldDelayMs: this.nativeTouchHoldDelayMs,
      coordinator: this.pressCoordinator
    } : {
      onPress: () => this._emit(e),
      repeat: this.repeat && e !== "center",
      haptics: this.haptics,
      claimTouch: !0,
      coordinator: this.pressCoordinator
    };
  }
  _key(e, t, i, o = "") {
    return r`
      <button
        class="pad-key ${o}"
        type="button"
        aria-label=${i}
        ${U(this._pressOptions(e))}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _blank() {
    return r`<span class="pad-key blank" aria-hidden="true"></span>`;
  }
  /**
   * A plus-shaped button pad.
   *
   * v1 packed power, home, back and favourite into the four corners of this
   * grid, which is why it had to suppress the separate navigation row. Keeping
   * the pad purely directional means one obvious home for each control, and no
   * setting to reconcile the two.
   */
  _renderButtons() {
    return r`
      <div class="button-pad" role="group" aria-label="Directional pad">
        ${this._blank()} ${this._key("up", "mdi:chevron-up", "Up")} ${this._blank()}
        ${this._key("left", "mdi:chevron-left", "Left")}
        ${this._key("center", "mdi:circle", "Select", "ok")}
        ${this._key("right", "mdi:chevron-right", "Right")}
        ${this._blank()} ${this._key("down", "mdi:chevron-down", "Down")} ${this._blank()}
      </div>
    `;
  }
  _renderDpad() {
    return r`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${U(this._pressOptions("center"))}
        >
          <span>OK</span>
        </button>
        ${this._key("right", "mdi:chevron-right", "Right", "right")}
        ${this._key("down", "mdi:chevron-down", "Down", "down")}
      </div>
    `;
  }
  /**
   * Swipe to move, tap to select.
   *
   * `role="application"` plus arrow-key handling, because a swipe surface is
   * otherwise completely unusable from a keyboard — which is what v1 shipped.
   */
  _renderTouchpad() {
    return r`
      <div
        class="touchpad"
        role="application"
        tabindex="0"
        aria-label="Touchpad: swipe to move, tap to select, or use the arrow keys"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
      >
        <ha-icon class="touchpad-mark" icon="mdi:gesture-swipe"></ha-icon>
        <span class="touchpad-dot ${this._tracking ? "visible" : ""}"></span>
        <span class="touchpad-hint">swipe to move · tap to select</span>
      </div>
    `;
  }
  _moveDot(e) {
    const t = this._touchpad, i = this._dot;
    if (!t || !i) return;
    const o = t.getBoundingClientRect();
    i.style.transform = `translate(${e.clientX - o.left}px, ${e.clientY - o.top}px)`;
  }
  render() {
    return r`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
$.styles = [Ve, Nt];
P([
  S({ type: String })
], $.prototype, "pad", 2);
P([
  S({ type: Boolean })
], $.prototype, "repeat", 2);
P([
  S({ attribute: !1 })
], $.prototype, "nativeButtons", 2);
P([
  S({ type: Boolean })
], $.prototype, "haptics", 2);
P([
  S({ type: Number })
], $.prototype, "nativeTouchHoldDelayMs", 2);
P([
  S({ attribute: !1 })
], $.prototype, "pressCoordinator", 2);
P([
  $t(".touchpad")
], $.prototype, "_touchpad", 2);
P([
  $t(".touchpad-dot")
], $.prototype, "_dot", 2);
P([
  b()
], $.prototype, "_tracking", 2);
$ = P([
  ve("polr-atv-nav-pad")
], $);
const E = (e) => new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" }).format(new Date(e * 1e3)), J = (e = /* @__PURE__ */ new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(e);
function we(e) {
  const [t, i, o] = e.split("-").map(Number), s = (n) => {
    let a = n;
    for (let l = 0; l < 3; l++) {
      const c = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(a)), p = Object.fromEntries(c.map((_) => [_.type, Number(_.value)]));
      a += n - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    }
    return a / 1e3;
  };
  return [s(Date.UTC(t, i - 1, o)), s(Date.UTC(t, i - 1, o + 1))];
}
function Wi(e, t, i) {
  const o = (n) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), s = o(i.trim());
  return e.filter((n) => (t === "all" || (t === "favorites" ? n.favorite : n.kind === t)) && o(`${n.number} ${n.name}`).includes(s));
}
function qi(e, t) {
  return e.end > e.start ? Math.max(0, Math.min(100, (t - e.start) / (e.end - e.start) * 100)) : 0;
}
function Ki(e, t, i) {
  return { left: Math.max(0, (e.start - t) / (i - t) * 100), width: Math.max(0, (Math.min(i, e.end) - Math.max(t, e.start)) / (i - t) * 100) };
}
var Fi = Object.defineProperty, Yi = Object.getOwnPropertyDescriptor, w = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? Yi(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (o ? a(t, i, s) : a(s)) || s);
  return o && s && Fi(t, i, s), s;
};
let y = class extends N {
  constructor() {
    super(...arguments), this.channels = [], this.programs = [], this.query = "", this.filter = "all", this.mode = "list", this.day = J(), this.error = "", this.loading = !1, this.now = Date.now() / 1e3, this.lastDay = J(), this.missing = 0, this.loaded = "", this.requestId = 0, this.scrolled = "";
  }
  setConfig(e) {
    if (!e.entity) throw new Error("Configura la entidad de contexto de la TV");
    this.config = { ...e, entity: e.entity }, this.loaded = "";
  }
  getCardSize() {
    return this.config?.compact ? 4 : 12;
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = setInterval(() => {
      this.now = Date.now() / 1e3;
    }, 3e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer), this.requestId++, this.loaded = "", this.loading = !1;
  }
  get context() {
    return this.hass?.states[this.config?.entity ?? ""]?.attributes ?? {};
  }
  updated(e) {
    const t = this.shadowRoot?.querySelector("select");
    t && (t.value = this.context.channel?.key ?? "");
    const i = `${this.context.entry_id}:${this.context.guide_revision}:${this.day}:${this.config?.compact}`;
    if (this.hass && this.context.entry_id && i !== this.loaded && !this.loading && (this.loaded = i, this.load()), this.mode === "guide" && !this.loading && this.scrolled !== this.day) {
      const o = this.shadowRoot?.querySelector(".timeline");
      if (o) {
        const [s, n] = we(this.day);
        o.scrollLeft = Math.max(0, (this.now - s - 1800) / (n - s) * 2880), this.scrolled = this.day;
      }
    }
  }
  async load() {
    const e = ++this.requestId;
    this.loading = !0, this.error = "";
    try {
      const t = this.context.entry_id, [i, o] = we(this.day), [s, n] = await Promise.all([
        this.hass.callWS({ type: "tv_guide/catalog", entry_id: t }),
        this.config?.compact ? Promise.resolve({ programs: [], available_end: 0 }) : this.hass.callWS({ type: "tv_guide/epg", entry_id: t, start: i, end: o })
      ]);
      if (e !== this.requestId) return;
      this.channels = s.channels, this.programs = n.programs, this.missing = s.missing_favorites.length, n.available_end && (this.lastDay = J(new Date(Math.min(n.available_end * 1e3, Date.now() + 6 * 864e5))));
    } catch (t) {
      e === this.requestId && (this.error = t.message || "No se pudo cargar la guía");
    } finally {
      e === this.requestId && (this.loading = !1);
    }
  }
  async service(e, t) {
    this.error = "";
    try {
      await this.hass.callService("tv_guide", e, { entry_id: this.context.entry_id, ...t }), e === "refresh" && (this.loaded = "", this.requestUpdate());
    } catch (i) {
      this.error = i.message || "No se pudo completar la acción";
    }
  }
  tune(e) {
    this.service("tune_channel", { channel_key: e });
  }
  favorite(e) {
    this.service("set_favorite", { channel_key: e.key, favorite: !e.favorite });
  }
  navigate(e) {
    history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed"));
  }
  async details(e) {
    this.selected = e, await this.updateComplete, this.shadowRoot?.querySelector("dialog")?.showModal();
  }
  channelRow(e) {
    const t = this.programs.find((i) => i.channel === e.key && i.start <= this.now && this.now < i.end) ?? (e.current && e.current.start <= this.now && this.now < e.current.end ? e.current : void 0);
    return r`<div class="channel ${this.context.channel?.key === e.key ? "active" : ""}">
      <button class="station" @click=${() => this.tune(e.key)} aria-label=${`Ver ${e.option}`}><span class="dial">${e.number}</span><span><strong>${e.name}</strong><small>${t?.title ?? "Programación no disponible"}</small></span></button>
      ${t ? r`<button class="icon" @click=${() => this.details(t)} aria-label=${`Información de ${t.title}`}><ha-icon icon="mdi:information-outline"></ha-icon></button>` : d}
      <button class="icon star" aria-label=${`${e.favorite ? "Quitar" : "Añadir"} ${e.name} ${e.favorite ? "de" : "a"} favoritos`} aria-pressed=${e.favorite} @click=${() => this.favorite(e)}><ha-icon icon=${e.favorite ? "mdi:star" : "mdi:star-outline"}></ha-icon></button>
    </div>`;
  }
  compact() {
    const e = this.context, t = e.current, i = this.channels.filter((o) => o.favorite);
    return r`
      ${e.kind === "tv" && e.channel ? r`<div class="now-playing"><div class="eyebrow">AHORA EN ${e.channel.name}</div><h3>${t?.title ?? "Programación no disponible"}</h3>
        ${t ? r`<div class="time-range"><span>${E(t.start)}</span><span>${E(t.end)}</span></div><progress max="100" value=${qi(t, this.now)} aria-label="Progreso del programa"></progress><button class="text-button" @click=${() => this.details(t)}>Ver información</button>` : d}
        ${(e.next ?? []).length ? r`<div class="next">${e.next.map((o) => r`<button @click=${() => this.details(o)}><time>${E(o.start)}</time><span>${o.title}</span></button>`)}</div>` : d}
        <button class="text-button" @click=${() => {
      const o = this.channels.find((s) => s.key === e.channel.key);
      o && this.favorite(o);
    }}><ha-icon icon=${e.favorite ? "mdi:star" : "mdi:star-outline"}></ha-icon>${e.favorite ? "Quitar de favoritos" : "Añadir canal a favoritos"}</button>
      </div>` : d}
      <div class="section-title">Favoritos</div>
      ${i.length ? r`<div class="favorites">${i.map((o) => r`<button @click=${() => this.tune(o.key)} class=${e.channel?.key === o.key ? "chosen" : ""}>${o.number} · ${o.name}</button>`)}</div>` : r`<p class="hint">Marca una estrella en la lista para guardar los canales de casa.</p>`}
      <label class="select-label">Cambiar de canal<select aria-label="Seleccionar canal" .value=${e.channel?.key ?? ""} @change=${(o) => {
      const s = o.target;
      s.value && this.tune(s.value), s.value = e.channel?.key ?? "";
    }}><option value="">Selecciona un canal…</option>${this.channels.map((o) => r`<option value=${o.key}>${o.option}${o.kind === "radio" ? " · Radio" : ""}</option>`)}</select></label>
      <button class="primary" @click=${() => this.navigate(this.config?.guide_path ?? "/mando-tv/guia")}><ha-icon icon="mdi:television-guide"></ha-icon>Canales y guía</button>`;
  }
  full() {
    const e = Wi(this.channels, this.filter, this.query), [t, i] = we(this.day);
    return r`<header><div><h2>Canales y guía</h2><p>${this.channels.filter((o) => o.kind === "tv").length} canales de TV · ${this.channels.filter((o) => o.kind === "radio").length} de radio</p></div><button class="text-button" @click=${() => this.navigate("/mando-tv/mando")}>Volver al mando</button></header>
      <div class="tools"><input type="search" aria-label="Buscar canal o dial" placeholder="Buscar canal o dial" .value=${this.query} @input=${(o) => this.query = o.target.value}>
        <div class="pills" role="group" aria-label="Tipo de canal">${[["all", "Todos"], ["tv", "Televisión"], ["radio", "Radio"], ["favorites", "Favoritos"]].map(([o, s]) => r`<button aria-pressed=${this.filter === o} @click=${() => this.filter = o}>${s}</button>`)}</div></div>
      <div class="toolbar"><div class="pills" role="group" aria-label="Presentación">${[["list", "Lista"], ["guide", "Guía"]].map(([o, s]) => r`<button aria-pressed=${this.mode === o} @click=${() => {
      this.mode = o, this.scrolled = "";
    }}> ${s} </button>`)}</div>
        ${this.mode === "guide" ? r`<input type="date" aria-label="Fecha de la guía" .value=${this.day} min=${J()} max=${this.lastDay} @change=${(o) => {
      const s = o.target.value;
      s && (this.day = s, this.scrolled = "");
    }}><button class="text-button" @click=${() => {
      this.day = J(), this.scrolled = "";
    }}>Ahora</button>` : d}
        <button class="icon" aria-label="Actualizar catálogo y programación" @click=${() => void this.service("refresh", {})}><ha-icon icon="mdi:refresh"></ha-icon></button></div>
      ${this.mode === "list" ? r`<div class="channel-list">${kt(e, (o) => o.key, (o) => this.channelRow(o))}</div>` : r`
        <div class="timeline"><div class="ruler"><div class="sticky">${this.day.split("-").reverse().join("/")}</div><div class="hours">${Array.from({ length: Math.round((i - t) / 3600) }, (o, s) => r`<span style=${`left:${s * 3600 / (i - t) * 100}%`}>${E(t + s * 3600)}</span>`)}</div></div>
          ${e.map((o) => {
      const s = this.programs.filter((n) => n.channel === o.key);
      return r`<div class="track"><button class="sticky" @click=${() => this.tune(o.key)}><strong>${o.number} · ${o.name}</strong>${o.favorite ? " ★" : ""}</button><div class="slots">${s.length ? s.map((n) => {
        const a = Ki(n, t, i);
        return r`<button class="slot ${n.start <= this.now && this.now < n.end ? "live" : ""}" style=${`left:${a.left}%;width:${a.width}%`} @click=${() => this.details(n)} aria-label=${`${o.name}: ${n.title}, ${E(n.start)} a ${E(n.end)}`}><small>${E(n.start)}</small><span>${n.title}</span></button>`;
      }) : r`<span class="no-epg">Programación no disponible</span>`}</div></div>`;
    })}
        </div>
        <div class="mobile-guide">${e.map((o) => r`<section>${this.channelRow(o)}<div class="agenda">${this.programs.filter((s) => s.channel === o.key && s.end > Math.max(t, this.now)).map((s) => r`<button @click=${() => this.details(s)}><time>${E(s.start)}</time><span>${s.title}</span></button>`)}</div></section>`)}</div>`}
      ${e.length ? d : r`<p class="hint">No hay canales con este filtro.</p>`}
      <footer>Programación de la TV, <a href="https://www.tdtchannels.com" target="_blank" rel="noopener noreferrer">TDTChannels</a> y <a href="https://epgshare01.online" target="_blank" rel="noopener noreferrer">EPGShare01</a>. La cobertura depende de cada emisora.</footer>`;
  }
  render() {
    return !this.config || !this.hass ? d : r`<ha-card><div class="body ${this.config.compact ? "compact" : ""}">
      ${this.context.entry_id ? this.config.compact ? this.compact() : this.full() : r`<p class="hint">La guía de la TV no está disponible.</p>`}
      ${this.loading ? r`<p class="hint" role="status">Actualizando guía…</p>` : d}
      ${this.context.busy ? r`<p class="notice" role="status">Cambiando a ${this.context.busy}…</p>` : d}
      ${this.error || this.context.error ? r`<p class="error" role="alert">${this.error || this.context.error} <button class="text-button" @click=${() => void this.load()}>Reintentar</button></p>` : d}
      ${this.missing ? r`<p class="hint">${this.missing} favorito(s) ya no aparecen en el catálogo de la TV.</p>` : d}
      <dialog @close=${() => this.selected = void 0}>${this.selected ? r`<div class="details"><button class="close icon" aria-label="Cerrar información" @click=${() => this.shadowRoot?.querySelector("dialog")?.close()}><ha-icon icon="mdi:close"></ha-icon></button><div class="eyebrow">${this.channels.find((e) => e.key === this.selected.channel)?.name}</div><h2>${this.selected.title}</h2><p>${E(this.selected.start)} – ${E(this.selected.end)}</p><p class="description">${this.selected.description || "Sin descripción disponible."}</p><small>Programación: ${{ tv: "Televisión", tdtchannels: "TDTChannels", epgshare01: "EPGShare01" }[this.selected.source] ?? this.selected.source}</small><button class="primary" @click=${() => {
      this.tune(this.selected.channel), this.shadowRoot?.querySelector("dialog")?.close();
    }}>Ver canal ahora</button></div>` : d}</dialog>
    </div></ha-card>`;
  }
};
y.styles = he`
    :host{display:block}*{box-sizing:border-box}ha-card{overflow:hidden}.body{padding:20px;color:var(--primary-text-color)}h2,h3,p{margin:0}h2{font-size:22px}h3{font-size:19px;line-height:1.35;margin:5px 0 10px}button,input,select{font:inherit;color:inherit}button{cursor:pointer;border:0;background:transparent;touch-action:manipulation}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}button:disabled{opacity:.5}.icon{padding:10px;border-radius:50%;display:inline-grid;place-items:center;flex-shrink:0}.star[aria-pressed=true]{color:#e8ae23}ha-icon{--mdc-icon-size:22px}.primary{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--primary-color);color:var(--text-primary-color,#fff);padding:12px 18px;border-radius:12px;width:100%;margin-top:16px;font-weight:600}.text-button{color:var(--primary-color);padding:8px 4px;display:inline-flex;align-items:center;gap:6px}.hint{color:var(--secondary-text-color);font-size:13px;line-height:1.5;margin:10px 0}.eyebrow{font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--secondary-text-color);text-transform:uppercase}.time-range{display:flex;justify-content:space-between;font-size:12px;color:var(--secondary-text-color)}progress{width:100%;height:5px;accent-color:var(--primary-color)}.now-playing{padding-bottom:15px;margin-bottom:15px;border-bottom:1px solid var(--divider-color)}.next{display:grid;margin:8px 0}.next button,.agenda button{display:flex;gap:12px;padding:7px 0;text-align:left;font-size:13px}.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}time{color:var(--secondary-text-color);font-variant-numeric:tabular-nums;flex-shrink:0}.section-title{font-weight:600;margin:8px 0}.favorites{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.favorites button,.pills button{background:var(--secondary-background-color);padding:9px 13px;border-radius:20px;font-size:13px}.favorites .chosen,.pills [aria-pressed=true]{background:var(--primary-color);color:var(--text-primary-color,#fff)}.select-label{display:grid;gap:7px;font-size:13px;margin-top:15px}select,input{background:var(--card-background-color);border:1px solid var(--divider-color);padding:11px 12px;border-radius:10px;min-width:0}header{display:flex;justify-content:space-between;gap:12px;align-items:center}header p{color:var(--secondary-text-color);font-size:13px;margin-top:5px}.tools{display:flex;gap:15px;margin:20px 0 12px;flex-wrap:wrap}.tools input{flex:1;min-width:180px}.pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.toolbar{display:flex;gap:12px;align-items:center;margin-bottom:15px}.toolbar .icon{margin-left:auto}.channel{display:flex;align-items:center;border-bottom:1px solid var(--divider-color);min-height:68px}.channel.active{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.station{display:flex;align-items:center;gap:14px;text-align:left;padding:12px 8px;flex:1;min-width:0}.station>span:last-child{min-width:0}.station strong{font-size:14px}.station small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--secondary-text-color);font-size:12px;margin-top:4px}.dial{min-width:32px;color:var(--secondary-text-color);font-size:18px;font-variant-numeric:tabular-nums}.channel-list{max-height:70vh;overflow:auto}.timeline{overflow:auto;max-height:70vh;border:1px solid var(--divider-color);border-radius:12px}.track,.ruler{display:grid;grid-template-columns:160px 2880px;min-width:3040px}.sticky{position:sticky;left:0;z-index:3;background:var(--card-background-color);text-align:left;padding:12px;font-size:13px;border-right:1px solid var(--divider-color);overflow:hidden}.track{border-bottom:1px solid var(--divider-color)}.ruler{position:sticky;top:0;z-index:4;background:var(--secondary-background-color);height:42px}.ruler .sticky{background:var(--secondary-background-color)}.hours,.slots{position:relative}.hours span{position:absolute;top:13px;font-size:12px;padding-left:6px;color:var(--secondary-text-color)}.slots{height:65px}.slot{position:absolute;top:5px;height:55px;border-radius:6px;background:var(--secondary-background-color);border-right:2px solid var(--card-background-color);padding:6px 8px;text-align:left;overflow:hidden}.slot small{display:block;color:var(--secondary-text-color);font-size:10px}.slot span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;margin-top:4px}.slot.live{background:color-mix(in srgb,var(--primary-color) 20%,var(--card-background-color));box-shadow:inset 3px 0 var(--primary-color)}.no-epg{font-size:12px;color:var(--secondary-text-color);padding:22px;display:block;position:sticky;left:160px;width:260px}.mobile-guide{display:none}footer{font-size:11px;color:var(--secondary-text-color);line-height:1.5;margin-top:18px}a{color:var(--primary-color)}.notice,.error{padding:12px;border-radius:10px;background:var(--secondary-background-color);font-size:13px;margin-top:12px}.error{color:var(--error-color)}dialog{border:1px solid var(--divider-color);border-radius:18px;max-width:520px;width:calc(100% - 32px);padding:0;color:var(--primary-text-color);background:var(--card-background-color);box-shadow:0 15px 60px #0005}dialog::backdrop{background:#0008}.details{padding:26px}.details h2{font-size:21px;margin:10px 25px 10px 0}.details p{margin:12px 0;font-size:14px;line-height:1.5}.description{white-space:pre-line;max-height:40vh;overflow:auto}.details small{color:var(--secondary-text-color)}.close{position:absolute;right:8px;top:8px}.agenda{padding:0 12px 14px}.agenda button{width:100%}.agenda span{text-align:left}
    @media(max-width:700px){.body{padding:16px}header{align-items:flex-start}header h2{font-size:20px}.tools{display:block}.tools input{width:100%;margin-bottom:12px}.toolbar{gap:6px;flex-wrap:wrap}.toolbar input{max-width:150px}.timeline{display:none}.mobile-guide{display:block;max-height:70vh;overflow:auto}.track{display:none}}
    @media(hover:hover) and (pointer:fine){button:hover{filter:brightness(.94);background-color:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color))}.primary:hover{background:var(--primary-color)}}
  `;
w([
  S({ attribute: !1 })
], y.prototype, "hass", 2);
w([
  b()
], y.prototype, "config", 2);
w([
  b()
], y.prototype, "channels", 2);
w([
  b()
], y.prototype, "programs", 2);
w([
  b()
], y.prototype, "query", 2);
w([
  b()
], y.prototype, "filter", 2);
w([
  b()
], y.prototype, "mode", 2);
w([
  b()
], y.prototype, "day", 2);
w([
  b()
], y.prototype, "error", 2);
w([
  b()
], y.prototype, "loading", 2);
w([
  b()
], y.prototype, "selected", 2);
w([
  b()
], y.prototype, "now", 2);
w([
  b()
], y.prototype, "lastDay", 2);
w([
  b()
], y.prototype, "missing", 2);
y = w([
  ve("polr-tv-guide-card")
], y);
var Xi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, me = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? Gi(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (o ? a(t, i, s) : a(s)) || s);
  return o && s && Xi(t, i, s), s;
};
const ut = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "action", label: "Call an action", hint: "" }
], Zi = (e) => [
  { name: "show_apps", selector: { boolean: {} } },
  ...e.show_apps ? [
    { name: "apps_label", selector: { text: {} } },
    { name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }
  ] : []
], Qi = (e) => [
  {
    type: "expandable",
    name: "",
    title: "Text input",
    icon: "mdi:keyboard",
    schema: [{ name: "show_text_input", selector: { boolean: {} } }]
  },
  {
    type: "expandable",
    name: "",
    title: "Advanced",
    icon: "mdi:tune",
    schema: [
      {
        name: "hold_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "repeat", label: "Repeated taps" },
              { value: "native", label: "Native key hold (HA 2026.9+)" },
              { value: "none", label: "Disabled" }
            ]
          }
        }
      },
      ...e.hold_mode === "native" ? [
        {
          name: "native_hold_buttons",
          selector: {
            select: {
              multiple: !0,
              mode: "list",
              options: Ue.map((t) => ({
                value: t,
                label: t.replaceAll("_", " ")
              }))
            }
          }
        },
        {
          name: "native_touch_hold_delay_ms",
          selector: {
            number: {
              min: Ae,
              max: ke,
              step: 50,
              mode: "box",
              unit_of_measurement: "ms"
            }
          }
        }
      ] : [],
      { name: "haptics", selector: { boolean: {} } },
      { name: "show_section_labels", selector: { boolean: {} } }
    ]
  }
], Ji = (e) => [
  {
    name: "entity",
    required: !0,
    selector: {
      entity: {
        // Narrow to the integration this card is built for, but still allow
        // any remote — plenty of people point it at something else.
        filter: [
          { integration: "androidtv_remote", domain: "remote" },
          { domain: "remote" }
        ]
      }
    }
  },
  { name: "name", selector: { text: {} } },
  {
    type: "expandable",
    name: "",
    title: "Header",
    icon: "mdi:television",
    schema: [
      { name: "show_header", selector: { boolean: {} } },
      { name: "show_power", selector: { boolean: {} } },
      { name: "power_action", selector: { ui_action: {} } }
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Pad",
    icon: "mdi:gesture-tap-button",
    schema: [
      { name: "show_nav", selector: { boolean: {} } },
      ...e.show_nav ? [
        {
          name: "pad",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "buttons", label: "Buttons" },
                { value: "dpad", label: "D-pad" },
                { value: "touchpad", label: "Touchpad" }
              ]
            }
          }
        }
      ] : []
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Playback",
    icon: "mdi:play-pause",
    schema: [
      { name: "show_transport", selector: { boolean: {} } },
      ...e.show_transport ? [
        {
          name: "transport_buttons",
          selector: {
            select: {
              multiple: !0,
              mode: "list",
              options: [
                { value: "previous", label: "Previous" },
                { value: "rewind", label: "Rewind" },
                { value: "play_pause", label: "Play / pause" },
                { value: "fast_forward", label: "Fast forward" },
                { value: "next", label: "Next" }
              ]
            }
          }
        }
      ] : []
    ]
  },
  {
    type: "expandable",
    name: "",
    title: "Volume",
    icon: "mdi:volume-high",
    schema: [
      { name: "show_volume", selector: { boolean: {} } },
      {
        name: "volume_entity",
        selector: { entity: { filter: [{ domain: "media_player" }] } }
      },
      // HA's own interactions editor: tap, hold and double tap, with the
      // full action vocabulary. IR bridges expose one pressable entity per
      // command rather than a media_player, so this is how those get wired.
      ...["volume_up", "volume_down", "volume_mute"].map((t) => ({
        name: `${t}_action`,
        selector: { ui_action: {} }
      }))
    ]
  }
], eo = [
  { name: "action", selector: { ui_action: {} } }
], to = {
  entity: "Remote entity",
  volume_entity: "Volume on another media player",
  power_action: "Power",
  volume_up_action: "Volume up",
  volume_down_action: "Volume down",
  volume_mute_action: "Mute",
  name: "Title",
  pad: "Pad style",
  show_header: "Show header",
  show_power: "Show power",
  show_nav: "Show pad",
  show_transport: "Transport controls",
  show_volume: "Volume controls",
  show_apps: "App launcher",
  apps_label: "Launcher heading",
  transport_buttons: "Buttons",
  app_columns: "Buttons per row",
  show_text_input: "Text input",
  hold_mode: "Hold behaviour",
  native_hold_buttons: "Native-hold buttons",
  native_touch_hold_delay_ms: "Touch hold threshold",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels"
}, io = {
  show_power: "In the header, or in the back / home / menu row when the header is hidden.",
  volume_entity: "Point this at a soundbar or receiver that exposes a media player. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  power_action: "Leave empty to toggle the TV itself. Set it when something else does the switching — an IR or RF blaster, or a script that also powers a receiver.",
  volume_up_action: "Leave empty to control the TV or the media player above. Set it for IR bridges and the like, which expose one pressable entity per command instead of a media player.",
  // Kept short: ha-form runs a boolean's helper up against its toggle, and a
  // long one wraps into it. The full caveats are in the README.
  show_text_input: "Needs a focused search field on the TV, and Enable IME.",
  hold_mode: "Native hold mirrors key down/up and requires Android TV Remote on Home Assistant 2026.9 or newer.",
  native_touch_hold_delay_ms: "A touch or pen must remain continuously down for this long. Mouse and keyboard use 750 ms."
};
let O = class extends N {
  constructor() {
    super(...arguments), this._editing = null, this._computeLabel = (e) => to[e.name] ?? e.name, this._computeHelper = (e) => io[e.name];
  }
  setConfig(e) {
    this._config = Ot(e);
  }
  /**
   * ha-form data, with the editable tap actions flattened.
   *
   * ha-form has no vocabulary for a nested map, so `overrides.power` is
   * surfaced as `power_action` and folded back in `_formChanged`. Hold and
   * double-tap actions are preserved untouched; the selector only edits the tap.
   */
  get _formData() {
    const e = { ...this._config };
    for (const t of O.ACTION_BUTTONS)
      e[`${t}_action`] = this._config.overrides[t]?.tap_action;
    return e;
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(e) {
    ne(this, "config-changed", { config: Ci(e) });
  }
  _formChanged(e) {
    e.stopPropagation();
    const t = { ...e.detail.value }, i = { ...this._config.overrides };
    for (const o of O.ACTION_BUTTONS) {
      const s = `${o}_action`;
      if (!(s in t)) continue;
      const n = t[s];
      delete t[s];
      const a = { ...this._config.overrides[o] ?? {} };
      K(n) && n.action !== "none" ? i[o] = { ...a, tap_action: n } : (delete a.tap_action, Object.keys(a).length ? i[o] = a : delete i[o]);
    }
    this._emit({
      ...this._config,
      ...t,
      overrides: i,
      apps: this._config.apps
    });
  }
  /* --------------------------------------------------------- tile lists -- */
  /*
   * Apps and every custom section are the same list of tiles, so the list
   * machinery is addressed by path rather than duplicated per list. `"apps"` is
   * the built-in launcher; a number is an index into `sections`.
   */
  _tiles(e) {
    return e === "apps" ? this._config.apps : this._config.sections[e]?.buttons ?? [];
  }
  _setTiles(e, t) {
    if (e === "apps") {
      this._emit({ ...this._config, apps: t });
      return;
    }
    const i = this._config.sections.map(
      (o, s) => s === e ? { ...o, buttons: t } : o
    );
    this._emit({ ...this._config, sections: i });
  }
  _addTile(e, t) {
    const i = [...this._tiles(e), t];
    this._setTiles(e, i), this._editing = { path: e, index: i.length - 1 };
  }
  _updateTile(e, t, i) {
    this._setTiles(
      e,
      this._tiles(e).map((o, s) => s === t ? { ...o, ...i } : o)
    );
  }
  _removeTile(e, t) {
    this._setTiles(
      e,
      this._tiles(e).filter((i, o) => o !== t)
    ), this._editing = null;
  }
  _moveTile(e, t, i) {
    const o = [...this._tiles(e)], s = t + i;
    s < 0 || s >= o.length || ([o[t], o[s]] = [o[s], o[t]], this._setTiles(e, o), this._isEditing(e, t) && (this._editing = { path: e, index: s }));
  }
  _isEditing(e, t) {
    return this._editing?.path === e && this._editing.index === t;
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(e, t, i) {
    const o = this._tiles(e)[t].action;
    this._updateTile(e, t, {
      action: mt(i, vt(o))
    });
  }
  _setActionValue(e, t, i) {
    const o = this._tiles(e)[t].action;
    this._updateTile(e, t, { action: mt(Se(o), i) });
  }
  /* ---------------------------------------------------------- sections -- */
  _setSections(e) {
    this._emit({ ...this._config, sections: e });
  }
  _addSection() {
    this._setSections([
      ...this._config.sections,
      { name: "New section", buttons: [] }
    ]);
  }
  _renameSection(e, t) {
    this._setSections(
      this._config.sections.map(
        (i, o) => o === e ? { ...i, name: t } : i
      )
    );
  }
  _removeSection(e) {
    this._setSections(this._config.sections.filter((t, i) => i !== e)), this._editing = null;
  }
  _renderIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = Ee[t.slice(6)];
      if (i) return r`<span class="brand">${i}</span>`;
    }
    return t.startsWith("/") || t.startsWith("http") ? r`<img class="brand" src=${t} alt="" />` : r`<ha-icon .icon=${t}></ha-icon>`;
  }
  /**
   * One list row.
   *
   * The inline edit form is a *sibling* `<li>`, appended by the caller rather
   * than returned from here. A single template emitting two `<li>` elements
   * gets mis-parsed — the second ends up nested inside the first, and the form
   * renders half-width, floating out of the row.
   */
  /**
   * A tile list, with the open row's form appended after it.
   *
   * The form is a *sibling* `<li>`, which is why rows and forms are flattened
   * here rather than returned together — see _renderAppRow.
   */
  _renderTileList(e, t, i) {
    return t.length ? r`<ul class="list">
      ${t.flatMap(
      (o, s) => this._isEditing(e, s) ? [
        this._renderAppRow(e, o, s, t.length),
        this._renderAppForm(e, o, s)
      ] : [this._renderAppRow(e, o, s, t.length)]
    )}
    </ul>` : r`<div class="empty-state">${i}</div>`;
  }
  _renderAppRow(e, t, i, o) {
    const s = this._isEditing(e, i);
    return r`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(t)}</div>
        <div class="tile-info">
          <div class="primary"><span>${t.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${xi(t.action)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${i === 0}
          @click=${() => this._moveTile(e, i, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${i === o - 1}
          @click=${() => this._moveTile(e, i, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${s ? "Done" : "Edit"}
          @click=${() => {
      this._editing = s ? null : { path: e, index: i };
    }}
        >
          <ha-icon icon=${s ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeTile(e, i)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(e, t, i) {
    const o = Se(t.action), s = ut.find((a) => a.value === o), n = oo(t.action);
    return r`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${t.name ?? ""}
                @change=${(a) => this._updateTile(e, i, {
      name: a.target.value || void 0
    })}
              />
            </label>

            <!--
              HA's own picker, so icons are searchable and previewed the way
              they are everywhere else. It emits value-changed with the icon in
              event.detail.value, matching how HA's helper dialogs consume it.
            -->
            <ha-icon-picker
              .hass=${this.hass}
              .value=${t.icon ?? ""}
              label="Icon"
              @value-changed=${(a) => {
      const l = a.detail?.value;
      !l && t.icon && !t.icon.startsWith("mdi:") || this._updateTile(e, i, { icon: l || void 0 });
    }}
            ></ha-icon-picker>

            ${e !== "apps" ? r`
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${t.entity ?? ""}
                    label="Lights up when this entity is on"
                    allow-custom-entity
                    @value-changed=${(a) => this._updateTile(e, i, {
      entity: a.detail?.value || void 0
    })}
                  ></ha-entity-picker>
                ` : d}

            <!-- Streaming logos are app suggestions; a section button is a
                 projector or a receiver, so they are only offered for apps. -->
            ${e === "apps" ? r`
                  <div class="chips">
                    ${Te.map(
      (a) => r`
                        <button
                          class="chip ${t.icon === `brand:${a}` ? "accent" : ""}"
                          title=${`Use the ${H[a].label} logo`}
                          @click=${() => this._updateTile(e, i, { icon: `brand:${a}` })}
                        >
                          ${H[a].label}
                        </button>
                      `
    )}
                  </div>
                ` : d}

            <label class="field">
              <span>Does what</span>
              <select
                .value=${o}
                @change=${(a) => this._setActionKind(e, i, a.target.value)}
              >
                ${ut.map(
      (a) => r`
                    <option value=${a.value} ?selected=${a.value === o}>
                      ${a.label}
                    </option>
                  `
    )}
              </select>
            </label>

            ${o === "action" ? r`
                  <!--
                    HA's own interactions editor, the same control the button
                    overrides use. It carries a service picker, a target and
                    data, which the old free-text box could not — hence the
                    note telling people to go and edit YAML instead.
                  -->
                  <ha-form
                    .hass=${this.hass}
                    .data=${{ action: n }}
                    .schema=${eo}
                    .computeLabel=${() => "Action"}
                    @value-changed=${(a) => {
      a.stopPropagation();
      const l = a.detail?.value?.action;
      K(l) && this._updateTile(e, i, { action: l });
    }}
                  ></ha-form>
                ` : r`
                  <label class="field wide">
                    <span>${s.label}</span>
                    <input
                      type="text"
                      .value=${vt(t.action)}
                      @change=${(a) => this._setActionValue(e, i, a.target.value)}
                    />
                  </label>
                  <div class="hint">${s.hint}</div>
                `}
          </div>
        </div>
      </li>
    `;
  }
  /**
   * The app running on the TV right now.
   *
   * Nothing in the integration can enumerate what is installed on the TV, and
   * the card does not pretend otherwise. `app_id` reports whatever is on
   * screen, though — so opening an app and clicking here captures its real
   * package id, which is otherwise tedious to find.
   */
  _renderCurrentApp() {
    const e = this._config, t = Et(this.hass, e), i = t ? this.hass.states?.[t] : void 0, o = i?.attributes?.app_id, s = i?.attributes?.app_name;
    if (!o) return d;
    const n = e.apps.some(
      (a) => a.action.action === "app" && a.action.app_id === o
    );
    return r`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${n ? r`<div class="hint">${s ?? o} is already in the list.</div>` : r`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() => this._addTile("apps", {
      name: s ?? o,
      icon: so(s ?? o),
      action: { action: "app", app_id: o }
    })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${s ?? o}
              </button>
            </div>
            <div class="hint">
              Open an app on the TV and it appears here, which is the easiest way
              to capture its package id (${o}).
            </div>
          `}
    `;
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = e.apps;
    return r`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Ji(e)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      <!--
        Apps get a hand-rolled panel rather than an ha-form expandable: the
        list, its ordering and the inline action editor cannot be expressed as
        a schema, and leaving them outside meant the settings that govern the
        list sat in a different section from the list itself.
      -->
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:apps"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Apps</div>

        <div class="content">
        <ha-form
          .hass=${this.hass}
          .data=${this._formData}
          .schema=${Zi(e)}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>

        ${e.show_apps ? r`
              <div class="section-head">
                <span class="grow">Apps</span>
                <span class="count">${t.length}</span>
              </div>

              ${this._renderTileList("apps", t, "No apps yet — add one below.")}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${Te.map(
      (i) => r`
                    <button
                      class="chip"
                      @click=${() => this._addTile("apps", {
        name: H[i].label,
        icon: `brand:${i}`,
        action: { action: "activity", activity: H[i].activity }
      })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${H[i].label}
                    </button>
                  `
    )}
              </div>

              ${this._renderCurrentApp()}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() => this._addTile("apps", {
      name: "New app",
      icon: "mdi:application",
      action: { action: "activity", activity: "" }
    })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Custom app</span>
                </button>
              </div>
            ` : d}
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:view-dashboard-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Sections</div>

        <div class="content">
          <div class="hint">
            Extra rows of buttons, drawn above the app launcher. Names show only
            when “Section labels” is on, under Advanced.
          </div>

          ${e.sections.map(
      (i, o) => r`
              <div class="section-block">
              <div class="section-head">
                <!--
                  A plain input, like every other field in this editor.
                  ha-textfield is not a component this frontend defines, so it
                  rendered as an inert unknown element and the name could not be
                  typed at all.
                -->
                <label class="field grow">
                  <span>Section name</span>
                  <input
                    type="text"
                    .value=${i.name ?? ""}
                    @change=${(s) => this._renameSection(o, s.target.value)}
                  />
                </label>
                <button
                  class="icon-button"
                  title="Remove section"
                  @click=${() => this._removeSection(o)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>

              ${this._renderTileList(o, i.buttons, "No buttons yet.")}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() => this._addTile(o, {
        name: "New button",
        icon: "mdi:power",
        action: { action: "service", service: "" }
      })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Add button</span>
                </button>
              </div>
              </div>
            `
    )}

          <div class="form-actions add-section">
            <button class="control-button wide" @click=${() => this._addSection()}>
              <ha-icon icon="mdi:plus"></ha-icon><span>Add section</span>
            </button>
          </div>
        </div>
      </ha-expansion-panel>

      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Qi(e)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
};
O.ACTION_BUTTONS = [
  "power",
  "volume_up",
  "volume_down",
  "volume_mute"
];
O.styles = [
  Ve,
  he`
      :host {
        display: block;
      }
      ha-form {
        display: block;
      }
      ul.list {
        padding: 0;
      }
      /*
       * Copied from HA's own ha-form-expandable so the Apps panel is
       * indistinguishable from the ones ha-form renders: the icon goes in the
       * leading-icon slot rather than inside the header (which is what was
       * indenting the label differently), the content gets its own 12px
       * padding, and the 24px gap matches ha-form's spacing between rows —
       * this panel sits between two ha-forms and would otherwise sit tighter
       * than its neighbours.
       */
      ha-expansion-panel {
        display: block;
        /*
         * The gap on BOTH sides, not just below. ha-form gives its rows
         * margin-bottom: 24px but explicitly skips the last one, so the space
         * above this panel is whatever it supplies itself — previously nothing,
         * plus an 8px margin of my own on ha-form, which is exactly why this
         * one section sat tighter than the rest.
         */
        margin: 24px 0;
        border-radius: var(--ha-border-radius-md);
        --ha-card-border-radius: var(--ha-border-radius-md);
        --expansion-panel-content-padding: 0;
      }
      ha-expansion-panel > ha-icon[slot="leading-icon"] {
        color: var(--secondary-text-color);
      }
      ha-expansion-panel .content {
        padding: 12px;
      }
      /*
       * A section owns its name, its buttons and its "Add button" control, so
       * they are grouped on a tinted surface. Without it "Add button" and "Add
       * section" sat flush against each other and read as one pair of controls
       * at the same level, which they are not.
       */
      ha-icon-picker,
      ha-entity-picker {
        display: block;
      }
      .section-block {
        padding: var(--ha-space-3, 12px);
        margin-bottom: var(--ha-space-3, 12px);
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      .section-block .section-head {
        margin-top: 0;
      }
      .form-actions.add-section {
        margin-top: var(--ha-space-4, 16px);
      }
      ha-expansion-panel .content ha-form {
        display: block;
        margin-bottom: 0;
      }
      /* The kit sizes icon buttons for a card; an editor row is tighter. */
      .icon-button {
        width: 36px;
        height: 36px;
        --mdc-icon-size: 20px;
      }
      .chip {
        cursor: pointer;
        border: none;
        height: 26px;
        font-family: inherit;
      }
      .brand {
        display: block;
        width: 22px;
        height: 22px;
      }
      .brand svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
      .field select,
      .field input {
        width: 100%;
        box-sizing: border-box;
        height: 36px;
        padding: 0 var(--ha-space-2, 8px);
        border: none;
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
        color: var(--primary-text-color);
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
      }
      .chips {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      .hint {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      /*
       * One control per row. The kit lays .fields out as a responsive
       * multi-column grid, which suits pairs of short inputs — but these are a
       * name, an icon picker, an entity picker and an action, and pairing them
       * up inside the narrow editor panel made the form read as a cramped
       * table with truncated values.
       */
      .fields {
        grid-template-columns: 1fr;
      }
      .fields > .chips,
      .fields > .hint {
        padding: 0;
      }
    `
];
me([
  S({ attribute: !1 })
], O.prototype, "hass", 2);
me([
  b()
], O.prototype, "_config", 2);
me([
  b()
], O.prototype, "_editing", 2);
O = me([
  ve("polr-android-tv-remote-card-editor")
], O);
const Se = (e) => e.action === "activity" || e.action === "app" || e.action === "key" ? e.action : "action", vt = (e) => {
  switch (e.action) {
    case "activity":
      return e.activity;
    case "app":
      return e.app_id;
    case "key":
      return e.key;
    default:
      return "";
  }
}, oo = (e) => e.action === "service" ? xe(e.service, e.data, e.target) : Se(e) === "action" ? e : void 0, mt = (e, t) => {
  switch (e) {
    case "activity":
      return { action: "activity", activity: t };
    case "app":
      return { action: "app", app_id: t };
    case "key":
      return { action: "key", key: t };
    case "action":
      return { action: "perform-action", perform_action: t };
  }
}, so = (e) => {
  const t = St(e);
  return t ? `brand:${t}` : "mdi:application";
};
var no = Object.defineProperty, ao = Object.getOwnPropertyDescriptor, ae = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? ao(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (o ? a(t, i, s) : a(s)) || s);
  return o && s && no(t, i, s), s;
};
const ro = "2.3.0", _e = "polr-android-tv-remote-card";
let B = class extends N {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1, this._controlQueue = Promise.resolve(), this._nativeSessions = /* @__PURE__ */ new Map(), this._pressCoordinator = new Hi();
  }
  static getConfigElement() {
    return document.createElement(`${_e}-editor`);
  }
  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  static getStubConfig(e) {
    return { entity: Object.keys(e?.states ?? {}).find((i) => i.startsWith("remote.")) ?? "remote.android_tv", pad: "buttons" };
  }
  setConfig(e) {
    this._pressCoordinator.cancel(), this._releaseNativeSessions(), this._config = Ot(e);
  }
  disconnectedCallback() {
    this._pressCoordinator.cancel(), this._releaseNativeSessions(), super.disconnectedCallback();
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 6;
    let t = e.show_header ? 2 : 0;
    return e.show_nav && (t += e.pad === "buttons" ? 5 : 6), t += 1, e.show_transport && (t += 1), e.show_volume && (t += 1), e.show_text_input && (t += 1), e.show_apps && e.apps.length && (t += 2), Math.max(t, 3);
  }
  /**
   * Sections view sizing.
   *
   * `rows: "auto"` rather than a count, because this card's height genuinely
   * depends on its width: the touchpad and the button pad are sized by
   * aspect-ratio, so any fixed number of rows is wrong at every width but one.
   * Reporting a count over-allocated the grid slot and left a band of empty
   * space under the card. HA's own graph card does the same thing.
   *
   * min_rows still applies if a user turns auto height off in the layout editor.
   */
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: this._config?.show_nav ? 6 : 2
    };
  }
  get _device() {
    if (!(!this.hass || !this._config))
      return _i(this.hass, this._config);
  }
  /**
   * Run a card action, reporting failures instead of dropping them.
   *
   * Every interaction here is fire-and-forget, so without this a rejected
   * service call -- a typo'd override, an entity that has gone away -- becomes
   * an unhandled promise rejection and the console shows nothing useful.
   */
  _run(e) {
    e.catch((t) => {
      console.error("polr-android-tv-remote-card:", t);
    });
  }
  /** Serialize remote operations without allowing one rejection to poison the queue. */
  _enqueueControl(e) {
    this._controlQueue = this._controlQueue.catch(() => {
    }).then(e).then(() => {
    }).catch((t) => {
      console.error("polr-android-tv-remote-card:", t);
    });
  }
  _press(e) {
    const t = this._device;
    if (!this.hass || !this._config || !t) return;
    const i = this.hass, o = this._config;
    this._releaseNativeSessions(), this._enqueueControl(() => wi(i, o, t, e, this));
  }
  _usesNativeHold(e) {
    const t = this._config;
    return !t || t.hold_mode !== "native" || !t.native_hold_buttons.includes(e) ? !1 : Object.keys(t.overrides[e] ?? {}).length === 0;
  }
  /** Send END_LONG once more only when Home Assistant rejected the first call. */
  async _sendNativeEnd(e, t) {
    try {
      await ye(e.hass, e.device, t, "end");
    } catch {
      await new Promise((i) => window.setTimeout(i, 150)), await ye(e.hass, e.device, t, "end");
    }
  }
  _endNativeSession(e, t) {
    this._nativeSessions.get(e) === t && (this._nativeSessions.delete(e), this._enqueueControl(() => this._sendNativeEnd(t, e)));
  }
  /** Release any stale native key before another card action is accepted. */
  _releaseNativeSessions() {
    for (const [e, t] of [...this._nativeSessions])
      this._endNativeSession(e, t);
  }
  /** Queue one half of a physical Android key press. */
  _nativePress(e, t) {
    let i = this._nativeSessions.get(e);
    if (t === "start") {
      const o = this._device;
      if (!this.hass || !o) return;
      this._releaseNativeSessions(), i = { hass: this.hass, device: o }, this._nativeSessions.set(e, i), this._enqueueControl(
        () => ye(i.hass, i.device, e, "start")
      );
      return;
    }
    t === "end" && i && this._endNativeSession(e, i);
  }
  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  _pressOptions(e, t = {}) {
    const i = this._config, o = i.overrides[e], s = o?.hold_action, n = o?.double_tap_action, a = (l) => () => {
      this.hass && this._run(Le(this, this.hass, l, i.entity));
    };
    return this._usesNativeHold(e) ? {
      onPress: () => this._press(e),
      onPressStart: () => this._nativePress(e, "start"),
      onPressEnd: () => this._nativePress(e, "end"),
      haptics: i.haptics,
      claimTouch: !0,
      nativeTouchHoldDelayMs: i.native_touch_hold_delay_ms,
      coordinator: this._pressCoordinator
    } : {
      onPress: () => this._press(e),
      ...$e(s) ? { onHold: a(s) } : {},
      ...$e(n) ? { onDoubleTap: a(n) } : {},
      repeat: t.repeat && i.hold_mode === "repeat",
      haptics: i.haptics,
      claimTouch: !0,
      coordinator: this._pressCoordinator
    };
  }
  _navigate(e) {
    const t = e.detail.direction, i = e.detail.phase ?? "short";
    i === "start" || i === "end" ? this._nativePress(t, i) : this._press(t);
  }
  _launch(e) {
    const t = this._device;
    if (!this.hass || !t) return;
    const i = this.hass;
    this._releaseNativeSessions(), this._enqueueControl(() => $i(i, t, e.action, this));
  }
  async _sendText() {
    const e = this._device, t = this._text.trim();
    if (!(!this.hass || !e || !t)) {
      this._sending = !0;
      try {
        await yi(this.hass, e, t), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(e) {
    const t = this._config, i = t.context_entity ? this.hass?.states[t.context_entity]?.attributes : void 0, o = i?.label ?? (e.available ? e.on ? e.appName ?? "On" : "Off" : "Unavailable"), s = e.on && e.available ? St(e.appName) : void 0;
    return r`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${s ? r`<span class="brand-mark">${Ee[s]}</span>` : r`<ha-icon icon=${i?.kind === "home" ? "mdi:home" : i?.kind === "tv" ? "mdi:television-classic" : "mdi:television"}></ha-icon>`}
        </div>
        <div class="tile-info">
          <div class="primary"><span>${e.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${o}</span></div>
        </div>
        ${t.show_power ? r`
              <button
                class="icon-button"
                type="button"
                aria-label=${e.on ? "Turn off" : "Turn on"}
                ${U(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : d}
      </div>
      ${this._renderChips(e)}
    `;
  }
  _renderChips(e) {
    if (!e.on || !e.available) return d;
    const t = [];
    return e.muted === !0 ? t.push(r`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : ot(e) && t.push(r`<span class="chip accent">${Math.round(e.volume * 100)}%</span>`), t.length ? r`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${t}</div>
    </div>` : d;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(e, t, i, o = {}) {
    return r`
      <button
        class="control-button"
        type="button"
        aria-label=${i}
        title=${i}
        ${U(this._pressOptions(e, o))}
      >
        <ha-icon icon=${t}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const e = this._config, t = e.show_power && !e.show_header;
    return r`
      <div class="features">
        ${t ? this._button("power", "mdi:power", "Power") : d}
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${this._config.show_favorite ? this._button("favorite", "mdi:star", "Favourite") : d}
      </div>
    `;
  }
  /**
   * Transport row, masked by what the player actually advertises.
   *
   * Buttons are shown when there is no paired player at all, because the key
   * codes work regardless — it is only the *player* route that needs the bit.
   */
  _renderTransport(e) {
    const t = e.playerId === null, i = t || F(e, C.PREVIOUS_TRACK), o = t || F(e, C.NEXT_TRACK), s = new Set(this._config.transport_buttons), n = [
      s.has("previous") && i ? this._button("previous", "mdi:skip-previous", "Previous") : d,
      s.has("rewind") ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: !0 }) : d,
      s.has("play_pause") ? this._button(
        "play_pause",
        e.playing ? "mdi:pause" : "mdi:play",
        e.playing ? "Pause" : "Play"
      ) : d,
      s.has("fast_forward") ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: !0 }) : d,
      s.has("next") && o ? this._button("next", "mdi:skip-next", "Next") : d
    ];
    return r`<div class="features">${n}</div>`;
  }
  /**
   * Volume.
   *
   * The buttons always work -- worst case they send key codes. The *state* is
   * another matter: androidtv_remote only reports a level when the TV itself
   * handles audio. Hand the sound to a soundbar over ARC and there is no level
   * and no mute flag, so the bar, the percentage chip and the muted icon would
   * all be invented. When that is the case the row is just three buttons.
   */
  _renderVolume(e) {
    const t = ot(e), i = e.muted === !0;
    return r`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button"
          type="button"
          aria-label=${i ? "Unmute" : "Mute"}
          aria-pressed=${e.muted === void 0 ? "undefined" : i ? "true" : "false"}
          ${U(this._pressOptions("volume_mute"))}
        >
          <ha-icon icon=${i ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
      ${t ? r`
            <div class="volume-bar ${i ? "muted" : ""}">
              <span style="width:${Math.round(e.volume * 100)}%"></span>
            </div>
          ` : d}
    `;
  }
  _renderTextInput() {
    return r`
      <div class="text-row">
        <input
          type="text"
          .value=${this._text}
          placeholder="Type on the TV…"
          aria-label="Text to send to the TV"
          @input=${(e) => {
      this._text = e.target.value;
    }}
          @keydown=${(e) => {
      e.key === "Enter" && this._run(this._sendText());
    }}
        />
        <button
          class="control-button accent"
          type="button"
          aria-label="Send text"
          ?disabled=${!this._text.trim() || this._sending}
          @click=${() => this._run(this._sendText())}
        >
          <ha-icon class=${this._sending ? "spin" : ""} icon="mdi:send"></ha-icon>
        </button>
      </div>
    `;
  }
  /* -------------------------------------------------------------- apps -- */
  _renderAppIcon(e) {
    const t = e.icon ?? "mdi:application";
    if (t.startsWith("brand:")) {
      const i = Ee[t.slice(6)];
      if (i) return r`${i}`;
    }
    return t.startsWith("/") || t.startsWith("http") ? r`<img src=${t} alt="" />` : r`<ha-icon icon=${t}></ha-icon>`;
  }
  /**
   * One row of tiles.
   *
   * The app launcher is the built-in caller; user-defined sections are the same
   * grid with their own name. Labels gate on `show_section_labels`, so a custom
   * section is indistinguishable from a native one.
   */
  _renderSection(e, t, i, o) {
    const s = this._config;
    return e.length ? r`
      ${s.show_section_labels && t ? r`<div class="section-head">
            ${t}<span class="grow"></span><span class="count">${e.length}</span>
          </div>` : d}
      <div class="app-grid" style="--app-per-row: ${i}">
        ${kt(
      e,
      (n, a) => `${o}:${a}:${n.icon ?? ""}`,
      (n) => {
        const a = this.hass ? gi(this.hass, n.entity) : !1;
        return r`
              <button
                class="app-tile ${a ? "active" : ""}"
                type="button"
                aria-label=${n.name ?? "Launch app"}
                title=${n.name ?? ""}
                aria-pressed=${n.entity ? String(a) : d}
                style=${n.color ? `--app-color:${n.color}` : ""}
                ${U({
          onPress: () => this._launch(n),
          haptics: s.haptics,
          coordinator: this._pressCoordinator
        })}
              >
                ${this._renderAppIcon(n)}
              </button>
            `;
      }
    )}
      </div>
    ` : d;
  }
  _renderApps() {
    const e = this._config;
    return this._renderSection(
      e.apps,
      e.apps_label,
      e.app_columns,
      "apps"
    );
  }
  /** User-defined rows, in declared order, ahead of the app launcher. */
  _renderCustomSections() {
    const e = this._config;
    return e.sections.length ? r`
      ${e.sections.map(
      (t, i) => this._renderSection(
        t.buttons,
        t.name ?? "",
        t.columns ?? e.app_columns,
        `s${i}`
      )
    )}
    ` : d;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._config, t = this._device;
    if (!t.found)
      return r`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${e.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const i = ui("media_player", t.on ? "on" : "off"), o = t.available;
    return r`
      <ha-card class=${e.show_header ? "" : "headerless"} style="--tile-color:${i}">
        ${e.show_header ? this._renderHeader(t) : d}
        ${e.show_header && t.playerId === null ? r`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>` : d}
        ${o ? t.on ? r`
                ${e.show_nav ? r`<polr-atv-nav-pad
                      .pad=${e.pad}
                      .repeat=${e.hold_mode === "repeat"}
                      .nativeButtons=${e.native_hold_buttons.filter(
      (s) => this._usesNativeHold(s)
    )}
                      .nativeTouchHoldDelayMs=${e.native_touch_hold_delay_ms}
                      .pressCoordinator=${this._pressCoordinator}
                      .haptics=${e.haptics}
                      @atv-nav=${this._navigate}
                    ></polr-atv-nav-pad>` : d}
                ${this._renderNavigationRow()}
                ${e.show_transport ? this._renderTransport(t) : d}
                ${e.show_volume ? this._renderVolume(t) : d}
                ${e.show_text_input ? this._renderTextInput() : d}
                ${this._renderCustomSections()}
                ${e.show_apps ? this._renderApps() : d}
              ` : r`
                <!-- No "the TV is off" line: the header secondary already says
                     Off, and the button says Turn on. -->
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${U(this._pressOptions("power"))}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                ${this._renderCustomSections()}
                ${e.show_apps ? this._renderApps() : d}
              ` : r`<div class="empty-state">This device is unavailable.</div>`}
      </ha-card>
    `;
  }
};
B.styles = [Ve, Nt];
ae([
  S({ attribute: !1 })
], B.prototype, "hass", 2);
ae([
  b()
], B.prototype, "_config", 2);
ae([
  b()
], B.prototype, "_text", 2);
ae([
  b()
], B.prototype, "_sending", 2);
B = ae([
  ve(_e)
], B);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: _e,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/jeserga/polr-android-tv-remote-card"
});
console.info(`%c ${_e} %c ${ro} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  ro as CARD_VERSION,
  B as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
