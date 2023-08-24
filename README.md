# lazyload
Lazyloading image in your applications.

# Installation
## npm
```bash
$ npm i lazyload -S
```
## yarn
```bash
$ yarn add lazyload
```
# Usage
```
main.js:
```javascript

import Vue from 'vue'
import LazyLoad from 'lazyload'

Vue.use(LazyLoad, {default: ''})

```

use `v-lazyload` work with raw HTML
```html
<div v-lazyload="['/img/img1.png', '/img/img2.png']"></div>
```

## Others
+ default: 默认图片，指令注册时传入
+ 图片元素的祖先元素css必须设置有overflow或overflow-y，否则会取body元素作为其scroll基准容器