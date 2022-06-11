const URLAttack = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/Attacks.html-data.json";
const URLMonster = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/Monster.html-data.json";
const URLQuest = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/quest.html-data.json";
const URLRampage = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/Rampage.html-data.json";
const URLSharp = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/Sharpness.html-data.json";
const URLType = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/catagory.html-data.json";
const URLWeapon = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/Weapons.html-data.json";
const URLSPM = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/shotsPerMin.html-data.json";
const URLLight = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/AmmoLight.html-data.json";
const URLHeavy = "https://stonesan101.github.io/MonsterHunterRiseDamageCalculator/json/AmmoHeavy.html-data.json";
let comboTracker = [];

$(document).ready(function () {
  // when the document is ready, the following code will run
  $.getJSON(URLWeapon, (data) => {
    window.weapon = data;
  });

  $.getJSON(URLMonster, (data) => {
    window.monster = data;
  });
  $.getJSON(URLQuest, (data) => {
    window.quest = data;
  });
  $.getJSON(URLType, (data) => {
    window.skillCategories = data;
  });
  $.getJSON(URLAttack, (data) => {
    window.attack = data;
  });
  $.getJSON(URLHeavy, (data) => {
    window.ammoHeavyBowGun = data.HeavyBowGun;
  });
  $.getJSON(URLLight, (data) => {
    window.ammoLightBowGun = data.LightBowGun;
  });
  $.getJSON(URLSPM, (data) => {
    window.spm = data;
  });
  $.getJSON(URLRampage, (data) => {
    window.rampage = data;
  });
  $.getJSON(URLSharp, (data) => {
    window.sharpness = data;
  });
});

let check = [0, 0, 0, 0, 0, 0, 0];

function DataCompile() {
  if (check.every((keyCard) => keyCard)) {
    if (
      MegaDemonDrug.style.background !== "gray" &&
      DemonDrug.style.background !== "gray"
    ) {
      MegaDemonDrug.style.background =
        MegaDemonDrug === window.event.path[0] ? "" : "gray";
      DemonDrug.style.background =
        DemonDrug === window.event.path[0] ? "" : "gray";
    }
    if (/BowGun/.test($("#dropWeaponType").val())) {
      RangedDPS();
    } else {
      MeleeDPS();
    }
  }
}

