!function(){function n(n,t,e,r,i,o,c){try{var u=n[o](c),a=u.value}catch(s){return void e(s)}u.done?t(a):Promise.resolve(a).then(r,i)}function t(t){return function(){var e=this,r=arguments;return new Promise(function(i,o){var c=t.apply(e,r);function u(t){n(c,i,o,u,a,"next",t)}function a(t){n(c,i,o,u,a,"throw",t)}u(void 0)})}}(self.webpackChunkreportModule=self.webpackChunkreportModule||[]).push([[8592],{68225:function(n,t,e){"use strict";e.d(t,{c:function(){return c}});var r=e(23150),i=e(52954),o=e(39461),c=function(n,t){var e,c,u=function(n,r,i){if("undefined"!=typeof document){var o=document.elementFromPoint(n,r);o&&t(o)?o!==e&&(s(),a(o,i)):s()}},a=function(n,t){e=n,c||(c=e);var i=e;(0,r.c)(function(){return i.classList.add("ion-activated")}),t()},s=function(){var n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e){var t=e;(0,r.c)(function(){return t.classList.remove("ion-activated")}),n&&c!==e&&e.click(),e=void 0}};return(0,o.createGesture)({el:n,gestureName:"buttonActiveDrag",threshold:0,onStart:function(n){return u(n.currentX,n.currentY,i.a)},onMove:function(n){return u(n.currentX,n.currentY,i.b)},onEnd:function(){s(!0),(0,i.h)(),c=void 0}})}},77330:function(n,e,r){"use strict";r.d(e,{a:function(){return o},d:function(){return c}});var i=r(52377),o=function(){var n=t(regeneratorRuntime.mark(function n(t,e,r,o,c){var u;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(!t){n.next=2;break}return n.abrupt("return",t.attachViewToDom(e,r,c,o));case 2:if("string"==typeof r||r instanceof HTMLElement){n.next=4;break}throw new Error("framework delegate is missing");case 4:return u="string"==typeof r?e.ownerDocument&&e.ownerDocument.createElement(r):r,o&&o.forEach(function(n){return u.classList.add(n)}),c&&Object.assign(u,c),e.appendChild(u),n.next=10,new Promise(function(n){return(0,i.c)(u,n)});case 10:return n.abrupt("return",u);case 11:case"end":return n.stop()}},n)}));return function(t,e,r,i,o){return n.apply(this,arguments)}}(),c=function(n,t){if(t){if(n)return n.removeViewFromDom(t.parentElement,t);t.remove()}return Promise.resolve()}},52954:function(n,t,e){"use strict";e.d(t,{a:function(){return o},b:function(){return c},c:function(){return i},d:function(){return a},h:function(){return u}});var r={getEngine:function(){var n=window;return n.TapticEngine||n.Capacitor&&n.Capacitor.isPluginAvailable("Haptics")&&n.Capacitor.Plugins.Haptics},available:function(){return!!this.getEngine()},isCordova:function(){return!!window.TapticEngine},isCapacitor:function(){return!!window.Capacitor},impact:function(n){var t=this.getEngine();if(t){var e=this.isCapacitor()?n.style.toUpperCase():n.style;t.impact({style:e})}},notification:function(n){var t=this.getEngine();if(t){var e=this.isCapacitor()?n.style.toUpperCase():n.style;t.notification({style:e})}},selection:function(){this.impact({style:"light"})},selectionStart:function(){var n=this.getEngine();n&&(this.isCapacitor()?n.selectionStart():n.gestureSelectionStart())},selectionChanged:function(){var n=this.getEngine();n&&(this.isCapacitor()?n.selectionChanged():n.gestureSelectionChanged())},selectionEnd:function(){var n=this.getEngine();n&&(this.isCapacitor()?n.selectionEnd():n.gestureSelectionEnd())}},i=function(){r.selection()},o=function(){r.selectionStart()},c=function(){r.selectionChanged()},u=function(){r.selectionEnd()},a=function(n){r.impact(n)}},66575:function(n,t,e){"use strict";e.d(t,{s:function(){return r}});var r=function(n){try{if(n instanceof function(){return function n(t){!function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.value=t}}())return n.value;if(!c()||"string"!=typeof n||""===n)return n;var t=document.createDocumentFragment(),e=document.createElement("div");t.appendChild(e),e.innerHTML=n,a.forEach(function(n){for(var e=t.querySelectorAll(n),r=e.length-1;r>=0;r--){var c=e[r];c.parentNode?c.parentNode.removeChild(c):t.removeChild(c);for(var u=o(c),a=0;a<u.length;a++)i(u[a])}});for(var r=o(t),u=0;u<r.length;u++)i(r[u]);var s=document.createElement("div");s.appendChild(t);var f=s.querySelector("div");return null!==f?f.innerHTML:s.innerHTML}catch(l){return console.error(l),""}},i=function n(t){if(!t.nodeType||1===t.nodeType){for(var e=t.attributes.length-1;e>=0;e--){var r=t.attributes.item(e),i=r.name;if(u.includes(i.toLowerCase())){var c=r.value;null!=c&&c.toLowerCase().includes("javascript:")&&t.removeAttribute(i)}else t.removeAttribute(i)}for(var a=o(t),s=0;s<a.length;s++)n(a[s])}},o=function(n){return null!=n.children?n.children:n.childNodes},c=function(){var n=window,t=n&&n.Ionic&&n.Ionic.config;return!t||(t.get?t.get("sanitizerEnabled",!0):!0===t.sanitizerEnabled||void 0===t.sanitizerEnabled)},u=["class","id","href","src","name","slot"],a=["script","style","iframe","meta","link","object","embed"]},60408:function(n,t,e){"use strict";e.d(t,{S:function(){return r}});var r={bubbles:{dur:1e3,circles:9,fn:function(n,t,e){var r=n*t/e-n+"ms",i=2*Math.PI*t/e;return{r:5,style:{top:9*Math.sin(i)+"px",left:9*Math.cos(i)+"px","animation-delay":r}}}},circles:{dur:1e3,circles:8,fn:function(n,t,e){var r=t/e,i=n*r-n+"ms",o=2*Math.PI*r;return{r:5,style:{top:9*Math.sin(o)+"px",left:9*Math.cos(o)+"px","animation-delay":i}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:function(){return{r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}}}},crescent:{dur:750,circles:1,fn:function(){return{r:26,style:{}}}},dots:{dur:750,circles:3,fn:function(n,t){return{r:6,style:{left:9-9*t+"px","animation-delay":-110*t+"ms"}}}},lines:{dur:1e3,lines:12,fn:function(n,t,e){return{y1:17,y2:29,style:{transform:"rotate(".concat(30*t+(t<6?180:-180),"deg)"),"animation-delay":n*t/e-n+"ms"}}}},"lines-small":{dur:1e3,lines:12,fn:function(n,t,e){return{y1:12,y2:20,style:{transform:"rotate(".concat(30*t+(t<6?180:-180),"deg)"),"animation-delay":n*t/e-n+"ms"}}}}}},61269:function(n,e,r){"use strict";r.d(e,{c:function(){return o},g:function(){return c},h:function(){return i},o:function(){return a}});var i=function(n,t){return null!==t.closest(n)},o=function(n,t){return"string"==typeof n&&n.length>0?Object.assign((e={"ion-color":!0},r="ion-color-".concat(n),i=!0,r in e?Object.defineProperty(e,r,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[r]=i,e),t):t;var e,r,i},c=function(n){var t={};return function(n){return void 0!==n?(Array.isArray(n)?n:n.split(" ")).filter(function(n){return null!=n}).map(function(n){return n.trim()}).filter(function(n){return""!==n}):[]}(n).forEach(function(n){return t[n]=!0}),t},u=/^[a-z][a-z0-9+\-.]*:/,a=function(){var n=t(regeneratorRuntime.mark(function n(t,e,r,i){var o;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(null==t||"#"===t[0]||u.test(t)){n.next=4;break}if(!(o=document.querySelector("ion-router"))){n.next=4;break}return n.abrupt("return",(null!=e&&e.preventDefault(),o.push(t,r,i)));case 4:return n.abrupt("return",!1);case 5:case"end":return n.stop()}},n)}));return function(t,e,r,i){return n.apply(this,arguments)}}()}}])}();