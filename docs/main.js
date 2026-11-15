/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	const __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./src/main.js + 28 modules ***!
  \**********************************/

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  a: () => (/* binding */ comboReset),
  b: () => (/* binding */ createSkillSelections),
  c: () => (/* binding */ dataCompile),
  d: () => (/* binding */ importLowRankWeapons)
});

// UNUSED EXPORTS: updateComboDisplay

;// ./src/main/get.js
const { thisKey } = window;
const { skills, types, quest, monster } = thisKey;
let weaponType = document.getElementById("dropWeaponType").value;

const get = {
   $(selector) {
      return document.querySelector(selector);
   },

   $$(selector) {
      return Object.values(document.querySelectorAll(selector));
   },

   helpers: {
      addSpaces(text) {
         return window.thisKey.types.skills[text]?.name.replace(/(?<=[a-z])([A-Z])(?![A-Z])/g, " $1") || text;
      },
      status: ["Paralyze", "Bomb", "Sleep", "Blast", "Poison"],
      elements: ["Fire", "Water", "Thunder", "Ice", "Dragon"],
      hasElement(eleType) {
         return this.elements.indexOf(eleType) !== -1;
      },
      isStatusAttack(statusType) {
         return this.status.indexOf(statusType) !== -1;
      },
   },

   el: {
      id(elId) {
         return document.getElementById(elId);
      },
      class(className) {
         return document.getElementsByClassName(className);
      },
      part: document.getElementById("dropHZ"),
      part2: document.getElementById("dropHZV2"),
      mon: document.getElementById("dropMonster"),
      mon2: document.getElementById("dropMonster2"),
      health: document.getElementById("health"),
      quest: document.getElementById("dropQuest"),
      weapon: document.getElementById("dropWeapon"),
      weaponType: document.getElementById("dropWeaponType"),
      armorSelects: Object.values(document.querySelectorAll("#helm,#chest,#arm,#waist,#leg")),
      armorDisplay: document.getElementById("armorSet"),
      weaponStatsDisplay: Object.values(document.querySelectorAll("#weapon .skillDiv:has(>img) *")),
   },

   lower(str) {
      return str ? str[0].toLowerCase() + str.slice(1) : "";
   },
   elProperty(el, property = "value") {
      return document.querySelector(el)[property];
   },

   augTypeSelects() {
      return this.$$(".augmentType");
   },

   augmentSelects() {
      return this.$$(".augment");
   },

   elSelectedIndex(id) {
      return Math.max(0, document.getElementById(id).selectedIndex);
   },

   elValue(id) {
      return document.getElementById(id).value;
   },

   classList(id) {
      return document.getElementById(id).classList;
   },

   weaponType() {
      return this.el.weaponType.value;
      // this.el.weaponType.selectedIndex = this.weaponTypes.indexOf(weaponType);
      // return weaponType;
   },

   weapon() {
      return thisKey[this.weaponType()].weapons[this.el.weapon.value];
   },

   HZVKeys: ["part", "sever", "blunt", "shot", "fire", "water", "thunder", "ice", "dragon"],

   partIndex(key) {
      key = key[0].toLowerCase() + key.slice(1);
      let keys = this.HZVKeys;
      for (let i = 0; i < 9; i++) {
         if (keys[i] === key) return this.monHZ()[i];
      }
   },

   mon(monName = this.el.mon.value) {
      return monster[monName];
   },

   monHZ(monName = this.el.mon.value) {
      return monster[monName].parts[Math.max(0, this.el.part2.selectedIndex)];
   },

   rawHZ(damageType) {
      let HZV = this.partIndex(damageType);

      if (!HZV) return 100;

      if (!document.getElementById("WaterBlight").checked) {
         return HZV;
      }

      return Math.min(100, ~~(Math.max(HZV, HZV * 0.63 + 22.2) + 3));
   },

   eleHZ(eleType) {
      return (
         this.helpers.isStatusAttack(eleType) ? 100
         : eleType === "None" || eleType === "none" ? 0
         : this.partIndex(eleType)
      );
   },

   quest(questIndex = this.el.quest.value) {
      return quest[questIndex];
   },

   quests() {
      return quest;
   },

   armorTypes() {
      return ["helm", "chest", "arm", "waist", "leg"];
   },

   armor(type) {
      return JSON.parse(JSON.stringify(thisKey.armor[type][document.getElementById(type).value]));
   },

   classContains(selector, className) {
      return document.querySelector(selector).classList.contains(className);
   },

   selectedValue(skillName) {
      if (!window.selectedSkills[skillName]) return 0;

      const levelUsed = Math.min(
         window.selectedSkills[skillName],
         types.skills[skillName].maxLevel || skills[skillName]?.length - 1 || 7
      );

      if (levelUsed < window.selectedSkills[skillName]) {
         const formatted = types.skills.formatName(skillName);
         get.$("#EquippedSkillDisplay output output")
            .find(x => x.value.includes(formatted))
            .classList.add("overLimit");
      }

      return levelUsed;
   },

   skillInfo(skill, param) {
      return types.skills[skill][param];
   },

   statsByValue(skillName) {
      return skills[skillName][this.selectedValue(skillName)];
   },

   statsByIndex(skillName) {
      return skills[skillName][this.elSelectedIndex(skillName)];
   },

   formattedName(skillId) {
      return types.skills.formatName(skillId);
   },

   indexUsed(select, name) {
      for (let i = 0; i < select.childElementCount; i++) {
         if (select.options[i].textContent.replace(/\s|[+-]\d+(Pts)?/g, "") === name) {
            select.selectedIndex = i;
            break;
         }
      }
   },

   idFromText(text) {
      return types.skills[text.replace(/\s+|[+-]\d+(Pts)? ?$/g, "")].id;
   },

   /**
    * Uses all provided keys to look up value in skills object
    * @param {string} key1 - the first key
    * @param {string|undefined} key2 - the second key | undefined
    * @param {string|undefined} key3 - the third key | undefined
    * @param {string|undefined} key4 - the fourth key | undefined
    * @returns {number}
    */
   skillStats(key1, key2, key3, key4) {
      if (key4) {
         return skills[key1][key2][key3][key4];
      }

      if (key3) {
         return skills[key1][key2][key3];
      }

      if (key2) {
         return skills[key1][key2];
      }

      return skills[key1];
   },

   stats(returnedObj, arrayOfObjToAdd) {
      if (!Array.isArray(arrayOfObjToAdd)) arrayOfObjToAdd = [arrayOfObjToAdd];

      for (let obj of arrayOfObjToAdd) {
         for (let stat in obj) {
            if (stat.length === 2 || stat === "aff") {
               returnedObj[stat] += +obj[stat];
            } else {
               returnedObj[stat] *= obj[stat];
            }
         }
      }

      return returnedObj;
   },

   searchSections() {
      let returnVal = {};
      document.querySelectorAll("#searcherSkills>div>output").forEach(el => {
         returnVal[this.skillInfo(el.classList[1], "id")] = +el.value[3];
      });

      return returnVal;
   },
};

get.weaponTypes = Object.values(get.el.weaponType.options).map(el => el.value);

// function createDecoArrays() {
//    let count = 0;
//    const typedArr = new Int8Array(315);
//    let arr = [];
//    for (let i = 0; i < 5; i++) {
//       for (let k = 0; k <= i; k++) {
//          for (let j = 0; j <= k; j++) {
//             typedArr[count++] = i;
//             typedArr[count++] = k;
//             typedArr[count++] = j;
//             let total = 12 - (i + j + k);
//             arr.push(
//                createDecoAugs(typedArr.subarray(count - 3, count), typedArr.subarray(count, count += total))
//             );
//          }
//       }
//    }

//    return arr;
// }
console.log("get.js");

;// ./src/display/createDialog.js


class CreateModel {
   #parent;
   #messageEl;
   #confirmButton;
   confirmationEvent;

   constructor() {
      // Lives on the body so it survives the weapon list being redrawn. showModal() still puts it
      // on top of the Select Weapon window.
      const dialog = document.createElement("dialog");
      dialog.id = "confirmModal";
      dialog.innerHTML = `<h6></h6>
         <button type="button" autofocus>Confirm</button>
         <button type="button">Reject</button>`;

      document.body.appendChild(dialog);

      this.#parent = dialog;
      this.#messageEl = dialog.firstElementChild;
      this.#confirmButton = dialog.children[1];
      this.#confirmButton.addEventListener("click", () => {
         const onConfirm = this.confirmationEvent;
         this.confirmationEvent = undefined;
         dialog.close();
         if (onConfirm) onConfirm(...this.parameters);
      });

      dialog.children[2].addEventListener("click", () => {
         this.confirmationEvent = undefined;
         dialog.close();
      });
   }

   newMessage(parentEl, text, onConfirm, parameters = []) {
      this.parameters = parameters;
      this.confirmationEvent = onConfirm;
      this.#messageEl.innerText = text;
      if (!this.#parent.open) this.#parent.showModal();
   }
}

;// ./src/main/set.js



class SetMethods {
   constructor() {
      this.model = undefined;
   }

   defAug() {
      return '<option value="0"> ---- <option value ="+3">-6 Def +3Pts<option value="+5">-12 Def +5Pts</option >';
   }

   slotAug(limit) {
      let i = 0;
      let elString = "<option value='0'> ---- ";
      while (++i <= limit) {
         const cost = i * -6;
         elString += `<option value="${cost}"> +${i} Slot${i > 1 ? "s" : ""} ${cost}Pts`;
      }

      return elString;
   }

   elValue(id, newVal) {
      document.getElementById(id).value = newVal;
   }

   selectedIndex(id, newIndex) {
      document.getElementById(id).selectedIndex = newIndex;
   }

   chooseProperty(selector, newText, property) {
      get.$(selector)[property] = newText;
   }

   property(el, newText, property) {
      el[property] = newText;
   }

   addClass(id, className) {
      get.classList(id).add(className);
   }

   removeClass(id, className) {
      get.classList(id).remove(className);
   }

   removeChildren(selector) {
      document.querySelector(selector).innerHTML = "";
   }

   elClassToggle(el, className, toggle = true) {
      el.classList.toggle(className, toggle);
   }

   toggleClass(id, className, toggle) {
      get.classList(id).toggle(className, toggle);
   }

   innerHTML(el, text) {
      el.innerHTML = text;
   }

   selectText(el, text) {
      let str = "";
      for (let i = 0; i < text.length; i++) {
         str += `<option>${text[i]}`;
      }

      el.InnerHTML = str;
   }

   swapFirstLetterCase(string) {
      return (
         (string.charCodeAt(0) > 95 ? string[0].toUpperCase() : string[0].toLowerCase()) + string.slice(1)
      );
   }

   selectValues(selector, text, value) {
      let str = "";
      for (let i = 0; i < text.length; i++) {
         str += `<option value="${value[i]}">${text[i]}`;
      }

      document.querySelector(selector).InnerHTML = str;
   }

   selectedIndexByText(el, textToFind) {
      el.selectedIndex = Object.values(el.options).findIndex(x => x.textContent === textToFind);
   }

   resetAll(selector, value, property) {
      const selected = get.$$(selector);
      for (let i = 0; i < selected.length; i++) {
         selected[i][property] = value;
      }
   }

   regExReplace(object, property, regEx, toReplace) {
      object[property] = object[property].replace(regEx, toReplace);
   }

   newMessage(parentEl, text, onConfirm, parameters = []) {
      if (!this.modal) {
         this.modal = new CreateModel();
      }

      this.modal.newMessage(parentEl, text, onConfirm, parameters);
   }
}

const set = new SetMethods();
console.log("set.js");
;// ./src/main/changeMonsters.js
// console.log(performance.now(), 5);


let weaponChange;




window.selectedSkills = {};
const { thisKey: changeMonsters_thisKey } = window;

function setSpawn(mon) {
   let elString = "";
   let quest = get.quest();
   if (!quest || !quest.mons[mon.em]) {
      questSelect(mon.em);
      quest = get.quest();
   }

   if (!quest) return;

   const spawnZones = mon.spawn[quest.map][quest.mons[mon.em][0]];
   let i = 0;
   while (i < spawnZones.length) {
      elString += `<output>Spawn Area ${spawnZones[i++]} ${spawnZones[i++]}%</output>`;
   }

   document.getElementById("spawnArea").innerHTML = elString;
}

function changeMonsters(monName, pass = false) {
   if (performance.now() - changeMonsters_thisKey.time.quest < 100 && !pass) return;

   const mon = get.mon(monName);
   changeMonsters_thisKey.time.quest = performance.now();
   partSelect(mon.name);
   questSelect(mon.name);
   healthSelect(mon.name);
   monChart();
}

const headers = ["Hit Zone", "sever", "blunt", "shot", "fire", "water", "thunder", "ice", "dragon"];

function monChart(mon = get.mon()) {
   setSpawn(mon);
   if (get.el.quest.value === "") {
      return;
   }

   const myTable = document.getElementById("tBody");
   // Create header row
   let str = "";
   mon.parts.forEach(monPart => {
      str += `<section><label>${monPart[0]}</label>`;

      for (let j = 1; j < 9; ++j) {
         let HZV = monPart[j];
         HZV =
            document.getElementById("WaterBlight").checked && j < 4 ?
               ~~Math.min(100, ~~(Math.max(HZV, HZV * 0.63 + 22.2) + 3))
            :  +HZV;

         let grade =
            HZV < 14 ? "F"
            : HZV < 15 ? "C"
            : HZV < 45 ? "B"
            : HZV < 65 ? "A"
            : "S";

         str += `<div class="${grade}">${HZV}</div>`;
      }

      str += "</section>";
   });

   myTable.innerHTML = str;
}

function partSelect(mon) {
   weaponChange = getWeaponChange();

   const type =
      weaponChange.weaponType.includes("Bow") ? "shot"
      : weaponChange.weaponType[0] === "H" ? "blunt"
      : "sever";

   const { eleType } = weaponChange.weapon;
   const rawIndex = headers.indexOf(type);
   const eleIndex = headers.indexOf(eleType);
   const parts = get.mon(mon).parts.sort((b, a) => a[rawIndex] - b[rawIndex] || a[eleIndex] - b[eleIndex]);
   let elString = "";
   parts.forEach(part => {
      elString += `<option>${part[0]}`;
   });

   set.innerHTML(get.el.part, elString);
   set.innerHTML(get.el.part2, elString);
}

function questSelect(mon) {
   let monId = get.mon(mon).em;

   let newQuests = {
      HR: "",
      MR: "",
   };

   let fail = true;
   let quests = get.quests();
   for (let i = 0; i < quests.length; i++) {
      let quest = quests[i];
      if (!quest.mons[monId]) continue;

      fail = false;
      // append the quest to the appropriate difficulty select menu
      newQuests[quest.rank] += `<option value="${i}">${quest.quest}`;
   }

   if (fail) return;

   let elHR = document.getElementById("HR");
   let elMR = document.getElementById("MR");
   elMR.innerHTML = newQuests.MR;
   elHR.innerHTML = newQuests.HR;
   // update the master Quest select menu with MR quest if available otherwise with HR
   updateQuest(elMR.childElementCount ? elMR.options[0] : elHR.options[0]);
   // if difficulty has no quests makes sure the select menu stays hidden
   elMR.classList.toggle("augInvis", elMR.childElementCount);
   elHR.classList.toggle("augInvis", elHR.childElementCount);
}

function healthSelect(mon) {
   const monId = get.mon(mon).em;
   if (get.el.quest.value === "undefined") return;

   let index = get.elSelectedIndex("players");
   let modifier = Math.min(2, 1 + 0.35 * index);
   let quest = get.quest();
   let target = quest.mons[monId];
   let health = "";
   for (let i = 1; i < target.length; i++) {
      health += `<option>${target[i] * modifier}`;
   }

   get.el.health.innerHTML = health;
   get.el.health.selectedIndex = 0;
}

function updateQuest(el) {
   get.el.quest.options[0].value = el.value;
   get.el.quest.options[0].textContent = el.textContent;
   set.addClass("questDiv", "augInvis");
}

;// ./src/main/getWeaponMR.js


const eleBonuses = { GreatSword: 30, Hammer: 30, Lance: 21, Gunlance: 21 };

function getAugmentValue(type) {
   return +get.elProperty(`output.${type}Aug + output`).slice(-2);
}

const getElSelectedIndex = id => document.getElementById(id)?.selectedIndex;
const info = window.thisKey;

/**
 * @typedef Weapon
 * @property {string} name
 * @property {string} weaponType
 * @property {number} baseRaw
 * @property {number} eleType
 * @property {number} baseEle
 * @property {number} aff
 * @property {number} decoSlots
 * @property {number} handicraft
 * @property {{color:value}} sharpness
 * @property {number[]} clipSize
 * @property {string[]} isRapidFire
 */
/**
 * @param {Weapon} weapon
 * @param {string} weaponType
 * @returns {Weapon} weapon
 */

function getWeaponMR(weapon, weaponType = get.el.weaponType.value) {
   let selectedSkills = window.selectedSkills;
   const power = weapon || structuredClone(info[weaponType].weapons[get.elSelectedIndex("dropWeapon")]);
   // Raw weapons have no baseEle in the data; treat it as 0 so augments do not turn it into NaN
   power.baseEle = +power.baseEle || 0;
   const canGetAugs = power.rank === 10 && get.elProperty("#augUpgrades", "checked");

   if (weaponType.includes("Bow")) {
      const barrelType = document.getElementById("BowgunBarrel").selectedOptions[0].text;
      // No Tune-Up selected counts as level 0, so the barrel gets its normal bonus
      const tuneUpLevel = selectedSkills?.["Tune-Up"] || 0;
      if (weaponType === "LightBowGun" && barrelType === "Long") {
         power.baseRaw = ~~(power.baseRaw * (tuneUpLevel < 2 ? 1.05 : 1.075));
      } else if (weaponType === "HeavyBowGun" && barrelType === "Power") {
         power.baseRaw = ~~(power.baseRaw * (tuneUpLevel < 2 ? 1.125 : 1.15));
      }

      if (canGetAugs) {
         power.baseRaw +=
            weaponType === "HeavyBowGun" ? 20
            : weaponType === "Bow" ? 15
            : 10;
      }
   } else if (canGetAugs) {
      if (!get.helpers.hasElement(power.eleType)) {
         power.baseRaw += 40;
      } else {
         power.baseRaw += 25;
         power.baseEle += eleBonuses[weaponType] || 18;
      }
   }

   power.baseRaw += getAugmentValue("attack");
   // Keep the weapon's own affinity and add the augment on top of it
   power.aff = (+power.aff || 0) + getAugmentValue("affinity");
   power.baseAff = power.aff;
   if (get.helpers.hasElement(power.eleType)) {
      power.baseEle += getAugmentValue("elemental");
   } else if (power.type !== "none") {
      power.baseEle += getAugmentValue("status");
   }

   return power;
}
;// ./src/armor/armorFunctions.js




const { thisKey: armorFunctions_thisKey } = window;
const { types: armorFunctions_types } = armorFunctions_thisKey;

function armorReset(type) {
   if (!type) return;

   const armor = get.armor(type);
   updateAugmentPointsRemaining(type, armor.qurious, armor.qurious);
   let augmentSelects = document.querySelectorAll(`.${type} .armorAugment select`);

   for (let i = 0; i < 12; i++) {
      augmentSelects[i].selectedIndex = 0;
   }

   getArmorsDecoArrNSkillsObj([type]);
   updateElementDefense();
}

/*
 * updates the augment points displayed for the armor
 */
function updateAugmentPointsRemaining(armorType, currentValue, baseValue) {
   let pointsDisplay = document.querySelector(`section.${armorType} .currentPoints`);
   pointsDisplay.textContent = pointsDisplay.textContent
      .replace(/(?=>\s)?\d+(?=[^/]*\/)/, currentValue)
      .replace(/(?<=\/)\d+/, baseValue);
}

const armorFunctions_elements = ["Dragon", "Fire", "Ice", "Thunder", "Water"];

function updateElementDefense() {
   let dragonHeart = get.statsByValue("Dragonheart").Resist;

   let allResistances =
      dragonHeart ||
      get.statsByValue("Furious").Resist +
         get.statsByValue("DragonConversion").Resist +
         get.statsByValue("DefenseBoost").Resist;

   const eleResist = {};

   for (let ele of armorFunctions_elements) {
      eleResist[ele] =
         dragonHeart ||
         get.statsByValue(`${ele}Resistance`).Resist + +get.elValue(`${ele}Res`) + allResistances;
   }

   for (let type of get.armorTypes()) {
      let thisArmor = get.armor(type);
      let armorCard = document.querySelector(`.${type}`);

      for (let i = 0; i < 5; i++) {
         armorCard.querySelector(`.${set.swapFirstLetterCase(armorFunctions_elements[i])} output`).textContent =
            thisArmor.def[i + 1];

         if (!dragonHeart) eleResist[armorFunctions_elements[i]] += +thisArmor.def[i + 1];
      }
   }

   for (let i = 0; i < 5; i++) {
      document.querySelector(`#weapon .${set.swapFirstLetterCase(armorFunctions_elements[i])} output`).textContent =
         Math.min(50, eleResist[armorFunctions_elements[i]]);
   }

   checkArmorsDef();
}

function checkArmorsDef() {
   let newTotal = 0;

   for (let type of get.armorTypes()) {
      // Get base value
      let newVal = get.armor(type).def[0];
      // Query all augmentType elements and process each
      document.querySelectorAll(`#${type}Qurious .augmentType`).forEach(el => {
         // If augmentType is not "-Def", return early
         if (el.selectedIndex !== 1) return;

         // Deduct defense lost based on the selectedIndex
         newVal -= [0, 6, 12][Math.max(0, +el.nextElementSibling.selectedIndex)];
      });

      // Set the current displayed defense element for this armor type
      document.querySelector(`section.${type} .def output`).textContent = newVal;
      newTotal += +newVal;
   }

   document.querySelector("#weapon .def output").textContent = newTotal;
}

function getArmorsDecoArrNSkillsObj(armorTypes = get.armorTypes()) {
   Object.values(armorTypes).forEach(armorType => {
      if (armorType === "") return;

      const thisArmor = get.armor(armorType);
      const augSkills = { ...thisArmor.skills };
      const augmentTypeSelects = get.$$(`#${armorType}Qurious select.augmentType`);
      let decoArr = [0, 0, 0];
      let k = 4;
      let i = 0;

      // reformat decoArr from highest to lowest and use the index+1 for the value
      while (i < 3 && k--) {
         // starting at the end of the array
         let temp = thisArmor.decos[k];

         // for each marker found
         while (temp--) {
            // sets the index to k+1 since 0 needs to be accommodated for in the new arr
            decoArr[i] = k + 1;
            ++i;
         }
      }

      for (let augType of augmentTypeSelects) {
         let augment = augType.nextElementSibling;

         if (augment.selectedIndex <= 0 || augType.selectedIndex <= 0) continue;

         if (augType.selectedIndex === 2 || augType.selectedIndex === 4) {
            // applies + and - skill augments
            const skillName = armorFunctions_types.skills.removeFormatting(augment.selectedOptions[0].textContent, "id");

            if (augSkills[skillName]) {
               // augmentTypeSelects[i].selectedIndex - 3 will -1 if -Skill or +1 if +Skill
               augSkills[skillName] += augType.selectedIndex - 3;
            } else {
               augSkills[skillName] = 1;
            }
         } else if (
            // sets augType to +Slots
            augType.selectedIndex === 3
         ) {
            decoArr = useDecoAugments(decoArr, augment.selectedIndex);
         }
      }

      for (let el of get.$$(`section.${armorType}.eleDiv`)) {
         el.children[1].textContent = thisArmor[el.classList[0]];
      }

      setArmorsDisplayedSkills(armorType, augSkills);
      setDecoDisplay(armorType, decoArr);
   });
}

function useDecoAugments(decoArr, points) {
   // Every index if at 0 must first get to 1 before any other progress
   for (let i = 0; i < 3 && points > 0; ++i) {
      if (decoArr[i] === 0) {
         ++decoArr[i];
         --points;
      }
   }

   // Upgrade the deco array using the specified points
   for (let i = 0; i < 3 && points > 0; ++i) {
      while (decoArr[i] < 4 && points) {
         ++decoArr[i];
         --points;
      }
   }

   return decoArr;
}

function setArmorsDisplayedSkills(armorType, skillsObj) {
   const skillEntries = Object.entries(skillsObj);
   const outputEls = document.querySelectorAll(`section.${armorType} .skillDiv>output`);
   [2, 3, 4, 0, 1].forEach((order, index) => {
      const output = outputEls[order];

      // const newIndex = order[index];
      if (!skillEntries[index]) {
         output.textContent = "";
         output.nextElementSibling.classList.add("augInvis");
         return;
      }

      let text = skillEntries[index];
      text[0] = armorFunctions_types.skills[text[0]].name;
      output.textContent = `${armorFunctions_types.skills.formatName(text[0])} +${text[1]}`;
      output.nextElementSibling.classList.remove("augInvis");
   });
}

const decoImages = (function () {
   const returnVal = {};
   for (const type of ["weapon", "helm", "chest", "arm", "waist", "leg", "charm"]) {
      returnVal[type] = [
         Object.values(document.querySelectorAll(`section.${type} .decoDisplay img`)),
         Object.values(document.querySelectorAll(`section.${type} .decoDisplay img +select`)),
      ];
   }

   return returnVal;
}());

const strings = [
   '<option value="0"> ---- </option>',
   '<option class="optTitle" value="1" disabled>lvl-1 Decos</option>',
   '<option class="optTitle" value="2" disabled>lvl-2 Decos</option>',
   '<option class="optTitle" value="3" disabled>lvl-3 Decos</option>',
   '<option class="optTitle" value="4" disabled>lvl-4 Decos</option>',
];

function setDecoDisplay(armorType, decoArr) {
   const [images, selects] = decoImages[armorType];

   for (let k = 0; k < decoArr.length; k++) {
      let img = images[k];
      let select = selects[k];
      let currentLevel = Math.min(4, decoArr[k]);

      if (select.childElementCount > 5 && img.classList.contains(`lvl${currentLevel}`)) {
         continue;
      }

      img.className = img.className.replace(/(?<=lvl)\d/, currentLevel);
      img.src = img.src.replace(/lvl\d/, `lvl${currentLevel}`);

      if (!currentLevel) {
         // if we cant use the slot "disable" it
         select.selectedIndex = 0;
         select.innerHTML = "";
         continue;
      }
      // set slot to its new max level by changing img and className

      // create new option list excluding decos of a higher level than is possible
      let string = strings.slice(1, currentLevel + 1);
      let skills = Object.values(armorFunctions_types.skills);
      let len = skills.length;
      for (let i = (len >> 1) - 1; i < len; ++i) {
         const { decos, name } = skills[i];
         if (decos && decos[0] <= currentLevel) {
            let formattedName = armorFunctions_types.skills.formatName(name);
            let previousValue = 0;
            for (let j = decos[0]; j <= currentLevel; ++j) {
               // if this level gives the same amount of points as the level before it
               if (decos[j] === previousValue) continue;

               previousValue = decos[j];
               string[j - 1] += `<option value="${j}">${formattedName} +${decos[j]}`;
            }
         }
      }

      select.innerHTML = strings[0] + string.reverse().join("");
   }
}

function augmentEventHandler(target, temp, pass = false) {
   // console.log(performance.now() - window.thisKey.time?.augments);
   if (!pass && performance.now() - armorFunctions_thisKey.time?.augments < 100) {
      console.log(performance.now() - armorFunctions_thisKey.time?.augments);
      armorFunctions_thisKey.time.augments = performance.now();
      return;
   }

   armorFunctions_thisKey.time.augments = performance.now();

   if (!isFinite(temp) && (!temp || temp.includes("---"))) temp = "";

   // if (e.target.classList.contains("augmentType")) {
   changeDropdownOptions(
      target.previousElementSibling.selectedIndex,
      target,
      target.parentElement.parentElement.id.split("Qurious")[0],
      temp
   );

   validator(target.parentElement.parentElement.id.split("Qurious")[0]);
}

