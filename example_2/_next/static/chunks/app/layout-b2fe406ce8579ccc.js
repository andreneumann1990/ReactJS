(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{5287:function(e,n,t){Promise.resolve().then(t.bind(t,912))},912:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return E}});var r=t(7437);t(4888);var l=t(2265),i=function(){return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("div",{})})},s=t(703),o=t(8792),a=function(e){let{text:n,children:t}=e,i=(0,l.useRef)(null),s=(0,l.useRef)(null),a=(0,l.useRef)(null),[c,u]=(0,l.useState)(!1),d=m(e=>e.isOpen),f=m(e=>e.lastActiveDropdownElement),h=m(e=>e.setLastActiveDropdownElement),p=(0,l.useCallback)(()=>{if(null===i.current||null===s.current||null===a.current)return;if(v&&console.log("Dropdown: isOpen ".concat(!c)),c){u(!1),i.current.classList.remove("active"),s.current.classList.add("hidden"),s.current.classList.remove("active"),s.current.style.height="0",a.current.style.transform="rotate(0deg)";return}let e=0;s.current.childNodes.forEach(n=>{n instanceof HTMLAnchorElement&&(e+=n.offsetHeight)}),u(!0),i.current.classList.add("active"),s.current.classList.remove("hidden"),s.current.classList.add("active"),s.current.style.height="".concat(e,"px"),a.current.style.transform="rotate(-180deg)",h(i.current)},[c,h]);return(0,l.useEffect)(()=>{v&&console.log("Dropdown: isOpen ".concat(c)),c&&null!=f&&null!=i.current&&i.current!==f&&p()},[c,f,p]),(0,l.useEffect)(()=>{if(null==s.current||null==i.current)return;if(!d){i.current.querySelectorAll("a").forEach(e=>{e.tabIndex=-1});return}let e=i.current.querySelector("a");if(null!=e&&(e.tabIndex=100),c){s.current.querySelectorAll("a").forEach(e=>{e.tabIndex=100});return}s.current.querySelectorAll("a").forEach(e=>{e.tabIndex=-1})},[c,d]),(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{ref:i,className:"mobile-dropdown-menu",children:[(0,r.jsx)(o.default,{href:"#",onPointerUp:p,onKeyUp:function(e){if("Enter"===e.key||"ArrowRight"===e.key&&!c){e.preventDefault(),e.stopPropagation(),p(),j(e);return}if("ArrowLeft"===e.key&&c){e.preventDefault(),e.stopPropagation(),p();return}},children:(0,r.jsxs)("div",{className:"grid grid-dropdown",children:[n,(0,r.jsx)("i",{ref:a,className:"icon-medium material-icons grid-fit-right",children:"computer"})]})}),(0,r.jsx)("div",{ref:s,className:"mobile-dropdown-content hidden",onKeyUp:function(e){if(null!=i.current&&"ArrowLeft"===e.key&&c){e.preventDefault(),e.stopPropagation(),p();let n=i.current.querySelector("a");null!=n&&n.focus();return}},children:t})]})})},c=t(2020),u=t(3551);let d=(0,c.Ue)(e=>({element:null,setElement:n=>e(()=>({element:n}))}));function f(e){let{children:n}=e,t=d(e=>e.element),l=d(e=>e.setElement),i=m(e=>e.element),s=m(e=>e.isOpen),o=m(e=>e.setIsOpen),a=(0,u.useDrag)(e=>{let{movement:[n,t],last:r}=e;if(null!=i&&!(n>-10)&&!(Math.abs(t)>Math.abs(n))){if(!r){i.style.transition="transform 0s ease";let e=i.offsetWidth+n;i.style.transform="translateX(".concat(e,"px)");return}if(v&&console.log("Sidenav: Pan gesture has ended."),n<-.5*i.offsetWidth){o(!1);return}i.style.transition="transform 0.5s ease-out 0s",i.style.transform="translateX(".concat(i.offsetWidth,"px)")}},{eventOptions:{capture:!0},enabled:s});return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("main",{className:"flex flex-col justify-between h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-gutter-stable-both transition-colors ease-out duration-300",ref:e=>{null==t&&null!=e&&(v&&console.log("Layout: Initialize main reference."),l(e))},...a(),tabIndex:1,children:[(0,r.jsx)("div",{children:n}),(0,r.jsx)("div",{children:(0,r.jsx)("footer",{className:"border grid content-center h-32",children:(0,r.jsx)("h1",{className:"text-center text-xl",children:"Footer"})})})]})})}let m=(0,c.Ue)(e=>({element:null,setElement:n=>e(()=>({element:n})),isOpen:!1,setIsOpen:n=>e(()=>({isOpen:n})),lastActiveDropdownElement:null,setLastActiveDropdownElement:n=>e(()=>({lastActiveDropdownElement:n}))}));function h(){let e=d(e=>e.element),n=m(e=>e.element),t=m(e=>e.setElement),i=m(e=>e.isOpen),s=m(e=>e.setIsOpen),c=p(e=>e.menuButtonElement);return(0,l.useEffect)(()=>{if(null!=n&&null!=e){if(n.style.transition="transform 0.5s ease-out 0s",v&&console.log("Sidenav: isOpen ".concat(i)),i){(()=>{if(null!=n)for(let e in n.children){let t=n.children[e];"A"===t.tagName&&(t.tabIndex=100)}})(),e.classList.add("inactive"),n.style.transform="translateX(".concat(n.offsetWidth,"px)");return}(()=>{if(null!=n)for(let e in n.children){let t=n.children[e];"A"===t.tagName&&(t.tabIndex=-1)}})(),e.classList.remove("inactive"),n.style.transform="translateX(0)"}},[i,e,n]),(0,l.useEffect)(()=>{let e=0,t=0,r=(e,n)=>e*e+n*n,l=n=>{e=n.screenX,t=n.screenY},o=l=>{!(r(l.screenX-e,l.screenY-t)>81||!i||null==n||n.contains(l.target))&&null!=c&&(c.contains(l.target)||(v&&console.log("Sidenav: Clicked outside. Close sidebar."),s(!1)))};return document.addEventListener("pointerdown",l),document.addEventListener("pointerup",o),()=>{document.removeEventListener("pointerdown",l),document.removeEventListener("pointerup",o)}},[i,c,s,n]),(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("nav",{ref:e=>{null==n&&null!=e&&(v&&console.log("Sidenav: Initialize reference."),t(e))},className:"mobile-sidebar",tabIndex:-1,onKeyUp:function(e){if(v&&console.log("Sidenav: Handle key inputs."),"Enter"===e.key){e.preventDefault(),e.stopPropagation(),j(e);return}if("ArrowDown"===e.key){e.preventDefault(),e.stopPropagation(),function(){if(null==c||null==n)return;let e=document.activeElement;if(null==e)return;let t=[c,...Array.from(n.querySelectorAll('a[tabindex="100"]'))],r=(t.indexOf(e)+1)%t.length,l=t[r];null!=l&&l!==c&&l.focus()}();return}if("ArrowUp"===e.key){e.preventDefault(),e.stopPropagation(),function(){if(null==c||null==n)return;let e=document.activeElement;if(null==e)return;let t=[c,...Array.from(n.querySelectorAll('a[tabindex="100"]'))],r=(t.indexOf(e)-1+t.length)%t.length,l=t[r];null!=l&&l.focus()}();return}if("ArrowLeft"===e.key&&i){e.preventDefault(),e.stopPropagation(),s(!1),setTimeout(()=>{null!=c&&c.focus()},500);return}},children:[(0,r.jsx)("hr",{}),(0,r.jsx)(o.default,{href:"/image_examples",onClick:function(){s(!1)},children:"Image Examples"}),(0,r.jsx)("hr",{}),(0,r.jsx)(o.default,{href:"#",children:"Link 2"}),(0,r.jsx)("hr",{}),(0,r.jsxs)(a,{text:"Dropdown 1",children:[(0,r.jsx)(o.default,{href:"#",children:"Link 3"}),(0,r.jsx)(o.default,{href:"#",children:"Link 4"}),(0,r.jsx)(o.default,{href:"#",children:"Link 5"}),(0,r.jsx)(o.default,{href:"#",children:"Link 6"}),(0,r.jsx)(o.default,{href:"#",children:"Link 7"}),(0,r.jsx)(o.default,{href:"#",children:"Link 8"})]}),(0,r.jsx)("hr",{}),(0,r.jsxs)(a,{text:"Dropdown 2",children:[(0,r.jsx)(o.default,{href:"#",children:"Link 9"}),(0,r.jsx)(o.default,{href:"#",children:"Link 10"})]}),(0,r.jsx)("hr",{})]})})}let p=(0,c.Ue)(e=>({element:null,setElement:n=>e(()=>({element:n})),menuButtonElement:null,setMenuButtonElement:n=>e(()=>({menuButtonElement:n}))}));function x(){let e=d(e=>e.element),n=m(e=>e.element),t=m(e=>e.isOpen),a=m(e=>e.setIsOpen),c=p(e=>e.element),u=p(e=>e.setElement),f=p(e=>e.menuButtonElement),h=p(e=>e.setMenuButtonElement),x=(0,l.useCallback)(()=>{if(null==f||null==c)return;let e=document.activeElement;if(null==e)return;let n=[f,...Array.from(c.querySelectorAll('a[tabindex="1000"]'))],t=(n.indexOf(e)+1)%n.length,r=n[t];null!=r&&r!==f&&r.focus()},[f,c]),g=(0,l.useCallback)(()=>{if(null==f||null==c)return;let e=document.activeElement;if(null==e||e===f)return;let n=[f,...Array.from(c.querySelectorAll('a[tabindex="1000"]'))],t=(n.indexOf(e)-1+n.length)%n.length,r=n[t];null!=r&&r.focus()},[f,c]),y=(0,l.useCallback)(()=>{v&&console.log("Topnav: Toggle sidebar."),a(!t)},[t,a]),E=(0,l.useCallback)(r=>{if(null!=e&&null!=f&&null!=n){if(document.activeElement===f){if("Enter"===r.key){r.preventDefault(),r.stopPropagation(),y(),j(r);return}if("ArrowDown"===r.key){if(t){r.preventDefault(),r.stopPropagation();let e=n.querySelector("a");if(null==e)return;e.focus();return}r.preventDefault(),r.stopPropagation(),y(),j(r);return}if(("ArrowLeft"===r.key||"ArrowUp"===r.key)&&t){r.preventDefault(),r.stopPropagation(),y(),j(r);return}}if("ArrowLeft"===r.key){r.preventDefault(),r.stopPropagation(),g();return}if("ArrowRight"===r.key){r.preventDefault(),r.stopPropagation(),x();return}}},[x,g,t,e,f,n,y]);return(0,l.useEffect)(()=>{if(null==f||f.children.length<2)return;let e=f.children[0],n=f.children[1];if(t){e.classList.add("hidden"),n.classList.remove("hidden");return}e.classList.remove("hidden"),n.classList.add("hidden")},[t,f]),(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("nav",{ref:e=>{null==c&&null!=e&&(v&&console.log("Topnav: Initialize topbar reference."),u(e))},className:"mobile-topbar",children:(0,r.jsxs)("div",{className:"grid grid-topbar fg-items-center-main fg-space-between",onKeyUp:E,children:[(0,r.jsxs)("div",{className:"grid grid-flow-col",children:[(0,r.jsxs)(o.default,{className:"",ref:e=>{null==f&&null!=e&&(v&&console.log("Topnav: Initialize menu reference."),h(e))},onPointerUp:y,href:"#",tabIndex:2,children:[(0,r.jsx)("i",{className:"icon-medium material-icons",children:"menu"}),(0,r.jsx)("i",{className:"icon-medium material-icons hidden",children:"close"})]}),(0,r.jsx)(o.default,{className:"",href:"/home",tabIndex:1e3,children:(0,r.jsx)("i",{className:"icon-medium material-icons",children:"home"})})]}),(0,r.jsx)(i,{}),(0,r.jsx)(s.default,{src:"/svg/Algolia-mark-rounded-blue.svg",alt:"Algolia logo",height:40,width:40,priority:!1})]})})})}var g=t(7180);let v=!0,j=function(e){let n=e.target;if(null==n)return;let t=function(e){return e instanceof HTMLAnchorElement?e:null==e.parentElement?null:t(e.parentElement)},r=t(n);if(null==r)return;let l=r.style.backgroundColor,i=(0,g.Z)(r.style.backgroundColor);r.animate({backgroundColor:[l,i.brighten(50).toString(),l]},300)};function y(e){let{children:n}=e;(0,l.useEffect)(()=>{let e=function(e){if("Enter"!==e.key)return;let n=e.target;null!=n&&"A"===n.tagName&&(v&&console.log("Layout: Enter pressed on anchor element."),j(e))};return document.addEventListener("pointerup",j),document.addEventListener("keypress",e),()=>{document.removeEventListener("pointerup",j),document.removeEventListener("keypress",e)}},[]);let[t,i]=(0,l.useState)(!0);return((0,l.useEffect)(()=>i(!1),[]),t)?(0,r.jsx)(r.Fragment,{}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"mobile sticky",children:[(0,r.jsx)("header",{children:(0,r.jsx)(x,{})}),(0,r.jsx)("aside",{children:(0,r.jsx)(h,{})})]}),(0,r.jsx)(f,{children:n})]})}function E(e){let{children:n}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("html",{lang:"en",children:[(0,r.jsxs)("head",{children:[(0,r.jsx)("meta",{name:"theme-color",content:"#000000"}),(0,r.jsx)("meta",{name:"description",content:"Web site created using create-react-app"}),(0,r.jsx)("title",{children:"React App"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"}),(0,r.jsx)("link",{rel:"apple-touch-icon",href:"/logo192.png"}),(0,r.jsx)("link",{rel:"manifest",href:"/manifest.json"})]}),(0,r.jsxs)("body",{children:[(0,r.jsx)("noscript",{children:"You need to enable JavaScript to run this app."}),(0,r.jsx)("div",{id:"root",children:(0,r.jsx)(l.StrictMode,{children:(0,r.jsx)(y,{children:n})})})]})]})})}},4888:function(){}},function(e){e.O(0,[703,270,971,69,744],function(){return e(e.s=5287)}),_N_E=e.O()}]);