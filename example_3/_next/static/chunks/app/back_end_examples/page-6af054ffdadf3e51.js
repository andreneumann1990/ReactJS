(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[863],{5904:function(e,s,t){Promise.resolve().then(t.bind(t,7961))},7961:function(e,s,t){"use strict";t.r(s);var n=t(4419),a=t(4782),r=t(1989),l=t(9933),i=t(3709),c=t(6239),o=t(9045),d=t(9520);s.default=function(){let[e,s]=(0,c.useState)(""),[t,u]=(0,c.useState)({}),m=(0,i.TA)({initialValues:{username:"",password:""},validationSchema:o.Ry({username:o.Z_().required("Required."),password:o.Z_().required("Required.")}),onSubmit:async e=>{let{username:s,password:t}=e,n=await fetch("".concat(d.d6,"/user/submit"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:s,password:t})});u(await n.json())}});return(0,c.useEffect)(()=>{fetch("".concat(d.d6,"/greeting")).then(e=>{(async function(){s(await e.text())})()}).catch(()=>{})},[]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h1",{className:"my-3 text-3xl font-bold",children:"Back-End Examples"}),(0,n.jsx)("h2",{className:"my-1 text-xl font-bold",children:"GET requests:"}),(0,n.jsx)("ul",{className:"*:my-2 pl-10",children:""==e?(0,n.jsx)("li",{children:"no response yet"}):(0,n.jsx)("li",{children:"Back-End: <".concat(e,">")})}),(0,n.jsx)("h2",{className:"my-1 text-xl font-bold",children:"POST requests:"}),(0,n.jsx)("ul",{className:"*:my-2 pl-10",children:null==t.username?(0,n.jsx)("li",{children:"no response yet"}):Object.entries(t).map((e,s)=>{let[t,a]=e;return(0,n.jsx)("li",{children:"Back-End: <".concat(t,", ").concat(a,">")},s)})}),(0,n.jsxs)(a.Z,{component:"form",sx:{"& .MuiTextField-root":{m:1,width:"25ch"}},noValidate:!0,autoComplete:"off",onSubmit:m.handleSubmit,children:[(0,n.jsxs)("div",{className:"flex flex-wrap m-2",children:[(0,n.jsx)(r.Z,{error:m.touched.username&&null!=m.errors.username,helperText:m.errors.username,required:!0,label:"Username",type:"text",autoComplete:"username",variant:"filled",...m.getFieldProps("username")}),(0,n.jsx)(r.Z,{required:!0,label:"Password",type:"password",autoComplete:"current-password",variant:"filled",...m.getFieldProps("password")})]}),(0,n.jsx)("div",{className:"inline-block mx-4",children:(0,n.jsx)(l.Z,{className:"m-2",type:"submit",variant:"contained",children:"Submit"})})]})]})}}},function(e){e.O(0,[680,726,370,687,819,40,107,744],function(){return e(e.s=5904)}),_N_E=e.O()}]);