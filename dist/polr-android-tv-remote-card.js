/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = globalThis, Yt = Pt.ShadowRoot && (Pt.ShadyCSS === void 0 || Pt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Xt = Symbol(), ne = /* @__PURE__ */ new WeakMap();
let Re = class {
  constructor(e, i, o) {
    if (this._$cssResult$ = !0, o !== Xt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Yt && e === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (e = ne.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && ne.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const oi = (t) => new Re(typeof t == "string" ? t : t + "", void 0, Xt), U = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((o, a, s) => o + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[s + 1], t[0]);
  return new Re(i, t, Xt);
}, ai = (t, e) => {
  if (Yt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const o = document.createElement("style"), a = Pt.litNonce;
    a !== void 0 && o.setAttribute("nonce", a), o.textContent = i.cssText, t.appendChild(o);
  }
}, le = Yt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const o of e.cssRules) i += o.cssText;
  return oi(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: si, defineProperty: ri, getOwnPropertyDescriptor: ni, getOwnPropertyNames: li, getOwnPropertySymbols: ci, getPrototypeOf: di } = Object, Mt = globalThis, ce = Mt.trustedTypes, pi = ce ? ce.emptyScript : "", hi = Mt.reactiveElementPolyfillSupport, $t = (t, e) => t, Ct = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? pi : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Gt = (t, e) => !si(t, e), de = { attribute: !0, type: String, converter: Ct, reflect: !1, useDefault: !1, hasChanged: Gt };
Symbol.metadata ??= Symbol("metadata"), Mt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ht = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = de) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const o = Symbol(), a = this.getPropertyDescriptor(e, o, i);
      a !== void 0 && ri(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, o) {
    const { get: a, set: s } = ni(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: a, set(r) {
      const c = a?.call(this);
      s?.call(this, r), this.requestUpdate(e, c, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? de;
  }
  static _$Ei() {
    if (this.hasOwnProperty($t("elementProperties"))) return;
    const e = di(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty($t("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($t("properties"))) {
      const i = this.properties, o = [...li(i), ...ci(i)];
      for (const a of o) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [o, a] of i) this.elementProperties.set(o, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const a = this._$Eu(i, o);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const o = new Set(e.flat(1 / 0).reverse());
      for (const a of o) i.unshift(le(a));
    } else e !== void 0 && i.push(le(e));
    return i;
  }
  static _$Eu(e, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (e.set(o, this[o]), delete this[o]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ai(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, o) {
    this._$AK(e, o);
  }
  _$ET(e, i) {
    const o = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, o);
    if (a !== void 0 && o.reflect === !0) {
      const s = (o.converter?.toAttribute !== void 0 ? o.converter : Ct).toAttribute(i, o.type);
      this._$Em = e, s == null ? this.removeAttribute(a) : this.setAttribute(a, s), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const o = this.constructor, a = o._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const s = o.getPropertyOptions(a), r = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Ct;
      this._$Em = a;
      const c = r.fromAttribute(i, s.type);
      this[a] = c ?? this._$Ej?.get(a) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, o, a = !1, s) {
    if (e !== void 0) {
      const r = this.constructor;
      if (a === !1 && (s = this[e]), o ??= r.getPropertyOptions(e), !((o.hasChanged ?? Gt)(s, i) || o.useDefault && o.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, o)))) return;
      this.C(e, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: o, reflect: a, wrapped: s }, r) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || o || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, s] of this._$Ep) this[a] = s;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [a, s] of o) {
        const { wrapped: r } = s, c = this[a];
        r !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, s, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
ht.elementStyles = [], ht.shadowRootOptions = { mode: "open" }, ht[$t("elementProperties")] = /* @__PURE__ */ new Map(), ht[$t("finalized")] = /* @__PURE__ */ new Map(), hi?.({ ReactiveElement: ht }), (Mt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis, pe = (t) => t, zt = Qt.trustedTypes, he = zt ? zt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, He = "$lit$", Z = `lit$${Math.random().toFixed(9).slice(2)}$`, Ue = "?" + Z, ui = `<${Ue}>`, nt = document, At = () => nt.createComment(""), St = (t) => t === null || typeof t != "object" && typeof t != "function", Zt = Array.isArray, mi = (t) => Zt(t) || typeof t?.[Symbol.iterator] == "function", Lt = `[ 	
\f\r]`, bt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ue = /-->/g, me = />/g, et = RegExp(`>|${Lt}(?:([^\\s"'>=/]+)(${Lt}*=${Lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ge = /"/g, je = /^(?:script|style|textarea|title)$/i, Ve = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), n = Ve(1), vi = Ve(2), Y = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), st = nt.createTreeWalker(nt, 129);
function qe(t, e) {
  if (!Zt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return he !== void 0 ? he.createHTML(e) : e;
}
const gi = (t, e) => {
  const i = t.length - 1, o = [];
  let a, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = bt;
  for (let c = 0; c < i; c++) {
    const p = t[c];
    let u, _, h = -1, v = 0;
    for (; v < p.length && (r.lastIndex = v, _ = r.exec(p), _ !== null); ) v = r.lastIndex, r === bt ? _[1] === "!--" ? r = ue : _[1] !== void 0 ? r = me : _[2] !== void 0 ? (je.test(_[2]) && (a = RegExp("</" + _[2], "g")), r = et) : _[3] !== void 0 && (r = et) : r === et ? _[0] === ">" ? (r = a ?? bt, h = -1) : _[1] === void 0 ? h = -2 : (h = r.lastIndex - _[2].length, u = _[1], r = _[3] === void 0 ? et : _[3] === '"' ? ge : ve) : r === ge || r === ve ? r = et : r === ue || r === me ? r = bt : (r = et, a = void 0);
    const g = r === et && t[c + 1].startsWith("/>") ? " " : "";
    s += r === bt ? p + ui : h >= 0 ? (o.push(u), p.slice(0, h) + He + p.slice(h) + Z + g) : p + Z + (h === -2 ? c : g);
  }
  return [qe(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), o];
};
class Tt {
  constructor({ strings: e, _$litType$: i }, o) {
    let a;
    this.parts = [];
    let s = 0, r = 0;
    const c = e.length - 1, p = this.parts, [u, _] = gi(e, i);
    if (this.el = Tt.createElement(u, o), st.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = st.nextNode()) !== null && p.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(He)) {
          const v = _[r++], g = a.getAttribute(h).split(Z), y = /([.?@])?(.*)/.exec(v);
          p.push({ type: 1, index: s, name: y[2], strings: g, ctor: y[1] === "." ? bi : y[1] === "?" ? _i : y[1] === "@" ? yi : It }), a.removeAttribute(h);
        } else h.startsWith(Z) && (p.push({ type: 6, index: s }), a.removeAttribute(h));
        if (je.test(a.tagName)) {
          const h = a.textContent.split(Z), v = h.length - 1;
          if (v > 0) {
            a.textContent = zt ? zt.emptyScript : "";
            for (let g = 0; g < v; g++) a.append(h[g], At()), st.nextNode(), p.push({ type: 2, index: ++s });
            a.append(h[v], At());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Ue) p.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(Z, h + 1)) !== -1; ) p.push({ type: 7, index: s }), h += Z.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const o = nt.createElement("template");
    return o.innerHTML = e, o;
  }
}
function vt(t, e, i = t, o) {
  if (e === Y) return e;
  let a = o !== void 0 ? i._$Co?.[o] : i._$Cl;
  const s = St(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== s && (a?._$AO?.(!1), s === void 0 ? a = void 0 : (a = new s(t), a._$AT(t, i, o)), o !== void 0 ? (i._$Co ??= [])[o] = a : i._$Cl = a), a !== void 0 && (e = vt(t, a._$AS(t, e.values), a, o)), e;
}
class fi {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: o } = this._$AD, a = (e?.creationScope ?? nt).importNode(i, !0);
    st.currentNode = a;
    let s = st.nextNode(), r = 0, c = 0, p = o[0];
    for (; p !== void 0; ) {
      if (r === p.index) {
        let u;
        p.type === 2 ? u = new gt(s, s.nextSibling, this, e) : p.type === 1 ? u = new p.ctor(s, p.name, p.strings, this, e) : p.type === 6 && (u = new xi(s, this, e)), this._$AV.push(u), p = o[++c];
      }
      r !== p?.index && (s = st.nextNode(), r++);
    }
    return st.currentNode = nt, a;
  }
  p(e) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, i), i += o.strings.length - 2) : o._$AI(e[i])), i++;
  }
}
class gt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, o, a) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = o, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = vt(this, e, i), St(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== Y && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : mi(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && St(this._$AH) ? this._$AA.nextSibling.data = e : this.T(nt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: o } = e, a = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = Tt.createElement(qe(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const s = new fi(a, this), r = s.u(this.options);
      s.p(i), this.T(r), this._$AH = s;
    }
  }
  _$AC(e) {
    let i = fe.get(e.strings);
    return i === void 0 && fe.set(e.strings, i = new Tt(e)), i;
  }
  k(e) {
    Zt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, a = 0;
    for (const s of e) a === i.length ? i.push(o = new gt(this.O(At()), this.O(At()), this, this.options)) : o = i[a], o._$AI(s), a++;
    a < i.length && (this._$AR(o && o._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const o = pe(e).nextSibling;
      pe(e).remove(), e = o;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class It {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, o, a, s) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = l;
  }
  _$AI(e, i = this, o, a) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = vt(this, e, i, 0), r = !St(e) || e !== this._$AH && e !== Y, r && (this._$AH = e);
    else {
      const c = e;
      let p, u;
      for (e = s[0], p = 0; p < s.length - 1; p++) u = vt(this, c[o + p], i, p), u === Y && (u = this._$AH[p]), r ||= !St(u) || u !== this._$AH[p], u === l ? e = l : e !== l && (e += (u ?? "") + s[p + 1]), this._$AH[p] = u;
    }
    r && !a && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class bi extends It {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class _i extends It {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class yi extends It {
  constructor(e, i, o, a, s) {
    super(e, i, o, a, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = vt(this, e, i, 0) ?? l) === Y) return;
    const o = this._$AH, a = e === l && o !== l || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, s = e !== l && (o === l || a);
    a && this.element.removeEventListener(this.name, this, o), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class xi {
  constructor(e, i, o) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    vt(this, e);
  }
}
const $i = { I: gt }, wi = Qt.litHtmlPolyfillSupport;
wi?.(Tt, gt), (Qt.litHtmlVersions ??= []).push("3.3.3");
const ki = (t, e, i) => {
  const o = i?.renderBefore ?? e;
  let a = o._$litPart$;
  if (a === void 0) {
    const s = i?.renderBefore ?? null;
    o._$litPart$ = a = new gt(e.insertBefore(At(), s), s, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = globalThis;
let T = class extends ht {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ki(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Y;
  }
};
T._$litElement$ = !0, T.finalized = !0, Jt.litElementHydrateSupport?.({ LitElement: T });
const Ai = Jt.litElementPolyfillSupport;
Ai?.({ LitElement: T });
(Jt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Si = { attribute: !0, type: String, converter: Ct, reflect: !1, hasChanged: Gt }, Ti = (t = Si, e, i) => {
  const { kind: o, metadata: a } = i;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), o === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const p = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, p, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, t, c), c;
    } };
  }
  if (o === "setter") {
    const { name: r } = i;
    return function(c) {
      const p = this[r];
      e.call(this, c), this.requestUpdate(r, p, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function b(t) {
  return (e, i) => typeof i == "object" ? Ti(t, e, i) : ((o, a, s) => {
    const r = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, o), r ? Object.getOwnPropertyDescriptor(a, s) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function d(t) {
  return b({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ei = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Be(t, e) {
  return (i, o, a) => {
    const s = (r) => r.renderRoot?.querySelector(t) ?? null;
    return Ei(i, o, { get() {
      return s(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = { CHILD: 2, ELEMENT: 6 }, We = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Fe = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, o) {
    this._$Ct = e, this._$AM = i, this._$Ci = o;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Pi } = $i, be = (t) => t, Ci = (t) => t.strings === void 0, _e = () => document.createComment(""), _t = (t, e, i) => {
  const o = t._$AA.parentNode, a = e === void 0 ? t._$AB : e._$AA;
  if (i === void 0) {
    const s = o.insertBefore(_e(), a), r = o.insertBefore(_e(), a);
    i = new Pi(s, r, t, t.options);
  } else {
    const s = i._$AB.nextSibling, r = i._$AM, c = r !== t;
    if (c) {
      let p;
      i._$AQ?.(t), i._$AM = t, i._$AP !== void 0 && (p = t._$AU) !== r._$AU && i._$AP(p);
    }
    if (s !== a || c) {
      let p = i._$AA;
      for (; p !== s; ) {
        const u = be(p).nextSibling;
        be(o).insertBefore(p, a), p = u;
      }
    }
  }
  return i;
}, it = (t, e, i = t) => (t._$AI(e, i), t), zi = {}, Oi = (t, e = zi) => t._$AH = e, Mi = (t) => t._$AH, Rt = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = (t, e, i) => {
  const o = /* @__PURE__ */ new Map();
  for (let a = e; a <= i; a++) o.set(t[a], a);
  return o;
}, Ke = We(class extends Fe {
  constructor(t) {
    if (super(t), t.type !== te.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, i) {
    let o;
    i === void 0 ? i = e : e !== void 0 && (o = e);
    const a = [], s = [];
    let r = 0;
    for (const c of t) a[r] = o ? o(c, r) : r, s[r] = i(c, r), r++;
    return { values: s, keys: a };
  }
  render(t, e, i) {
    return this.dt(t, e, i).values;
  }
  update(t, [e, i, o]) {
    const a = Mi(t), { values: s, keys: r } = this.dt(e, i, o);
    if (!Array.isArray(a)) return this.ut = r, s;
    const c = this.ut ??= [], p = [];
    let u, _, h = 0, v = a.length - 1, g = 0, y = s.length - 1;
    for (; h <= v && g <= y; ) if (a[h] === null) h++;
    else if (a[v] === null) v--;
    else if (c[h] === r[g]) p[g] = it(a[h], s[g]), h++, g++;
    else if (c[v] === r[y]) p[y] = it(a[v], s[y]), v--, y--;
    else if (c[h] === r[y]) p[y] = it(a[h], s[y]), _t(t, p[y + 1], a[h]), h++, y--;
    else if (c[v] === r[g]) p[g] = it(a[v], s[g]), _t(t, a[h], a[v]), v--, g++;
    else if (u === void 0 && (u = ye(r, g, y), _ = ye(c, h, v)), u.has(c[h])) if (u.has(c[v])) {
      const z = _.get(r[g]), O = z !== void 0 ? a[z] : null;
      if (O === null) {
        const M = _t(t, a[h]);
        it(M, s[g]), p[g] = M;
      } else p[g] = it(O, s[g]), _t(t, a[h], O), a[z] = null;
      g++;
    } else Rt(a[v]), v--;
    else Rt(a[h]), h++;
    for (; g <= y; ) {
      const z = _t(t, p[y + 1]);
      it(z, s[g]), p[g++] = z;
    }
    for (; h <= v; ) {
      const z = a[h++];
      z !== null && Rt(z);
    }
    return this.ut = r, Oi(t, p), Y;
  }
}), Et = (t, e, i) => {
  t.dispatchEvent(
    new CustomEvent(e, { detail: i, bubbles: !0, composed: !0 })
  );
}, Ii = (t, e) => Et(t, "hass-more-info", { entityId: e }), Di = (t, e, i = "var(--state-inactive-color, #9e9e9e)") => e === "unavailable" || e === "unknown" ? "var(--state-unavailable-color, var(--disabled-color))" : `var(--state-${t}-${e}-color, var(--state-icon-color, ${i}))`, Ni = (t) => typeof t == "object" && t !== null && !Array.isArray(t), ut = (t) => Ni(t) && typeof t.action == "string", jt = (t) => t !== void 0 && t.action !== "none", ee = (t) => {
  const e = (t ?? "").split(".");
  if (e.length !== 2) return null;
  const [i, o] = e;
  return !i || !o ? null : [i, o];
}, Vt = (t, e, i) => ({
  action: "perform-action",
  perform_action: t,
  ...e ? { data: e } : {},
  ...i ? { target: i } : {}
}), ie = (t, e, i, o) => {
  switch (i.action) {
    case "none":
      return Promise.resolve();
    case "more-info": {
      const a = i.entity ?? o;
      return a && t && Ii(t, a), Promise.resolve();
    }
    case "toggle": {
      const a = o;
      return a ? e.callService("homeassistant", "toggle", { entity_id: a }) : Promise.resolve();
    }
    case "navigate":
      return history.pushState(null, "", i.navigation_path), window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: !1 } })
      ), Promise.resolve();
    case "url":
      return window.open(i.url_path, "_blank", "noreferrer"), Promise.resolve();
    case "perform-action":
    case "call-service": {
      const a = i.action === "perform-action" ? i.perform_action : i.service, s = ee(a);
      if (!s)
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${a}"`)
        );
      const [r, c] = s, p = i.action === "perform-action" ? i.data : i.data ?? i.service_data;
      return e.callService(r, c, p ?? {}, i.target);
    }
  }
}, F = {
  PAUSE: 1,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024
}, Ye = {
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
}, Li = "text:", Xe = (t, e) => {
  const i = t.entities?.[e.entity]?.device_id;
  if (!i) return null;
  for (const o of Object.values(t.entities ?? {}))
    if (o.device_id === i && o.entity_id.startsWith("media_player."))
      return o.entity_id;
  return null;
}, Ht = (t) => t === void 0 || t.state === "unavailable" || t.state === "unknown", Ri = (t, e) => {
  const i = t.states?.[e.entity], o = Xe(t, e), a = o ? t.states?.[o] : void 0, s = a?.attributes ?? {}, r = i?.attributes ?? {}, c = e.volume_entity ?? o, u = (e.volume_entity && e.volume_entity !== o ? t.states?.[e.volume_entity] : a)?.attributes ?? {}, _ = a && !Ht(a) ? a.state !== "off" : i?.state === "on";
  return {
    remoteId: e.entity,
    playerId: o,
    remote: i,
    player: a,
    found: i !== void 0,
    available: !Ht(i) && (a === void 0 || !Ht(a)),
    on: _,
    name: e.name ?? r.friendly_name ?? e.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read.
    appName: s.app_name ?? r.current_activity,
    appId: s.app_id,
    playing: a?.state === "playing",
    features: s.supported_features ?? 0,
    volumeId: c,
    volumeOutput: typeof u.output_label == "string" ? u.output_label : void 0,
    controlEntry: e.audited_control && e.context_entity ? t.states?.[e.context_entity]?.attributes.entry_id : void 0,
    volumeFeatures: u.supported_features ?? 0,
    volume: typeof u.volume_level == "number" ? u.volume_level : void 0,
    muted: typeof u.is_volume_muted == "boolean" ? u.is_volume_muted : void 0
  };
}, Hi = /* @__PURE__ */ new Set([
  "off",
  "unavailable",
  "unknown",
  "idle",
  "standby",
  "none"
]), Ui = (t, e) => {
  if (!e) return !1;
  const i = t.states?.[e]?.state;
  return i === void 0 ? !1 : !Hi.has(i.toLowerCase());
}, mt = (t, e) => (t.features & e) !== 0, xe = (t, e) => (t.volumeFeatures & e) !== 0, $e = (t) => t.volume !== void 0, ji = (t, e) => {
  const i = ee(e.service);
  return i ? t.callService(i[0], i[1], e.data ?? {}, e.target) : Promise.reject(
    new Error(`polr-android-tv-remote-card: invalid service "${e.service}"`)
  );
}, oe = (t, e, i) => e.controlEntry ? t.callService("tv_guide", "control", { entry_id: e.controlEntry, command: i }) : t.callService("remote", "send_command", {
  entity_id: e.remoteId,
  command: i,
  // Home Assistant otherwise sleeps 400 ms after every command. A zero
  // delay preserves each rapid tap while the card's queue keeps its order.
  delay_secs: 0
}), Ut = (t, e, i, o) => {
  const a = Ye[i];
  if (!a) return Promise.resolve();
  const s = o === "start" ? "START_LONG" : "END_LONG";
  return e.controlEntry ? t.callService("tv_guide", "control", { entry_id: e.controlEntry, command: `${s}:${a}` }) : t.callService("remote", "send_command", {
    entity_id: e.remoteId,
    command: `${s}:${a}`,
    delay_secs: 0
  });
}, Vi = (t, e, i) => oe(t, e, `${Li}${i}`), qi = (t, e, i, o, a) => {
  const s = e.overrides[o]?.tap_action;
  if (jt(s))
    return ie(a, t, s, i.remoteId);
  if (s && s.action === "none") return Promise.resolve();
  const r = i.playerId;
  switch (o) {
    case "power":
      return r && mt(i, i.on ? F.TURN_OFF : F.TURN_ON) ? t.callService(
        "media_player",
        i.on ? "turn_off" : "turn_on",
        { entity_id: r }
      ) : t.callService("remote", i.on ? "turn_off" : "turn_on", {
        entity_id: i.remoteId
      });
    case "play_pause":
      if (r && mt(i, F.PAUSE))
        return t.callService("media_player", "media_play_pause", {
          entity_id: r
        });
      break;
    case "next":
      if (r && mt(i, F.NEXT_TRACK))
        return t.callService("media_player", "media_next_track", {
          entity_id: r
        });
      break;
    case "previous":
      if (r && mt(i, F.PREVIOUS_TRACK))
        return t.callService("media_player", "media_previous_track", {
          entity_id: r
        });
      break;
    case "volume_up":
    case "volume_down":
      if (i.volumeId && xe(i, F.VOLUME_STEP))
        return t.callService(
          "media_player",
          o === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: i.volumeId }
        );
      break;
    case "volume_mute":
      if (i.volumeId && i.muted !== void 0 && xe(i, F.VOLUME_MUTE))
        return t.callService("media_player", "volume_mute", {
          entity_id: i.volumeId,
          is_volume_muted: !i.muted
        });
      break;
  }
  const c = Ye[o];
  return c ? oe(t, i, c) : Promise.resolve();
}, we = (t, e, i, o) => {
  switch (i.action) {
    case "activity":
      return t.callService("remote", "turn_on", {
        entity_id: e.remoteId,
        activity: i.activity
      });
    case "app":
      return e.playerId ? t.callService("media_player", "play_media", {
        entity_id: e.playerId,
        media_content_type: "app",
        media_content_id: i.app_id
      }) : Promise.reject(
        new Error(
          "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found"
        )
      );
    case "key":
      return oe(t, e, i.key);
    // v1's shape.
    case "service":
      return ji(t, i);
    // Everything else is a Home Assistant action, run exactly as an override
    // would run it.
    default:
      return ie(o, t, i, e.remoteId);
  }
}, Bi = (t) => {
  switch (t.action) {
    case "activity":
      return `Launch ${t.activity}`;
    case "app":
      return `Open app ${t.app_id}`;
    case "key":
      return `Send ${t.key}`;
    case "service":
      return `Call ${t.service}`;
    case "perform-action":
      return `Call ${t.perform_action}`;
    case "call-service":
      return `Call ${t.service}`;
    case "navigate":
      return `Go to ${t.navigation_path}`;
    case "url":
      return `Open ${t.url_path}`;
    case "toggle":
      return "Toggle the TV";
    case "more-info":
      return "Show more info";
    case "none":
      return "Do nothing";
  }
}, ae = 1e3, qt = 750, Bt = 2e3;
class Wi {
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
  hold(e) {
    if (!(e !== this._session || this._state !== "pending"))
      return this._state = "held", "start";
  }
  /** A physical release is a short tap while pending, or key-up while held. */
  release(e) {
    if (e === this._session) {
      if (this._state === "pending")
        return this._state = "idle", "short";
      if (this._state === "held")
        return this._state = "idle", "end";
    }
  }
  /** Cancellation suppresses a pending tap, but must release a held key. */
  cancel(e = this._session) {
    if (e === this._session) {
      if (this._state === "held")
        return this._state = "idle", "end";
      this._state === "pending" && (this._state = "idle");
    }
  }
}
const Fi = ["buttons", "dpad", "touchpad"], Ki = ["repeat", "native", "none"], se = [
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
], Yi = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger"
}, Xi = (t) => {
  const e = ee(t);
  if (!e) return null;
  const i = Yi[e[0]];
  return i ? { service: `${e[0]}.${i}`, target: { entity_id: t } } : null;
}, x = {
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
  native_hold_buttons: [...se],
  native_touch_hold_delay_ms: ae,
  haptics: !0
}, ot = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" }
}, Wt = Object.keys(ot), Ge = (t) => {
  if (!t) return;
  const e = t.toLowerCase().replace(/[^a-z]/g, "");
  if (e)
    return Wt.find((i) => e.includes(i) || i.includes(e));
}, Qe = {
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
}, Ze = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input"
}, Gi = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad"
}, H = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Je = (t) => H(t) && typeof t.service == "string", ke = (t, e) => {
  if (typeof t == "string") {
    const i = Xi(t);
    if (i)
      return { tap_action: Vt(i.service, void 0, i.target) };
    J(
      `override "${e}" points at ${t}, which cannot simply be pressed. Use an action config instead.`
    );
    return;
  }
  if (!H(t)) {
    t !== void 0 && J(`override "${e}" is not an entity id or an action config`);
    return;
  }
  if (ut(t.tap_action) || ut(t.hold_action) || ut(t.double_tap_action)) {
    const i = {};
    for (const o of ["tap_action", "hold_action", "double_tap_action"]) {
      const a = t[o];
      ut(a) && (i[o] = a);
    }
    return i;
  }
  if (Je(t))
    return {
      tap_action: Vt(
        t.service,
        H(t.data) ? t.data : void 0,
        H(t.target) ? t.target : void 0
      )
    };
  J(`override "${e}" is not an entity id or an action config`);
};
let Ae = /* @__PURE__ */ new Set();
const J = (t) => {
  Ae.has(t) || (Ae.add(t), console.warn(`polr-android-tv-remote-card: ${t}`));
}, Se = (t) => {
  if (typeof t == "string") {
    const s = ot[t];
    return s ? {
      name: s.label,
      icon: `brand:${t}`,
      action: { action: "activity", activity: s.activity }
    } : (J(
      `unknown app "${t}" — treating it as an activity. Use an object with an icon and action instead.`
    ), {
      name: t,
      icon: "mdi:application",
      action: { action: "activity", activity: t }
    });
  }
  if (!H(t)) return null;
  if (H(t.action))
    return t;
  const e = typeof t.icon == "string" ? t.icon : void 0, i = typeof t.name == "string" ? t.name : void 0, o = typeof t.color == "string" ? t.color : void 0, a = typeof t.entity == "string" ? t.entity : void 0;
  return Je(t) ? {
    ...i ? { name: i } : {},
    ...e ? { icon: e } : {},
    ...o ? { color: o } : {},
    ...a ? { entity: a } : {},
    action: {
      action: "service",
      service: t.service,
      ...H(t.data) ? { data: t.data } : {},
      ...H(t.target) ? { target: t.target } : {}
    }
  } : typeof t.url == "string" ? {
    ...i ? { name: i } : {},
    ...e ? { icon: e } : {},
    ...o ? { color: o } : {},
    ...a ? { entity: a } : {},
    action: { action: "activity", activity: t.url }
  } : (J(`app entry has no action, url or service and was skipped: ${JSON.stringify(t)}`), null);
}, ti = (t) => {
  if (!H(t))
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  const e = typeof t.entity == "string" ? t.entity : typeof t.entity_id == "string" ? t.entity_id : void 0;
  if (!e)
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  const i = typeof t.remote == "string" ? Gi[t.remote] : void 0;
  typeof t.remote == "string" && !i && J(`unknown remote style "${t.remote}" — falling back to ${x.pad}`);
  const o = Fi.includes(t.pad) ? t.pad : i ?? x.pad, a = typeof t.volume == "boolean" ? t.volume : void 0, s = {};
  if (H(t.overrides))
    for (const [f, I] of Object.entries(t.overrides)) {
      const m = ke(I, f);
      m && (s[f] = m);
    }
  for (const [f, I] of Object.entries(Qe)) {
    if (s[I]) continue;
    const m = ke(t[f], f);
    m && (s[I] = m);
  }
  const r = {};
  for (const [f, I] of Object.entries(Ze))
    typeof t[f] == "boolean" && (r[I] = t[f]);
  const c = Array.isArray(t.transport_buttons) ? t.transport_buttons : Array.isArray(t.media_controls) ? t.media_controls : void 0, p = c ? c.filter(
    (f) => typeof f == "string" && x.transport_buttons.includes(f)
  ) : x.transport_buttons, u = (Array.isArray(t.sections) ? t.sections : []).map((f) => {
    if (!H(f))
      return J(`section is not an object and was skipped: ${JSON.stringify(f)}`), null;
    const I = (Array.isArray(f.buttons) ? f.buttons : []).map(Se).filter((m) => m !== null);
    return {
      ...typeof f.name == "string" ? { name: f.name } : {},
      ...typeof f.columns == "number" && f.columns > 0 ? { columns: f.columns } : {},
      buttons: I
    };
  }).filter((f) => f !== null), h = (Array.isArray(t.apps) ? t.apps : []).map(Se).filter((f) => f !== null), v = (f, I) => f === void 0 ? I : f, g = Ki.includes(t.hold_mode) ? t.hold_mode : t.hold_repeat === !1 ? "none" : x.hold_mode, y = new Set(se), z = Array.isArray(t.native_hold_buttons) ? [...new Set(t.native_hold_buttons)].filter(
    (f) => typeof f == "string" && y.has(f)
  ) : [...x.native_hold_buttons], O = t.native_touch_hold_delay_ms, M = typeof O == "number" && Number.isFinite(O) && O >= qt && O <= Bt ? O : x.native_touch_hold_delay_ms;
  return O !== void 0 && M !== O && J(
    `native_touch_hold_delay_ms must be between ${qt} and ${Bt}; using ${x.native_touch_hold_delay_ms}`
  ), {
    ...t,
    type: t.type,
    entity: e,
    ...typeof t.volume_entity == "string" ? { volume_entity: t.volume_entity } : {},
    ...typeof t.name == "string" ? { name: t.name } : {},
    show_header: v(t.show_header, x.show_header),
    show_power: v(t.show_power, x.show_power),
    show_nav: v(t.show_nav, r.show_nav ?? x.show_nav),
    pad: o,
    show_transport: v(t.show_transport, r.show_transport ?? x.show_transport),
    transport_buttons: p,
    show_volume: v(t.show_volume, r.show_volume ?? a ?? x.show_volume),
    show_text_input: v(
      t.show_text_input,
      r.show_text_input ?? x.show_text_input
    ),
    show_apps: v(t.show_apps, r.show_apps ?? x.show_apps),
    apps_label: typeof t.apps_label == "string" && t.apps_label.trim() ? t.apps_label.trim() : x.apps_label,
    show_section_labels: v(t.show_section_labels, x.show_section_labels),
    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: s.favorite !== void 0,
    apps: h,
    sections: u,
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns: typeof t.app_columns == "number" && t.app_columns > 0 ? t.app_columns : x.app_columns,
    hold_mode: g,
    native_hold_buttons: z,
    native_touch_hold_delay_ms: M,
    // Keep the resolved legacy value truthful for old rendering paths and
    // third-party code that reads it from the editor's emitted config.
    hold_repeat: g === "repeat",
    haptics: v(t.haptics, x.haptics),
    overrides: s
  };
}, Qi = (t) => {
  const e = /* @__PURE__ */ new Set([
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
    ...Object.keys(Ze),
    ...Object.keys(Qe)
  ]), i = {};
  for (const [o, a] of Object.entries(t))
    e.has(o) || (i[o] = a);
  return i;
}, dt = (t) => vi`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="${t}" />
  </svg>
`, Ft = {
  disneyplus: dt(
    "M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
  ),
  hbomax: dt(
    "M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
  ),
  hulu: dt(
    "m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
  ),
  netflix: dt(
    "M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
  ),
  prime: dt(
    "M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
  ),
  youtube: dt(
    "M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
  )
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = (t, e) => {
  const i = t._$AN;
  if (i === void 0) return !1;
  for (const o of i) o._$AO?.(e, !1), wt(o, e);
  return !0;
}, Ot = (t) => {
  let e, i;
  do {
    if ((e = t._$AM) === void 0) break;
    i = e._$AN, i.delete(t), t = e;
  } while (i?.size === 0);
}, ei = (t) => {
  for (let e; e = t._$AM; t = e) {
    let i = e._$AN;
    if (i === void 0) e._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(t)) break;
    i.add(t), to(e);
  }
};
function Zi(t) {
  this._$AN !== void 0 ? (Ot(this), this._$AM = t, ei(this)) : this._$AM = t;
}
function Ji(t, e = !1, i = 0) {
  const o = this._$AH, a = this._$AN;
  if (a !== void 0 && a.size !== 0) if (e) if (Array.isArray(o)) for (let s = i; s < o.length; s++) wt(o[s], !1), Ot(o[s]);
  else o != null && (wt(o, !1), Ot(o));
  else wt(this, t);
}
const to = (t) => {
  t.type == te.CHILD && (t._$AP ??= Ji, t._$AQ ??= Zi);
};
class eo extends Fe {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, i, o) {
    super._$AT(e, i, o), ei(this), this.isConnected = e._$AU;
  }
  _$AO(e, i = !0) {
    e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), i && (wt(this, e), Ot(this));
  }
  setValue(e) {
    if (Ci(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = e, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
const Te = 500, Ee = 220, Pe = 40, io = 15e3, Ce = 500, ze = 750, oo = 250, ao = 12, so = 24;
class ro {
  claim(e) {
    if (this._active === e) return;
    const i = this._active;
    this._active = e, i?.cancelPress();
  }
  release(e) {
    this._active === e && (this._active = void 0);
  }
  cancel() {
    const e = this._active;
    this._active = void 0, e?.cancelPress();
  }
}
class no extends eo {
  constructor(e) {
    if (super(e), this._repeats = 0, this._bound = !1, this._active = !1, this._resolved = !1, this._gestureId = 0, this._startX = 0, this._startY = 0, this._awaitingSecondTap = !1, this._native = new Wi(), this._onPointerDown = (i) => {
      if (i.button !== 0 || this._isDirectPointer(i.pointerType) && !i.isPrimary) return;
      const o = this._options;
      if (!o || o.disabled) return;
      const a = this._beginGesture(o, i.pointerType || "mouse");
      if (this._startX = i.clientX, this._startY = i.clientY, this._pointerId = i.pointerId, this._claimsTouch(o) && this._isDirectPointer(i.pointerType)) {
        i.preventDefault();
        try {
          this._element?.setPointerCapture(i.pointerId);
        } catch {
        }
      }
      if (this._armSafety(), this._isNative(o)) {
        const r = this._native.begin();
        this._nativeSession = r, this._holdTimer = window.setTimeout(
          () => this._startNative(a, r),
          this._nativeHoldDelay(o, this._pointerType)
        );
        return;
      }
      if (o.onHold) {
        this._holdTimer = window.setTimeout(() => {
          this._isCurrent(a) && (this._resolved = !0, this._fire(o.onHold, "medium", o));
        }, Ce);
        return;
      }
      if (!o.repeat || !o.onPress) return;
      const s = o.onPress;
      this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
        this._isCurrent(a) && (this._resolved = !0, this._fire(s, "light", o), this._repeatTimer = window.setInterval(() => {
          if (!this._isCurrent(a) || this._repeats >= Pe) {
            this.cancelPress();
            return;
          }
          this._repeats += 1, this._fire(s, "light", o);
        }, Ee));
      }, Te);
    }, this._onPointerMove = (i) => {
      if (!this._active || this._pointerId !== void 0 && i.pointerId !== this._pointerId || this._native.state !== "idle") return;
      const o = i.clientX - this._startX, a = i.clientY - this._startY, s = this._claimsTouch(this._gestureOptions) ? so : ao;
      o * o + a * a > s * s && this.cancelPress();
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
      const a = this._beginGesture(o, "keyboard");
      if (this._armSafety(), this._isNative(o)) {
        const r = this._native.begin();
        this._nativeSession = r, this._holdTimer = window.setTimeout(
          () => this._startNative(a, r),
          ze
        );
        return;
      }
      if (this._resolved = !0, this._tap(o), o.onHold) {
        this._holdTimer = window.setTimeout(() => {
          this._isCurrent(a) && this._fire(o.onHold, "medium", o);
        }, Ce);
        return;
      }
      if (!o.repeat || !o.onPress) return;
      const s = o.onPress;
      this._repeats = 0, this._repeatTimer = window.setTimeout(() => {
        this._repeatTimer = window.setInterval(() => {
          if (!this._isCurrent(a) || this._repeats >= Pe) {
            this.cancelPress();
            return;
          }
          this._repeats += 1, this._fire(s, "light", o);
        }, Ee);
      }, Te);
    }, this._onKeyUp = (i) => {
      i.key !== "Enter" && i.key !== " " || this._release();
    }, this.cancelPress = () => {
      this._active && (this._nativeSession !== void 0 ? this._finishNative(!1) : this._reset());
    }, this._onVisibilityChange = () => {
      document.hidden && this.cancelPress();
    }, e.type !== te.ELEMENT)
      throw new Error("press() can only be used on an element");
  }
  render(e) {
    return Y;
  }
  update(e, [i]) {
    if (this._element = e.element, i.disabled && this._active && this.cancelPress(), this._options = i, this._element.classList.toggle(
      "press-claim-touch",
      this._claimsTouch(i)
    ), !this._bound) {
      this._bound = !0;
      const o = this._element;
      o.addEventListener("pointerdown", this._onPointerDown), o.addEventListener("pointermove", this._onPointerMove), o.addEventListener("pointerup", this._onPointerUp), o.addEventListener("pointercancel", this._onPointerCancel), o.addEventListener("lostpointercapture", this._onLostPointerCapture), o.addEventListener("pointerleave", this._onPointerLeave), o.addEventListener("click", this._onClick), o.addEventListener("dragstart", this.cancelPress), o.addEventListener("keydown", this._onKeyDown), o.addEventListener("keyup", this._onKeyUp), o.addEventListener("blur", this.cancelPress), o.addEventListener("contextmenu", this._onContextMenu);
    }
    return Y;
  }
  /* ------------------------------------------------------------------ state */
  _beginGesture(e, i) {
    return this._active && this.cancelPress(), e.coordinator?.claim(this), this._coordinator = e.coordinator, this._gestureOptions = e, this._active = !0, this._resolved = !1, this._pointerType = i, this._repeats = 0, this._gestureId += 1, this._element?.classList.add("pressed"), this._gestureId;
  }
  _isCurrent(e) {
    return this._active && e === this._gestureId;
  }
  _startNative(e, i) {
    if (!this._isCurrent(e) || this._native.hold(i) !== "start") return;
    const o = this._gestureOptions;
    o?.onPressStart && (this._resolved = !0, this._holdTimer = void 0, this._fireNative(o.onPressStart, "light", o), this._nativeTimer = window.setTimeout(() => {
      this._isCurrent(e) && this.cancelPress();
    }, io));
  }
  /** Resolve a physical release as either one short tap or one native key-up. */
  _release() {
    if (!this._active) return;
    if (this._nativeSession !== void 0) {
      this._finishNative(!0);
      return;
    }
    const e = this._resolved, i = this._gestureOptions ?? this._options;
    this._reset(), !e && i && this._tap(i);
  }
  _finishNative(e) {
    const i = this._nativeSession, o = this._gestureOptions;
    if (i === void 0 || !o) {
      this._reset();
      return;
    }
    const a = e ? this._native.release(i) : this._native.cancel(i);
    this._reset(), a === "short" && o.onPress ? this._tap(o) : a === "end" && o.onPressEnd && this._fireNative(o.onPressEnd, void 0, o);
  }
  /* ------------------------------------------------------------------ firing */
  _tap(e) {
    if (!e.onPress) return;
    const i = e.onPress;
    if (!e.onDoubleTap) {
      this._fire(i, "light", e);
      return;
    }
    if (this._awaitingSecondTap) {
      window.clearTimeout(this._tapTimer), this._awaitingSecondTap = !1, this._fire(e.onDoubleTap, "light", e);
      return;
    }
    this._awaitingSecondTap = !0, this._tapTimer = window.setTimeout(() => {
      this._awaitingSecondTap = !1, this._fire(i, "light", e);
    }, oo);
  }
  /** Never coalesce valid taps: transport ordering is handled by the card. */
  _fire(e, i, o) {
    o.haptics !== !1 && this._element && Et(this._element, "haptic", i), e();
  }
  _fireNative(e, i, o) {
    i && o.haptics !== !1 && this._element && Et(this._element, "haptic", i), e();
  }
  /* ---------------------------------------------------------------- teardown */
  _armSafety() {
    this._pointerId !== void 0 && (window.addEventListener("pointerup", this._onWindowPointerUp, !0), window.addEventListener("pointercancel", this._onWindowPointerCancel, !0), window.addEventListener("mouseup", this._onWindowMouseUp, !0), window.addEventListener("touchend", this._onWindowTouchEnd, !0), window.addEventListener("touchcancel", this._onWindowTouchCancel, !0)), window.addEventListener("pagehide", this.cancelPress), window.addEventListener("beforeunload", this.cancelPress), window.addEventListener("blur", this.cancelPress), document.addEventListener("freeze", this.cancelPress), document.addEventListener("visibilitychange", this._onVisibilityChange);
  }
  _reset() {
    const e = this._element, i = this._pointerId, o = this._pointerType, a = this._gestureId, s = this._coordinator;
    if (this._active = !1, this._resolved = !1, this._repeats = 0, this._nativeSession = void 0, this._gestureOptions = void 0, this._coordinator = void 0, e?.classList.remove("pressed"), s?.release(this), window.removeEventListener("pointerup", this._onWindowPointerUp, !0), window.removeEventListener("pointercancel", this._onWindowPointerCancel, !0), window.removeEventListener("mouseup", this._onWindowMouseUp, !0), window.removeEventListener("touchend", this._onWindowTouchEnd, !0), window.removeEventListener("touchcancel", this._onWindowTouchCancel, !0), window.removeEventListener("pagehide", this.cancelPress), window.removeEventListener("beforeunload", this.cancelPress), window.removeEventListener("blur", this.cancelPress), document.removeEventListener("freeze", this.cancelPress), document.removeEventListener("visibilitychange", this._onVisibilityChange), i !== void 0)
      try {
        e?.hasPointerCapture(i) && e.releasePointerCapture(i);
      } catch {
      }
    this._pointerId = void 0, this._pointerType = void 0, this._repeatTimer !== void 0 && (window.clearTimeout(this._repeatTimer), window.clearInterval(this._repeatTimer), this._repeatTimer = void 0), this._holdTimer !== void 0 && (window.clearTimeout(this._holdTimer), this._holdTimer = void 0), this._nativeTimer !== void 0 && (window.clearTimeout(this._nativeTimer), this._nativeTimer = void 0), e && this._isDirectPointer(o) && (e.blur(), window.setTimeout(() => {
      !this._active && this._gestureId === a && e.blur();
    }, 0));
  }
  _isNative(e) {
    return !!(e?.onPressStart && e.onPressEnd);
  }
  _claimsTouch(e) {
    return !!(e?.claimTouch || this._isNative(e));
  }
  _isDirectPointer(e) {
    return e === "touch" || e === "pen";
  }
  _nativeHoldDelay(e, i) {
    return this._isDirectPointer(i) ? e.nativeTouchHoldDelayMs ?? ae : ze;
  }
  disconnected() {
    this.cancelPress(), this._tapTimer !== void 0 && (window.clearTimeout(this._tapTimer), this._tapTimer = void 0), this._awaitingSecondTap = !1;
  }
}
const at = We(no), ii = U`
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
  .volume-output {
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 12px;
    padding: 0 12px 10px;
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
`, re = U`
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
var lo = Object.defineProperty, co = Object.getOwnPropertyDescriptor, q = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? co(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && lo(e, i, a), a;
};
const Oe = 0.06, po = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center"
};
let D = class extends T {
  constructor() {
    super(...arguments), this.pad = "buttons", this.repeat = !0, this.nativeButtons = [], this.haptics = !0, this.nativeTouchHoldDelayMs = ae, this._tracking = !1, this._startX = 0, this._startY = 0, this._onPointerDown = (t) => {
      t.button === 0 && (t.preventDefault(), this._touchpad?.setPointerCapture(t.pointerId), this._startX = t.clientX, this._startY = t.clientY, this._tracking = !0, this._moveDot(t));
    }, this._onPointerMove = (t) => {
      this._tracking && (t.preventDefault(), this._moveDot(t));
    }, this._onPointerUp = (t) => {
      if (!this._tracking) return;
      this._tracking = !1;
      const e = this._touchpad;
      if (!e) return;
      const i = e.getBoundingClientRect(), o = (t.clientX - this._startX) / i.width, a = (t.clientY - this._startY) / i.height;
      if (Math.abs(o) < Oe && Math.abs(a) < Oe) {
        this._emit("center");
        return;
      }
      Math.abs(o) >= Math.abs(a) ? this._emit(o < 0 ? "left" : "right") : this._emit(a < 0 ? "up" : "down");
    }, this._onPointerCancel = () => {
      this._tracking = !1;
    }, this._onKeyDown = (t) => {
      const e = po[t.key];
      e && (t.preventDefault(), this._emit(e));
    };
  }
  _emit(t, e = "short") {
    Et(this, "atv-nav", { direction: t, phase: e });
  }
  _pressOptions(t) {
    return this.nativeButtons.includes(t) ? {
      onPress: () => this._emit(t),
      onPressStart: () => this._emit(t, "start"),
      onPressEnd: () => this._emit(t, "end"),
      haptics: this.haptics,
      claimTouch: !0,
      nativeTouchHoldDelayMs: this.nativeTouchHoldDelayMs,
      coordinator: this.pressCoordinator
    } : {
      onPress: () => this._emit(t),
      repeat: this.repeat && t !== "center",
      haptics: this.haptics,
      claimTouch: !0,
      coordinator: this.pressCoordinator
    };
  }
  _key(t, e, i, o = "") {
    return n`
      <button
        class="pad-key ${o}"
        type="button"
        aria-label=${i}
        ${at(this._pressOptions(t))}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  _blank() {
    return n`<span class="pad-key blank" aria-hidden="true"></span>`;
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
    return n`
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
    return n`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${at(this._pressOptions("center"))}
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
    return n`
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
  _moveDot(t) {
    const e = this._touchpad, i = this._dot;
    if (!e || !i) return;
    const o = e.getBoundingClientRect();
    i.style.transform = `translate(${t.clientX - o.left}px, ${t.clientY - o.top}px)`;
  }
  render() {
    return n`
      <div class="pad">
        ${this.pad === "touchpad" ? this._renderTouchpad() : this.pad === "dpad" ? this._renderDpad() : this._renderButtons()}
      </div>
    `;
  }
};
D.styles = [re, ii];
q([
  b({ type: String })
], D.prototype, "pad", 2);
q([
  b({ type: Boolean })
], D.prototype, "repeat", 2);
q([
  b({ attribute: !1 })
], D.prototype, "nativeButtons", 2);
q([
  b({ type: Boolean })
], D.prototype, "haptics", 2);
q([
  b({ type: Number })
], D.prototype, "nativeTouchHoldDelayMs", 2);
q([
  b({ attribute: !1 })
], D.prototype, "pressCoordinator", 2);
q([
  Be(".touchpad")
], D.prototype, "_touchpad", 2);
q([
  Be(".touchpad-dot")
], D.prototype, "_dot", 2);
q([
  d()
], D.prototype, "_tracking", 2);
D = q([
  j("polr-atv-nav-pad")
], D);
const V = (t) => new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" }).format(new Date(t * 1e3)), yt = (t = /* @__PURE__ */ new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(t);
function kt(t) {
  const [e, i, o] = t.split("-").map(Number), a = (s) => {
    let r = s;
    for (let c = 0; c < 3; c++) {
      const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(r)), u = Object.fromEntries(p.map((_) => [_.type, Number(_.value)]));
      r += s - Date.UTC(u.year, u.month - 1, u.day, u.hour, u.minute, u.second);
    }
    return r / 1e3;
  };
  return [a(Date.UTC(e, i - 1, o)), a(Date.UTC(e, i - 1, o + 1))];
}
function ho(t, e, i) {
  const o = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), a = o(i.trim());
  return t.filter((s) => (e === "all" || (e === "favorites" ? s.favorite : s.kind === e)) && o(`${s.number} ${s.name}`).includes(a));
}
function uo(t, e) {
  return t.end > t.start ? Math.max(0, Math.min(100, (e - t.start) / (t.end - t.start) * 100)) : 0;
}
function mo(t, e, i) {
  return { left: Math.max(0, (t.start - e) / (i - e) * 100), width: Math.max(0, (Math.min(i, t.end) - Math.max(e, t.start)) / (i - e) * 100) };
}
var vo = Object.defineProperty, go = Object.getOwnPropertyDescriptor, E = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? go(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && vo(e, i, a), a;
};
let w = class extends T {
  constructor() {
    super(...arguments), this.channels = [], this.programs = [], this.query = "", this.filter = "all", this.mode = "list", this.day = yt(), this.error = "", this.loading = !1, this.now = Date.now() / 1e3, this.lastDay = yt(), this.missing = 0, this.loaded = "", this.requestId = 0, this.scrolled = "";
  }
  setConfig(t) {
    if (!t.entity) throw new Error("Configura la entidad de contexto de la TV");
    this.config = { ...t, entity: t.entity }, this.loaded = "";
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
  updated(t) {
    const e = this.shadowRoot?.querySelector("select");
    e && (e.value = this.context.channel?.key ?? "");
    const i = `${this.context.entry_id}:${this.context.guide_revision}:${this.day}:${this.config?.compact}`;
    if (this.hass && this.context.entry_id && i !== this.loaded && !this.loading && (this.loaded = i, this.load()), this.mode === "guide" && !this.loading && this.scrolled !== this.day) {
      const o = this.shadowRoot?.querySelector(".timeline");
      if (o) {
        const [a, s] = kt(this.day);
        o.scrollLeft = Math.max(0, (this.now - a - 1800) / (s - a) * 2880), this.scrolled = this.day;
      }
    }
  }
  async load() {
    const t = ++this.requestId;
    this.loading = !0, this.error = "";
    try {
      const e = this.context.entry_id, [i, o] = kt(this.day), [a, s] = await Promise.all([
        this.hass.callWS({ type: "tv_guide/catalog", entry_id: e }),
        this.config?.compact ? Promise.resolve({ programs: [], available_end: 0 }) : this.hass.callWS({ type: "tv_guide/epg", entry_id: e, start: i, end: o })
      ]);
      if (t !== this.requestId) return;
      this.channels = a.channels, this.programs = s.programs, this.missing = a.missing_favorites.length, s.available_end && (this.lastDay = yt(new Date(Math.min(s.available_end * 1e3, Date.now() + 6 * 864e5))));
    } catch (e) {
      t === this.requestId && (this.error = e.message || "No se pudo cargar la guía");
    } finally {
      t === this.requestId && (this.loading = !1);
    }
  }
  async service(t, e) {
    this.error = "";
    try {
      await this.hass.callService("tv_guide", t, { entry_id: this.context.entry_id, ...e }), t === "refresh" && (this.loaded = "", this.requestUpdate());
    } catch (i) {
      this.error = i.message || "No se pudo completar la acción";
    }
  }
  tune(t) {
    this.service("tune_channel", { channel_key: t });
  }
  favorite(t) {
    this.service("set_favorite", { channel_key: t.key, favorite: !t.favorite });
  }
  navigate(t) {
    history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed"));
  }
  async details(t) {
    this.selected = t, await this.updateComplete, this.shadowRoot?.querySelector("dialog")?.showModal();
  }
  channelRow(t) {
    const e = this.programs.find((i) => i.channel === t.key && i.start <= this.now && this.now < i.end) ?? (t.current && t.current.start <= this.now && this.now < t.current.end ? t.current : void 0);
    return n`<div class="channel ${this.context.channel?.key === t.key ? "active" : ""}">
      <button class="station" @click=${() => this.tune(t.key)} aria-label=${`Ver ${t.option}`}><span class="dial">${t.number}</span><span><strong>${t.name}</strong><small>${e?.title ?? "Programación no disponible"}</small></span></button>
      ${e ? n`<button class="icon" @click=${() => this.details(e)} aria-label=${`Información de ${e.title}`}><ha-icon icon="mdi:information-outline"></ha-icon></button>` : l}
      <button class="icon star" aria-label=${`${t.favorite ? "Quitar" : "Añadir"} ${t.name} ${t.favorite ? "de" : "a"} favoritos`} aria-pressed=${t.favorite} @click=${() => this.favorite(t)}><ha-icon icon=${t.favorite ? "mdi:star" : "mdi:star-outline"}></ha-icon></button>
    </div>`;
  }
  compact() {
    const t = this.context, e = t.current, i = this.channels.filter((o) => o.favorite);
    return n`
      ${t.kind === "tv" && t.channel ? n`<div class="now-playing"><div class="eyebrow">AHORA EN ${t.channel.name}</div><h3>${e?.title ?? "Programación no disponible"}</h3>
        ${e ? n`<div class="time-range"><span>${V(e.start)}</span><span>${V(e.end)}</span></div><progress max="100" value=${uo(e, this.now)} aria-label="Progreso del programa"></progress><button class="text-button" @click=${() => this.details(e)}>Ver información</button>` : l}
        ${(t.next ?? []).length ? n`<div class="next">${t.next.map((o) => n`<button @click=${() => this.details(o)}><time>${V(o.start)}</time><span>${o.title}</span></button>`)}</div>` : l}
        <button class="text-button" @click=${() => {
      const o = this.channels.find((a) => a.key === t.channel.key);
      o && this.favorite(o);
    }}><ha-icon icon=${t.favorite ? "mdi:star" : "mdi:star-outline"}></ha-icon>${t.favorite ? "Quitar de favoritos" : "Añadir canal a favoritos"}</button>
      </div>` : l}
      <div class="section-title">Favoritos</div>
      ${i.length ? n`<div class="favorites">${i.map((o) => n`<button @click=${() => this.tune(o.key)} class=${t.channel?.key === o.key ? "chosen" : ""}>${o.number} · ${o.name}</button>`)}</div>` : n`<p class="hint">Marca una estrella en la lista para guardar los canales de casa.</p>`}
      <label class="select-label">Cambiar de canal<select aria-label="Seleccionar canal" .value=${t.channel?.key ?? ""} @change=${(o) => {
      const a = o.target;
      a.value && this.tune(a.value), a.value = t.channel?.key ?? "";
    }}><option value="">Selecciona un canal…</option>${this.channels.map((o) => n`<option value=${o.key}>${o.option}${o.kind === "radio" ? " · Radio" : ""}</option>`)}</select></label>
      <button class="primary" @click=${() => this.navigate(this.config?.guide_path ?? "/mando-tv/guia")}><ha-icon icon="mdi:television-guide"></ha-icon>Canales y guía</button>`;
  }
  full() {
    const t = ho(this.channels, this.filter, this.query), [e, i] = kt(this.day);
    return n`<header><div><h2>Canales y guía</h2><p>${this.channels.filter((o) => o.kind === "tv").length} canales de TV · ${this.channels.filter((o) => o.kind === "radio").length} de radio</p></div><button class="text-button" @click=${() => this.navigate("/mando-tv/mando")}>Volver al mando</button></header>
      <div class="tools"><input type="search" aria-label="Buscar canal o dial" placeholder="Buscar canal o dial" .value=${this.query} @input=${(o) => this.query = o.target.value}>
        <div class="pills" role="group" aria-label="Tipo de canal">${[["all", "Todos"], ["tv", "Televisión"], ["radio", "Radio"], ["favorites", "Favoritos"]].map(([o, a]) => n`<button aria-pressed=${this.filter === o} @click=${() => this.filter = o}>${a}</button>`)}</div></div>
      <div class="toolbar"><div class="pills" role="group" aria-label="Presentación">${[["list", "Lista"], ["guide", "Guía"]].map(([o, a]) => n`<button aria-pressed=${this.mode === o} @click=${() => {
      this.mode = o, this.scrolled = "";
    }}> ${a} </button>`)}</div>
        ${this.mode === "guide" ? n`<input type="date" aria-label="Fecha de la guía" .value=${this.day} min=${yt()} max=${this.lastDay} @change=${(o) => {
      const a = o.target.value;
      a && (this.day = a, this.scrolled = "");
    }}><button class="text-button" @click=${() => {
      this.day = yt(), this.scrolled = "";
    }}>Ahora</button>` : l}
        <button class="icon" aria-label="Actualizar catálogo y programación" @click=${() => void this.service("refresh", {})}><ha-icon icon="mdi:refresh"></ha-icon></button></div>
      ${this.mode === "list" ? n`<div class="channel-list">${Ke(t, (o) => o.key, (o) => this.channelRow(o))}</div>` : n`
        <div class="timeline"><div class="ruler"><div class="sticky">${this.day.split("-").reverse().join("/")}</div><div class="hours">${Array.from({ length: Math.round((i - e) / 3600) }, (o, a) => n`<span style=${`left:${a * 3600 / (i - e) * 100}%`}>${V(e + a * 3600)}</span>`)}</div></div>
          ${t.map((o) => {
      const a = this.programs.filter((s) => s.channel === o.key);
      return n`<div class="track"><button class="sticky" @click=${() => this.tune(o.key)}><strong>${o.number} · ${o.name}</strong>${o.favorite ? " ★" : ""}</button><div class="slots">${a.length ? a.map((s) => {
        const r = mo(s, e, i);
        return n`<button class="slot ${s.start <= this.now && this.now < s.end ? "live" : ""}" style=${`left:${r.left}%;width:${r.width}%`} @click=${() => this.details(s)} aria-label=${`${o.name}: ${s.title}, ${V(s.start)} a ${V(s.end)}`}><small>${V(s.start)}</small><span>${s.title}</span></button>`;
      }) : n`<span class="no-epg">Programación no disponible</span>`}</div></div>`;
    })}
        </div>
        <div class="mobile-guide">${t.map((o) => n`<section>${this.channelRow(o)}<div class="agenda">${this.programs.filter((a) => a.channel === o.key && a.end > Math.max(e, this.now)).map((a) => n`<button @click=${() => this.details(a)}><time>${V(a.start)}</time><span>${a.title}</span></button>`)}</div></section>`)}</div>`}
      ${t.length ? l : n`<p class="hint">No hay canales con este filtro.</p>`}
      <footer>Programación de la TV, <a href="https://www.tdtchannels.com" target="_blank" rel="noopener noreferrer">TDTChannels</a> y <a href="https://epgshare01.online" target="_blank" rel="noopener noreferrer">EPGShare01</a>. La cobertura depende de cada emisora.</footer>`;
  }
  render() {
    return !this.config || !this.hass ? l : n`<ha-card><div class="body ${this.config.compact ? "compact" : ""}">
      ${this.context.entry_id ? this.config.compact ? this.compact() : this.full() : n`<p class="hint">La guía de la TV no está disponible.</p>`}
      ${this.loading ? n`<p class="hint" role="status">Actualizando guía…</p>` : l}
      ${this.context.busy ? n`<p class="notice" role="status">Cambiando a ${this.context.busy}…</p>` : l}
      ${this.error || this.context.error ? n`<p class="error" role="alert">${this.error || this.context.error} <button class="text-button" @click=${() => void this.load()}>Reintentar</button></p>` : l}
      ${this.missing ? n`<p class="hint">${this.missing} favorito(s) ya no aparecen en el catálogo de la TV.</p>` : l}
      <dialog @close=${() => this.selected = void 0}>${this.selected ? n`<div class="details"><button class="close icon" aria-label="Cerrar información" @click=${() => this.shadowRoot?.querySelector("dialog")?.close()}><ha-icon icon="mdi:close"></ha-icon></button><div class="eyebrow">${this.channels.find((t) => t.key === this.selected.channel)?.name}</div><h2>${this.selected.title}</h2><p>${V(this.selected.start)} – ${V(this.selected.end)}</p><p class="description">${this.selected.description || "Sin descripción disponible."}</p><small>Programación: ${{ tv: "Televisión", tdtchannels: "TDTChannels", epgshare01: "EPGShare01" }[this.selected.source] ?? this.selected.source}</small><button class="primary" @click=${() => {
      this.tune(this.selected.channel), this.shadowRoot?.querySelector("dialog")?.close();
    }}>Ver canal ahora</button></div>` : l}</dialog>
    </div></ha-card>`;
  }
};
w.styles = U`
    :host{display:block}*{box-sizing:border-box}ha-card{overflow:hidden}.body{padding:20px;color:var(--primary-text-color)}h2,h3,p{margin:0}h2{font-size:22px}h3{font-size:19px;line-height:1.35;margin:5px 0 10px}button,input,select{font:inherit;color:inherit}button{cursor:pointer;border:0;background:transparent;touch-action:manipulation}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}button:disabled{opacity:.5}.icon{padding:10px;border-radius:50%;display:inline-grid;place-items:center;flex-shrink:0}.star[aria-pressed=true]{color:#e8ae23}ha-icon{--mdc-icon-size:22px}.primary{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--primary-color);color:var(--text-primary-color,#fff);padding:12px 18px;border-radius:12px;width:100%;margin-top:16px;font-weight:600}.text-button{color:var(--primary-color);padding:8px 4px;display:inline-flex;align-items:center;gap:6px}.hint{color:var(--secondary-text-color);font-size:13px;line-height:1.5;margin:10px 0}.eyebrow{font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--secondary-text-color);text-transform:uppercase}.time-range{display:flex;justify-content:space-between;font-size:12px;color:var(--secondary-text-color)}progress{width:100%;height:5px;accent-color:var(--primary-color)}.now-playing{padding-bottom:15px;margin-bottom:15px;border-bottom:1px solid var(--divider-color)}.next{display:grid;margin:8px 0}.next button,.agenda button{display:flex;gap:12px;padding:7px 0;text-align:left;font-size:13px}.next span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}time{color:var(--secondary-text-color);font-variant-numeric:tabular-nums;flex-shrink:0}.section-title{font-weight:600;margin:8px 0}.favorites{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.favorites button,.pills button{background:var(--secondary-background-color);padding:9px 13px;border-radius:20px;font-size:13px}.favorites .chosen,.pills [aria-pressed=true]{background:var(--primary-color);color:var(--text-primary-color,#fff)}.select-label{display:grid;gap:7px;font-size:13px;margin-top:15px}select,input{background:var(--card-background-color);border:1px solid var(--divider-color);padding:11px 12px;border-radius:10px;min-width:0}header{display:flex;justify-content:space-between;gap:12px;align-items:center}header p{color:var(--secondary-text-color);font-size:13px;margin-top:5px}.tools{display:flex;gap:15px;margin:20px 0 12px;flex-wrap:wrap}.tools input{flex:1;min-width:180px}.pills{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.toolbar{display:flex;gap:12px;align-items:center;margin-bottom:15px}.toolbar .icon{margin-left:auto}.channel{display:flex;align-items:center;border-bottom:1px solid var(--divider-color);min-height:68px}.channel.active{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.station{display:flex;align-items:center;gap:14px;text-align:left;padding:12px 8px;flex:1;min-width:0}.station>span:last-child{min-width:0}.station strong{font-size:14px}.station small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--secondary-text-color);font-size:12px;margin-top:4px}.dial{min-width:32px;color:var(--secondary-text-color);font-size:18px;font-variant-numeric:tabular-nums}.channel-list{max-height:70vh;overflow:auto}.timeline{overflow:auto;max-height:70vh;border:1px solid var(--divider-color);border-radius:12px}.track,.ruler{display:grid;grid-template-columns:160px 2880px;min-width:3040px}.sticky{position:sticky;left:0;z-index:3;background:var(--card-background-color);text-align:left;padding:12px;font-size:13px;border-right:1px solid var(--divider-color);overflow:hidden}.track{border-bottom:1px solid var(--divider-color)}.ruler{position:sticky;top:0;z-index:4;background:var(--secondary-background-color);height:42px}.ruler .sticky{background:var(--secondary-background-color)}.hours,.slots{position:relative}.hours span{position:absolute;top:13px;font-size:12px;padding-left:6px;color:var(--secondary-text-color)}.slots{height:65px}.slot{position:absolute;top:5px;height:55px;border-radius:6px;background:var(--secondary-background-color);border-right:2px solid var(--card-background-color);padding:6px 8px;text-align:left;overflow:hidden}.slot small{display:block;color:var(--secondary-text-color);font-size:10px}.slot span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;margin-top:4px}.slot.live{background:color-mix(in srgb,var(--primary-color) 20%,var(--card-background-color));box-shadow:inset 3px 0 var(--primary-color)}.no-epg{font-size:12px;color:var(--secondary-text-color);padding:22px;display:block;position:sticky;left:160px;width:260px}.mobile-guide{display:none}footer{font-size:11px;color:var(--secondary-text-color);line-height:1.5;margin-top:18px}a{color:var(--primary-color)}.notice,.error{padding:12px;border-radius:10px;background:var(--secondary-background-color);font-size:13px;margin-top:12px}.error{color:var(--error-color)}dialog{border:1px solid var(--divider-color);border-radius:18px;max-width:520px;width:calc(100% - 32px);padding:0;color:var(--primary-text-color);background:var(--card-background-color);box-shadow:0 15px 60px #0005}dialog::backdrop{background:#0008}.details{padding:26px}.details h2{font-size:21px;margin:10px 25px 10px 0}.details p{margin:12px 0;font-size:14px;line-height:1.5}.description{white-space:pre-line;max-height:40vh;overflow:auto}.details small{color:var(--secondary-text-color)}.close{position:absolute;right:8px;top:8px}.agenda{padding:0 12px 14px}.agenda button{width:100%}.agenda span{text-align:left}
    @media(max-width:700px){.body{padding:16px}header{align-items:flex-start}header h2{font-size:20px}.tools{display:block}.tools input{width:100%;margin-bottom:12px}.toolbar{gap:6px;flex-wrap:wrap}.toolbar input{max-width:150px}.timeline{display:none}.mobile-guide{display:block;max-height:70vh;overflow:auto}.track{display:none}}
    @media(hover:hover) and (pointer:fine){button:hover{filter:brightness(.94);background-color:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color))}.primary:hover{background:var(--primary-color)}}
  `;
E([
  b({ attribute: !1 })
], w.prototype, "hass", 2);
E([
  d()
], w.prototype, "config", 2);
E([
  d()
], w.prototype, "channels", 2);
E([
  d()
], w.prototype, "programs", 2);
E([
  d()
], w.prototype, "query", 2);
E([
  d()
], w.prototype, "filter", 2);
E([
  d()
], w.prototype, "mode", 2);
E([
  d()
], w.prototype, "day", 2);
E([
  d()
], w.prototype, "error", 2);
E([
  d()
], w.prototype, "loading", 2);
E([
  d()
], w.prototype, "selected", 2);
E([
  d()
], w.prototype, "now", 2);
E([
  d()
], w.prototype, "lastDay", 2);
E([
  d()
], w.prototype, "missing", 2);
w = E([
  j("polr-tv-guide-card")
], w);
const S = (t) => {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.floor(Math.max(0, t) / 60);
  return e === 0 ? `${Math.floor(Math.max(0, t))} s` : e >= 60 ? `${Math.floor(e / 60)} h ${e % 60} min` : `${e} min`;
}, rt = (t, e = !1) => new Date(typeof t == "number" ? t * 1e3 : t).toLocaleString("es-ES", { timeZone: "Europe/Madrid", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", ...e ? { second: "2-digit" } : {} }), K = (t = /* @__PURE__ */ new Date()) => t.toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" }), fo = (t) => ({ icon: t === !0 ? "mdi:volume-high" : "mdi:volume-off", label: t === !0 ? "Activar sonido" : t === !1 ? "Silenciar" : "Alternar silencio (estado desconocido)" }), bo = (t) => ({ sunny: "weather-sunny", clear: "weather-sunny", "clear-night": "weather-night", cloudy: "weather-cloudy", partlycloudy: "weather-partly-cloudy", rainy: "weather-rainy", pouring: "weather-pouring", lightning: "weather-lightning", "lightning-rainy": "weather-lightning-rainy", snowy: "weather-snowy", fog: "weather-fog", windy: "weather-windy" })[t] ?? "weather-partly-cloudy", _o = (t, e = /* @__PURE__ */ new Date()) => {
  const i = K(e);
  return t.filter((o) => o.datetime && K(new Date(o.datetime)) >= i).slice(0, 5);
};
function yo(t, e = Date.now() / 1e3) {
  const i = [...t].sort((r, c) => r.start - c.start), o = [];
  let a = !0;
  for (const r of i) {
    if (r.power !== "on") {
      a = !0;
      continue;
    }
    const c = o[o.length - 1];
    c && !a && r.start - c.end <= 20 ? (c.end = r.end, c.observed += Math.max(0, r.end - r.start), c.contents.push(r)) : o.push({ start: r.start, end: r.end, observed: Math.max(0, r.end - r.start), contents: [r] }), a = !1;
  }
  const s = i[i.length - 1];
  return o.reverse().map((r) => ({ ...r, active: s?.power === "on" && r.end === s.end && e - r.end < 20 }));
}
var xo = Object.defineProperty, $o = Object.getOwnPropertyDescriptor, B = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? $o(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && xo(e, i, a), a;
};
let N = class extends T {
  constructor() {
    super(...arguments), this.favoriteId = "luli_pampin", this.choosing = !1, this.error = "", this.pending = !1, this.loaded = !1, this.backdropPressed = !1;
  }
  get name() {
    return this.favoriteId === "sunny_bunnies" ? "Sunny Bunnies" : "Luli Pampín";
  }
  get count() {
    return this.catalog?.videos.length ?? (this.favoriteId === "sunny_bunnies" ? 50 : 30);
  }
  get icon() {
    return this.favoriteId === "sunny_bunnies" ? "sunny-bunnies" : "luli-pampin";
  }
  get currentQueue() {
    return !this.queue?.favorite_id || this.queue.favorite_id === this.favoriteId ? this.queue : void 0;
  }
  updated(t) {
    const e = this.shadowRoot?.querySelector("dialog");
    e && !e.open && e.showModal(), this.hass && !this.loaded && (this.loaded = !0, this.load());
  }
  async load() {
    this.error = "";
    try {
      this.catalog = await this.hass.callWS({ type: "tv_guide/youtube_playlist", entry_id: this.entryId, favorite_id: this.favoriteId });
    } catch (t) {
      this.error = t.message || "No se pudo cargar la lista";
    }
  }
  close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  async play(t) {
    if (!(this.pending || this.operation?.state === "running")) {
      this.pending = !0, this.error = "";
      try {
        await this.hass.callService("tv_guide", "youtube_playlist_play", { entry_id: this.entryId, ...this.favoriteId === "sunny_bunnies" ? { favorite_id: this.favoriteId } : {}, ...t ? { video_id: t } : {} }), this.close();
      } catch (e) {
        this.error = e.message || "No se pudo reproducir la lista";
      } finally {
        this.pending = !1;
      }
    }
  }
  render() {
    const t = this.pending || this.operation?.state === "running";
    return n`<dialog aria-labelledby="luli-title" @cancel=${(e) => {
      e.preventDefault(), this.close();
    }} @pointerdown=${(e) => {
      this.backdropPressed = e.target === e.currentTarget;
    }} @click=${(e) => {
      this.backdropPressed && e.target === e.currentTarget && this.close(), this.backdropPressed = !1;
    }}>
      <div class="content">
        <div class="heading"><img src=${"/local/tv-remote/icons/" + this.icon + ".png?v=20261003"} alt=""><div><h2 id="luli-title">${this.name}</h2><p>Los ${this.count} vídeos más populares</p></div><button class="icon" aria-label="Cerrar" @click=${() => this.close()}>✕</button></div>
        <div class="actions"><button class="shuffle" ?disabled=${t || !this.catalog} @click=${() => void this.play()}><ha-icon icon="mdi:shuffle-variant"></ha-icon>Reproducción aleatoria</button><button aria-expanded=${String(this.choosing)} ?disabled=${!this.catalog} @click=${() => {
      this.choosing = !this.choosing;
    }}><ha-icon icon="mdi:playlist-play"></ha-icon>Elegir vídeo</button></div>
        <p class="explanation">${this.choosing ? `Elige el primero. Después se reproducirán los otros ${this.count - 1} en orden aleatorio, sin repetir.` : `Reproduce los ${this.count} en orden aleatorio, sin repetir vídeos.`}</p>
        ${this.currentQueue?.active ? n`<p role="status">Vídeo ${this.currentQueue.index} de ${this.count} · ${this.currentQueue.remaining} pendientes</p>` : l}
        ${this.currentQueue?.error ? n`<p class="error" role="alert">${this.currentQueue.error}</p>` : l}
        ${this.operation?.state === "running" ? n`<p role="status">${this.operation.message}</p>` : l}
        ${this.error ? n`<p class="error" role="alert">${this.error}</p>` : l}
        ${!this.catalog && this.error ? n`<button @click=${() => void this.load()}>Volver a cargar</button>` : l}
        ${!this.catalog && !this.error ? n`<p role="status">Cargando lista…</p>` : l}
        ${this.choosing && this.catalog ? n`<ol>${this.catalog.videos.map((e) => n`<li><button class="video" ?disabled=${t} @click=${() => void this.play(e.video_id)}><span class="rank">${e.rank}</span><span class="details"><strong>${e.title}</strong><small>${e.views_label} · ${e.duration_label}</small></span><ha-icon icon="mdi:play"></ha-icon></button><a href=${e.url} target="_blank" rel="noopener noreferrer" aria-label=${"Abrir " + e.title + " en YouTube"} title="Ver en YouTube"><ha-icon icon="mdi:open-in-new"></ha-icon></a></li>`)}</ol><p class="source">Orden «Populares» del <a href=${this.catalog.source_url} target="_blank" rel="noopener noreferrer">canal oficial</a> · ${this.catalog.fetched_at}</p>` : l}
      </div>
    </dialog>`;
  }
};
N.styles = U`
    :host{color:var(--primary-text-color)}*{box-sizing:border-box}dialog{position:fixed;margin:auto;border:1px solid var(--divider-color);border-radius:20px;padding:0;width:min(620px,calc(100vw - 24px));max-height:calc(100dvh - 32px);background:var(--ha-card-background,var(--card-background-color,#fff));color:inherit;box-shadow:0 16px 60px #0005}dialog::backdrop{background:#0008}.content{padding:18px}.heading{display:flex;align-items:center;gap:12px}.heading img{width:44px;height:44px;border-radius:12px}.heading>div{flex:1;min-width:0}h2{font-size:21px;margin:0}p{margin:8px 0;font-size:14px;line-height:1.5}.heading p{color:var(--secondary-text-color);margin:3px 0}.actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}button,a{font:inherit;color:inherit;touch-action:manipulation}button{border:0;cursor:pointer;min-height:48px;border-radius:12px;background:var(--secondary-background-color,#eee);display:flex;justify-content:center;align-items:center;gap:8px;padding:10px}.icon{min-width:44px;background:transparent}.shuffle{color:var(--text-primary-color,#fff);background:var(--primary-color,#03a9f4)}button:disabled{opacity:.45;cursor:default}.explanation,.source{color:var(--secondary-text-color);font-size:13px}.error{color:var(--error-color)}ol{padding:0;margin:14px 0;list-style:none}li{display:flex;align-items:stretch;border-top:1px solid var(--divider-color)}.video{flex:1;min-width:0;text-align:left;background:transparent;justify-content:flex-start;border-radius:6px;padding:12px 4px;gap:10px}.rank{width:24px;flex-shrink:0;color:var(--secondary-text-color);font-size:14px;text-align:center}.details{flex:1;min-width:0;display:grid;gap:5px}.details strong{font-size:14px;line-height:1.4;overflow-wrap:anywhere}.details small{font-size:12px;color:var(--secondary-text-color)}li>a{width:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center}ha-icon{--mdc-icon-size:22px;flex-shrink:0}button:focus-visible,a:focus-visible{outline:2px solid var(--primary-color);outline-offset:-2px}@media(max-width:420px){.content{padding:14px}.actions{grid-template-columns:1fr}}
  `;
B([
  b({ attribute: !1 })
], N.prototype, "hass", 2);
B([
  b({ attribute: !1 })
], N.prototype, "entryId", 2);
B([
  b({ attribute: !1 })
], N.prototype, "favoriteId", 2);
B([
  b({ attribute: !1 })
], N.prototype, "operation", 2);
B([
  b({ attribute: !1 })
], N.prototype, "queue", 2);
B([
  d()
], N.prototype, "catalog", 2);
B([
  d()
], N.prototype, "choosing", 2);
B([
  d()
], N.prototype, "error", 2);
B([
  d()
], N.prototype, "pending", 2);
N = B([
  j("polr-youtube-favorite")
], N);
var wo = Object.defineProperty, ko = Object.getOwnPropertyDescriptor, lt = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? ko(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && wo(e, i, a), a;
};
let X = class extends T {
  constructor() {
    super(...arguments), this.config = {}, this.weather = { forecast: [], alerts: [] }, this.error = "", this.pending = "", this.luliOpen = !1, this.loaded = !1;
  }
  setConfig(t) {
    this.config = { light: "light.lampara", context: "sensor.tv_salon_contexto", remote: "remote.tv_salon", channel_shortcuts: [], ...t };
  }
  getCardSize() {
    return 8;
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = setInterval(() => {
      this.load();
    }, 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer), this.loaded = !1;
  }
  updated(t) {
    this.hass && !this.loaded && this.context.entry_id && (this.loaded = !0, this.load());
    const e = this.shadowRoot?.querySelector("select");
    e && (e.value = this.hass?.states["select.tv_salon_canal"]?.state ?? "");
  }
  get context() {
    return this.hass?.states[this.config.context]?.attributes ?? {};
  }
  async load() {
    if (this.hass)
      try {
        this.weather = await this.hass.callWS({ type: "tv_guide/home", entry_id: this.context.entry_id });
      } catch {
        this.weather = { ...this.weather, weather_error: "No se pudo actualizar el tiempo" };
      }
  }
  async call(t, e, i, o = "") {
    if (!this.pending) {
      this.error = "", this.pending = o || e;
      try {
        await this.hass.callService(t, e, i);
      } catch (a) {
        this.error = a.message || "No se pudo completar la acción";
      } finally {
        this.pending = "";
      }
    }
  }
  navigate(t) {
    history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed"));
  }
  button(t, e, i, o = !1) {
    return n`<button title=${e} aria-label=${e} ?disabled=${o || !!this.pending} @click=${i}><ha-icon icon=${t}></ha-icon></button>`;
  }
  render() {
    if (!this.hass) return l;
    const t = this.hass.states[this.config.light], e = t?.state === "on", i = !!t && !["unavailable", "unknown"].includes(t.state), o = Math.round((t?.attributes.brightness ?? 0) / 255 * 100), a = this.context, s = this.hass.states[this.config.remote]?.state === "on", r = this.hass.states[this.config.remote]?.state === "off", c = a.audio ?? {}, p = a.playback ?? {}, u = fo(c.is_volume_muted), _ = typeof c.volume_level == "number" ? `${Math.round(c.volume_level * 100)} %` : "—", h = a.kind === "tv" ? a.current?.title : p.title, v = this.hass.states["select.tv_salon_canal"], g = this.hass.states["sensor.aemet_proxima_precipitacion"], y = this.hass.states["weather.aemet"], z = Date.now() / 1e3 - (this.weather.updated || 0) > 1800, O = _o(this.weather.forecast ?? []), M = a.youtube_operation, f = M?.state === "running", I = this.config.channel_shortcuts ?? [];
    return n`<div class="home">
      ${this.luliOpen ? n`<polr-youtube-favorite .hass=${this.hass} .entryId=${a.entry_id} .operation=${M} .queue=${a.youtube_queue} @close=${async () => {
      this.luliOpen = !1, await this.updateComplete, this.shadowRoot?.querySelector('[aria-label="Luli Pampín · Opciones de reproducción"]')?.focus();
    }}></polr-youtube-favorite>` : l}
      <ha-card class="lamp">
        <div class="heading"><span><ha-icon icon="mdi:floor-lamp"></ha-icon><strong>Lámpara</strong><small>${i ? e ? `${o} %` : "Apagada" : "Sin conexión"}</small></span>${this.button("mdi:power", e ? "Apagar lámpara" : "Encender lámpara", () => void this.call("light", e ? "turn_off" : "turn_on", { entity_id: this.config.light }), !i)}</div>
        <div class="brightness"><button ?disabled=${!i || !!this.pending} @click=${() => void this.call("light", "turn_on", { entity_id: this.config.light, brightness_pct: 1 })}>1 %</button><input aria-label="Intensidad de la lámpara" type="range" min="1" max="100" .value=${String(e ? Math.max(1, o) : 1)} ?disabled=${!i || !!this.pending} @change=${(m) => void this.call("light", "turn_on", { entity_id: this.config.light, brightness_pct: Number(m.target.value) })}><button ?disabled=${!i || !!this.pending} @click=${() => void this.call("light", "turn_on", { entity_id: this.config.light, brightness_pct: 100 })}>100 %</button></div>
      </ha-card>
      <ha-card class="tv">
        <div class="heading"><span><ha-icon icon="mdi:television"></ha-icon><strong>TV</strong><small class=${s ? "live" : ""}>${s ? "Encendida" : r ? "Apagada" : "Sin conexión"}</small></span><div class="row">${this.button("mdi:power", s ? "Apagar TV" : "Encender TV", () => void this.call("script", "tv_salon_power", {}))}<button class="link" @click=${() => this.navigate("/mando-tv/mando")}><ha-icon icon="mdi:remote-tv"></ha-icon>Mando</button></div></div>
        ${s ? n`<div class="now"><span class="app">${a.label ?? "TV del salón"}${p.state === "paused" ? " · En pausa" : ""}</span><strong class="title" title=${h ?? ""}>${h ?? (a.kind === "home" ? "Menú principal" : "Contenido no disponible")}</strong></div>` : l}
        <div class="volume"><span class="audio"><small>${s ? c.output_label ?? "Audio" : "Audio"}</small><strong>${s ? c.is_volume_muted ? "Silencio" : _ : "—"}</strong></span><div class="row">${this.button("mdi:volume-minus", "Bajar volumen", () => void this.call("tv_guide", "control", { entry_id: a.entry_id, command: "VOLUME_DOWN" }), !s)}${this.button(u.icon, u.label, () => void this.call("tv_guide", "control", { entry_id: a.entry_id, command: "MUTE" }), !s)}${this.button("mdi:volume-plus", "Subir volumen", () => void this.call("tv_guide", "control", { entry_id: a.entry_id, command: "VOLUME_UP" }), !s)}</div></div>
        <div class=${I.length ? "shortcuts with-channels" : "shortcuts"}><button @click=${() => void this.call("script", "tv_bluey_ninos", {}, "Abriendo Bluey")} ?disabled=${!!this.pending || f}><img src="/local/tv-remote/icons/bluey.png?v=20260903" alt="">Bluey</button><button aria-label="Luli Pampín · Opciones de reproducción" @click=${() => {
      this.luliOpen = !0;
    }} ?disabled=${!!this.pending || f}><img src="/local/tv-remote/icons/luli-pampin.png?v=20261003" alt=""><span>Luli Pampín</span></button>${I.map((m) => n`<button aria-label=${`Ver ${m.name}`} @click=${() => void this.call("tv_guide", "tune_channel", { entry_id: a.entry_id, channel_key: m.channel_key }, `Abriendo ${m.name}`)} ?disabled=${!!this.pending || !!a.busy || !a.entry_id}><ha-icon icon=${m.icon ?? "mdi:television-classic"}></ha-icon><span>${m.name}</span></button>`)}<button @click=${() => void this.call("script", "tv_salon_abrir_app", { aplicacion: "television" }, "Abriendo televisión")} ?disabled=${!!this.pending}><ha-icon icon="mdi:television-classic"></ha-icon>Televisión</button></div>
        ${M && ["running", "error"].includes(M.state) ? n`<div role=${M.state === "error" ? "alert" : "status"} class=${M.state === "error" ? "error" : "status"}>${M.message}</div>` : l}
        ${s && a.kind === "tv" ? n`<label class="channel"><span>Canal</span><select aria-label="Cambiar canal" ?disabled=${!!this.pending || !!a.busy} @change=${(m) => void this.call("select", "select_option", { entity_id: "select.tv_salon_canal", option: m.target.value }, "Cambiando canal")}>${(v?.attributes.options ?? []).map((m) => n`<option value=${m} ?selected=${v?.state === m}>${m}</option>`)}</select></label>` : l}
      </ha-card>
      <ha-card class="weather">
        <div class="heading"><span><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon><strong>Tiempo</strong><small>${y?.attributes.temperature != null ? `${Math.round(y.attributes.temperature)}°` : ""}</small></span><button class="link" @click=${() => this.navigate("/tiempo-aemet/resumen")}>Ver más<ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
        <div class="forecast">${O.map((m) => n`<div><small>${K(new Date(m.datetime)) === K() ? "Hoy" : K(new Date(m.datetime)) === K(new Date(Date.now() + 864e5)) ? "Mañana" : new Date(m.datetime).toLocaleDateString("es-ES", { weekday: "short", timeZone: "Europe/Madrid" })}</small><ha-icon icon=${"mdi:" + bo(m.condition)}></ha-icon><b>${Math.round(m.temperature)}° <span>${m.templow != null ? Math.round(m.templow) + "°" : ""}</span></b><small class="rain">${m.precipitation_probability != null ? Math.round(m.precipitation_probability) + " %" : m.precipitation != null ? m.precipitation + " mm" : "—"}</small></div>`)}</div>
        ${z || this.weather.weather_error ? n`<small class="warning">${this.weather.weather_error ?? "Previsión sin actualizar"}</small>` : l}
        <button class="alertline" @click=${() => this.navigate("/tiempo-aemet/resumen")}><ha-icon icon="mdi:weather-rainy"></ha-icon><span>${g?.attributes.time ? n`Lluvia · ${rt(g.attributes.time)}<small>${g.attributes.probability ?? "—"} % · ${g.attributes.amount ?? "—"} mm</small>` : g?.state ?? "Lluvia: sin datos"}</span></button>
        ${(this.weather.alerts ?? []).length ? (this.weather.alerts ?? []).map((m) => n`<button class=${"alertline " + m.level} @click=${() => this.navigate("/tiempo-aemet/resumen")}><ha-icon icon="mdi:alert-outline"></ha-icon><span>${m.event}<small>${m.active ? "Activo hasta " + rt(m.end) : rt(m.start)} · ${this.weather.zone}</small></span></button>`) : n`<div class="alertline quiet"><ha-icon icon="mdi:shield-check-outline"></ha-icon><span>${this.weather.alerts_available ? "Sin avisos amarillos, naranjas o rojos" : "Avisos: sin datos"}</span></div>`}
      </ha-card>
      ${this.pending ? n`<div role="status" class="status">${this.pending}…</div>` : l}${this.error ? n`<div role="alert" class="error">${this.error}</div>` : l}
    </div>`;
  }
};
X.styles = U`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.home{max-width:760px;margin:0 auto;padding:8px;display:grid;gap:9px}ha-card{padding:8px 12px;border-radius:18px;overflow:hidden}button,input,select{font:inherit;color:inherit}button{border:0;background:var(--secondary-background-color);border-radius:11px;min-height:44px;min-width:44px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;touch-action:manipulation}button:disabled{opacity:.45;cursor:default}ha-icon{--mdc-icon-size:22px;flex-shrink:0}small{font-size:12px;color:var(--secondary-text-color)}.heading,.heading>span,.row,.volume,.brightness{display:flex;align-items:center;gap:8px}.heading{justify-content:space-between;min-height:44px}.heading strong{font-size:16px}.heading>span{min-width:0;gap:7px}.link{font-size:12px;background:transparent;padding:0 3px}.brightness{margin-top:3px}.brightness button{font-weight:600;font-size:13px;padding:0 12px}.brightness input{flex:1;min-width:0;accent-color:var(--primary-color);height:44px;cursor:pointer}.live{color:var(--success-color,#268657)}.now{padding:3px 0 6px}.app{font-size:12px;color:var(--secondary-text-color)}.title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;line-height:19px;margin-top:2px}.volume{justify-content:space-between;margin:2px 0 5px}.audio{display:grid;gap:2px}.audio strong{font-size:17px;font-variant-numeric:tabular-nums}.shortcuts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.shortcuts.with-channels{grid-template-columns:repeat(2,minmax(0,1fr))}.shortcuts button{min-width:0;padding:3px 6px;font-size:12px;font-weight:600}.shortcuts span{min-width:0;line-height:16px}.shortcuts img{width:26px;height:26px;border-radius:6px}.channel{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px;color:var(--secondary-text-color)}select{flex:1;min-width:0;height:44px;padding:0 9px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);font-size:14px;color:var(--primary-text-color)}.forecast{display:grid;grid-template-columns:repeat(5,1fr);padding:4px 0 6px}.forecast>div{display:grid;justify-items:center;gap:3px}.forecast ha-icon{--mdc-icon-size:25px;color:var(--primary-color)}.forecast b{font-size:14px;white-space:nowrap}.forecast b span{color:var(--secondary-text-color);font-weight:400;font-size:12px}.forecast .rain{font-size:11px;color:var(--primary-color)}.alertline{display:flex;gap:9px;text-align:left;width:100%;background:transparent;min-height:44px;border-top:1px solid var(--divider-color);border-radius:0;padding:5px 0;font-size:12px;line-height:16px}.alertline span{min-width:0}.alertline small{display:block;font-size:11px}.alertline ha-icon{--mdc-icon-size:19px;color:var(--primary-color)}.quiet{align-items:center;font-size:11px;color:var(--secondary-text-color)}.amarillo ha-icon{color:#aa7b00}.naranja ha-icon{color:#cf6d00}.rojo ha-icon{color:#d33}.warning{display:block;color:var(--warning-color)}.error,.status{padding:10px;border-radius:10px;background:var(--card-background-color);font-size:13px}.error{color:var(--error-color)}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(min-width:600px){.shortcuts.with-channels{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(min-width:900px){.home{max-width:1160px;grid-template-columns:1fr 1fr;align-items:start;padding:20px;gap:16px}.lamp{grid-column:1}.tv{grid-column:1}.weather{grid-column:2;grid-row:1/span 2}ha-card{padding:14px 18px}.forecast{padding:20px 0}.forecast ha-icon{--mdc-icon-size:36px}.alertline{min-height:55px}.title{font-size:17px;line-height:23px}}`;
lt([
  b({ attribute: !1 })
], X.prototype, "hass", 2);
lt([
  d()
], X.prototype, "config", 2);
lt([
  d()
], X.prototype, "weather", 2);
lt([
  d()
], X.prototype, "error", 2);
lt([
  d()
], X.prototype, "pending", 2);
lt([
  d()
], X.prototype, "luliOpen", 2);
X = lt([
  j("polr-home-summary-card")
], X);
var Ao = Object.defineProperty, So = Object.getOwnPropertyDescriptor, P = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? So(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && Ao(e, i, a), a;
};
let k = class extends T {
  constructor() {
    super(...arguments), this.config = {}, this.items = [], this.libraries = [], this.trail = [], this.query = "", this.kind = "all", this.total = 0, this.start = 0, this.loading = !1, this.sending = !1, this.error = "", this.message = "", this.images = /* @__PURE__ */ new Map(), this.loaded = !1, this.request = 0;
  }
  setConfig(t) {
    this.config = { entity: "sensor.tv_salon_contexto", ...t };
  }
  getCardSize() {
    return 12;
  }
  get context() {
    return this.hass?.states[this.config.entity]?.attributes ?? {};
  }
  updated(t) {
    this.hass && this.context.entry_id && !this.loaded && (this.loaded = !0, this.load());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.request++, this.loaded = !1, this.loading = !1, clearTimeout(this.delay);
  }
  async api(t) {
    return await this.hass.callWS({ type: "tv_guide/jellyfin", entry_id: this.context.entry_id, ...t });
  }
  async load() {
    const t = ++this.request;
    this.loading = !0, this.error = "";
    try {
      const e = await this.api({ parent: this.trail[this.trail.length - 1]?.id, query: this.query, kind: this.kind, start: this.start });
      if (t !== this.request) return;
      this.items = e.items, this.total = e.total, this.libraries = e.libraries, this.loadImages(t, [...this.items]);
    } catch (e) {
      t === this.request && (this.error = e.message || "No se pudo cargar Jellyfin");
    } finally {
      t === this.request && (this.loading = !1);
    }
  }
  async loadImages(t, e) {
    let i = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      for (; i < e.length && t === this.request; ) {
        const o = e[i++];
        if (!(!o.image || this.images.has(o.id)))
          try {
            const a = await this.api({ image: o.id });
            t === this.request && (this.images.set(o.id, a.image), this.requestUpdate());
          } catch {
          }
      }
    }));
  }
  browse(t) {
    this.trail = [...this.trail, t], this.start = 0, this.query = "", this.kind = "all", this.load();
  }
  async choose(t) {
    if (t.folder) {
      this.browse(t);
      return;
    }
    this.error = "";
    try {
      this.selected = await this.api({ item: t.id }), await this.updateComplete, this.shadowRoot?.querySelector("dialog")?.showModal();
    } catch (e) {
      this.error = e.message;
    }
  }
  async play(t) {
    if (!this.sending) {
      this.sending = !0, this.error = "", this.message = "Preparando la TV y verificando Adultos…", this.shadowRoot?.querySelector("dialog")?.close();
      try {
        await this.hass.callService("tv_guide", "jellyfin_play", { entry_id: this.context.entry_id, item_id: this.selected.id, start_seconds: t }), this.message = "Reproducción confirmada en la TV del salón";
      } catch (e) {
        this.error = e.message || "No se pudo iniciar la reproducción", this.message = "";
      } finally {
        this.sending = !1, this.error || this.load();
      }
    }
  }
  render() {
    const t = this.selected;
    return n`<ha-card><div class="body"><header><div><h2>Jellyfin <small>Adultos</small></h2><p>Elige qué ver en la TV del salón.</p></div><button aria-label="Actualizar catálogo" @click=${() => void this.load()}><ha-icon icon="mdi:refresh"></ha-icon></button></header>
      <div class="tools"><input type="search" aria-label="Buscar en Jellyfin" placeholder="Buscar película, serie o episodio" .value=${this.query} @input=${(e) => {
      this.query = e.target.value, this.start = 0, clearTimeout(this.delay), this.delay = setTimeout(() => void this.load(), 300);
    }}><select aria-label="Filtrar catálogo" .value=${this.kind} @change=${(e) => {
      this.kind = e.target.value, this.start = 0, this.load();
    }}><option value="all">Todo</option><option value="Movie">Películas</option><option value="Series">Series</option><option value="resume">Continuar viendo</option></select></div>
      <nav aria-label="Bibliotecas"><button @click=${() => {
      this.trail = [], this.start = 0, this.load();
    }}>Catálogo</button>${this.trail.map((e, i) => n`<span>›</span><button @click=${() => {
      this.trail = this.trail.slice(0, i + 1), this.start = 0, this.load();
    }}>${e.name}</button>`)}</nav>
      ${this.trail.length ? l : n`<div class="libraries">${this.libraries.map((e) => n`<button @click=${() => this.browse(e)}>${e.name}</button>`)}</div>`}
      ${this.error ? n`<div role="alert" class="error">${this.error}<button @click=${() => void this.load()}>Reintentar</button></div>` : l}
      ${this.message ? n`<div role="status" class="notice">${this.sending ? this.context.jellyfin_operation?.message ?? this.message : this.message}</div>` : l}
      ${this.loading ? n`<p role="status">Cargando catálogo…</p>` : l}
      <div class="catalog" aria-busy=${this.loading}>${this.items.map((e) => n`<button class="poster" @click=${() => void this.choose(e)} ?disabled=${this.sending} aria-label=${e.name}><div class="art">${this.images.has(e.id) ? n`<img src=${this.images.get(e.id)} alt="" loading="lazy">` : n`<ha-icon icon=${e.folder ? "mdi:folder-play-outline" : "mdi:movie-open-outline"}></ha-icon>`}${e.played ? n`<span class="seen">Visto</span>` : l}${e.position > 0 ? n`<span class="progress" style=${`width:${Math.min(100, e.position / Math.max(1, e.duration) * 100)}%`}></span>` : l}</div><strong>${e.name}</strong><small>${e.series ? `${e.series} · T${e.season} E${e.episode}` : e.year ?? e.type}</small>${e.position > 0 ? n`<small>Quedan ${S(e.remaining)}</small>` : l}</button>`)}</div>
      ${!this.loading && !this.items.length ? n`<p>No hay contenido para este filtro.</p>` : l}
      <footer><button ?disabled=${!this.start || this.loading} @click=${() => {
      this.start = Math.max(0, this.start - 40), this.load();
    }}>Anterior</button><span>${this.total ? `${this.start + 1}–${Math.min(this.start + 40, this.total)} de ${this.total}` : "0 resultados"}</span><button ?disabled=${this.start + 40 >= this.total || this.loading} @click=${() => {
      this.start += 40, this.load();
    }}>Siguiente</button></footer>
      <dialog @click=${(e) => {
      e.target === e.currentTarget && e.currentTarget.close();
    }}><div class="details"><button class="close" aria-label="Cerrar" @click=${() => this.shadowRoot?.querySelector("dialog")?.close()}><ha-icon icon="mdi:close"></ha-icon></button>${t ? n`<h2>${t.name}</h2>${t.series ? n`<p>${t.series} · Temporada ${t.season}, episodio ${t.episode}</p>` : l}<p>${S(t.duration)}${t.played ? " · Marcado como visto" : ""}</p>${t.position > 0 ? n`<div class="notice"><strong>Te quedaste en ${S(t.position)}</strong><p>Quedan ${S(t.remaining)} · ${Math.round(t.position / Math.max(1, t.duration) * 100)} % reproducido</p></div>` : n`<p>Sin punto de reanudación guardado.</p>`}<p class="overview">${t.overview}</p>${t.can_play ? n`<div class="choices">${t.position > 0 ? n`<button class="primary" @click=${() => void this.play(t.position)}>Continuar desde ${S(t.position)}</button>` : l}<button @click=${() => void this.play(0)}>Reproducir desde el principio</button></div>` : n`<p>Este contenido no puede reproducirse en la TV.</p>`}` : l}</div></dialog>
    </div></ha-card>`;
  }
};
k.styles = U`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.body{padding:20px;max-width:1400px;margin:auto}h2,p{margin:0}h2{font-size:23px}h2 small{font-size:13px;font-weight:400;color:var(--secondary-text-color)}header{display:flex;justify-content:space-between;align-items:center}header p{font-size:13px;color:var(--secondary-text-color);margin-top:6px}button,input,select{font:inherit;color:inherit}button{min-height:44px;border:0;border-radius:10px;background:var(--secondary-background-color);padding:8px 14px;cursor:pointer;touch-action:manipulation}button:disabled{opacity:.45;cursor:default}.tools{display:flex;gap:10px;margin:20px 0 10px}input,select{border:1px solid var(--divider-color);border-radius:10px;padding:12px;background:var(--card-background-color);min-width:0}input{flex:1}nav,.libraries{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0}nav button{background:transparent;padding:4px 8px;font-size:13px}.libraries button{border-radius:24px;font-size:12px}.catalog{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:20px 14px;margin-top:20px}.poster{display:block;text-align:left;background:none;padding:0;min-width:0;align-self:start}.art{aspect-ratio:2/3;background:var(--secondary-background-color);border-radius:12px;overflow:hidden;position:relative;display:grid;place-items:center}.art img{width:100%;height:100%;object-fit:cover}.art ha-icon{--mdc-icon-size:45px;color:var(--secondary-text-color)}.poster strong{display:block;font-size:14px;margin-top:8px;line-height:19px}.poster small{display:block;color:var(--secondary-text-color);font-size:11px;margin-top:4px}.seen{position:absolute;top:6px;right:6px;background:#164c3cdd;color:white;padding:3px 6px;border-radius:6px;font-size:10px}.progress{height:5px;position:absolute;bottom:0;left:0;background:var(--primary-color)}footer{display:flex;justify-content:center;gap:14px;align-items:center;margin-top:24px;font-size:12px}.notice,.error{padding:14px;background:var(--secondary-background-color);border-radius:10px;margin:12px 0;font-size:13px}.error{color:var(--error-color)}.error button{margin-left:8px}.notice p{margin-top:7px}dialog{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:20px;padding:0;width:calc(100% - 28px);max-width:560px;max-height:90dvh}dialog::backdrop{background:#0008}.details{padding:26px}.details h2{padding-right:30px}.details p{margin-top:12px;font-size:14px;line-height:1.5}.close{position:absolute;right:8px;top:8px;padding:8px}.overview{max-height:25vh;overflow:auto}.choices{display:grid;gap:10px;margin-top:20px}.choices button{min-height:48px}.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(max-width:600px){.body{padding:14px}.tools{flex-wrap:wrap}.tools input{flex-basis:100%}.tools select{flex:1}.catalog{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 9px}.poster strong{font-size:12px;line-height:16px}.poster small{font-size:10px}.details{padding:22px}.details h2{font-size:20px}}`;
P([
  b({ attribute: !1 })
], k.prototype, "hass", 2);
P([
  d()
], k.prototype, "config", 2);
P([
  d()
], k.prototype, "items", 2);
P([
  d()
], k.prototype, "libraries", 2);
P([
  d()
], k.prototype, "trail", 2);
P([
  d()
], k.prototype, "query", 2);
P([
  d()
], k.prototype, "kind", 2);
P([
  d()
], k.prototype, "total", 2);
P([
  d()
], k.prototype, "start", 2);
P([
  d()
], k.prototype, "loading", 2);
P([
  d()
], k.prototype, "sending", 2);
P([
  d()
], k.prototype, "error", 2);
P([
  d()
], k.prototype, "message", 2);
P([
  d()
], k.prototype, "selected", 2);
k = P([
  j("polr-jellyfin-card")
], k);
var To = Object.defineProperty, Eo = Object.getOwnPropertyDescriptor, R = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Eo(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && To(e, i, a), a;
};
const xt = { homeassistant: "Home Assistant", observed: "Observado", physical_button: "Botón físico", infrared: "Receptor IR", airmouse: "AirMouse", virtual_remote: "Mando virtual", external_input: "Entrada externa", system: "Sistema", command: "Acción", input: "Pulsación", power: "Encendido/apagado", playback: "Reproducción", audio: "Audio", error: "Error", monitor: "Seguimiento" };
let C = class extends T {
  constructor() {
    super(...arguments), this.config = {}, this.result = { events: [], segments: [], daily: [] }, this.from = K(), this.to = K(), this.kind = "", this.origin = "", this.query = "", this.mode = "sessions", this.error = "", this.loading = !1, this.loaded = !1, this.generation = 0;
  }
  setConfig(t) {
    this.config = { entity: "sensor.tv_salon_contexto", ...t };
  }
  getCardSize() {
    return 12;
  }
  get allowed() {
    return !!this.config.user_id && this.hass?.user?.id === this.config.user_id;
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = setInterval(() => {
      this.allowed && !this.loading && this.mode !== "events" && this.to === K() && this.load();
    }, 15e3);
  }
  updated(t) {
    this.allowed && !this.loaded && (this.loaded = !0, this.load()), !this.allowed && this.loaded && (this.loaded = !1, this.result = { events: [], segments: [], daily: [] }, this.generation++);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer), this.generation++, this.loaded = !1, this.loading = !1, this.result = { events: [], segments: [], daily: [] };
  }
  async load(t = !1) {
    if (!this.allowed) return;
    const e = ++this.generation;
    this.loading = !0, this.error = "";
    try {
      const i = await this.hass.callWS({ type: "tv_guide/history", entry_id: this.hass?.states[this.config.entity]?.attributes.entry_id, start: kt(this.from)[0], end: kt(this.to)[1], kind: this.kind, origin: this.origin, query: this.query, before: t ? this.result.next : void 0 });
      if (e !== this.generation || !this.allowed) return;
      this.result = t ? { ...i, events: [...this.result.events, ...i.events] } : i;
    } catch (i) {
      e === this.generation && (this.error = i.message || "No se pudo leer el historial");
    } finally {
      e === this.generation && (this.loading = !1);
    }
  }
  render() {
    if (!this.allowed) return n`<ha-card><p class="denied">Este historial es privado. No tienes acceso.</p></ha-card>`;
    const t = yo(this.result.segments ?? []), e = (i) => (this.result.daily ?? []).reduce((o, a) => o + (a[i] ?? 0), 0);
    return n`<ha-card><div class="body"><header><div><h2>Historial de la TV</h2><p>Privado · jeserga · Horas de Madrid</p></div><button aria-label="Actualizar historial" @click=${() => void this.load()}><ha-icon icon="mdi:refresh"></ha-icon></button></header>
      <div class="tools"><label>Desde<input type="date" .value=${this.from} @change=${(i) => this.from = i.target.value}></label><label>Hasta<input type="date" .value=${this.to} @change=${(i) => this.to = i.target.value}></label><button @click=${() => void this.load()} ?disabled=${this.loading}>Consultar</button></div>
      <div class="stats"><div><strong>${S(e("on_seconds"))}</strong><small>Encendida · observado</small></div><div><strong>${S(e("playing_seconds"))}</strong><small>Reproduciendo</small></div><div><strong>${S(e("unknown_seconds"))}</strong><small>Sin estado conocido</small></div></div>
      <nav>${[["sessions", "Sesiones"], ["events", "Acciones"], ["daily", "Resúmenes diarios"]].map(([i, o]) => n`<button aria-pressed=${this.mode === i} @click=${() => {
      this.mode = i, this.load();
    }}>${o}</button>`)}</nav>
      ${this.error ? n`<p role="alert" class="error">${this.error}</p>` : l}
      ${this.result.health?.dropped || Object.keys(this.result.health?.errors ?? {}).length ? n`<div class="notice">${Object.values(this.result.health?.errors ?? {}).join(" · ")}${this.result.health?.dropped ? ` · ${this.result.health.dropped} eventos no guardados` : ""}</div>` : l}
      ${this.result.segments_truncated ? n`<p class="notice">Se muestran los 1000 tramos más recientes. Acorta el intervalo para consultar sesiones anteriores; los totales diarios incluyen todo el intervalo.</p>` : l}
      ${this.loading ? n`<p role="status">Consultando…</p>` : l}
      ${this.mode === "sessions" ? n`<div class="sessions">${t.map((i) => n`<details><summary><span><strong>${rt(i.start, !0)} → ${i.active ? "En curso" : rt(i.end, !0)}</strong><small>${S(i.observed)} de encendido observado</small></span><ha-icon icon="mdi:chevron-down"></ha-icon></summary><div class="contents">${i.contents.map((o) => n`<div><time>${rt(o.start)}</time><span><strong>${o.title ?? o.app ?? "Contenido no disponible"}</strong><small>${[o.app, o.channel, o.playback === "paused" ? "En pausa" : null].filter(Boolean).join(" · ")} · ${S(o.end - o.start)}</small></span></div>`)}</div></details>`)}</div>${t.length ? l : n`<p class="empty">Sin sesiones registradas en este intervalo.</p>`}` : l}
      ${this.mode === "events" ? n`<div class="filters"><select aria-label="Tipo de evento" .value=${this.kind} @change=${(i) => {
      this.kind = i.target.value, this.load();
    }}><option value="">Todos los eventos</option>${["power", "playback", "command", "input", "audio", "error", "monitor"].map((i) => n`<option value=${i}>${xt[i]}</option>`)}</select><select aria-label="Origen del evento" .value=${this.origin} @change=${(i) => {
      this.origin = i.target.value, this.load();
    }}><option value="">Todos los orígenes</option>${["homeassistant", "observed", "physical_button", "infrared", "airmouse", "virtual_remote", "system"].map((i) => n`<option value=${i}>${xt[i]}</option>`)}</select><input type="search" aria-label="Buscar aplicación, canal o acción" placeholder="Aplicación, canal o acción" .value=${this.query} @change=${(i) => {
      this.query = i.target.value, this.load();
    }}></div><div class="events">${this.result.events.map((i) => n`<details><summary><time>${rt(i.ts, !0)}</time><span><strong>${xt[i.kind] ?? i.kind} · ${i.action ?? "Cambio"}</strong><small>${xt[i.origin] ?? i.origin}${i.app ? " · " + i.app : ""}${i.title ? " · " + i.title : ""}</small></span></summary><div class="event-detail">${Object.entries(i.data ?? {}).map(([o, a]) => n`<div><b>${o}</b><span>${typeof a == "object" ? JSON.stringify(a) : String(a ?? "—")}</span></div>`)}${i.actor ? n`<div><b>Usuario HA</b><span>${i.actor === this.hass?.user?.id ? "jeserga" : i.actor}</span></div>` : l}</div></details>`)}</div>${this.result.next ? n`<button class="more" @click=${() => void this.load(!0)} ?disabled=${this.loading}>Cargar más acciones</button>` : l}` : l}
      ${this.mode === "daily" ? n`<div class="days">${this.result.daily.map((i) => n`<details><summary><strong>${i.day}</strong><span>${S(i.on_seconds)} encendida</span></summary><div class="event-detail"><p>Reproduciendo: ${S(i.playing_seconds ?? 0)} · Pausa: ${S(i.paused_seconds ?? 0)} · Sin estado: ${S(i.unknown_seconds ?? 0)}</p>${["app_seconds", "channel_seconds"].map((o) => Object.entries(i[o] ?? {}).sort((a, s) => s[1] - a[1]).map(([a, s]) => n`<div><b>${a}</b><span>${S(Number(s))}</span></div>`))}<p>${Object.entries(i.events ?? {}).map(([o, a]) => `${xt[o] ?? o}: ${a}`).join(" · ")}</p></div></details>`)}</div>` : l}
      <footer>Detalle: 12 meses. Resúmenes diarios: sin caducidad. Las pérdidas de comunicación y las causas no demostradas se registran como incertidumbre. El registro comienza con la instalación de este seguimiento.</footer>
    </div></ha-card>`;
  }
};
C.styles = U`
    :host{display:block;color:var(--primary-text-color)}*{box-sizing:border-box}.body{padding:22px;max-width:1200px;margin:auto}h2,p{margin:0}h2{font-size:23px}header{display:flex;justify-content:space-between;align-items:center}header p{font-size:12px;color:var(--secondary-text-color);margin-top:6px}button,input,select{font:inherit;color:inherit}button{border:0;min-height:44px;border-radius:10px;background:var(--secondary-background-color);padding:8px 12px;cursor:pointer;touch-action:manipulation}button:disabled{opacity:.4}input,select{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:9px;padding:10px;min-width:0;min-height:44px}.tools{display:flex;gap:12px;align-items:end;margin:20px 0}.tools label{display:grid;gap:5px;font-size:12px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stats>div{padding:16px;background:var(--secondary-background-color);border-radius:12px;display:grid;gap:6px}.stats strong{font-size:23px}.stats small,small{font-size:12px;color:var(--secondary-text-color)}nav{display:flex;gap:8px;margin:18px 0;flex-wrap:wrap}nav [aria-pressed=true]{background:var(--primary-color);color:var(--text-primary-color,#fff)}details{border-bottom:1px solid var(--divider-color)}summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 4px;cursor:pointer;min-height:60px;font-size:13px}summary small{display:block;margin-top:5px}summary strong{font-size:13px}summary time{font-size:12px;min-width:110px;color:var(--secondary-text-color)}summary>span{flex:1;min-width:0}summary::-webkit-details-marker{display:none}.contents{padding:0 6px 15px}.contents>div{display:flex;gap:14px;padding:10px 0}.contents time{font-size:11px;min-width:110px;color:var(--secondary-text-color)}.contents strong{font-size:13px}.contents small{display:block;margin-top:4px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.filters input{flex:1;min-width:150px}.event-detail{padding:10px 12px 18px;font-size:12px;overflow-wrap:anywhere}.event-detail>div{display:flex;gap:20px;padding:5px 0;justify-content:space-between}.event-detail>div b{min-width:90px;font-weight:500}.event-detail>div span{text-align:right;white-space:pre-wrap}.event-detail p{margin:10px 0}.error{color:var(--error-color);padding:14px}.notice{font-size:12px;background:var(--secondary-background-color);padding:12px;border-radius:10px}.empty{padding:24px 0;color:var(--secondary-text-color);font-size:13px}.more{margin-top:15px}footer{font-size:11px;color:var(--secondary-text-color);line-height:1.5;margin-top:25px}.denied{padding:24px}button:focus-visible,summary:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media(max-width:600px){.body{padding:14px}.tools{gap:7px;flex-wrap:wrap}.tools label{flex:1}.tools input{width:100%;font-size:12px}.stats>div{padding:10px 8px}.stats strong{font-size:17px}.stats small{font-size:10px}summary{gap:9px}summary time{min-width:90px;font-size:10px}.contents time{min-width:88px;font-size:10px}.contents strong{font-size:12px}.filters select{flex:1;font-size:12px}nav{gap:5px}nav button{font-size:12px;padding:7px 9px}}`;
R([
  b({ attribute: !1 })
], C.prototype, "hass", 2);
R([
  d()
], C.prototype, "config", 2);
R([
  d()
], C.prototype, "result", 2);
R([
  d()
], C.prototype, "from", 2);
R([
  d()
], C.prototype, "to", 2);
R([
  d()
], C.prototype, "kind", 2);
R([
  d()
], C.prototype, "origin", 2);
R([
  d()
], C.prototype, "query", 2);
R([
  d()
], C.prototype, "mode", 2);
R([
  d()
], C.prototype, "error", 2);
R([
  d()
], C.prototype, "loading", 2);
C = R([
  j("polr-tv-history-card")
], C);
function pt(t) {
  const e = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(e / 3600).toString().padStart(2, "0")}:${Math.floor(e / 60 % 60).toString().padStart(2, "0")}:${(e % 60).toString().padStart(2, "0")}`;
}
function Me(t) {
  const e = /^(\d{1,3}):([0-5]\d):([0-5]\d)$/.exec(t.trim());
  return e ? Number(e[1]) * 3600 + Number(e[2]) * 60 + Number(e[3]) : null;
}
function Ie(t, e) {
  const i = t.observed_at ? e - t.observed_at : 1 / 0, o = i >= -2 && i <= 15, a = Math.max(0, t.duration || 0);
  return { position: Math.max(0, Math.min(a, (t.position || 0) + (o && t.state === "playing" ? Math.max(0, i) : 0))), fresh: o, canSeek: o && t.seekable === !0 && a > 0 && !!t.item_id };
}
var Po = Object.defineProperty, Co = Object.getOwnPropertyDescriptor, W = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Co(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && Po(e, i, a), a;
};
let L = class extends T {
  constructor() {
    super(...arguments), this.playback = {}, this.now = Date.now() / 1e3, this.draft = null, this.text = "", this.editing = !1, this.busy = !1, this.error = "";
  }
  connectedCallback() {
    super.connectedCallback(), this.timer = setInterval(() => {
      this.now = Date.now() / 1e3;
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.timer);
  }
  willUpdate(t) {
    t.has("playback") && this.item !== this.playback.item_id && (this.item = this.playback.item_id, this.draft = null, this.text = "", this.editing = !1, this.error = "");
  }
  async seek(t) {
    if (this.seekItem && this.seekItem !== this.playback.item_id) {
      this.error = "El contenido ha cambiado; selecciona de nuevo la posición.", this.draft = null;
      return;
    }
    if (t === null || t < 0 || t >= (this.playback.duration || 0)) {
      this.error = "Usa hh:mm:ss dentro de la duración del vídeo.";
      return;
    }
    if (!this.hass || this.busy || !Ie(this.playback, Date.now() / 1e3).canSeek) return;
    const e = this.playback.item_id;
    this.busy = !0, this.error = "";
    try {
      await this.hass.callService("tv_guide", "jellyfin_seek", { entry_id: this.entryId, expected_item_id: e, position: t }), this.playback.item_id === e && (this.draft = null, this.editing = !1);
    } catch (i) {
      this.error = i instanceof Error ? i.message : String(i);
    } finally {
      this.busy = !1;
    }
  }
  render() {
    const t = this.playback;
    if (t.source !== "jellyfin" || !["playing", "paused"].includes(t.state || "")) return l;
    const e = Ie(t, this.now), i = this.draft ?? e.position, o = !e.canSeek || this.busy;
    return n`<section aria-label="Reproducción de Jellyfin">
      <div class="title"><ha-icon icon="mdi:play-circle-outline"></ha-icon><strong>${t.title}</strong></div>
      <div class="times"><span>${t.state === "paused" ? "En pausa · " : ""}${pt(i)} / ${pt(t.duration || 0)}</span><span>Quedan ${pt((t.duration || 0) - i)}</span></div>
      <input class="range" type="range" min="0" max=${Math.max(0, Math.floor(t.duration || 0) - 1)} step="1" .value=${String(Math.floor(i))} ?disabled=${o} aria-label="Posición de reproducción en segundos"
        @pointerdown=${() => {
      this.seekItem = t.item_id;
    }} @keydown=${() => {
      this.seekItem = t.item_id;
    }}
        @input=${(a) => {
      this.draft = Number(a.target.value);
    }}
        @change=${(a) => this.seek(Number(a.target.value))}>
      <div class="seek"><label for="position">Ir a</label><input id="position" type="text" inputmode="text" placeholder="hh:mm:ss" aria-label="Momento exacto, horas minutos y segundos" .value=${this.editing ? this.text : pt(i)} ?disabled=${o}
        @focus=${() => {
      this.editing = !0, this.text = pt(i), this.seekItem = t.item_id;
    }} @input=${(a) => {
      this.text = a.target.value;
    }} @keydown=${(a) => {
      a.key === "Enter" && this.seek(Me(this.text));
    }}>
        <button ?disabled=${o} @click=${() => this.seek(Me(this.editing ? this.text : pt(i)))}>${this.busy ? "…" : "Ir"}</button>
        ${e.fresh ? t.seekable ? l : n`<small>Sin salto disponible</small>` : n`<small>Sin lectura reciente</small>`}
      </div>${t.state === "paused" ? n`<small class="pause-hint">Al saltar, Jellyfin reanuda brevemente y vuelve a pausar.</small>` : l}${this.error ? n`<div role="alert" class="error">${this.error}</div>` : l}
    </section>`;
  }
};
L.styles = U`
    :host{display:block}section{padding:10px 16px;border-top:1px solid var(--divider-color,#ddd);border-bottom:1px solid var(--divider-color,#ddd)}
    .title{display:flex;align-items:center;gap:6px;font-size:13px}.title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}ha-icon{--mdc-icon-size:20px;flex:none}
    .times{display:flex;justify-content:space-between;gap:6px;font-size:11px;color:var(--secondary-text-color);margin-top:5px;font-variant-numeric:tabular-nums}.range{width:100%;height:44px;margin:0;accent-color:var(--primary-color)}
    .seek{display:flex;align-items:center;gap:8px;font-size:12px}.seek input{min-width:0;width:85px;background:var(--secondary-background-color);color:var(--primary-text-color);border:1px solid var(--divider-color);border-radius:8px;padding:0 8px;height:42px;text-align:center;font:inherit;font-variant-numeric:tabular-nums}
    button{height:44px;min-width:44px;border:0;border-radius:10px;color:var(--primary-text-color);background:var(--secondary-background-color);cursor:pointer}button:disabled,input:disabled{opacity:.45}.error{font-size:12px;color:var(--error-color);margin-top:6px}.pause-hint{display:block;font-size:10px;color:var(--secondary-text-color);margin-top:5px}
  `;
W([
  b({ attribute: !1 })
], L.prototype, "hass", 2);
W([
  b({ attribute: !1 })
], L.prototype, "playback", 2);
W([
  b()
], L.prototype, "entryId", 2);
W([
  d()
], L.prototype, "now", 2);
W([
  d()
], L.prototype, "draft", 2);
W([
  d()
], L.prototype, "text", 2);
W([
  d()
], L.prototype, "editing", 2);
W([
  d()
], L.prototype, "busy", 2);
W([
  d()
], L.prototype, "error", 2);
L = W([
  j("polr-playback-control")
], L);
const zo = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});
function Oo(t) {
  const e = Object.fromEntries(zo.formatToParts(t).map((i) => [i.type, i.value]));
  return `${e.year}-${e.month}-${e.day}T${e.hour}:${e.minute}:${e.second}`;
}
function Mo(t) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(t * 1e3);
}
function Io(t, e, i) {
  const o = [t, e, i];
  if (o.some((p) => !/^\d+$/.test(p))) return null;
  const [a, s, r] = o.map(Number);
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(s) || !Number.isSafeInteger(r) || s > 59 || r > 59) return null;
  const c = a * 3600 + s * 60 + r;
  return Number.isSafeInteger(c) && c >= 1 && c <= 30 * 86400 ? c : null;
}
function Do(t, e) {
  const i = Math.max(0, Math.ceil(t - e)), o = Math.floor(i / 3600), a = Math.floor(i / 60) % 60;
  return `${o} h ${String(a).padStart(2, "0")} min ${String(i % 60).padStart(2, "0")} s`;
}
var No = Object.defineProperty, Lo = Object.getOwnPropertyDescriptor, A = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Lo(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && No(e, i, a), a;
};
let $ = class extends T {
  constructor() {
    super(...arguments), this.tvOn = !1, this.playback = {}, this.powerOff = {}, this.idleStandby = {}, this.expanded = !1, this.mode = "duration", this.hours = "0", this.minutes = "30", this.seconds = "0", this.at = Oo(Date.now() + 30 * 6e4), this.busy = !1, this.error = "", this.now = Date.now() / 1e3;
  }
  connectedCallback() {
    super.connectedCallback(), this.ticker = setInterval(() => {
      this.now = Date.now() / 1e3;
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this.ticker);
  }
  async service(t, e) {
    if (!(!this.hass || this.busy)) {
      this.busy = !0, this.error = "";
      try {
        await this.hass.callService("tv_guide", t, { entry_id: this.entryId, ...e });
      } catch (i) {
        this.error = i instanceof Error ? i.message : String(i);
      } finally {
        this.busy = !1;
      }
    }
  }
  async schedule() {
    if (!this.tvOn) {
      this.error = "Enciende la TV para programar el apagado.";
      return;
    }
    if (this.mode === "duration") {
      const t = Io(this.hours, this.minutes, this.seconds);
      if (t === null) {
        this.error = "Introduce de 1 segundo a 30 días; minutos y segundos entre 0 y 59.";
        return;
      }
      await this.service("schedule_power_off", { duration_seconds: t });
    } else {
      if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(this.at)) {
        this.error = "Selecciona una fecha y hora válidas.";
        return;
      }
      if (this.estimatedItem && this.estimatedItem !== this.playback.item_id) {
        this.error = "La reproducción ha cambiado; vuelve a calcular el final.";
        return;
      }
      await this.service("schedule_power_off", { turn_off_at: this.estimatedAtIso || this.at });
    }
  }
  async usePlaybackEnd() {
    if (!(!this.hass || this.busy)) {
      this.busy = !0, this.error = "";
      try {
        const t = await this.hass.callWS({ type: "tv_guide/playback_end", entry_id: this.entryId });
        if (t.item_id !== this.playback.item_id) throw new Error("La reproducción ha cambiado; vuelve a calcular el final.");
        this.at = t.turn_off_at.slice(0, 19), this.estimatedItem = t.item_id, this.estimatedAtIso = t.turn_off_at, this.mode = "clock";
      } catch (t) {
        this.error = t instanceof Error ? t.message : String(t);
      } finally {
        this.busy = !1;
      }
    }
  }
  render() {
    const t = this.powerOff.active && typeof this.powerOff.deadline == "number" ? this.powerOff.deadline : null, e = this.idleStandby.effective_hours;
    return n`<section aria-label="Apagado de la TV">
      <button class="section-toggle" type="button" aria-expanded=${this.expanded} @click=${() => {
      this.expanded = !this.expanded, this.error = "";
    }}>
        <ha-icon icon="mdi:timer-outline"></ha-icon><span>Apagado programado</span><ha-icon icon=${this.expanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${t !== null ? n`<div class="status" role="status">Se apagará el ${Mo(t)} <span>· Quedan ${Do(t, this.now)}</span></div>` : l}
      ${this.powerOff.error ? n`<div class="error" role="alert">${this.powerOff.error}</div>` : l}
      ${this.expanded ? n`<div class="body">
        <div class="modes" role="group" aria-label="Forma de programar el apagado">
          <button type="button" class=${this.mode === "duration" ? "selected" : ""} @click=${() => {
      this.mode = "duration", this.estimatedItem = void 0, this.estimatedAtIso = void 0;
    }}>Dentro de</button>
          <button type="button" class=${this.mode === "clock" ? "selected" : ""} @click=${() => {
      this.mode = "clock", this.estimatedItem = void 0, this.estimatedAtIso = void 0;
    }}>A una hora</button>
        </div>
        ${this.mode === "duration" ? n`<div class="duration">
          <label>Horas<input type="number" min="0" max="720" step="1" inputmode="numeric" .value=${this.hours} @input=${(i) => {
      this.hours = i.target.value;
    }}></label>
          <label>Minutos<input type="number" min="0" max="59" step="1" inputmode="numeric" .value=${this.minutes} @input=${(i) => {
      this.minutes = i.target.value;
    }}></label>
          <label>Segundos<input type="number" min="0" max="59" step="1" inputmode="numeric" .value=${this.seconds} @input=${(i) => {
      this.seconds = i.target.value;
    }}></label>
        </div>` : n`<div class="clock">
          <label for="sleep-at">Fecha y hora de Madrid</label><input id="sleep-at" type="datetime-local" step="1" .value=${this.at} @input=${(i) => {
      this.at = i.target.value, this.estimatedItem = void 0, this.estimatedAtIso = void 0;
    }}>
          <button type="button" ?disabled=${this.busy || !this.tvOn} @click=${this.usePlaybackEnd}>Al terminar lo que se reproduce</button>
          ${this.estimatedItem ? n`<small>Hora fija calculada con la reproducción actual.</small>` : l}
        </div>`}
        <div class="actions"><button class="primary" type="button" ?disabled=${this.busy || !this.tvOn} @click=${this.schedule}>${this.busy ? "Un momento…" : t !== null ? "Cambiar apagado" : "Programar apagado"}</button>
          ${t !== null ? n`<button type="button" ?disabled=${this.busy} @click=${() => this.service("cancel_power_off", {})}>Cancelar apagado</button>` : l}</div>
        ${this.tvOn ? l : n`<small>Enciende la TV para programar un apagado.</small>`}
        <div class="idle"><div><strong>Evitar apagado por inactividad</strong><small>${this.idleStandby.enabled ? this.idleStandby.pending ? "Aplicando ajuste…" : `Activo: ${e ?? "?"} horas sin interacción` : "Ajuste de fábrica de la TV"}</small></div>
          <button type="button" role="switch" aria-checked=${!!this.idleStandby.enabled} ?disabled=${this.busy} @click=${() => this.service("set_idle_standby", { enabled: !this.idleStandby.enabled })}>${this.idleStandby.enabled ? "Desactivar" : "Activar"}</button></div>
        ${this.idleStandby.error ? n`<div class="error" role="alert">${this.idleStandby.error}</div>` : l}
        ${this.error ? n`<div class="error" role="alert">${this.error}</div>` : l}
      </div>` : l}
    </section>`;
  }
};
$.styles = U`
    :host{display:block}section{border-top:1px solid var(--divider-color,#ddd);border-bottom:1px solid var(--divider-color,#ddd);font-size:13px}
    button,input{font:inherit}button{min-height:42px;border:0;border-radius:10px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer;padding:7px 12px}button:disabled{opacity:.5;cursor:default}
    .section-toggle{display:flex;align-items:center;gap:8px;width:100%;padding:8px 16px;background:transparent;text-align:left}.section-toggle span{flex:1;font-weight:600}.section-toggle ha-icon{--mdc-icon-size:20px}
    .status{padding:0 16px 9px;color:var(--primary-text-color);font-variant-numeric:tabular-nums}.status span{color:var(--secondary-text-color)}
    .body{padding:0 16px 13px}.modes,.actions{display:flex;gap:8px;flex-wrap:wrap}.modes button{flex:1}.modes .selected,.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}
    .duration{display:flex;gap:9px;margin:10px 0}.duration label{flex:1;min-width:0}.duration input{width:100%;box-sizing:border-box;margin-top:4px}
    .clock{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0}.clock label{width:100%}.clock input{min-width:0;flex:1}.clock small{width:100%}
    input{height:42px;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:8px;padding:0 7px;background:var(--card-background-color);color:var(--primary-text-color);font-variant-numeric:tabular-nums}
    .actions{margin:10px 0}.idle{display:flex;align-items:center;gap:8px;border-top:1px solid var(--divider-color);margin-top:13px;padding-top:12px}.idle>div{flex:1}.idle small,small{display:block;color:var(--secondary-text-color);font-size:11px;margin-top:3px}.error{color:var(--error-color);font-size:12px;padding:5px 16px}
  `;
A([
  b({ attribute: !1 })
], $.prototype, "hass", 2);
A([
  b()
], $.prototype, "entryId", 2);
A([
  b({ type: Boolean })
], $.prototype, "tvOn", 2);
A([
  b({ attribute: !1 })
], $.prototype, "playback", 2);
A([
  b({ attribute: !1 })
], $.prototype, "powerOff", 2);
A([
  b({ attribute: !1 })
], $.prototype, "idleStandby", 2);
A([
  d()
], $.prototype, "expanded", 2);
A([
  d()
], $.prototype, "mode", 2);
A([
  d()
], $.prototype, "hours", 2);
A([
  d()
], $.prototype, "minutes", 2);
A([
  d()
], $.prototype, "seconds", 2);
A([
  d()
], $.prototype, "at", 2);
A([
  d()
], $.prototype, "estimatedItem", 2);
A([
  d()
], $.prototype, "busy", 2);
A([
  d()
], $.prototype, "error", 2);
A([
  d()
], $.prototype, "now", 2);
$ = A([
  j("polr-power-control")
], $);
var Ro = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, ct = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Ho(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && Ro(e, i, a), a;
};
let G = class extends T {
  constructor() {
    super(...arguments), this.tvOn = !1, this.busy = !1, this.error = "";
  }
  async send(t, e = {}) {
    if (!(!this.hass || this.busy)) {
      this.busy = !0, this.error = "";
      try {
        await this.hass.callService("tv_guide", t, { entry_id: this.entryId, ...e });
      } catch (i) {
        this.error = i instanceof Error ? i.message : String(i);
      } finally {
        this.busy = !1;
      }
    }
  }
  render() {
    const t = this.soundbar;
    if (!t) return l;
    const e = t.power === "on" && t.output === "soundbar", i = t.capabilities || {}, o = e ? "Encendida" : t.power === "standby" ? "En reposo" : t.connected === !1 ? "No detectada" : t.output === "speaker" ? "HDMI inactivo" : "Sin lectura actual";
    return n`<section aria-label="Barra de sonido">
      <div class="heading"><ha-icon icon="mdi:soundbar"></ha-icon><strong>Hisense HS2100</strong><span>${o}${e && typeof t.volume_level == "number" ? ` · ${Math.round(t.volume_level * 100)} %` : ""}</span></div>
      <div class="buttons"><button ?disabled=${this.busy || t.busy || !this.tvOn || !i.on || e} @click=${() => this.send("soundbar_on")}><ha-icon icon="mdi:power"></ha-icon>Encender barra</button>
        <button ?disabled=${this.busy || t.busy || !this.tvOn || !i.off || !e} title=${i.off ? "Apagar la barra" : "Usa el mando de la barra para apagarla"} @click=${() => this.send("soundbar_off")}><ha-icon icon="mdi:power-standby"></ha-icon>Apagar barra</button></div>
      <label class="lock"><ha-icon icon=${t.keep_awake ? "mdi:lock" : "mdi:lock-open-variant-outline"}></ha-icon><span>Reactivar si se duerme</span><input type="checkbox" role="switch" .checked=${!!t.keep_awake} ?disabled=${this.busy || !i.keep_awake} @change=${(a) => this.send("soundbar_keep_awake", { enabled: a.target.checked })}></label>
      <p>Solo con la TV encendida. Puede tardar alrededor de un minuto en recuperar HDMI.</p>
      ${t.limitation ? n`<p>${t.limitation}</p>` : l}
      ${t.suspended ? n`<p class="error">Reactivación detenida tras tres fallos. Desactiva y activa el interruptor para reintentar.</p>` : l}
      ${this.error || t.error ? n`<p class="error" role="alert">${this.error || t.error}</p>` : l}
    </section>`;
  }
};
G.styles = U`
    :host{display:block}section{padding:14px 16px;border-top:1px solid var(--divider-color,#ddd)}.heading{display:flex;gap:7px;align-items:center;font-size:13px}.heading span{margin-left:auto;font-size:11px;color:var(--secondary-text-color)}ha-icon{--mdc-icon-size:20px;flex:none}
    .buttons{display:flex;gap:8px;margin-top:10px}.buttons button{flex:1;min-width:0;height:44px;border:0;border-radius:10px;background:var(--secondary-background-color);color:var(--primary-text-color);display:flex;gap:5px;align-items:center;justify-content:center;font-size:12px;cursor:pointer}button:disabled{opacity:.45;cursor:default}
    .lock{display:flex;gap:8px;align-items:center;min-height:44px;font-size:13px;cursor:pointer}.lock input{margin-left:auto;width:22px;height:22px;accent-color:var(--primary-color)}p{font-size:11px;color:var(--secondary-text-color);margin:4px 0;line-height:1.4}.error{color:var(--error-color)}
  `;
ct([
  b({ attribute: !1 })
], G.prototype, "hass", 2);
ct([
  b({ attribute: !1 })
], G.prototype, "soundbar", 2);
ct([
  b()
], G.prototype, "entryId", 2);
ct([
  b({ type: Boolean })
], G.prototype, "tvOn", 2);
ct([
  d()
], G.prototype, "busy", 2);
ct([
  d()
], G.prototype, "error", 2);
G = ct([
  j("polr-soundbar-control")
], G);
var Uo = Object.defineProperty, jo = Object.getOwnPropertyDescriptor, Dt = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? jo(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && Uo(e, i, a), a;
};
const De = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "action", label: "Call an action", hint: "" }
], Vo = (t) => [
  { name: "show_apps", selector: { boolean: {} } },
  ...t.show_apps ? [
    { name: "apps_label", selector: { text: {} } },
    { name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }
  ] : []
], qo = (t) => [
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
      ...t.hold_mode === "native" ? [
        {
          name: "native_hold_buttons",
          selector: {
            select: {
              multiple: !0,
              mode: "list",
              options: se.map((e) => ({
                value: e,
                label: e.replaceAll("_", " ")
              }))
            }
          }
        },
        {
          name: "native_touch_hold_delay_ms",
          selector: {
            number: {
              min: qt,
              max: Bt,
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
], Bo = (t) => [
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
      ...t.show_nav ? [
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
      ...t.show_transport ? [
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
      ...["volume_up", "volume_down", "volume_mute"].map((e) => ({
        name: `${e}_action`,
        selector: { ui_action: {} }
      }))
    ]
  }
], Wo = [
  { name: "action", selector: { ui_action: {} } }
], Fo = {
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
}, Ko = {
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
let Q = class extends T {
  constructor() {
    super(...arguments), this._editing = null, this._computeLabel = (t) => Fo[t.name] ?? t.name, this._computeHelper = (t) => Ko[t.name];
  }
  setConfig(t) {
    this._config = ti(t);
  }
  /**
   * ha-form data, with the editable tap actions flattened.
   *
   * ha-form has no vocabulary for a nested map, so `overrides.power` is
   * surfaced as `power_action` and folded back in `_formChanged`. Hold and
   * double-tap actions are preserved untouched; the selector only edits the tap.
   */
  get _formData() {
    const t = { ...this._config };
    for (const e of Q.ACTION_BUTTONS)
      t[`${e}_action`] = this._config.overrides[e]?.tap_action;
    return t;
  }
  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  _emit(t) {
    Et(this, "config-changed", { config: Qi(t) });
  }
  _formChanged(t) {
    t.stopPropagation();
    const e = { ...t.detail.value }, i = { ...this._config.overrides };
    for (const o of Q.ACTION_BUTTONS) {
      const a = `${o}_action`;
      if (!(a in e)) continue;
      const s = e[a];
      delete e[a];
      const r = { ...this._config.overrides[o] ?? {} };
      ut(s) && s.action !== "none" ? i[o] = { ...r, tap_action: s } : (delete r.tap_action, Object.keys(r).length ? i[o] = r : delete i[o]);
    }
    this._emit({
      ...this._config,
      ...e,
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
  _tiles(t) {
    return t === "apps" ? this._config.apps : this._config.sections[t]?.buttons ?? [];
  }
  _setTiles(t, e) {
    if (t === "apps") {
      this._emit({ ...this._config, apps: e });
      return;
    }
    const i = this._config.sections.map(
      (o, a) => a === t ? { ...o, buttons: e } : o
    );
    this._emit({ ...this._config, sections: i });
  }
  _addTile(t, e) {
    const i = [...this._tiles(t), e];
    this._setTiles(t, i), this._editing = { path: t, index: i.length - 1 };
  }
  _updateTile(t, e, i) {
    this._setTiles(
      t,
      this._tiles(t).map((o, a) => a === e ? { ...o, ...i } : o)
    );
  }
  _removeTile(t, e) {
    this._setTiles(
      t,
      this._tiles(t).filter((i, o) => o !== e)
    ), this._editing = null;
  }
  _moveTile(t, e, i) {
    const o = [...this._tiles(t)], a = e + i;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this._setTiles(t, o), this._isEditing(t, e) && (this._editing = { path: t, index: a }));
  }
  _isEditing(t, e) {
    return this._editing?.path === t && this._editing.index === e;
  }
  /** Change the action kind, carrying the old value across where it makes sense. */
  _setActionKind(t, e, i) {
    const o = this._tiles(t)[e].action;
    this._updateTile(t, e, {
      action: Le(i, Ne(o))
    });
  }
  _setActionValue(t, e, i) {
    const o = this._tiles(t)[e].action;
    this._updateTile(t, e, { action: Le(Kt(o), i) });
  }
  /* ---------------------------------------------------------- sections -- */
  _setSections(t) {
    this._emit({ ...this._config, sections: t });
  }
  _addSection() {
    this._setSections([
      ...this._config.sections,
      { name: "New section", buttons: [] }
    ]);
  }
  _renameSection(t, e) {
    this._setSections(
      this._config.sections.map(
        (i, o) => o === t ? { ...i, name: e } : i
      )
    );
  }
  _removeSection(t) {
    this._setSections(this._config.sections.filter((e, i) => i !== t)), this._editing = null;
  }
  _renderIcon(t) {
    const e = t.icon ?? "mdi:application";
    if (e.startsWith("brand:")) {
      const i = Ft[e.slice(6)];
      if (i) return n`<span class="brand">${i}</span>`;
    }
    return e.startsWith("/") || e.startsWith("http") ? n`<img class="brand" src=${e} alt="" />` : n`<ha-icon .icon=${e}></ha-icon>`;
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
  _renderTileList(t, e, i) {
    return e.length ? n`<ul class="list">
      ${e.flatMap(
      (o, a) => this._isEditing(t, a) ? [
        this._renderAppRow(t, o, a, e.length),
        this._renderAppForm(t, o, a)
      ] : [this._renderAppRow(t, o, a, e.length)]
    )}
    </ul>` : n`<div class="empty-state">${i}</div>`;
  }
  _renderAppRow(t, e, i, o) {
    const a = this._isEditing(t, i);
    return n`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(e)}</div>
        <div class="tile-info">
          <div class="primary"><span>${e.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${Bi(e.action)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${i === 0}
          @click=${() => this._moveTile(t, i, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${i === o - 1}
          @click=${() => this._moveTile(t, i, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${a ? "Done" : "Edit"}
          @click=${() => {
      this._editing = a ? null : { path: t, index: i };
    }}
        >
          <ha-icon icon=${a ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeTile(t, i)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }
  _renderAppForm(t, e, i) {
    const o = Kt(e.action), a = De.find((r) => r.value === o), s = Yo(e.action);
    return n`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${e.name ?? ""}
                @change=${(r) => this._updateTile(t, i, {
      name: r.target.value || void 0
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
              .value=${e.icon ?? ""}
              label="Icon"
              @value-changed=${(r) => {
      const c = r.detail?.value;
      !c && e.icon && !e.icon.startsWith("mdi:") || this._updateTile(t, i, { icon: c || void 0 });
    }}
            ></ha-icon-picker>

            ${t !== "apps" ? n`
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${e.entity ?? ""}
                    label="Lights up when this entity is on"
                    allow-custom-entity
                    @value-changed=${(r) => this._updateTile(t, i, {
      entity: r.detail?.value || void 0
    })}
                  ></ha-entity-picker>
                ` : l}

            <!-- Streaming logos are app suggestions; a section button is a
                 projector or a receiver, so they are only offered for apps. -->
            ${t === "apps" ? n`
                  <div class="chips">
                    ${Wt.map(
      (r) => n`
                        <button
                          class="chip ${e.icon === `brand:${r}` ? "accent" : ""}"
                          title=${`Use the ${ot[r].label} logo`}
                          @click=${() => this._updateTile(t, i, { icon: `brand:${r}` })}
                        >
                          ${ot[r].label}
                        </button>
                      `
    )}
                  </div>
                ` : l}

            <label class="field">
              <span>Does what</span>
              <select
                .value=${o}
                @change=${(r) => this._setActionKind(t, i, r.target.value)}
              >
                ${De.map(
      (r) => n`
                    <option value=${r.value} ?selected=${r.value === o}>
                      ${r.label}
                    </option>
                  `
    )}
              </select>
            </label>

            ${o === "action" ? n`
                  <!--
                    HA's own interactions editor, the same control the button
                    overrides use. It carries a service picker, a target and
                    data, which the old free-text box could not — hence the
                    note telling people to go and edit YAML instead.
                  -->
                  <ha-form
                    .hass=${this.hass}
                    .data=${{ action: s }}
                    .schema=${Wo}
                    .computeLabel=${() => "Action"}
                    @value-changed=${(r) => {
      r.stopPropagation();
      const c = r.detail?.value?.action;
      ut(c) && this._updateTile(t, i, { action: c });
    }}
                  ></ha-form>
                ` : n`
                  <label class="field wide">
                    <span>${a.label}</span>
                    <input
                      type="text"
                      .value=${Ne(e.action)}
                      @change=${(r) => this._setActionValue(t, i, r.target.value)}
                    />
                  </label>
                  <div class="hint">${a.hint}</div>
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
    const t = this._config, e = Xe(this.hass, t), i = e ? this.hass.states?.[e] : void 0, o = i?.attributes?.app_id, a = i?.attributes?.app_name;
    if (!o) return l;
    const s = t.apps.some(
      (r) => r.action.action === "app" && r.action.app_id === o
    );
    return n`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${s ? n`<div class="hint">${a ?? o} is already in the list.</div>` : n`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() => this._addTile("apps", {
      name: a ?? o,
      icon: Xo(a ?? o),
      action: { action: "app", app_id: o }
    })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${a ?? o}
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
    if (!this.hass || !this._config) return l;
    const t = this._config, e = t.apps;
    return n`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${Bo(t)}
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
          .schema=${Vo(t)}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>

        ${t.show_apps ? n`
              <div class="section-head">
                <span class="grow">Apps</span>
                <span class="count">${e.length}</span>
              </div>

              ${this._renderTileList("apps", e, "No apps yet — add one below.")}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${Wt.map(
      (i) => n`
                    <button
                      class="chip"
                      @click=${() => this._addTile("apps", {
        name: ot[i].label,
        icon: `brand:${i}`,
        action: { action: "activity", activity: ot[i].activity }
      })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${ot[i].label}
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
            ` : l}
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

          ${t.sections.map(
      (i, o) => n`
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
                    @change=${(a) => this._renameSection(o, a.target.value)}
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
        .schema=${qo(t)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
};
Q.ACTION_BUTTONS = [
  "power",
  "volume_up",
  "volume_down",
  "volume_mute"
];
Q.styles = [
  re,
  U`
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
Dt([
  b({ attribute: !1 })
], Q.prototype, "hass", 2);
Dt([
  d()
], Q.prototype, "_config", 2);
Dt([
  d()
], Q.prototype, "_editing", 2);
Q = Dt([
  j("polr-android-tv-remote-card-editor")
], Q);
const Kt = (t) => t.action === "activity" || t.action === "app" || t.action === "key" ? t.action : "action", Ne = (t) => {
  switch (t.action) {
    case "activity":
      return t.activity;
    case "app":
      return t.app_id;
    case "key":
      return t.key;
    default:
      return "";
  }
}, Yo = (t) => t.action === "service" ? Vt(t.service, t.data, t.target) : Kt(t) === "action" ? t : void 0, Le = (t, e) => {
  switch (t) {
    case "activity":
      return { action: "activity", activity: e };
    case "app":
      return { action: "app", app_id: e };
    case "key":
      return { action: "key", key: e };
    case "action":
      return { action: "perform-action", perform_action: e };
  }
}, Xo = (t) => {
  const e = Ge(t);
  return e ? `brand:${e}` : "mdi:application";
};
var Go = Object.defineProperty, Qo = Object.getOwnPropertyDescriptor, ft = (t, e, i, o) => {
  for (var a = o > 1 ? void 0 : o ? Qo(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (a = (o ? r(e, i, a) : r(a)) || a);
  return o && a && Go(e, i, a), a;
};
const Zo = "2.9.1", Nt = "polr-android-tv-remote-card";
let tt = class extends T {
  constructor() {
    super(...arguments), this._text = "", this._sending = !1, this._controlQueue = Promise.resolve(), this._nativeSessions = /* @__PURE__ */ new Map(), this._pressCoordinator = new ro();
  }
  static getConfigElement() {
    return document.createElement(`${Nt}-editor`);
  }
  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("remote.")) ?? "remote.android_tv", pad: "buttons" };
  }
  setConfig(t) {
    this._pressCoordinator.cancel(), this._releaseNativeSessions(), this._config = ti(t);
  }
  disconnectedCallback() {
    this._pressCoordinator.cancel(), this._releaseNativeSessions(), super.disconnectedCallback();
  }
  getCardSize() {
    const t = this._config;
    if (!t) return 6;
    let e = t.show_header ? 2 : 0;
    return t.show_nav && (e += t.pad === "buttons" ? 5 : 6), e += 1, t.show_transport && (e += 1), t.show_volume && (e += 1), t.show_text_input && (e += 1), t.show_apps && t.apps.length && (e += 2), Math.max(e, 3);
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
      return Ri(this.hass, this._config);
  }
  /**
   * Run a card action, reporting failures instead of dropping them.
   *
   * Every interaction here is fire-and-forget, so without this a rejected
   * service call -- a typo'd override, an entity that has gone away -- becomes
   * an unhandled promise rejection and the console shows nothing useful.
   */
  _run(t) {
    t.catch((e) => {
      console.error("polr-android-tv-remote-card:", e);
    });
  }
  /** Serialize remote operations without allowing one rejection to poison the queue. */
  _enqueueControl(t) {
    this._controlQueue = this._controlQueue.catch(() => {
    }).then(t).then(() => {
    }).catch((e) => {
      console.error("polr-android-tv-remote-card:", e);
    });
  }
  _press(t) {
    const e = this._device;
    if (!this.hass || !this._config || !e) return;
    const i = this.hass, o = this._config;
    this._releaseNativeSessions(), this._enqueueControl(() => qi(i, o, e, t, this));
  }
  _usesNativeHold(t) {
    const e = this._config;
    return !e || e.hold_mode !== "native" || !e.native_hold_buttons.includes(t) ? !1 : Object.keys(e.overrides[t] ?? {}).length === 0;
  }
  /** Send END_LONG once more only when Home Assistant rejected the first call. */
  async _sendNativeEnd(t, e) {
    try {
      await Ut(t.hass, t.device, e, "end");
    } catch {
      await new Promise((i) => window.setTimeout(i, 150)), await Ut(t.hass, t.device, e, "end");
    }
  }
  _endNativeSession(t, e) {
    this._nativeSessions.get(t) === e && (this._nativeSessions.delete(t), this._enqueueControl(() => this._sendNativeEnd(e, t)));
  }
  /** Release any stale native key before another card action is accepted. */
  _releaseNativeSessions() {
    for (const [t, e] of [...this._nativeSessions])
      this._endNativeSession(t, e);
  }
  /** Queue one half of a physical Android key press. */
  _nativePress(t, e) {
    let i = this._nativeSessions.get(t);
    if (e === "start") {
      const o = this._device;
      if (!this.hass || !o) return;
      this._releaseNativeSessions(), i = { hass: this.hass, device: o }, this._nativeSessions.set(t, i), this._enqueueControl(
        () => Ut(i.hass, i.device, t, "start")
      );
      return;
    }
    e === "end" && i && this._endNativeSession(t, i);
  }
  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  _pressOptions(t, e = {}) {
    const i = this._config, o = i.overrides[t], a = o?.hold_action, s = o?.double_tap_action, r = (c) => () => {
      this.hass && this._run(ie(this, this.hass, c, i.entity));
    };
    return this._usesNativeHold(t) ? {
      onPress: () => this._press(t),
      onPressStart: () => this._nativePress(t, "start"),
      onPressEnd: () => this._nativePress(t, "end"),
      haptics: i.haptics,
      claimTouch: !0,
      nativeTouchHoldDelayMs: i.native_touch_hold_delay_ms,
      coordinator: this._pressCoordinator
    } : {
      onPress: () => this._press(t),
      ...jt(a) ? { onHold: r(a) } : {},
      ...jt(s) ? { onDoubleTap: r(s) } : {},
      repeat: e.repeat && i.hold_mode === "repeat",
      haptics: i.haptics,
      claimTouch: !0,
      coordinator: this._pressCoordinator
    };
  }
  _navigate(t) {
    const e = t.detail.direction, i = t.detail.phase ?? "short";
    i === "start" || i === "end" ? this._nativePress(e, i) : this._press(e);
  }
  _launch(t) {
    const e = this._device;
    if (!this.hass || !e) return;
    const i = this.hass;
    this._releaseNativeSessions();
    const o = t.action?.action === "service" ? t.action.data?.favorite_id : void 0;
    if (t.action?.action === "service" && t.action.service === "tv_guide.youtube_kids_play" && (o === "luli_pampin" || o === "sunny_bunnies")) {
      this._youtubeFavorite = o;
      return;
    }
    if (t.action?.action === "service" && t.action.service === "tv_guide.youtube_kids_play") {
      this._run(we(i, e, t.action, this));
      return;
    }
    this._enqueueControl(() => we(i, e, t.action, this));
  }
  async _sendText() {
    const t = this._device, e = this._text.trim();
    if (!(!this.hass || !t || !e)) {
      this._sending = !0;
      try {
        await Vi(this.hass, t, e), this._text = "";
      } finally {
        this._sending = !1;
      }
    }
  }
  /* ------------------------------------------------------------- header -- */
  _renderHeader(t) {
    const e = this._config, i = e.context_entity ? this.hass?.states[e.context_entity]?.attributes : void 0, o = i?.label ?? (t.available ? t.on ? t.appName ?? "On" : "Off" : "Unavailable"), a = t.on && t.available ? Ge(t.appName) : void 0;
    return n`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${a ? n`<span class="brand-mark">${Ft[a]}</span>` : n`<ha-icon icon=${i?.kind === "home" ? "mdi:home" : i?.kind === "tv" ? "mdi:television-classic" : "mdi:television"}></ha-icon>`}
        </div>
        <div class="tile-info">
          <div class="primary"><span>${t.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${o}</span></div>
        </div>
        ${e.show_power ? n`
              <button
                class="icon-button"
                type="button"
                aria-label=${t.on ? "Turn off" : "Turn on"}
                ${at(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            ` : l}
      </div>
      ${this._renderChips(t)}
    `;
  }
  _renderChips(t) {
    if (!t.on || !t.available) return l;
    const e = [];
    return t.muted === !0 ? e.push(n`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`) : $e(t) && e.push(n`<span class="chip accent">${Math.round(t.volume * 100)}%</span>`), e.length ? n`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${e}</div>
    </div>` : l;
  }
  /* -------------------------------------------------------------- rows -- */
  _button(t, e, i, o = {}) {
    return n`
      <button
        class="control-button"
        type="button"
        aria-label=${i}
        title=${i}
        ${at(this._pressOptions(t, o))}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  _renderNavigationRow() {
    const t = this._config, e = t.show_power && !t.show_header;
    return n`
      <div class="features">
        ${e ? this._button("power", "mdi:power", "Power") : l}
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${this._config.show_favorite ? this._button("favorite", "mdi:star", "Favourite") : l}
      </div>
    `;
  }
  /**
   * Transport row, masked by what the player actually advertises.
   *
   * Buttons are shown when there is no paired player at all, because the key
   * codes work regardless — it is only the *player* route that needs the bit.
   */
  _renderTransport(t) {
    const e = t.playerId === null, i = e || mt(t, F.PREVIOUS_TRACK), o = e || mt(t, F.NEXT_TRACK), a = new Set(this._config.transport_buttons), s = [
      a.has("previous") && i ? this._button("previous", "mdi:skip-previous", "Previous") : l,
      a.has("rewind") ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: !0 }) : l,
      a.has("play_pause") ? this._button(
        "play_pause",
        t.playing ? "mdi:pause" : "mdi:play",
        t.playing ? "Pause" : "Play"
      ) : l,
      a.has("fast_forward") ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: !0 }) : l,
      a.has("next") && o ? this._button("next", "mdi:skip-next", "Next") : l
    ];
    return n`<div class="features">${s}</div>`;
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
  _renderVolume(t) {
    const e = $e(t), i = t.muted === !0;
    return n`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: !0 })}
        <button
          class="control-button"
          type="button"
          aria-label=${i ? "Activar sonido" : t.muted === !1 ? "Silenciar" : "Alternar silencio"}
          aria-pressed=${t.muted === void 0 ? "undefined" : i ? "true" : "false"}
          ${at(this._pressOptions("volume_mute"))}
        >
          <ha-icon icon=${i ? "mdi:volume-high" : "mdi:volume-off"}></ha-icon>
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: !0 })}
      </div>
      ${e ? n`
            <div class="volume-bar ${i ? "muted" : ""}">
              <span style="width:${Math.round(t.volume * 100)}%"></span>
            </div>
          ` : l}
      ${t.volumeOutput ? n`<div class="volume-output">${t.volumeOutput}${e ? ` · ${Math.round(t.volume * 100)} %` : ""}${i ? " · Silencio" : ""}</div>` : l}
    `;
  }
  _renderTextInput() {
    return n`
      <div class="text-row">
        <input
          type="text"
          .value=${this._text}
          placeholder="Type on the TV…"
          aria-label="Text to send to the TV"
          @input=${(t) => {
      this._text = t.target.value;
    }}
          @keydown=${(t) => {
      t.key === "Enter" && this._run(this._sendText());
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
  _renderAppIcon(t) {
    const e = t.icon ?? "mdi:application";
    if (e.startsWith("brand:")) {
      const i = Ft[e.slice(6)];
      if (i) return n`${i}`;
    }
    return e.startsWith("/") || e.startsWith("http") ? n`<img src=${e} alt="" />` : n`<ha-icon icon=${e}></ha-icon>`;
  }
  /**
   * One row of tiles.
   *
   * The app launcher is the built-in caller; user-defined sections are the same
   * grid with their own name. Labels gate on `show_section_labels`, so a custom
   * section is indistinguishable from a native one.
   */
  _renderSection(t, e, i, o) {
    const a = this._config;
    return t.length ? n`
      ${a.show_section_labels && e ? n`<div class="section-head">
            ${e}<span class="grow"></span><span class="count">${t.length}</span>
          </div>` : l}
      <div class="app-grid" style="--app-per-row: ${i}">
        ${Ke(
      t,
      (s, r) => `${o}:${r}:${s.icon ?? ""}`,
      (s) => {
        const r = this.hass ? Ui(this.hass, s.entity) : !1, c = s.action?.action === "service" && s.action.service === "tv_guide.youtube_kids_play" && !!(a.context_entity && this.hass?.states[a.context_entity]?.attributes.youtube_operation?.state === "running");
        return n`
              <button
                class="app-tile ${r ? "active" : ""}"
                ?disabled=${c}
                type="button"
                aria-label=${s.name ?? "Launch app"}
                title=${s.name ?? ""}
                aria-pressed=${s.entity ? String(r) : l}
                style=${s.color ? `--app-color:${s.color}` : ""}
                ${at({
          onPress: () => {
            c || this._launch(s);
          },
          haptics: a.haptics,
          coordinator: this._pressCoordinator
        })}
              >
                ${this._renderAppIcon(s)}
              </button>
            `;
      }
    )}
      </div>
    ` : l;
  }
  _renderApps() {
    const t = this._config;
    return this._renderSection(
      t.apps,
      t.apps_label,
      t.app_columns,
      "apps"
    );
  }
  /** User-defined rows, in declared order, ahead of the app launcher. */
  _renderCustomSections() {
    const t = this._config;
    return t.sections.length ? n`
      ${t.sections.map(
      (e, i) => this._renderSection(
        e.buttons,
        e.name ?? "",
        e.columns ?? t.app_columns,
        `s${i}`
      )
    )}
    ` : l;
  }
  /* ------------------------------------------------------------ render -- */
  render() {
    if (!this.hass || !this._config) return l;
    const t = this._config, e = this._device;
    if (!e.found)
      return n`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${t.entity} not found.</span>
          </div>
        </ha-card>
      `;
    const i = Di("media_player", e.on ? "on" : "off"), o = e.available, a = t.context_entity ? this.hass.states[t.context_entity]?.attributes : void 0;
    return n`
      <ha-card class=${t.show_header ? "" : "headerless"} style="--tile-color:${i}">
        ${this._youtubeFavorite ? n`<polr-youtube-favorite .favoriteId=${this._youtubeFavorite} .hass=${this.hass} .entryId=${a?.entry_id} .operation=${a?.youtube_operation} .queue=${a?.youtube_queue} @close=${async () => {
      const s = this._youtubeFavorite === "sunny_bunnies" ? "Sunny Bunnies" : "Luli Pampín";
      this._youtubeFavorite = void 0, await this.updateComplete, this.shadowRoot?.querySelector(`[aria-label="${s}"]`)?.focus();
    }}></polr-youtube-favorite>` : l}
        ${t.show_header ? this._renderHeader(e) : l}
        ${a?.youtube_operation && ["running", "error"].includes(a.youtube_operation.state) ? n`<div class="notice ${a.youtube_operation.state === "error" ? "error" : "warn"}" role=${a.youtube_operation.state === "error" ? "alert" : "status"}><ha-icon icon="mdi:youtube"></ha-icon><span class="grow">${a.youtube_operation.message}</span></div>` : l}
        ${a?.playback ? n`<polr-playback-control .hass=${this.hass} .playback=${a.playback} .entryId=${a.entry_id}></polr-playback-control>` : l}
        ${a?.power_off && a?.idle_standby ? n`<polr-power-control .hass=${this.hass} .entryId=${a.entry_id} .tvOn=${e.on} .playback=${a.playback} .powerOff=${a.power_off} .idleStandby=${a.idle_standby}></polr-power-control>` : l}
        ${t.show_header && e.playerId === null ? n`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>` : l}
        ${o ? e.on ? n`
                ${t.show_nav ? n`<polr-atv-nav-pad
                      .pad=${t.pad}
                      .repeat=${t.hold_mode === "repeat"}
                      .nativeButtons=${t.native_hold_buttons.filter(
      (s) => this._usesNativeHold(s)
    )}
                      .nativeTouchHoldDelayMs=${t.native_touch_hold_delay_ms}
                      .pressCoordinator=${this._pressCoordinator}
                      .haptics=${t.haptics}
                      @atv-nav=${this._navigate}
                    ></polr-atv-nav-pad>` : l}
                ${this._renderNavigationRow()}
                ${t.show_transport ? this._renderTransport(e) : l}
                ${t.show_volume ? this._renderVolume(e) : l}
                ${t.show_text_input ? this._renderTextInput() : l}
                ${this._renderCustomSections()}
                ${t.show_apps ? this._renderApps() : l}
              ` : n`
                <!-- No "the TV is off" line: the header secondary already says
                     Off, and the button says Turn on. -->
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${at(this._pressOptions("power"))}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                ${this._renderCustomSections()}
                ${t.show_apps ? this._renderApps() : l}
              ` : n`<div class="empty-state">This device is unavailable.</div>`}
        ${a?.soundbar ? n`<polr-soundbar-control .hass=${this.hass} .soundbar=${{ ...a.soundbar, output: a.audio?.output }} .entryId=${a.entry_id} .tvOn=${e.on}></polr-soundbar-control>` : l}
      </ha-card>
    `;
  }
};
tt.styles = [re, ii];
ft([
  b({ attribute: !1 })
], tt.prototype, "hass", 2);
ft([
  d()
], tt.prototype, "_config", 2);
ft([
  d()
], tt.prototype, "_text", 2);
ft([
  d()
], tt.prototype, "_sending", 2);
ft([
  d()
], tt.prototype, "_youtubeFavorite", 2);
tt = ft([
  j(Nt)
], tt);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: Nt,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: !0,
  documentationURL: "https://github.com/jeserga/polr-android-tv-remote-card"
});
console.info(`%c ${Nt} %c ${Zo} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
export {
  Zo as CARD_VERSION,
  tt as PolrAndroidTvRemoteCard
};
//# sourceMappingURL=polr-android-tv-remote-card.js.map
