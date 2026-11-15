/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*****************************************************!*\
  !*** ./src/webWorker/setBuildWorker.js + 7 modules ***!
  \*****************************************************/

// UNUSED EXPORTS: findBestSum2, findBestSum3, runSetSearch, updateRecords

;// ./src/webWorker/armorClass.js
/**
 * @typedef {Object} armor
 * @property {string} name
 * - The ID of this armor.
 * @property {string} type
 * - The armor's type.
 * @property {number} augsPointer
 * - The pointer for augmentations.
 * @property {number} baseBudget
 * - The initial budget to reset the current budget.
 * @property {number} budget
 * - The base budget of the armor.
 * @property {number} len
 * - The length of the skills array.
 * @property {number} fodderPointer
 * - The pointer for fodder.
 * @property {number} fodderCount
 * - The count of the fodder.
 * @property {Array<number>} decos
 * - The armor's decorations.
 * @property {Array<number>} augs
 * - The armor's augmentations.
 * @property {Array<number>} decoAugs
 * - The armor's used decoration augmentations.
 * @property {Array<number>} usedSkills
 * - The skills used in the build.
 * @property {Array<number>} baseSkills
 * - The base skills of the armor.
 * @property {Array<number>} fodder
 * - The skills not used in the build.
 * @property {object} skills
 * - The skills innately on the armor.
 * - keys: skill IDs
 * - Values: Initial Points
 */

/**
 * @typedef {Object} armors
 * @define - Object with each armor type as a key and an array of armors as the value
 * @property {Array<armor>} helm
 * @property {Array<armor>} chest
 * @property {Array<armor>} arm
 * @property {Array<armor>} waist
 * @property {Array<armor>} leg
 */
/**
 * @class {Class} ArmorClass
 * @property {armors} armors
 */

class ArmorClass {
   constructor(initObj, skillsClass) {
      this.skillsClass = skillsClass;
      this.armors = initObj.armors;
      this.augmentRemovalOrder = [0, 1, 2, 3, 4];
      this.theseArmors = [];
      this.decoResetValues = new Int8Array(initObj.decoSlots);
      this.isOverLimit = 0;
      this.indexByType = {
         helm: 0,
         chest: 1,
         arm: 2,
         waist: 3,
         leg: 4,
      };

      this.indexes = [];
      this.armorTypes = ["helm", "chest", "arm", "waist", "leg"];

      for (let i = 0; i < 5; ++i) {
         let type = this.armorTypes[i];
         this.armors[type].forEach(armor => {
            armor.typeIndex = i;

            /**
             * custom new Set() implementation
             * @param {string} skillId
             * @param {Object} armor
             * @param {string[]} baseSkills
             */
            armor.addSkillToSet = function (skillId) {
               let i = this.skillLen;

               while (i--) {
                  if (this.baseSkills[i] === skillId) {
                     return true;
                  }
               }

               if (this.skillLen < 5) {
                  this.baseSkills[this.skillLen++] = skillId;
                  return true;
               }

               return false;
            };
         });

         this.indexes[i] = {
            index: -1,
            len: this.armors[type].length,
            type,
         };
      }
   }

   getArmor(type, index) {
      this.armors[type][index];
   }

   /**
    * @param {string } type
    * @param {Object} thisIndex
    * @param {number} previousIndex
    * @param skillsByName
    */
   setNextArmor(thisIndex, previousIndex, skillsByName) {
      const thisArmorType = this.armors[thisIndex.type];
      const thisArmor = thisArmorType[thisIndex.index];
      // add the new iterations armor piece to the array
      this.theseArmors[this.indexByType[thisIndex.type]] = thisArmor;

      if (previousIndex >= 0) {
         let previousArmor = thisArmorType[previousIndex];
         this.removeArmor(previousArmor, skillsByName);

         // swap out decos from the previous armor for the new armors
         for (let i = 0; i < 4; ++i) {
            this.decoResetValues[i] += -previousArmor.decos[i] + thisArmor.decos[i];
         }
      } else {
         // if no previous armor just add the new decorations
         for (let i = 0; i < 4; ++i) {
            this.decoResetValues[i] += thisArmor.decos[i];
         }
      }

      this.addArmor(thisArmor, skillsByName);
   }

   addArmor(thisArmor, skillsByName) {
      // ++this.ifUnder[thisArmor.fodder?.length ? 1 : 0];
      // ++this.ifOver[thisArmor.augs[7] === 255 ? 0 : 1];

      // add this iterations skills
      for (let skillId of thisArmor.usedSkills) {
         const { stats, max } = skillsByName[skillId];

         if (stats[0] >= max && stats[0] - thisArmor.skills[skillId] < max) {
            ++this.isOverLimit;
         }

         stats[0] -= thisArmor.skills[skillId];
      }
   }

   removeArmor(previousArmor, skillsByName) {
      // --this.ifUnder[previousArmor.fodder.length ? 1 : 0];
      // --this.ifOver[previousArmor.augs[7] === 255 ? 0 : 1];

      // remove the previous iterations skills if it exists
      for (let skillId of previousArmor.usedSkills) {
         const { stats, max } = skillsByName[skillId];

         if (stats[0] < max && stats[0] + previousArmor.skills[skillId] >= max) {
            --this.isOverLimit;
         }

         stats[0] += previousArmor.skills[skillId];
      }
   }

   resetArmors() {
      for (let i = 0; i < 5; i++) {
         let armor = this.theseArmors[i];
         armor.augsPointer = 3;
         armor.skillLen = armor.len;
         armor.fodderPointer = 0;
         armor.budget = armor.baseBudget;
         let augs = armor.augs;
         augs[0] = augs[6];
         augs[1] = augs[7];
         augs[2] = augs[8];
      }
   }

   /**
    * @param {Armor} armor
    * @param { number} augIndex
    */
   getPoints(armor, augIndex) {
      // if augIndex is sent in we are replacing an augment not adding a new one
      if (!augIndex) {
         augIndex = armor.augsPointer;

         if (augIndex === 6) {
            return;
         }

         ++armor.augsPointer;
      }

      // if still has fodder skills available
      if (armor.fodderCount && armor.fodderCount > armor.fodderPointer) {
         armor.augs[augIndex] = armor.fodder[armor.fodderPointer++];
         armor.budget += 10;
         return;
      }

      // else we add a -Defense aug to gain points
      armor.augs[augIndex] = 255;
      armor.budget += 5;
   }

   setAugmentRemovalOrder() {
      // this.quickSort(armors);
      // sort so that the worst case for skillLimitations/most points to spend is first
      this.theseArmors.sort((a, b) => b.len - a.len || a.baseBudget - b.baseBudget || a.typeIndex - b.typeIndex);
      let armors = this.theseArmors;
      let start = 0;
      let end = 4;

      for (let i = 0; i < 5; ++i) {
         // update the indexes in indexByType with the new indexes of the armors for next iteration
         this.indexByType[armors[i].type] = i;

         // if the armor has deco augments used
         if (armors[i].decoAugs) {
            // make array for removing deco augments utilizing the order they were just sorted in but in reverse
            this.augmentRemovalOrder[armors[i].len < 3 ? start++ : end--] = armors[i];
         }
      }

      // remove the armors indexes that dont have deco augments
      this.augmentRemovalOrder.splice(start, 1 + (end - start));
   }

