(self.webpackChunkmhrdamage=self.webpackChunkmhrdamage||[]).push([[517,975],{517:(e,t,o)=>{o.r(t),o.d(t,{konamiCode:()=>f,loadState:()=>d,saveState:()=>c});var n=o(975),l=o(552);const s=e=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)};let i=document.getElementById("dropWeapon").value,r=document.getElementById("dropWeaponType").value,a=()=>{let e="";window.info[r].weapons.forEach(((t,o)=>{t.rank<10||(e+=`<option value="${o}">${t.weapon}</option>`)})),document.getElementById("dropWeapon").innerHTML=e};function c(){const e=[i.selectedIndex,r.selectedIndex];document.querySelectorAll("#skillSelect label").forEach((t=>{e.push([t.textContent,+t.nextElementSibling.textContent.slice(-1)])})),s(JSON.stringify([[e],Object.values(document.querySelectorAll("section.armorDisplay")).map((e=>[].concat(Object.values(e.querySelectorAll(".armor,select.augmentType,select.augment")).map((e=>e.selectedIndex)),Object.values(e.querySelectorAll("select.armorDisplay")).map((e=>e.selectedIndex)))))]))}function d(){navigator.clipboard.readText().then((async e=>{const t=JSON.parse(e),o=await t.shift()[0];document.getElementById("dropWeaponType").selectedIndex=await o.shift(),await(0,l.rA)(),await a(),document.getElementById("dropWeapon").selectedIndex=await o.shift(),await(0,l.E_)(),await o.forEach((e=>(0,l.Nb)(e[0],e[1]))),(0,n.getSetBuilds)(15)}))}document.getElementById("saveState").addEventListener("click",(()=>c())),document.getElementById("loadState").addEventListener("click",(()=>d()));let u=[38,38,40,40,37,39,37,39,97,98,13],m=0;function f(e){(0,l.rA)(e);const t=window.info.types.maxLevel,o=Object.entries(t).sort();document.querySelector("#EquippedSkillDisplay>output").innerHTML=function(e,t){let o="";for(const[n,l]of e){let e="Active",s=["Active","Inactive"];if("Dereliction"===n)s=["Lvl-3","Inactive","Lvl-1","Lvl-2"],e=s[0];else if("Fortify"===n)s=["Inactive","Lvl-1","Lvl-2"],e=s[0];else if("Frostcraft"===n){switch(l){case 1:s=["Lvl-1","Inactive"];break;case 2:s=["Lvl-2","Lvl-1","Inactive"];break;default:s=["Lvl-3","Lvl-2","Lvl-1","Inactive"]}e=s[0]}else"Strife"===n&&(s=["High","Low","Inactive"],e=s[0]);o+=`<button type="button" aria-pressed="false" data-state="0" onclick='let states = ${JSON.stringify(s)}; let index = (parseInt(this.dataset.state) + 1) % states.length; this.textContent = states[index]; this.dataset.state = index;'>${e}</button><output>${t(n)}: ${l}</output>`}return o}(o,(e=>e.replace(/(?<=[a-z])([A-Z])(?![A-Z])/g," $1"))),Object.values(document.querySelectorAll(`select.${e},#dango select`)).forEach((e=>e.selectedIndex=e.childElementCount-1)),Object.values(document.querySelectorAll("#boxes .check")).forEach((e=>e.checked=!0)),console.log("Konami Code entered!")}document.addEventListener("keydown",(function(e){e.keyCode===u[m]?(m++,m===u.length&&(f(document.getElementById("dropWeaponType").value),m=0)):m=0}))},975:(e,t,o)=>{o.r(t),o.d(t,{getSetBuilds:()=>w,getSkillReq:()=>y,testBuild:()=>B});var n=o(16),l=o(552),s=o(923);const i=(e=window.info.types)=>{const t={},o={};return document.querySelectorAll("#searcherSkills>div>output").forEach((n=>{const l=n.className.split(" ")[1];t[l]=-n.textContent.match(/(?<=Lv-)\d/)[0],o[l]={lvl:e.decos[l]??5,lvl4:e.lvl4[l]??0,qurious:~~((e.qurious[l]??(window.info.charms[l]||e.decos[l]?30:60))/3)},5===o[l].lvl&&o[l].qurious>5&&(window.info.charms[l]?(o.charmNeeded||(o.charmNeeded={}),o.charmNeeded[l]=-t[l],o.charmSkillPoints=window.info.charms[l][0][0]):(o.setBonus||(o.setBonus={}),o.setBonus[l]=-t[l]))})),{skills:Object.fromEntries(Object.entries(t).sort(((e,t)=>o[t[0]].lvl-o[e[0]].lvl||o[e[0]].qurious-o[t[0]].qurious))),skillInfo:o}};let r={};const a=document.getElementById("dropWeapon"),c=document.getElementById("dropWeaponType");let d=0,u=0,m=[];var f=0;let h=0,p=new Map,g=!window.location.origin.includes("github"),k=0;const S=e=>{const t=[];for(let o of e)for(let e of o.charm)t.push(`${e[0][0]}: ${e[0][1]} & ${e[1][0]}: ${e[1][1]}`);return t},y=(e=[])=>(document.querySelectorAll(".buildSkills>div>.skill").forEach((t=>{t.selectedIndex>0&&e.push([t.id,t.selectedIndex])})),e),v=(e,t)=>e>=t?e:t;function E(){for(let e=0;e<5;e++)m[e]=new Worker("./setBuildWorker.js");m.forEach((e=>{e.addEventListener("message",(e=>{--h,e.data.final.sets.length&&(d+=e.data.final.count.combos,k+=e.data.final.count.sets,p.size<100&&(e=>{for(const t of e){if(p.size<100){p.set(p.size,t);const e=S(t.usedSkills);let o='<button type="button" aria-pressed="false" class="equipBuild">Equip Build</button>';const n=Object.keys(t.usedSkills[0].augments);for(let e=0;e<5;e++)o+=`<output class="armorImg ${(0,s.VW)()[e]}"></output><span>${n[e]}</span>`;let l="";e.forEach((e=>{l+=`<option value="${e}">${e}</option>`})),o+=`<output class="armorImg charm"></output><select class="armorCharm" title="charmSkill1">${l}</select>`;const i=document.createElement("div");i.classList.add("setResult"),i.innerHTML+=o,o="",document.querySelector(".grid").appendChild(i)}let e=0;for(let t of p.values())t.count&&(e+=t.count);document.getElementById("setOutput").textContent=`Displayed ${Math.min(100,p.size)} Builds / ${e.toLocaleString()} Combinations`}})(e.data.final.sets));let t=e.data.final.stats;for(let e=0;e<4;e++)r.remainingSlots[e]=v(r.remainingSlots[e]||0,t.remainingSlots[e]);for(let e=0;e<5;e++)r.quriousSkills[e]=v(r.quriousSkills[e]||0,t.quriousSkills[e]);for(const[e,o]of Object.entries(t.armorSkills))r.armorSkills[e]=v(r.armorSkills[e]||0,o);h||((e=>{let t="";e.forEach((e=>{0!=e[1]&&(t+=`<button textContent="${e[0]}">${e[0].replace(/(?<=[a-z])([A-Z])(?![A-Z])/g," $1")} +${+e[1]}</button>`)})),document.getElementById("temp")&&document.getElementById("temp").remove(),document.querySelector(".extraSkills").innerHTML+=t,document.getElementById("extraOutput").textContent=`Found ${k.toLocaleString()} Builds / ${d.toLocaleString()} Combinations`,window.location.href.includes("github")||(console.log((performance.now()-u)/1e3),console.log(p))})(((e=window.info.types)=>{const{skills:t}=i(),{armorSkills:o,remainingSlots:n,quriousSkills:l}=r;for(let t=0;t<4;++t)if(n[t])for(const[l,s]of Object.entries(e.decoLevels[t]))o[l]=Math.max(o[l]||0,s*n[t]);Object.entries(e.qurious).forEach((([e,t])=>{l[t/3-1]&&(o[e]=Math.max(o[e]||0,l[t/3-1]))}));const s=[];return Object.entries(o).forEach((([o,n])=>{if(isNaN(o))if(t[o]+ +n>0&&e.maxLevel[o]>0){const l=(e.maxLevel[o]||window.info.skills[o].length-1)+t[o];s.push([o,Math.min(+n,l)])}else t[o]||!e.maxLevel[o]&&!window.info.skills[o]||s.push([o,Math.min(+n,e.maxLevel[o]||window.info.skills[o].length-1)])})),s.sort()})()),d||(document.getElementById("setOutput").textContent="No Results Found",document.querySelectorAll(".grid>div").forEach((e=>e.remove()))))}))}))}const w=(e=10)=>{if((h||g)&&(u=performance.now(),m.length))for(let e of m)e.terminate();h=5,E();const t=i();t.charmSlots=window.info[c.value].weapons[a.value].decos.slice(),document.querySelectorAll(".charmSlot").forEach((e=>{e.selectedIndex>0&&++t.charmSlots[e.selectedIndex-1]})),t.theseCharms={charms:{},charmSkills:{},skill1Names:[],skill2Names:[]};for(let e of Object.entries(t.skills))if(window.info.charms[e[0]]){t.theseCharms.charmSkills[e[0]]=window.info.charms[e[0]];for(let o=0;o<2;++o)(window.info.charms[e[0]][o][0]<=-e[1]&&(!window.info.types.qurious[e[0]]||!window.info.types.decos[e[0]])||-e[1]>2-o&&window.info.types.qurious[e[0]]>3)&&t.theseCharms[`skill${o+1}Names`].push(e[0])}t.armors=function(e,t,o){let n=JSON.parse(JSON.stringify(window.info.armor));const l={helm:[],waist:[],chest:[],arm:[],leg:[]},i=[2.5,4.25,4.25,7];for(let e=0;e<5;++e)(0,s.VW)().forEach((e=>{n[e]=n[e].filter((e=>"MaleOnly"!==e.sex))}));return(0,s.VW)().forEach((s=>{n[s].forEach((n=>{if(!n)return;const r={},a=n.skills;if(13!==n.quriousTable){let e,t=-1;for(let[o,l]of Object.entries(n.decoAugments)){if(++t,o>3)break;0==o||3===o&&t<2||(e=[+o,l[1]])}if(e){const[t,o]=e;r.decos=o,r.augs=[{"+Slots":-6*+t}],r.quriousPoints=n.quriousPoints-6*t}}else 13===n.quriousTable&&(r.decos=[1,1,0,1],r.quriousPoints=0,r.augs=[{def:5},{def:5},{def:5},{def:5},{"+Slots":-18},{"+Slots":-12}]);if(r.augs||(r.decos=n.decos,r.augs=[],r.quriousPoints=n.quriousPoints),e.StormSoul>3){const e=4===document.getElementById("StormSoul").selectedIndex?1:2;for(const o of a)t[o].qurious<6&&(a[o]+=e)}r.fodderSkills=[],r.fodderCount=0;let c=r.decos[0]*i[0]+r.decos[1]*i[1]+r.decos[2]*i[2]+r.decos[3]*i[3];for(const[o,l]of Object.entries(a))if(e[o])e[o]?((t.setBonus&&t?.setBonus[o]||t.charmNeeded&&t.charmNeeded[o])&&(c+=15*Math.min(-1*e[o],a[o])),c+=Math.min(-e[o],a[o])*(20===t[o].qurious?4:t[o].qurious/3)):13===n.quriousTable||r.fodderCount||(r.fodderCount=0);else{r.fodderCount+=l;for(let e=0;e<l;e++)r.fodderSkills.push(o)}if(13===n.quriousTable)r.unBloatedPoints=0,r.armorRating=c;else{let e=[],t=3;for(;t--;)r.augs[t]?e=e.concat(r.augs[0]):r.fodderCount-t>0?(e.push({"-Skill":r.fodderSkills.pop()}),r.quriousPoints+=10):(e.push({"-Def":5}),r.quriousPoints+=5);r.augs=e,r.unBloatedPoints=~~(r.quriousPoints/3),r.armorRating=c,r.armorRating=c+r.unBloatedPoints}const d=(e,t=!0)=>{r.name=n.name,r.type=s,r.skills=n.skills,t?(l[s].pop(),l[s].splice(e,0,r)):l[s].push(r)};for(let e=0;e<l[s].length;e++)if(r.armorRating>l[s][e].armorRating)return void d(e);l[s].length<o&&d(l[s].length-1,!1)}))})),Object.values(l).forEach((t=>t.forEach((t=>{t.skillLimitation=5-Object.keys(t.skills).length-(6-t.augs.length),t.requestedSkills=Object.keys(t.skills).filter((t=>e[t])),t.skillsRemovedCount=t.fodderCount<3?t.fodderCount:3,t.startingQuriousPoints=t.quriousPoints,delete t.armorRating})))),l}(t.skills,t.skillInfo,e),t.skillInfo={charmNeeded:t.skillInfo.charmNeeded,charmSkillPoints:t.skillInfo.charmSkillPoints,setBonus:t.skillInfo.setBonus,setLimiter:4-document.getElementById("skillsLimit").selectedIndex},t.skills=Object.entries(t.skills).sort(((e,t)=>window.info.types.qurious[e[0]]-window.info.types.qurious[t[0]]));let o=t.armors.helm.splice(0),n=~~(o.length/5);p.clear();for(const e of m)t.armors.helm=o.splice(0,n),e.postMessage(t);document.getElementById("setReturn").classList.remove("augInvis"),document.querySelectorAll(".extraSkills>button").forEach((e=>e.remove())),document.getElementById("temp")&&document.getElementById("temp").remove(),document.querySelector(".extraSkills").innerHTML+="<P2 id='temp' style='font-size:18px !important; height:15em !important;'>Searching...</P2>",document.getElementsByClassName("grid")[0].innerHTML="",r={remainingSlots:[0,0,0,0],armorSkills:{},quriousSkills:[0,0,0,0,0]},d=0,k=0};let b=0,I="";document.addEventListener("keypress",(e=>{e.key===["t","e","s","t"][Math.min(3,b)]&&++b<3||("Enter"===e.key&&b>=3?(B("f"!==I),I="",b=0):/t|f/.test(e.key)&&b>=3?I=e.key:b<3&&(b=0))})),document.addEventListener("keypress",(e=>{e.key===["b","u","i","l","d"][Math.min(5,f)]&&++f<5||("Enter"===e.key&&f>=5?(q(),f=0):f<5&&(f=0))}));const q=()=>{[["AdrenalineRush",3],["Bloodlust",3],["BloodRite",3],["Burst",3],["ChargeMaster",3],["Coalescence",1],["CriticalBoost",3],["CriticalElement",3],["Defiance",3],["DragonAttack",5],["ElementExploit",3],["Focus",2],["Frostcraft",3],["IntrepidHeart",2],["MailofHellfire",3],["MindsEye",3],["Partbreaker",3],["ProtectivePolish",3],["Slugger",1],["StunResistance",3],["WeaknessExploit",3],["WindMantle",1],["WirebugWhisperer",3]].forEach((e=>(0,l.Nb)(e[0],e[1]))),w(15),console.log(p)},B=(e=!0)=>([["PeakPerformance",3],["Coalescence",3],["CriticalEye",7],["CriticalBoost",3],["MaximumMight",3],["RecoilDown",3],["ReloadSpeed",3],["RapidFireUp",3],["PierceUp",3],["Burst",1],["Agitator",5],["AttackBoost",7],["AmmoUp",2],["SpareShot",3],["WeaknessExploit",3],["Tune-Up",1],["Bloodlust",1]].forEach((e=>(0,l.Nb)(e[0],e[1]))),w(15),p);document.getElementById("startSearch").addEventListener("click",(()=>w(10))),document.getElementById("normalSearch").addEventListener("click",(()=>w())),document.getElementById("extendedSearch").addEventListener("click",(()=>w(15))),document.querySelector(".grid").addEventListener("mousedown",(e=>{if("BUTTON"!==e.target.tagName)return;const t=Object.values(document.querySelectorAll("div.grid > div.setResult")).indexOf(e.target.parentElement);if(!p.has(t))return;const o=p.get(t);let s=e.target.parentElement.lastElementChild.selectedIndex,i=0;for(let e of o.usedSkills){if(s<e.charm.length)break;++i,s-=e.charm.length}let r=o.usedSkills[i],a=r.charm[s];if((0,n.dj)(a),0!==s){let e=Object.fromEntries(r.charm[0]);for(let t=0;t<2;++t)if(e[a[t][0]]){let o=Math.min(e[a[t][0]],a[t][1]);e[a[t][0]]-=o,a[t][1]-=o}for(let t=0;t<2;++t){let[o,n]=a[t];if(n)for(let l of r.decos)if(!(l[0]!==o||l[1]>n))for(let o in e)if(!(window.info.types.pointsPerSlot[l[2][8]-1][o]===l[1]||window.info.types.pointsPerSlot[l[2][8]-1][o]<l[1]&&window.info.types.decos[o]<=window.info.types.decos[l[0]])&&e[o]>=l[1]){let s=l[1]*l[3];if(s<=e[o]){l[0]=o,e[o]-=s,a[t][1]-=s;break}{let s=~~(n/l[1]);l[3]-=s,r.decos.push([o,l[1],l[2],s]),e[o]-=s,a[t][1]-=s}}}for(let t=0;t<2;++t){let[o,n]=a[t];if(!n)continue;let l=[];for(let e of Object.values(r.augments))l.push(...e.augs);for(;n-- >0;){let n=l.find((e=>e["-Skill"]===o));n||console.log("error finding augment to replace");for(let o in e)if(e[o]>0){n["-Skill"]=o,--e[o],--a[t][1];break}}}}(0,n.qy)(r.augments),(0,n.Cj)((0,n.G_)(r.decos)),document.getElementById("setReturn").classList.add("augInvis"),(0,l.TG)(),document.querySelectorAll(".extraSkills>button").forEach((e=>e.remove())),document.querySelectorAll(".grid>div").forEach((e=>e.remove())),(0,n.to)(),(0,l.TG)(),g&&console.log(JSON.parse(JSON.stringify(r))),p.clear()}))}}]);