(self.webpackChunkmhrdamage=self.webpackChunkmhrdamage||[]).push([[517],{517:(e,t,o)=>{o.r(t),o.d(t,{konamiCode:()=>m,loadCacheState:()=>v,saveCache:()=>f,setSaveDisplays:()=>b,toClipboardNoFocus:()=>r});var n=o(38),c=o(102),l=o(16),a=o(923);window.saveDebouncer=0;const r=e=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)};let d=[38,38,40,40,37,39,37,39,97,98,13],s=0;function m(e){(0,n.rA)(e);const t=window.thisKey.types.maxLevel,o=Object.entries(t).sort();document.querySelector("#EquippedSkillDisplay>output").innerHTML=createSkillDisplay(o,(e=>e.replace(/(?<=[a-z])([A-Z])(?![A-Z])/g," $1"))),Object.values(document.querySelectorAll(`select.${e},#dango select`)).forEach((e=>e.selectedIndex=e.childElementCount-1)),Object.values(document.querySelectorAll("#boxes .check")).forEach((e=>e.checked=!0)),console.log("Konami Code entered!")}document.addEventListener("keydown",(function(e){e.keyCode===d[s]?(s++,s===d.length&&(m(document.getElementById("dropWeaponType").value),s=0)):s=0}));const u=e=>Object.values(document.querySelectorAll(e)).map((e=>e.selectedIndex)),i=e=>Object.values(document.querySelectorAll(e)).map((e=>e.checked?1:0)),p="#dropWeaponType,#dropWeapon",y="#helm,#chest,#waist,#arm,#leg",h=".augmentType",S=".augment",g="#charmSlots select",w=`select:not(${p},${y},.augmentType,.augment,#dropMon2,#dropHZV2,#dropSkills,#charmSlots select)`,E=".check:not(label)",x=document.querySelector("#statsEffective").children;function b(e,t){e[0].src=`./icons/${document.getElementById("dropWeaponType").options[t.weapon[0]].text}.webp`,e[1].textContent=t.display[0],e[2].src=`./icons/${t.display[1]}webp`,e[3].textContent=t.display[2]}function f(){let e=localStorage.getItem("index")||0,t={weapon:u(p),armor:u(y),augmentType:u(h),augment:u(S),monster:[(0,a.yh)("dropMonster2"),(0,a.AN)("dropHZV2")],remainingSelects:u(w),charmLimiters:u(g),checkBoxes:i(E),setSearch:Object.values(document.querySelectorAll("#skillSelect label")).map((e=>[window.thisKey.skillIds[e.textContent],+e.nextElementSibling.textContent.slice(-1)])),display:[x[2].textContent,x[3].src.match(/\w+\./)[0],x[4].textContent]};localStorage.setItem(e,JSON.stringify(t)),b(document.querySelectorAll(`#saveState${e} ~ *`),t)}function v(e=0){let t=localStorage.getItem("index");document.getElementById(`saveState${t}`).textContent="Equip Build",document.getElementById(`saveState${e}`).textContent="Current Build",localStorage.setItem("index",e);const o=JSON.parse(localStorage.getItem(e)||"[]");if(Array.isArray(o))return;(0,n.Dw)(o.monster[0]),(0,a.sM)("dropHZV2",o.monster[1]),(0,a.sM)("dropWeaponType",o.weapon[0]);let r="";window.thisKey[(0,a.yh)("dropWeaponType")].weapons.forEach(((e,t)=>{10===e.rank&&(r+=`<option value="${t}">${e.weapon}</option>`)})),document.getElementById("dropWeapon").innerHTML=r,(0,a.sM)("dropWeapon",o.weapon[1]);let d=document.querySelector("#weapon > img");d.src=d.src.replace(/(\w+)\.webp$/,`${(0,a.yh)("dropWeaponType")}.webp`),(0,n.rA)(),(0,n.E_)(),document.querySelectorAll(g).forEach(((e,t)=>{e.selectedIndex=o.charmLimiters[t]})),Object.values(document.querySelectorAll(y)).forEach(((e,t)=>{e.selectedIndex=o.armor[t],(0,c.M9)(e.id)})),document.querySelectorAll(h).forEach(((e,t)=>{e.selectedIndex=o.augmentType[t],(0,l.jA)(e),e.nextElementSibling.selectedIndex=o.augment[t]})),(0,a.VW)().forEach((e=>(0,l.sC)(e))),document.querySelectorAll(w).forEach(((e,t)=>{e.selectedIndex=o.remainingSelects[t]})),(0,l.to)(),document.querySelectorAll(E).forEach(((e,t)=>{e.checked=o.checkBoxes[t]})),o.setSearch.forEach((e=>(0,n.Nb)(window.thisKey.skillIds[e[0]],e[1]))),(0,n.TG)()}document.body.addEventListener("change",(()=>{performance.now()>5e3&&f()})),document.body.addEventListener("click",(()=>{performance.now()>5e3&&f()})),Object.values(document.querySelectorAll(".load")).forEach((e=>e.addEventListener("click",(e=>{v(e.target.id.slice(-1))}))))}}]);