   /**
    * @param {Uint8Array} remainingDecoSlots
    * @returns {number}
    */
   removeUnusedSlotAugments(remainingDecoSlots) {
      let decoAugments;
      let augIndex = 0;
      let offset = 0;
      let slotLevel = 0;
      let armor;

      for (let i = 0, len = this.augmentRemovalOrder.length; i < len; ++i) {
         armor = this.augmentRemovalOrder[i];
         decoAugments = armor.decoAugs;
         augIndex = decoAugments.length;
         const augs = armor.augs;
         // if potential skill limitations, must leave a minimum of one augmentation
         offset = armor.len > 2 ? 1 : 0;

         while (augIndex-- > offset) {
            slotLevel = decoAugments[augIndex];

            // if this decoLevel has the extra slot to remove the upgrade
            // if it's removing a level 2 slot, it makes sure it can completely remove the augmentation
            if (
               !remainingDecoSlots[slotLevel] ||
               slotLevel === 1 &&
                  augIndex > 0 &&
                  decoAugments[augIndex - 1] !== 0 &&
                  !remainingDecoSlots[decoAugments[augIndex - 1]]
            ) {
               break;
            }

            // remove the index listed for this aug
            --remainingDecoSlots[slotLevel];
            // if the index is above 0 we increase the level below
            if (slotLevel) ++remainingDecoSlots[slotLevel - 1];

            armor.budget += 6;
            ++augs[2];
         }

         if (augs[2] === 255) {
            armor.budget += 5;

            // replace with -Def/-Skill if all augs removed
            if (armor.fodderCount > armor.fodderPointer) {
               augs[2] = armor.fodder[armor.fodderPointer++];
               armor.budget += 5;
            }
         }
      }
   }
}

;// ./src/webWorker/skillClass.js
/**
 * @class SkillArr
 * - each skills view for its stats in the skillsBuffer.
 * @extends {Int16Array}
 * @property {number} 0 - skillResetValue
 * - The value used to reset remainingPoints/[1].
 * @property {number} 1 - remainingPoints
 * - The remaining skill points for this iteration.
 * @property {number} 2 - quriousCost
 * - Qurious cost of skill.
 * @property {number} 3 - shouldUseLevel4Deco
 * - Pointer for the first pass of decorations.
 * @property {number} 4 - pointsForLevel4Deco
 * - Points given for the lvl4 deco slot.
 * @property {number} 5 - pointerForLowestDeco
 * - Points given for the lowest level decoration for this skill.
 * @property {number} 6 - pointsForSecondLowestDeco
 * - Points given for the init level +1 level decoration.
 * @property {number} 7 - skillID
 * - The skill's ID.
 **/
class SkillArr extends Int16Array {
   constructor(buffer, byteOffset, length, primary, secondary) {
      super(buffer, byteOffset, length);
      this.primary = primary;
      this.secondary = secondary;
   }

   /**
    * Sets the skills currentPointsRemaining/[1] to the pointsReset/[0] value
    * @type {method}
    * @returns {boolean} - True if the skill is still needed
    */
   resetPoints() {
      this[1] = this[0];
      return this[1] <= 0;
   }

   addPrimary() {
      if (this[0] < this.primary) {
         return false;
      }

      this[0] -= this.primary;
      return true;
   }

   removePrimary() {
      this[0] += this.primary;
   }

   addSecondary() {
      if (this[0] < this.secondary) {
         return false;
      }

      this[0] -= this.secondary;
      return true;
   }

   removeSecondary() {
      this[0] += this.secondary;
   }

   min(a, b) {
      return a < b ? a : b;
   }

   level4Deco(docoSlots, decoRecord) {
      const pointsOf = this[4];
      while (docoSlots[3] && this[1] >= pointsOf) {
         docoSlots[3]--;
         this[1] -= pointsOf;
         decoRecord?.add(this[7], 3);
      }

      return this[1] === 0;
   }

   lowestDeco(docoSlots, decoRecord) {
      const decoLevel = this[5] - 1;
      while (docoSlots[decoLevel] && this[1]) {
         docoSlots[decoLevel]--;
         this[1]--;
         decoRecord?.add(this[7], decoLevel);
      }

      return this[1] === 0;
   }

   secondLowestDeco(docoSlots, decoRecord) {
      const pointsOf = this[6];
      const decoLevel = this[5];
      while (docoSlots[decoLevel] && this[1]) {
         docoSlots[decoLevel]--;
         this[1]--;
         decoRecord?.add(this[7], decoLevel);
      }

      return this[1] === 0;
   }
}

/**
 * @const {Object} costKeys
 * @property {number} total
 ** Total cost
 * @property {Int8Array} keys
 ** Array of cost keys
 * @property {number} pointer
 ** Length of the usable array
 * @property {method} costKeys.removeCost
 ** Removes the cost from the array
 */
const costKeys = {
   total: 0,
   keys: new Int8Array(5),
   pointer: 0,

   /**
    * @param {number} cost - cost to remove
    */
   removeCost: function (cost) {
      if (this.keys[--this.pointer] === cost) return;

      for (let i = 0; i < this.pointer; ++i) {
         if (this.keys[i] === cost) {
            while (i < this.pointer) this.keys[i] = this.keys[++i];

            return;
         }
      }
   },
};

/**
 * @class
 * @property {array<number>} round2
 * - Array containing all the views into the skillsBuffer
 * @property {array<SkillArr>} skillsArr
 * - Array containing all the views into the skillsBuffer
 * @property {array<SkillArr>} round2
 * - Array containing all the views still needed for the 2nd deco pass
 *
 */
class SkillsContainer {
   constructor(initObj) {
      const { skillBuffer, infoBuffer } = initObj;
      this.len = infoBuffer.length >> 2;
      this.skillsArr = [];
      this.names = {};
      this.primaries = [];
      this.secondaries = [];
      this.round2 = [];
      let infoPointer = 0;
      for (let i = 0; i < this.len; i++) {
         const primary = infoBuffer[infoPointer + 2];
         const secondary = infoBuffer[infoPointer + 3];
         const skill = new SkillArr(skillBuffer, i * 16, 8, primary, secondary);

         if (secondary) {
            this.primaries.push(!primary ? undefined : skill);
            this.secondaries.push(skill);
         }

         this.skillsArr[i] = skill;
         this.names[skill[7]] = {
            stats: skill,
            points: infoBuffer[infoPointer],
            max: infoBuffer[infoPointer + 1],
         };

         infoPointer += 4;
         if (!skill[4] && !skill[2]) {
            if (!secondary && skill[0] > 1) {
               if (!this.setBonus) this.setBonus = [];

               this.setBonus.push(skill);
            } else {
               if (!this.charmNeeded) this.charmNeeded = [];

               this.charmNeeded.push(skill);
            }
         }
      }

      this.costKeys = costKeys;
      this.costs = {
         0: costKeys,
         3: {
            total: 0,
            skills: [],
            pointer: 0,
         },
         6: {
            total: 0,
            skills: [],
            pointer: 0,
         },
         9: {
            total: 0,
            skills: [],
            pointer: 0,
         },
         12: {
            total: 0,
            skills: [],
            pointer: 0,
         },
         15: {
            total: 0,
            skills: [],
            pointer: 0,
         },
         previousObj: {},
         addNew(cost, skill) {
            this.previousObj = this[skill[2]];
            this.previousObj.pointer = 1;
            this.previousObj.total = skill[1];
            this.previousObj.skills[0] = skill;
         },
         addSameCost(skill) {
            this.previousObj.total += skill[1];
            this.previousObj.skills[this.previousObj.pointer++] = skill;
         },
      };
   }