/**
 * @param {string} armorType
 */
function validator(armorType) {
   // setArmorSkillsDisplay([armorType]);
   const armor = get.armor(armorType);
   let skills = { ...armor.skills };
   const augmentDropdowns = document.querySelectorAll(`.${armorType} .augment`);
   const augmentTypeDropdowns = document.querySelectorAll(`.${armorType} .augmentType`);
   let value = armor.qurious;
   let i = -1;

   while (++i < 6) {
      const thisAugType = augmentTypeDropdowns[i];
      const thisAugment = augmentDropdowns[i];

      if (!thisAugment) continue;

      if (thisAugType.value === "-Skill" && --skills[trimName(thisAugment.textContent)] < 0) {
         thisAugment.selectedIndex = 0;
         thisAugType.selectedIndex = 0;
         continue;
      }

      value += +thisAugment.value;
   }

   while (value < 0 && i--) {
      if (+augmentDropdowns[i].value < 0) {
         value -= +augmentDropdowns[i].value;
         augmentDropdowns[i].selectedIndex = 0;
         augmentTypeDropdowns[i].selectedIndex = 0;
      }
   }

   getArmorsDecoArrNSkillsObj([armorType]);
   updateAugmentPointsRemaining(armorType, value, armor.qurious);
   return value;
}

function equipBuild(returnRecord, armorIds) {
   const armorDisplay = get.el.armorDisplay;
   const searchSkills = get.searchSections();
   // sets both the charms selected Skills, and usable slots
   let index = 0;
   let armorTypes = get.armorTypes();

   for (let j = 0; j < 5; j++) {
      const armorType = armorTypes[j];
      let thisArmorsCard = armorDisplay.children[j + 1];
      let augs = returnRecord.subarray(index, index += 6);
      set.selectedIndex(armorType, armorIds[j]);
      // sets the selected armors and resets the skills and decos
      armorReset(armorType);
      let decoAugPointer = 0;

      let {
         qurious: budget,
         skills: { ...skills },
         decos: { ...decos },
         decoAugs,
      } = get.armor(armorType);

      let startingQurious = budget;
      let augmentTypeDropdown = thisArmorsCard.querySelectorAll(".augmentType");
      let augmentDropdown = thisArmorsCard.querySelectorAll(".augment");

      // resets and sets the augmented type dropdown and augment dropdown

      for (let i = 0; i < 6; i++) {
         let aug = augs[i];

         if (aug === 250) continue;

         let augType =
            aug === 255 ? 1
            : aug > 250 ? 3
            : searchSkills[aug] && !skills[aug] || searchSkills[aug] > skills[aug] ? 4
            : 2;

         let formatName;
         let skill;
         let cost;
         let decoIndex;
         augmentTypeDropdown[i].selectedIndex = augType;

         switch (augType) {
            case 1:
               budget += 5;
               augmentDropdown[i].innerHTML = set.defAug();
               augmentDropdown[i].selectedIndex = 2;
               break;

            case 3:
               let count = 255 - aug;
               cost = count * 6;

               if (budget < cost) {
                  console.log(`budget was -${budget}`);

                  debugger;

                  break;
               }

               augmentDropdown[i].innerHTML = set.slotAug(Math.min(3, ~~(budget / 6)));
               budget -= cost;
               augmentDropdown[i].selectedIndex = count;

               while (count--) {
                  decoIndex = decoAugs[decoAugPointer++];
                  ++decos[decoIndex];

                  if (decoIndex) --decos[decoIndex - 1];
               }

               break;

            case 2:
               skill = armorFunctions_types.skills[aug];
               formatName = armorFunctions_types.skills.formatName(aug);

               if (skills[aug] === 0) {
                  console.log(`skill ${skill.name} was -1`);
                  break;
               }

               augmentDropdown[i].innerHTML = `<option value="0"> ---- 
             <option value="10"> ${formatName} +10Pts`;

               budget += 10;
               --skills[aug];
               augmentDropdown[i].selectedIndex = 1;
               break;

            case 4:
               skill = armorFunctions_types.skills[aug];
               formatName = armorFunctions_types.skills.formatName(aug);

               if (budget < skill.qurious) {
                  debugger;

                  console.log(`budget was -${budget}`);
                  break;
               }

               budget -= skill.qurious;
               skills[aug] = (skills[aug] || 0) + 1;
               augmentDropdown[i].innerHTML = `<option value="0"> ---- 
                 <option value="${-skill.qurious}"> ${formatName} ${-skill.qurious}Pts`;

               augmentDropdown[i].selectedIndex = 1;
               break;
         }
      }

      setArmorsDisplayedSkills(armorType, skills);
      let k = 4;
      let i = 0;
      let formattedDecos = [0, 0, 0];

      while (i < 3 && k--) {
         // starting at the end of the array
         let temp = decos[k];

         // for each marker found
         while (temp--) {
            // sets the index to k+1 since 0 needs to be accommodated for in the new arr
            formattedDecos[i] = k + 1;
            ++i;
         }
      }

      getArmorsDecoArrNSkillsObj([armorType]);
      updateAugmentPointsRemaining(armorType, budget, startingQurious);
   }
}

const trimName = str => str.replace(/\s+|[+-]\d+(Pts)?/g, "");

/**
 *
 * @param {number} typeIndex - The index corresponding to the type.
 * @param {HTMLSelectElement} augment - The HTML select element to set.
 * @param {string} [armorType=""] - The type of armor being considered.
 * @param {string} [temp=""] - A temporary string parameter. Optional, defaults to an empty string.
 */
function changeDropdownOptions(typeIndex, augment, armorType = "", temp = "") {
   let pointsDisplay = document.querySelector(`section.${armorType} .currentPoints`);
   let budget = +pointsDisplay.textContent.match(/\d+(?=\/)/)[0];

   if (isFinite(+augment.value)) budget -= +augment.value;

   if (typeIndex % 2) {
      augment.innerHTML = typeIndex === 3 ? set.slotAug(Math.min(3, ~~(budget / 6))) : set.defAug();

      if (temp) augment.selectedIndex = temp;

      validator(armorType);
      return;
   }

   const armorSkills = get.armor(armorType).skills;

   if (temp) temp = temp >= 0 && temp < 250 ? armorFunctions_types.skills[temp].name : trimName(temp);

   console.log(temp, armorType);
   let tempIndex = 0;
   let index = 0;
   let outputs = get.$$(`section.${armorType} .skillDiv>output`);
   let theseSkills = [];

   // get current innate/augmented skills of the armor and format
   for (let el of outputs) {
      if (el.textContent) {
         theseSkills.push({
            name: trimName(el.textContent),
            id: armorFunctions_types.skills[trimName(el.textContent)].id,
            level: +el.textContent.match(/\d+/)[0],
         });
      }
   }

   let elString = '<option value="0"> ---- </option>';

   if (typeIndex === 2) {
      theseSkills.forEach(skill => {
         // if skill is innately on the armor it can hit 0 points, but can never truly be removed
         if (armorSkills[skill.id] && (skill.name === temp || skill.level > 0)) {
            ++index;
            elString += `<option value="+10">${armorFunctions_types.skills.formatName(skill.name)} +10Pts</option>`;

            if (skill.name === temp) tempIndex = index;
         }
      });
      // can only have 5 total skills, an innate skill even if at 0 still counts
   } else {
      // if the skill in the currently selected dropdown would go to 0 we want to allow other options
      let list = [];

      if (theseSkills.length === 5) {
         let tempId = armorFunctions_types.skills[temp].id;

         // if at 5 we only can display the options that are already on the armor
         for (let el of theseSkills) {
            let { qurious, name } = armorFunctions_types.skills[el.name];

            if (!qurious || qurious > budget) continue;

            list.push([name, qurious]);
         }
      } else {
         const skillValues = Object.values(armorFunctions_types.skills);

         for (let j = 0; j < 147; j++) {
            const { name, qurious } = skillValues[j];

            if (!qurious || qurious > budget) continue;

            list.push([armorFunctions_types.skills.formatName(name), qurious]);
            // we only increase the index when a selection is added to keep track of the actual selected index for temp
         }
      }

      for (let skill of list) {
         elString += `<option value="-${skill[1]}">${skill[0]} -${skill[1]}Pts</option>`;
         ++index;

         if (trimName(skill[0]) === temp) tempIndex = index;
      }
   }

   console.log(temp, armorType, tempIndex);
   augment.innerHTML = elString;

   if (temp && tempIndex > 0) augment.selectedIndex = tempIndex;

   validator(armorType);
}

;// ./src/main/rampageSelect.js








const rampageSelect_thisKey = window.thisKey;

function rampageSelect() {
   const decoArr = [];
   const thisWeapon = getWeaponMR();
   const decos = [...thisWeapon.decos];
   let markerCount = 2;
   for (let i = 3; i >= 0 && markerCount; i--) {
      while (decos[i] > 0) {
         decoArr.push(i + 1);
         --decos[i];
         --markerCount;
      }
   }

   setDecoDisplay("weapon", decoArr);
   document.querySelectorAll("#weaponRampage > *").forEach(menu => menu.classList.add("augInvis"));
   document.getElementById("weaponRampage0").classList.remove("augInvis");

   if (thisWeapon.rampageSlots) {
      // find rampage deco level
      const rampLevel = Math.min(3, thisWeapon.rampageSlots + rampageSelect_thisKey.augIndex.rampageAug);
      document.getElementById("rampImg").src = document
         .getElementById("rampImg")
         .src.replace(/lvl\d/, `lvl${rampLevel}`);

      // filter skills by rampage deco level
      let str = "";
      Object.entries(rampageSelect_thisKey.rampage.rampageDecos).forEach(rampDeco => {
         if (+rampDeco[0].slice(-1) <= rampLevel) {
            str += `<option>${rampDeco[1]}`;
         }
      });

      document.getElementById("weaponRampage0").innerHTML = str;
      return;
   }

   document.querySelectorAll("#weaponRampage>*").forEach(menu => {
      menu.selectedIndex = 0;
      menu.classList.add("augInvis");
   });

   document.getElementById("weaponRampage0").classList.remove("augInvis");
   if (/Rampage/.test(thisWeapon.weapon)) {
      rampageSelect_thisKey.rampage[thisWeapon.weapon].Rampage.forEach((vals, index) => {
         document.querySelector("#weaponRampage").children[index].classList.remove("augInvis");
         set.selectText(get.$(`#weaponRampage *:nth-child(${index + 1})`), Object.values(vals));
      });
   } else {
      thisWeapon.rampage.forEach(rampSkill => {
         const option = document.createElement("option");
         option.value = rampageSelect_thisKey.rampage.keys2[rampSkill];
         option.textContent = rampageSelect_thisKey.rampage.keys2[rampSkill];
         document.getElementById("weaponRampage0").append(option);
      });
   }
}
;// ./src/main/quriousAugsDec.js








let quriousAugsDec_weaponChange;
const { thisKey: quriousAugsDec_thisKey } = window;

// ////////////////////////////////////////////////////////
// //////////  Qurious Weapon   //////////////////////////////
// ///////////////////////////////////////////////////////
const quriousAugsDec = target => {
   let augType = target.className.match(/\w+Aug$/)[0];
   let augIndex = quriousAugsDec_thisKey.augIndex[augType];

   if (augIndex === 0) return;

   const output = target.parentElement.querySelector("output.label");
   let thisAug = quriousAugsDec_thisKey.augs[augType];
   quriousAugsDec_thisKey.augIndex[augType]--;
   output.textContent = thisAug[augIndex - 1][0];
   output.nextElementSibling.textContent = `+${thisAug[augIndex - 1][1]}`;

   let newTotal = Object.entries(quriousAugsDec_thisKey.augs).reduce((total, [augType, values]) => {
      return total + values[quriousAugsDec_thisKey.augIndex[augType]][0];
   }, 0);

   document.getElementById("weaponQurious").textContent = `Augment Points ${10 - newTotal}/10`;
   if (target.classList.contains("rampageAug")) {
      rampageSelect();
   }

   getWeaponChange().weaponDisplay();
};

const quriousAugsInc = target => {
   let augType = target.className.match(/\w+Aug$/)[0];
   let augIndex = quriousAugsDec_thisKey.augIndex[augType];
   let thisAug = quriousAugsDec_thisKey.augs[augType];
   if (
      augIndex + 1 === thisAug.length ||
      target.classList.contains("rampageAug") && augIndex + getWeaponMR().rampageSlots + 1 > 3
   ) {
      return;
   }

   let currentTotal = Object.entries(quriousAugsDec_thisKey.augs).reduce((total, [augType, values]) => {
      return total + values[quriousAugsDec_thisKey.augIndex[augType]][0];
   }, 0);

   const acc = currentTotal + (thisAug[augIndex + 1][0] - thisAug[augIndex][0]);
   if (acc > 10) return;

   const output = target.parentElement.querySelector("output.label");
   quriousAugsDec_thisKey.augIndex[augType]++;
   output.textContent = thisAug[augIndex + 1][0];
   output.nextElementSibling.textContent = `+${thisAug[augIndex + 1][1]}`;
   document.getElementById("weaponQurious").textContent = `Augment Points ${10 - acc}/10`;

   if (target.classList.contains("rampageAug")) {
      rampageSelect();
   }

   quriousAugsDec_weaponChange.weaponDisplay();
};

document
   .querySelectorAll(".augButton.inc")
   .forEach(augInc => augInc.addEventListener("click", e => quriousAugsInc(e.target)));

document
   .querySelectorAll(".augButton.dec")
   .forEach(augDec => augDec.addEventListener("click", e => quriousAugsDec(e.target)));

function updateEleAugs() {
   for (let aug of Object.entries(quriousAugsDec_thisKey.augIndex)) {
      if (aug[1] > 0) {
         document.querySelector(`.augLabel.${aug[0]}`).textContent = 0;
         document.querySelector(`.augLabel.${aug[0]}+ output`).textContent = "+0";
         quriousAugsDec_thisKey.augIndex[aug[0]] = 0;
      }
   }

   document.getElementById("weaponQurious").textContent = "Augment Points 10/10";
   document.getElementById("elementDiv").classList.add("augInvis");
   document.getElementById("statusDiv").classList.add("augInvis");
   const weaponType = get.el.weaponType.value;
   if (weaponType.includes("BowGun")) return;

   let weapon = getWeaponMR();
   if (get.helpers.isStatusAttack(weapon.eleType)) {
      changeToStatus(weaponType);
   } else if (weapon.eleType !== "None") {
      changeToElement(weaponType);
   }
}

function changeToStatus(weaponType) {
   let newStatusVal =
      weaponType === "GreatSword" ? [0, 3, 12, 18, 24]
      : /^Bow$|Dual/.test(weaponType) ? [0, 3, 6, 9, 12]
      : /Bow/.test(weaponType) ? [0, 0, 0, 0, 0]
      : [0, 3, 8, 12, 16];

   document.getElementById("statusDiv").classList.remove("augInvis");

   if (quriousAugsDec_thisKey.augs.statusAug[5] === newStatusVal[5]) return;

   quriousAugsDec_thisKey.augs.statusAug.forEach((el, index) => el[1] = newStatusVal[index]);
}

