(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[863],{1730:function(e,t,n){Promise.resolve().then(n.bind(n,6580))},6580:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return q}});var r=n(7437),o=n(3950),a=n(2988),i=n(2265),l=n(4839),u=n(6259),s=n(2272),c=n(8024),p=n(8510),d=n(9261),m=n(909),h=n(261),x=n(4535),f=n(7542);function y(e){return(0,f.ZP)("MuiTypography",e)}(0,x.Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);let g=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],v=e=>{let{align:t,gutterBottom:n,noWrap:r,paragraph:o,variant:a,classes:i}=e,l={root:["root",a,"inherit"!==e.align&&"align".concat((0,s.Z)(t)),n&&"gutterBottom",r&&"noWrap",o&&"paragraph"]};return(0,u.Z)(l,y,i)},b=(0,c.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.variant&&t[n.variant],"inherit"!==n.align&&t["align".concat((0,s.Z)(n.align))],n.noWrap&&t.noWrap,n.gutterBottom&&t.gutterBottom,n.paragraph&&t.paragraph]}})(e=>{let{theme:t,ownerState:n}=e;return(0,a.Z)({margin:0},"inherit"===n.variant&&{font:"inherit"},"inherit"!==n.variant&&t.typography[n.variant],"inherit"!==n.align&&{textAlign:n.align},n.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},n.gutterBottom&&{marginBottom:"0.35em"},n.paragraph&&{marginBottom:16})}),S={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},E={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},Z=e=>E[e]||e,w=i.forwardRef(function(e,t){let n=(0,p.Z)({props:e,name:"MuiTypography"}),i=Z(n.color),u=(0,h.Z)((0,a.Z)({},n,{color:i})),{align:s="inherit",className:c,component:d,gutterBottom:m=!1,noWrap:x=!1,paragraph:f=!1,variant:y="body1",variantMapping:E=S}=u,w=(0,o.Z)(u,g),j=(0,a.Z)({},u,{align:s,color:i,className:c,component:d,gutterBottom:m,noWrap:x,paragraph:f,variant:y,variantMapping:E}),k=d||(f?"p":E[y]||S[y])||"span",G=v(j);return(0,r.jsx)(b,(0,a.Z)({as:k,ref:t,ownerState:j,className:(0,l.Z)(G.root,c)},w))});function j(e){return(0,f.ZP)("MuiLink",e)}let k=(0,x.Z)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]);var G=n(5166),I=n(317);let B={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},C=e=>B[e]||e;var N=e=>{let{theme:t,ownerState:n}=e,r=C(n.color),o=(0,G.DW)(t,"palette.".concat(r),!1)||n.color,a=(0,G.DW)(t,"palette.".concat(r,"Channel"));return"vars"in t&&a?"rgba(".concat(a," / 0.4)"):(0,I.Fq)(o,.4)};let A=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant","sx"],M=e=>{let{classes:t,component:n,focusVisible:r,underline:o}=e,a={root:["root","underline".concat((0,s.Z)(o)),"button"===n&&"button",r&&"focusVisible"]};return(0,u.Z)(a,j,t)},O=(0,c.ZP)(w,{name:"MuiLink",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t["underline".concat((0,s.Z)(n.underline))],"button"===n.component&&t.button]}})(e=>{let{theme:t,ownerState:n}=e;return(0,a.Z)({},"none"===n.underline&&{textDecoration:"none"},"hover"===n.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===n.underline&&(0,a.Z)({textDecoration:"underline"},"inherit"!==n.color&&{textDecorationColor:N({theme:t,ownerState:n})},{"&:hover":{textDecorationColor:"inherit"}}),"button"===n.component&&{position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"},["&.".concat(k.focusVisible)]:{outline:"auto"}})}),P=i.forwardRef(function(e,t){let n=(0,p.Z)({props:e,name:"MuiLink"}),{className:u,color:s="primary",component:c="a",onBlur:h,onFocus:x,TypographyClasses:f,underline:y="always",variant:g="inherit",sx:v}=n,b=(0,o.Z)(n,A),{isFocusVisibleRef:S,onBlur:E,onFocus:Z,ref:w}=(0,d.Z)(),[j,k]=i.useState(!1),G=(0,m.Z)(t,w),I=(0,a.Z)({},n,{color:s,component:c,focusVisible:j,underline:y,variant:g}),C=M(I);return(0,r.jsx)(O,(0,a.Z)({color:s,className:(0,l.Z)(C.root,u),classes:f,component:c,onBlur:e=>{E(e),!1===S.current&&k(!1),h&&h(e)},onFocus:e=>{Z(e),!0===S.current&&k(!0),x&&x(e)},ref:G,ownerState:I,variant:g,sx:[...Object.keys(B).includes(s)?[]:[{color:s}],...Array.isArray(v)?v:[v]]},b))});var R=n(1326),_=n(3909),W=n(6548),D=n(9381),F=n(4245),T=n(5033),L=n(1199),q=function(){let e=(0,L.E_)(),[t,n]=(0,i.useState)(""),[o,a]=(0,i.useState)({});function l(){e.setIndexGroup(T.Qf)}let u=(0,D.TA)({initialValues:{username:"",password:""},validationSchema:F.Ry({username:F.Z_().required("Required."),password:F.Z_().required("Required.")}),onSubmit:async e=>{let{username:t,password:n}=e,r=await fetch("".concat(T.d6,"/user/submit"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,password:n})});a(await r.json())}});return(0,i.useEffect)(()=>{fetch("".concat(T.d6,"/greeting")).then(e=>{(async function(){n(await e.text())})()}).catch(()=>{})},[]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("h1",{className:"my-3 text-3xl font-bold",children:"Back-End Examples"}),(0,r.jsx)("ul",{className:"*:my-2 pl-10",children:(0,r.jsxs)("li",{children:["Link:\xa0",(0,r.jsx)(P,{className:"text-blue-300",href:T.d6,onFocusCapture:l,tabIndex:e.indexGroup===T.Qf?void 0:-1,children:T.d6})]})}),(0,r.jsx)("h2",{className:"my-1 text-xl font-bold",children:"GET requests:"}),(0,r.jsx)("ul",{className:"*:my-2 pl-10",children:""===t?(0,r.jsx)("li",{children:"no response yet"}):(0,r.jsx)("li",{children:"Back-End: <".concat(t,">")})}),(0,r.jsx)("h2",{className:"my-1 text-xl font-bold",children:"POST requests:"}),(0,r.jsx)("ul",{className:"*:my-2 pl-10",children:null==o.username?(0,r.jsx)("li",{children:"no response yet"}):Object.entries(o).map((e,t)=>{let[n,o]=e;return(0,r.jsx)("li",{children:"Back-End: <".concat(n,", ").concat(o,">")},t)})}),(0,r.jsxs)(R.Z,{component:"form",sx:{"& .MuiTextField-root":{m:1,width:"25ch"}},noValidate:!0,autoComplete:"off",onSubmit:u.handleSubmit,children:[(0,r.jsxs)("div",{className:"flex flex-wrap m-2",children:[(0,r.jsx)(_.Z,{...u.getFieldProps("username"),autoComplete:"username",error:u.touched.username&&null!=u.errors.username,helperText:u.errors.username,inputProps:{onFocusCapture:l,tabIndex:e.indexGroup===T.Qf?void 0:-1},label:"Username",required:!0,type:"text",variant:"filled"}),(0,r.jsx)(_.Z,{...u.getFieldProps("password"),autoComplete:"current-password",inputProps:{onFocusCapture:l,tabIndex:e.indexGroup===T.Qf?void 0:-1},label:"Password",required:!0,type:"password",variant:"filled"})]}),(0,r.jsx)("div",{className:"inline-block mx-4",children:(0,r.jsx)(W.Z,{className:"m-2",onFocusCapture:l,tabIndex:e.indexGroup===T.Qf?void 0:-1,type:"submit",variant:"contained",children:"Submit"})})]})]})}},5033:function(e,t,n){"use strict";n.d(t,{$_:function(){return r},AM:function(){return p},B0:function(){return c},FC:function(){return o},HW:function(){return a},Ol:function(){return m},Qf:function(){return u},d6:function(){return i},hh:function(){return d},m8:function(){return s},y8:function(){return l}});let r=(0,n(4444).Z)({palette:{mode:"dark"}}),o="h1, h2, h3, li, label",a=!0,i="https://example-3-b52da596edfb.herokuapp.com",l="default",u="main",s="topnav",c="sidenav",p=400,d=2147483647,m=100},1199:function(e,t,n){"use strict";n.d(t,{E_:function(){return u},Rp:function(){return c},oK:function(){return a},oV:function(){return d},px:function(){return p},s6:function(){return i}});var r=n(9099),o=n(5033);let a=[void 0,void 0].map(()=>(0,r.Ue)(e=>({buttonElement:null,setButtonElement:t=>e(()=>({buttonElement:t})),contentElement:null,setContentElement:t=>e(()=>({contentElement:t})),element:null,setElement:t=>e(()=>({element:t})),iconElement:null,setIconElement:t=>e(()=>({iconElement:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t}))})));function i(){return{dropdownMenuStateArray:a.map(e=>e()),keyboardState:l(),layoutState:u(),mainState:s(),searchState:c(),sidenavState:p(),topnavState:d()}}i.getState=function(){return{dropdownMenuStateArray:a.map(e=>e.getState()),keyboardState:l.getState(),layoutState:u.getState(),mainState:s.getState(),searchState:c.getState(),sidenavState:p.getState(),topnavState:d.getState()}};let l=(0,r.Ue)(e=>({event:null,setEvent:t=>e(()=>({event:t}))})),u=(0,r.Ue)((e,t)=>({_previousIndexGroup:o.y8,indexGroup:o.y8,setIndexGroup:t=>e(e=>(o.HW&&console.log("Layout: indexGroup ".concat(t)),e._previousIndexGroup=e.indexGroup,{indexGroup:t})),resetIndexGroup:()=>e(()=>(o.HW&&console.log("Layout: indexGroup ".concat(o.y8)),{indexGroup:o.y8})),restorePreviousIndexGroup:()=>e(e=>(o.HW&&console.log("Layout: indexGroup ".concat(e._previousIndexGroup)),{indexGroup:e._previousIndexGroup}))})),s=(0,r.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),isActive:!0,setIsActive:t=>e(()=>({isActive:t}))})),c=(0,r.Ue)(e=>({inputElement:null,setInputElement:t=>e(()=>({inputElement:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t})),resultsDataArray:{},setResultsDataArray:t=>e(()=>({resultsDataArray:t})),resultsElement:null,setResultsElement:t=>e(()=>({resultsElement:t})),resultsSelectedIndex:[0,0],setResultsSelectedIndex:t=>e(()=>({resultsSelectedIndex:t}))})),p=(0,r.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),isOpen:!1,setIsOpen:t=>e(()=>({isOpen:t})),lastActiveDropdownElement:null,setLastActiveDropdownElement:t=>e(()=>({lastActiveDropdownElement:t}))})),d=(0,r.Ue)(e=>({element:null,setElement:t=>e(()=>({element:t})),homeLinkElement:null,setHomeLinkElement:t=>e(()=>({homeLinkElement:t})),menuButtonElement:null,setMenuButtonElement:t=>e(()=>({menuButtonElement:t}))}))}},function(e){e.O(0,[731,29,743,971,23,744],function(){return e(e.s=1730)}),_N_E=e.O()}]);