   /**
    * @param {Uint8Array} slotsAvailable
    * @param { Uint8Array|boolean} decoRecord
    * @return {number} budget - The remaining budget for the round
    * @property {number} timesToUse - how many times the decoration was used
    * @property {SkillArr} skill
    * */
   useDecorationSlots(slotsAvailable, theseArmors, decoRecord) {
      if (decoRecord) decoRecord.pointer = 0;

      const loop2Arr = this.round2;
      let loop2Len = 0;
      let skillIndex = this.len;
      let skill;
      while (skillIndex--) {
         skill = this.skillsArr[skillIndex];

         if (
            !skill.resetPoints() &&
            (!skill[3] ||
               (!slotsAvailable[3] || skill[3] !== 4 || !skill.level4Deco(slotsAvailable, decoRecord)) &&
                  (!slotsAvailable[skill[5] - 1] || !skill.lowestDeco(slotsAvailable, decoRecord)))
         ) {
            // adds the skill to the round2 array if it still needs points
            loop2Arr[loop2Len++] = skill;
         }
      }

      // let budget =
      theseArmors.removeUnusedSlotAugments(slotsAvailable);
      // Reset
      let total = 0;
      let previousCost = 0;
      // set Local
      const costs = this.costs;
      const keys = costs[0].keys;
      // Recycled
      let pointer = 0;

      for (let j = 0; j < loop2Len; ++j) {
         skill = loop2Arr[j];
         if (
            skill[4] && slotsAvailable[3] && skill.level4Deco(slotsAvailable, decoRecord) ||
            skill[5] && skill.lowestDeco(slotsAvailable, decoRecord) ||
            skill[6] && skill.secondLowestDeco(slotsAvailable, decoRecord)
         ) {
            continue;
         }

         if (!skill[2]) {
            // This skill has no augment cost, so decorations were its last chance. Mark the charm combination
            // as impossible (the caller skips it) instead of filing the skill under cost 0, which is the key list.
            this.costKeys.pointer = 0;
            this.costKeys.total = 999;
            if (decoRecord) decoRecord[41] = decoRecord.pointer;

            return;
         }

         total += skill[1];
         if (previousCost === skill[2]) {
            // if we have seen the cost before we just update the properties
            costs.addSameCost(skill);
         } else {
            previousCost = skill[2];
            // if we have not seen the cost before we need to reset the properties
            costs.addNew(previousCost, skill);
            keys[pointer++] = previousCost;
         }
      }

      // budget += armorsClass.budgetOffset[Math.max(total - 10, 0)];
      this.costKeys.pointer = pointer;
      this.costKeys.total = total;
      let k = -1;
      while (--pointer && ++k < pointer) {
         [keys[pointer], keys[k]] = [keys[k], keys[pointer]];
      }

      if (decoRecord) decoRecord[41] = decoRecord.pointer;
   }
}

;// ./src/webWorker/returnValue.js
/**
 * @class DecoRecord
 * @extends Uint8Array
 * @property {number} pointer
 * @property {number} count
 */
class DecoRecord extends Uint8Array {
   constructor() {
      super(42);
      this.pointer = 0;
   }

   /**
    @method add
    @param {number} skillId
    @param {number} slotLvl
    @param {number} timesUsed
    */
   add(skillId, slotLvl) {
      this[this.pointer++] = skillId;
      this[this.pointer++] = slotLvl;
   }

   get count() {
      return this.pointer;
   }
}

/**
 * @class ReturnValue
 * @property {Array<{ armors: Uint8Array; decos: DecoRecord; charms: Uint8Array; }>} sets
 * @property {{ sets: number; combos: number; }} count
 * @property {{ armorSkills: Object; quriousSkills: number[]; remainingSlots: number[]; }} stats
 * @property {number} length
 * @method newSet
 * @method charms
 * @method armors
 * @method decos
 */
class ReturnValue {
   constructor() {
      this.sets = [];
      this.count = { sets: 0, combos: 0 };
      this.stats = {
         armorSkills: {},
         quriousSkills: [0, 0, 0, 0, 0],
         remainingSlots: [0, 0, 0, 0],
      };

      this.length = 0;
      this.newSet();
   }

   get charms() {
      return this.sets[this.length - 1].charms;
   }

   get armors() {
      return this.sets[this.length - 1].armors;
   }

   get decos() {
      return this.sets[this.length - 1].decos;
   }

   newSet() {
      this.sets.push({ armors: new Uint8Array(36), decos: new DecoRecord(), charms: new Uint8Array(360) });
      ++this.length;
   }
}

const returnVal = new ReturnValue();

/**
 * @param {Object} returnStats - Object containing possible extra skills.
 * @param {Object} armorsClass - The instance of the ArmorClass.
 * @param {number} setLimiter - User set cap for qurious augments.
 * @param {import("./SkillClass").SkillsContainer} skillsClass - The instance of the SkillsClass.
 */
function findExtraSkills(returnStats, armorsClass, skillsClass, setLimiter, slotsRemaining) {
   const { armorSkills, quriousSkills, remainingSlots } = returnVal.stats;
   // Find extra skills from armor.
   findExtraArmorSkills(armorSkills, armorsClass, skillsClass);
   // Find extra qurious skills.
   const extraQurious = findExtraQuriousSkills(quriousSkills, setLimiter, armorsClass, skillsClass);
   // Find extra decoration skills.
   findExtraDecorationSkills(slotsRemaining, returnVal.decos, remainingSlots, extraQurious, skillsClass);

   // record the armors/augments for the first combo of this armor set. Checking armors[1] skipped this whenever the
   // record buffer was reused (it still held the previous set's armors), so equipped sets got another set's augments
   if (returnVal.armors[0] === 1) {
      const { theseArmors, indexByType, armorTypes } = armorsClass;
      // if (!setsRecord.count++) {
      let augIndex = 6;

      for (let l = 0; l < 5; l++) {
         let armor = theseArmors[indexByType[armorTypes[l]]];
         let thisArmorsAugs = armor.augs;
         returnVal.armors[l + 1] = armor.name;

         for (let j = 0; j < 6; j++) {
            returnVal.armors[augIndex++] = j < armor.augsPointer ? thisArmorsAugs[j] : 250;
         }
      }
   }

   return extraQurious;
}

/**
 * @param {Int8Array} slotsRemaining
 * @param {Uint8Array} decosUsed
 * @param {Uint8Array} remainingSlots
 * @param {number[]} extraQuriousSkills
 */