function changeToElement(weaponType) {
   let newEleVal =
      /Great|Hammer/.test(weaponType) ? [0, 5, 10, 15, 20, 25, 33, 43, 55]
      : weaponType.endsWith("ance") ? [0, 3, 6, 10, 14, 18, 24, 32, 42]
      : weaponType.includes("Bow") ? [0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [0, 3, 6, 9, 12, 15, 20, 27, 35];

   document.getElementById("elementDiv").classList.remove("augInvis");

   if (quriousAugsDec_thisKey.augs.elementalAug[8] === newEleVal[8]) return;

   quriousAugsDec_thisKey.augs.elementalAug.forEach((el, index) => el[1] = newEleVal[index]);
}

;// ./src/loading/weaponChange.js
















const { thisKey: weaponChange_thisKey } = window;
const { skills: weaponChange_skills } = weaponChange_thisKey;
let weaponChange_weaponChange;

/**
 * @class WeaponChange
 * @property {HTMLSelectElement} weaponEl
 * @property {object} weapon
 * @property {HTMLSelectElement} weaponTypeEl
 * @property {string} weaponType
 * @property {object} burst
 * Maps any weaponType that has a unique burst stats to said stats.
 */
class WeaponChange {
   constructor() {
      this.burst = {
         DualBlades: weaponChange_skills.BurstDualBlades,
         Bow: weaponChange_skills.BurstBow,
         LightBowGun: weaponChange_skills.BurstBowGun,
         HeavyBowGun: weaponChange_skills.BurstBowGun,
      };

      this.weapon = getWeaponMR();

      this.resetWeaponType(this.weaponType, this.weaponEl.selectedIndex);
   }

   get weaponTypeEl() {
      return document.getElementById("dropWeaponType");
   }

   get weaponType() {
      return this.weaponTypeEl.value;
   }

   get weaponEl() {
      return document.getElementById("dropWeapon");
   }

   setSelectedOption(toFind, selectEl) {
      selectEl.selectedIndex = Object.values(selectEl.options).findIndex(el => el.value === toFind);
   }

   /**
    * Resets the weapon type and updates the UI accordingly.
    *
    * @param {string} weaponType
    * - The name of the weapon to be set.
    *
    * @param {number} weaponIndex
    * - The weapons index in the #dropWeaponType el.
    */
   resetWeaponType(weaponType = this.weaponType, weaponIndex = 0) {
/*       if (document.getElementById("wikiModel").open) {
         return;
      } */

      if (this.weaponType !== weaponType) {
         this.setSelectedOption(weaponType, this.weaponTypeEl);
      }

      this.weapons = weaponChange_thisKey[weaponType].weapons;
      // Only rank 10 by default, but keep every rank listed when the weapon being equipped is a lower rank
      set.elClassToggle(get.el.id("weaponRankFilter"), "selected", this.weapons[weaponIndex]?.rank === 10);
      this.setWeaponSelect(weaponType);

      const regEx = new RegExp(/(?<=icons\/)\w+/g);
      set.regExReplace(get.$("#weapon > img"), "src", regEx, weaponType);
      const shouldChange =
         weaponType !== "Bow" && (weaponType !== "ChargeBlade" || this.weapon.phialType === this?.phialType);

      if (shouldChange) {
         this.classChange(weaponType);
      }

      this.resetWeapon(weaponIndex);

      monChart();
   }

   resetWeapon(weaponIndex = 0) {
      if (document.getElementById("wikiModel").open) {
         return;
      }

      this.weaponEl.selectedIndex = weaponIndex;
      this.weapon = getWeaponMR(structuredClone(this.weapons[weaponIndex]));

      if (this.weaponType === "ChargeBlade" && this.weapon.phialType !== this.weapon.phialType) {
         this.classChange();
      }

      if (this.weaponType === "Bow") {
         this.resetBowCoatings();
      }

      rampageSelect();
      this.weaponDisplay();
      updateEleAugs();
   }

   rankFilter(weapon) {
      return weapon.rank === 10;
   }

   setWeaponSelect(weaponType = this.weaponType) {
      let str = "";
      const filter = get.classContains("#weaponRankFilter", "selected") ? this.rankFilter : "";

      this.weapons.forEach((weapon, index) => {
         if (!filter || filter(weapon)) {
            str += `<option value="${index}">${weapon.weapon}`;
         }
      });

      this.weaponEl.innerHTML = str;
   }

   setBowGunBarrel(type) {
      for (let el of get.$$("#BowgunBarrel option")) {
         el.disabled = !el.classList.contains(type);
         el.classList.toggle("augInvis", !el.classList.contains(type));
      }

      // get.$$ returns an array, so set the index on the select itself
      get.$("#BowgunBarrel").selectedIndex = 0;
   }

   resetWeaponAug(augType, augment) {
      augment.textContent = 0;
      augment.nextElementSibling.textContent = "+0";
      weaponChange_thisKey.augIndex[augType] = 0;
   }

   classChange(weaponType = weaponChange_weaponChange.weaponType) {
      for (const augType of Object.keys(weaponChange_thisKey.augIndex)) {
         this.resetWeaponAug(augType, get.$(`output.${augType}`));
      }

      if (weaponType.includes("Bow")) {
         set.selectedIndex("Sharpness", 0);
         if (weaponType !== "Bow") {
            this.setBowGunBarrel(weaponType);
         }
      }

      if (get.$(".inputs")) comboReset();

      weaponChange_skills.Burst = this.burst[weaponType] || weaponChange_skills.BurstStandard;
      weaponChange_skills.Bombardier = /Gun|Charge/.test(weaponType) ? weaponChange_skills.BombardierSource[weaponType] : [];
      get.$$(".classSpecific").forEach(el => {
         const cantUseSkill = !el.classList.contains(weaponType);
         const containingEl = /BUTTON|DIV|OUTPUT/.test(el.tagName) ? el : el.parentElement;
         // hide unusable elements/ reveal usable
         set.elClassToggle(containingEl, "augInvis", cantUseSkill);
         // any unusable select menus make sure it has no selection made
         if (cantUseSkill && el.tagName === "SELECT") {
            el.selectedIndex = 0;
         }
      });

      if (weaponType === "ChargeBlade") this.resetPhialType();
   }

   resetPhialType() {
      this.phialType = this.weapon.phialType;
      const isImpactPhial = this.phialType === "Impact Phial";
      const elementToReset = isImpactPhial ? "EleShieldCharge" : "ImpactShieldCharge";
      set.elClassToggle(get.$("div:has(#ImpactShieldCharge)"), "augInvis", !isImpactPhial);
      set.elClassToggle(get.$("div:has(#EleShieldCharge)"), "augInvis", isImpactPhial);
      set.selectedIndex(elementToReset, 0);
   }

   /**
    * Removes current coatings and sets the new ones.
    */
   resetBowCoatings() {
      const bowSelect = get.$("#BowCoating");
      weaponChange_skills.BowCoating = [];
      const coatings = this.weapon.coatings;
      for (let i = 0; i < coatings.length || i < bowSelect.childElementCount; i++) {
         if (i < coatings.length) {
            bowSelect.options[i] = new Option(coatings[i]);
            weaponChange_skills.BowCoating.push(weaponChange_skills[coatings[i]]);
         } else {
            bowSelect.options[i].remove();
         }
      }
   }

   weaponDisplay(weaponType) {
      weaponType ||= this.weaponType;
      const weapon = this.weapon;
      const weaponStats = get.el.weaponStatsDisplay;
      set.property(weaponStats[0], weapon.baseRaw, "textContent");

      let [newText, newSrc] =
         weapon.baseEle ? [weapon.baseEle, weapon.eleType.toLowerCase()]
         : weaponType.endsWith("Gun") ? ["Ammo", "ammo"]
         : [" 0 ", "none"];

      set.property(weaponStats[2], newText, "textContent");
      set.property(weaponStats[3], weaponStats[3].src.replace(/(?<=icons\/).*?(?=\.)/, newSrc), "src");
      set.property(weaponStats[4], weapon.aff, "textContent");
      let j = 4;
      let formattedDecos = [0, 0, 0];
      let pointer = 0;
      while (j--) {
         let count = this.weapon.decos[j];
         while (count--) formattedDecos[pointer++] = j + 1;
      }

      setDecoDisplay("weapon", formattedDecos);
   }
}

function getWeaponChange() {
   if (!weaponChange_weaponChange) weaponChange_weaponChange = new WeaponChange();

   return weaponChange_weaponChange;
}
;// ./src/armor/activeSkillEls.js


const { skills: activeSkillEls_skills } = window.thisKey.types;

function getCurrentArmorSkills(skillList = {}) {
   // if (!window.thisKey.armor) return;
   get.armorTypes().forEach(armorType => {
      get.$$(`section.${armorType} .skillDiv>output`).forEach(option => {
         if (!option.textContent) return;

         const skill = activeSkillEls_skills.removeFormatting(option.textContent, "name");
         const level = +option.textContent.slice(-2);
         if (level) {
            skillList[skill] = (skillList[skill] || 0) + level;
         }
      });
   });

   return skillList;
}

function getCurrentDecoSkills(skillList = {}) {
   get.$$("select.armorDisplay, #charmSkill1,#charmSkill2").forEach(option => {
      if (option.selectedIndex < 1) return;

      const skill = activeSkillEls_skills.removeFormatting(option.selectedOptions[0].textContent, "name");
      const level = +option.selectedOptions[0].textContent.slice(-2);
      if (level > 0) {
         skillList[skill] = (skillList[skill] || 0) + level;
      }
   });

   return skillList;
}

const frostCraftArrays = [
   ["Inactive"],
   ["Lvl-1", "Inactive"],
   ["Lvl-2", "Lvl-1", "Inactive"],
   ["Lvl-3", "Lvl-2", "Lvl-1", "Inactive"],
];

const createActiveSkills = (dontRemake = false) => {
   let containingOutput = "";
   const currentSkills = getCurrentDecoSkills(getCurrentArmorSkills());
   const sortedSkills = Object.entries(currentSkills).sort();
   const equippedSkillDisplay = document.querySelector("#EquippedSkillDisplay>output");
   let nodeList = Object.values(equippedSkillDisplay.children);
   let index = 1;

   for (let [name, value] of sortedSkills) {
      const maxLevel = activeSkillEls_skills[name].maxLevel;
      if (maxLevel < value) {
         value = maxLevel;
      }

      if (!dontRemake && window.selectedSkills[name] >= 0) {
         // finds correct element in list without starting from the beginning every time
         while (activeSkillEls_skills.removeFormatting(nodeList[index].textContent, "name") !== name) {
            // safety precaution, but shouldn't be used "Error Handling"
            if ((index += 2) >= nodeList.length) index = 1;
         }

         if (name !== "Frostcraft") {
            containingOutput += getStandardSkillEl(nodeList, index, value);
         } else {
            containingOutput += getFrostcraftEl(nodeList, index, value);
         }

         continue;
      }

      let buttonState = "Active";
      let buttonStates = ["Active", "Inactive"];

      if (name === "Dereliction") {
         buttonStates = ["Lvl-3", "Inactive", "Lvl-1", "Lvl-2"];
         buttonState = buttonStates[0];
      } else if (name === "Fortify") {
         buttonStates = ["Inactive", "Lvl-1", "Lvl-2"];
         buttonState = buttonStates[0];
      } else if (name === "Frostcraft") {
         buttonStates = frostCraftArrays[Math.min(3, +value)];
         buttonState = buttonStates[0];
      } else if (name === "Strife") {
         buttonStates = ["High", "Low", "Inactive"];
         buttonState = buttonStates[0];
      } else if (name === "BloodAwakening") {
         buttonStates = ["Inactive", "High", "Low"];
         buttonState = buttonStates[0];
      }

      containingOutput += `<button type="button" class="toggle${buttonState !== "Inactive" ? " selected" : ""}" aria-pressed="false" data-state="0" onclick="let states = ${JSON.stringify(buttonStates).replace(/"/g, "'")};
         let index = (+this.dataset.state + 1) % ${buttonStates.length};
         this.textContent = states[index]; 
         this.dataset.state = index;"
         >${buttonState}</button><output>${activeSkillEls_skills.formatName(name)}: ${+value}</output>`;
   }

   equippedSkillDisplay.innerHTML = containingOutput;
   checkIfOverLimit(currentSkills);
};

function getStandardSkillEl(nodeList, index, value) {
   if (+nodeList[index].textContent.at(-1) !== value) {
      // if the level has changed we just replace the old with the new
      nodeList[index].textContent = nodeList[index].textContent.slice(0, -1) + value;
   }

   return `${nodeList[index - 1].outerHTML} ${nodeList[index].outerHTML}`;
}

function getFrostcraftEl(nodeList, index, value) {
   let previousLevel = nodeList[index - 1].textContent.slice(-1);
   let newArr = frostCraftArrays[Math.min(3, value)];
   let newIndex = !(previousLevel >= 0) ? newArr.length - 1 : Math.max(0, value - previousLevel);
   nodeList[index].textContent = nodeList[index].textContent.slice(0, -1) + value;
   return `<button type="button" aria-pressed="false" data-state="${newIndex}" onClick="let states = ${JSON.stringify(newArr).replace(/"/g, "'")}; let index = (+this.dataset.state + 1) % ${newArr.length}; this.textContent = states[index]; this.dataset.state = index;">${newArr[newIndex]}</button>${nodeList[index].outerHTML}`;
}

function checkIfOverLimit(currentSkills) {
   for (let el of get.$$("#EquippedSkillDisplay>output>output")) {
      const name = activeSkillEls_skills.removeFormatting(el.textContent, "name");
      el.classList.toggle("overLimit", currentSkills[name] > activeSkillEls_skills[name].maxLevel);
   }
}

console.log("activeSkills.js");

;// ./src/main/buildDamageTable.js






const buildDamageTable_weaponChange = getWeaponChange();

function buildDamageTable(myDamage, id) {
   const isBowGun = get.elValue("dropWeaponType").includes("BowGun");

   const currentAmmoTableStyle =
      !document.getElementById("ammoTable").classList.contains("augInvis") && isBowGun;

   const currentDamageTableStyle =
      document.getElementById("dpsTable").classList.contains("augInvis") || !isBowGun;

   const inputs = get.$$("#dpsTable tr.tableRowMelee").map(el => el.children);

   let cbRestriction =
      buildDamageTable_weaponChange.weaponType !== "ChargeBlade" ||
      window.thisKey.ChargeBlade.weapons[get.elValue("previousWeapon")]?.phialType ===
         buildDamageTable_weaponChange.weapon.phialType;

   // Gunlance rows depend on the shelling type and level, so a different shelling needs a new table
   const previousGunlance = window.thisKey.Gunlance.weapons[get.elValue("previousWeapon")];
   const glRestriction =
      buildDamageTable_weaponChange.weaponType !== "Gunlance" ||
      previousGunlance?.shellingType === buildDamageTable_weaponChange.weapon.shellingType &&
         previousGunlance?.shellingindex === buildDamageTable_weaponChange.weapon.shellingindex;

   const reuseTable =
      inputs.length &&
      glRestriction &&
      get.elValue("previousWeaponType") === buildDamageTable_weaponChange.weaponType &&
      cbRestriction &&
      (get.elValue("previousWeapon") === get.el.weapon.value || buildDamageTable_weaponChange.weaponType !== "Bow") &&
      window.event?.target?.id !== "BowChargePlus";

   if (reuseTable) {
      resetTable(myDamage, inputs, isBowGun);
   } else {
      const oldBody = document.querySelector(`#${id}Body`);
      const newBody = document.createElement("tbody");
      newBody.id = `${id}Body`;
      const myHeaders = myDamage.splice(0, 1);
      const newHead = document.querySelector(`#${id}Head`);
      newHead.className = isBowGun ? "tableRowRanged" : "tableRowMelee";
      newHead.id = `${id}Head`;
      let headStr = "";
      myHeaders[0].forEach(headerText => {
         headStr +=
            Array.isArray(headerText) ?
               `<label class="${headerText[2] ?? ""}" data-tooltip="${headerText[1]}">${headerText[0]}</label>`
            :  `<label>${headerText}</label>`;
      });

      newHead.innerHTML = headStr;
      let k = 0;

      for (const attack of myDamage) {
         const row = document.createElement("tr");
         row.className = isBowGun ? "tableRowRanged" : "tableRowMelee";

         for (let i = 0; i < Object.values(attack).length; i++) {
            const text = Object.values(attack)[i];
            let cell = document.createElement(isBowGun && i === 0 ? "label" : "div");

            if (isBowGun || i > 1) {
               cell.textContent = text;
            } else if (i) {
               cell.innerHTML = `<button type="button" aria-pressed="false" id="${k}" class="inputButton dec"
                      >&#8681</button><button type="button" aria-pressed="false" id="${k}" class="inputButton inc"
                      >&#8679</button><output class="label">${text}</output>`;

               cell.id = `b${k}`;
               cell.className = `b ${k} inputContainer`;
            } else {
               const input = document.createElement("input");
               input.type = "number";
               input.max = "20";
               input.ariaLabel = k ? "Add Skill To Combo" : "Combo Repeat All";
               input.className =
                  k === 0 ? `inputComboRepeat a ${k} inputs` : `hitsOfSharpInputs a ${k} inputs`;

               input.min = k ? "0" : "1";
               input.value = k ? "0" : "1";
               cell.appendChild(input);
               cell.className = `a ${k}`;
            }

            row.appendChild(cell);
         }

         newBody.appendChild(row);
         k++;
      }

      oldBody.replaceWith(newBody);
      newBody.className = isBowGun ? "rangedTable" : "meleeTable";
      document.getElementById("damageContainer").className = isBowGun ? "rangedContainer" : "meleeContainer";
      document.getElementById("ammoTable").classList.toggle("augInvis", currentAmmoTableStyle);
      document.getElementById("dpsTable").classList.toggle("augInvis", !currentDamageTableStyle);

      if (!isBowGun) document.getElementById("ammoTable").classList.add("augInvis");

      set.elValue("previousWeapon", get.el.weapon.value);
      set.elValue("previousWeaponType", buildDamageTable_weaponChange.weaponType);
   }

   if (!isBowGun) {
      document.querySelectorAll(".inputs").forEach(el => {
         const shouldHave =
            document.getElementById("filterTable").classList.contains("selected") && el.value == 0;

         el.parentElement.parentElement.classList.toggle("augInvis", shouldHave);
      });
   }
}

function resetTable(damageArray, damageTable, isBowGun) {
   let initialIndex = isBowGun ? 1 : 2;

   for (let i = 0; i < damageTable.length; ++i) {
      for (let j = initialIndex; j < damageTable[i].length; j++) {
         damageTable[i][j].textContent = damageArray[i + 1][j];
      }
   }
}

;// ./src/main/resetSkillDescription.js


let lastEvent = "";
let resetSkillDescription_weaponType = document.getElementById("dropWeaponType");

function resetSkillDescription() {
   if (
      lastEvent === "" ||
      lastEvent === document.getElementById("BowCoating") && resetSkillDescription_weaponType.value !== "Bow"
   ) {
      return;
   }

   let theseOptions = [];
   if (Object.values(lastEvent.children).some(x => x.tagName === "OPTGROUP")) {
      theseOptions = document.querySelectorAll(`${lastEvent.id}>*>*`);
      theseOptions.splice(-2);
      theseOptions.splice(0, 0, lastEvent[0]);
   } else {
      theseOptions = Object.values(lastEvent.children);
   }

   theseOptions.forEach((thisOption, index) => {
      let newText;
      if (lastEvent === document.getElementById("BowCoating")) {
         newText = getWeaponMR().coatings[index];
      } else if (lastEvent === document.getElementById("BowgunBarrel")) {
         newText = ["----", "Long", "Power", "Silencer", "Guard-Up"][index];
      } else if (lastEvent === document.getElementById("Dereliction")) {
         newText = [
            "----",
            "Lv-1-1",
            "Lv-1-2",
            "Lv-1-3",
            "Lv-2-1",
            "Lv-2-2",
            "Lv-2-3",
            "Lv-3-1",
            "Lv-3-2",
            "Lv-3-3",
         ][index];
      } else {
         let skillLvl = index;
         if (lastEvent.children[1].tagName === "OPTGROUP" && index !== 0) {
            if (lastEvent.id === "Burst" && index >= 2) {
               skillLvl = index - 1;
            } else {
               skillLvl = index % 3 === 0 ? 3 : index % 3;
            }
         }

         newText = lastEvent.id === "Burst" && index === 1 ? "Base Bonus" : `Lv-${skillLvl}`;
      }

      thisOption.textContent = index === 0 ? "----" : newText;
   });

   lastEvent = "";
}

document.querySelectorAll(".buildSkills").forEach(x =>
   x.addEventListener("mousedown", e => {
      if (lastEvent !== "" && lastEvent === e?.target && !e.target.className.includes("augment")) {
         return;
      }

      if (lastEvent !== "") {
         resetSkillDescription();
      }

      if (e.target.classList.contains("skillArr")) {
         setSkillDescriptions(e?.target);
      }

      if (e.target.tagName === "INPUT" && e.target.className.includes("skillInput")) {
         lastEvent = e.target;
      }
   })
);

function setSkillDescriptions(thisSkill) {
   if (thisSkill.classList.contains("skillArr") && Array.isArray(window.thisKey.skills[thisSkill.id])) {
      window.thisKey.skills[thisSkill.id].forEach((statInc, index) => {
         let option;
         if (index === 0) {
            option = thisSkill.id;
         } else if (thisSkill.id === "RecoilDown" || thisSkill.id === "ReloadSpeed") {
            option = `${thisSkill.id.slice(0, 6)} ${thisSkill.id.slice(6)} +${index}`;
         } else if (thisSkill.id === "AmmoUp" || thisSkill.id === "SpareShot") {
            const inc =
               thisSkill.id === "AmmoUp" ?
                  ["No Change", "Lv2 & Ele Ammo", "Lv3 & Dragon Ammo"]
               :  ["Spare Shot +5%", "Spare Shot +10%", "Spare Shot +20%"];

            option = `${index}: ${inc[index - 1]}`;
         } else if (thisSkill.id === "Marksman") {
            option = `${index}: ${
               [
                  "Chance 20% Raw + 5% EFR +1%",
                  "Chance 20% Raw +10% EFR +2%",
                  "Chance 60% Raw + 5% EFR +3% ",
                  "Chance 40% Raw +10% EFR +4%",
               ][index - 1]
            }`;
         } else if (thisSkill.id === "Bombardier") {
            option =
               resetSkillDescription_weaponType.value === "HeavyBowGun" ?
                  [
                     "Bombardier",
                     "1: Raw + 10% EFR + 10%",
                     "2: Sticky+10% Wyvern+15%",
                     "3: Raw + 20% EFR + 16%",
                     "4: Raw + 25% EFR + 17%",
                  ][index]
               :  `${index}: Raw +${window.thisKey.skills.Bombardier[index].PRM}% EFR +${window.thisKey.skills.Bombardier[index].EFR}`;
         } else if (thisSkill.id === "BowgunBarrel") {
            option = [
               "Barrels",
               "Long: Raw + 5%",
               "Power: Raw + 12.5%",
               "Silencer: Recoil Down +1",
               "Shield: Guard Up",
            ][index];
         } else if (thisSkill.id === "CriticalFirePower") {
            option = ["-", "Normal +30% Spread +20% Pierce +10% Recoil -2"][index];
         } else {
            option = applyDescription(statInc, thisSkill, option, index);
         }

         if (!window.thisKey.descriptions[thisSkill.id]) {
            window.thisKey.descriptions[thisSkill.id] = [];
         }

         window.thisKey.descriptions[thisSkill.id].push(option);
         thisSkill.options[index].textContent = option;
      });

      lastEvent = thisSkill;
   }
}

function applyDescription(statInc, thisSkill, option, index) {
   let raw = applyRawDescription(statInc, thisSkill);
   const ele = applyEleDescription(statInc);

   const aff =
      statInc.aff > 0 && /\d\.?\d/.test(statInc.aff) ? `Aff+${statInc.aff}`
      : statInc.aff > 0 ? `Aff + ${statInc.aff}`
      : "";

   raw =
      Object.prototype.hasOwnProperty.call(statInc, "Sharp") && statInc.Sharp < 1 ?
         `Sharp +${statInc.Sharp * 100}%`
      :  raw;

   raw =
      Object.prototype.hasOwnProperty.call(statInc, "Sharp") && statInc.Sharp > 1 ?
         `Sharp +${statInc.Sharp}`
      :  raw;

   raw = raw === "" && ele === "" && aff === "" ? "No Change" : raw;
   if (thisSkill === document.getElementById("BowCoating")) {
      const text = getWeaponMR().coatings;
      return `${text[index]}: ${[raw, ele, aff].join(" ")}`;
   }

   let skillLvl = index + 0;
   if (thisSkill.children[1].tagName === "OPTGROUP" && index !== 0) {
      if (thisSkill.id === "Burst" && index >= 2) {
         skillLvl = index - 1;
      } else {
         skillLvl = index % 3 === 0 ? 3 : index % 3;
      }
   }

   return `${skillLvl}: ${[raw, ele, aff].join(" ")}`;
}

function applyEleDescription(statInc) {
   let ele = "";
   if (statInc.BE > 0 || statInc.PEM > 1 || statInc.BEM > 1) {
      ele = "Ele";
      if (statInc.BE > 0) {
         ele += /\d\.?\d/.test(statInc.BE) ? `+${statInc.BE}` : ` + ${statInc.BE}`;
      }

      if (statInc.BEM > 1) {
         const bem =
            /\.[1-8]/.test((statInc.BEM - 1) * 100) ?
               ((statInc.BEM - 1) * 100).toFixed(1)
            :  ((statInc.BEM - 1) * 100).toFixed(0);

         ele += /\d\.?\d/.test(bem) ? `+${bem}%` : ` + ${bem}%`;
      }

      if (statInc.PEM > 1) {
         const pem =
            /\.[1-8]/.test((statInc.PEM - 1) * 100) ?
               ((statInc.PEM - 1) * 100).toFixed(1)
            :  ((statInc.PEM - 1) * 100).toFixed(0);

         ele += /\d\.?\d/.test(pem) ? `+${pem}%` : ` + ${pem}%`;
      }
   }

   return ele;
}

function applyRawDescription(statInc, thisSkill) {
   let raw = "";
   if (statInc.BR > 0 || statInc.PRM > 1 || statInc.BRM > 1) {
      raw = "Raw";
      if (statInc.BR > 0) {
         raw += /\d\.?\d/.test(statInc.BR) ? `+${statInc.BR}` : ` + ${statInc.BR}`;
      }

      if (statInc.BRM > 1) {
         const brm =
            /\.[1-8]/.test((statInc.BRM - 1) * 100) ?
               ((statInc.BRM - 1) * 100).toFixed(1)
            :  ((statInc.BRM - 1) * 100).toFixed(0);

         raw += /\d\.?\d/.test(brm) ? `+${brm}%` : ` + ${brm}%`;
      }

      if (statInc.PRM > 1) {
         const prm =
            /\.[1-8]/.test((statInc.PRM - 1) * 100) ?
               ((statInc.PRM - 1) * 100).toFixed(1)
            :  ((statInc.PRM - 1) * 100).toFixed(0);

         raw +=
            thisSkill.id === "CriticalBoost" && /\d\.?\d/.test(prm - 25) ? `+${prm - 25}%`
            : thisSkill.id === "CriticalBoost" ? ` + ${prm - 25}%`
            : /\d\.?\d/.test(prm) ? `+${prm}%`
            : ` + ${prm}%`;
      }
   }

   return raw;
}

document.querySelector("#extraMenus").addEventListener("hover", (e) => {
   if (e.target.classList.includes("click")) {
      let id =
         e.target.tagName === "LABEL" ? e.target.children[0].id : e.target.id;
   }
});

;// ./src/setBuilder/getBestArmors.js


function getBestArmors(buildObj) {
   const pointsPerDecoSlot = [1.25, 6, 5.5, 11.75];
   let { allArmors, skills, skillLevels } = buildObj;
   // collect list of requested Skills
   const armors = {};
   // Adds skill points if Stormsoul 4/5 is selected
   const stormSoul = skillLevels[110] - 3;
   get.armorTypes().forEach(armorType => {
      let armorArr = [];

      for (let armorIndex = 0; armorIndex < allArmors[armorType].length; armorIndex++) {
         const thisPiece = allArmors[armorType][armorIndex];

         if (thisPiece.sex === 1) continue;

         const requested = [];
         const fodder = [];
         let usedFodderCount = 0;
         let armorRating = 0;
         const innate = [];
         const armorsUsedSkills = [...Object.entries(thisPiece.skills)];
         const armorDecos = [...thisPiece.decos];
         const augs = new Uint8Array(9);
         const decoAugs = thisPiece.decoAugs ? [...thisPiece.decoAugs] : "";
         let qurious = thisPiece.qurious;
         if (decoAugs) {
            augs[8] -= decoAugs.length + 1;
            decoAugs.forEach(aug => {
               ++armorDecos[aug];
               if (aug) --armorDecos[aug - 1];
            });

            qurious -= decoAugs.length * 6;
         }

         // Applies and gets the total weighed value for deco slots
         for (let j = 0; j < 4; j++) {
            armorRating += armorDecos[j] * pointsPerDecoSlot[j];
         }

         if (stormSoul > 0) {
            for (let i = 0; i < armorsUsedSkills.length; i++) {
               armorsUsedSkills[i][1] += stormSoul;
            }
         }

         if (thisPiece.qTable !== 13) {
            let augCount = 6;

            // for each innate skill
            for (let j = 0; j < armorsUsedSkills.length; j++) {
               // format key
               let [skillId, pointsOnArmor] = [+armorsUsedSkills[j][0], armorsUsedSkills[j][1]];
               innate[j] = skillId;
               let pointsNeeded = Math.min(pointsOnArmor, skillLevels[skillId] || 0);
               pointsOnArmor -= pointsNeeded;

               // if is requested skill;
               if (pointsNeeded) {
                  // subtract points used
                  requested.push(skillId);
                  let skill = skills[skillId];
                  let limitedSourceCount = +!skill.charm + +(!skill.qurious && !skill.decos);

                  switch (limitedSourceCount) {
                     // insures any armors with any requested armor only skills are included
                     case 2:
                        armorRating += pointsNeeded * 50;
                        break;

                     // for any armors that have requested skills that have limited sources
                     case 1:
                        armorRating += pointsNeeded * 25;
                        break;

                     // gives it points based on the deco slot required to gain the skillskill.svgaults to level 2
                     default:
                        armorRating +=
                           pointsNeeded *
                           pointsPerDecoSlot[skill.decos && skill.decos[0] > 0 ? skill.decos[0] - 1 : 1];

                        break;
                  }
               }

               // use any remaining points for fodder
               while (pointsOnArmor--) {
                  // if under 2 or if slot augment wasn't used allow the 3ed
                  if (augCount < 8 || augCount === 8 && !decoAugs) {
                     // add points for -skill augment and the augment
                     qurious += 10;
                     augs[augCount++] = skillId;
                  } else {
                     fodder[usedFodderCount++] = skillId;
                  }
               }
            }

            // Fill the unused starting augments with -Defense. Skill id 0 (Attack Boost) is a real entry, so the
            // check goes by how many were filled, not by the value. The last one is the slot augment when it exists.
            for (let j = augCount; j < 9; j++) {
               if (j === 8 && decoAugs) continue;

               qurious += 5;
               augs[j] = 255;
            }
         }

         armorRating += ~~(qurious / 3);
         let i = armorArr.length;

         // if the armor is not in the top 15 for this type we move on to the next armor
         if (i < 12 || armorRating >= 37 || armorArr[i - 1].armorRating < armorRating) {
            if (i >= 12 && armorArr[i - 1].armorRating < armorRating) --i;

            while (i && armorArr[i - 1].armorRating < armorRating) {
               armorArr[i] = armorArr[--i];
            }

            requested.sort((a, b) => skills[b].qurious - skills[a].qurious);
            armorArr[i] = {
               name: armorIndex,
               type: armorType,
               decos: armorDecos,
               augsPointer: 3,
               augs,
               decoAugs,
               budget: 0,
               baseBudget: qurious,
               skills: Object.fromEntries(armorsUsedSkills),
               skillLen: 0,
               len: armorsUsedSkills.length,
               usedSkills: requested,
               baseSkills: innate,
               fodder: usedFodderCount ? fodder : "",
               fodderPointer: 0,
               fodderCount: usedFodderCount ? fodder.length : "",
               armorRating,
            };

            if (thisPiece.qTable === 13) {
               // narwa ibushi armor only
               armorArr[i].decos.map((el, index) => el = [1, 1, 0, 1][index]);
               armorArr[i].baseBudget = 0;
               armorArr[i].pointer = 5;
               armorArr[i].augs = new Uint8Array([255, 255, 255, 255, 252, 253, 255, 255, 255]);
            }
         }
      }

      armors[armorType] = armorArr;
   });

   return armors;
}

;// ./src/setBuilder/getSkillInfo.js
/**
 * - Map of skillId to array of skill info
 * @typedef {Map<number, Array>} skillMap
 * @property {number} 0 - skill Id
 * @property {number} 1 - points needed
 * @property {number} 2 - qurious cost
 * @property {number[]} 3 - deco array [startingLevel, lvl1, lvl2, lvl3, lvl4]
 */
/**
 * @function getSkillInfo
 * @param buildObj
 * @type {import("../webWorker/skillClass").SkillArr} buildObj
 * @property {skillMap} skillMap
 * @returns {{skillBuffer: {skillBuffer: ArrayBufferLike, infoBuffer: Int8Array}, skillMap: {skillMap}
 */
const getSkillInfo = buildObj => {
   const { skills, skillLevels } = buildObj;

   const skillEntries = Object.entries(skillLevels).sort((a, b) => {
      if (!a[2]) {
         a[2] = skills[a[0]].qurious || 6;
         a[3] = skills[a[0]].decos ? skills[a[0]].decos[0] : 5;
         a[4] = skills[a[0]].decos ? skills[a[0]].decos[4] : 5;
      }

      if (!b[2]) {
         b[2] = skills[b[0]].qurious || 6;
         b[3] = skills[b[0]].decos ? skills[b[0]].decos[0] : 5;
         b[4] = skills[b[0]].decos ? skills[b[0]].decos[4] : 5;
      }

      return a[2] - b[2] || a[3] - b[3] || a[4] - b[4];
   });

   const skillMap = {  };
   const skillBuffer = new Uint16Array(skillEntries.length * 8);
   const infoBuffer = new Int8Array(skillEntries.length * 4);
   let bufferPointer = 0;
   let charmPointer = 0;
   /**
    * @property {string} skillName
    * @property {number} pointsNeeded
    */
   skillEntries.forEach(([skillName, pointsNeeded]) => {
      const { id, decos, qurious, charm, maxLevel } = skills[skillName];
      skillMap[skills[skillName].id]= {pointsNeeded, info:skills[skillName] };
      const quriousCost = qurious || 0;
      const minSlotLevel = decos && decos[0] < 4 ? decos[0] : 0;
      const pointsForLvl4Slot = decos ? decos[4] : 0;

      const shouldUseLvl4Slot =
         pointsForLvl4Slot &&
         pointsNeeded >= pointsForLvl4Slot &&
         quriousCost >= 9 &&
         (pointsForLvl4Slot > 1 || !qurious && !decos);

      // const skillsArr = skillBuffer.subarray(bufferPointer, bufferPointer += 8);
      skillBuffer[bufferPointer++] = pointsNeeded;
      skillBuffer[bufferPointer++] = pointsNeeded;
      skillBuffer[bufferPointer++] = quriousCost;
      skillBuffer[bufferPointer++] =
         shouldUseLvl4Slot ? 4
         : !decos || minSlotLevel === 3 || quriousCost < 9 ? 0
         : 5;

      skillBuffer[bufferPointer++] = pointsForLvl4Slot;
      skillBuffer[bufferPointer++] = minSlotLevel;
      skillBuffer[bufferPointer++] = decos && minSlotLevel < 3 ? decos[minSlotLevel + 1] : 0;
      skillBuffer[bufferPointer++] = id;
      //     returnVal.skillObj.skills.push(skillsArr);
      infoBuffer[charmPointer] = pointsNeeded;
      infoBuffer[charmPointer + 1] = pointsNeeded - maxLevel;
      //

      if (charm && (!decos && !qurious || charm[0] * quriousCost >= 18)) {
         if (charm[0] <= pointsNeeded || !quriousCost) {
            infoBuffer[charmPointer + 2] = charm[0];
            infoBuffer[charmPointer + 3] = charm[1];
         } else if (charm[1] <= pointsNeeded || !quriousCost) {
            // limits to one charm combo, the 10 will make it skip that iteration for the opposite slot
            infoBuffer[charmPointer + 3] = charm[1];
         }
      }

      charmPointer += 4;
   });

   return { skillBuffer: { skillBuffer: skillBuffer.buffer, infoBuffer }, skillMap };
};

;// ./src/setBuilder/decoPlanner.js
/**
 * Pure helpers for placing decorations when a set from the set finder is equipped.
 * Kept free of DOM access so they can be unit tested.
 */

/**
 * Works out which decorations to slot for one skill.
 *
 * A decoration can go in any slot of its own level or higher, so when the remaining points are fewer than
 * a bigger decoration gives, a smaller decoration is placed in the bigger slot instead of leaving the skill short.
 *
 * @param {number[]} decos - [lowestDecoLevel, pointsLvl1, pointsLvl2, pointsLvl3, pointsLvl4]
 * @param {number} pointsNeeded - Points still needed for the skill.
 * @param {number[]} freeSlots - Free slots per level [lvl1, lvl2, lvl3, lvl4]. Updated in place.
 * @returns {{ placements: Array<[slotLevel: number, points: number]>, remaining: number }}
 */
function planDecorations(decos, pointsNeeded, freeSlots) {
   const placements = [];
   if (!decos || pointsNeeded <= 0) return { placements, remaining: Math.max(0, pointsNeeded) };

   const lowestLevel = decos[0];

   // level 4 decorations that give more than 1 point go in level 4 slots first
   if (decos[4] > 1) {
      while (freeSlots[3] > 0 && pointsNeeded >= decos[4]) {
         --freeSlots[3];
         pointsNeeded -= decos[4];
         placements.push([4, decos[4]]);
      }
   }

   // fill from the lowest usable slot level up
   for (let slotLevel = lowestLevel; slotLevel <= 4 && pointsNeeded > 0; slotLevel++) {
      if (!decos[slotLevel]) continue;

      while (freeSlots[slotLevel - 1] > 0 && pointsNeeded > 0) {
         // The slot is used either way, so use the smallest decoration that finishes the skill, or the biggest
         // one the slot can hold. The old check (points needed >= decoration points) skipped the slot instead,
         // which left the skill one level short whenever only bigger slots were left.
         let points = decos[slotLevel];
         for (let j = lowestLevel; j < slotLevel; j++) {
            if (decos[j] >= pointsNeeded) {
               points = decos[j];
               break;
            }
         }

         --freeSlots[slotLevel - 1];
         pointsNeeded -= points;
         placements.push([slotLevel, points]);
      }
   }

   return { placements, remaining: Math.max(0, pointsNeeded) };
}

/**
 * Orders skills so the ones with the most restrictive decorations are placed first,
 * leaving the higher level slots for the skills that can only use them.
 *
 * @param {Array<{ pointsNeeded: number, info: { decos?: number[] } }>} skills
 */
function orderSkillsForDecorations(skills) {
   return skills.filter(skill => skill.info.decos && skill.pointsNeeded > 0)
      .sort((a, b) => b.info.decos[0] - a.info.decos[0]);
}

/**
 * Max extra levels that can still be added to a skill on top of what is already selected.
 *
 * @param {number} maxLevel - The skill's max level.
 * @param {number} [currentLevel=0] - The level already selected in the set searcher.
 * @returns {number}
 */
function remainingSkillLevels(maxLevel, currentLevel = 0) {
   return Math.max(0, (maxLevel || 0) - (currentLevel || 0));
}

;// ./src/setBuilder/setCreation.js


// import { dataCompile } from "../main/main.js";












const setCreation_weaponChange = getWeaponChange();


const { thisKey: setCreation_thisKey } = window;
// let testCount = 0
// let indexArr = [0.75, 6, 4, 9.5];
// let newTest = [];
// let testRecord = [];
// import {buildTest} from "./testCount.js";
window.descrepecies = [[], [], [], [], []];
let newSkillsCache = {};
const dropWeapon = document.getElementById("dropWeapon");
let totalCombos = 0;
let displayedCombos = 0;
let timer = 0;
let workers = [];
let workerCount = 0;
let setResults = [];
let lastTarget = -1;
let displayedSets = 0;
// let trackEdgeCases = {};
// let setResults = {};
let GlobalFragment = "";
let runChecks = !window.location.origin.includes("github");
let totalSets = 0;

function startWorkers(workerCount, responseHandler) {
   let newWorkers = [];

   for (let j = 0; j < workerCount; j++) {
      newWorkers[j] = new Worker("./webWorker/setBuildWorker.js", { type: "module", name: `${j}` });
      newWorkers[j].addEventListener("message", e => {
         responseHandler(e);
      });
   }

   return newWorkers;
}

/**
 * @returns {{skills: {}, skillLevels: {}, allArmors: {},decoSlots:Array[]}}
 */
function getInitialInfo(armors) {
   const usedSkills = {
      skillLevels: {},
      skills: setCreation_thisKey.types.skills,
      allArmors: armors || setCreation_thisKey.armor,
      decoSlots: [...setCreation_weaponChange.weapon.decos],
   };

   document.querySelectorAll("#searcherSkills>div>output").forEach(skill => {
      const skillId = usedSkills.skills[skill.classList[1]].id;
      usedSkills.skillLevels[skillId] = +skill.textContent.slice(-1);
   });

   /**
    * @property {HTMLSelectElement} el
    */
   document.querySelectorAll(".charmSlot").forEach(el => {
      if (el.selectedIndex > 0) {
         ++usedSkills.decoSlots[el.selectedIndex - 1];
      }
   });

   return usedSkills;
}

async function sendJobs(messageObj) {
   let leg = messageObj.armorObj.armors.leg.splice(0);
   let remainder = leg.length % workerCount;
   let len = ~~(leg.length / workerCount) || 1;

   for (const worker of workers) {
      const toSend = len + +(remainder-- > 0);
      messageObj.armorObj.armors.leg = leg.splice(0, toSend);
      worker.postMessage(messageObj);
   }
}

const getSetBuilds = (armors, charms) => {
   if (runChecks) timer = performance.now();

   const initBuildObj = getInitialInfo(armors);

   if (workers.length) workers.forEach(worker => worker.terminate());

   workerCount = armors ? 1 : 4;
   workers = startWorkers(workerCount, armors ? getSingleSetsResults : handleWorkersResponse);
   const { skillBuffer, skillMap } = getSkillInfo(initBuildObj, charms);
   if (!armors) {
      setResults = [];

      setResults.skills = skillMap;
   }

   const messageObj = {
      skillBuffer,
      setLimiter: 4 - document.getElementById("skillsLimit").selectedIndex,
      armorObj: {
         armors: getBestArmors(initBuildObj),
         decoSlots: initBuildObj.decoSlots,
      },
   };

   // messageObj.runChecks = runChecks;
   sendJobs(messageObj);

   // after initiation reset globals/display loading message while wait for first results
   if (workerCount > 1) resetGlobals(initBuildObj.skillLevels);
};

const resetGlobals = skills => {
   {
      el.setReturn.classList.remove("augInvis");
      el.damageTable.classList.add("augInvis");
      document.getElementById("temp")?.remove();
      el.setOutput.textContent = "Displayed 0 Builds / 0 Combos";
      el.extraOutput.textContent = "Found 0 Builds / 0 Combos";
      el.fodder.innerHTML =
         "<P2 id='temp' style='font-size:18px !important; height:15em !important;'>Searching...</P2>";

      el.grid.innerHTML = "";
      newSkillsCache = {
         remainingSlots: [0, 0, 0, 0],
         armorSkills: {},
         quriousSkills: [0, 0, 0, 0, 0],
         allSkills: {},
      };

      let skillValues = Object.values(setCreation_thisKey.types.skills);

      for (let i = 0; i < 147; i++) {
         let skill = skillValues[i];
         newSkillsCache.allSkills[skill.id] = {
            name: skill.name,
            // skills holds the level already selected for each skill id, not an object with .points
            max: remainingSkillLevels(skill.maxLevel, skills[skill.id]),
            level: 0,
         };
      }
   }

   displayedSets = 0;
   totalCombos = 0;
   displayedCombos = 0;
   totalSets = 0;
};

const getTotal = () => {
   let skills = setCreation_thisKey.types.skills;
   // const { skills } = getSkillInfo();
   const skillValues = Object.values(skills);
   let { remainingSlots, quriousSkills, allSkills } = newSkillsCache;

   for (let skill of skillValues) {
      if (!skill.decos) continue;

      let starting = skill.decos[0] - 1;

      for (let i = starting; i < 4; i++) {
         if (i < 3) {
            allSkills[skill.id].level = Math.max(
               allSkills[skill.id].level,
               remainingSlots[i] * skill.decos[i + 1]
            );
         } else {
            allSkills[skill.id].level = Math.max(
               allSkills[skill.id].level,
               remainingSlots[i] * skill.decos[4]
            );
         }
      }
   }

   for (const skill of skillValues) {
      if (!skill.qurious) continue;

      let qurious = skill.qurious / 3 - 1;
      let i = 5;
      let max = 0;

      while (i-- >= qurious) {
         if (quriousSkills[i] > max) {
            max = quriousSkills[i];
         }
      }

      if (max > allSkills[skill.id].level) {
         allSkills[skill.id].level = max;
      }
   }

   return Object.values(allSkills)
      .map(skill => [skill.name, Math.min(skill.max, skill.level)])
      .sort();
};

const setOutput = extraSkills => {
   let buttons = "";
   extraSkills.forEach(skill => {
      if (!skill[1]) return;

      buttons += `<button type="button" text="${skill[0]}">${skill[0].replace(/(?<=[a-z])([A-Z])(?![A-Z])/g, " $1")} +${+skill[1]}</button>`;
   });

   if (document.getElementById("temp")) document.getElementById("temp").remove();

   document.querySelector(".extraSkills").innerHTML += buttons;

   if (!window.location.href.includes("github")) {
      console.log((performance.now() - timer) / 1000, totalCombos);
   }
};

// const memo = new Map();
// Cache element lookups
const el = {
   setReturn: document.getElementById("setReturn"),
   damageTable: document.getElementById("damageTable"),
   fodder: document.querySelector(".extraSkills"),
   setOutput: document.getElementById("setOutput"),
   extraOutput: document.getElementById("extraOutput"),
   grid: document.querySelector(".grid"),
};

// Perform operations

const createCharmOptions = charms => {
   let returnVal = "";
   let { skills } = setCreation_thisKey.types;
   let i = 0;

   while (charms[i] !== charms[i + 1]) {
      const primary = skills[charms[i++]];
      const secondary = skills[charms[i++]];
      returnVal += `<option>${primary.name}: ${primary.charm[0]} & ${secondary.name}: ${secondary.charm[1]}`;
   }

   return returnVal;
};

function createArmorImage(armorIds) {
   let armorDisplays = "";
   const types = get.armorTypes();
   for (let i = 1; i < 6; i++) {
      const type = types[i - 1];
      const armorName = setCreation_thisKey.armor[type][armorIds[i]].name;
      armorDisplays += `<img src="./icons/${type}.svg" class="armorImg ${type}"><span>${armorName}</span>`;
   }

   return armorDisplays;
}

function createDisplayElements(sets) {
   for (const set of sets) {
      if (!set.armors[0]) continue;

      // keep one flat list in the same order as the displayed results, so the clicked result is the one equipped
      // (indexing by worker/position assumed every worker returned exactly 5 sets)
      setResults.push(set);

      GlobalFragment += `
            <div class="setResult">
                <button type="button" aria-pressed="false" class="equipBuild">Equip Build</button>
                ${createArmorImage(set.armors)}
                <img src="./icons/charm.svg" class="armorImg charm">
                <select class="armorCharm">${createCharmOptions(set.charms)}</select>
            </div>`;
   }
}

const max = (a, b) => a >= b ? a : b;

function handleWorkersResponse(e) {
   if (e.data) {
      totalCombos += e.data.count.combos;
      totalSets += e.data.count.sets;
      createDisplayElements(e.data.sets);

      for (let thisSet of e.data.sets) {
         if (thisSet?.armors) displayedCombos += thisSet.armors[0];
      }

      displayedSets += e.data.sets.length;
      document.getElementById("extraOutput").textContent =
         `Found ${totalSets.toLocaleString()} Builds / ${totalCombos.toLocaleString()} Combos`;

      document.getElementById("setOutput").textContent =
         `Displayed ${displayedSets} Builds / ${displayedCombos.toLocaleString()} Combos`;

      // sum additional skills
      for (let i = 0; i < 4; i++) {
         newSkillsCache.remainingSlots[i] = max(
            e.data.stats.remainingSlots[i],
            newSkillsCache.remainingSlots[i] || 0
         );
      }

      for (let i = 0; i < 5; i++) {
         newSkillsCache.quriousSkills[i] = max(
            e.data.stats.quriousSkills[i],
            newSkillsCache.quriousSkills[i] || 0
         );
      }

      for (const [skill, lvl] of Object.entries(e.data.stats.armorSkills)) {
         newSkillsCache.allSkills[setCreation_thisKey.types.skills[skill].id].level = max(
            newSkillsCache.allSkills[setCreation_thisKey.types.skills[skill].id].level,
            lvl
         );
      }
   }

   if (--workerCount) return;

   setOutput(getTotal());
   document.querySelector("div.grid").innerHTML = GlobalFragment;
   GlobalFragment = "";
   if (!totalCombos) {
      document.getElementById("setOutput").textContent = "No Results Found";
      document.getElementById("extraOutput").textContent = "No Results Found";
      document.querySelectorAll(".grid>div").forEach(element => element.remove());
   }

   submitForm(performance.now() - timer);
}

function submitForm(duration) {
   const xhr = new XMLHttpRequest();

   const url =
      "https://docs.google.com/forms/d/e/1FAIpQLSe0pQtcmqCLLYNCisWrPV_lMbvN8sk6xKgPe8DUqxuw7gswSg/form" +
      `Response?usp=pp_url&entry.1449573866=${duration}&entry.1540814507=${totalSets}&entry.1449980403=${totalCombos}`;

   xhr.open("POST", url);
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.send();
}

function getSingleSetsResults(e) {
   const thisBuild = setResults[lastTarget];
   thisBuild.decos = e.data.sets[0].decos;
   for (let i = 1; i < 6; i++) {
      e.data.sets[0].armors[i] = thisBuild.armors[i];
   }

   thisBuild.armors = e.data.sets[0].armors;
   const duration = performance.now() - timer;
   console.log(duration / 1000, e.data);
}

const setCharmSelectsForBuilder = (charm, index, totalSkills) => {
   const charmSelects = get.$$("select.charm");

   for (let i = 0; i < 2; i++) {
      // subtract points from the skills requested
      let thisSkill = totalSkills[charm[index]];
      if ((thisSkill.pointsNeeded -= thisSkill.info.charm[i]) <= 0) {
         delete totalSkills[charm[index]];
      }

      // set the charm selectedIndex to the correct skill
      let skillName = setCreation_thisKey.types.skills.formatName(charm[index++]);
      let select = charmSelects[i];

      for (let j = 0; j < select.childElementCount; j++) {
         if (select.options[j].textContent.includes(skillName)) {
            select.selectedIndex = j;
            break;
         }
      }
   }
};

/**
 * - Map of skillId to array of skill info
 * @typedef {Map<number, Array>} remainingSkillsInfo
 * @property {number} 0 - skill Id
 * @property {number} 1 - points needed
 * @property {number} 2 - qurious cost
 * @property {number[]} 3 - deco array [startingLevel, lvl1, lvl2, lvl3, lvl4]
 */
function setDecosForSetBuilder(remainingSkillsInfo) {
   const openSlots = [];
   for (let i = 0; i < 4; i++) {
      const elements = get.$$(`.lvl${i + 1} ~ select`);
      // clear decorations left over from the previous build so they don't add stale skills
      for (const element of elements) element.selectedIndex = 0;

      openSlots[i] = { elements, pointer: elements.length };
   }

   const freeSlots = openSlots.map(slot => slot.pointer);

   for (let { pointsNeeded, info: skill } of orderSkillsForDecorations(Object.values(remainingSkillsInfo))) {
      const formatted = setCreation_thisKey.types.skills.formatName(skill.name);
      const { placements } = planDecorations(skill.decos, pointsNeeded, freeSlots);

      for (const [slotLevel, points] of placements) {
         const slot = openSlots[slotLevel - 1];
         set.selectedIndexByText(slot.elements[--slot.pointer], `${formatted} +${points}`);
      }
   }
}

function getSingleBuild(selectElement) {
   const parentIndex = get.$$(".setResult").indexOf(selectElement.parentElement);
   //
   lastTarget = parentIndex;
   const { charms, armors } = setResults[lastTarget];
   const charmIndex = selectElement.parentElement.lastElementChild.selectedIndex * 2;
   const charmSkills = { [charms[charmIndex]]: 1, [charms[charmIndex + 1]]: 2 };
   const types = get.armorTypes();
   const armorSet = {};
   for (let i = 1; i < 6; i++) {
      armorSet[types[i - 1]] = [setCreation_thisKey.armor[types[i - 1]][armors[i]]];
   }

   getSetBuilds(armorSet, charmSkills);
}

function removeUsedSkills(remainingSkillsInfo) {
   const outputs = get.$$(".armorDisplay:nth-child(n+2) .skillDiv>output");
   for (const el of outputs) {
      if (el.textContent === "") continue;

      const [name, pointsOf] = el.textContent.split(" +");
      const skillId = setCreation_thisKey.types.skills.removeFormatting(name);
      if (!remainingSkillsInfo[skillId]) continue;

      if ((remainingSkillsInfo[skillId].pointsNeeded -= +pointsOf) <= 0) {
         delete remainingSkillsInfo[skillId];
      }
   }
}

// ////////////////////////////////////////////////////////
// //////////  Equip Build   /////////////////////////////
// ///////////////////////////////////////////////////////

function toggleElementsForBuilder(boolean) {
   get.$$("#charmSlots select, #dropWeapon,#dropWeaponType").forEach(el => el.disabled = boolean);
}

function setSelectedBuild(target) {
   const parentIndex = get.$$(".setResult").indexOf(target.parentElement);
   lastTarget = parentIndex;
   const thisBuild = setResults[lastTarget];

   if (!thisBuild) return;

   const charmIndex = target.parentElement.lastElementChild.selectedIndex * 2;
   const remainingSkillsInfo = setResults.skills;
   setCharmSelectsForBuilder(thisBuild.charms, charmIndex, remainingSkillsInfo);
   equipBuild(thisBuild.armors.subarray(6, 36), thisBuild.armors.subarray(1, 6));
   removeUsedSkills(remainingSkillsInfo);
   setDecosForSetBuilder(remainingSkillsInfo);
   set.addClass("setReturn", "augInvis");
   set.removeClass("damageTable", "augInvis");
   toggleElementsForBuilder(false);
   set.removeChildren(".extraSkills");
   createActiveSkills(true);
   updateElementDefense();

   if (runChecks) {
      const selectedSkills = {};
      document.querySelectorAll("#searcherSkills>div>output").forEach(skill => {
         const skillName = skill.className.split(" ")[1];
         selectedSkills[skillName] = { totalPoints: +skill.textContent.slice(-1) };
      });

      let decoSlots = [...setCreation_thisKey[setCreation_weaponChange.weaponType].weapons[dropWeapon.value].decos];
      document.querySelectorAll(".charmSlot").forEach(x => {
         if (x.selectedIndex > 0) {
            ++decoSlots[x.selectedIndex - 1];
         }
      });

      if (window.verifyBuild) {
         window.verifyBuild(thisBuild, thisBuild.armors, selectedSkills, decoSlots);
      }
   }

   document.querySelector("div.grid").innerHTML = "";
   workers.forEach(worker => worker.terminate());
   workers = [];
   console.log(structuredClone(setResults));
   setResults = [];
}

class SelfExtractingArray {
   constructor(array) {
      this.array = array;
      this.pointer = array.length;
   }

   removePoints(toRemove, points) {
      let i = this.array.indexOf(toRemove);
      --this.pointer;
      while (i < this.pointer) {
         this.array[i] = this.array[++i];
      }
   }
}

// const buildTest = {};
//
// export function resetTest() {
//
//    let skillList = Object.entries({ ...thisKey.types.maxLevel });
//
//    // clear olf selections
//    document.getElementById("searcherSkills").innerHTML = "";
//    // generate 15 new selection's and create new elements
//    for (let i = 0; i < 15; i++) {
//       let [skillName, maxLevel] = skillList.splice(~~(skillList.length * Math.random()), 1)[0];
//       createSkillSelections(skillName, maxLevel);
//    }
// }
//
// function sortNfilterTests(newSettings) {
//    let n = testRecord.length;
//    if (n === 10) {
//       if (testRecord[--n][0] >= newSettings[0]) return;
//    }
//
//    while (n > 0 && testRecord[n - 1][0] < newSettings[0]) {
//       testRecord[n] = testRecord[--n];
//    }
//    testRecord[n] = newSettings;
// }
//
// export function buildTest() {
//    if (totalCombos) sortNfilterTests([totalCombos, [indexArr[0], indexArr[1], indexArr[2], indexArr[3]]]);
//
//    if ((indexArr[0] += 0.25) === 1.5) {
//       indexArr[0] = 0.75;
//
//       if ((indexArr[1] += 0.5) === 7.5) {
//          indexArr[1] = 5.5;
//          console.log(testRecord);
//
//          if ((indexArr[2] += 0.5) === 7) {
//             indexArr[2] = 4.5;
//
//             if ((indexArr[3] += 0.5) === 11.5) {
//
//                if (++testCount === 1) {
//                   console.log(testRecord);
//                   return;
//                }
//
//                resetTest();
//             }
//          }
//       }
//    }
//
//    getSetBuilds(undefined, indexArr);
// }
//
// build.usedSkills.forEach(([augName, pointsPer, usedFor, quanityUsed]) => {
//    const points = !quanityUsed ? pointsPer : pointsPer * quanityUsed;
//    if (!buildTest[augName]) {
//       buildTest[augName] = points;
//    } else {
//       buildTest[augName] += points;
//    }
// });

/*
let i = 5;
while (i--) {
   for (let j = i; j < 5; j++) {

      for (let k = j; k < 5; k++) {
         console.log(i + j + k);
      }
   }
}
*/
;// ./src/display/rangedStats.js
const recoil = ["High", "Average", "Some", "Very Low"];
const reload = ["Very Slow", "Slow", "Below Avg.", "Average", "Above Avg.", "Fast"];

const getAmmoTypes = () => [
   ["Normal", "Nor", 3],
   ["Pierce", "Prc", 3],
   ["Spread", "Spr", 3],
   ["Shrapnel", "Shr", 3],
   ["Sticky", "Stk", 3],
   ["Cluster", "Clu", 3],
   ["Poison", "Poi", 2],
   ["Paralysis", "Par", 2],
   ["Sleep", "Sle", 2],
   ["Exhaust", "Exh", 2],
   ["Recover", "Rec", 2],
   ["Fire", "Fir", 2],
   ["Water", "Wat", 2],
   ["Ice", "Ice", 2],
   ["Thunder", "Thu", 2],
   ["Dragon", "Dra", 2],
   ["Slicing", "Sli", 1],
   ["WyvernShot", "Wyv", 1],
   ["Demon", "Dem", 1],
   ["Armor", "Arm", 1],
];

function getAmmoString(ammoTypes, i, returnVal) {
   const ammoType = ammoTypes[i];
   const segment = this.clipSize[ammoType[0]];
   returnVal +=
      `<div class="${segment.every(x => x === 0) ? "empty label" : "label"}"><output class = "ammoType">` +
      `${ammoType[1]}</output><output class ="clipSize">${segment}</output></div>`;

   return returnVal;
}

function getGunStats() {
   let returnVal = `<div class="otherAmmo">${this.getMultiOutput("Recoil", recoil[this.recoil - 1], "extraAmmo label")}
   ${this.getMultiOutput("Reload", reload[this.reload - 1], "extraAmmo label reload")}
   <div id="weaponSpecific">${this.bowGunData()}</div>
`;

   const ammoTypes = getAmmoTypes();
   returnVal += "<div class='ammoStats'>";
   for (let i = 0, len = ammoTypes.length; i < len; i++) {
      returnVal = getAmmoString.call(this, ammoTypes, i, returnVal);
   }

   return `${returnVal.replace(/,/g, "/")}</div>`;
}

;// ./src/display/meleeStats.js


function addSharpnessAugs(sharpness, handicraft) {
   const keysForSharpness = ["purple", "white", "blue", "green", "yellow", "orange", "red"];
   let startingIndex;
   for (let i = 0; i < 7; ++i) {
      if (sharpness[keysForSharpness[i]]) {
         startingIndex = i;
         break;
      }
   }

   let pointsFor = 0;
   for (let color of handicraft) {
      pointsFor += color;
   }

   let returnPoints = pointsFor;
   let handicraftPointer = 0;
   while (pointsFor) {
      const min = Math.min(pointsFor, handicraft[handicraftPointer++]);
      sharpness[keysForSharpness[startingIndex--]] += min;
      pointsFor -= min;
   }

   return [sharpness, returnPoints];
}

function specialType(weapon, weaponType) {
   const returnVal = "<output class='attackType label'>";
   return (
      weaponType === "ChargeBlade" || weaponType === "SwitchAxe" ?
         `${returnVal + weapon.phialType.split(" ")[0]}</output>`
      : weaponType === "Gunlance" ?
         `${returnVal}${weapon.shellingType.replace(/Normal/, "Norm")} ${weapon.shellingindex}</output>`
      :  ""
   );
}

function getSharpnessBar(sharpness, pointsUsed) {
   let returnVal = "";
   for (let [color, value] of Object.entries(sharpness)) {
      let width = value / pointsUsed * 100;
      returnVal += `
      <div class="segment" style="background-color: ${color}; width:${width}%" title="${color}: ${value}"></div>
    `;
   }

   return returnVal;
}

const shots = {
   Spread: "Spr",
   Rapid: "Rpd",
   Pierce: "Prc",
   None: "",
};

function getShotTypes(types, initialCount) {
   let returnVal = '<div class="shotTypes">';
   for (let i = 0, len = initialCount; i < len; i++) {
      const type = `${i + 1}:${shots[types[i].slice(0, -1)]} ${types[i].at(-1)}`;
      returnVal += `<output class="${i + 1 < initialCount ? "labelWiki" : "empty"}">${type}</output>`;
   }

   return `${returnVal}</div>`;
}

function getBowStats(weapon) {
   let returnVal = `${getShotTypes(weapon.bowShot, weapon.baseCharge)}<div class="coatingsWiki">`;
   for (const coating of weapon.coatings) {
      returnVal +=
         coating.at(-1) === "+" ?
            getLayeredIcons(`Coating_${coating.slice(0, -1)}`, "Coating_Plus", "bottomRight")
         :  getImage(`Coating_${coating}`);
   }

   return `${returnVal}</div></div>`;
}

function getMeleeStats(weapon) {
   const { sharpness, handicraft } = weapon;
   if (!(handicraft?.length > 0)) return getBowStats(weapon);

   let [sharpnessAfter, pointsUsed] = addSharpnessAugs({ ...sharpness }, handicraft);

   // Calculate total
   for (let value of Object.values(sharpness)) {
      pointsUsed += value;
   }

   return `
      ${specialType(weapon, weapon.weaponType)}
    <div class="sharpnessBarWrapper">
      <div class="sharpnessBar top">${getSharpnessBar(sharpness, pointsUsed)}</div>
      <div class="sharpnessBar bottom">${getSharpnessBar(sharpnessAfter, pointsUsed)}</div>
    </div>
  `;
}

;// ./src/display/getWeaponDisplay.js








const eleBonus = {
   GreatSword: 30,
   Hammer: 30,
   lance: 21,
   Gunlance: 21,
};

const sharpnessBonus = Object.values(window.thisKey.skills.Sharpness).slice(0, 7);

/**
 * @class TableRow
 * @property {number} baseRaw
 * - the base raw
 * @property {number} eleType
 * - the element type
 * @property {number} baseEle
 * - the base element
 * @property {number} aff
 * - the affinity
 * @property {array<number>} decoSlots
 * - the decoration slots
 * @property {object} handicraft
 * - the hits of sharpness that could be added
 * @property {object} sharpness
 * - hits of sharpness per color
 * @property {Int8Array} clipSize
 * - array containing the ammo clip sizes
 * @property {array<string>} isRapidFire
 * - array of strings for any ammo type that is Rapid Fire
 * @property {Object} weapons
 * - All weapons of the selected type
 * @property {String} weaponType
 * - The type of weapon selected
 * @property {Boolean} isBowgun
 * - Whether the weapon type is a BowGun
 * @property {Boolean} applyAugments
 * - Whether to apply augments to the weapon's stats
 */

class TableRow {

   /**
    * @param {import("./filterNsort.js").FilterSettings} container
    * @param {Object} weapon
    * @param {number} index
    * - the index of the weapon
    */

   constructor(weapon, index, container) {
      Object.assign(this, { ...container, ...weapon });
      this.weaponIndex = index;
      this.name = this.reverseString(this.weapon);
      this.bonus = this.bonusStats();
      this.raw = this.applyAugments ? this.bonus.raw : this.baseRaw;
      this.ele = this.applyAugments ? this.bonus.ele : this.baseEle;
      this.initStats();
      this.el = this.generateRow(index);
   }

   reverseString(str) {
      let j = str.length;
      this. passedFiler = j;
      let returnStr = "";
      while (j--) {
         returnStr += str[j];
      }

      return returnStr;
   }

   getMeleeDamageOutputs = () => {
      const rawOutput = this.getMultiOutput(this.baseRaw, this.bonus.raw, "rawWiki");
      const weaponIcon = getLayeredIcons(this.weaponType, this.eleType, "bottomLeft");
      const eleOutput = this.getMultiOutput(
         this.baseEle,
         this.bonus.ele,
         `${this.isEmpty(this.baseEle)} eleWiki`,
      );

      return rawOutput + weaponIcon + eleOutput;
   };
   getRangedDamageOutputs = () => {
      const rawOutput = this.getMultiOutput(this.baseRaw, this.bonus.raw, "rawWiki");
      const weaponIcon = getImage(this.weaponType);
      return rawOutput + weaponIcon;
   };

   getMeleeAttack() {
      return `${getLayeredIcons(this.weaponType, this.eleType, "bottomLeft")} 
                     ${this.getMultiOutput(this.baseEle, this.bonus.ele, `${this.isEmpty(this.baseEle)} eleWiki`)}`;
   }

   generateRow(index) {
      const aff = this.aff;
      // language=HTML
      return `<section data-index="${index}" class="${this.rowClass}">
                     <label class="labelWiki">${this.weapon}</label>
                     <div class="damageWiki">
                        ${this.isBowgun ? this.getRangedDamageOutputs() : this.getMeleeDamageOutputs()}
                     </div>
                     <div class="affinityWiki">
                        ${getImage("affinity", this.isEmpty(aff))}
                        <output class="affWiki${this.getAffClassName(aff)}">${aff}</output>
                     </div>
                     ${this.getDecos()}
                     ${this.extraStats(this, this.bowGunData)}
                  </section>`.replace(/\n|\s{2}/g, "");
   }

   getAffClassName(aff) {
      return (
         !aff ? " empty"
            : aff < 0 ? " negative"
               : ""
      );
   }

   formatRapidFire(ammoName) {
      if (!ammoName) return "";

      let returnSting = "";
      for (let subString of ammoName.split(" ")) {
         returnSting +=
            subString === "Normal" ? "Nrm "
               : subString === "Pierce" ? "Prc "
                  : `${subString.slice(0, 3)} `;
      }

      return returnSting.trim();
   }

   lightBowGunData() {
      return !this.isRapidFire.length ?
         "<output class=\"empty\">Rapid Fire</output>"
         : this.getMultiOutput("Rapid Fire", this.formatRapidFire(this.isRapidFire[0]), "label") +
         this.getMultiOutput(
            this.formatRapidFire(this.isRapidFire[1], "", " "),
            this.formatRapidFire(this.isRapidFire[2], "", " "),
         );
   }

   heavyBowGunData() {
      return (
         this.getMultiOutput("Cluster", this.clusterType ? "Horiz" : "Close", "extraAmmo") +
         this.getMultiOutput("Special", this.specialAmmo, "extraAmmo")
      );
   }

   getMultiOutput(top, bottom, className, defaultText) {
      return `<div ${!className ? "" : `class="${className}"`}><output>${top ?? defaultText ?? 0}</output><output>${bottom ?? defaultText ?? 0}</output></div>`;
   }

   isEmpty(prop) {
      return !prop ? "empty" : "";
   }

   getDecos() {
      let divString = "";
      let counter = 3;
      let index = 4;
      while (index-- && counter) {
         let slotLevel = this.decos[index];
         while (slotLevel--) {
            --counter;
            divString += getImage(`lvl${index + 1}`);
         }
      }

      while (counter--) divString += getImage("lvl0");

      return `<div class="decoWiki">${divString}${getLayeredIcons(`lvl${this.rampageSlots}`, "rampageIcon", "topRight")}</div>`;
   }

   initStats() {
      if (this.isRanged) {
         // sets a value for sharpness to prevent errors
         this.sharpBonus = { PRM: 1, PEM: 1 };
         if (this.weaponType === "Bow") {
            this.extraStats = getMeleeStats;
         } else {
            this.bowGunData = this.weaponType[0] === "L" ? this.lightBowGunData : this.heavyBowGunData;
            this.extraStats = getGunStats;
         }
      } else {
         this.sharpBonus = this.getLastSharpness("sharpness");
         this.extraStats = getMeleeStats;
      }

      // The sort values are attack times the sharpness multiplier only; affinity is left out on purpose.
      this.attack = this.raw * this.sharpBonus.PRM;
      this.EFR = this.attack;
      this.element = this.ele * this.sharpBonus.PEM;
      this.EFE = this.element;
   }

   getLastSharpness() {
      if (this.sharpness.purple > 0) return sharpnessBonus[6];

      // sharpness is { red, orange, yellow, green, blue, white, purple }, in the same order as sharpnessBonus
      const index = Object.values(this.sharpness).findLastIndex(val => val > 0);
      let i = 0;
      let handi = this.applyAugments === 1 ? this.handicraft : [];
      while (handi[i + 1]) ++i;

      return sharpnessBonus[Math.min(6, Math.max(0, index + i))];
   }

   bonusStats() {
      let returnVal = { raw: this.baseRaw, ele: this.baseEle };
      if (this.isRanged) {
         returnVal.raw +=
            !this.isBowgun ? 15
               : this.weaponType[0] === "H" ? 20
                  : 10;
      } else {
         if (!get.helpers.hasElement(this.eleType)) {
            returnVal.raw += +40;
         } else {
            returnVal.raw += +25;
            // adds appropriate amount of element for different weapons
            returnVal.ele += eleBonus[this.weaponType] || 18;
         }
      }

      return returnVal;
   }

   fuzzyFinder(toFind, searchIndex) {
      toFind = toFind.toLowerCase();
      let weaponName = this.weapon.toLowerCase();
      if (!isFinite(searchIndex)) {
         searchIndex = this.searchIndex || 0;
      }

      if (searchIndex === weaponName.length) {
         return false;
      }

      for (let j = 0; searchIndex < weaponName.length; ++searchIndex) {
         if (toFind[j] === weaponName[searchIndex]) {
            if (++j === toFind.length) {
               this.searchIndex = searchIndex + 1;
               return true;
            }
         }
      }

      this.searchIndex = searchIndex;
      return false;
   }
}

/**
 * Retrieves base stats from weapon.
 ** name
 ** weaponType
 ** baseRaw
 ** eleType
 ** baseEle
 ** aff
 ** decoSlots
 ** handicraft
 ** sharpness
 ** clipSize
 ** isRapidFire
 * @param property {string} - the property to get
 * @returns {number|string} - the value of the property
 */
// getBaseStats(property) {
//    this[property] = this.weapon[property];
//    return this[property];
// }

//
// get attack() {
//    return this.getBaseStats("baseRaw") * this.sharpness[this.applyAugments].PRM;
// }
//
// get eleAugments() {
//    return this.getBaseStats("baseEle") + this.bonus.ele;
// }
//
// get rawCritBonus() {
//    return 1 + this.aff * critBoost;
// }
//
// get eleCritBonus() {
//    return 1 + this.aff * critElement;
// }
;// ./src/display/filterNsort.js




/**
 * Responsible for everything on collectives level
 * @class {Object} FilterSettings - Filters and Sorts the weapon elements
 * @constructor
 * @param {Object} weapons - All weapons of the selected type
 * @param {String} weaponType - The type of weapon selected
 * @property {Boolean} isBowgun - Whether the weapon type is a bowgun
 * @property {Boolean} applyAugments - Whether to apply augments to the weapon's stats
 * @property {String} container - The container to display the weapons in
 * @exports FilterSettings
 */
class FilterSettings {
   constructor(weaponObj) {
      this.container = get.el.id("wikiDisplayContainer");
      this.weaponType = weaponObj.weaponType;
      this.isBowgun = this.weaponType.endsWith("BowGun");
      this.isRanged = this.weaponType.includes("Bow");
      this.applyAugments = get.el.id("useAugs").classList.contains("selected") ? 1 : 0;
      this.rowClass = this.isBowgun ? "rowRanged" : `rowMelee ${this.weaponType === "Bow" ? "rowBow" : ""}`;
      this.critBoost = (get.skillStats("CriticalBoost", get.selectedValue("CriticalBoost"), "PRM") - 1) / 100;
      this.critElement =
         (get.skillStats("CriticalElement", get.selectedValue("CriticalElement"), "PEM") - 1) / 100;

      this.onlyRank10 = get.classContains("#weaponRankFilter", "selected");
      this.eachRow = weaponObj.weapons.map((weapon, index) => new TableRow(weapon, index, this));
      this.restrictions =
         this.isBowgun ?
            ["byName", "byRaw", "byAff", "minAmmo", "byAmmo"]
         :  ["byName", "byRaw", "byAff", "byEleType"];

      this.setRestrictions();
      this.sortTable(get.el.id("bySort").value);

      this.setDisplay();
   }

   setRestrictions = () => {
      for (const restriction of this.restrictions) {
         this[restriction] = get.el.id(restriction).value;
      }
   };

   setDisplay() {
      let display = "";
      for (const weapon of this.eachRow) {
         display += this.weaponFilter(weapon) ? "" : weapon.el;
      }

      document.getElementById("wikiDisplayContainer").innerHTML = display;
   }

   weaponFilter(el) {
      const minAmmo = +(this.minAmmo || 0);

      const ammoToFind =
         !this.byAmmo ? "" : get.el.id("byAmmo").selectedOptions[0].textContent.replace(/Piercing | \d/, "");

      return (
         el.passedSearchFilter === "false" ||
         this.onlyRank10 && el.rank !== 10 ||
         (ammoToFind ? this.hasAmmo(ammoToFind, el, minAmmo) : this.hasEle(el)) ||
         +el.raw < +this.byRaw ||
         +el.aff < +this.byAff
      );
   }

   hasAmmo(ammoName, el, minAmmo) {
      return ammoName && el.clipSize[ammoName][this.byAmmo] < minAmmo;
   }

   hasEle(el) {
      return this.byEleType && this.byEleType !== el.eleType;
   }

   ascending(a, b) {
      return a - b;
   }

   desc(a, b) {
      return b - a;
   }

   /**
    * Sorts the rows highest first by the chosen stat. No stat ("---") restores the original order.
    * Raw and Element use the values currently shown, so they follow the Use Augments toggle.
    * @param {string} prop value of the selected #bySort option
    */
   sortTable(prop) {
      const key = { baseRaw: "raw", baseEle: "ele", baseAff: "aff" }[prop] || prop;
      if (!key) {
         this.eachRow.sort((a, b) => a.weaponIndex - b.weaponIndex);
         return;
      }

      const valueOf = row => +row[key] || 0;
      this.eachRow.sort((a, b) => valueOf(b) - valueOf(a) || a.weaponIndex - b.weaponIndex);
   }
}

// let time = 0 - performance.now();
// sortTable("attackWiki");
// console.log(time + performance.now());

function getImage(src, className) {
   return src === "none" ? '<img class="augInvis">' : 
         `<img alt="${src} icon" title="${src}" class="${className}" src="./icons/${src}.svg">`
      ;
}

function getLayeredIcons(background, foreground, overLayPosition = "topRight") {
   return `<div class="overlayContainer ${overLayPosition}">${getImage(background, "overlay")} ${getImage(
      foreground,
      `overlay ${overLayPosition}`
   )}</div>`;
}
;// ./src/display/newInitWiki.js





const newInitWiki_weaponChange = getWeaponChange();


class WeaponWiki {
   constructor() {
      this.model = get.$("#wikiModel");
      this.filters = get.$$("#wikiFilter>*");
      this.weaponIcons = get.$$("#wikiWeaponSelectIcons img");
      const weaponType = document.getElementById("dropWeaponType").value;
      this.weaponKeys = {};

      for (let i = 0; i < 14; i++) {
         const el = this.weaponIcons[i];
         const thisType = el.dataset.value;
         el.classList.toggle("selected", thisType === weaponType);
         this.weaponKeys[thisType] = {
            weaponIconIndex: i,
            name: el.dataset.name,
            weaponTypeIndex: +el.dataset.index,
            weaponIndex: undefined,
            weaponType: thisType,
            weapons: window.thisKey[thisType].weapons,
         };
      }
   }

   newDisplay(weaponType) {
      this.setNewSelectedWeapon(weaponType);
      this.display = new FilterSettings(this.cache);
      this.model.showModal();
   }

   /**
    * Resets the selected weapon icon.
    *
    * - Removes the 'selected' class from the previously selected weapon icon.
    * - Adds the 'selected' class to the newly selected weapon icon.
    * - Updates the weapon weaponType and index in the weaponWiki object.
    * - Hides the class-specific weapon filters that do not match the selected weapon.
    *
    */
   setNewSelectedWeapon(weaponType) {
      this.weaponIcons.forEach(icon => {
         icon.classList.remove("selected");
      });

      this.cache = this.weaponKeys[weaponType];
      this.weaponIcons[this.cache.weaponIconIndex].classList.add("selected");

      // Hide the class specific weapon filters
      for (let el of get.$$("#wikiFilter .classSpecific")) {
         el.classList.toggle("augInvis", !el.classList.contains(weaponType));
      }
   }
}

const weaponWiki = new WeaponWiki();

function dasExport() {
   return "Needed to export something to make the import work.";
}

// Event listeners

// init weaponWiki
get.el.id("wikiButton").addEventListener("click", () => {
   weaponWiki.newDisplay(newInitWiki_weaponChange.weaponType);
});

// weaponWiki change weapon
weaponWiki.model.querySelectorAll("#wikiWeaponSelectIcons img").forEach(el => {
   el.addEventListener("click", () => {
      get.$("#weaponRankFilter").classList.add("selected");
      weaponWiki.newDisplay(el.dataset.value);
   });
});

// weaponWiki toggle use of augments
get.el.id("useAugs").addEventListener("click", e => {
   for (const weapon of weaponWiki.display.eachRow) {
      weapon.applyAugments ^= 1;
      weapon.raw = weapon.applyAugments === 1 ? weapon.bonus.raw : weapon.baseRaw;
      weapon.ele = weapon.applyAugments === 1 ? weapon.bonus.ele : weapon.baseEle;
      weapon.initStats();
   }

   console.log(weaponWiki.display.eachRow);
   weaponWiki.display.setDisplay();
});

function acceptedWeaponChange() {
   const { cache } = weaponWiki;
   document.getElementById("dropWeaponType").selectedIndex = cache.weaponTypeIndex;
   get.el.weapon.selectedIndex = cache.weaponIndex;
   document.getElementById("wikiModel").close();
   newInitWiki_weaponChange.resetWeaponType(cache.weaponType, cache.weaponIndex);
   dataCompile();
   get.$("#wikiDisplayContainer").innerHTML = "";
}

// equipmentSelection handler
function handlePotentialEquip(row) {
   if (row.classList[0]?.startsWith("row")) {
      weaponWiki.cache.weaponIndex = +row.dataset.index;
      weaponWiki.cache.name = weaponWiki.cache.weapons[weaponWiki.cache.weaponIndex].weapon;
      set.newMessage(
         weaponWiki.display.container,
         `Would you like to equip ${weaponWiki.cache.name}`,
         acceptedWeaponChange
      );
   }
}

document.getElementById("wikiDisplayContainer").addEventListener("click", e => {
   // Clicking anywhere on a weapon row counts, not only on the row's own padding
   const row = e.target.closest("#wikiDisplayContainer > section");
   if (row) handlePotentialEquip(row);
});

// toggle all weapons
document.getElementById("weaponRankFilter").addEventListener("click", e => {
   const { cache } = weaponWiki;
   // The generic toggle handler has already flipped the "selected" class by the time this runs.
   // Not selected means show every rank, so make sure the lower rank weapons are loaded.
   if (!e.currentTarget.classList.contains("selected")) {
      importLowRankWeapons(window.thisKey[cache.weaponType], cache.weaponType);
   }

   cache.weapons = window.thisKey[cache.weaponType].weapons;
   weaponWiki.newDisplay(cache.weaponType);
});

function filterHandler(target) {
   if (target.id === "byName") return;

   if (target.id === "bySort") {
      weaponWiki.display.sortTable(target.value);
   } else {
      weaponWiki.display[target.id] = target.value;
   }

   weaponWiki.display.setDisplay();
}

// weaponWiki filter and sort
get.el.id("wikiFilter").addEventListener("input", e => {
   filterHandler(e.target);
});

get.el.id("wikiFilter").addEventListener("change", e => {
   filterHandler(e.target);
});

document.getElementById("byName").addEventListener("beforeinput", e => {
   let display = "";
   let isInsert = e.inputType === "insertText";
   let toFind = isInsert ? e.data : e.target.value.slice(0, -1);
   let searchIndex = isInsert ? undefined : 0;
   for (const weapon of weaponWiki.display.eachRow) {
      weapon.passedSearchFilter =
         !toFind || (!isInsert || weapon.passedSearchFilter) && weapon.fuzzyFinder(toFind, searchIndex);

      if (weapon.passedSearchFilter) {
         if (!toFind) {
            weapon.searchIndex = 0;
            display += weapon.el;
         }

         if (!weaponWiki.display.weaponFilter(weapon)) {
            display += weapon.el;
         } else {
            weapon.passedFiler = false;
         }
      }
   }

   weaponWiki.display.container.innerHTML = display;
});
// get.el.id("wikiFilter").addEventListener("input", e => {
//    if (e.target.id === "byName") return;
//
//    wikiModel[e.target.id] = e.target.value;
//    wikiModel.setDisplay();
// });
//
// get.el.id("bySort").addEventListener("change", e => {
//    wikiModel.sortTable(e.target.value);
//    wikiModel.setDisplay();
// });
;// ./src/main/eventListener.js
/* unused harmony import specifier */ var eventListener_get;




















let eventListener_weaponChange;
const { thisKey: eventListener_thisKey } = window;
dasExport();

const eventListener_weaponType = get.el.weaponType;
get.el.weaponType.addEventListener("change", e => {
   eventListener_weaponChange = getWeaponChange();
   eventListener_weaponChange.resetWeaponType(e.target.value, 0);
});

get.el.weapon.addEventListener("change", e => {
   eventListener_weaponChange = getWeaponChange();
   eventListener_weaponChange.resetWeapon(e.target.selectedIndex);
});

function getMonHitZone(damageType) {
   return eventListener_get.monHZ()[eventListener_get.lower(damageType)] || 0;
}

// const lower = (str) => (str ? str[0].toLowerCase() + str.slice(1) : "");
document.querySelectorAll("select.skill").forEach(x =>
   x.addEventListener("change", e => {
      resetSkillDescription();
      // dataCompile();
      e?.target.blur();
   })
);

document.querySelectorAll("select.menu").forEach(menu =>
   menu.addEventListener("change", e => {
      updateQuest(e.target.selectedOptions[0]);
      monChart();
      const mon = e.target === get.el.mon ? get.el.mon.value : get.el.mon2.value;
      healthSelect(mon);
   })
);

document.getElementById("players")?.addEventListener("change", () => healthSelect(get.el.mon2.value));
document.getElementById("dropQuest").addEventListener("change", () => {
   monChart();
   healthSelect(get.el.mon2.value);
});

document.querySelectorAll("select.demon").forEach(el =>
   el.addEventListener("change", e => {
      document.querySelectorAll(`.demon:not(#${e?.target.id})`).forEach(mode => (mode.selectedIndex = 0));
   })
);

Object.values(document.getElementsByClassName("dropMons")).forEach(el => {
   el.addEventListener("change", e => {
      let elToUpdate = e.target === get.el.mon ? get.el.mon2 : get.el.mon;
      elToUpdate.selectedIndex = e.target.selectedIndex;
      e.stopPropagation();
      changeMonsters(e.target.value);
      dataCompile();
   });
});

get.$("button.rampageAug").addEventListener("click", () => {
   rampageSelect();
});

// ////////////////////////////////////////////////////////
// //////////   Armor/Augments    ////////////////////////
// ///////////////////////////////////////////////////////
document.querySelectorAll("section.armorDisplay").forEach(x => {
   if (x.id.includes("weaponRampage")) return;

   x.addEventListener("change", e => {
      if (e.target.tagName === "SELECT") {
         createActiveSkills();
      }
   });
});

for (let el of get.$$("select.augmentType")) {
   el.addEventListener("change", e => {
      e.target.nextElementSibling.selectedIndex = 0 - 1;
      e.target.nextElementSibling.innerHTML = "";
      validator(e.target.parentElement.parentElement.id.slice(0, -7));
   });
}

for (let el of get.$$("select.augment")) {
   el.addEventListener("change", e => {
      validator(e.target.parentElement.parentElement.id.slice(0, -7));
   });

   el.addEventListener("mousedown", e => {
      let temp =
         e.target.selectedIndex <= 0 ? undefined
         : e.target.previousElementSibling.selectedIndex % 2 ? e.target.selectedIndex
         : e.target.selectedOptions[0]?.textContent;

      augmentEventHandler(e.target, temp);
      validator(e.target.parentElement.parentElement.id.slice(0, -7));
   });

   el.addEventListener("keydown", e => {
      if (e.key === "Enter") {
         let temp =
            e.srcElement.previousElementSibling.selectedIndex % 2 ?
               e.srcElement.selectedIndex
            :  e.srcElement.selectedOptions[0]?.textContent;

         augmentEventHandler(e.srcElement, temp);
         validator(e.srcElement.parentElement.parentElement.id.slice(0, -7));
      }
   });
}

for (let el of get.$$("#resistances select")) {
   el.addEventListener("change", () => updateElementDefense());
}

const specialCases = new Set(["DefenseBoost", "Dragonheart", "DragonConversion", "Furious"]);
// ////////////////////////////////////////////////////////
// //////////   General Selection  ////////////////////////
// ///////////////////////////////////////////////////////
document.querySelector("#weaponSelects>#Qurious")?.addEventListener("mousedown", () => {
   document.getElementById("augToggle").classList.remove("augInvis");
});

document.body.addEventListener("mousedown", e => {
   if (
      e.target.classList?.contains("toggle") &&
      e.target.parentElement.parentElement?.id !== "EquippedSkillDisplay"
   ) {
      e.target.classList.toggle("selected");
   }
});

get.el.id("EquippedSkillDisplay").addEventListener("click", e => {
   if (e.target.tagName === "BUTTON")
      e.target.classList.toggle("selected", e.target.textContent !== "Inactive");
});

const charmSlots = get.$$("#charmSlots .charmSlot");

charmSlots.forEach(el =>
   el.addEventListener("change", e => {
      let [skill1, skill2] = document.querySelectorAll("#charm select");
      const [charm1, charm2, charm3] = Array.from(charmSlots);
      let charm1Index = charm1.selectedIndex;

      if (charm1Index > 2) {
         charm3.selectedIndex = 1;
      }

      if (!(charm1Index % 2)) {
         charm2.selectedIndex = Math.min(charm2.selectedIndex, charm1Index === 4 ? 1 : 2);
      }

      // prevents the same skill from being selected twice
      if (
         skill1.selectedOptions[0].textContent.split(" +")[0] ===
         skill2.selectedOptions[0].textContent.split(" +")[0]
      ) {
         if (e.target === charm1) {
            skill2.selectedIndex = 0;
         } else {
            skill1.selectedIndex = 0;
         }
      }

      setDecoDisplay("charm", [charm1Index, charm2.selectedIndex, charm3.selectedIndex]);
   })
);

// ////////////////////////////////////////////////////////
// //////////   Skills Descriptions  /////////////////////
// ///////////////////////////////////////////////////////
document.getElementById("EquippedSkillDisplay").addEventListener("click", e => {
   if (e.target.tagName !== "BUTTON") return;

   const text = e.target.nextElementSibling.textContent.replace(/\s/g, "").split(":")[0];

   if (text.includes("Resist") || specialCases.has(text)) {
      updateElementDefense();
   }
});

document.querySelector("#EquippedSkillDisplay").addEventListener("mouseover", e => {
   if (!eventListener_thisKey?.descriptions) return;

   let [skillName, skillLevel] = e.target.textContent.replace(/[\s\n\t]/g, "").split(":");
   if (skillLevel && eventListener_thisKey.descriptions[skillName]) {
      e.target.dataset.tooltip = eventListener_thisKey.descriptions[skillName][skillLevel - 1];
   }
});

/**
 * @param {HTMLOutputElement} target
 */
function setToolTip(target) {
   if (target.tagName === "OUTPUT" && target.classList[1] && eventListener_thisKey.descriptions[target.classList[1]]) {
      target.dataset.tooltip = eventListener_thisKey.descriptions[target.classList[1]].join("\n");
   }
}

document.getElementById("searcherSkills").addEventListener("mouseover", e => {
   setToolTip(e.target);
});

document.querySelector(".extraSkills").addEventListener("mouseover", e => {
   if (
      e.target.tagName === "BUTTON" &&
      eventListener_thisKey.descriptions[e.target.textContent.replace(/\s/g, "").slice(0, -2)]
   ) {
      e.target.dataset.tooltip =
         eventListener_thisKey.descriptions[e.target.textContent.replace(/\s/g, "").slice(0, -2)].join("\n");
   }
});

// ////////////////////////////////////////////////////////
// ////////// Combo Count  //////////////////////////////
// ///////////////////////////////////////////////////////
document.getElementById("dpsTable").addEventListener("change", e => {
   adjustComboDamage(e);
});

document.getElementById("dpsTable").addEventListener("mousedown", e => {
   adjustComboDamage(e);
});

document.getElementById("dpsTable").addEventListener("input", e => {
   if (e.target.classList.contains("a") || !e.target.classList.contains("inputButton")) return;

   e.target.value = Math.max(+(e.target.id === "inputComboRepeat"), Math.min(20, e.target.value));
});

function adjustComboDamage(e) {
   if (!e.target.className.includes("inputButton")) return;

   let output = e.target.parentElement.previousElementSibling.children[0];
   const type = e.target.classList.contains("dec") ? -1 : 1;
   const currentVal = +output.value;
   if (type === 1 && currentVal < 20) {
      window.comboTracker.push(+e.target.id);
      output.value = currentVal + 1;
   } else if (type === -1 && currentVal > (e.target.id === "0" ? 1 : 0)) {
      window.comboTracker.splice(window.comboTracker.lastIndexOf(e.target.id), 1);
      output.value = currentVal - 1;
   }

   if (window.innerWidth > 500) {
      document.getElementById("comboCountContainer")?.classList.remove("augInvis");
   }
}

// set an event listener to apply if the user uses the arrow keys to change the value
document.getElementById("dpsTable").addEventListener("keydown", e => {
   if (!e.target.classList.contains("a") || get.el.id("wikiModel").contains(e.target)) return;

   const attackId = e.target.className.match(/\d/)[0];
   if (attackId && e.key === "ArrowUp") {
      window.comboTracker.push(attackId);
   } else if (attackId && e.key === "ArrowDown") {
      window.comboTracker.splice(window.comboTracker.lastIndexOf(attackId), 1);
   }

   // updateComboDisplay();
   dataCompile();
});

function eventListener_toggleElementsForBuilder(boolean) {
   get.$$("#charmSlots select, #dropWeapon,#dropWeaponType").forEach(el => (el.disabled = boolean));
}

get.$$(".close").forEach(el =>
   el.addEventListener("click", e => {
      if (e.target.parentElement.id === "extraSkillsHeader") {
         eventListener_toggleElementsForBuilder(false);
      }

      e.target.parentElement.parentElement.classList.add("augInvis");
   })
);

// ////////////////////////////////////////////////////////
// //////////  Settings Menu   //////////////////////////////
// ///////////////////////////////////////////////////////

document.getElementById("openSettingsMenu").addEventListener("click", e => {
   e.target.textContent.includes("Open") ?
      (e.target.textContent = "Close Settings")
   :  (e.target.textContent = "Open Settings");

   document.getElementById("settingsMenu").classList.toggle("augInvis");
   get.$$("#title,h2").forEach(el => (el.style.opacity = el.style.opacity == 0.2 ? 1 : 0.2));
   e.target.classList.toggle("selected");
});

get.el.id("skillsMenu").addEventListener("mousedown", () => {
   set.removeClass("skillSettings", "augInvis");
   set.addClass("monsterSettings", "augInvis");
   set.addClass("infoSettings", "augInvis");
});

get.el.id("monsterMenu").addEventListener("mousedown", () => {
   set.addClass("skillSettings", "augInvis");
   set.removeClass("monsterSettings", "augInvis");
   set.addClass("infoSettings", "augInvis");
});

document.getElementById("infoMenu").addEventListener("mousedown", () => {
   set.addClass("skillSettings", "augInvis");
   set.addClass("monsterSettings", "augInvis");
   set.removeClass("infoSettings", "augInvis");
});

// ////////////////////////////////////////////////////////
// //////////  Quest Menu   //////////////////////////////
// ///////////////////////////////////////////////////////
document.querySelector("#questButton").addEventListener("mousedown", () => showMenu());

function showMenu() {
   document.querySelectorAll(".menu").forEach(x => x.classList.remove("augInvis"));
   const mrToggle = document.querySelectorAll("#MR>option").length > 0;
   document.getElementById("MR").parentElement.classList.toggle("augInvis", !mrToggle);
   const hrToggle = document.querySelectorAll("#HR>option").length > 0;
   document.getElementById("HR").parentElement.classList.toggle("augInvis", !hrToggle);
}

document.getElementById("boxes").addEventListener("mousedown", e => {
   const target = e.target.tagName === "LABEL" ? e.target.children[0] : e.target;
   if (/DemonDrug/i.test(target.id)) {
      if (target.id === "DemonDrug") {
         document.getElementById("MegaDemonDrug").checked = false;
      } else {
         document.getElementById("DemonDrug").checked = false;
      }
   }

   if (target.id === "WaterBlight") {
      const ugh = get.el.part.selectedIndex;
      monChart();
      get.el.part.selectedIndex = ugh;
   }
});

document.getElementById("scrollSwap").addEventListener("mousedown", e => {
   const isBlue = e.target.classList.contains("Blue");
   set.toggleClass("blueNon", "augInvis", isBlue);
   set.toggleClass("blueScroll", "augInvis", !isBlue);
   set.toggleClass("redNon", "augInvis", !isBlue);
   set.toggleClass("redScroll", "augInvis", isBlue);
   const color = isBlue ? "blue" : "red";
   eventListener_thisKey.skills.MailofHellfire = eventListener_thisKey.skills.MailofHellfireSource[color];
   eventListener_thisKey.skills.Dereliction = eventListener_thisKey.skills.DerelictionSource[color];
   dataCompile();
});

document.querySelector(".extraSkills").addEventListener("mousedown", e => {
   if (e.target.tagName === "BUTTON" && !e.target?.classList[0]) {
      let [skillName, skillLevel] = e.target.textContent.split(" +");
      skillName = skillName.replace(/\s/g, "");
      // .replace(/["/#.:()[\]]/g, " ");
      const output = document.querySelector(`#searcherSkills output.${skillName}`);
      if (output) {
         // the button shows how many levels can be added on top of the selected level
         const level = Math.min(
            eventListener_thisKey.types.skills[skillName].maxLevel || eventListener_thisKey.skills[skillName].length - 1,
            +output.textContent.slice(-1) + (+skillLevel || 1)
         );

         output.textContent = `Lv-${level}`;
         output.value = level;

         // dataCompile();
      } else {
         createSkillSelections(skillName, skillLevel);
      }

      e.target.remove();
   }
});

get.$("button.rampageAug").addEventListener("click", () => {
   rampageSelect();
});

// ////////////////////////////////////////////////////////
// //////////  Set Searcher Selections ///////////////////
// ///////////////////////////////////////////////////////

function incDecBuilderSkills(id, target) {
   if (target.tagName !== "BUTTON") return;

   let type = target.classList.contains("dec") ? -1 : 1;
   let output = target.parentElement.querySelector("output");
   let currentLevel = +output.value.at(-1) + type;
   if (currentLevel < 0) {
      target.parentElement.remove();
      return;
   }

   const maxSkillLevel = Math.min(
      currentLevel,
      eventListener_thisKey.types.skills[id].maxLevel || eventListener_thisKey.types.skills[id]?.length - 1 || 7
   );

   output.value = `Lv-${maxSkillLevel}`;
}

document.getElementById("skillSelect").addEventListener("mousedown", e => {
   if (e.target.classList[0] !== "skillInput") return;

   incDecBuilderSkills(e.target.classList[1], e.target);
});

// ////////////////////////////////////////////////////////
// //////////  Extra Menus  //////////////////////////////
// ///////////////////////////////////////////////////////
document.getElementsByClassName("close");
document.querySelectorAll("output.currentPoints").forEach(el => {
   el.addEventListener("mousedown", () => {
      document.querySelectorAll(".armorAugment").forEach(el => el.classList.toggle("augInvis"));
   });
});

function resetSkills() {
   document.querySelectorAll("#searcherSkills>div").forEach(el => el.remove());
}

function toggleAmmoTables() {
   const toggle = document.getElementById("dpsTable").classList.contains("augInvis");
   document.getElementById("dpsTable").classList.toggle("augInvis", !toggle);
   document.getElementById("ammoTable").classList.toggle("augInvis", toggle);
}

document.getElementById("resetCombo").addEventListener("click", () => comboReset());
document.getElementById("resetSkills").addEventListener("click", () => resetSkills());
document.getElementById("ammoChange").addEventListener("click", () => toggleAmmoTables());
let dropMonster = document.querySelector("#dropMonster");
let dropMonster2 = document.querySelector("#dropMonster2");
dropMonster.addEventListener("change", function () {
   if (dropMonster.selectedIndex !== dropMonster2.selectedIndex) {
      dropMonster2.selectedIndex = dropMonster.selectedIndex;
   }
});

dropMonster2.addEventListener("change", function () {
   if (dropMonster2.selectedIndex !== dropMonster.selectedIndex) {
      dropMonster.selectedIndex = dropMonster2.selectedIndex;
   }
});

let dropHZV2 = document.querySelector("#dropHZV2");
get.el.part.addEventListener("change", function () {
   if (get.el.part.selectedIndex !== dropHZV2.selectedIndex) {
      dropHZV2.selectedIndex = get.el.part.selectedIndex;
   }
});

dropHZV2.addEventListener("change", function () {
   if (dropHZV2.selectedIndex !== get.el.part.selectedIndex) {
      get.el.part.selectedIndex = dropHZV2.selectedIndex;
   }
});

const konamiCode = !window.location.href.includes("github"||0) ? "debug".split("") : "";
console.log(konamiCode);
let konami = 0;
if (konamiCode) {
   document.addEventListener("keydown", e => {
      if (!isFinite(konami)) return;

      if (e.key === konamiCode[konami]) {
         ++konami;
      } else if (konami < 5) {
         konami = 0;
      } else if (e.key === "Enter") {
         konami = 0;
         let script = document.createElement("script");
         script.src = ".././src/konami.js";
         document.head.appendChild(script);
         konami = null;
      }
   });
}

// / ///////////////////////////////////////////////////////
// / /////////   Drag N Drop  /////////////////////////////
// / //////////////////////////////////////////////////////

let testKeyCount = 0;
let buildBKeyCount = 0;
document.addEventListener("keypress", e => {
   if (
      (e.key === ["t", "e", "s", "t"][testKeyCount++] && !(buildBKeyCount = 0)) ||
      (e.key === ["b", "u", "i", "l", "d"][buildBKeyCount++] && !(testKeyCount = 0))
   ) {
      return;
   } else if ((e.key === "Enter" && testKeyCount >= 3) || (e.key === "Enter" && buildBKeyCount >= 4)) {
      testBuild(testKeyCount < 3);
   }

   testKeyCount = 0;
   buildBKeyCount = 0;
});

function testBuild(testA) {
   if (testA) {
      [
         ["AttackBoost", 7],
         ["Bloodlust", 3],
         ["Burst", 3],
         ["Strife", 3],
         ["Coalescence", 1],
         ["CriticalBoost", 3],
         ["CriticalElement", 3],
         ["Dragonheart", 5],
         ["DragonAttack", 5],
         ["ElementExploit", 3],
         ["Frostcraft", 3],
         ["Resentment", 5],
         ["MailofHellfire", 3],
         ["Agitator", 5],
         ["DragonConversion", 3],
         ["WeaknessExploit", 3],
      ].forEach(x => createSkillSelections(x[0], x[1]));
   } else {
      [
         ["PeakPerformance", 3],
         ["Coalescence", 3],
         ["CriticalEye", 7],
         ["CriticalBoost", 3],
         ["MaximumMight", 3],
         ["RecoilDown", 3],
         ["ReloadSpeed", 3],
         ["RapidFireUp", 3],
         ["PierceUp", 3],
         ["Burst", 1],
         ["Agitator", 5],
         ["AttackBoost", 7],
         ["AmmoUp", 2],
         ["SpareShot", 3],
         ["WeaknessExploit", 3],
         ["Tune-Up", 1],
         ["Bloodlust", 1],
      ].forEach(x => createSkillSelections(x[0], x[1]));
   }

   setTimeout(() => {
      getSetBuilds();
   }, 1);
}

get.$$("#startSearch, #extendedSearch").forEach(el =>
   el.addEventListener("click", () => {
      getSetBuilds();
      eventListener_toggleElementsForBuilder(true);
   })
);

document.querySelector(".grid").addEventListener("change", e => {
   if (e.target.tagName === "SELECT") {
      getSingleBuild(e.target);
   }
});

document.querySelector(".grid").addEventListener("mousedown", e => {
   if (e.target.tagName === "BUTTON") {
      setSelectedBuild(e.target);
   }
});

document.body.addEventListener("click", e => {
   if (
      !get.el.id("wikiModel").contains(e.target) &&
      e.target.tagName !== "SELECT" &&
      "startSearch" !== e.target.id &&
      "extendedSearch" !== e.target.id &&
      (/dec|inc|skill|input|scroll/.test(e.target.className) || /INPUT|BUTTON/.test(e.target.tagName))
   ) {
      dataCompile(e);
   }
});

document.addEventListener("change", e => {
   if (!get.el.id("wikiModel").contains(e.target) && e.target.tagName === "SELECT") {
      dataCompile();
   }
});
;// ./src/main/calculateAmmoFrames.js
 



const dropMon = document.getElementById("dropMonster2");
const { thisKey: calculateAmmoFrames_thisKey } = window;

function shotsCheck(
   convertedRecoilFrames,
   convertedReloadFrames,
   clipSize,
   maxTime = 60,
   spareShot = 0
) {
   let spareShotAccumulator = 0;
   spareShotAccumulator += spareShot;
   let timeUsed = 0;
   let totalShots = 0;
   // while under time limit
   while (timeUsed <= maxTime) {
      // for each clip
      let i = clipSize;
      while (i) {
         // accumulate recoil frames per shot
         timeUsed += convertedRecoilFrames;
         // Increment totalShots by 1 only if timeUsed is less than or equal to maxTime
         totalShots += timeUsed <= maxTime ? 1 : 0;
         // if % chance to proc has been hit        and spare shot is active
         if (totalShots >= spareShotAccumulator && spareShot !== 0 && spareShot !== Infinity) {
            // add the count needed per proc to the shots needed to get another
            spareShotAccumulator += spareShot;
            continue;
         }

         --i;
      }

      // when clip is empty add reload frames and restart
      timeUsed += convertedReloadFrames;
   }

   return totalShots;
}

// Calculate the base and actual number of shots that can be fired in a fixed time limit (60 seconds), taking into account recoil and reload times, clip size, and the chance of not consuming ammo with spareShot
function calculateAmmoFrames(power) {
   let attackName =
      /Sub-Lv|Explosion| Procs|\(RF\+\d\)/g.test(power.attackName) ?
         power.attackName.replace(/Sub-| Explosion| \(RF\+\d\) Procs| Procs| \(RF\+\d\)/g, "")
      :  power.attackName;

   attackName =
      /(?<!Lv)\d/.test(attackName) ?
         `${attackName.slice(0, attackName.length - 1)}Lv${attackName.slice(-1)}`
      :  attackName;

   const ammo = {};
   ammo.ammoIncrease = calculateAmmoFrames_thisKey.ammo.AmmoUp[attackName][get.selectedValue("AmmoUp")];
   // Converts to number to find frames used while staying within possible parameters
   const shotsPerTimeLimit = 60;
   ammo.recoilSpeed =
      calculateAmmoFrames_thisKey.ammo.recoil[attackName][
         Math.max(
            0,
            Math.min(
               5,
               power.recoil -
                  1 +
                  get.selectedValue("RecoilDown") +
                  (calculateAmmoFrames_thisKey.skills.BowgunBarrel[get.elSelectedIndex("BowgunBarrel")].Silencer > 0 ?
                     get.selectedValue("Tune-Up") +
                     calculateAmmoFrames_thisKey.skills.BowgunBarrel[get.elSelectedIndex("BowgunBarrel")].Silencer
                  :  0) -
                  (get.elSelectedIndex("CriticalFirePower") ? 2 : 0)
            )
         )
      ];

   ammo.recoilSpeed =
      /\(RF\+\d\)/.test(power.attackName) ?
         `${ammo.recoilSpeed} ${power.attackName.match(/\(RF\+\d\)/)[0]}`
      :  ammo.recoilSpeed;

   ammo.recoilFrames = calculateAmmoFrames_thisKey.ammo.frames[ammo.recoilSpeed];
   const reloadSpeeds = calculateAmmoFrames_thisKey.ammo.reload[attackName];
   ammo.reloadSpeed =
      reloadSpeeds[
         Math.max(
            0,
            Math.min(
               reloadSpeeds.length - 1,
               8,
               power.reload +
                  get.selectedValue("ReloadSpeed") +
                  calculateAmmoFrames_thisKey.skills.BowgunBarrel[get.elSelectedIndex("BowgunBarrel")].reload +
                  (get.elSelectedIndex("BowgunBarrel") === 0 && get.selectedValue("Tune-Up") ? 1 : 0) -
                  (get.elSelectedIndex("ElementalReload") ? 2 : 0)
            )
         )
      ];

   // Reload speeds (Fastest, Fast, Slow, Slowest) have their own frame table, separate from recoil
   ammo.reloadFrames = calculateAmmoFrames_thisKey.ammo.reload.frames[ammo.reloadSpeed];
   ammo.clipSize = power.clipSize[power.isUsed] + ammo.ammoIncrease;
   ammo.spareShot = Math.max(
      0,
      calculateAmmoFrames_thisKey.skills.SpareShot[get.selectedValue("SpareShot")] + Number(get.elValue("spareAdjust"))
   );

   if (/(?<!snipe.*)explosion/.test(attackName) && get.elSelectedIndex("Bombardier") > 0) {
      ammo.spareShot += calculateAmmoFrames_thisKey.skills.Bombardier[attackName.match(/Sticky|Wyvern/)[0]][2];
   }

   ammo.shotsPerMinBase = shotsCheck(
      ammo.recoilFrames / 30,
      ammo.reloadFrames / 30,
      power.clipSize[power.isUsed],
      shotsPerTimeLimit
   );

   ammo.shotsPerMin = shotsCheck(
      ammo.recoilFrames / 30,
      ammo.reloadFrames / 30,
      ammo.clipSize,
      shotsPerTimeLimit,
      100 / ammo.spareShot // Chance of not consuming ammo with spareShot
   );

   // Calculate the percentage increase in shots fired due to increases in clip size and/or the chance of not consuming ammo with spareShot
   ammo.shotsPerGain = `${((ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100).toFixed(2)}%`;

   const pierceMetersPerTic = {
      PierceEle: 3,
      "Pierce 1": 1.5,
      "Pierce 2": 1.1,
      "Pierce 3": 1,
   };

   attackName = attackName.replace(/ Lv/, " ");
   ++power.ticsPer;
   ammo.ticsAdjust = power.ticsPer;
   if (attackName.includes("Pierc") && dropMon.value !== "Toadversary") {
      ammo.ticsAdjust =
         Math.min(
            7,
            Math.ceil(
               // gets smallest large gold crown size and converts size to meters
               calculateAmmoFrames_thisKey.monster[dropMon.value].size.gold /
                  100 /
                  // gets appropriate meters per tic rate
                  pierceMetersPerTic[/Pierce L?v?\d/.test(attackName) ? attackName : "PierceEle"]
            )
            // if RF accounts for the extra tics
         ) * (power.attackName.includes("RF+") ? +power.attackName.trim().slice(-2, -1) : 1);
   }

   // ammo.ticsAdjust =
   //   power.ticsPer * JSON.parse(get.elValue("pierceAdjust"))[attackName.slice(-1) > 0 ? 0 : 1];
   // if (power.attackName.includes("RF+")) {
   //   power.ticsAdjust = Math.min(power.ticsPer + 1, (power.ticsAdjust * +power.attackName.trim().slice(-2)));
   // }
   // Reduces total damage from pierce attacks displayed depending on selection
   // top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
   if (/Pierc/.test(attackName)) {
      const pierceAdjustValue =
         get.elSelectedIndex("pierceAdjust") >= 0 ? JSON.parse(get.elValue("pierceAdjust")) : [1, 1];

      ammo.ticsAdjust *= /Lv|[1-3]/.test(attackName) ? pierceAdjustValue[0] : pierceAdjustValue[1];
   }

   return ammo;
}

;// ./src/main/getUsedAttacks.js






const getUsedAttacks_weaponChange = getWeaponChange();

function getUsedAttacks() {
   let weaponType = getUsedAttacks_weaponChange.weaponType;

   if (weaponType === "InsectGlaive") {
      return window.thisKey.InsectGlaive.attacks.filter(
         skill => !/Sever|Blunt|Kinsect|Dust|Powder|Mark/.test(skill.attackName)
      );
   }

   if (weaponType === "ChargeBlade") {
      const phialType =
         getWeaponMR().phialType === "Impact Phial" ? "Element Phial|Elemental Phial" : "Impact Phial";

      const regexp = new RegExp(phialType);
      return window.thisKey.ChargeBlade.attacks.filter(skill => !regexp.test(skill.attackName));

      //  Filters bow attacks for only the usable attacks
   }

   if (weaponType === "Bow") {
      let usableKeys = "";
      let { baseCharge, bowShot } = getWeaponMR();
      baseCharge += get.selectedValue("BowChargePlus") === 1 && baseCharge < 4 ? 1 : 0;
      for (let i = 0; i < baseCharge; i++) {
         usableKeys += `|Lv${bowShot[i].match("[1-5]")[0]} ${
            bowShot[i].match("Normal|Rapid|Pierce|Spread")[0]
         }`;
      }

      const { attacks } = window.thisKey.Bow;
      const regex = new RegExp([usableKeys.slice(1)]);
      const usedAttacks = [attacks[0]];

      for (let attack of attacks) {
         if (regex.test(attack.attackName)) usedAttacks.push(attack);
      }

      return [...usedAttacks, ...attacks.slice(136)];
   }

   if (weaponType === "Gunlance") {
      // Physical attacks only. Shelling rows for this weapon's shelling type and level are added
      // afterwards by gunlanceShelling in main.js. Wyrmstake hits scale with shelling level but are
      // normal Sever attacks, so the one matching this weapon stays in this list.
      const { shellingType, shellingindex } = getWeaponMR();
      const thisShelling = `${shellingType} Lv${shellingindex})`;
      return window.thisKey.Gunlance.attacks.filter(
         attack =>
            !/(Long|Normal|Wide) Lv\d\)/.test(attack.attackName) ||
            attack.type !== "IgnoreHZV" && attack.attackName.includes(thisShelling)
      );
   }

   return window.thisKey[weaponType].attacks;
}

