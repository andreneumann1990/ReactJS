(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{9547:function(e,t,n){Promise.resolve().then(n.bind(n,7541))},7541:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return D}});var l=n(7437);n(7712);var r=n(2265),o=n(7138),s=n(5033),i=n(2944),a=n(1199),u=n(7252),c=n.n(u),d=n(1838),m=n.n(d),p=n(6463);let f=c()("2QYN25VL0K","ba0b8a970db7843753c13218f38ae4e2").initIndex("example_3");function h(){let e=(0,p.useRouter)(),{layoutState:t,searchState:n,sidenavState:u}=(0,a.s6)(),{setIsOpen:c}=n,{setResultsDataArray:d,setResultsSelectedIndex:h}=n,[x,v]=(0,r.useState)(!1),[g,E]=(0,r.useState)(!1),[y,b]=(0,r.useState)(""),[w,j]=(0,r.useState)(null),[k,S]=(0,r.useState)("");return(0,r.useEffect)(()=>{if(u.isOpen){if(!n.isOpen)return;s.HW&&console.log("Search: isOpen false"),c(!1);return}if(null!=n.inputElement){if(document.activeElement===n.inputElement||x||g){if(n.isOpen)return;s.HW&&console.log("Search: isOpen true"),c(!0);return}n.isOpen&&(s.HW&&console.log("Search: isOpen false"),c(!1))}},[x,g,n.inputElement,n.isOpen,c,u.isOpen]),(0,r.useEffect)(()=>{function e(e){e.ctrlKey&&"k"===e.key&&e.preventDefault()}function t(e){if(null!=n.inputElement&&e.ctrlKey&&"k"===e.key){if(e.preventDefault(),document.activeElement===n.inputElement){null==w||w.focus(),n.inputElement.blur();return}j(document.activeElement),n.inputElement.focus()}}return document.addEventListener("keydown",e),document.addEventListener("keyup",t),()=>{document.removeEventListener("keydown",e),document.removeEventListener("keyup",t)}},[w,n.inputElement]),(0,r.useEffect)(()=>{if(""===k){if(Object.keys(n.resultsDataArray).length<1)return;d({});return}k!==y&&(b(k),s.HW&&console.log("Search: Search for ".concat(k)),f.search(k).then(e=>{let t={};e.hits.forEach((e,n)=>{var l,r;let o=e._highlightResult.text.value,s=e.text,i=[];o.split("<em>").forEach(e=>{""!==e&&i.push(e.split("</em>")[0])});let a=new URLSearchParams;a.append("search",s),a.append("select",i.join(","));let u=a.toString();null!==(r=t[l=e.url_relative])&&void 0!==r||(t[l]=[]),t[e.url_relative].push({href:"".concat(e.url_relative,"?").concat(u),open:0===n,purifiedInnerHTML:m().sanitize(o)})}),d(t)}))},[y,k,n.resultsDataArray,d]),(0,r.useEffect)(()=>{Object.keys(n.resultsDataArray).length>0||h([0,0])},[n.resultsDataArray,h]),(0,l.jsxs)("form",{className:"w-full relative grid grid-flow-col [grid-template-columns:var(--height-topnav)_auto] items-center",onSubmit:function(t){if(t.preventDefault(),Object.keys(n.resultsDataArray).length<1)return;let[l,r]=n.resultsSelectedIndex,o=Object.values(n.resultsDataArray)[l][r].href;"string"==typeof o&&(e.push(o),null!=n.inputElement&&n.inputElement.blur())},children:[(0,l.jsx)("button",{type:"submit",tabIndex:t.indexGroup===s.m8?void 0:-1,children:(0,l.jsx)("i",{className:"p-1 icon-medium material-icons",children:"search"})}),(0,l.jsxs)("div",{className:"relative pr-1",children:[(0,l.jsx)("input",{name:"searchInput",className:"w-full px-4 py-1 rounded-2xl peer",type:"text",placeholder:"Search here...",ref:function(e){null==n.inputElement&&null!=e&&(s.HW&&console.log("Search: Initialize search input reference."),n.setInputElement(e))},onBlurCapture:function(){v(!1)},onChange:(0,i.OY)(function(e){let t=e.target;null!=t&&t.value!==k&&(s.HW&&console.log("Search: Update search query."),S(t.value))},300),onFocusCapture:function(){t.setIndexGroup(s.m8),v(!0)},tabIndex:t.indexGroup===s.m8?void 0:-1}),(0,l.jsxs)("div",{className:"absolute w-full lg:min-w-[600px] mt-1 bg-secondary shadow-md text-center hidden peer-focus:block hover:".concat(n.isOpen?"block":void 0),ref:function(e){null==n.resultsElement&&null!=e&&(s.HW&&console.log("Search: Initialize search results reference."),n.setResultsElement(e))},onMouseEnter:function(){E(!0)},onMouseLeave:function(){E(!1)},children:[Object.entries(n.resultsDataArray).map((e,t)=>{let[r,s]=e;return(0,l.jsxs)("div",{className:"text-left p-2 pl-5 text-xl",children:[(0,l.jsx)("header",{children:r}),s.map((e,r)=>(0,l.jsx)(o.default,{className:"grid items-center my-3 text-left min-h-10 p-2 px-4 mt-2 border rounded-2xl"+(t===n.resultsSelectedIndex[0]&&r===n.resultsSelectedIndex[1]?" bg-primary-active":" bg-primary"),href:e.href,children:(0,l.jsx)("div",{className:"*:bg-yellow-700 text-base",dangerouslySetInnerHTML:{__html:e.purifiedInnerHTML}})},"l-".concat(r)))]},"d-".concat(t))}),(0,l.jsxs)("div",{className:"flex flex-row flex-wrap justify-center lg:justify-end items-center mx-5 my-2",children:[(0,l.jsxs)("div",{className:"flex lg:hidden flex-col sm:flex-row items-center",children:[(0,l.jsxs)("div",{className:"inline-grid grid-flow-col justify-center px-2",children:[(0,l.jsx)("i",{className:"material-icons",children:"arrow_upward"}),(0,l.jsx)("i",{className:"material-icons",children:"arrow_downward"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to navigate"})]}),(0,l.jsxs)("div",{className:"inline-block px-2 text-center",children:[(0,l.jsx)("img",{className:"inline bg-white rounded-md p-1",src:"./icons/enter-arrow-svgrepo-com.svg",alt:"enter",height:"24px",width:"24px"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to select"})]}),(0,l.jsxs)("div",{className:"inline-block px-2",children:[(0,l.jsx)("img",{className:"inline bg-white rounded-md p-1",src:"./icons/esc-a-svgrepo-com.svg",alt:"escape",height:"24px",width:"24px"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to close"})]})]}),(0,l.jsxs)("div",{className:"",children:[(0,l.jsx)("p",{className:"inline-block p-1 text-xs",children:"Search by"}),(0,l.jsx)("img",{className:"inline-block h-5 ml-1",src:"./icons/Algolia-logo-white.svg",alt:"Algolia logo",height:20,width:"auto"})]})]})]})]}),(0,l.jsx)("div",{className:"absolute right-5 text-slate-300",children:"Ctrl + K"})]})}let x='a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"])';function v(){let{layoutState:e,sidenavState:t,topnavState:n}=a.s6.getState();s.HW&&console.log("Topnav: Toggle sidenav."),t.isOpen?document.activeElement===n.menuButtonElement&&e.setIndexGroup(s.m8):e.setIndexGroup(s.B0),t.setIsOpen(!t.isOpen)}function g(){let{layoutState:e,sidenavState:t,topnavState:n}=(0,a.s6)(),i=(0,r.useRef)(null),u=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(null!=n.menuButtonElement&&null!=u.current&&null!=c.current){if(t.isOpen){u.current.classList.add("hidden"),c.current.classList.remove("hidden");return}u.current.classList.remove("hidden"),c.current.classList.add("hidden")}},[t.isOpen,n.menuButtonElement]),(0,l.jsx)(l.Fragment,{children:(0,l.jsx)("nav",{className:"bg-background h-[--height-topnav] shadow-md",ref:e=>{null==n.element&&null!=e&&(s.HW&&console.log("Topnav: Initialize topbar reference."),n.setElement(e))},tabIndex:e.indexGroup===s.y8?0:-1,children:(0,l.jsxs)("div",{className:"h-[--height-topnav] lg:h-auto grid [grid-template-columns:20%_60%_20%] lg:[grid-template-columns:20%_1fr_410px] justify-items-center justify-between",children:[(0,l.jsxs)("div",{className:"grid grid-flow-col justify-self-start",children:[(0,l.jsxs)("button",{className:"h-[--height-topnav]",onPointerUp:v,ref:e=>{null==n.menuButtonElement&&null!=e&&(s.HW&&console.log("Topnav: Initialize menu reference."),n.setMenuButtonElement(e))},tabIndex:e.indexGroup===s.m8?void 0:-1,children:[(0,l.jsx)("i",{className:"p-1 icon-medium material-icons",ref:u,children:"menu"}),(0,l.jsx)("i",{className:"p-1 icon-medium material-icons hidden",ref:c,children:"close"})]}),(0,l.jsx)(o.default,{className:"block h-[--height-topnav]",href:"/home",ref:i,tabIndex:e.indexGroup===s.m8?void 0:-1,children:(0,l.jsx)("i",{className:"p-1 icon-medium material-icons",children:"home"})})]}),(0,l.jsx)(h,{}),(0,l.jsxs)("div",{className:"hidden lg:flex w-full px-5 justify-between items-center text-right",children:[(0,l.jsxs)("div",{className:"grid grid-flow-col justify-center",children:[(0,l.jsx)("i",{className:"material-icons rotate-90",children:"arrow_downward"}),(0,l.jsx)("i",{className:"material-icons rotate-90",children:"arrow_upward"}),(0,l.jsx)("i",{className:"material-icons",children:"arrow_upward"}),(0,l.jsx)("i",{className:"material-icons",children:"arrow_downward"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to navigate"})]}),(0,l.jsxs)("div",{className:"text-center",children:[(0,l.jsx)("img",{className:"inline bg-white rounded-md p-1",src:"./icons/enter-arrow-svgrepo-com.svg",alt:"enter",height:"24px",width:"24px"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to select"})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("img",{className:"inline bg-white rounded-md p-1",src:"./icons/esc-a-svgrepo-com.svg",alt:"escape",height:"24px",width:"24px"}),(0,l.jsx)("span",{className:"inline-block p-1 text-xs",children:"to go back"})]})]})]})})})}function E(e,t){if(null==e.contentElement||null==e.iconElement)return;if(s.HW&&console.log("Dropdown: isOpen ".concat(!e.isOpen)),e.isOpen){e.setIsOpen(!1),delete e.contentElement.dataset.active,console.log("deactivate"),e.contentElement.style.height="0",e.iconElement.style.transform="rotate(0deg)";return}e.setIsOpen(!0),e.contentElement.dataset.active="";let n=0;e.contentElement.childNodes.forEach(e=>{e instanceof HTMLAnchorElement&&(n+=e.offsetHeight)}),e.contentElement.style.height="".concat(n,"px"),e.iconElement.style.transform="rotate(-180deg)",t.setLastActiveDropdownElement(e.buttonElement)}function y(e){let{sidenavState:t}=(0,a.s6)(),n=a.oK[e.id](),o="a, button";return(0,r.useEffect)(()=>{s.HW&&console.log("Dropdown: isOpen ".concat(n.isOpen)),n.isOpen&&null!=t.lastActiveDropdownElement&&null!=n.buttonElement&&n.buttonElement!==t.lastActiveDropdownElement&&E(n,t)},[n,t]),(0,r.useEffect)(()=>{if(null!=n.buttonElement&&null!=n.contentElement&&null!=n.element){if(!t.isOpen){n.element.querySelectorAll(o).forEach(e=>{e instanceof HTMLElement&&(e.tabIndex=-1)});return}if(n.buttonElement.removeAttribute("tabIndex"),n.isOpen){n.contentElement.querySelectorAll(o).forEach(e=>{e.removeAttribute("tabIndex")});return}n.contentElement.querySelectorAll(o).forEach(e=>{e instanceof HTMLElement&&(e.tabIndex=-1)})}},[n.buttonElement,n.contentElement,n.element,n.isOpen,t.isOpen]),(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)("div",{className:e.className,ref:n.setElement,children:[(0,l.jsx)("button",{className:"block p-5 w-full text-left text-2xl",onPointerUp:()=>E(n,t),ref:n.setButtonElement,children:(0,l.jsxs)("div",{className:"grid grid-cols-2 items-center",children:[e.text,(0,l.jsx)("i",{ref:n.setIconElement,className:"icon-medium material-icons justify-self-end motion-safe:transition-all ease-out duration-300",children:"computer"})]})}),(0,l.jsx)("div",{className:"bg-background transition-all duration-300 ease-out overflow-y-hidden",ref:n.setContentElement,style:{height:0},children:e.children})]})})}var b=n(2926);let w='a:not([tabindex="-1"]), button:not([tabindex="-1"])';function j(){var e;let{layoutState:t,sidenavState:n,topnavState:l}=a.s6.getState();t.resetIndexGroup(),n.setIsOpen(!1),null===(e=l.element)||void 0===e||e.focus()}function k(){let{sidenavState:e,topnavState:t}=(0,a.s6)();return(0,r.useEffect)(()=>{let t=e.element;if(null!=t){if(t.style.transition="transform 0.5s ease-out 0s",e.isOpen){t.style.transform="translateX(".concat(t.offsetWidth,"px)");return}t.style.transform="translateX(0)"}},[e.element,e.isOpen]),(0,r.useEffect)(()=>{let n=0,l=0,r=(e,t)=>e*e+t*t,o=e=>{n=e.screenX,l=e.screenY},i=o=>{!(r(o.screenX-n,o.screenY-l)>81||!e.isOpen||null==e.element||e.element.contains(o.target))&&null!=t.menuButtonElement&&(t.menuButtonElement.contains(o.target)||(s.HW&&console.log("Sidenav: Clicked outside. Close sidenav."),j()))};return document.addEventListener("pointerdown",o),document.addEventListener("pointerup",i),()=>{document.removeEventListener("pointerdown",o),document.removeEventListener("pointerup",i)}},[e.element,e.isOpen,t.menuButtonElement]),(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)("nav",{className:"fixed w-[min(500px,70vw)] h-[calc(100vh-var(--height-topnav))] left-[max(-500px,-70vw)] bg-background shadow-lg shadow-neutral-950 leading-10 overflow-y-auto overflow-x-hidden scrollbar-stable z-[100]",ref:t=>{null==e.element&&null!=t&&(s.HW&&console.log("Sidenav: Initialize sidenav reference."),e.setElement(t))},children:[(0,l.jsx)("hr",{}),(0,l.jsx)(o.default,{className:"block pl-4 py-[2px]",href:"/image_examples",tabIndex:e.isOpen?void 0:-1,...(0,b.e)(()=>j()),children:"Image Examples"}),(0,l.jsx)("hr",{}),(0,l.jsx)(o.default,{className:"block pl-4 py-[2px]",href:"/form_examples",tabIndex:e.isOpen?void 0:-1,...(0,b.e)(()=>j()),children:"Form Examples"}),(0,l.jsx)("hr",{}),(0,l.jsx)(o.default,{className:"block pl-4 py-[2px]",href:"/back_end_examples",tabIndex:e.isOpen?void 0:-1,...(0,b.e)(()=>j()),children:"Back-End Examples"}),(0,l.jsx)("hr",{}),(0,l.jsxs)(y,{id:0,text:"Dropdown 1",children:[(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 3"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 4"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 5"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 6"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 7"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 8"})]}),(0,l.jsx)("hr",{}),(0,l.jsxs)(y,{id:1,text:"Dropdown 2",children:[(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 9"}),(0,l.jsx)(o.default,{href:"#",className:"block pl-8 py-[2px]",children:"Link 10"})]}),(0,l.jsx)("hr",{})]})})}var S=n(6542);let A='a:not([tabindex="-1"]), button:not([tabindex="-1"]), div[tabindex="0"], input:not([tabindex="-1"]), img[tabindex="0"], summary:not([tabindex="-1"])';function O(e){let{children:t}=e,{layoutState:n,mainState:o,searchState:i,sidenavState:u}=(0,a.s6)(),{setIsActive:c}=o,d=(0,p.useSearchParams)(),m=(0,S.useDrag)(e=>{let{movement:[t,n],last:l}=e,r=u.element;if(null!=r&&!(t>-10)&&!(Math.abs(n)>Math.abs(t))){if(!l){r.style.transition="transform 0s ease";let e=r.offsetWidth+t;r.style.transform="translateX(".concat(e,"px)");return}if(s.HW&&console.log("Sidenav: Pan gesture has ended."),t<-.5*r.offsetWidth){u.setIsOpen(!1);return}r.style.transition="transform 0.5s ease-out 0s",r.style.transform="translateX(".concat(r.offsetWidth,"px)")}},{eventOptions:{capture:!0},enabled:u.isOpen})();return(0,r.useEffect)(()=>{c(!u.isOpen&&!i.isOpen)},[i.isOpen,c,u.isOpen]),(0,r.useEffect)(()=>{if(null!=o.element){if(o.isActive){delete o.element.dataset.inactive;return}o.element.dataset.inactive=""}},[o.element,o.isActive]),(0,r.useEffect)(()=>{var e,t;let n=null===(e=d.get("search"))||void 0===e?void 0:e.replaceAll(/[\n\r\t]/g,"");if(null==n)return;let l=Array.from(document.querySelectorAll(s.FC)).reduce((e,t)=>(t instanceof HTMLElement&&(t.innerText.replaceAll(/[\n\r\t]/g,"")===n||t.innerHTML.replaceAll(/[\n\r\t]/g,"")===n)&&e.push(t),e),[]);if(l.length<1){s.HW&&console.log('Main: No element found for search params "'.concat(n,'".'));return}s.HW&&console.log("Main: Found element from search params.");let r=l[0];r.focus();let o=r.closest("details");null!=o&&o.setAttribute("open","");let i=null===(t=d.get("select"))||void 0===t?void 0:t.split(","),a=window.getSelection();if(null!=i&&null!=a){a.removeAllRanges();let e=function e(t){return null==t.firstChild?t:e(t.firstChild)}(r);i.forEach(t=>{if(null==e||null==e.textContent)return;let n=e.textContent.toLowerCase().indexOf(t.toLowerCase());if(-1===n)return;let l=document.createRange();if(a.rangeCount<1){l.setStart(e,n),l.setEnd(e,n+t.length),a.addRange(l);return}l.setEnd(e,n+t.length),a.extend(e,l.endOffset)})}},[d]),(0,l.jsx)(l.Fragment,{children:(0,l.jsx)("main",{...m,className:"h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none",ref:function(e){null==o.element&&null!=e&&(s.HW&&console.log("Main: Initialize main reference."),o.setElement(e))},tabIndex:n.indexGroup===s.Qf?0:-1,children:t})})}function N(e){let{children:t}=e;return(0,r.useEffect)(()=>(document.addEventListener("pointerup",i.mE),()=>{document.removeEventListener("pointerup",i.mE)}),[]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("div",{className:"sticky top-0 z-[100]",children:[(0,l.jsx)("header",{children:(0,l.jsx)(g,{})}),(0,l.jsx)("aside",{children:(0,l.jsx)(k,{})})]}),(0,l.jsx)(r.Suspense,{children:(0,l.jsx)(O,{children:t})})]})}var I=n(1705),D=function(e){let{children:t}=e,n=(0,a.s6)(),o=(0,p.useRouter)(),u=(0,r.useRef)();return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)("html",{lang:"en",children:[(0,l.jsxs)("head",{children:[(0,l.jsx)("meta",{name:"theme-color",content:"#000000"}),(0,l.jsx)("meta",{name:"description",content:"Web site created using create-react-app"}),(0,l.jsx)("title",{children:"React App"}),(0,l.jsx)("link",{rel:"icon",href:"./icons/favicon.ico"}),(0,l.jsx)("link",{rel:"apple-touch-icon",href:"./icons/logo192.png"}),(0,l.jsx)("link",{rel:"manifest",href:"./manifest.json"})]}),(0,l.jsxs)("body",{className:"w-full bg-background [color:--color-text] [font-size:100%] [font-family:Helvetica,Arial,sans-serif]",onKeyDown:function(e){if(null!=u.current){n.keyboardState.setEvent(e),e.preventDefault(),e.stopPropagation();return}n.keyboardState.setEvent(e),function e(t){let n=a.s6.getState(),{layoutState:l,mainState:r,topnavState:c}=n,d=n.keyboardState.event;if(null==d)return;let m=null;if(document.activeElement instanceof HTMLBodyElement){var p,f;("Enter"===d.key||"ArrowRight"===d.key||"ArrowDown"===d.key)&&(d.preventDefault(),d.stopPropagation(),null===(p=r.element)||void 0===p||p.focus(),m=!1),("Escape"===d.key||"ArrowLeft"===d.key||"ArrowUp"===d.key)&&(d.preventDefault(),d.stopPropagation(),null===(f=c.element)||void 0===f||f.focus(),m=!1)}if(null!=m||null!=(m=function(e){var t,n,l,r,o,u;let{layoutState:c,mainState:d,topnavState:m}=a.s6.getState();if(null==d.element||!d.element.contains(document.activeElement))return null;if(console.log("main"),c.indexGroup===s.y8)return"ArrowUp"===e.key&&(null===(n=d.element)||void 0===n?void 0:n.scrollTop)===0?(e.preventDefault(),e.stopPropagation(),null===(l=m.element)||void 0===l||l.focus(),!1):"Enter"===e.key?(e.preventDefault(),e.stopPropagation(),c.setIndexGroup(s.Qf),setTimeout(()=>(0,i.pf)(d.element,A),1),!1):null;if((null===(t=document.activeElement)||void 0===t?void 0:t.tagName)==="SUMMARY"){if("ArrowRight"===e.key)return e.preventDefault(),e.stopPropagation(),null===(r=document.activeElement.parentElement)||void 0===r||r.setAttribute("open",""),!1;if("ArrowLeft"===e.key)return e.preventDefault(),e.stopPropagation(),null===(o=document.activeElement.parentElement)||void 0===o||o.removeAttribute("open"),!1}return"Escape"===e.key?(e.preventDefault(),c.resetIndexGroup(),null===(u=d.element)||void 0===u||u.focus(),!1):"ArrowDown"===e.key?(console.log("prevent"),e.preventDefault(),e.stopPropagation(),(0,i.zT)((0,i.pf)(d.element,A)),!0):"ArrowUp"===e.key?(e.preventDefault(),e.stopPropagation(),(0,i.zT)((0,i.Sw)(d.element,A)),!0):null}(d))||null!=(m=function(e,t,n){let{dropdownMenuStateArray:l,layoutState:r,sidenavState:o,topnavState:u}=t;if(null==o.element||!o.element.contains(document.activeElement))return null;for(let t=0;t<l.length;++t){let n=function(e,t){var n,l;if(null==e.element||!(null===(n=e.element)||void 0===n?void 0:n.contains(document.activeElement)))return null;let r=a.px.getState();if(document.activeElement===e.buttonElement){if("Enter"===t.key||"ArrowRight"===t.key&&!e.isOpen)return t.preventDefault(),t.stopPropagation(),E(e,r),(0,i.mE)(t),!1;"ArrowLeft"===t.key&&e.isOpen&&(0,i.mE)(t)}return"ArrowLeft"===t.key&&e.isOpen?(console.log("hello3"),t.preventDefault(),t.stopPropagation(),E(e,r),null===(l=e.buttonElement)||void 0===l||l.focus(),!0):null}(l[t],e);if(console.log("is key input repeating "+n),null!=n)return n}if("Escape"===e.key)return e.preventDefault(),e.stopPropagation(),j(),!1;if(e.target instanceof HTMLAnchorElement&&"Enter"===e.key)return e.preventDefault(),e.stopPropagation(),n.push(e.target.href),(0,i.mE)(e),j(),!1;if("ArrowDown"===e.key)return e.preventDefault(),e.stopPropagation(),function(e){var t;let{sidenavState:n,topnavState:l}=e,r=l.menuButtonElement;if(null==r)return;let o=n.element;if(null==o)return;let s=document.activeElement;if(null==s)return;let i=[r,...Array.from(o.querySelectorAll(w))],a=Math.min(i.indexOf(s)+1,i.length-1);null===(t=i[a])||void 0===t||t.focus()}(t),!0;if("ArrowUp"===e.key)return e.preventDefault(),e.stopPropagation(),console.log("focus previous element"),function(e){var t;let{sidenavState:n,topnavState:l}=e,r=l.menuButtonElement;if(null==r)return;let o=n.element;if(null==o)return;let s=document.activeElement;if(null==s)return;let i=[r,...Array.from(o.querySelectorAll(w))],a=Math.max(i.indexOf(s)-1,0);null===(t=i[a])||void 0===t||t.focus()}(t),!0;if("ArrowLeft"===e.key){var c;return console.log("sidenav arrow left"),e.preventDefault(),e.stopPropagation(),r.setIndexGroup(s.m8),o.setIsOpen(!1),null===(c=u.menuButtonElement)||void 0===c||c.focus(),!1}return null}(d,n,o))||null!=(m=function(e){var t,n,l,r;let{layoutState:o,mainState:u,sidenavState:c,topnavState:d}=a.s6.getState();if(null==d.element||!d.element.contains(document.activeElement))return null;if(o.indexGroup===s.y8)return"ArrowDown"===e.key?(e.preventDefault(),e.stopPropagation(),null===(t=u.element)||void 0===t||t.focus(),!0):"Enter"===e.key?(e.preventDefault(),e.stopPropagation(),o.setIndexGroup(s.m8),null===(n=d.menuButtonElement)||void 0===n||n.focus(),!1):null;let m=function(e){let{searchState:t,topnavState:n}=a.s6.getState();if(null==t.inputElement||!t.inputElement.contains(document.activeElement))return null;if("ArrowLeft"===e.key||"ArrowRight"===e.key)return e.preventDefault(),null;if(Object.keys(t.resultsDataArray).length<1)return null;let[l,r]=t.resultsSelectedIndex;if("ArrowDown"===e.key){let n=Object.values(t.resultsDataArray)[l];return null==n?(s.HW&&(console.log("Search-Warning: Entry array could not be found."),console.log("Search-Warning: dataArray ".concat(Object.values(t.resultsDataArray))),console.log("Search-Warning: keyIndex ".concat(l))),!1):(r<n.length-1?(e.preventDefault(),t.setResultsSelectedIndex([l,r+1])):l<Object.keys(t.resultsDataArray).length-1&&(e.preventDefault(),t.setResultsSelectedIndex([l+1,0])),!0)}if("ArrowUp"===e.key){if(r>0)e.preventDefault(),t.setResultsSelectedIndex([l,r-1]);else if(l>0){let n=Object.values(t.resultsDataArray)[l-1];if(null==n)return s.HW&&(console.log("Search-Warning: Entry array could not be found."),console.log("Search-Warning: dataArray ".concat(Object.values(t.resultsDataArray))),console.log("Search-Warning: (keyIndex - 1) ".concat(l-1))),!1;e.preventDefault(),t.setResultsSelectedIndex([l-1,n.length-1])}return!0}return null}(e);if(null!=m)return m;if("Escape"===e.key)return e.preventDefault(),e.stopPropagation(),o.resetIndexGroup(),c.setIsOpen(!1),null===(l=d.element)||void 0===l||l.focus(),!1;if(document.activeElement===d.menuButtonElement){if("Enter"===e.key)return e.preventDefault(),e.stopPropagation(),(0,i.mE)(e),v(),!1;if("ArrowDown"===e.key){if(e.preventDefault(),e.stopPropagation(),!c.isOpen)return v(),!0;let t=null===(r=c.element)||void 0===r?void 0:r.querySelector("a, button");return null==t||t.focus(),!0}if(("ArrowLeft"===e.key||"ArrowUp"===e.key)&&c.isOpen)return e.preventDefault(),e.stopPropagation(),v(),(0,i.mE)(e),!1;if("ArrowRight"===e.key&&c.isOpen)return e.preventDefault(),e.stopPropagation(),v(),(0,i.mE)(e),!0}return document.activeElement===d.homeLinkElement&&"Enter"===e.key?((0,i.mE)(e),!0):"ArrowLeft"===e.key?(e.preventDefault(),e.stopPropagation(),function(){let e=a.oV.getState().element;if(null==e)return;let t=document.activeElement;if(null==t)return;let n=Array.from(e.querySelectorAll(x)),l=Math.max(n.indexOf(t)-1,0),r=n[l];null==r||r.focus()}(),!0):"ArrowRight"===e.key?(e.preventDefault(),e.stopPropagation(),function(){let e=a.Rp.getState(),t=a.oV.getState().element;if(null==t)return;let n=document.activeElement;if(null==n)return;let l=Array.from(t.querySelectorAll(x)),r=Math.min(l.indexOf(n)+1,l.length-1),o=l[r];null!=e.resultsElement&&e.resultsElement.contains(o)||null==o||o.focus()}(),!0):null}(d))){u.current=setTimeout(()=>{e()},m?null!=t?t:s.Ol:s.hh);return}}(s.AM)},onKeyUp:function(){n.keyboardState.setEvent(null),clearTimeout(u.current),u.current=void 0},children:[(0,l.jsx)("noscript",{children:"You need to enable JavaScript to run this app."}),(0,l.jsx)(r.StrictMode,{children:(0,l.jsx)(I.Z,{theme:s.$_,children:(0,l.jsx)(N,{children:t})})})]})]})})}},2944:function(e,t,n){"use strict";n.d(t,{OY:function(){return s},Sw:function(){return a},mE:function(){return c},pf:function(){return i},zT:function(){return u}});var l=n(3130),r=n(5033);let o=function(e){return e instanceof HTMLAnchorElement||e instanceof HTMLButtonElement?e:null==e.parentElement?null:o(e.parentElement)};function s(e,t){let n;return function(){for(var l=arguments.length,o=Array(l),s=0;s<l;s++)o[s]=arguments[s];clearTimeout(n),r.HW&&console.log("EventConstants: Clear debounce timer."),n=window.setTimeout(()=>{e.apply(window,o)},t)}}function i(e,t){if(null==e)return null;let n=document.activeElement;if(null==n)return null;let l=Array.from(e.querySelectorAll(t)),r=Math.min(l.indexOf(n)+1,l.length-1),o=l[r];return null==o||o.focus(),o}function a(e,t){if(null==e)return null;let n=document.activeElement;if(null==n)return null;let l=Array.from(e.querySelectorAll(t)),r=Math.max(l.indexOf(n)-1,0),o=l[r];return null==o||o.focus(),o}function u(e){null==e||e.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})}function c(e){let t=e.target;if(null==t)return;let n=o(t);if(null==n)return;let r=n.style.backgroundColor,s=(0,l.Z)(n.style.backgroundColor);n.animate({backgroundColor:[r,s.brighten(50).toString(),r]},300)}},5033:function(e,t,n){"use strict";n.d(t,{$_:function(){return l},AM:function(){return d},B0:function(){return c},FC:function(){return r},HW:function(){return o},Ol:function(){return p},Qf:function(){return a},d6:function(){return s},hh:function(){return m},m8:function(){return u},y8:function(){return i}});let l=(0,n(4444).Z)({palette:{mode:"dark"}}),r="h1, h2, h3, li, label",o=!0,s="https://example-3-b52da596edfb.herokuapp.com",i="default",a="main",u="topnav",c="sidenav",d=400,m=2147483647,p=100},2926:function(e,t,n){"use strict";n.d(t,{e:function(){return s}});var l=n(6542);let r=0,o=0;function s(e){return(0,l.useGesture)({onPointerDown:e=>{let{event:t}=e;r=t.clientX,o=t.clientY},onPointerUp:e=>{let{event:t,args:n}=e,l=t.clientX-r,s=t.clientY-o;l*l+s*s>100||n[0](t)}})(e)}},1199:function(e,t,n){"use strict";n.d(t,{E_:function(){return a},Rp:function(){return c},oK:function(){return o},oV:function(){return m},px:function(){return d},s6:function(){return s}});var l=n(9099),r=n(5033);let o=[void 0,void 0].map(()=>(0,l.Ue)(e=>({buttonElement:null,setButtonElement:t=>e(()=>({buttonElement:t})),contentElement:null,setContentElement:t=>e(()=>({contentElement:t})),element:null,setElement:t=>e(()=>({element:t})),iconElement:null,setIconElement:t=>e(()=>({iconElement:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t}))})));function s(){return{dropdownMenuStateArray:o.map(e=>e()),keyboardState:i(),layoutState:a(),mainState:u(),searchState:c(),sidenavState:d(),topnavState:m()}}s.getState=function(){return{dropdownMenuStateArray:o.map(e=>e.getState()),keyboardState:i.getState(),layoutState:a.getState(),mainState:u.getState(),searchState:c.getState(),sidenavState:d.getState(),topnavState:m.getState()}};let i=(0,l.Ue)(e=>({event:null,setEvent:t=>e(()=>({event:t}))})),a=(0,l.Ue)((e,t)=>({_previousIndexGroup:r.y8,indexGroup:r.y8,setIndexGroup:t=>e(e=>(r.HW&&console.log("Layout: indexGroup ".concat(t)),e._previousIndexGroup=e.indexGroup,{indexGroup:t})),resetIndexGroup:()=>e(()=>(r.HW&&console.log("Layout: indexGroup ".concat(r.y8)),{indexGroup:r.y8})),restorePreviousIndexGroup:()=>e(e=>(r.HW&&console.log("Layout: indexGroup ".concat(e._previousIndexGroup)),{indexGroup:e._previousIndexGroup}))})),u=(0,l.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),isActive:!0,setIsActive:t=>e(()=>({isActive:t}))})),c=(0,l.Ue)(e=>({inputElement:null,setInputElement:t=>e(()=>({inputElement:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t})),resultsDataArray:{},setResultsDataArray:t=>e(()=>({resultsDataArray:t})),resultsElement:null,setResultsElement:t=>e(()=>({resultsElement:t})),resultsSelectedIndex:[0,0],setResultsSelectedIndex:t=>e(()=>({resultsSelectedIndex:t}))})),d=(0,l.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t})),lastActiveDropdownElement:null,setLastActiveDropdownElement:t=>e(()=>({lastActiveDropdownElement:t}))})),m=(0,l.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),homeLinkElement:null,setHomeLinkElement:t=>e(()=>({homeLinkElement:t})),menuButtonElement:null,setMenuButtonElement:t=>e(()=>({menuButtonElement:t}))}))},7712:function(){}},function(e){e.O(0,[708,731,138,29,207,766,971,23,744],function(){return e(e.s=9547)}),_N_E=e.O()}]);