function findExtraDecorationSkills(
   slotsRemaining,
   decosUsed,
   remainingSlots,
   extraQuriousSkills,
   skillsClass
) {
   let possibleLvl = [0, 0, 0, 0];
   let cost4 = extraQuriousSkills[3];

   if (extraQuriousSkills[0]) {
      let usableCost3 = extraQuriousSkills[2] - cost4;

      if (usableCost3) {
         let decoIndex = 0;

         while (decoIndex < decosUsed[63] - 1) {
            let skillId = decosUsed[decoIndex++];
            const skill = skillsClass.names[skillId].stats;
            let slotLvl = decosUsed[decoIndex++];

            let pointsPerUse =
               slotLvl === 3 ? skill[5]
               : skill[6] === slotLvl ? 1
               : skill[7];

            let timesUsed = decosUsed[decoIndex++];
            const cost = skill[2] / 3 - 1;

            if (cost < 3) break;

            if (extraQuriousSkills[cost] < pointsPerUse) continue;

            let maxAdd = Math.min(~~(usableCost3 / pointsPerUse), timesUsed);

            if (possibleLvl[slotLvl - 1] < maxAdd) {
               possibleLvl[slotLvl - 1] = maxAdd;
            }
         }
      }
   }

   for (let i = 0; i < 4; ++i) possibleLvl[i] += slotsRemaining[i];

   if (cost4) {
      possibleLvl[3] += ~~((cost4 + possibleLvl[1] + possibleLvl[2]) / 2);
      possibleLvl[1] += cost4 + possibleLvl[1] + possibleLvl[2];
      possibleLvl[2] += cost4;
      possibleLvl[0] = extraQuriousSkills[1];
   }

   for (let i = 0; i < 4; ++i) {
      remainingSlots[i] = Math.max(remainingSlots[i], possibleLvl[i]);
   }

   return possibleLvl;
}

/**
 * @param quriousSkills
 * @param limiter
 * @param armorsClass
 * @param skillsClass
 * @returns {number[]}
 */
function findExtraQuriousSkills(quriousSkills, limiter, armorsClass, skillsClass) {
   const extraQuriousSkills = [0, 0, 0, 0, 0];
   if (limiter === 0) return extraQuriousSkills;

   for (let armor of armorsClass.theseArmors) {
      let usedAugs = armor.augsPointer;
      let unusedAugs = 5 - usedAugs;
      if (armor.budget < (unusedAugs > 0 ? 1 : 8) || armor.len > 4) {
         continue;
      }

      let skillCheck = limiter;
      let defCount = 0;
      let skillRemoved = 0;
      // iterates through looking for the -def augs that only give 5 points so
      // easiest to remove
      for (let i = 0; i < usedAugs; i++) {
         const aug = armor.augs[i];
         if (aug === 255) {
            ++defCount;
         } else if (aug < 250 && !skillsClass.names[aug]) {
            ++skillRemoved;
         }

         // if not all augments used no need to remove one and have a penalty if not remove the cheapest ones first
         let costToFreeAugmentSlot =
            --unusedAugs >= 0 ? 0
            : --defCount >= 0 ? 5
            : --skillRemoved >= 0 ? 10
            : 999;

         if (costToFreeAugmentSlot === 999) continue;

         // tracks available augment slots as we go
         let AvailableAugments = 1;

         // if remaining points >= costToFree + fee augments Available * the minimum augment cost
         while (armor.budget >= costToFreeAugmentSlot + AvailableAugments) {
            // caps cost at the max cost ||(remainingPoints - accumulated value to free slots) / slots / conversion rate
            let quriousCost = Math.min(
               skillCheck,
               6,
               ~~((armor.budget - costToFreeAugmentSlot) / AvailableAugments)
            );

            // adds just one point to every cost it can afford at this point
            while (quriousCost--) {
               // this is accumulated across every pass to account for being able to get more than one of a cost
               ++extraQuriousSkills[quriousCost];
            }

            // accumulate cost to free the next slot (if all augments are used)
            costToFreeAugmentSlot +=
               --unusedAugs >= 0 ? 0
               : --defCount >= 0 ? 5
               : --skillRemoved >= 0 ? 10
               : 999;

            if (costToFreeAugmentSlot >= 999) break;

            ++AvailableAugments;
         }
      }
   }

   for (let i = 0; i < 5; i++) {
      quriousSkills[i] = Math.max(quriousSkills[i], extraQuriousSkills[i]);
   }

   return extraQuriousSkills;
}

/**
 * @param {object} armorSkills
 * @property {{ skillId:number; }} armorSkill
 */
function findExtraArmorSkills(armorSkills, armorsClass, skillsClass) {
   let thisSetsSkills = {};

   for (let armor of armorsClass.theseArmors) {
      if (!armor.fodder) continue;

      const { names } = skillsClass;
      const skills = { ...armor.skills };

      for (let i = 0; i < armor.augsPointer; i++) {
         const aug = armor.augs[i];

         if (aug < 250 && (!names[aug] || names[aug].points < skills[aug])) {
            --skills[aug];
         }
      }

      let baseTotal = 0;

      for (let i = 0; i < armor.len; i++) {
         const skillId = armor.baseSkills[i];

         if (!names[skillId]) {
            baseTotal += skills[skillId];
         } else if (names[skillId]?.points < skills[skillId]) {
            baseTotal += skills[skillId] - (names[skillId]?.points || 0);
         }
      }

      const unusedAugments = 6 - armor.augsPointer;
      const maxUsable = baseTotal + unusedAugments + ~~(armor.budget / 5);

      if (!maxUsable) continue;

      for (let i = 0; i < armor.len; i++) {
         let skillId = armor.baseSkills[i];
         let usable = names[skillId] ? -names[skillId].stats[1] : maxUsable;

         if (!usable) continue;

         // let offset = armor.skills[skill] || 0;
         thisSetsSkills[skillId] = (thisSetsSkills[skillId] || 0) + Math.min(armor.skills[skillId], usable);
      }
   }

   // let skills = Object.entries(thisSetsSkills);
   //
   // for (let i = 0; i < skills.length; i++) {
   //    if (armorSkills[skills[i][0]] >= skills[i][1]) continue;
   //
   //    armorSkills[skills[i][0]] = skills[i][1];
   // }
}

;// ./src/webWorker/bestSum.js
// ////////////////////////////////////////////////////////
// //////////  Qurious Helpers  //////////////////////////
// ///////////////////////////////////////////////////////
// Pure helpers that pick which qurious costs fit an armor's remaining budget.

/**
 * Finds the best combination of costKeys that fits within the given budget.
 *
 * @param {import("./skillClass.js").costKeys} costKeys
 * @param {number} budget - The budget to be allocated.
 * @param {import("./skillClass.js").this.costs} skillsByCost - The skills grouped by cost.
 * @returns {number[]} - The best combination of costKeys.
 */
function findBestSum3(costKeys, budget, skillsByCost) {
   //   ++counters.sum3;
   const len = costKeys.pointer;
   const costArr = costKeys.keys;
   let i = len;

   while (i--) {
      // check the minimum value that would be run this iteration
      if (costArr[i] * 3 > budget) continue;

      let j = len;

      while (j-- > i) {
         // check the minimum value that would be run this iteration
         if (
            i !== j && costArr[i] + costArr[j] * 2 > budget ||
            i === j && skillsByCost[costArr[j]].total < 2
         ) {
            continue;
         }

         let k = len;

         while (k-- > j) {
            // k must use a spot add 1 for any others for same cost
            if (
               k !== j && costArr[i] + costArr[j] + costArr[k] <= budget ||
               k === j && skillsByCost[costArr[k]].total > (k === i ? 2 : 1)
            ) {
               return [costArr[i], costArr[j], costArr[k]];
            }
         }
      }
   }
   // if (budget < costKeys.getHighestCost())thisArmorClass.getPoints()
}

/**
 * @param {import("./skillClass").costKeys} costKeys
 * @param {number} budget
 * @param {import("./skillClass").this.costs} costs
 */