;// ./src/main/sharpness.js








const sharpness_weaponChange = getWeaponChange();
const { thisKey: sharpness_thisKey } = window;

function getInitialSharpness() {
   const keysForSharpness = ["purple", "white", "blue", "green", "yellow", "orange", "red"];
   let pointsFor = get.selectedValue("Handicraft") * 10;
   const { sharpness, handicraft, rank } = getWeaponMR();
   let startingIndex;
   for (let i = 0; i < 7; ++i) {
      if (sharpness[keysForSharpness[i]]) {
         startingIndex = i;
         break;
      }
   }

   // increases the cap of last color used
   for (let i = 0; i < 4; ++i) {
      if (handicraft[i + 1]) continue;

      handicraft[i] += 70;
      break;
   }

   let augmentedSharp = sharpness_thisKey.augIndex.sharpnessAug === 4 ? 50 : sharpness_thisKey.augIndex.sharpnessAug * 10;
   augmentedSharp += rank === 10 && document.getElementById("augUpgrades").checked ? 20 : 0;
   pointsFor += augmentedSharp;
   let sharpnessIndex = keysForSharpness.length;
   while (augmentedSharp && sharpnessIndex--) {
      let color = keysForSharpness[sharpnessIndex];
      let pointsToAdd = Math.min(sharpness[color] - 10, augmentedSharp);
      sharpness[color] -= pointsToAdd;
      augmentedSharp -= pointsToAdd;
   }

   while (pointsFor) {
      const min = Math.min(pointsFor, handicraft.shift());
      sharpness[keysForSharpness[startingIndex]] += min;
      --startingIndex;
      pointsFor -= min;
   }

   return { ...sharpness };
}

