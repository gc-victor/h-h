(()=>{var Z=Object.defineProperty;var f=(s,c)=>Z(s,"name",{value:c,configurable:!0});var G=f((s,c)=>{s.parentNode.replaceChild(c,s)},"app");function T(s){return s.currentTarget.__handler__[s.type](s)}f(T,"handler");function O(s,c,_,i){let v=document.activeElement,d=document.body,N=s.length,p=c.length,t=N,l=0,r=0,a=[],m=[];for(;l<p||r<t;)if(p===l)for(;r<t;){let e=s[r],n=e.parentNode,o=i.indexOf(n);o!==-1&&(_[o].insertBefore(e,c[l]),a.push(e)),r++}else if(t===r)for(;l<p;){let e=c[l],n=e.parentNode,o=_.includes(e);n&&!o&&(n.removeChild(e),m.push(e)),l++}else if(c[l].isEqualNode(s[r]))l++,r++;else if(c[p-1].isEqualNode(s[t-1]))p--,t--;else{let e=c[l],n=s[r],o=e.parentNode,h=n.parentNode,u=a.includes(h),g=m.includes(o),y=_.includes(e),E=i.includes(n),M=e.tagName===n.tagName,$=Boolean(o&&o.parentNode);if(!u||!g||y&&E)if(!y&&!E&&M&&$&&!a.includes(h.parentNode))!i.includes(h)&&!_.includes(o)&&!d.contains(h)?(o.parentNode.replaceChild(h,o),a.push(h),a.push(n),m.push(o),m.push(e)):d.contains(n)||(o.replaceChild(n,e),a.push(n),m.push(e)),l++,r++;else if(y&&E&&M){let q=e.attributes,A=n.attributes,J=q.length,R=A.length,U=Object.keys(A);for(let w=J-1;w>=0;w--){let k=q[w].name;!U.includes(k)&&k!=="type"&&e.removeAttribute(k)}for(let w=0;w<R;w++){let k=A[w].name,C=A[w].value;e.setAttribute(k,C)}if(!e.__handler__&&n.__handler__){let w=Object.keys(n.__handler__||{}),k=w.length;for(let C=0;C<k;C++)n.removeEventListener(w[C],T),e.addEventListener(w[C],T)}e===v&&!n.children.length&&n.childNodes.length&&n.childNodes[0].nodeType===3&&(e.textContent=n.textContent),e.__handler__=n.__handler__,a.push(n),m.push(e),l++,r++}else!y&&E?r++:y&&!E?l++:(l++,r++);else u&&!g?r++:!u&&g?l++:y&&!E&&d.contains(n)?r++:y&&!E&&!d.contains(n)?(o.insertBefore(n,e),a.push(n),r++):!y&&E?(o.removeChild(e),m.push(e),l++):!E&&!y&&$?(o.replaceChild(n,e),a.push(n),m.push(e),l++,r++):(l++,r++)}}f(O,"patchTrees");function K(s,c){let _=s.parentNode,i=document.activeElement;if(i&&i.tagName!=="BODY"&&s.contains(i)){let{p:v,n:d,pAncestry:N,nActiveElement:p,nAncestry:t}=z(s,c,i);if(!p)_.replaceChild(c,s);else return O(d,v,N,t),s}else _.replaceChild(c,s);return c}f(K,"patch");function z(s,c,_){let i=t(s),v=t(c),d=l(i[0],_),N=v.find(r=>{let a=_.__key__,m=r.__key__,e=_.getAttribute("name"),n=r.getAttribute("name");return a&&m&&a===m||e&&n&&e===n||!a&&_.isEqualNode(r)}),p=N&&l(v[0],N);return{p:i,n:v,pAncestry:d,nActiveElement:N,nAncestry:p};function t(r){let a=document.createTreeWalker(r,NodeFilter.SHOW_ELEMENT),m=[],e=a.currentNode;for(;e;)m.push(e),e=a.nextNode();return m}function l(r,a){let m=[];for(;a&&a!==r;){let e=a;m.push(e),a=e.parentNode}return m.push(r),m}}f(z,"doubleTree");var B=typeof global!="undefined"&&{}.toString.call(global)==="[object global]";B||(window.process={env:{TEST:!1}});var j=process.env.TEST?!1:B;var W,H=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window!="undefined"?window:global):s=>(W||(W=Promise.resolve())).then(s).catch(c=>setTimeout(()=>{throw c},0));var I={value:1},P=new Set,L=new Map,b=new Map,x=new Map,S=new Map,F=new Map;function le(s){return()=>c.bind(null,`__${I.value++}__`);function c(_,i={}){let v=f(()=>{},"noop"),d=i&&i.key?i.key+_:_,N=new Set,p,t=v;function l(e,n){let o=f(h=>{x.set(e,h);let u=a();!j&&p&&(u=K(p,u)),p=u},"setState");return x.has(e)||x.set(e,n),[()=>x.get(e),o]}f(l,"update");function r(e,n,o){let h=!o,u=x.get(e),g=u?!o.every((y,E)=>JSON.stringify(y)===JSON.stringify(u[E])):!0;(h||g)&&(x.set(e,o),n(o))}return f(r,"execute"),p=a();function a(){let e=0,n={},o=s({cleanup:u=>t=u||t,execute:(u,g)=>{let y=`execute${d}${e++}`;return N.add(y),r(y,u,g)},key:d,props:i,ref:u=>n.fn=u,update:u=>{let g=`update${d}${e++}`;return N.add(g),l(g,u)}}),h=b.get(d);return n.fn&&n.fn(o,h),!j&&o?(o.__key__=o.__key__||d,b.forEach(function(u,g){let y=L.get(g)||[];u&&!(b.get(g)&&!b.get(g).parentNode)&&o.contains(u)&&!y.includes(d)&&g!==d&&(L.set(d,[...y,g]),P.add(g))}),b.set(d,o),S.set(d,N),F.set(d,t)):b.get(d)&&!o&&H(()=>t&&m()),o}f(a,"renderComponent");function m(){let e=[...L.get(d)||[d]],n=e.length;for(let o=0;o<n;o++)if(b.get(_)){let h=e[o];F.get(h)(b.get(h)),b.set(h,1),P.has(h)||(S.get(h).forEach(u=>x.delete(u)),S.delete(h),b.delete(h)),P.delete(h),L.delete(h)}t=null,p=null}f(m,"onCleanup")}}f(le,"component");var Y=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;function ue(s,c={},_=[]){let i=s==="svg"&&!j?document.createElementNS("http://www.w3.org/2000/svg","svg"):document.createElement(s),v=Object.keys(c||{}),d=v.length,N=_.length;for(let p=0;p<N;p++){let t=_[p];t&&s==="svg"?i.innerHTML=`${i.innerHTML}${t.outerHTML}`:t&&i.appendChild(typeof t=="string"?document.createTextNode(t):t)}for(let p=0;p<d;p++){let t=v[p];if(!j&&t&&/^on/.test(t)){let l=t.toLowerCase().substring(2);i.__handler__=i.__handler__||{},i.__handler__[l]=c[t],i.addEventListener(l,T)}if(t&&!/^key$/.test(t)&&!/^on/.test(t)&&!/^ref$/.test(t)){let l=t==="className"?"class":"",r=t==="htmlFor"?"for":"",a=Y.test(t)&&t.replace(/[A-Z0-9]/,"-$&").toLowerCase();(t!=="checked"||t==="checked"&&c[t])&&i.setAttribute(r||l||a||t,c[t])}t&&/^key$/.test(t)&&(i.__key__=c[t])}return i}f(ue,"h");})();
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