function findBestSum2(costKeys, budget, costs) {
   //   ++counters.sum2;
   const len = costKeys.pointer;
   // let offset = 1;
   let i = len;
   const costArr = costKeys.keys;
   const halfBudget = budget >> 1;

   while (i--) {
      // check the minimum value that would be Possible this iteration
      if (costArr[i] > halfBudget) continue;

      let j = len;
      const limiter = costs[costArr[i]].total > 1 ? i : i + 1;
      while (j-- > limiter) {
         // if i === j there needs to be 2 points available in for that cost
         if (i === j || costArr[i] + costArr[j] <= budget) {
            return [costArr[i], costArr[j]];
         }
      }
   }
}

/**
 * @param {import("./skillClass").costKeys} costKeys
 * @param {number} target
 */
function findBestSum1(costKeys, target) {
   //   ++counters.sum1;
   let i = costKeys.pointer;

   while (i--) {
      if (costKeys.keys[i] <= target) {
         return [costKeys.keys[i]];
      }
   }
}

/**
 * @param {number} possibleAugs
 * @param {number} budget
 * @param {{ pointer: number; keys: number[]; }} costKeys
 * @param {import("./armorClass.js").Armor} armor
 * @param {import("./skillClass.js").SkillsContainer} skillsClass
 * */
function bestSumWithRestrictions(possibleAugs, budget, costKeys, armor, skillsClass) {
   //   ++counters.sumRestrictions;
   let skillsByCost = skillsClass.costs;
   let skillsByName = skillsClass.names;
   let len = costKeys.pointer;
   let costArr = costKeys.keys;
   let skill;

   if (armor.usedSkills.length) {
      let maxRemainingBudget = budget - costKeys.keys[0] * (possibleAugs - 1);

      for (let i = 0; i < armor.usedSkills.length; ++i) {
         skill = skillsByName[armor.usedSkills[i]].stats;
         if (skill[1] > 0 && skill[2] <= maxRemainingBudget) {
            return [skill, 1];
         }
      }
   }

   while (len--) {
      let thisCost = costArr[len];
      let thisCostObj = skillsByCost[thisCost];

      // if cant afford or no skills with enough duplicates
      if (thisCost * possibleAugs <= budget && thisCostObj.total - thisCostObj.pointer >= possibleAugs) {
         let i = thisCostObj.pointer;

         while (i--) {
            skill = thisCostObj.skills[i];

            // if it has enough points
            if (skill[1] >= possibleAugs) {
               return [skill, possibleAugs];
            }
         }
      }
   }
}

;// ./src/webWorker/augments.js
// ////////////////////////////////////////////////////////
// //////////  Qurious Augments  /////////////////////////
// ///////////////////////////////////////////////////////
// Spends each armor's qurious budget on the skill points the decorations could not cover.



/**
 * Uses augmentations to add more skills.
 *
 * @param {number} augLimiter - The maximum number of augmentations that can be applied.
 * @param {import("./armorClass.js").ArmorClass} armorsClass
 * @param {import("./skillClass.js").SkillsContainer} skillsClass
 * @returns {number} - The total augmentations remaining.
 */
function useAugments(augLimiter, armorsClass, skillsClass) {
   const skillsByCost = skillsClass.costs;
   const costKeys = skillsByCost[0];
   let augList;
   const armors = armorsClass.theseArmors;
   const keysRemaining = costKeys.keys;

   quriousLoop: for (let i = 0; i < 5; i++) {
      if (costKeys.total <= 0) {
         return costKeys.total;
      }

      const armor = armors[i];
      let maxNewSkills = 5 - armor.len;
      // limit possible augs to the default of 3, user selections, and the total augments needed
      let possibleAugs = Math.min(3, augLimiter, costKeys.total);
      const highestCost = keysRemaining[costKeys.pointer - 1] * possibleAugs;
      // if armor cant afford the highest possible cost
      if (armor.budget < highestCost) {
         let maxAugCount = 0;
         let totalMin = 0;
         let costIndex = 0;
         let thisCost;
         let extraPoints = 3 - possibleAugs;

         while (maxAugCount < 3) {
            thisCost = skillsByCost[0].keys[costIndex++];
            let { total } = skillsByCost[thisCost];

            while (total && maxAugCount++ < 3) {
               if (maxAugCount <= extraPoints) {
                  armorsClass.getPoints(armor);
               } else if (armor.budget < totalMin + thisCost) {
                  armorsClass.getPoints(armor);
                  --possibleAugs;
               } else {
                  totalMin += thisCost;
                  --total;
               }
            }
         }
      }

      while (possibleAugs) {
         if (possibleAugs > maxNewSkills) {
            augList =
               maxNewSkills === 1 ?
                  bestSumWithRestrictions(possibleAugs, armor.budget, costKeys, armor, skillsClass)
               :  bestSumWithRestrictions(
                     possibleAugs - 1,
                     armor.budget - keysRemaining[0],
                     costKeys,
                     armor,
                     skillsClass
                  );

            if (augList) {
               if (updateRecords(augList[0], armor, skillsByCost, augList[1])) {
                  return costKeys.total;
               }

               if ((possibleAugs -= augList[1]) === 0) {
                  continue quriousLoop;
               }

               continue;
            }

            if (--possibleAugs === 0) continue quriousLoop;

            if (keysRemaining[costKeys.pointer - 1] * possibleAugs > armor.budget) {
               armorsClass.getPoints(armor);
            }
         } else {
            augList =
               possibleAugs === 2 ? findBestSum2(costKeys, armor.budget, skillsByCost)
               : possibleAugs === 3 ? findBestSum3(costKeys, armor.budget, skillsByCost)
               : possibleAugs === 1 ? findBestSum1(costKeys, armor.budget)
               : 0;

            if (augList) {
               while (possibleAugs) {
                  let skillToAug = skillsByCost[augList[--possibleAugs]].skills[0];
                  if (updateRecords(skillToAug, armor, skillsByCost)) {
                     return costKeys.total;
                  }
               }
            } else {
               if (--possibleAugs === 0) continue quriousLoop;

               if (keysRemaining[costKeys.pointer - 1] * possibleAugs > armor.budget) {
                  armorsClass.getPoints(armor);
               }
            }
         }
      }
   }

   if (costKeys.pointer && augLimiter === 4) {
      exchangeExtraPointsForAugs(costKeys, armorsClass, skillsClass);
   }

   return costKeys.total;
}

function cheapestAugmentToRemove(armor, names) {
   if (armor.augsPointer < 6) return [armor.augsPointer, 0];

   const augs = armor.augs;

   if (augs[1] === 255) return [1, 5];

   let i = 6;
   while (i--) {
      let aug = augs[i];
      if (aug === 255) {
         return [i, 5];
      } else if (aug < 250 && (!names[aug] || armor.skills[aug] > names[aug].points)) {
         return [i, 10];
      }
   }

   return [0, 99];
}

function getUsableSkill(costPointer, skillsByCost, armor, costKeys, remainingBudget) {
   while (costPointer--) {
      let cost = costKeys.keys[costPointer];
      if (cost > remainingBudget) {
         continue;
      }

      let thisCostArr = skillsByCost[cost];
      let remainingSkills = thisCostArr.skills;
      for (let i = 0; i < thisCostArr.pointer; ++i) {
         // for (let skill of skills.skillsByCost[skills.costKeys[costIndex]].skills) {
         if (armor.addSkillToSet(remainingSkills[i][7])) {
            return remainingSkills[i];
         }
      }
   }
}