const sharpnessReduction = reduction => 1 / (1 - reduction);

// export function TotalHitsOfSharpUsed(power) {
function applySharpnessSkills(aff) {
   const keysForSharpness = ["purple", "white", "blue", "green", "yellow", "orange", "red"];
   let totalSharp = getInitialSharpness();
   const razorSharp = sharpness_thisKey.skills.RazorSharp[get.selectedValue("RazorSharp")].Sharp;
   const mastersTouch = sharpness_thisKey.skills.MastersTouch[get.selectedValue("MastersTouch")].Sharp * aff;

   // Applies the extra hits of sharpness from the Masters Touch skill;
   const mTBonus =
      aff > 0 && mastersTouch ?
         sharpnessReduction(mastersTouch) * sharpnessReduction(razorSharp)
      :  sharpnessReduction(razorSharp);

   keysForSharpness.forEach(color => totalSharp[color] *= mTBonus);
   return totalSharp;
}

function listOfAllComboHits(comboTracker) {
   let [...listOfEachAttack] = comboTracker;
   if (comboTracker[0] == null) {
      return;
   }

   let comboMulti = document.getElementsByClassName("inputComboRepeat")[0].value;
   // For each pont in the comboMultiplier input, adds another comboTracker [] to the listOfEachAttack
   while (comboMulti > 1) {
      listOfEachAttack = listOfEachAttack.concat(comboTracker);
      --comboMulti;
   }

   return listOfEachAttack;
}