function RangedDPS() {
  let rangedDamage = {};
  let ammoFrameData = [];
  let power = {};
  $.each(
    window[`ammo${$("#dropWeaponType").val()}`][$("#dropWeapon").val()].Ammo,
    function (key) {
      power = { ...this };
      power.aff =
        window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].AFF;
      power.baseRaw =
        window.weapon[$("#dropWeaponType").val()][
          $("#dropWeapon").val()
        ].baseRaw;
      [power.eleType, power.baseEle] = this.Ele;
      power.recoil =
        window[`ammo${$("#dropWeaponType").val()}`][
          $("#dropWeapon").val()
        ].recoil;
      power.reload =
        window[`ammo${$("#dropWeaponType").val()}`][
          $("#dropWeapon").val()
        ].reload;
      power.thisAttack = key;

      power = applyRampageSelections(power);
      power = GetSkills(power);

      // adds Weakness Exploit
      power.aff =
        power.rawHZV >= 45
          ? power.aff + JSON.parse($("#WeaknessExploit").val())
          : power.aff;
      power.aff = Math.min(power.aff, 100) / 100;

      power = GetRemainingSkills(power);
      power = DamageCalculations(power);
      const ammo = calculateAmmoFrames(power);

      const totalEffective = ~~(
        (0.5 + power.efr + power.efe) *
        ammo.ticsAdjust
      );
      const totalCrit = ~~(
        (0.5 + power.rawCrit + power.eleCrit) *
        ammo.ticsAdjust
      );
      const totalNon = ~~(
        (0.5 + power.rawNon + power.eleNon) *
        ammo.ticsAdjust
      );
      const shotsToKill = ~~(
        1 +
        JSON.parse($("#dropHealth").val()) / totalEffective
      );
      const timeToKill = /(Sticky|Slicing)/.test(power.thisAttack)
        ? 5 + ~~(0.5 + (60 / ammo.shotsPerMin) * shotsToKill) // Adds delay time for stickies/ slicing;
        : ~~(0.5 + (60 / ammo.shotsPerMin) * shotsToKill);

      const rawBoth = [].concat(`${~~power.rawNon} / ${~~power.rawCrit}`);
      const eleBoth = [].concat(`${~~power.eleNon} / ${~~power.eleCrit}`);
      const total = [].concat(`${totalNon} / ${totalCrit}`);
      const damage = {
        attack: power.thisAttack,
        rawBoth,
        eleBoth,
        total,
        efr: [~~power.efr],
        efe: [~~power.efe],
        totalEffective,
        shotsPerGain: [ammo.shotsPerGain],
        shotsToKill,
        timeToKill,
      };

      rangedDamage = [].concat(rangedDamage, damage);

      const ammoStats = {
        attack: power.thisAttack,
        rawMV: [power.rawMV],
        reloadSpeed: [ammo.reloadSpeed],
        recoilSpeed: [ammo.recoilSpeed],
        clipSize: [ammo.clipSize],
        ticsPer: [power.ticsPer],
        shotsPerMinBase: [ammo.shotsPerMinBase],
        shotsPerMin: [ammo.shotsPerMin],
      };

      ammoFrameData.push(ammoStats);

      const stats = [
        ["Stat", "Raw", "Affinity", "Ele Ammo"],
        ["Base", ~~power.baseRaw, power.baseAff, ~~(0.1 + 11 * power.eleAmmo)],
        [
          "Cap",
          ~~power.raw,
          power.aff * 100,
          ~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo),
        ],
        [
          "Post Cap",
          ~~(
            power.raw *
            power.critBoost *
            power.PRM *
            power.enrage *
            power.augPRM *
            JSON.parse(felineMarksmanid.value)[0]
          ),
          power.aff * 100,
          ~~(
            0.1 +
            (11 * power.BEM + power.BE) *
              power.eleAmmo *
              power.PEM *
              power.enrage *
              power.augPEM *
              power.eleCritBoost
          ),
        ],
        [
          "Effective",
          ~~(
            power.raw *
            power.efrMulti *
            power.PRM *
            power.enrage *
            power.augPRM *
            JSON.parse(felineMarksmanid.value)[1]
          ),
          power.aff * 100,
          ~~(
            0.1 +
            (11 * power.BEM + power.BE) *
              power.eleAmmo *
              power.PEM *
              power.enrage *
              power.augPEM *
              power.efeMulti
          ),
        ],
      ];
      BuildDamageTable(stats, "stats");
    }
  );
  rangedDamage.splice(0, 0, [
    "Ammo Type",
    "Raw",
    "Elemental",
    "Combined",
    "EFR",
    "EFE",
    "Effective",
    "Shots \n Per Gain",
    "Shots \n To Kill",
    "Seconds \n To Kill",
  ]);
  BuildDamageTable(rangedDamage, "dps");
  ammoFrameData.splice(0, 0, [
    "Ammo Type",
    "rawMV",
    "Reload",
    "Recoil",
    "Clip Size",
    "Tics Per Shot",
    "Shots Per \n Min Base",
    "Shots \n Per Min",
  ]);
  BuildDamageTable(ammoFrameData, "ammo");
}
function MeleeDPS() {
  let meleeDamage = [
    [
      "Combo",
      "Attack Name",
      "MV",
      "Raw",
      "Element",
      "Total",
      "EFR",
      "EFE",
      "Effective",
    ],
  ];
  let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let attackID = 0;

  let power = {};
  power.aff =
    window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].AFF;
  power.baseRaw =
    window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].baseRaw;
  [power.eleType, power.baseEle] =
    window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].Ele;
  power = applyRampageSelections(power);
  let attacks =
    $("#dropWeaponType").val() === "Bow" ||
    $("#dropWeaponType").val() === "ChargeBlade" ||
    $("#dropWeaponType").val() === "Gunlance"
      ? AddDependantSkills(power) //  filters CB Phial Attacks, Gunlance Shelling, Bow Attacks
      : window.attack[$("#dropWeaponType").val()];

  $.each(attacks, function (key) {
    if (
      dropWeaponType.value === "Bow" ||
      dropWeaponType.value === "ChargeBlade"
    ) {
      power = {
        ...power,
        ...window.attack[dropWeaponType.value][this],
      };
      power.thisAttack = this;
      if (dropWeaponType.value === "ChargeBlade") {
        power.ticsPer = power.hitsOfSharp < 1 ? 1 : power.hitsOfSharp;
      }
    } else {
      power = { ...power, ...this };
      power.thisAttack = key;
      power.ticsPer = power.hitsOfSharp < 1 ? 1 : power.hitsOfSharp;
    }

    power = GetSkills(power);

    // adds Weakness Exploit
    power.aff =
      power.rawHZV >= 45
        ? power.aff + JSON.parse($("#WeaknessExploit").val())
        : power.aff;
    power.aff = Math.min(power.aff, 100) / 100;
    if (!/Bow/.test($("#dropWeaponType").val()) && attackID === 0) {
      power = TotalHitsOfSharpUsed(power);
    } else if (attackID === 0 && !/BowGun/.test($("#dropWeaponType").val())) {
      UpdateComboTracker();
      UpdateComboDisplay();
    }
    power = GetRemainingSkills(power);
    power = DamageCalculations(power);

    if (!/Bow/.test(dropWeaponType.value)) {
      /* goes through each color sharpness and filters the recorded attacks for the number of times this current attack was used
       * then applies the given sharpness modifier to the damage if damage type is sever or blunt then multiplies by the times used
       * saves results in the comboDamage var and += the totals for every sharpness of every attack
       * to later be used to update the comboDamage in the dpsTable
       */

      if (attackID > 0 && $(".inputs").length > 0) {
        $(Object.keys(power.hitsOfSharpnessPerColor)).each(function (
          index,
          color
        ) {
          if (TimesUsed(attackID, power.hitsOfSharpnessPerColor[color]) > 0) {
            const [sharpPRM, sharpPEM] =
              power.skillType === ("Sever" || "Blunt") &&
              window.attack[$("#dropWeaponType").val()][power.thisAttack]
                .hitsOfSharp > 0
                ? [
                    window.sharpness.mod[color].PRM,
                    window.sharpness.mod[color].PEM,
                  ]
                : [1, 1];
            let hitsPerAttackPerSharpness = TimesUsed(
              attackID,
              power.hitsOfSharpnessPerColor[color]
            );
            // combo=[rawMV,rawNon,rawCrit,eleNon,eleCrit,totalNon,TotalCrit,EFR,EFE,totalEffective]
            comboDamage = [
              (comboDamage[0] += Number(
                ~~(
                  0.5 +
                  power.rawMV * hitsPerAttackPerSharpness * power.ticsPer
                )
              )),
              (comboDamage[1] += Number(
                ~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[2] += Number(
                ~~(0.1 + power.rawCrit * sharpPRM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[3] += Number(
                ~~(0.1 + power.eleNon * sharpPEM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[4] += Number(
                ~~(0.1 + power.eleCrit * sharpPEM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[5] += Number(
                (~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness +
                  ~~(0.1 + power.eleNon * sharpPEM) *
                    hitsPerAttackPerSharpness) *
                  power.ticsPer
              )),
              (comboDamage[6] += Number(
                (~~(0.1 + power.rawCrit * sharpPRM) *
                  hitsPerAttackPerSharpness +
                  ~~(0.1 + power.eleCrit * sharpPEM) *
                    hitsPerAttackPerSharpness) *
                  power.ticsPer
              )),
              (comboDamage[7] += Number(
                ~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[8] += Number(
                ~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness
              )),
              (comboDamage[9] += Number(
                (~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness +
                  ~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness) *
                  power.ticsPer
              )),
            ];
            console.log(comboDamage, comboTracker);
          }
        });
      }
    }

    // damage/meleeDamage adds sharpness to the calculations and arranges them in the array to be used for the damageTable
    const sharpnessModifier =
      power.hitsOfSharp > 0 ? JSON.parse(Sharpness.value) : { PRM: 1, PEM: 1 };
    const damage = {
      replaceME: "replaceME",
      "Attack Name": power.thisAttack,
      MV: power.rawMV,
      Raw: `${~~(0.1 + power.rawNon * sharpnessModifier.PRM)} / ${~~(
        0.1 +
        power.rawCrit * sharpnessModifier.PRM
      )}`,
      Ele: `${~~(0.1 + power.eleNon * sharpnessModifier.PEM)} / ${~~(
        0.1 +
        power.eleCrit * sharpnessModifier.PEM
      )}`,
      Total: `${
        ~~(0.1 + power.rawNon * sharpnessModifier.PRM) * power.ticsPer +
        ~~(0.1 + power.eleNon * sharpnessModifier.PEM) * power.ticsPer
      } / ${
        (~~(0.1 + power.rawCrit * sharpnessModifier.PRM) +
          ~~(0.1 + power.eleCrit * sharpnessModifier.PEM)) *
        power.ticsPer
      }`,
      EFR: ~~(0.1 + power.efr * sharpnessModifier.PRM),
      EFE: ~~(0.1 + power.efe * sharpnessModifier.PEM),
      Effective:
        (~~(0.1 + power.efe * sharpnessModifier.PEM) +
          ~~(0.1 + power.efr * sharpnessModifier.PRM)) *
        power.ticsPer,
    };
    meleeDamage = [].concat(meleeDamage, damage);

    // stats stores calculations to be used for the statsTable
    if (power.thisAttack === "Combo Damage") {
      const stats = [
        [["Stat"], ["Raw"], ["Affinity"], [power.eleType]],
        ["Base", ~~power.baseRaw, power.baseAff, power.baseEle],
        ["Cap", ~~power.raw, ~~(power.aff * 100), ~~power.ele],
        [
          "Post Cap",

          ~~(
            power.raw *
            power.critBoost *
            power.PRM *
            power.enrage *
            power.augPRM *
            JSON.parse(felineMarksmanid.value)[0] *
            sharpnessModifier.PRM
          ),
          ~~(power.aff * 100),
          ~~(
            power.ele *
            power.eleCritBoost *
            power.PEM *
            power.enrage *
            power.augPEM *
            sharpnessModifier.PEM
          ),
        ],
        [
          "Effective",
          ~~(
            power.raw *
            power.efrMulti *
            power.PRM *
            power.enrage *
            power.augEFR *
            JSON.parse(felineMarksmanid.value)[1] *
            sharpnessModifier.PRM
          ),
          ~~(power.aff * 100),
          ~~(
            power.ele *
            power.efeMulti *
            power.PEM *
            power.augPEM *
            power.enrage *
            power.augEFR *
            sharpnessModifier.PEM
          ),
        ],
      ];

      BuildDamageTable(stats, "stats");
    }

    ++attackID;
  });

  if ($("#dropWeaponType").val() === "Gunlance") {
    GunlanceShelling(meleeDamage, comboDamage, attackID, power);
  } else {
    if ($("#dropWeaponType").val() === "Bow") {
      comboDamage = BowComboDamage();
    }
    BuildDamageTable(meleeDamage, "dps");

    [c0.innerHTML, g0.innerHTML, h0.innerHTML, i0.innerHTML] = [
      comboDamage[0],
      comboDamage[7],
      comboDamage[8],
      comboDamage[9],
    ];
    d0.innerHTML = `${comboDamage[1]} / ${comboDamage[2]}`;
    e0.innerHTML = `${comboDamage[3]} / ${comboDamage[4]}`;
    f0.innerHTML = `${comboDamage[5]} / ${comboDamage[6]}`;
  }
}

function applyRampageSelections(power) {
  // applies rampage any bonuses that effect base stats
  $(weaponRampage.children).each(function (index, element) {
    const rampageSkill = window.rampage["Rampage-Up Skill"][element.value];
    if (rampageSkill !== undefined) {
      for (let i = 0; i < Object.keys(rampageSkill).length; i++) {
        const stat = Object.keys(rampageSkill)[i];
        power[stat] += rampageSkill[stat];
      }
    }
  });
  // for skills that change the base element
  if (!/BowGun/.test($("#dropWeaponType").val())) {
    power.eleType =
      weaponRampage.children[1].value.match(/Fire|Water|Thunder|Ice|Dragon/) !==
      null
        ? weaponRampage.children[1].value.match(
            /Fire|Water|Thunder|Ice|Dragon/
          )[0]
        : power.eleType;
  }
  power.baseAff = power.aff;
  return power;
}
function AddDependantSkills() {
  if (dropWeaponType.value === "ChargeBlade") {
    const phialType =
      window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()]
        .Phial === "Impact Phial"
        ? "Element Phial"
        : "Impact Phial";
    const regexp = new RegExp(`${phialType} `);

    let attacks = Object.keys(window.attack[$("#dropWeaponType").val()]).filter(
      (skill) => !regexp.test(skill)
    );
    return attacks;

    // adds Gunlance Shelling Attacks to attacks array
  }
  if ($("#dropWeaponType").val() === "Gunlance") {
    let attacks = window.attack[$("#dropWeaponType").val()];
    $(
      Object.keys(
        window.attack.GunlanceShelling[
          window.weapon.GunlanceShelling[$("#dropWeapon").val()][0]
        ]
      )
    ).each(function (index, element) {
      attacks.push(element);
    });
    return attacks;

    //  filters bow attacks for only the usable attacks
  }
  if ($("#dropWeaponType").val() === "Bow") {
    let attacks = window.attack[$("#dropWeaponType").val()];
    let expression = `${
      window.weapon.BowShotType[$("#dropWeapon").val()].Inate[0]
    }|${window.weapon.BowShotType[$("#dropWeapon").val()].Inate[1]}|${
      window.weapon.BowShotType[$("#dropWeapon").val()].Inate[2]
    }`;
    if (
      mightyBowId.selectedIndex === 1 &&
      Object.prototype.hasOwnProperty.call(
        window.weapon.BowShotType[$("#dropWeapon").val()],
        "MightyBow"
      )
    ) {
      expression += `|${
        window.weapon.BowShotType[$("#dropWeapon").val()].MightyBow[0]
      }`;
    } else if (
      window.weapon.BowShotType[$("#dropWeapon").val()].Inate.length > 3
    ) {
      expression += `|${
        window.weapon.BowShotType[$("#dropWeapon").val()].Inate[3]
      }`;
    }
    const regex = new RegExp(expression);

    attacks = [].concat(
      Object.keys(attacks).splice(0, 7),
      Object.keys(attacks).filter((skill) => regex.test(skill)),
      Object.keys(attacks).splice(60)
    );
    return attacks;
  }
}
function GetSkills(power) {
  power.BR = 0;
  power.BRM = 1;
  power.PRM = 1;
  power.BEM = 1;
  power.BE = 0;
  power.PEM = 1;
  power.enrage =
    $("#dropEnraged").val() === "Enraged"
      ? window.monster[$("#dropMonster").val()].Enrage / 100
      : 1;
  // For non ele Weapons
  power.eleHZV =
    power.eleType === "Non" ||
    power.eleType === "non" ||
    Number.isNaN(power.baseEle) ||
    power.eleType === undefined
      ? 0
      : window.monster[$("#dropMonster").val()].HitZone[$("#dropHZ").val()][
          power.eleType
        ];
  // removes HZV for attacks like stickies and phials
  power.rawHZV =
    power.type === "None" || /(Stick|Clust)/.test(power.thisAttack)
      ? 100
      : window.monster[$("#dropMonster").val()].HitZone[$("#dropHZ").val()][
          power.type
        ];
  // applies Demon Ammo if selected and damage type is sever or blunt
  power.rawHZV *=
    DemonAmmo.style.background !== "gray" && /(Sever|Blunt)/.test(power.type)
      ? 1.1
      : 1;
  // applies Water Blight if selected appropriate to the hzv
  power.rawHZV +=
    WaterBlight.style.background !== "gray" &&
    /(Sever|Blunt|Shot)/.test(power.type) &&
    power.rawHZV < 60
      ? 25
      : 0;
  power.rawHZV +=
    WaterBlight.style.background !== "gray" &&
    /(Sever|Blunt|Shot)/.test(power.type) &&
    power.rawHZV >= 60
      ? 3
      : 0;

  for (let i = 0; i < $(".skillButton").length; ++i) {
    if (
      document.getElementsByClassName("skillButton")[i].style.background !==
      "gray"
    ) {
      const skills = JSON.parse($(".skillButton")[i].value);
      power.BRM *= skills.BRM;
      power.BR += skills.BR;
      power.PRM *= skills.PRM;
      power.BEM *= skills.BEM;
      power.BE += skills.BE;
      power.PEM *= skills.PEM;
      power.aff += skills.Affinity;
    }
  }

  switch (power.type) {
    case "Sever":
    case "Blunt":
      power.skillType = "Sever";
      break;
    case "Shot":
      power.skillType = "Gunner";
      break;
    case "None":
    case "Stickies":
    case "IMPAED":
    case "IMPUAED":
      power.skillType = "Stickies";
      break;
    case "Cluster":
      power.skillType = "Clusters";
      break;
    default:
      power.skillType = "AllSkills";
      break;
  }
  // adds agitator to getSkills if enraged
  let getSkills = [];
  getSkills = window.skillCategories[power.skillType];
  if ($("#dropEnraged").val() === "Enraged") {
    getSkills.push("Agitator");
  }
  // adds weapon unique skills to the getSkills array
  if (
    Object.prototype.hasOwnProperty.call(
      window.attack[$("#dropWeaponType").val()][power.thisAttack],
      "unique"
    )
  ) {
    getSkills = getSkills.concat(
      window.attack[$("#dropWeaponType").val()][power.thisAttack].unique
    );
  }

  getSkills.forEach((skill) => {
    if (document.getElementById([skill]).selectedIndex > 0) {
      const skills = JSON.parse(document.getElementById([skill]).value);

      power.BRM *= skills.BRM;
      power.BR += skills.BR;
      power.PRM *= skills.PRM;
      power.BEM *= skills.BEM;
      power.BE += skills.BE;
      power.PEM *= skills.PEM;
      power.aff += skills.Affinity;
    }
  });

  return power;
}
function GetRemainingSkills(power) {
  [power.augEFR, power.augPRM, power.augPEM] = [1, 1, 1];
  /*
   * If an anti species type skill is selected it gets the list of monsters applicable and checks
   *if the selected monster is in the list.If true, it applies the skill.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      window.skillCategories,
      $("#weaponRampage0").value
    ) &&
    Object.prototype.hasOwnProperty.call(
      window.skillCategories[$("#weaponRampage0").value].Monsters,
      $("#dropMonster").val()
    )
  ) {
    [power.augPRM, power.augPEM] =
      window.skillCategories[$("#weaponRampage0").value];
  }
  if (/BowGun/.test($("#dropWeaponType").val())) {
    // Elemental Reload
    power.PEM *= JSON.parse(BarrelId.value).Element;
    // Power Barrel
    power.PRM *= JSON.parse(BarrelId.value).Power;
  }
  // If elemental exploit is selected && power.eleHZV >= 25 applies elemental exploit
  power.PEM *=
    $("#weaponRampage0").value === "Elemental Exploit" &&
    window.monster[$("#dropMonster").val()].HitZone[$("#dropHZ").val()][
      power.eleType
    ] >= 25
      ? 1.3
      : 1;
  power.augPEM =
    $("#weaponRampage0").val() === "Valstrax Soul" && power.eleType === "Dragon"
      ? 1.2
      : power.augPEM;
  // applies Dulling Strike to Base raw depending on sharpness and if selected
  [power.augEFR, power.augPRM] =
    $("#weaponRampage0").value === "Dulling Strike" &&
    Sharpness.selectedIndex < 5
      ? [1.02, 1.2]
      : [1, 1];
  // applies Bludgeoner to Base raw depending on sharpness and selectedIndex
  if (Sharpness.selectedIndex > 0) {
    power.BRM *=
      Bludgeoner.selectedIndex === 1 && Sharpness.selectedIndex < 4
        ? [1.05]
        : [1];
    power.BRM *=
      Bludgeoner.selectedIndex === 2 && Sharpness.selectedIndex < 4
        ? [1.1]
        : [1];
    power.BRM *=
      Bludgeoner.selectedIndex === 3 && Sharpness.selectedIndex < 5
        ? [1.1]
        : [1];
  }

  // applies sharpnessModifier to sever and blunt type attacks that use at least one hit of sharpness. This makes sure attacks like tackle or Bow skills don't get a sharpness modifier.
  const sharpnessModifier = [];
  [sharpnessModifier.PRM, sharpnessModifier.PEM] =
    (power.skillType === "Sever" || "Blunt") && power.hitsOfSharp > 0
      ? [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM]
      : [1, 1];
  power.PRM *=
    ~~(0.1 + 25 / sharpnessModifier.PRM) >=
    window.monster[$("#dropMonster").val()].HitZone[$("#dropHZ").val()][
      power.type
    ]
      ? JSON.parse(document.getElementById(["MindsEye"]).value).PRM
      : 1;
  power.critBoost = /(Sever|Blunt|Shot)/.test(power.type)
    ? JSON.parse($("#CriticalBoost").val()).PRM
    : 1;

  power.efrMulti = 1 + (power.critBoost - 1) * power.aff;

  /*
   * Brutal Strike
   * Converts -Aff to a positive then * chance to proc * dmg modifier then
   * adds the -dps to the +dps gain to find overall dps difference
   */
  power.brutalEFR =
    (power.aff - power.aff * 2) * 0.25 * 0.5 +
    (power.aff - power.aff * 2) * -0.25 * 0.75;
  [power.efrMulti, power.critBoost] =
    $("#weaponRampage0").value === "Brutal Strike" && power.aff < 0
      ? [1 + power.brutalEFR, 1.5]
      : [power.efrMulti, power.critBoost];

  power.eleCritBoost = /(Sever|Blunt|Shot)/.test(power.type)
    ? JSON.parse($("#CriticalElement").val()).PEM
    : 1;
  return power;
}
function UpdateComboTracker() {
  if (!Number.isNaN(+event.target.id)) {
    // if value entered in the e.target combo input > amount stored in comboTracker [] adds attack id to the end of the comboTracker until they are ===
    let difference = event.target.value - TimesUsed(event.target.id);
    while (difference > 0) {
      comboTracker.push(event.target.id);
      --difference;
    }
    // if value entered in the e.target combo input < amount stored in comboTracker [] removes the last instance of this attack id from the comboTracker until they are ===
    while (difference < 0) {
      comboTracker.splice(comboTracker.lastIndexOf(event.target.id), 1);
      ++difference;
    }
  }
}
function UpdateComboDisplay() {
  $(".comboAttack").hide();

  $(comboTracker).each(function (index, element) {
    $(".comboAttack")[index].style = "display:''";
    $(".comboAttack")[index].textContent = $(`#b${[element]}`).text();
  });
}

// finds HitsOfSharpness current sharpness as well as what combo hits were used how many times per color
function TotalHitsOfSharpUsed(power) {
  // all Sharpness values are currently stored at 20% of actual value. hence +2s and *5s

  if (comboTracker !== []) {
    let listOfEachAttack = [];
    const total = {};
    let [whiteMin, whiteMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()]
        .white;
    let [blueMin, blueMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()].blue;
    let [greenMin, greenMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()]
        .green;
    let [yellowMin, yellowMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()]
        .yellow;
    let [orangeMin, orangeMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()]
        .orange;
    let [redMin, redMax] =
      window.sharpness[$("#dropWeaponType").val()][$("#dropWeapon").val()].red;
    // for each pont of handicraft checks if the current sharpness is < the max sharpness for that color. if so, adds 2 points to the total sharpness for that color.(the equivalent of a +10 sharpness)
    for (let i = 0; i < handicraft.selectedIndex; ++i) {
      if (redMin < redMax) {
        yellowMin += 2;
      } else if (orangeMin < orangeMax) {
        greenMin += 2;
      } else if (yellowMin < yellowMax) {
        yellowMin += 2;
      } else if (greenMin < greenMax) {
        greenMin += 2;
      } else if (blueMin < blueMax) {
        blueMin += 2;
      } else if (whiteMin < whiteMax) {
        whiteMin += 2;
      }
    }
    // applies the extra hits of sharpness from the Masters Touch skill
    const mTBonus =
      power.aff > 0 ? 5 * (1 + +MastersTouch.value * power.aff) : 5;
    total.white = ~~(mTBonus * whiteMin);
    total.blue = ~~(mTBonus * blueMin);
    total.green = ~~(mTBonus * greenMin);
    total.yellow = ~~(mTBonus * yellowMin);
    total.orange = ~~(mTBonus * orangeMin);
    total.red = ~~(mTBonus * redMin);

    UpdateComboTracker();
    UpdateComboDisplay();

    const comboMulti =
      $(".inputComboRepeat").length > 0 ? $(".inputComboRepeat").val() : 1;
    // for each pont in the comboMultiplier input, adds another comboTracker [] to the listOfEachAttack
    for (let i = 0; i < comboMulti; i++) {
      listOfEachAttack = listOfEachAttack.concat(comboTracker);
    }
    let totalHitsOfSharpnessUsed = 0;
    const hitsOfSharpnessPerColor = {};
    hitsOfSharpnessPerColor.white = [];
    hitsOfSharpnessPerColor.blue = [];
    hitsOfSharpnessPerColor.green = [];
    hitsOfSharpnessPerColor.yellow = [];
    hitsOfSharpnessPerColor.orange = [];
    hitsOfSharpnessPerColor.red = [];

    $(listOfEachAttack).each(function (index, eachAttack) {
      if (
        $("#dropWeaponType").val() !== "Gunlance" ||
        ($("#dropWeaponType").val() === "Gunlance" && eachAttack < 14)
      ) {
        for (let i = 0; i < power.ticsPer; i++) {
          if (
            window.attack[$("#dropWeaponType").val()][
              $(`#b${eachAttack}`).text()
            ].hitsOfSharp > 0
          ) {
            ++totalHitsOfSharpnessUsed;
          }
        }
      } else if ($("#dropWeaponType").val() === "Gunlance" && eachAttack > 13) {
        ++totalHitsOfSharpnessUsed;
      }
      let totalHits = 0;
      if (totalHitsOfSharpnessUsed <= (totalHits += total.white)) {
        hitsOfSharpnessPerColor.white.push(eachAttack);
      } else if (totalHitsOfSharpnessUsed <= (totalHits += total.blue)) {
        hitsOfSharpnessPerColor.blue.push(eachAttack);
      } else if (totalHitsOfSharpnessUsed <= (totalHits += total.green)) {
        hitsOfSharpnessPerColor.green.push(eachAttack);
      } else if (totalHitsOfSharpnessUsed <= (totalHits += total.yellow)) {
        hitsOfSharpnessPerColor.yellow.push(eachAttack);
      } else if (totalHitsOfSharpnessUsed <= (totalHits += total.orange)) {
        hitsOfSharpnessPerColor.orange.push(eachAttack);
      } else if (totalHitsOfSharpnessUsed <= (totalHits += total.red)) {
        hitsOfSharpnessPerColor.red.push(eachAttack);
      }
    });

    console.log(hitsOfSharpnessPerColor);

    let hits = totalHitsOfSharpnessUsed;
    [whiteMin, hits] =
      hits - total.white > 0
        ? [0, hits - total.white]
        : [total.white - hits, 0];
    [blueMin, hits] =
      hits > 0 && hits - total.blue > 0
        ? [0, hits - total.blue]
        : [total.blue - hits, 0];
    [greenMin, hits] =
      hits > 0 && hits - total.green > 0
        ? [0, hits - total.green]
        : [total.green - hits, 0];
    [yellowMin, hits] =
      hits > 0 && hits - total.yellow > 0
        ? [0, hits - total.yellow]
        : [total.yellow - hits, 0];
    [orangeMin, hits] =
      hits > 0 && hits - total.orange > 0
        ? [0, hits - total.orange]
        : [total.orange - hits, 0];
    [redMin, hits] =
      hits > 0 && hits - total.red > 0
        ? [0, hits - total.red]
        : [total.red - hits, 0];

    white.parentNode.style = `display:''; width:${
      mTBonus *
      0.6 *
      (whiteMax + blueMax + greenMax + yellowMax + orangeMax + redMax)
    }px`;
    white.style.width = `${whiteMin * 0.6}px`;
    blue.style.width = `${blueMin * 0.6}px`;
    green.style.width = `${greenMin * 0.6}px`;
    yellow.style.width = `${yellowMin * 0.6}px`;
    orange.style.width = `${orangeMin * 0.6}px`;
    red.style.width = `${redMin * 0.6}px`;

    white.innerHTML = whiteMin > 0 ? whiteMin : "";
    blue.innerHTML = blueMin > 0 ? blueMin : "";
    green.innerHTML = greenMin > 0 ? greenMin : "";
    yellow.innerHTML = yellowMin > 0 ? yellowMin : "";
    orange.innerHTML = orangeMin > 0 ? orangeMin : "";
    red.innerHTML = redMin > 0 ? redMin : "";

    if (whiteMin > 0) {
      Sharpness.selectedIndex = 6;
    } else if (blueMin > 0) {
      Sharpness.selectedIndex = 5;
    } else if (greenMin > 0) {
      Sharpness.selectedIndex = 4;
    } else if (yellowMin > 0) {
      Sharpness.selectedIndex = 3;
    } else if (orangeMin > 0) {
      Sharpness.selectedIndex = 2;
    } else if (redMin >= 0) {
      Sharpness.selectedIndex = 1;
    }
    power.hitsOfSharpnessPerColor = hitsOfSharpnessPerColor;
    return power;
  }
  if (event.target.path.length !== 0) {
    comboTracker = [event.target.id];
  }
}
function DamageCalculations(power) {
  // final damage calculations first row limits raw to the 3x attack cap
  power.raw = Math.min(power.baseRaw * power.BRM + power.BR, power.baseRaw * 3);
  const rawFormula =
    (power.raw *
      power.PRM *
      power.augPRM *
      power.rawHZV *
      power.enrage *
      power.rawMV) /
    10000;
  power.rawNon = rawFormula * JSON.parse(felineMarksmanid.value)[0];
  power.efr =
    rawFormula * power.efrMulti * JSON.parse(felineMarksmanid.value)[1];
  power.rawCrit =
    rawFormula * power.critBoost * JSON.parse(felineMarksmanid.value)[0];
  // limits to the 3x ele cap??? not sure if this cap is correct but it is the cap for the raw and good luck reaching even 2x
  power.eleAmmo =
    /BowGun/.test($("#dropWeaponType").val()) &&
    /(Ice|Fire|Water|Dragon|Thunder)/.test(power.eleType)
      ? 1 + power.raw / 100
      : 1;
  power.ele =
    Math.min(power.baseEle * power.BEM + power.BE, power.baseEle * 3) *
    power.eleAmmo;
  power.efeMulti = 1 + (power.eleCritBoost - 1) * power.aff;
  const eleFormula =
    power.ele *
    power.PEM *
    (power.eleHZV / 100) *
    power.enrage *
    power.eleMV *
    power.augPEM;

  power.eleNon = eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
  power.efe =
    eleFormula * power.efeMulti > 0 && eleFormula * power.efeMulti < 1
      ? 1
      : ~~(0.1 + eleFormula * power.efeMulti);
  power.eleCrit =
    eleFormula * power.eleCritBoost > 0 && eleFormula * power.eleCritBoost < 1
      ? 1
      : ~~(0.1 + eleFormula * power.eleCritBoost);
  return power;
}
function BowComboDamage() {
  /*
   * for each combo input > 0 takes the damage listed for that skill * the number entered into the input field
   * += for every skill used then updates the Combo Damage field
   */
  const tableCell = ["c", "d", "e", "f", "g", "h", "i"];
  let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $(".inputs").each(function (index, input) {
    let eachAttacksDamage = [];
    if (input.value > 0) {
      $(tableCell).each(function (index, letter) {
        eachAttacksDamage = eachAttacksDamage.concat(
          `${$(`#${[letter + input.id]}`).text()}`.match(/\d+/g)
        );
      });
      eachAttacksDamage = eachAttacksDamage.map(
        (damage) => +damage * input.value * $(".inputComboRepeat ").val()
      );
      $(eachAttacksDamage).each(function (index) {
        comboDamage[index] += +eachAttacksDamage[index];
      });
    }
  });
  return comboDamage;
}
function GunlanceShelling(currentDamage, comboDamage, ID) {
  const shellingType =
    window.weapon.GunlanceShelling[$("#dropWeapon").val()][0];
  const shellingLevel =
    window.weapon.GunlanceShelling[$("#dropWeapon").val()][1];
  console.log(shellingType, shellingLevel);
  $(Object.keys(window.attack.GunlanceShelling[shellingType])).each(function (
    index,
    element
  ) {
    let ticsPer = Object.prototype.hasOwnProperty.call(
      window.attack.GunlanceShelling[shellingType][element],
      "ticsPer"
    )
      ? window.attack.GunlanceShelling[shellingType][element].ticsPer
      : 1;
    const raw =
      window.attack.GunlanceShelling[shellingType][element].rawMV[
        shellingLevel
      ];
    const ele =
      window.attack.GunlanceShelling[shellingType][element].eleMV[
        shellingLevel
      ];
    const final = {
      replaceME: "replaceME",
      "Attack Name": element,
      MV: 0,
      Raw: `${raw} / ${raw}`,
      Ele: `${ele} / ${ele}`,
      Total: `${(raw + ele) * ticsPer} / ${(raw + ele) * ticsPer}`,
      EFR: raw,
      EFE: ele,
      Effective: (raw + ele) * ticsPer,
    };

    for (let i = 0; i < TimesUsed(ID); ++i) {
      comboDamage[0] += 0;
      comboDamage[1] += raw;
      comboDamage[2] += raw;
      comboDamage[3] += ele;
      comboDamage[4] += ele;
      comboDamage[5] += (raw + ele) * ticsPer;
      comboDamage[6] += (raw + ele) * ticsPer;
      comboDamage[7] += raw;
      comboDamage[8] += ele;
      comboDamage[9] += (raw + ele) * ticsPer;
    }
    currentDamage.push(final);
    ++ID;
  });

  BuildDamageTable(currentDamage, "dps");

  c0.innerHTML = `${[comboDamage[0]]}`;
  d0.innerHTML = `${[comboDamage[1]]} / ${[comboDamage[2]]}`;
  e0.innerHTML = `${[comboDamage[3]]} / ${[comboDamage[4]]}`;
  f0.innerHTML = `${comboDamage[5]} / ${comboDamage[6]}`;
  g0.innerHTML = `${[comboDamage[7]]}`;
  h0.innerHTML = `${[comboDamage[8]]}`;
  i0.innerHTML = `${comboDamage[9]}`;
}

function BuildDamageTable(myDamage, id) {
  const currentAmmoTableStyle = ammoTable.style.display;
  const currentDamageTableStyle = dpsTable.style.display;
  const inputs = document.querySelectorAll(".a");
  let k = 0;
  const myHeader = document.querySelector(`#${id}Head`);
  const myBody = document.querySelector(`#${id}Body`);
  const table = document.createElement("table");
  const tHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const tBody = document.createElement("tbody");

  const myHeaders = myDamage.splice(0, 1);
  myHeaders[0].forEach((headerText) => {
    const header = document.createElement("th");
    const textNode = document.createTextNode(headerText);

    header.appendChild(textNode);
    headerRow.appendChild(header);
  });

  tHead.appendChild(headerRow);
  myHeader.replaceWith(tHead);
  myDamage.forEach((Attack) => {
    const row = document.createElement("tr");

    Object.values(Attack).forEach((text) => {
      if (text === "replaceME") {
        if (
          $("#previousWeaponType").val() === $("#dropWeaponType").val() &&
          inputs.length > 0 &&
          event.target.id !== "mightyBowId" &&
          (($("#dropWeaponType").val() === "Bow" &&
            previousWeapon.value === $("#dropWeapon").val()) ||
            $("#dropWeaponType").val() !== "Bow")
        ) {
          row.appendChild(inputs[k]);
          ++k;
        } else {
          const cell = document.createElement("td");
          const adjuster = document.createElement("input");

          adjuster.setAttribute("type", "Number");
          adjuster.setAttribute("class", "Combo skill");
          adjuster.setAttribute("Max", 20);
          if (
            $("#dropWeaponType").val() === "Bow" &&
            previousWeapon.value !== $("#dropWeapon").val()
          ) {
            comboTracker = [];
            UpdateComboDisplay();
          }
          if (k === 0) {
            adjuster.setAttribute("id", "inputComboRepeat");
            adjuster.setAttribute("Min", 1);
            adjuster.setAttribute("value", 1);
            adjuster.setAttribute(
              "class",
              "inputComboRepeat hitsOfSharpInputs"
            );
          } else {
            adjuster.setAttribute("id", k);
            adjuster.setAttribute("class", "inputs hitsOfSharpInputs");
            adjuster.setAttribute("Min", 0);
            adjuster.setAttribute("value", 0);
          }
          ++k;
          adjuster.setAttribute("onChange", "DataCompile(event)");
          cell.appendChild(adjuster);
          row.appendChild(cell);
        }
      } else {
        const cell = document.createElement("td");
        const textNode = document.createTextNode(text);

        cell.appendChild(textNode);
        row.appendChild(cell);
      }
    });
    tBody.appendChild(row);
    myBody.replaceWith(tBody);
  });
  table.setAttribute("id", `${id}Table`);
  tHead.setAttribute("id", `${id}Head`);
  tBody.setAttribute("id", `${id}Body`);
  tBody.className = /(BowGun)/.test($("#dropWeaponType").val())
    ? "rangedTable"
    : "meleeTable";

  ammoTable.style.display = currentAmmoTableStyle;
  dpsTable.style.display = currentDamageTableStyle;

  if (id !== "stats" && id !== "ammo") {
    const [len, ...column] = /BowGun/.test($("#dropWeaponType").val())
      ? [k, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
      : [k, "a", "b", "c", "d", "e", "f", "g", "h", "i"];

    $("#previousWeapon").val($("#dropWeapon").val());
    $("#previousWeaponType").val($("#dropWeaponType").val());
    for (let i = 0; i < len; ++i) {
      let j = 0;

      column.forEach((letter) => {
        $(`#${id}Body`)[0].children[i].children[j].className = `${letter} ${i}`;
        $(`#${id}Body`)[0].children[i].children[j].id = letter + i;
        ++j;
      });
    }
  }
}
function MonChart() {
  if (Object.prototype.hasOwnProperty.call(window, "monster")) {
    const headers = [
      `${$("#dropMonster").val()}`,
      "Sever",
      "Blunt",
      "Shot",
      "Fire",
      "Water",
      "Thunder",
      "Ice",
      "Dragon",
    ];
    const monDrop = document.querySelector("#dropMonster");
    const table = document.createElement("table");
    const mons = window.monster[$("#dropMonster").val()].HitZone;
    const myTable = document.querySelector("#monTable");
    const headerRow = document.createElement("tr");

    headers.forEach((headerText) => {
      const header = document.createElement("th");
      const textNode = document.createTextNode(headerText);

      header.appendChild(textNode);
      headerRow.appendChild(header);
    });

    table.appendChild(headerRow);
    for (let i = 0; i < Object.keys(mons).length; ++i) {
      const row = document.createElement("tr");
      const HZV = [].concat(
        Object.keys(mons)[i],
        Object.values(mons[Object.keys(mons)[i]])
      );

      for (let j = 0; j < 9; ++j) {
        const cell = document.createElement("td");
        // adds demon ammo and waterblight to displayed HZV
        HZV[j] =
          DemonAmmo.style.background !== "gray" && (j === 1 || j === 2)
            ? ~~(HZV[j] *= 1.1)
            : HZV[j];
        if (
          WaterBlight.style.background !== "gray" &&
          (j === 1 || j === 2 || j === 3) &&
          HZV[j] < 60
        ) {
          HZV[j] += 25;
        } else if (
          WaterBlight.style.background !== "gray" &&
          (j === 1 || j === 2 || j === 3) &&
          HZV[j] >= 60
        ) {
          HZV[j] += 3;
        }

        const textNode = document.createTextNode(HZV[j]);

        if (HZV[j] < 14) {
          cell.setAttribute("class", "F");
        } else if (HZV[j] < 25) {
          cell.setAttribute("class", "C");
        } else if (HZV[j] < 45) {
          cell.setAttribute("class", "B");
        } else if (HZV[j] < 70) {
          cell.setAttribute("class", "A");
        } else if (HZV[j] >= 70) {
          cell.setAttribute("class", "S");
        }
        cell.appendChild(textNode);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    table.setAttribute("id", "monTable");
    myTable.replaceWith(table);
    $("#monTable > tr:nth-child(1) > th:nth-child(1)").replaceWith(monDrop);
  }
}

function HideAndRevealTypeSpecificElements(redKeyCard = false) {
  if (
    check.every((keyCard) => keyCard) &&
    (redKeyCard || window.event.path[0] === $("#dropWeaponType")[0])
  ) {
    comboTracker = [];
    // hides all weaponType specific elements and sets selected index to 0
    for (let i = 0; i < $(".classSpecific").length; ++i) {
      $(".classSpecific")[i].parentNode.style = "display:none";
      $(".classSpecific")[i].selectedIndex = 0;
      $("#divComboAttacks")[0].style = "display:''";
      weaponId.innerHTML = "";
    }
    if (/(Bow)/.test($("#dropWeaponType").val())) {
      $("#sharpnessContainer").hide();
      RangedElements();
      UniqueColumnsDisplay();
    } else {
      MeleeElements();
      UniqueColumnsDisplay();
    }
  }
}
function RangedElements() {
  // shows type specific common to Bow and BowGun

  $("#sharpnessContainer").style = "display:none";
  ammoTable.style.display = "none";

  weaponId.append($("#dropWeaponType").val());
  weaponId.style = "display:''";
  for (let i = 0; i < $(`.${$("#dropWeaponType").val()}`).length; ++i) {
    $(`.${$("#dropWeaponType").val()}`)[i].parentNode.style = "display:''";
  }
  for (let i = 0; i < $(".Shot").length; ++i) {
    $(".Shot")[i].parentNode.style = "display:''";
  }
  if (/(BowGun)/.test($("#dropWeaponType").val())) {
    // shows all type specific related to BowGun
    $("#divComboAttacks")[0].style = "display:none";
    ammoChange.style = "display:''";
    resetCombo.style = "display:none";
  } else {
    // shows all type specific related to Bow
    ammoChange.style = "display:none";
    resetCombo.style = "display:''";
    // hides Rapid Fire div
    $("#raw > div:nth-child(22)").hide();
  }
}
function MeleeElements() {
  if (/(InsectGlaive|ChargeBlade|LongSword)/.test($("#dropWeaponType").val())) {
    ammoTable.style.display = "none";

    $(".sharpness").parent()[0].style = "display:''";
    weaponId.style.display = "''";
    weaponId.innerHTML = $("#dropWeaponType").val();
    ammoChange.style = "display:none";
    resetCombo.style = "display:''";

    for (let i = 0; i < $(`.${$("#dropWeaponType").val()}`).length; ++i) {
      $(`.${$("#dropWeaponType").val()}`)[i].parentNode.style = "display:''";
    }
    for (let i = 0; i < $(".melee").length; ++i) {
      $(".melee")[i].parentNode.style = "display:''";
    }
  } else {
    $(".sharpness").parent()[0].style = "display:''";
    ammoChange.style = "display:none";
    resetCombo.style = "display:''";
    weaponId.style.display = "none";
    for (let i = 0; i < $(".melee").length; ++i) {
      $(".melee")[i].parentNode.style = "display:''";
    }
  }
  if (
    $("#dropWeaponType").val() === "ChargeBlade" &&
    window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].Phial ===
      "Impact Phial"
  ) {
    shieldChargeEleid.parentNode.style = "display:none";
    shieldChargeIMPid.parentNode.style = "display:''";
  } else if (
    $("#dropWeaponType").val() === "ChargeBlade" &&
    window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()].Phial ===
      "Element Phial"
  ) {
    shieldChargeIMPid.parentNode.style = "display:none";
    shieldChargeEleid.parentNode.style = "display:''";
  }
}

function UniqueColumnsDisplay() {
  let uniqueColumns = 0;
  $.each($("#unique").children(), (data) => {
    if ($("#unique").children()[data].style.display === "") {
      ++uniqueColumns;
    }
  });
  uniqueColumns > 0 ? $("#weaponId").show() : $("#attackId").hide();
  if (uniqueColumns === 2 || uniqueColumns === 3) {
    $("#unique")[0].style = "grid-area: 5 / 3 / 6 / 4;";
  } else if (uniqueColumns === 4) {
    $("#bowUnique")[0].style =
      "grid-area: 2 / 3 / 3 / 6; ''grid-template-columns: repeat(3, auto)";
  } else if (uniqueColumns > 4) {
    $("#unique")[0].style =
      "grid-template-columns:repeat(4, 1fr); grid-area: 6 / 1 / 7 / 6;";
  }
}
function MaxSkills() {
  if (check.every((keyCard) => keyCard)) {
    for (let i = 0; i < $(".skill").length; ++i) {
      $(".skill")[i].selectedIndex = $(".skill")[i].hidden
        ? 0
        : Object.values($(".skill")[i]).length - 1;
    }
  }
}

function ResetSkills() {
  if (check.every((keyCard) => keyCard)) {
    for (let i = 0; i < $(".skill").length; ++i) {
      $(".skill")[i].selectedIndex = 0;
    }
  }
}

function SkillButtonToggle() {
  if (window.event.target.style.background !== "gray") {
    window.event.target.style.background = "gray";
    window.event.target.style.color = "midnightblue";
  } else {
    window.event.target.style.background = "";
    window.event.target.style.color = "";
  }
}
function ToggleAmmoTables() {
  dpsTable.style =
    dpsTable.style.display !== "none" ? "display:none" : "display:''";

  ammoTable.style =
    dpsTable.style.display !== "none" ? "display:none" : "display:''";
}
function calculateAmmoFrames(power) {
  const ammo = {};
  ammo.ammoIncrease = window.spm.AmmoUp[power.thisAttack][AmmoUPid.value];
  // converts to number to find frames used while staying within possible parameters
  ammo.recoilSpeed =
    window.spm.recoil[power.thisAttack][
      Math.max(
        0,
        Math.min(
          5,
          power.recoil -
            JSON.parse(RecoilId.value) -
            JSON.parse(BarrelId.value).Silencer
        )
      )
    ];
  ammo.recoilFrames = window.spm.recoil.frames[ammo.recoilSpeed];
  ammo.reloadSpeed =
    window.spm.reload[power.thisAttack][
      Math.max(
        0,
        Math.min(
          8,
          power.reload -
            JSON.parse(ReloadId.value) +
            JSON.parse(BarrelId.value).reload
        )
      )
    ];
  ammo.reloadFrames = window.spm.reload.frames[ammo.reloadSpeed];
  ammo.clipSize = power.clip + ammo.ammoIncrease;
  ammo.spareShot = +SpareShotid.value + +spareAdjust.value;
  /*
   * finds time needed to shoot 100 shots as a base for calculations
   * 60 seconds /
   * ( ( ( ( ( 100 shots / clip size) -1  for times needed to reload) * frames used reloading) = total reload frames
   * + (100 * recoil frames) = total recoil frames ) / 30 frames per second)
   */

  ammo.shotsPerMinBase = ~~(
    60 /
    (((100 / power.clip - 1) * ammo.reloadFrames + 100 * ammo.recoilFrames) /
      30 /
      100)
  );
  ammo.shotsPerMin = ~~(
    60 /
    ((((100 - ammo.spareShot) / ammo.clipSize - 1) * ammo.reloadFrames +
      100 * ammo.recoilFrames) /
      30 /
      100)
  );
  ammo.shotsPerGain = `${Number.parseFloat(
    (ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100
  ).toFixed(2)}%`;

  ammo.ticsAdjust = power.ticsPer > 0 ? Number(power.ticsPer) : 1;
  // Reduces total damage from pierce attacks displayed depending on selection
  // top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
  if (/Pierce/.test(power.thisAttack)) {
    ammo.ticsAdjust = power.ticsPer * JSON.parse(pierceAdjust.value)[0];
  } else if (/Pierc/.test(power.thisAttack)) {
    ammo.ticsAdjust = power.ticsPer * JSON.parse(pierceAdjust.value)[1];
  }
  return ammo;
}

function ComboReset(redKeyCard = false) {
  // resets the combo inputs to default values
  if (redKeyCard && !/BowGun/.test(previousWeaponType.value)) {
    comboTracker = [];

    $(".inputs").val(0);
    inputComboRepeat.value = 1;
    d0.innerHTML = `${0}/${0}`;
    e0.innerHTML = `${0}/${0}`;
    f0.innerHTML = `${0}/${0}`;
    [c0.innerHTML, g0.innerHTML, h0.innerHTML, i0.innerHTML] = [0, 0, 0, 0];
  }
}
function TimesUsed(ID, arr = comboTracker) {
  return arr.filter((attackId) => attackId == ID).length;
}
// Event to fire when quest and monster data loaded successfully.
$(document).ajaxSuccess(() => {
  if (check.some((keyCard) => !keyCard)) {
    check[0] = window.event.target.responseURL === URLAttack || check[0];
    check[1] = window.event.target.responseURL === URLMonster || check[1];
    check[2] = window.event.target.responseURL === URLQuest || check[2];
    check[3] = window.event.target.responseURL === URLRampage || check[3];
    check[4] = window.event.target.responseURL === URLSharp || check[4];
    check[5] = window.event.target.responseURL === URLType || check[5];
    check[6] = window.event.target.responseURL === URLWeapon || check[6];
    if (check.every((keyCard) => keyCard)) {
      WeaponSelect();
      RampageSelect();
      PartSelect();
      QuestSelect();
      HealthSelect();
      MonChart();
      HideAndRevealTypeSpecificElements(true);
      DataCompile();
      ComboReset(true);
    }
  }
});
// set event listeners to buttons that on click events will fire DataCompile() and SkillButtonToggle() and pass e as the event.
$(document).ready(() => {
  $(`.skillButton `).on(`click`, (e) => {
    SkillButtonToggle(e);
    DataCompile(e);
    MonChart(e);
  });
});
function WeaponSelect() {
  if (check.every((keyCard) => keyCard)) {
    $("#dropWeapon").empty();
    $.each(window.weapon[$("#dropWeaponType").val()], (key) => {
      $("#dropWeapon").append(
        $("<option></option>").attr("value", key).text(key)
      );
    });
  }
}

function RampageSelect() {
  if (check.every((keyCard) => keyCard)) {
    $("#weaponRampage0").textContent = "";
    $("#weaponRampage1").textContent = "";
    $("#weaponRampage2").textContent = "";
    $("#weaponRampage3").textContent = "";
    $("#weaponRampage4").textContent = "";
    $("#weaponRampage5").textContent = "";
    $("#weaponRampage1").style = "display:none";
    $("#weaponRampage2").style = "display:none";
    $("#weaponRampage3").style = "display:none";
    $("#weaponRampage4").style = "display:none";
    $("#weaponRampage5").style = "display:none";
    if (/Rampage/.test($("#dropWeapon").val())) {
      $.each(weaponRampage.children, (plusPlus, item) => {
        if (
          Object.prototype.hasOwnProperty.call(
            window.rampage[$("#dropWeapon").val()],
            [plusPlus]
          )
        ) {
          $.each(
            window.rampage[$("#dropWeapon").val()][plusPlus],
            (key, entry) => {
              weaponRampage.children[plusPlus].style = "display:''";
              $(weaponRampage.children[plusPlus]).append(
                $("<option></option>").attr("value", entry).text(entry)
              );
            }
          );
        } else {
          weaponRampage.children[plusPlus].style = "display:none";
        }
      });
    } else {
      $.each(weaponRampage.children, (key) => {
        $(weaponRampage.children[key]).empty();
        weaponRampage.children[key].style =
          key !== 0 ? "display:none" : "display:''";
      });
      $.each(
        window.weapon[$("#dropWeaponType").val()][$("#dropWeapon").val()]
          .Rampage,
        (key, entry) => {
          $("#weaponRampage0").append(
            $("<option></option>").attr("value", entry.key).text(entry)
          );
        }
      );
    }
  }
}
function PartSelect() {
  if (check.every((keyCard) => keyCard)) {
    $("#dropHZ").empty();
    $.each(window.monster[$("#dropMonster").val()].HitZone, (key) => {
      $("#dropHZ").append($("<option></option>").attr("value", key).text(key));
    });
  }
}
function QuestSelect() {
  $("#dropQuest").empty();
  $.each(window.quest, (key) => {
    if (
      Object.prototype.hasOwnProperty.call(window.quest[key], [
        $("#dropMonster").val(),
      ])
    ) {
      $("#dropQuest").append(
        $("<option></option>").attr("value", key).text(key)
      );
    }
  });
}
function HealthSelect() {
  $("#dropHealth").empty();
  $.each(
    window.quest[$("#dropQuest").val()][$("#dropMonster").val()],
    (key, value) => {
      $("#dropHealth").append(
        $("<option></option>").attr("value", value).text(value)
      );
    }
  );
}