/**
 * @param {{ pointer: number; keys: [number];total:number; }} costKeys
 * @param {import("./armorClass.js").ArmorClass} armorsClass
 * @param {import("./skillClass.js").SkillsContainer} skillsClass
 */
function exchangeExtraPointsForAugs(costKeys, armorsClass, skillsClass) {
   let { costs: skillsByCost, names } = skillsClass;
   let armors = armorsClass.theseArmors;

   for (let i = 0; i < 5; i++) {
      if (!costKeys.total) break;

      const armor = armors[i];
      let augLen = armor.augsPointer;
      let remainingBudget = armor.budget - costKeys.keys[0];

      if (remainingBudget - (augLen === 6 ? 5 : 0) < costKeys[0]) {
         continue;
      }

      let [augIndex, augCost] = cheapestAugmentToRemove(armor, names);
      remainingBudget -= augCost;
      if (!(remainingBudget >= 0)) {
         continue;
      }

      let augmentedSkill = getUsableSkill(costKeys.pointer, skillsByCost, armor, costKeys, remainingBudget);

      if (!augmentedSkill) continue;

      if (augCost) {
         armor.budget -= augCost;
         // debugger;
         // remove old augment from the list
         while (augIndex < armor.augsPointer) {
            armor.augs[augIndex] = armor.augs[++augIndex];
         }

         // adjust pointer
         --armor.augsPointer;
      }

      // debugger;

      updateRecords(augmentedSkill, armor, skillsByCost);
   }
}

/**
 * @param {import("./skillClass.js").skillArr } skill
 * @param {import("./armorClass.js").Armor} armor
 * @param {import("./skillClass.js").costs }skillsByCost
 * @param {number} count
 */
function updateRecords(skill, armor, skillsByCost, count = 1) {
   let skillId = skill[7];
   let cost = skill[2];
   let usedCostArr = skillsByCost[cost];
   let costKeys = skillsByCost[0];

   if (armor.budget < cost * count || armor.augsPointer + count > 6 || !armor.addSkillToSet(skillId)) {
      return true;
   }

   // update skill point needed and total in skills.costs
   // add augment to record
   for (let i = 0; i < count; ++i) {
      armor.augs[armor.augsPointer++] = skillId;
   }

   // remove points used from the armor
   armor.budget -= cost * count;
   skill[1] -= count;

   if ((costKeys.total -= count) === 0) return true;

   if ((usedCostArr.total -= count) === 0) {
      // not needed but nice for debugging purposes
      usedCostArr.skills.pop();
      --usedCostArr.pointer;

      costKeys.removeCost(cost);
      return;
   }

   if (!skill[1]) {
      let arrayOfSkillsArr = usedCostArr.skills;
      let len = --usedCostArr.pointer;

      if (arrayOfSkillsArr[len] === skill) return;

      // swap the skill with 0 points to the end and --pointer
      for (let i = 0; i < len; ++i) {
         if (arrayOfSkillsArr[i] === skill) {
            arrayOfSkillsArr[i] = arrayOfSkillsArr[len];
            return;
         }
      }
   }
}

;// ./src/webWorker/setRecords.js
// ////////////////////////////////////////////////////////
// //////////  Armor iteration and set records  //////////
// ///////////////////////////////////////////////////////



/**
 * One odometer index per armor type, starting before the first armor.
 *
 * @param {import("./armorClass.js").ArmorClass} armorsClass
 */
function createArmorIndexes(armorsClass) {
   const indexes = [];

   for (let i = 0; i < 5; ++i) {
      let type = armorsClass.armorTypes[i];
      indexes[i] = {
         index: -1,
         len: armorsClass.armors[type].length,
         type,
      };
   }

   return indexes;
}

/**
 * Moves to the next armor combination, like an odometer starting at the helm.
 *
 * @param {ReturnType<typeof createArmorIndexes>} indexes
 * @param {import("./armorClass.js").ArmorClass} armorsClass
 * @param {object} names - skillsClass.names
 * @returns {boolean} false once every combination has been tried
 */
function nextArmorCombination(indexes, armorsClass, names) {
   for (let i = 0; i < 5; i++) {
      let thisIndex = indexes[i];
      let previousIndex = thisIndex.index;

      if (++thisIndex.index === thisIndex.len) {
         thisIndex.index = 0;

         if (thisIndex.type === "leg") {
            return false;
         }
      }

      armorsClass.setNextArmor(thisIndex, previousIndex, names);
      if (thisIndex.index !== 0) {
         break;
      }
   }

   return true;
}

/**
 * @param {Array} charmNeeded
 * @returns {boolean|undefined} true if points of a restricted skill are still needed
 */
function checkRestrictedSkills(charmNeeded) {
   for (let skill of charmNeeded) {
      // if points of this skill are still needed the run has already failed
      if (skill[0] > 0) {
         return true;
      }
   }
}

/**
 * Insertion sorts the current record into the kept sets if it is one of the best so far.
 * The last entry of returnVal.sets is always the buffer the next armor combination writes into.
 *
 * @param {{ armors: Uint8Array; decos: object; charms: Uint8Array; }} returnSets - The current buffer.
 * @returns {{ armors: Uint8Array; decos: object; charms: Uint8Array; }} The buffer to use next.
 */
function keepIfTopSet(returnSets) {
   const thisArmorRecord = returnSets.armors;
   // insertion sort if under 6 sets or this sets count is > then the current worst qualifying
   let i = returnVal.sets.length - 1;

   if (i < 5 || returnVal.sets[i - 1].armors[0] < thisArmorRecord[0]) {
      while (i > 0 && returnVal.sets[i - 1].armors[0] < thisArmorRecord[0]) {
         returnVal.sets[i] = returnVal.sets[--i];
      }

      returnVal.sets[i] = returnSets;

      // if less than 6 sets kept + the set to re wright for the current run, add a new one
      if (returnVal.length < 6) {
         returnVal.newSet();
      }

      // reset pointers to the last index
      return returnVal.sets.at(-1);
   }

   return returnSets;
}