// Finds HitsOfSharpness current sharpness as well as what combo hits were used how many times per color
function hitsPerColorSharp(comboTracker, affinity = 0) {
   const keysForSharpness = ["purple", "white", "blue", "green", "yellow", "orange", "red"];
   let everyHitsAttackIndex = listOfAllComboHits(comboTracker);

   // array to hold the list of all combo hits per color sharpness
   const comboHitsPerColor = {
      purple: [],
      white: [],
      blue: [],
      green: [],
      yellow: [],
      orange: [],
      red: [],
   };

   // applies sharpness reduction skills...bow does not use sharpness
   const maxHitsPerColor =
      sharpness_weaponChange.weaponType !== "Bow" ? applySharpnessSkills(affinity) : [0, 0, 0, 1, 0, 0, 0, 0];

   const sharpnessCapacity = Object.values(maxHitsPerColor).reduce((a, b) => a + b);
   if (everyHitsAttackIndex) {
      let sharpnessIndex = 0;
      const listOfAllAttacks = getUsedAttacks();
      attackLoop: for (const thisAttackIndex of everyHitsAttackIndex) {
         // Gunlance shelling rows come after the physical attacks and are not in this list.
         // They do not use the sharpness colors here, so skip them.
         if (!listOfAllAttacks[thisAttackIndex]) continue;

         let ticsPerAttack = listOfAllAttacks[thisAttackIndex].ticsPer + 1;

         const sharpUsedPerTick = getHitsPerTick(
            listOfAllAttacks[thisAttackIndex].hitsOfSharp,
            thisAttackIndex
         );

         while (ticsPerAttack--) {
            if (maxHitsPerColor[keysForSharpness[sharpnessIndex]] < 0.1 && ++sharpnessIndex === 7)
               break attackLoop;

            comboHitsPerColor[keysForSharpness[sharpnessIndex]].push(thisAttackIndex);
            maxHitsPerColor[keysForSharpness[sharpnessIndex]] -= sharpUsedPerTick;
         }
      }
   }

   return [maxHitsPerColor, comboHitsPerColor, sharpnessCapacity];
}

function getHitsPerTick(hitsOfSharp, index) {
   if (document.getElementById("ProtectivePolish").checked || sharpness_weaponChange.weaponType === "Bow") {
      return 0;
   }

   if (sharpness_weaponChange.weaponType === "Gunlance") return 1;

   return sharpness_weaponChange.weaponType !== "DualBlades" ? hitsOfSharp : hitsOfSharp / 3;
}

function getComboHitsAndSetSharpness(comboTracker, affinity = 0) {
   const keysForSharpness = ["purple", "white", "blue", "green", "yellow", "orange", "red"];
   const [remainingSharp, comboHitsPerColor, total] = hitsPerColorSharp(comboTracker, affinity);
   let sharpIndex = Object.values(remainingSharp).lastIndexOf(0);
   document.getElementById("Sharpness").selectedIndex = sharpIndex < 0 ? 7 : sharpIndex;
   for (let color of keysForSharpness) {
      const el = document.getElementById(color);
      el.style.width = `${remainingSharp[color] / total * 99.9}%`;
      el.textContent = remainingSharp[color] < 0.1 ? "" : ~~remainingSharp[color];
      el.style.display = el.textContent === "" ? "none" : "";
   }

   return comboHitsPerColor;
}

;// ./src/main/weaponRampage.js




const weaponRampage_weaponChange = getWeaponChange();
const skillStats = skill => window.thisKey.skills[skill][1];
const species = () => Object.values(window.thisKey.monster[get.elValue("dropMonster2")].species);

const applyRampageSkill = {
   "Hellion Mode": () => weaponRampage_weaponChange.weaponType === "DualBlades" ? { aff: 20 } : {},

   "Valstrax Soul": power => power.eleType === "Dragon" ? skillStats("ValstraxSoul") : {},

   "Kushala Daora Soul": () => skillStats("KushalaDaoraSoul"),

   "Dulling Strike": () =>
      document.getElementById("Sharpness").selectedIndex < 5 ? skillStats("DullingStrike") : {},

   "Wyvern Exploit": () => species[1] !== "Invalid" ? skillStats("AntiSpecies") : {},

   "Fanged Exploit": () => species[3] ? skillStats("AntiSpecies") : {},

   "Anti-Aerial Species": () => species[2] === "Arial" ? skillStats("AntiSpecies") : {},

   "Anti-Aquatic Species": () => species[2] === "Aquatic" ? skillStats("AntiSpecies") : {},

   "Fireblight Exploit": () => skillStats("ElementalBlightExploit"),

   "Waterblight Exploit": () => skillStats("ElementalBlightExploit"),

   "Iceblight Exploit": () => skillStats("ElementalBlightExploit"),

   "Thunderblight Exploit": () => skillStats("ElementalBlightExploit"),

   "Dragonblight Exploit": () => skillStats("ElementalBlightExploit"),

   "Magnamalo Soul": () => skillStats("MagnamaloSoul"),

   BrutalStrike: (power, skillStats) => {
      if (skillStats.BrutalStrike === 0) {
         power.efrMulti = power.stats.aff * -1 * 0.2 * 1.5 - power.stats.aff * 0.8 * 0.75;
      } else {
         power.efrMulti = power.stats.aff * -1 * 0.25 * 2 - power.stats.aff * -1 * 0.75 * 0.75;
      }

      return { critBoost: 1.5 };
   },

   "Element Exploit": power => {
      if (
         get.eleHZ(power.eleType) >= 25 &&
         (/Fire|Water|Ice|Thunder|Dragon/i.test(power.eleType) ||
            weaponRampage_weaponChange.weaponType.includes("BowGun") &&
               /Fire|Water|Ice|Thunder|Dragon/i.test(power.attackName))
      ) {
         return { PEM: power.rampageSlots === 0 ? 1.3 : 1.15 };
      }
   },
};

;// ./src/main/getStatsForUsedSkills.js






const getStatsForUsedSkills_weaponChange = getWeaponChange();
const { thisKey: getStatsForUsedSkills_thisKey } = window;
const bombardierTest = new Set(["Sticky", "Wyvern"]);
const criticalFirePowerTest = new Set(["Normal", "Spread", "Pierce"]);

