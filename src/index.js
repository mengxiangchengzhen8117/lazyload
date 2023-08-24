/*
* import plugin from './plugin/index.js';
* Vue.use(plugin, {default: '/auth/captcha'});
* 示例：
<div ref="container">
  <div v-for="item in arr" :key="item.id" class="imgItem">
     <img v-lazy="item" />
	</div>
</div>
* 原理：
* 在插件中注册全局子令lazy, 在bind中将节点信息el,binding.value加入队列
* 必须Vue.nextTick回调函数中load加载图片并绑定scroll事件，因为此时元素及container节点才真正渲染了，
* 找到parent节点或指定的container节点，push进target队列，添加scroll事件
* load方法根据是否加载过和el.getBoundingClientRect()判断元素位置距视口顶部的距离
* 如果距离顶部的距离position.top<1.5scrollTarget.height && >-position.height
* 利用new Image(),添加onload，onerror处理函数，加载成功则设置src属性值，并更新loaded==true
* 失败则设置为默认图片，loaded==false，下载滑动到可视区域会再次加载
* 利用闭包对绑定的事件处理函数做防抖处理，避免多次执行
* 将目标container加入队列，避免给同一个元素重复绑定scroll事件
*
* 在update中判断是否更新队列中节点信息，loaded设置为false，重新调用load
* 在unbind中清楚队列中该节点，判断是否需要清空队列及给scrollTarget解绑scroll事件
*
* */

import Lazy from './lazy.js'

export default {
	install: function(Vue, options) {
		const lazy = new Lazy(Vue, options);
		Vue.directive('lazy', {
      bind(el, binding) {
				lazy.add(el, binding.value);
      },
      update(el, binding) {
				lazy.update(el, binding.value);
			},
			unbind(el) {
				lazy.remove(el);
			}
		});
	}
};