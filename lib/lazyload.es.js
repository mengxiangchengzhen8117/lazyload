function i(l, e = 200) {
  let n = this, t;
  return function(...r) {
    t && clearTimeout(t), t = setTimeout(function() {
      l.call(n, ...r);
    }, e || 200);
  };
}
class o {
  constructor(e, n) {
    this.Vue = e, this.defaultImg = n.default || "", this.listenerQuene = [], this.scrollFun = null;
  }
  add(e, n = "") {
    e && this.Vue.nextTick(() => {
      const t = { $el: e, url: typeof n == "string" && n || "", loaded: !1, $parent: null };
      t.$parent = this.findParent(t.$el), t.parentHeight = t.$parent.offsetHeight || window.innerHeight, this.listenerQuene.push(t), this.load(t), this.addEvent(t);
    });
  }
  update(e, n = "") {
    if (!e)
      return;
    const t = typeof n == "string" && n || "";
    this.listenerQuene.forEach((r, s) => {
      if (e.isSameNode(r.$el))
        return r.url !== t && (this.listenerQuene[s].url = t, this.listenerQuene[s].loaded = !1, this.load(r)), !1;
    });
  }
  remove(e) {
    this.listenerQuene.forEach((n, t) => {
      if (e.isSameNode(n.$el))
        return this.listenerQuene.splice(t, 1), !1;
    }), this.listenerQuene.length == 0 && this.clear(e);
  }
  findParent(e) {
    const n = window.getComputedStyle(e.parentNode), t = n.overflow || "", r = n["overflow-y"] || "";
    return ["scroll", "auto", "overlay"].indexOf(t) > -1 || ["scroll", "auto", "overlay"].indexOf(r) > -1 || e.parentNode === "BODY" ? e.parentNode : this.findParent(e.parentNode);
  }
  addEvent(e) {
    var n;
    e.$parent && ((n = this.listenerQuene.filter((t) => {
      var r;
      return !!((r = t.$parent) != null && r.isSameNode(e.$parent));
    })) == null ? void 0 : n.length) === 1 && (this.scrollFun || (this.scrollFun = i.call(this, this.handler)), e.$parent.removeEventListener("scroll", this.scrollFun), e.$parent.addEventListener("scroll", this.scrollFun));
  }
  handler() {
    this.listenerQuene.filter((e) => !e.loaded).forEach((e) => {
      this.load(e);
    });
  }
  checkInView(e) {
    let n = e.$el.getBoundingClientRect();
    return n.top < e.parentHeight * 2 && n.top > -n.height;
  }
  load(e) {
    if (!e.loaded && this.checkInView(e)) {
      var n = this, t = e.url || this.defaultImg;
      e.$el.setAttribute("src", e.$el.getAttribute("src") || this.defaultImg);
      var r = new Image();
      r.onload = function() {
        e.loaded = !0, e.$el.setAttribute("src", t);
      }, r.onerror = function() {
        e.loaded = !1, e.$el.setAttribute("src", n.defaultImg);
      }, r.src = t;
    }
  }
  clear(e) {
    var n;
    ((n = this.listenerQuene.filter((t) => {
      var r;
      return !!((r = t.$parent) != null && r.isSameNode(e.parentNode));
    })) == null ? void 0 : n.length) === 0 && this.scrollFun && e.parentNode.removeEventListener("scroll", this.scrollFun);
  }
}
const a = {
  install: function(l, e) {
    const n = new o(l, e);
    l.directive("lazy", {
      bind(t, r) {
        n.add(t, r.value);
      },
      update(t, r) {
        n.update(t, r.value);
      },
      unbind(t) {
        n.remove(t);
      }
    });
  }
};
export {
  a as default
};