;// ./src/webWorker/workerDebugger.js
const skillObj = (/* unused pure expression or super */ null && ({
   0: "AttackBoost",
   1: "Agitator",
   2: "PeakPerformance",
   3: "Resentment",
   4: "Resuscitate",
   5: "CriticalEye",
   6: "CriticalBoost",
   7: "WeaknessExploit",
   8: "LatentPower",
   9: "MaximumMight",
   10: "CriticalElement",
   11: "MastersTouch",
   12: "FireAttack",
   13: "WaterAttack",
   14: "IceAttack",
   15: "ThunderAttack",
   16: "DragonAttack",
   17: "PoisonAttack",
   18: "ParalysisAttack",
   19: "SleepAttack",
   20: "BlastAttack",
   21: "Handicraft",
   22: "RazorSharp",
   23: "SpareShot",
   24: "ProtectivePolish",
   25: "MindsEye",
   26: "Ballistics",
   27: "Bludgeoner",
   28: "BowChargePlus",
   29: "Focus",
   30: "PowerProlonger",
   31: "MarathonRunner",
   32: "Constitution",
   33: "StaminaSurge",
   34: "Guard",
   35: "GuardUp",
   36: "OffensiveGuard",
   37: "CriticalDraw",
   38: "PunishingDraw",
   39: "QuickSheathe",
   40: "Slugger",
   41: "StaminaThief",
   42: "AffinitySliding",
   43: "HornMaestro",
   44: "Artillery",
   45: "LoadShells",
   46: "SpecialAmmoBoost",
   47: "NormalRapidUp",
   48: "PierceUp",
   49: "SpreadUp",
   50: "AmmoUp",
   51: "ReloadSpeed",
   52: "RecoilDown",
   53: "Steadiness",
   54: "RapidFireUp",
   55: "DefenseBoost",
   56: "DivineBlessing",
   57: "RecoveryUp",
   58: "RecoverySpeed",
   59: "SpeedEating",
   60: "Earplugs",
   61: "Windproof",
   62: "TremorResistance",
   63: "BubblyDance",
   64: "EvadeWindow",
   65: "EvadeExtender",
   66: "FireResistance",
   67: "WaterResistance",
   68: "IceResistance",
   69: "ThunderResistance",
   70: "DragonResistance",
   71: "BlightResistance",
   72: "PoisonResistance",
   73: "ParalysisResistance",
   74: "SleepResistance",
   75: "StunResistance",
   76: "MuckResistance",
   77: "BlastResistance",
   78: "Botanist",
   79: "Geologist",
   80: "Partbreaker",
   81: "CaptureMaster",
   82: "CarvingMaster",
   83: "GoodLuck",
   84: "SpeedSharpening",
   85: "Bombardier",
   86: "Mushroomancer",
   87: "ItemProlonger",
   88: "Wide-Range",
   89: "FreeMeal",
   90: "Heroics",
   91: "Fortify",
   92: "FlinchFree",
   93: "JumpMaster",
   94: "CarvingPro",
   95: "HungerResistance",
   96: "LeapofFaith",
   97: "Diversion",
   98: "MasterMounter",
   99: "ChameleosBlessing",
   100: "KushalaBlessing",
   101: "TeostraBlessing",
   102: "Dragonheart",
   103: "WirebugWhisperer",
   104: "WallRunner",
   105: "Counterstrike",
   106: "RapidMorph",
   107: "HellfireCloak",
   108: "WindAlignment",
   109: "ThunderAlignment",
   110: "Stormsoul",
   200: "BloodRite",
   201: "Dereliction",
   202: "Furious",
   203: "MailofHellfire",
   204: "Coalescence",
   205: "Bloodlust",
   206: "Defiance",
   207: "SneakAttack",
   208: "AdrenalineRush",
   209: "Embolden",
   210: "Redirection",
   211: "SpiribirdsCall",
   212: "ChargeMaster",
   213: "Foray",
   214: "Tune-Up",
   215: "GrinderS",
   216: "BladescaleHone",
   217: "WallRunnerBoost",
   218: "ElementExploit",
   219: "Burst",
   220: "Guts",
   221: "QuickBreath",
   222: "StatusTrigger",
   223: "IntrepidHeart",
   224: "BuildupBoost",
   225: "Berserk",
   226: "WindMantle",
   227: "PowderMantle",
   228: "Frostcraft",
   229: "DragonConversion",
   230: "Heaven-Sent",
   231: "FrenziedBloodlust",
   232: "BloodAwakening",
   233: "Strife",
   234: "ShockAbsorber",
   235: "Inspiration",
   AttackBoost: 0,
   Agitator: 1,
   PeakPerformance: 2,
   Resentment: 3,
   Resuscitate: 4,
   CriticalEye: 5,
   CriticalBoost: 6,
   WeaknessExploit: 7,
   LatentPower: 8,
   MaximumMight: 9,
   CriticalElement: 10,
   MastersTouch: 11,
   FireAttack: 12,
   WaterAttack: 13,
   IceAttack: 14,
   ThunderAttack: 15,
   DragonAttack: 16,
   PoisonAttack: 17,
   ParalysisAttack: 18,
   SleepAttack: 19,
   BlastAttack: 20,
   Handicraft: 21,
   RazorSharp: 22,
   SpareShot: 23,
   ProtectivePolish: 24,
   MindsEye: 25,
   Ballistics: 26,
   Bludgeoner: 27,
   BowChargePlus: 28,
   Focus: 29,
   PowerProlonger: 30,
   MarathonRunner: 31,
   Constitution: 32,
   StaminaSurge: 33,
   Guard: 34,
   GuardUp: 35,
   OffensiveGuard: 36,
   CriticalDraw: 37,
   PunishingDraw: 38,
   QuickSheathe: 39,
   Slugger: 40,
   StaminaThief: 41,
   AffinitySliding: 42,
   HornMaestro: 43,
   Artillery: 44,
   LoadShells: 45,
   SpecialAmmoBoost: 46,
   NormalRapidUp: 47,
   PierceUp: 48,
   SpreadUp: 49,
   AmmoUp: 50,
   ReloadSpeed: 51,
   RecoilDown: 52,
   Steadiness: 53,
   RapidFireUp: 54,
   DefenseBoost: 55,
   DivineBlessing: 56,
   RecoveryUp: 57,
   RecoverySpeed: 58,
   SpeedEating: 59,
   Earplugs: 60,
   Windproof: 61,
   TremorResistance: 62,
   BubblyDance: 63,
   EvadeWindow: 64,
   EvadeExtender: 65,
   FireResistance: 66,
   WaterResistance: 67,
   IceResistance: 68,
   ThunderResistance: 69,
   DragonResistance: 70,
   BlightResistance: 71,
   PoisonResistance: 72,
   ParalysisResistance: 73,
   SleepResistance: 74,
   StunResistance: 75,
   MuckResistance: 76,
   BlastResistance: 77,
   Botanist: 78,
   Geologist: 79,
   Partbreaker: 80,
   CaptureMaster: 81,
   CarvingMaster: 82,
   GoodLuck: 83,
   SpeedSharpening: 84,
   Bombardier: 85,
   Mushroomancer: 86,
   ItemProlonger: 87,
   "Wide-Range": 88,
   FreeMeal: 89,
   Heroics: 90,
   Fortify: 91,
   FlinchFree: 92,
   JumpMaster: 93,
   CarvingPro: 94,
   HungerResistance: 95,
   LeapofFaith: 96,
   Diversion: 97,
   MasterMounter: 98,
   ChameleosBlessing: 99,
   KushalaBlessing: 100,
   TeostraBlessing: 101,
   Dragonheart: 102,
   WirebugWhisperer: 103,
   WallRunner: 104,
   Counterstrike: 105,
   RapidMorph: 106,
   HellfireCloak: 107,
   WindAlignment: 108,
   ThunderAlignment: 109,
   Stormsoul: 110,
   BloodRite: 200,
   Dereliction: 201,
   Furious: 202,
   MailofHellfire: 203,
   Coalescence: 204,
   Bloodlust: 205,
   Defiance: 206,
   SneakAttack: 207,
   AdrenalineRush: 208,
   Embolden: 209,
   Redirection: 210,
   SpiribirdsCall: 211,
   ChargeMaster: 212,
   Foray: 213,
   "Tune-Up": 214,
   GrinderS: 215,
   BladescaleHone: 216,
   WallRunnerBoost: 217,
   ElementExploit: 218,
   Burst: 219,
   Guts: 220,
   QuickBreath: 221,
   StatusTrigger: 222,
   IntrepidHeart: 223,
   BuildupBoost: 224,
   Berserk: 225,
   WindMantle: 226,
   PowderMantle: 227,
   Frostcraft: 228,
   DragonConversion: 229,
   "Heaven-Sent": 230,
   FrenziedBloodlust: 231,
   BloodAwakening: 232,
   Strife: 233,
   ShockAbsorber: 234,
   Inspiration: 235,
}));