const skillMethods = {
   Agitator: () => document.getElementById("enraged").classList.contains("selected"),

   OffensiveGuard: () => /^(Charge|Sword|HeavyBowGun|Lance|Great)/.test(getStatsForUsedSkills_weaponChange.weaponType),

   WeaknessExploit: power => get.rawHZ(get.lower(power.type)) >= 45,

   ElementExploit: power => get.eleHZ(get.lower(power.eleType)) >= 20,

   SneakAttack: power => !power.NoSneak,

   BloodAwakening: () => true,

   Artillery: power => power.type === "IgnoreHZV" && /Gun$|^Charge|^Gun/.test(getStatsForUsedSkills_weaponChange.weaponType),

   RapidMorph: power => /Morph|Condensed Spinning|Up Roundslash/.test(power.attackName),

   ChargeMaster: power => power.ChargeMaster,

   MindsEye: power => ~~(25 / JSON.parse(get.elValue("Sharpness")).PRM) >= get.rawHZ(get.lower(power.type)),

   PierceUp: power => /Pierce L?v?\d/.test(power.attackName) && /BowGun$|^Bow$/.test(getStatsForUsedSkills_weaponChange.weaponType),

   SpreadUp: power => /Spread/.test(power.attackName) && /BowGun$|^Bow$/.test(getStatsForUsedSkills_weaponChange.weaponType),

   NormalRapidUp: power =>
      /Normal|Rapid/.test(power.attackName) && /BowGun$|^Bow$/.test(getStatsForUsedSkills_weaponChange.weaponType),

   SpecialAmmoBoost: power =>
      /Wyvern|Pierce/.test(power.attackName) && /BowGun$|^Bow$/.test(getStatsForUsedSkills_weaponChange.weaponType),

   RapidFireUp: power => /RF\+/.test(power.attackName),

   DragonConversion: power =>
      /Fire|Water|Ice|Thunder|Dragon/i.test(power.eleType) ||
      /Fire|Water|Ice|Thunder|Dragon/i.test(power.attackName),

   Frostcraft(power) {
      if (!getStatsForUsedSkills_weaponChange.weaponType.includes("BowGun")) return true;

      let key = power.attackName.split(" ")[0];
      if (!getStatsForUsedSkills_thisKey.skills.Frostcraft[key]) {
         key = getStatsForUsedSkills_weaponChange.weaponType;
      }

      let bonus = getStatsForUsedSkills_thisKey.skills.Frostcraft[key][window.selectedSkills.Frostcraft];
      power.stats.PRM *= bonus.PRM;
      power.stats.PEM *= bonus.PEM;
      power.skillRecord.add("Frostcraft");
   },
   Bombardier: power => {
      if (
         power.type !== "IgnoreHZV" ||
         getStatsForUsedSkills_weaponChange.weaponType === "ChargeBlade" && !power.phialType.includes("Impact")
      )
         return;

      if (
         getStatsForUsedSkills_weaponChange.weaponType === "ChargeBlade" && power.phialType.includes("Impact") ||
         getStatsForUsedSkills_weaponChange.weaponType === "Gunlance"
      )
         return true;

      let skillType = power.attackName.slice(0, 6);
      if (bombardierTest.has(skillType)) {
         if (getStatsForUsedSkills_weaponChange.weaponType === "LightBowGun") return true;

         power.stats.PRM *= get.statsByIndex("Bombardier")[skillType].PRM;
         power.skillRecord.add("Bombardier");
      }
   },

   ChargeBlade: {
      SavageAxe: power => !/3rd|(?<!Midair |Axe: )UED|(?<!Charged )Sword(?!.*Shield)/.test(power.attackName),

      ImpactShieldCharge: power => power.phialType === "Impact Phial",

      EleShieldCharge: power => power.phialType === "Element Phial",
   },
   LongSword: {
      SpiritGauge: power => !/Helm Breaker|Serene/.test(power.attackName),

      Helmbreaker: power => /Helm Breaker/.test(power.attackName),

      SerenePose: power => /Serene/.test(power.attackName),
   },
   GreatSword: {
      StrongarmStance(power) {
         const thisAttack = power.attackName.match(
            /Charged Slash|Rising Slash|Wide Slash|Strong Charged Slash|True Charged Slash|Rage Slash/
         );

         if (thisAttack) {
            applyNewStats(power, "StrongarmStance", thisAttack);
         }
      },

      PowerSheath: () => true,

      ChargeLv(power) {
         let thisAttack = power.attackName.match(/(?<=Lv)[1-3]/);
         if (thisAttack && !power.attackName.includes("Tackle")) {
            power.rawMV *= Number(`1.${thisAttack[0]}`);
            power.skillRecord.add(`ChargeLv${thisAttack[0]}`);
         }
      },
   },
   Lance: {
      LanceCharge: () => true,
   },
   InsectGlaive: {
      KinsectBuff: () => true,
   },
   DualBlades: {
      ArchdemonMode: () => true,

      DemonMode: power => !/Feral Demon Mode/.test(power.attackName),

      FeralDemonMode: power => !/Demon Mode/.test(power.attackName),
   },
   SwitchAxe: {
      ImpactPhial: power => {
         if (/Sword|Elemental|ED/.test(power.attackName)) {
            power.stats.BRM *= 1.15;
            power.skillRecord.add("Impact Phial");
         }
      },

      ElementalPhial: power => {
         if (/Sword|Elemental|ED/.test(power.attackName)) {
            power.stats.BEM *= 1.45;
            power.skillRecord.add("Elemental Phial");
         }
      },
   },
   Bow: {
      BowCoating(power) {
         if (!power.attackName.includes("Stake")) {
            get.stats(
               power.stats,
               getStatsForUsedSkills_thisKey.skills[document.getElementById("BowCoating").selectedOptions[0].text]
            );

            power.skillRecord.add("BowCoating");
         }
      },
      HerculesDraw: () => true,
      UpperCrit: () => true,
      chargeLevel: () => true,
   },
   // heavyBowGun class would also inherit from ranged
   HeavyBowGun: {
      chargeLevel(power) {
         if (/snipe|heart|Cluster/.test(power.attackName)) {
            return;
         }

         if (!power.NoEleBuff) return true;

         power.baseRaw *=
            window.skillStats.ChargeLevel[document.getElementById("ChargeLevel").selectedIndex].PRM;

         power.skillRecord.add("ChargeLevel");
      },
   },

   // lightBowGun class would also inherit from ranged
   LightBowGun: {
      EvadeHop: () => true,
      FanningManeuver: () => true,
      ElementalReload: () => true,
      CriticalFirePower: power => {
         let key = power.attackName.slice(0, 6);
         if (criticalFirePowerTest.has(key) && (key !== "Pierce" || /Pierce L?v?\d/.test(power.attackName))) {
            applyNewStats(power, "CriticalFirePower", key);
         }
      },
   },
};

function getStatsForUsedSkills(power, thisWeapon = getStatsForUsedSkills_weaponChange.weaponType) {
   let { specialCase, selectedSkills } = window;
   let { types } = getStatsForUsedSkills_thisKey;
   specialCase.arr = [];
   power.skillRecord = new Set();
   power.stats = {
      BR: 0,
      BRM: 1,
      PRM: 1,
      BEM: 1,
      BE: 0,
      PEM: 1,
      EFE: 1,
      EFR: 1,
      aff: power.baseAff,
   };

   let rampageValue = document.querySelector("#weaponRampage0").value;
   if (applyRampageSkill[rampageValue]) {
      get.stats(power.stats, [applyRampageSkill[rampageValue](power)]);
   }

   let selectedSkillKeys = Object.keys(selectedSkills);
   for (const skill of selectedSkillKeys) {
      if (
         !skillMethods[skill] && types[power.type].includes(skill) ||
         skillMethods[skill] && skillMethods[skill](power)
      ) {
         specialCase.add(skill, power);
      }
   }

   get.stats(power.stats, specialCase.arr);
   get.$$("#dango select.skill:not(.classSpecific)").forEach(el => {
      if (
         el.selectedIndex > 0 &&
         !power.skillRecord.has(el.id) &&
         types[power.type].includes(el.id) &&
         (!skillMethods[el.id] || skillMethods[el.id](power))
      ) {
         applyNewStats(power, el.id, el.selectedIndex);
      }
   });

   document.querySelectorAll(`select.skill.classSpecific.${thisWeapon}`).forEach(el => {
      if (
         el.selectedIndex > 0 &&
         !power.skillRecord.has(el.id) &&
         (!skillMethods[el.id] || skillMethods[el.id](power)) &&
         (!skillMethods[thisWeapon][el.id] || skillMethods[thisWeapon][el.id](power))
      ) {
         applyNewStats(power, el.id, el.selectedIndex);
      }
   });

   document.querySelectorAll("#boxes input.skillButton").forEach(thisInput => {
      if (thisInput.checked && !power.skillRecord.has(thisInput.id) && !thisInput.id.includes("Hunting")) {
         applyNewStats(power, thisInput.id);
         if (thisInput.id === "DemonAmmo" && /(Sever|Blunt)/.test(power.type)) {
            power.stats.PRM *= 1.1;
         }
      }
   });

   if (power.eleType !== "None" && power.eleType !== "Heal") {
      types[power.eleType].forEach(skill => {
         if (!get.selectedValue(skill)) return;

         applyNewStats(power, skill, get.selectedValue(skill));
      });
   }

   if (thisWeapon === "GreatSword") {
      skillMethods.GreatSword.ChargeLv(power);
   }

   if (thisWeapon === "SwitchAxe") {
      if (power.phialType === "Impact Phial") {
         skillMethods.SwitchAxe.ImpactPhial(power);
      } else {
         skillMethods.SwitchAxe.ElementalPhial(power);
      }
   }

   power.stats.aff = Math.min(100, power.stats.aff) / 100;
   return power;
}

// get.stats();

function applyNewStats(power, skillName, skillLevel) {
   if (skillLevel) {
      get.stats(power.stats, getStatsForUsedSkills_thisKey.skills[skillName][skillLevel]);
   } else {
      get.stats(power.stats, getStatsForUsedSkills_thisKey.skills[skillName]);
   }

   power.skillRecord.add(skillName);
}
;// ./src/loading/ClipSize.js
class ClipSize extends Int8Array {
   get Normal() {
      return [this[1], this[2], this[3]];
   }

   get Pierce() {
      return [this[4], this[5], this[6]];
   }

   get Spread() {
      return [this[7], this[8], this[9]];
   }

   get Shrapnel() {
      return [this[10], this[11], this[12]];
   }

   get Sticky() {
      return [this[13], this[14], this[15]];
   }

   get Cluster() {
      return [this[16], this[17], this[18]];
   }

   get Poison() {
      return [this[19], this[20]];
   }

   get Paralysis() {
      return [this[21], this[22]];
   }

   get Sleep() {
      return [this[23], this[24]];
   }

   get Exhaust() {
      return [this[25], this[26]];
   }

   get Recover() {
      return [this[27], this[28]];
   }

   get Demon() {
      return [this[29]];
   }

   get Armor() {
      return [this[30]];
   }

   get Fire() {
      return [this[31], this[32]];
   }

   get Water() {
      return [this[33], this[34]];
   }

   get Ice() {
      return [this[35], this[36]];
   }

   get Thunder() {
      return [this[37], this[38]];
   }

   get Dragon() {
      return [this[39], this[40]];
   }

   get Slicing() {
      return [this[41]];
   }

   get WyvernShot() {
      return [this[42]];
   }

   get Tranq() {
      return [this[43]];
   }

   get WyvernBlast() {
      return [this[44]];
   }

   get Wyvernheart() {
      return [this[45]];
   }

   get Wyvernsnipe() {
      return [this[46]];
   }
}

/* let arg = "aoradrr";
let ugh = "Daora's Worldbearer";

function fuzzySearch(toCheck, toFind) {
   let check = toCheck[0];
   let find = toFind[0];
   const checkLen = toCheck.length;
   const findLen = toFind.length;
   let i = 0;
   let j = 0;
   while (true) {
      while (find !== check) {
         if (++i < checkLen) {
            check = toCheck[i];
         } else {
            return false;
         }
      }
      if (++j === findLen) {
         return true;
      }

      check = toCheck[++i];
      find = toFind[j];
   }
}*/

// console.log(fuzzySearch(ugh, arg));

;// ./src/main.js
/* unused harmony import specifier */ var main_get;


const main_weaponChange = getWeaponChange();





























window.comboTracker = [];

const version = "2";
let specialCase = {};
let main_skillStats = {};
window.specialCase = specialCase;

window.skillStats = main_skillStats;

let { comboTracker } = window;
const { thisKey: main_thisKey } = window;
const { skills: main_skills, types: main_types } = main_thisKey;

function timesUsed(valueToCheck, arr = comboTracker, count = 0) {
   arr.forEach(value => {
      if (value == valueToCheck) ++count;
   });

   return count;
}

const main_skillMethods = {
   Dereliction: values => get.skillStats("Dereliction", values.level, values.previous.slice(-1)),
   Strife: values => get.skillStats("Strife", values.previous, values.level),

   BloodAwakening: values =>
      get.skillStats(
         "BloodAwakening",
         main_weaponChange.weaponType.endsWith("BowGun") ? "gunner" : "melee",
         values.previous,
         values.level
      ),

   Fortify: values => get.skillStats("Fortify", values.previous.slice(-1)),
   ChargeLevel: () => get.statsByIndex("ChargeLevel"),
   Bombardier: () => get.skillStats("Bombardier"),

   Frostcraft: values =>
      get.skillStats(
         "Frostcraft",
         main_weaponChange.weaponType === "Bow" ? "Bow" : "melee",
         values.previous.slice(-1)
      ),
   DragonConversion: () => {
      const type = main_weaponChange.weaponType.includes("BowGun") ? "ranged" : "melee";
      let result = 0;
      let eleResists = get.$$("#weapon .eleDiv:not(.def)>output");
      for (let eleResist of eleResists) {
         result += Math.min(50, Math.max(0, +eleResist.textContent));
      }

      return {
         BE: result * get.statsByValue("DragonConversion")[type],
      };
   },
   Bludgeoner(values) {
      const sharpness = get.elSelectedIndex("Sharpness");
      const bludgeoner = +values.level
      if (sharpness < 4 && bludgeoner > 1 || sharpness > 2 && bludgeoner < 4) {
         return get.skillStats("Bludgeoner", 2);
      } else if (bludgeoner === 1 && sharpness < 4) {
         return get.skillStats("Bludgeoner", 1);
      }

      return get.skillStats("Bludgeoner", 0);
   },
};

// let calcTestModule = import("./calculatorTest.js");
//
// Promise.all([importJsons, calcTestModule]).then(([importJsonsModule, calcTestModule]) => {
// let skillsObj = {};
// Object.values(weaponType.options).map((el, index) => {
// weaponType.selectedIndex = index;
// classChange(el.text);
// skillsObj[el.text]= calcTestModule.testSkills(el.text, thisKey);
// });
// weaponType.selectedIndex = 0;
// classChange("LightBowGun");
// console.log(skillsObj);
//
// });
window.combos = { total: new Set() };

get.el.armorSelects.forEach(el =>
   el.addEventListener("change", function () {
      armorReset(el.id);
   })
);

getArmorsDecoArrNSkillsObj();

const weaponSelectors = "#dropWeaponType,#dropWeapon";
const charmLimiters = ".charmSlot";

const remainingSelectSelectors = `select:not(${weaponSelectors},${get
   .armorTypes()
   .map(x => `#${x}`)
   .join(",")},.augmentType,.augment,#dropMon2,#dropHZV2,#dropSkills,#charmSlots select)`;

const checkBoxSelectors = get.$$(".check:not(label)");
const displayElement = document.querySelectorAll("#statsEffective span");
const displayImage = document.getElementsByClassName("statsEle")[0];
let key = localStorage.getItem("index");

if (key !== null) {
   loadCacheState(+key);
   for (let i = 0; i < 5; ++i) {
      let saveData = localStorage.getItem(i);
      if (saveData) {
         setSaveDisplays(document.querySelectorAll(`#saveState${i} ~ *`), JSON.parse(saveData), 1);
      }
   }
} else {
   setDecoDisplay("charm", [2, 2, 2]);

   setDecoDisplay("weapon", [4, 2, 0]);

   main_weaponChange.resetWeaponType();

   get.el.quest.innerHTML = `<option value="${main_thisKey.quest.length - 1}">${main_thisKey.quest.at(-1).quest}>`;

   changeMonsters("Toadversary", 1);

   rampageSelect();

   dataCompile();

   saveCache();
}

// /export function getGrade(a, b){
// if (a.includes("S") || b.includes("S")) return "S";
// if (b <= a) return b;
// return a;
// };
// const ugh = testSkills();
/**
 *@typedef {object} skillKeys
 *@property {number} level - the level of the skill
 *@property {string} previous - text from the previous element
 */
/**
 * @function dataCompile
 * @property {skillKeys} skillKeys
 */
function dataCompile() {
   if (document.getElementById("wikiModel").open) {
      return;
   }

   console.log("dataCompile");
   window.selectedSkills = {};

   window.specialCase = {};
   // let power             = getWeaponMR();
   for (const el of get.$$("#EquippedSkillDisplay>output output")) {
      let [skillName, level] = el.textContent.replace(/\s/g, "").split(":");

      const skillKeys = {
         skillName,
         level,
         previous: el.previousElementSibling.textContent,
      };

      window.selectedSkills[skillName] = skillKeys.previous === "Inactive" ? 0 : +level;
      if (!window.selectedSkills[skillName]) {
         continue;
      }

      if (skillKeys.skillName === "Frostcraft" && main_weaponChange.weaponType.includes("BowGun")) {
         window.selectedSkills.Frostcraft = Math.min(+level, skillKeys.previous.slice(-1));
      } else if (main_skills[skillKeys.skillName]) {
         window.specialCase[skillName] =
            main_skillMethods[skillName] ? main_skillMethods[skillName](skillKeys) : get.statsByValue(skillName);
      }
   }

   window.specialCase.add = (skillName, power) => {
      window.specialCase.arr.push(window.specialCase[skillName]);

      power.skillRecord.add(skillName);
   };

   main_thisKey.BowCharge = get.selectedValue("BowChargePlus");
   if (main_weaponChange.weaponType.endsWith("Gun")) {
      rangedDPS();
   } else {
      meleeDPS();
   }

   updateElementDefense();
}

function rangedDPS() {
   get.$("output.elementalAug").value = 0;

   set.elValue("elementalResult", "+0");

   get.$("output.sharpnessAug").value = 0;

   set.elValue("sharpnessResult", "+0");

   let ammo;
   const rangedDamage = [];
   const ammoFrameData = [];
   let pass1 = true;
   const weapon = getWeaponMR();
   let rapidFirePointer = 0;
   let useRFAmmo = false;
   // iterate ammo"s
   for (let theseKeys of main_thisKey.ammo.keys) {
      // if ammo not used by weapon
      if (
         !theseKeys[0] ||
         weapon.clipSize[main_thisKey.ammo.keys.indexOf(theseKeys)] === 0 ||
         /Max|Error|Full/.test(theseKeys[0])
      ) {
         continue;
      }

      useRFAmmo =
         main_weaponChange.weaponType === "LightBowGun" &&
         theseKeys.includes(weapon.isRapidFire[rapidFirePointer]);

      // increments RF index when RF is used
      rapidFirePointer += +useRFAmmo;
      // if RF start at the RF ammo
      for (let i = useRFAmmo ? theseKeys.length / 2 : 0; i < theseKeys.length; i++) {
         // if not RF dont process RF ammo
         if (!useRFAmmo && theseKeys[i].includes("RF+")) {
            break;
         }

         let power = getStatsForUsedSkills({
            ...weapon,
            ...main_thisKey.ammo[theseKeys[i]],
            ...{ attackName: theseKeys[i] },
         });

         power = damageCalculations(power);
         if (/Demon|Armor|Wyvern Blast|Full|Error|Max|Wyvernh|Glide|Wyvernsn|Guard/.test(power.attackName)) {
            ammo.ticsAdjust = 1;
         } else {
            ammo = calculateAmmoFrames(power);
         }

         const totalEffective = ~~((~~power.EFR + ~~power.EFE) * ammo.ticsAdjust);
         const totalCrit = ~~(~~power.rawCrit + ~~power.eleCrit);
         const totalNon = ~~(~~power.rawNon + ~~power.eleNon);
         const shotsToKill = ~~(0.99 + +get.elValue("health") / totalEffective);

         let timeInSeconds =
            shotsToKill * (60 / ammo.shotsPerMin) + (/Stic|Slic/.test(power.attackName) ? 5 : 0);

         let minutes = ~~(timeInSeconds / 60);
         let seconds = ~~(timeInSeconds % 60);
         if (seconds < 10) seconds = `0${seconds}`;

         let milliseconds = timeInSeconds.toString().match(/(?<=\.)\d?\d?/);
         milliseconds =
            !milliseconds ? "00"
            : milliseconds[0].length > 1 ? milliseconds[0]
            : `${milliseconds[0]}0`;

         let timeToKill =
            minutes >= 100 ? "99'99\"99"
            : timeInSeconds <= 3 || power.attackName.includes("Cluster") ? "Unknown"
            : `${minutes}'${seconds}"${milliseconds}`;

         const rawBoth = [`${~~power.rawNon} / ${~~power.rawCrit}`];
         const eleBoth = [`${~~power.eleNon} / ${~~power.eleCrit}`];
         const total = [`${~~totalNon} / ${~~totalCrit}`];

         const damage = [
            power.attackName,
            rawBoth,
            eleBoth,
            total,
            totalEffective,

            
               ammo.shotsPerGain === "Infinity%" ||
               ammo.shotsPerGain === "NaN%" ||
               ammo.shotsPerGain === "0.00%"
             ?
               "No Gain"
            :  ammo.shotsPerGain,
            /(\d{2},\d{3})/.test(shotsToKill) ? "N/A" : shotsToKill.toLocaleString(),
            timeToKill,
         ];

         rangedDamage.push(damage);

         const ammoStats = [
            power.attackName,
            power.rawMV,
            ammo.reloadSpeed || "N/A",
            ammo.recoilSpeed || "N/A",
            !ammo.clipSize ? "N/A" : ammo.clipSize,
            power.ticsPer,
            ammo.shotsPerMinBase || "N/A",
            ammo.shotsPerMin || "N/A",
         ];

         ammoFrameData.push(ammoStats);
         if (pass1) {
            let adjustedPRM = power.stats.PRM;
            if (get.elSelectedIndex("CriticalFirePower") === 1) {
               adjustedPRM /= 1.3;
            }

            if (get.selectedValue("NormalRapidUp")) {
               adjustedPRM /= main_skills.NormalRapidUp[get.selectedValue("NormalRapidUp")].PRM;
            }

            const rawCrit = getCritBoost(power.stats.aff, power.Crit);
            const eleCrit = getCritEle(power.stats.aff, power.Crit);

            const stats = [
               ["Base", ~~power.baseRaw, ~~(0.1 + 22 * (1 + power.raw / 100))],
               [
                  "eTrue",
                  ~~power.raw,
                  ~~(0.1 + (22 * power.stats.BEM + power.stats.BE) * (1 + power.raw / 100)),
               ],
               [
                  "Effective",
                  ~~(0.1 + power.raw * rawCrit.EFR * adjustedPRM),
                  ~~(
                     0.1 +
                     (22 * power.stats.BEM + power.stats.BE) *
                        (1 + power.raw / 100) *
                        power.stats.PEM *
                        eleCrit.EFE
                  ),
               ],
               [
                  "True",
                  ~~(0.1 + power.raw * rawCrit.PRM * adjustedPRM),
                  ~~(
                     0.1 +
                     (22 * power.stats.BEM + power.stats.BE) *
                        (1 + power.raw / 100) *
                        power.stats.PEM *
                        eleCrit.PEM
                  ),
               ],
               ["Critical"].concat(Number(rawCrit.EFR).toFixed(3), Number(eleCrit.EFE).toFixed(2)),
               ["Affinity", ~~(power.stats.aff * 100)],
            ];

            createTable(stats, "ammo");

            pass1 = false;
         }
         // if (!window.location.href.includes("GitHub")) console.log(power);
      }
   }

   rangedDamage.splice(0, 0, [
      "Ammo Type",
      "Raw",
      "Element",
      ["Total", "Combined Damage For a Single Tick"],
      [
         "Effective",
         "Calculates Every Tick Using EFE/EFR.\n" +
            "Max Ticks Are Based On The Monster's Minimum \n" +
            "Large Gold Crown Size At Optimal FPS/Proc Rate.\n" +
            "Adjust The Pierce Damage Adjust To Account For It Hitting Other Hit Zones.",
      ],
      ["RPM Gain", "The Percentage Increase Of Damage From Both \nAmmo Up And Spare Shot In 60 seconds."],
      ["Shots To Kill", "Use the Pierce Damage Adjust For Accurate Results"],
      [
         "Time To Kill",
         "Can Have Variance Due To FPS However\n" +
            "The Percent Difference Will Stay Constant\n" +
            "This Is The DPS Uptime To Kill Not A Quest Completion",
      ],
   ]);

   buildDamageTable(rangedDamage, "dps");

   ammoFrameData.splice(0, 0, [
      "Ammo Type",
      "Raw MV",
      "Reload",
      "Recoil",
      "Clip Size",
      [
         "Procs Per",
         "Maximum Ticks Per Shot Using Optimal FPS, \nAs Well As The Monsters Minimum Large Gold Crown Size",
      ],
      ["RPM Base", "Shots Per Minute Including Recoil Down And Reload Speed"],
      ["Current RPM", "Shots Per Minute With AmmoUp And Spare Shot"],
   ]);

   buildDamageTable(ammoFrameData, "ammo");
}

function getSharpBonus(thisAttack) {
   let rawModifier = 1;
   let eleModifier = 1;
   if (!thisAttack.hitsOfSharp) {
      return { rawModifier, eleModifier };
   }

   if (main_weaponChange.weaponType !== "Bow") {
      const modifiers = main_skills.Sharpness[get.el.id("Sharpness").selectedOptions[0].text];
      rawModifier = thisAttack.hitsOfSharp ? modifiers.PRM : 1;

      eleModifier =
         thisAttack.hitsOfSharp && !get.helpers.isStatusAttack(thisAttack.eleType) ? modifiers.PEM : 1;
   } else if (thisAttack.type !== "Shot") {
      const costingUsed = window.BowCoating.value;
      rawModifier =
         costingUsed === "Close-Range" ? 1.2
         : costingUsed === "Close-Range+" ? 1.39
         : 1;
   }

   return { rawModifier, eleModifier };
}

function meleeDPS() {
   const runTimeStart = performance.now();
   let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0];
   // let comboHitsUsed = {}
   const attackTypes = getWeaponMR();

   const power = getUsedAttacks().map(attack =>
      damageCalculations(getStatsForUsedSkills({ ...attack, ...attackTypes }))
   );

   if (/Inputs|inputButton/.test(window.event?.target?.className)) {
      updateComboTracker();

      updateComboDisplay();
   }

   // if (power.attackName === "Combo Damage") {
   const comboHitsUsed =
      main_weaponChange.weaponType === "Bow" ?
         hitsPerColorSharp(comboTracker)[1]
      :  getComboHitsAndSetSharpness(comboTracker, power[0].stats.aff);

   // if (comboTracker.includes(thisIndex.toString())) {

   // Element only counts toward the totals when it is real damage (Fire, Water, Thunder, Ice, Dragon).
   // Status weapons show their buildup in the Element column but it is not added to the damage totals.
   const addEle = get.helpers.hasElement(power[0].eleType);

   comboDamage = getComboDamage(comboHitsUsed, power, addEle);

   let meleeDamage = power.map(thisAttack => {
      const { rawModifier, eleModifier } = getSharpBonus(thisAttack);
      return [
         "inputElementHere",
         thisAttack.attackName,
         ...formatRow(
            getTableRowStats(
               {
                  rawMV: thisAttack.rawMV,
                  rawNon: thisAttack.rawNon * rawModifier,
                  rawCrit: thisAttack.rawCrit * rawModifier,
                  EFR: thisAttack.EFR * rawModifier,
                  eleNon: thisAttack.eleNon * eleModifier,
                  eleCrit: thisAttack.eleCrit * eleModifier,
                  EFE: thisAttack.EFE * eleModifier,
               },
               addEle
            )
         ),
      ];
   });

   const { rawModifier, eleModifier } = getSharpBonus(power[0]);

   const stats = [
      ["Base", ~~power[0].baseRaw, power[0].baseEle],
      ["eTrue", ~~power[0].raw, power[0].ele],
      ["True", ~~(power[0].rawCrit * rawModifier), ~~(power[0].eleCrit * eleModifier)],
      ["Effective", ~~(power[0].EFR * rawModifier), ~~(power[0].EFE * eleModifier)],
      [
         "Critical",
         getCritBoost(power[0].stats.aff).EFR.toFixed(3),
         getCritEle(power[0].stats.aff).EFE.toFixed(2),
      ],
      ["Sharp", rawModifier, eleModifier],
      ["Affinity", ~~(power[0].stats.aff * 100)],
   ];

   createTable(stats, power[0].eleType);

   const header = [
      ["Combo", "Times this attack is used in the combo", "headTall"],
      ["Attack Name", "Use the arrows to add or remove a hit", "headTall"],
      ["MV", "Motion value", "headTall"],
      ["Effective", "Average raw + element per hit with affinity factored in", "headTall headEffective"],
      ["Raw", "Raw damage of one hit", "headGroup"],
      ["Ele", "Element damage or status buildup of one hit", "headGroup"],
      ["Total", "Raw + element for one hit. Status buildup is not counted", "headGroup"],
      ["Normal", "Raw, no crit", "headSub"],
      ["Crit", "Raw on a crit", "headSub"],
      ["Normal", "Element, no crit", "headSub"],
      ["Crit", "Element on a crit", "headSub"],
      ["Normal", "Raw + element, no crit", "headSub"],
      ["Crit", "Raw + element on a crit", "headSub"],
   ];
   meleeDamage = [header].concat(meleeDamage);
   if (main_weaponChange.weaponType === "Gunlance") {
      gunlanceShelling(meleeDamage, comboDamage);
   }

   meleeDamage[1] = ["inputElementHere", "Combo Damage", ...formatRow(comboDamage)];

   buildDamageTable(meleeDamage, "dps");

   if (!window.location.href.includes("github")) {
      console.log((performance.now() - runTimeStart) / 1000);
   }
}

