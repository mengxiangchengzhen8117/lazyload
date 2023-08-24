import { debounce } from './util';

class Lazy {
  constructor(Vue, options) {
    this.Vue = Vue;
    this.defaultImg = options.default || '';
    this.listenerQuene = [];
    this.scrollFun = null;
  }

  add(el, value = '') {
    if (!el) return;
    this.Vue.nextTick(() => {
      const item = { $el: el, url: typeof value === 'string' ? value || '' : '', loaded: false, $parent: null };
      item.$parent = this.findParent(item.$el);
      item.parentHeight = item.$parent.offsetHeight || window.innerHeight;
      this.listenerQuene.push(item);
      this.load(item);
      this.addEvent(item);
    });
  }

  update(el, value = '') {
    if (!el) return;
    const url = typeof value === 'string' ? value || '' : '';
    this.listenerQuene.forEach((item, index) => {
      if (el.isSameNode(item.$el)) {
        if (item.url !== url) {
          this.listenerQuene[index].url = url;
          this.listenerQuene[index].loaded = false;
          this.load(item);
        }
        return false;
      }
    });
  }

  remove(el) {
    this.listenerQuene.forEach((item, index) => {
      if (el.isSameNode(item.$el)) {
        this.listenerQuene.splice(index, 1);
        return false;
      }
    });

    if(this.listenerQuene.length==0) {
      this.clear(el);
    }
  }

  findParent(el) {
    const computedStyle = window.getComputedStyle(el.parentNode);
    const overflow = computedStyle['overflow'] || '';
    const overflowY = computedStyle['overflow-y'] || '';
    if (['scroll', 'auto', 'overlay'].indexOf(overflow) > -1 || ['scroll', 'auto', 'overlay'].indexOf(overflowY) > -1 || el.parentNode === 'BODY') {
      return el.parentNode;
    } else { // 否则递归查找
      return this.findParent(el.parentNode);
    }
  }

  addEvent(item) {
    if (item.$parent) {
      if (this.listenerQuene.filter(i => !!i.$parent?.isSameNode(item.$parent))?.length === 1) {
        if (!this.scrollFun) {
          this.scrollFun = debounce.call(this, this.handler);
        }
        item.$parent.removeEventListener('scroll', this.scrollFun);
        item.$parent.addEventListener('scroll', this.scrollFun);
      }
    }
  }

  handler() {
    this.listenerQuene.filter(item => !item.loaded).forEach(item => {
      this.load(item);
    })
  }

  checkInView(item) {
    let position = item.$el.getBoundingClientRect();
    // 当元素的top偏移量小于页面高度并且大于高度的负数
    if(position.top < item.parentHeight * 2 && position.top > -position.height){
      return true;
    }
    return false;
  }

  load(item) {
    if (!item.loaded && this.checkInView(item)) {
      var self = this;
      var src = item.url || this.defaultImg;
      item.$el.setAttribute('src', item.$el.getAttribute('src') || this.defaultImg);
      var img = new Image();
      img.onload = function () {//图片已成功加载，再给元素设置src加载缓存的图片
        item.loaded = true;
        item.$el.setAttribute('src', src);
      };
      img.onerror = function() {//图片加载失败，设置loaded:false,下次会再加载
        item.loaded = false;
        item.$el.setAttribute('src', self.defaultImg);
      };
      img.src = src;
    }
  }

  clear(el) {
    if(this.listenerQuene.filter(item => !!item.$parent?.isSameNode(el.parentNode))?.length === 0) {
      this.scrollFun && el.parentNode.removeEventListener('scroll', this.scrollFun);
    }
	}
}
export default Lazy;