function applyNameToSkillsArr(skillsArr) {
   return skillsArr.map(x => {
      return [...x, skillObj[x[7]]];
   });
}

function getAugmentInfo(names, theseArmors) {
   const armorData = {};
   theseArmors.forEach(armor => {
      armorData[armor.type] = { budget: armor.budget };

      // Starting the loop from 1 since the first element is used for the type.
      for (let i = 0; i < armor.augsPointer; i++) {
         const aug = armor.augs[i];
         armorData[armor.type][`aug ${i + 1}`] =
            aug === 250 ? ""
            : aug === 255 ? "-Def +5"
            : aug > 250 ? `+Slots -${6 * (255 - aug)}`
            : !names[aug] || names[aug].points < armor.skills[aug] ? `-${skillObj[aug]} +10`
            : `+${skillObj[aug]} -${names[aug].stats[2]}`;
      }
   });

   console.table(armorData);
}

function getSkillsInfo(costs) {
   // if(armor){console.log(armor)}
   let skillsRemaining = {};
   const { keys, pointer, total } = costs[0];
   const remainingCosts = { total };

   for (let i = 0; i < pointer; i++) {
      let skillArr = costs[keys[i]];
      let skillLen = skillArr.pointer;
      remainingCosts[keys[i]] = skillArr.total;
      for (let j = 0; j < skillLen; j++) {
         const skill = skillArr.skills[j];
         skillsRemaining[skillObj[skill[7]]] = {
            qurious: skill[2],
            remaining: skill[1],
            reset: skill[0],
            pass1FistDeco: skill[3],
            pointsForLvl4: skill[4],
            lowersDecoLevel: skill[5],
            pointsFor2ndDecoLevel: skill[6],
         };
      }
   }

   console.table({ remainingCosts });
   console.table(skillsRemaining);
}

;// ./src/webWorker/setBuildWorker.js
/* unused harmony import specifier */ var setBuildWorker_getSkillsInfo;
/* unused harmony import specifier */ var setBuildWorker_getAugmentInfo;
/* unused harmony import specifier */ var setBuildWorker_applyNameToSkillsArr;












// kept so existing imports from this file (tests) keep working



// In your Web Worker

function getDebug() {
   setBuildWorker_getSkillsInfo();
   setBuildWorker_getAugmentInfo();
   setBuildWorker_applyNameToSkillsArr();
}

/**
 * Tries every armor combination with every charm combination and records the best sets in returnVal.
 *
 * @param {{ setLimiter: number, runChecks?: boolean, skillBuffer: object, armorObj: object }} data
 * @returns {typeof returnVal}
 */
function runSetSearch(data) {
   const { setLimiter, runChecks } = data;
   const skillsClass = new SkillsContainer(data.skillBuffer);
   const armorsClass = new ArmorClass(data.armorObj, skillsClass);
   const indexes = createArmorIndexes(armorsClass);

   const decoResetValues = armorsClass.decoResetValues;
   const { primaries, secondaries, setBonus, charmNeeded } = skillsClass;
   const charmLength = skillsClass.primaries.length;
   let thisSetsLog;
   // console.profile('setBuild')
   const extraSkills = returnVal.stats;
   let returnSets = returnVal.sets[0];
   let thisCharmCombination = returnVal.charms;
   let thisArmorRecord = returnVal.armors;
   const thisRoundsDecoSlots = new Uint8Array(4);
   const { costKeys } = skillsClass;

   start: while (nextArmorCombination(indexes, armorsClass, skillsClass.names)) {
      if (armorsClass.isOverLimit > 0) {
         continue;
      }

      if (setBonus && checkRestrictedSkills(setBonus)) {
         continue;
      }

      armorsClass.setAugmentRemovalOrder();

      if (runChecks) {
         thisSetsLog = [];
      }

      let decoArray = returnVal.decos;
      let charmIndexes = 0;
      for (let i = 0; i < charmLength; i++) {
         if (!primaries[i]?.addPrimary()) continue;

         // the two skills must be different
         for (let k = i > 0 ? 0 : 1; k < charmLength; k += k + 1 !== i ? 1 : 2) {
            if (!secondaries[k]?.addSecondary()) continue;

            if (charmNeeded && checkRestrictedSkills(charmNeeded)) {
               // the secondary's points were already taken off above, so give them back before skipping this charm
               secondaries[k].removeSecondary();
               continue;
            }

            for (let j = 0; j < 4; j++) {
               thisRoundsDecoSlots[j] = decoResetValues[j];
            }

            armorsClass.resetArmors();

            if (decoArray !== undefined) {
               decoArray.poiner = 0;
               skillsClass.useDecorationSlots(thisRoundsDecoSlots, armorsClass, decoArray);
            } else {
               skillsClass.useDecorationSlots(thisRoundsDecoSlots, armorsClass);
            }

            if (costKeys.total > setLimiter * 5) {
               secondaries[k].removeSecondary();
               continue;
            }

            let remainingAugs = useAugments(setLimiter, armorsClass, skillsClass);
            secondaries[k].removeSecondary();

            if (remainingAugs > 0) {
               if (remainingAugs < 4) continue;

               if (remainingAugs < 7) break;

               primaries[i].removePrimary();
               continue start;
            }

            thisArmorRecord[0]++;

            if (thisArmorRecord[0] === 1 || runChecks) {
               decoArray[41] = decoArray.poiner;
               decoArray = undefined;
               if (runChecks && returnSets.armors[0] > 1) {
                  // eslint-disable-next-line no-undef
                  thisSetsLog.push([thisArmorRecord, thisDecoRecord, [primaries[i].primary, secondaries[k].secondary]]);
               }

               findExtraSkills(extraSkills, armorsClass, skillsClass, setLimiter, thisRoundsDecoSlots);
            }

            thisCharmCombination[charmIndexes++] = primaries[i][7];
            thisCharmCombination[charmIndexes++] = secondaries[k][7];
         }

         primaries[i].removePrimary();
      }

      if (!thisArmorRecord[0]) continue;

      returnVal.count.sets++;
      returnVal.count.combos += thisArmorRecord[0];

      returnSets = keepIfTopSet(returnSets);
      thisArmorRecord = returnSets.armors;
      thisCharmCombination = returnSets.charms;

      thisArmorRecord[0] = 0;
   }

   return returnVal;
}

// ///////////////////////////////////////////////////////
// //////////  Start This Run   //////////////////////////////
// ///////////////////////////////////////////////////////
if (typeof self !== "undefined") {
   self.onmessage = e => {
      let timer = 0 - performance.now();
      runSetSearch(e.data);

      // trim records
      if (returnVal.sets.length === 1) {
         postMessage("");
      } else {
         // remove the 6th buffer
         returnVal.sets.pop();
         postMessage(returnVal);
      }

      console.log(timer + performance.now());
   };
}

/******/ })()
;
//# sourceMappingURL=setBuildWorker.js.map