/**
 * @function getComboDamage
 * Goes through each color sharpness and filters the recorded attacks for the number of times this current
 * attack was used then applies the given sharpness modifier to the damage if damage type is sever or blunt then
 *  multiplies by the times used saves results in the comboDamage var and += the totals for each sharpness/attack
 * to later be used to update the comboDamage in the dpsTable
 */
function getComboDamage(comboHitsUsed, power, addEle) {
   let rawMV = 0;
   let rawNon = 0;
   let rawCrit = 0;
   let eleNon = 0;
   let eleCrit = 0;
   let EFR = 0;
   let EFE = 0;
   const colorsUsed = Object.entries(comboHitsUsed).filter(x => x[1].length > 0);
   let eachAttackUsed = new Set(comboTracker);
   colorsUsed.forEach(sharpness => {
      for (let attackIndex of eachAttackUsed) {
         let usedCount = timesUsed(attackIndex, sharpness[1]);
         if (!usedCount) continue;

         let thisAttack = power[attackIndex]; // Use the corresponding object in the power array
         // Gunlance shelling rows are not in the power array, gunlanceShelling adds them to the combo
         if (!thisAttack) continue;

         const { rawModifier, eleModifier } = getSharpBonus(thisAttack);
         rawMV += ~~(thisAttack.rawMV * usedCount);

         rawNon += ~~(thisAttack.rawNon * rawModifier) * usedCount;

         rawCrit += ~~(thisAttack.rawCrit * rawModifier) * usedCount;

         eleNon += ~~(thisAttack.eleNon * eleModifier) * usedCount;

         eleCrit += ~~(thisAttack.eleCrit * eleModifier) * usedCount;

         EFR += ~~(thisAttack.EFR * rawModifier) * usedCount;

         EFE += ~~(thisAttack.EFE * eleModifier) * usedCount;
      }
   });

   return getTableRowStats({ rawMV, rawNon, rawCrit, EFR, eleNon, eleCrit, EFE }, addEle);
}

function getCritEle(affinity, canCrit = true) {
   return canCrit ?
         {
            PEM: +main_skills.CriticalElement[get.selectedValue("CriticalElement")].PEM,
            EFE: 1 + (main_skills.CriticalElement[get.selectedValue("CriticalElement")].PEM - 1) * affinity,
         }
      :  {
            PEM: 1,
            EFE: 1,
         };
}

/**
 * @param {number} affinity
 * @param {boolean} canCrit
 */
function getCritBoost(affinity, canCrit = true) {
   return canCrit ?
         {
            PRM: +main_skills.CriticalBoost[get.selectedValue("CriticalBoost")].PRM,
            EFR: 1 + (main_skills.CriticalBoost[get.selectedValue("CriticalBoost")].PRM - 1) * affinity,
         }
      :  {
            PRM: 1,
            EFR: 1,
         };
}

function damageCalculations(power) {
   if (!power.Raw) {
      [power.raw, power.rawNon, power.EFR, power.rawCrit] = [0, 0, 0, 0];
   } else {
      power.raw = Math.min(
         ~~(
            ~~(~~power.baseRaw * power.stats.BRM + power.stats.BR + 0.1) *
            (document.getElementById("HuntingHornAttack").checked ? 1.1 : 1)
         ),
         2600
      );

      if (window.selectedSkills.PunishingDraw) {
         power.raw += main_skills.PunishingDraw[window.selectedSkills.PunishingDraw].BR;
      }

      power.rawFormula =
         power.raw * power.stats.PRM * get.rawHZ(get.lower(power.type)) * power.rawMV / 10000;

      power.rawNon = ~~Math.max(1, 0.1 + power.rawFormula);

      const getRawCrit = getCritBoost(power.stats.aff, power.Crit);
      power.EFR = ~~Math.max(1, 0.1 + power.rawFormula * getRawCrit.EFR);

      power.rawCrit = ~~Math.max(1, 0.1 + power.rawFormula * getRawCrit.PRM);
   }

   if (power.NoEleBuff) {
      [power.ele, power.eleNon, power.EFE, power.eleCrit] = [
         power.baseEle,
         power.baseEle,
         power.baseEle,
         power.baseEle,
      ];
   } else if (!power.Ele || power.eleType === "None") {
      [power.ele, power.eleNon, power.EFE, power.eleCrit] = [0, 0, 0, 0];
   } else {
      power.eleAmmo = main_weaponChange.weaponType.endsWith("Gun") ? 1 + power.raw / 100 : 1;

      power.ele = Math.min(~~(0.1 + power.baseEle * power.stats.BEM + power.stats.BE), 560);

      power.eleFormula =
         power.ele * power.stats.PEM * (get.eleHZ(power.eleType) / 100) * power.eleAmmo * power.eleMV;

      power.eleNon = ~~Math.max(1, power.eleFormula > 0 && power.eleFormula < 1 ? 1 : ~~power.eleFormula);

      power.EFE = ~~Math.max(1, 0.1 + power.eleFormula * getCritEle(power.stats.aff, power.Crit).EFE);

      power.eleCrit = ~~Math.max(1, 0.1 + power.eleFormula * getCritEle(power.stats.aff, power.Crit).PEM);
   }

   return {
      ...power,
   };
}

/**
 * @function gunlanceShelling
 * Adds the shelling rows for the equipped Gunlance and adds any shelling hits used to the combo totals.
 * Shelling cannot crit, so Normal and Crit are the same. Its fire damage is always added.
 * @param {Array[]} currentDamage table rows (header first)
 * @param {number[]} comboDamage same order as getTableRowStats, mutated in place
 */
function gunlanceShelling(currentDamage, comboDamage) {
   const { shellingType, shellingindex } = getWeaponMR();
   const string = `${shellingType} Lv${shellingindex})`;
   const seen = new Set();
   let raw = 1;
   let EFR = 1;
   main_thisKey.Gunlance.attacks.forEach(attack => {
      // The data has some attacks twice, once with a full-width bracket in the name
      const attackName = attack.attackName.replace("\uFF08", " (");
      if (attack.type !== "IgnoreHZV" || !attackName.includes(string) || seen.has(attackName)) {
         return;
      }

      seen.add(attackName);

      const baseRaw = attack.rawMV * get.statsByValue("Artillery").BRM;
      raw = ~~(baseRaw * main_skills.Bombardier[get.elSelectedIndex("Bombardier")][0]);

      EFR = ~~(baseRaw * main_skills.Bombardier[get.elSelectedIndex("Bombardier")][1]);

      let ele = attack.baseEle;
      const timesHit = attack.ticsPer + 1 || 1;
      const total = (raw + ele) * timesHit;
      const effective = (EFR + ele) * timesHit;
      // Row id the combo inputs use for this attack (header is at index 0)
      const rowId = currentDamage.length - 1;
      currentDamage.push([
         "inputElementHere",
         attackName,
         ...formatRow([attack.rawMV, effective, raw, raw, ele, ele, total, total]),
      ]);

      let multiplier = timesUsed(rowId);
      comboDamage[1] += effective * multiplier;

      comboDamage[2] += raw * multiplier * timesHit;

      comboDamage[3] += raw * multiplier * timesHit;

      comboDamage[4] += ele * multiplier * timesHit;

      comboDamage[5] += ele * multiplier * timesHit;

      comboDamage[6] += total * multiplier;

      comboDamage[7] += total * multiplier;
   });
}

/**
 * @function formatRow
 * @param {number[]} values
 * @returns {string[]} values with thousands separators
 */
function formatRow(values) {
   return values.map(value => (~~value).toLocaleString());
}

/**
 * @function getTableRowStats
 * @param {{rawMV:number,rawNon:number,rawCrit:number,EFR:number,eleNon:number,eleCrit:number,EFE:number}} stats
 * @param {boolean} addEle add element to the Total and Effective values
 * @returns {number[]} [MV, Effective, Raw, Raw crit, Ele, Ele crit, Total, Total crit]
 */
function getTableRowStats(stats, addEle) {
   const ele = addEle ? 1 : 0;
   return [
      ~~stats.rawMV,
      ~~stats.EFR + ~~stats.EFE * ele,
      ~~stats.rawNon,
      ~~stats.rawCrit,
      ~~stats.eleNon,
      ~~stats.eleCrit,
      ~~stats.rawNon + ~~stats.eleNon * ele,
      ~~stats.rawCrit + ~~stats.eleCrit * ele,
   ];
}

function createTable(stats, eleType) {
   let eleEl = document.querySelectorAll(".statsEle");
   if (!eleEl[0].src.includes(get.lower(eleType))) {
      Object.values(eleEl).forEach(el => el.src = `./icons/${get.lower(eleType)}.svg`);
   }

   stats.forEach(stat => {
      get.$$(`#stats${stat[0]} span`).forEach((el, index) => el.textContent = stat[index + 1]);
   });
}

function comboReset() {
   if (!comboTracker.length) return;

   const previousType = get.elValue("previousWeaponType");
   // Resets the combo inputs to default values
   if (!get.$(".inputs") || previousType.includes("BowGun") || previousType === "") {
      return;
   }

   get.$$(".comboHits").forEach(x => x.remove());

   get.$$("#dpsBody>tr:nth-child(1)>*:nth-child(n+3)").forEach(x => x.value = 0);

   get.$$(".inputs").forEach(x => x.value = 0);

   get.$$(".inputComboRepeat").forEach(x => x.value = 1);

   comboTracker = [];
}

function updateComboTracker() {
   if (!document.getElementsByClassName("inputs")?.length) return;

   if (!comboTracker) comboTracker = [];

   if (Number.isNaN(+window.event?.target?.id) || window.event?.target?.id === "0") {
      return;
   }

   // If value in e?.target combo input > amount stored in comboTracker [] adds attack id to the end of the
   // comboTracker until they are ===
   let attackNumber = +window.event?.target?.classList[2];
   let difference = +window.event?.target?.value - timesUsed(attackNumber);
   while (difference > 0) {
      comboTracker.push(attackNumber);

      --difference;
   }

   // If value in e.target combo input < amount stored in comboTracker [] removes the last instance of this attack id
   // from the comboTracker until they are ===
   while (difference < 0) {
      comboTracker.splice(comboTracker.lastIndexOf(attackNumber), 1);

      ++difference;
   }
}

function updateComboDisplay() {
   if (!comboTracker) return;

   document.querySelectorAll("li.comboHits").forEach(x => x.remove());

   let comboHit;
   comboTracker.forEach(index => {
      comboHit = document.createElement("li");

      comboHit.className = `${index} comboHits`;

      comboHit.setAttribute("draggable", "true");

      comboHit.textContent = document.querySelector(`#b${[index]}>output`).textContent;

      document.getElementById("comboCountDisplay").append(comboHit);
   });
}

function getNewDisplayElement(skillName, initialLevel) {
   const cell = document.createElement("div");
   cell.id = `${skillName}Select`;

   cell.innerHTML = `
      <label class="label ${skillName} skillInput animate-fade-in">${main_types.skills.formatName(skillName)}</label>
      <output class="skillInput ${skillName}" max="${main_types.skills[skillName].maxLevel}" min="0">Lv-${initialLevel}</output>
      <button type="button" aria-pressed="false" id="${skillName}Dec" class="skillInput ${skillName} dec animate-fade-in" data-tooltip="Decrease Skill Level">&#8681;</button>
      <button type="button" aria-pressed="false" id="${skillName}Inc" class="skillInput ${skillName} inc animate-fade-in" data-tooltip="Increase Skill Level">&#8679;</button>`;

   return cell;
}

function createSkillSelections(
   skillName,
   initialLevel = 0,
   elTextContent = window.event?.target.value
) {
   if (
      skillName === "Select" ||
      document.getElementById(`${skillName}Select`) !== null ||
      elTextContent === "Select Skills For Set Builder"
   ) {
      return;
   }

   const cell = getNewDisplayElement(skillName, initialLevel);
   const container = document.getElementById("searcherSkills");
   const siblings = Array.from(container.children);
   const insertIndex = siblings.findIndex(sibling => sibling.id.localeCompare(`${skillName}Select`) > 0);
   if (insertIndex === -1) {
      container.appendChild(cell);
   } else {
      container.insertBefore(cell, siblings[insertIndex]);
   }
}

// export function getSkillSelects () {
//   document.querySelectorAll("select.skill").forEach(skill => {
//     if (skill.selectedIndex > 0) {
//       createSkillSelections(skill.id, skill.selectedIndex)
//     }
//   })
// dataCompile();
// }
document.getElementById("dropSkills")?.addEventListener("change", e => {
   const skillName = e.target.value.replace(/\s+/g, "");
   createSkillSelections(skillName, main_types.skills[skillName].maxLevel);
});

// extra skills menu
// updates skill displays used for set builder
/* ////////////////////////////////////////////////////////////////////////// */
/* ////////////////////////////////////////////////////////////////////////// */
/* //////////                Qurious augments                 /////////////// */

/* ////////////////////////////////////////////////////////////////////////// */

window.saveDebouncer = 0;

function getSelectedIndices(selector) {
   return get.$$(selector).map(el => el.selectedIndex);
}

function getCheckedValues(selector) {
   return selector.map(el => el.checked ? 1 : 0);
}

function getAugmentedValues() {
   let augSelectsReturn = [];
   let augTypeSelectsReturn = [];
   let augSelects = get.augmentSelects();
   let augTypeSelects = get.augTypeSelects();
   for (let i = 0; i < 30; i++) {
      augTypeSelectsReturn.push(augTypeSelects[i].selectedIndex);
      if (augSelects[i].selectedIndex <= 0 || augTypeSelects[i].selectedIndex <= 0) {
         augSelectsReturn.push(0);

         continue;
      }

      if (augTypeSelects[i].selectedIndex % 2) {
         augSelectsReturn.push(augSelects[i].selectedIndex);

         continue;
      }

      augSelectsReturn.push(get.idFromText(augSelects[i].selectedOptions[0].text));
   }

   return [augTypeSelectsReturn, augSelectsReturn];
}

function setSaveDisplays(container, cache, pass) {
   if (!pass && performance.now() - window.saveDebouncer < 1000) {
      return;
   }

   window.saveDebouncer = performance.now();

   // Update the weapon icon
   const weaponType = get.el.weaponType[cache.weapon[0]].value;
   if (!container[0].src.includes(weaponType)) {
      container[0].src = `./icons/${weaponType}.svg`;
   }

   // Update the raw damage
   container[1].textContent = cache.display[0];
   // Update the elemental damage
   if (!container[2].src.includes(cache.display[1])) {
      container[2].src = `./icons/${cache.display[1]}`;
   }

   container[3].textContent = cache.display[2];
}

function saveCache() {
   let key = localStorage.getItem("index") || 0;
   if (key === 0) localStorage.setItem("index", 0);

   const [augmentType, augment] = getAugmentedValues();

   let newCache = {
      weapon: getSelectedIndices(weaponSelectors),
      armor: get.el.armorSelects.map(x => x.selectedIndex),
      augment,
      augmentType,
      monster: [get.el.mon2.value, get.el.part.selectedIndex],
      remainingSelects: getSelectedIndices(remainingSelectSelectors),
      charmLimiters: getSelectedIndices(charmLimiters),
      checkBoxes: getCheckedValues(checkBoxSelectors),
      setSearch: get
         .$$("#skillSelect label")
         .map(buttons => [
            window.util.toSkillID(buttons.textContent),
            +buttons.nextElementSibling.textContent.slice(-1),
         ]),
      display: [
         displayElement[0].textContent,
         displayImage.src.match(/\w+\.svg$/)[0],
         displayElement[1].textContent,
      ],
      version,
      import: get.el.weapon.childElementCount > 75,
   };

   localStorage.setItem(key, JSON.stringify(newCache));

   let displayNodeList = document.querySelectorAll(`#saveState${key} ~ *`);
   setSaveDisplays(displayNodeList, newCache);
}

document.body.addEventListener("change", () => {
   if (performance.now() > 5000) saveCache();
});

document.body.addEventListener("click", () => {
   if (performance.now() > 5000) saveCache();
});

get.$$(".load").forEach(el =>
   el.addEventListener("click", e => {
      loadCacheState(e.target.id.slice(-1));
   })
);

function importLowRankWeapons(weaponsObj, thisWeaponType) {
   const { weapons } = weaponsObj;
   // Loaded once per weapon type and added to the end of the same list, so the rank 10 weapons
   // keep their positions and saved builds still point at the right weapon.
   if (!weaponsObj.lowRankLoaded) {
      const lowRank = fetchLowRankJson(thisWeaponType);
      if (lowRank) {
         for (const weapon of lowRank) {
            if (thisWeaponType.includes("Gun") && Array.isArray(weapon.clipSize)) {
               weapon.clipSize = new ClipSize(weapon.clipSize);
            }

            weapons.push(weapon);
         }

         weaponsObj.lowRankLoaded = true;
      }
   }

   if (!main_thisKey.rampage.lowRankLoaded) {
      const rampage = fetchLowRankJson("rampage");
      if (rampage) {
         main_thisKey.rampage = { ...main_thisKey.rampage, ...rampage, lowRankLoaded: true };
      }
   }
}

/**
 * Reads one of the LR json files next to the page (src/LR when running from src, docs/LR in the build).
 * Synchronous on purpose, the callers rebuild the weapon list straight after.
 * @param {string} name file name without .json
 * @returns {object|undefined}
 */
function fetchLowRankJson(name) {
   try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `./LR/${name}.json`, false);

      xhr.send();
      if (xhr.status === 200 && xhr.responseText) return JSON.parse(xhr.responseText);
   } catch (error) {
      console.error(`Could not load LR/${name}.json`, error);
   }

   return undefined;
}

function loadCacheState(key) {
   let oldKey = localStorage.getItem("index");
   localStorage.setItem("index", key);

   document.getElementById(`saveState${oldKey}`).textContent = "Equip Build";

   document.getElementById(`saveState${key}`).textContent = "Current Build";

   let savedData = localStorage.getItem(key);
   if (savedData === null) return;

   savedData = JSON.parse(savedData);

   // Set monster
   const thisWeaponType = get.el.weaponType[savedData.weapon[0]].value;
   let thisWeapon = main_thisKey[thisWeaponType];
   if (savedData.import) {
      importLowRankWeapons(thisWeapon, thisWeaponType);
   }

   main_weaponChange.resetWeaponType(thisWeaponType, savedData.weapon[1]);

   loadSavedData(savedData, thisWeapon);
}

function loadSavedData(savedData, thisWeapon) {
   let versionCheck = savedData.version !== version;
   set.selectedIndex("dropHZV2", savedData.monster[1]);

   // Set weapon
   set.selectedIndex("dropWeaponType", savedData.weapon[0]);

   let weaponIndex = savedData.weapon[1];
   let str = "";
   thisWeapon.weapons.forEach((weapon, index) => {
      str += `<option value="${index}">${weapon.weapon}`;
      if (/* versionCheck &&*/ weapon.index === weaponIndex) weaponIndex = index;
   });

   get.el.weapon.innerHTML = str;

   set.selectedIndex("dropWeapon", weaponIndex);

   main_weaponChange.resetWeaponType(get.elValue("dropWeaponType"), get.elValue("dropWeapon"));

   // charmLimiters
   get.$$(charmLimiters).forEach((el, index) => {
      el.selectedIndex = savedData.charmLimiters[index];
   });

   setDecoDisplay("charm", savedData.charmLimiters);

   const augTypeData = savedData.augmentType;
   const augmentData = savedData.augment;
   let augIndex = 0;
   let limiter = 0;
   const augTypesEls = get.augTypeSelects();
   const augsEls = get.augmentSelects();
   const armorIndexes = /* !versionCheck ?*/ savedData.armor;
   // get.el.armorSelects.map((type, index) => binaryIndex(thisKey.armor[type], savedData.armor[index]));
   // Set armors
   get.el.armorSelects.forEach((el, index) => {
      el.selectedIndex = armorIndexes[index];

      armorReset(el.id);

      limiter += 6;

      const type = el.id;
      while (augIndex < limiter) {
         // Set Augments
         let augTypeEl = augTypesEls[augIndex];
         let augDropDown = augsEls[augIndex];
         let augType = augTypeData[augIndex];
         let aug = augmentData[augIndex++];
         if (augType <= 0 || aug <= 0 && !(augType % 2)) {
            continue;
         }

         switch (augType) {
            case 1:
               augTypeEl.selectedIndex = 1;

               changeDropdownOptions(1, augDropDown, type, 2);

               break;

            case 2:
               augTypeEl.selectedIndex = 2;

               changeDropdownOptions(2, augDropDown, type, window.thisKey.types.skills[aug].name);

               break;

            case 3:
               augTypeEl.selectedIndex = 3;

               changeDropdownOptions(3, augDropDown, type, aug);

               break;

            case 4:
               augTypeEl.selectedIndex = 4;

               changeDropdownOptions(4, augDropDown, type, window.thisKey.types.skills[aug].name);

               break;
         }

         if (versionCheck && !(augType % 2)) {
            augDropDown.selectedIndex = aug;
         }
      }

      validator(el.id);
   });

   // Set decos/remaining
   get.$$(remainingSelectSelectors).forEach((el, index) => {
      el.selectedIndex = savedData.remainingSelects[index];
   });

   // Set checkBox
   checkBoxSelectors.forEach((el, index) => {
      el.checked = savedData.checkBoxes[index];
   });

   savedData.setSearch.forEach(el => createSkillSelections(main_types.skills[el[0]].name, el[1]));

   createActiveSkills();

   updateEleAugs();

   changeMonsters(savedData.monster[0], 1);

   dataCompile();
}

function binaryIdFromText(arr, toFind) {
   let high = arr.length;
   let lo = 1;
   while (lo < high) {
      let mid = lo + ~~((high - lo) / 2);
      let value = main_get.idFromText(arr[mid].text);
      if (value === toFind) {
         return mid;
      }

      if (value > toFind) {
         high = mid;
      } else {
         lo = mid + 1;
      }
   }

   return -1;
}

/**
 * @param {Object[]} arr - array of objects to search
 * @param {number} toFind - value to find
 * @param {string} property - property to check for the value
 * @returns {number} index - index in which it was found or -1 if not found
 */
function binaryIndex(arr, toFind, property = "index") {
   let high = arr.length;
   let lo = 0;
   while (lo < high) {
      let mid = lo + (high - lo >> 1);
      let value = arr[mid][property];
      if (value === toFind) {
         return mid;
      }

      if (value > toFind) {
         high = mid;
      } else {
         lo = mid + 1;
      }
   }

   return -1;
}

const drugContainer = document.getElementById("comboCountContainer");

const getDrugIndex = target =>
   Object.values(document.getElementById("comboCountDisplay").children).indexOf(target);

drugContainer.addEventListener("dragstart", e => {
   e.dataTransfer.setData("text/plain", getDrugIndex(e.target));
});

drugContainer.addEventListener("dragover", e => {
   e.preventDefault();
   if (e.target.tagName !== "LI") return;

   e.dataTransfer.dropEffect = "move";

   e.target.classList.add("dragover");
});

drugContainer.addEventListener("dragleave", e => {
   if (e.target.tagName !== "LI") return;

   e.target.classList.remove("dragover");
});

drugContainer.addEventListener("drop", (e = window.event) => {
   e.preventDefault();
   if (e.target.tagName !== "LI") return;

   e.target.classList.remove("dragover");

   // Get the id of the target and add the moved element to the target"s DOM
   const data = e.dataTransfer?.getData("text/plain");
   if (e.target.parentElement.id === "comboCountDisplay") {
      e.target.before(Object.values(e.target.parentElement.children)[+data]);
   }

   comboTracker = get.$$("#comboCountDisplay li").map(el => el.classList[0]);

   dataCompile();
});

// console.log(performance.now(), 6);

function quickSort(arr, low, high, compare) {
   compare ??= ascending;

   low ??= 0;

   high ??= arr.length - 1;
   if (low >= high) return arr;

   let pivot = arr[high];
   let i = low;
   let j = low - 1;

   while (++j < high) {
      if (arr[j] < pivot) {
         [arr[i], arr[j]] = [arr[j], arr[i]];

         ++i;
      }
   }

   [arr[i], arr[high]] = [arr[high], arr[i]];

   quickSort(arr, low, i - 1);

   quickSort(arr, i + 1, high);

   return arr;
}

/**
 * Object representing a finite sorting algorithm.
 * @type {{
 *     keys: Array,
 *     operators: Array,
 *     multi: Function,
 *     asc: Function,
 *     desc: Function,
 *     quickSort: Function,
 *     preSort: Function
 * }}

 const sortFinite = {
 key: 0,
 operator: 0,
 asc: (a, b) => b < Infinity && a < b,
 desc: (a, b) => b < Infinity && a > b,

 property: (a, b) => this.operator(a[this.key], b[this.key]),

 quickSort(arr, compare, low, high) {
 if (low >= high) return arr;

 let pivot = arr[high];
 let i = low;
 let j = low;

 do {
 if (compare(arr[j], pivot)) {
 [arr[i], arr[j]] = [arr[j], arr[i]];
 ++i;
 }
 } while (++j < high);

 [arr[i], arr[high]] = [arr[high], arr[i]];
 this.quickSort(arr, compare, low, i - 1);
 this.quickSort(arr, compare, i + 1, high);
 return arr;
 },

 preSort(arr, compare) {
 compare ??= this.asc;
 let high = arr.length - 1;
 if (Array.isArray(compare)) {
 let i = 0;
 while (i < compare.length) {
 this.key = compare[i++];
 this.operator = this[compare[i++]];
 this.quickSort(arr, this.property, 0, high);
 }

 return arr;
 }

 return this.quickSort(arr, compare, 0, high);
 }

 };

 const generateRandomObject = () => ({
 prop1: Math.floor(Math.random() * 10),
 prop2: Math.floor(Math.random() * 10),
 prop3: Math.floor(Math.random() * 10),
 prop4: Math.floor(Math.random() * 10),
 prop5: Math.floor(Math.random() * 10)
 });

 // Generate an array of 50 random objects
 let dataArray = Array.from({ length: 100 }, generateRandomObject);
 // View the generated data
 console.log(dataArray);
 console.log(sortFinite.preSort(dataArray, ["prop1", "desc", "prop2", "asc"]));*/
console.log("main.js");
/******/ })()
;
//# sourceMappingURL=main.js.map