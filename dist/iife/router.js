(()=>{var v=Object.defineProperty;var c=(t,e)=>v(t,"name",{value:e,configurable:!0});var m=c((t,e)=>{t.parentNode.replaceChild(e,t)},"app");var d,h=k(),P=c(t=>{let e=document.createElement("a");e.setAttribute("href",t),d(e)},"redirect"),S=c(t=>{t.preventDefault(),d(t.currentTarget)},"to"),g=c(t=>e=>{let r=c(n=>{e.removeEventListener("click",r),f({options:t,event:n})},"handler");e.addEventListener("click",r),e.click()},"click");function L(t){let e=h.set(t,document.location.pathname);return d=g(t),E(t),w({match:e,path:l(document.location),isPopState:!1}),m(document.getElementById(e.id||t.id||"app"),e.view(e.params)),{view:e.view||t.view}}c(L,"router");function E(t){document.addEventListener("popstate",e=>f({options:t,event:e}))}c(E,"popState");function f({options:t={},event:e}){let r=e.currentTarget,n=h.set(t,r.attributes.href.value);e.preventDefault(),w({match:n,path:l(r)||l(document.location),isPopState:e.type==="popstate"}),m(document.getElementById(n.id||t.id||"app"),n.view(n.params))}c(f,"render");function l(t){return t.pathname+(t.search||t.hash)}c(l,"setPath");function w({match:t,path:e,isPopState:r}){let n=t.title(t.params)||document.title;r||window.history.pushState({},n,e),document.title=n}c(w,"setTitle");function k(){let t=new Map,e=c(()=>{},"noop");return{set(r,n){if(!t.has(n)){let s="",i,o=Object.keys(r),u=o.length;for(let a=0;a<u&&(s=o[a],i=x(n,o[a]),!i);a=a+1);let p=r[s];t.set(n,{...p,params:i,title:p.title||e,view:p.view||e})}return t.get(n)}}}c(k,"storeMatcher");function x(t,e){let r,n=/:([^/]+)/,s=[];for(;r=e.match(n);)e=e.replace(n,"([^?/]+)"),s.push(r[1]);let i=new RegExp(`^${e}(\\?(.*)|$)`,"i"),o=t.match(i);if(o)return s.reduce((u,p,a)=>(u[p]=o[a+1],u),{})}c(x,"addMatch");})();