const check = {
    GreatSword: 0,
    rampage: 0,
    quest: 0,
    monster: 0,
    types: 0,
    ammo: 0,
    skills: 0,
    ammoDistance: 0
};
let keyDown = 0;
let lastEvent = '';

let comboTracker = [];
const info = {};
const gs = 'GreatSword';
const sa = 'SwitchAxe';
const cb = 'ChargeBlade';
const ig = 'InsectGlaive';
const hbg = 'HeavyBowGun';
const lbg = 'LightBowGun';
const bow = 'Bow';
const sns = 'SwordNShield';
const db = 'DualBlades';
const ls = 'LongSword';
const lance = 'Lance';
const hh = 'HuntingHorn';
const gl = 'Gunlance';
const ham = 'Hammer';
const weaponType = document.getElementById('dropWeaponType');
const sharpnessMod = {
    purple: {
        PRM: 1.39,
        PEM: 1.25,
    },
    white: {
        PRM: 1.32,
        PEM: 1.15,
    },
    blue: {
        PRM: 1.2,
        PEM: 1.0625,
    },
    green: {
        PRM: 1.05,
        PEM: 1,
    },
    yellow: {
        PRM: 1,
        PEM: 0.75,
    },
    orange: {
        PRM: 0.75,
        PEM: 0.5,
    },
    red: {
        PRM: 0.5,
        PEM: 0.25,
    },
};
const weaponTypes = [
    ['GreatSword'],
    ['ChargeBlade'],
    ['InsectGlaive'],
    ['SwordNShield'],
    ['DualBlades'],
    ['SwitchAxe'],
    ['LongSword'],
    ['Lance'],
    ['HeavyBowGun'],
    ['LightBowGun'],
    ['Bow'],
    ['HuntingHorn'],
    ['Gunlance'],
    ['Hammer'],
];
const jsons = [
    ['monster'],
    ['types'],
    ['rampage'],
    ['ammo'],
    ['quest'],
    ['skills'],
    ['ammoDistance']
];
const baseURL = /localhost/.test(window.location.host) ? 'http://localhost:5500' : 'https://stonesan101.github.io/MHR-Damage';
$([].concat(jsons, weaponTypes)).each(function() {
    $.getJSON(`${baseURL}/json/${this}.json`, (data) => {
        info[this] = data;
        if (/monster|types|rampage|quest|GreatSword|ammo|skills/.test(this)) {
            ++check[this];
            jsonsLoaded();
        }
    });
});
document.createElement('tagName');

function DataCompile(e = window.event) {
    if (/BowGun/.test($(weaponType).val())) {
        RangedDPS(e);
    } else {
        MeleeDPS(e);
    }
}

function RangedDPS(_e) {
    const rangedDamage = [];
    const ammoFrameData = [];
    let power = {};
    let ammo = {};
    let pass1 = true;

    $(
        Object.keys(
            Object.fromEntries(
                Object.entries(info.ammo).filter(
                    (eachAmmo) => (getWeapon().usableAmmo[eachAmmo[1].isUsed] && !/RF\+/.test(eachAmmo[0])) || (/Wyvernblast/.test(eachAmmo[0]) && weaponType.value === lbg),
                ),
            ),
        ),
    ).each((_index, skill) => {
        let ammoID = skill;
        if ($(weaponType).val() === 'LightBowGun') {
            getWeapon().isRapidFire.forEach((ammoType) => {
                if (ammoType === info.ammo[ammoID].isUsed) {
                    ammoID = info.ammo.keys[info.ammo[ammoID].isUsed - 1][1];
                }
            });
        }
        power = {...getWeapon(), ...info.ammo[ammoID] };
        power = getRampageSkills(power);
        power = GetSkills(power);
        power = GetRemainingSkills(power);
        power = DamageCalculations(power);
        if (!/Wyvern/.test(power.attackName) && !/explosion/.test(power.attackName) && !/sub-Lv/.test(power.attackName)) {
            ammo = calculateAmmoFrames(power);
        }
        if (/snipe/.test(power.attackName) || /explosion/.test(power.attackName) || /Wyvern/.test(power.attackName) || /sub-Lv/.test(power.attackName)) {
            [power.efe, power.eleCrit, power.eleNon] = [power.baseEle, power.baseEle, power.baseEle];
        }
        const totalEffective = ~~((~~(0.1 + power.efr) + ~~(0.1 + power.efe)) * ammo.ticsAdjust);
        const totalCrit = ~~((~~(0.1 + power.rawCrit) + ~~(0.1 + power.eleCrit)) * ammo.ticsAdjust);
        const totalNon = ~~((~~(0.1 + power.rawNon) + ~~(0.1 + power.eleNon)) * ammo.ticsAdjust);

        const shotsToKill = ~~(0.99 + $('#health').val() / totalEffective);
        // const timeToKill = /(Sticky|Slicing)/.test(power.attackName)
        // ? 5 + ~~(0.1 + (60 / ammo.shotsPerMin) * shotsToKill) // Adds delay time for stickies/ slicing;
        // : ~~(0.1 + (60 / ammo.shotsPerMin) * shotsToKill);
        const timeToKill = /Stic|Slic/.test(power.attackName) ?
            5 + ~~(0.99 + (60 / ammo.shotsPerMin) * shotsToKill) :
            ~~(0.99 + (60 / ammo.shotsPerMin) * shotsToKill);
        const rawBoth = [`${~~(.1+power.rawNon)} / ${~~(.1+power.rawCrit)}`];
        const eleBoth = [`${~~(.1+power.eleNon)} / ${~~(.1+power.eleCrit)}`];
        const total = [`${~~(.1+totalNon)} / ${~~(.1+totalCrit)}`];
        const damage = [power.attackName, rawBoth, eleBoth, total, ~~(.1 + power.efr), ~~(.1 + power.efe), totalEffective, ammo.shotsPerGain, shotsToKill, timeToKill];

        rangedDamage.push(damage);

        const ammoStats = [
            power.attackName,
            power.rawMV,
            ammo.reloadSpeed,
            ammo.recoilSpeed,
            ammo.clipSize,
            power.ticsPer + 1,
            ammo.shotsPerMinBase,
            ammo.shotsPerMin,
        ];

        ammoFrameData.push(ammoStats);
        if (pass1) {
            const stats = [
                ['Stat', 'Raw', 'Affinity', 'Ele Ammo'],
                ['Base', ~~power.baseRaw, ~~power.baseAff, ~~(0.1 + 11 * power.eleAmmo)],
                ['Total Attack', ~~power.raw, ~~(0.1 + power.aff * 100), ~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo)],
                [
                    'Total Damage', ~~(power.raw * power.critBoost * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[0]), ~~(power.aff * 100), ~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo * power.PEM * power.enrage * power.augPEM * power.eleCritBoost),
                ],
                [
                    'Effective', ~~(power.raw * power.efrMulti * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[1]), ~~(power.aff * 100), ~~(0.1 + (11 * power.BEM + power.BE) * power.eleAmmo * power.PEM * power.enrage * power.augPEM * power.efeMulti),
                ],
            ];
            BuildDamageTable(stats, 'stats', e);
            pass1 = false;

            rangedDamage.splice(0, 0, [
                'Ammo Type',
                'Raw',
                'Elemental',
                'Combined',
                'EFR',
                'EFE',
                'Effective',
                'Shots \n Per Gain',
                'Shots \n To Kill',
                'Seconds \n To Kill',
            ]);
        }
    });

    BuildDamageTable(rangedDamage, 'dps', e);
    ammoFrameData.splice(0, 0, ['Ammo Type', 'rawMV', 'Reload', 'Recoil', 'Clip Size', 'Tics Per Shot', 'Shots Per \n Min Base', 'Shots \n Per Min']);
    BuildDamageTable(ammoFrameData, 'ammo', e);
}

function MeleeDPS(e) {
    const meleeDamage = [
        ['Combo', 'Attack Name', 'MV', 'Raw', 'Element', 'Total', 'EFR', 'EFE', 'Effective']
    ];
    let comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let power = {};
    let firstRun = true;
    const lastSharp = Sharpness.selectedIndex;
    //  filters CB Phial Attacks, Gunlance Shelling, Bow Attacks
    //
    if ($(weaponType).val() === 'Bow' || $(weaponType).val() === 'ChargeBlade' || $(weaponType).val() === 'InsectGlaive' || $(weaponType).val() === 'Gunlance') {
        power.attacks = {...AddDependantSkills(power) };
    } else {
        power.attacks = {...getAttacks() };
    }
    $(Object.keys(power.attacks)).each((attackID, eachAttack) => {
        power = {...power, ...info[$(weaponType).val()].attacks[eachAttack], ...getWeapon() };
        power = {...getRampageSkills(power) };
        //
        power = GetSkills(power);
        //

        if (/inputs|inputButton/.test(window.event.target.className) && firstRun && !/BowGun/.test($(weaponType).val())) {
            UpdateComboTracker();
            UpdateComboDisplay();
        }

        if (firstRun && power.comboHitsPerColor === undefined && $(weaponType).val() !== 'Bow') {
            power = TotalHitsOfSharpUsed(power);
        }
        power = GetRemainingSkills(power);

        power = DamageCalculations(power);

        if (!/Bow/.test($(weaponType).val()) && comboTracker.length > 0) {
            /* goes through each color sharpness and filters the recorded attacks for the number of times this current attack was used
             * then applies the given sharpness modifier to the damage if damage type is sever or blunt then multiplies by the times used
             * saves results in the comboDamage var and += the totals for every sharpness of every attack
             * to later be used to update the comboDamage in the dpsTable
             */
            if ($('.inputs').length > 0) {
                $(Object.keys(power.comboHitsPerColor)).each((_index, color) => {
                    if (TimesUsed(attackID, power.comboHitsPerColor[color]) > 0) {
                        const [sharpPRM, sharpPEM] = power.noSharpMod === false ? [sharpnessMod[color].PRM, sharpnessMod[color].PEM] : [1, 1];
                        const hitsPerAttackPerSharpness = TimesUsed(attackID, power.comboHitsPerColor[color]);
                        // combo=[rawMV,rawNon,rawCrit,eleNon,eleCrit,totalNon,TotalCrit,EFR,EFE,totalEffective]
                        comboDamage = [
                            (comboDamage[0] += Number(~~(0.1 + power.rawMV * hitsPerAttackPerSharpness * (power.ticsPer + 1)))),
                            (comboDamage[1] += Number(~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness)),
                            (comboDamage[2] += Number(~~(0.1 + power.rawCrit * sharpPRM) * hitsPerAttackPerSharpness)),
                            (comboDamage[3] += Number(~~(0.1 + power.eleNon * sharpPEM) * hitsPerAttackPerSharpness)),
                            (comboDamage[4] += Number(~~(0.1 + power.eleCrit * sharpPEM) * hitsPerAttackPerSharpness)),
                            (comboDamage[5] += Number(
                                (~~(0.1 + power.rawNon * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.eleNon * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
                            )),
                            (comboDamage[6] += Number(
                                (~~(0.1 + power.rawCrit * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.eleCrit * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
                            )),
                            (comboDamage[7] += Number(~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness)),
                            (comboDamage[8] += Number(~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness)),
                            (comboDamage[9] += Number(
                                (~~(0.1 + power.efr * sharpPRM) * hitsPerAttackPerSharpness + ~~(0.1 + power.efe * sharpPEM) * hitsPerAttackPerSharpness) * (power.ticsPer + 1),
                            )),
                        ];
                    }
                });
            }
        }
        // damage/meleeDamage adds sharpness to the calculations and arranges them in the array to be used for the damageTable
        let sharpnessModifier = power.noSharpMod === false ? JSON.parse(Sharpness.value) : { PRM: 1, PEM: 1 };
        if (weaponType.value === 'Bow' && power.type !== 'Shot') {
            sharpnessModifier = BowCoating[BowCoating.selectedIndex].text === 'Power' ? 1.35 : sharpnessModifier;
            sharpnessModifier = BowCoating[BowCoating.selectedIndex].text === 'Close Range' ? 1.32 : sharpnessModifier;
            sharpnessModifier = BowCoating[BowCoating.selectedIndex].text === 'Close Range+' ? 1.39 : sharpnessModifier;
        } else if (power.type === 'Shot') {
            sharpnessModifier = { PRM: 1, PEM: 1 };
        }
        const damage = [
            'replaceME',
            power.attackName,
            power.rawMV,
            `${formatNumbers(~~(0.1 + power.rawNon * sharpnessModifier.PRM))} / ${formatNumbers(~~(0.1 + power.rawCrit * sharpnessModifier.PRM))}`,

            `${formatNumbers(~~(0.1 + power.eleNon * sharpnessModifier.PEM))} / ${formatNumbers(~~(0.1 + power.eleCrit * sharpnessModifier.PEM))}`,

            `${formatNumbers((~~(0.1 + power.rawNon * sharpnessModifier.PRM) + ~~(0.1 + power.eleNon * sharpnessModifier.PEM)) * (power.ticsPer + 1))} / ${formatNumbers(
        (~~(0.1 + power.rawCrit * sharpnessModifier.PRM) + ~~(0.1 + power.eleCrit * sharpnessModifier.PEM)) * (power.ticsPer + 1),
      )}`,

            formatNumbers(~~(0.1 + power.efr * sharpnessModifier.PRM)),

            formatNumbers(~~(0.1 + power.efe * sharpnessModifier.PEM)),

            formatNumbers((~~(0.1 + power.efe * sharpnessModifier.PEM) + ~~(0.1 + power.efr * sharpnessModifier.PRM)) * (power.ticsPer + 1)),
        ];

        meleeDamage.push(damage);
        // stats stores calculations to be used for the statsTable
        if (firstRun) {
            const ele = lower(power.eleType) === 'none' ? 0 : power.ele;
            const stats = [
                [
                    ['Stat'],
                    ['Raw'],
                    ['Affinity'],
                    [power.eleType]
                ],
                ['Base', ~~power.baseRaw, power.baseAff, power.baseEle],
                ['Total Attack', ~~power.raw, ~~(power.aff * 100), ~~ele],
                [
                    'Total Damage', ~~(power.raw * power.critBoost * power.PRM * power.enrage * power.augPRM * JSON.parse(Marksman.value)[0] * sharpnessModifier.PRM), ~~(power.aff * 100), ~~(ele * power.eleCritBoost * power.PEM * power.enrage * power.augPEM * sharpnessModifier.PEM),
                ],
                [
                    'Effective', ~~(power.raw * power.efrMulti * power.PRM * power.enrage * power.augEFR * JSON.parse(Marksman.value)[1] * sharpnessModifier.PRM), ~~(power.aff * 100), ~~(ele * power.efeMulti * power.PEM * power.augPEM * power.enrage * power.augEFR * sharpnessModifier.PEM),
                ],
            ];
            BuildDamageTable(stats, 'stats', e);
            firstRun = false;
        }
    });
    if ($('#dropWeaponType').val() === 'Gunlance') {
        GunlanceShelling(meleeDamage, comboDamage, power);
    } else {
        if ($('#dropWeaponType').val() === 'Bow') {
            comboDamage = BowComboDamage();
        }
        if (lastSharp === Sharpness.selectedIndex && !/dropWeapon|taWikiSetBuilder/.test(e.target.id) && window.event.target !== BowChargePlus && e.target === dropWeapon && !weaponType.value === cb) {
            if (/input|inputButton/.test(e.target.className)) {
                document.getElementById('c0').textContent = `${formatNumbers(comboDamage[0])}`;
                document.getElementById('d0').textContent = `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`;
                document.getElementById('e0').textContent = `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`;
                document.getElementById('f0').textContent = `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`;
                document.getElementById('g0').textContent = `${formatNumbers(comboDamage[7])}`;
                document.getElementById('h0').textContent = `${formatNumbers(comboDamage[8])}`;
                document.getElementById('i0').textContent = `${formatNumbers(comboDamage[9])}`;
            } else {
                meleeDamage.splice(0, 2, [
                    'replaceME',
                    'Combo Damage',
                    `${formatNumbers(comboDamage[0])}`,
                    `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`,
                    `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`,
                    `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`,
                    `${formatNumbers(comboDamage[7])}`,
                    `${formatNumbers(comboDamage[8])}`,
                    `${formatNumbers(comboDamage[9])}`,
                ]);
                let i = 0;
                $(meleeDamage).each(function() {
                    this.splice(0, 2);
                    $(this).each(function() {
                        Object.values($(dpsBody).children().children()).filter((x) => !/a|b/.test(x.className))[i].textContent = this;
                        ++i;
                    });
                });
            }
        } else {
            meleeDamage.splice(1, 1, [
                'replaceME',
                'Combo Damage',
                `${formatNumbers(comboDamage[0])}`,
                `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`,
                `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`,
                `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`,
                `${formatNumbers(comboDamage[7])}`,
                `${formatNumbers(comboDamage[8])}`,
                `${formatNumbers(comboDamage[9])}`,
            ]);
            BuildDamageTable(meleeDamage, 'dps', e);
        }
    }
}

function getRampageSkills(power) {
    // adds qurious augs
    power.baseRaw += $('output.attackAug').val() / 2 * 5;
    attackResult.value = `+ ${$('output.attackAug').val() / 2 * 5}`;
    power.aff += $('output.affinityAug').val() / 3 * 5;

    if (getWeapon().eleType !== 'None') { power.baseEle += $('output.elementalAug').val() * 3; }

    if (getWeapon().rampageSlots === 0) {
        // applies rampage any bonuses that effect base stats
        $(weaponRampage.children).each((_index, element) => {
            const rampageSkill = info.rampage['Rampage-Up Skill'][element.value];
            if (rampageSkill !== undefined) {
                for (let i = 0; i < Object.keys(rampageSkill).length; i++) {
                    const stat = Object.keys(rampageSkill)[i];
                    power[stat] += rampageSkill[stat];
                }
            }
        });
        // for skills that change the base element
        if (!/BowGun/.test($('#dropWeaponType').val())) {
            power.eleType = /Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/.test(weaponRampage.children[1].value) ?
                weaponRampage.children[1].value.match(/Fire|Water|Thunder|Ice|Dragon|Blase|Sleep|Poison|Para/)[0] :
                power.eleType;
        }
    }
    power.baseAff = power.aff;

    return {...power };
}

function AddDependantSkills() {
    if ($(weaponType).val() === 'InsectGlaive') {
        const attacks = Object.fromEntries(Object.entries(info.InsectGlaive.attacks).filter((skill) => !/Kinsect|Dust|Powder|Mark/.test(skill)));

        return attacks;
    }
    if ($(weaponType).val() === 'ChargeBlade') {
        const phialType = getWeapon().phialType === 'Impact Phial' ? 'Element Phial| Elemental Phial' : 'Impact Phial';
        const regexp = new RegExp(`${phialType}`);

        const attacks = Object.fromEntries(Object.entries(getAttacks()).filter((skill) => !regexp.test(skill)));

        return attacks;

        //  filters bow attacks for only the usable attacks
    }
    if ($('#dropWeaponType').val() === 'Bow') {
        // let attacksTemp = getAttacks();

        let usableKeys = '';
        const totalKeys = document.getElementById('BowChargePlus').selectedIndex === 1 && getWeapon().baseCharge < 4 ? getWeapon().baseCharge + 1 : getWeapon().baseCharge;
        $(getWeapon().bowShot).each((index, element) => {
            if (index < totalKeys) {
                usableKeys += `|Lv${element.match('[1-5]')[0]} ${element.match('Normal|Rapid|Pierce|Spread')[0]}`;
            }
        });
        const regex = new RegExp([usableKeys.slice(1)]);
        let ugh = Object.entries(getAttacks()).filter((attack) => regex.test(attack[0]));
        ugh = [].concat(Object.entries(getAttacks()).splice(0, 1), ugh);
        ugh = ugh.concat(Object.entries(getAttacks()).splice(136));
        return Object.fromEntries(ugh);
    }
    if ($(weaponType).val() === 'Gunlance') {
        return Object.fromEntries(Object.entries(getAttacks()).splice(0, 28));
    }
}

function GetSkills(power) {
    power.baseRaw += power.Draw === true ? +document.getElementById('PunishingDraw').value : 0;
    power.BR = 0;
    power.BRM = 1;
    power.PRM = 1;
    power.BEM = 1;
    power.BE = 0;
    power.PEM = 1;
    power.enrage = $('#dropEnraged').val() === 'Enraged' ? info.monster.enrage[document.getElementById('dropMonster').selectedIndex]['Player Dmg'] : 1;
    // For non ele Weapons
    power.eleHZV = lower(power.eleType) === undefined ||
        lower(power.eleType) === 'ignorehzv' ||
        lower(power.eleType) === 'non' ||
        lower(power.eleType) === 'none' ||
        Number.isNaN(power.baseEle) ||
        lower(power.eleType) === undefined ?
        0 :
        info.monster.hzv[dropMonster.value][dropHZ.selectedIndex][lower(power.eleType)];
    // removes HZV for attacks like stickies and phials
    power.rawHZV = /(None|ignore|Stick|Clust|IgnoreHZV)/.test(power.type) ? 100 : info.monster.hzv[dropMonster.value][dropHZ.selectedIndex][lower(power.type)];
    // applies Demon Ammo if selected and damage type is sever or blunt
    power.PRM *= $(DemonAmmo).hasClass('blue') && /(sever|blunt)/.test(power.type) ? 1.1 : 1;
    1;
    const skills = [];
    $('.skillButton:not(button#ProtectivePolish)').each(function() {
        if ($(this).hasClass('blue') && this.id !== 'CriticalFirePower' && this.id !== 'Qurious') {
            skills.push(JSON.parse(this.value));
        }
    });
    power.getSkills = [];
    switch (power.type) {
        case 'Sever':
        case 'Blunt':
        case 'sever':
        case 'blunt':
            power.skillType = 'Sever';
            break;
        case 'Shot':
            power.skillType = 'Gunner';
            break;
        case 'ignore':
        case 'IgnoreHZV':
        case 'None':
        case 'Stickies':
        case 'IMPAED':
        case 'IMPUAED':
            power.skillType = 'IMPAED';
            break;
        case 'Cluster':
            power.skillType = 'Clusters';
            break;
        case 'IgnoreHZVEle':
            power.skillType = 'EleAED';
            break;
        default:
            power.skillType = 'AllSkills';
            break;
    }
    // adds agitator to getSkills if enraged
    power.getSkills = [].concat(info.types[power.skillType]);
    if ($('#dropEnraged').val() === 'Enraged') {
        power.getSkills.push('Agitator');
        enrageDisplay.textContent = `${~~(info.monster.enrage[dropMonster.selectedIndex]['Player Dmg'] * 100)}%`;
    }

    // applies RF/Normal/Pierce/Spread up bonuses to bow and bowgun
    if (/Bow/.test($(weaponType).val())) {
        if (/Pierc/.test(power.attackName)) {
            power.getSkills.push('PierceUp');
        } else if (/Spread/.test(power.attackName)) {
            power.getSkills.push('SpreadUp');
        } else if (/Normal|Rapid/.test(power.attackName)) {
            power.getSkills.push('NormalRapidUp');
        }
        if (/RF+/.test(power.attackName)) {
            power.getSkills.push('RapidFireUp');
        }
        if (/Wyvern|Dragon Piercer/.test(power.attackName)) {
            power.getSkills.push('SpecialAmmoBoost');
        }
    }
    // power.getSkills.push('dropDereliction');
    if ($(weaponType).val() === 'LongSword' && !/Helm Breaker|Serene/.test(power.attackName)) {
        power.getSkills.push('spiritGauge');
    } else if ($(weaponType).val() === 'LongSword') {
        power.getSkills.push('Helmbreaker');
    }
    // applies GreatSwords Charge Level Bonus
    if ($(weaponType).val() === 'GreatSword' && /(?<=Lv)1|2|3/.test(power.attackName)) {
        power.rawMV *= Number(`1.${power.attackName.match('(?<=Lv)1|2|3')[0]}`);
        power.rawMV = power.rawMV.toFixed(1);
    }
    // applies ChargeBlade specific abilities
    if ($(weaponType).val() === 'ChargeBlade') {
        if (!/3rd|(?<!Midair |Axe: )UED|(?<!Charged )Sword(?!.*Shield)/.test(power.attackName)) {
            power.getSkills.push('savageAxe');
        }
        getWeapon().phialType === 'Impact Phial' ? power.getSkills.push('impShieldCharge') : power.getSkills.push('eleShieldCharge');
    }
    power.aff += weaponRampage0.value === 'Hellion Mode' && weaponType.value === 'DualBlades' ? 20 : 0;
    if (weaponType.value === 'Bow') {
        power.getSkills = power.getSkills.concat("UpperCrit", "HerculesDraw");
        if (/Stake/.test(power.attackName)) {
            power.getSkills = power.getSkills.filter(( /** @type {string} */ skill) => skill != 'BowCoating');
        }
    }

    power.getSkills = power.getSkills.filter(isUnique);
    $(power.getSkills).each(function() {
        if ($(`#${this}`).css('display') !== 'none') {
            skills.push(info.skills[this][document.getElementById(this).selectedIndex]);
        }
    });

    getStats(power, skills);
    // applies Water Blight if selected appropriate to the hzv
    power.rawHZV = $(WaterBlight).hasClass('blue') ? Math.min(100, ~~(Math.max(power.rawHZV, power.rawHZV * 0.63 + 22.2) + 3)) : power.rawHZV;
    if (weaponRampage0.value === 'Kushala Daora Soul') {
        power.aff += 15;
    }
    // adds Weakness Exploit
    power.aff = power.rawHZV >= 45 ? power.aff + JSON.parse($('#WeaknessExploit').val()) : power.aff;
    power.aff = Math.min(power.aff, 100) / 100;

    return {...power };
}

function UpdateComboTracker() {
    if (!Number.isNaN(+window.event.target.id) && window.event.target.id !== '0') {
        // if value entered in the e.target combo input > amount stored in comboTracker [] adds attack id to the end of the comboTracker until they are ===
        let difference = $('.inputs')[window.event.target.id].value - TimesUsed(window.event.target.id);
        while (difference > 0) {
            comboTracker.push(window.event.target.id);
            --difference;
        }
        // if value entered in the e.target combo input < amount stored in comboTracker [] removes the last instance of this attack id from the comboTracker until they are ===
        while (difference < 0) {
            comboTracker.splice(comboTracker.lastIndexOf(window.event.target.id), 1);
            ++difference;
        }
    }
}

function UpdateComboDisplay() {
    $('.comboHits').remove();
    let comboHit;
    $(comboTracker).each((_index, element) => {
        comboHit = document.createElement('output');
        comboHit.className = 'comboHits';
        comboHit.textContent = $(`td#b${[element]}>output`).text();
        $(comboCountDisplay).after(comboHit);
    });
}

// finds HitsOfSharpness current sharpness as well as what combo hits were used how many times per color
function TotalHitsOfSharpUsed(power) {
    power.listOfEachAttack = [].concat(comboTracker);
    let totalHitsOfSharpnessUsed = 0;
    let increase = [];
    const total = {};
    power.hitsOfSharpness = [];
    power.hitsOfSharpness.purple = power.sharpness.purple;
    power.hitsOfSharpness.white = power.sharpness.white;
    power.hitsOfSharpness.blue = power.sharpness.blue;
    power.hitsOfSharpness.green = power.sharpness.green;
    power.hitsOfSharpness.yellow = power.sharpness.yellow;
    power.hitsOfSharpness.orange = power.sharpness.orange;
    power.hitsOfSharpness.red = power.sharpness.red;

    // gets handicraft.selectedIndex & figures out which color power.handicraft actually applies to then add the extra points appropriately.
    if (Handicraft.selectedIndex > 0) {
        if (power.hitsOfSharpness.purple > 0) {
            increase = ['purple'];
        } else if (power.hitsOfSharpness.white > 0) {
            increase = ['white', 'purple'];
        } else if (power.hitsOfSharpness.blue > 0) {
            increase = ['blue', 'white', 'purple'];
        } else if (power.hitsOfSharpness.green > 0) {
            increase = ['green', 'blue', 'white', 'purple'];
        } else if (power.hitsOfSharpness.yellow > 0) {
            increase = ['yellow', 'green', 'blue', 'white'];
        }
        let pointsOfHandicraft = Handicraft.selectedIndex;
        $(power.handicraft).each((index, element) => {
            while (element > 0 && pointsOfHandicraft > 0) {
                power.hitsOfSharpness[increase[index]] += 10;
                --pointsOfHandicraft;
                element -= 10;
            }
        });
    }
    const razorSharp = info.skills.RazorSharp[RazorSharp.selectedIndex].Sharp;
    let MT = info.skills.MastersTouch[MastersTouch.selectedIndex].Sharp;
    MT *= power.aff;
    // applies the extra hits of sharpness from the Masters Touch skill;
    const mTBonus = power.aff > 0 && MastersTouch.selectedIndex > 0 ? sharpnessReduction(MT) * sharpnessReduction(razorSharp) : sharpnessReduction(razorSharp);
    total.purple = ~~(mTBonus * power.hitsOfSharpness.purple);
    total.white = ~~(mTBonus * power.hitsOfSharpness.white);
    total.blue = ~~(mTBonus * power.hitsOfSharpness.blue);
    total.green = ~~(mTBonus * power.hitsOfSharpness.green);
    total.yellow = ~~(mTBonus * power.hitsOfSharpness.yellow);
    total.orange = ~~(mTBonus * power.hitsOfSharpness.orange);
    total.red = ~~(mTBonus * power.hitsOfSharpness.red);
    if (comboTracker !== ([] || [null])) {
        let comboMulti = $('.inputComboRepeat').val();
        // for each pont in the comboMultiplier input, adds another comboTracker [] to the listOfEachAttack
        while (comboMulti > 1) {
            power.listOfEachAttack = power.listOfEachAttack.concat(comboTracker);
            --comboMulti;
        }
        power.comboHitsPerColor = [];
        power.comboHitsPerColor.purple = [];
        power.comboHitsPerColor.white = [];
        power.comboHitsPerColor.blue = [];
        power.comboHitsPerColor.green = [];
        power.comboHitsPerColor.yellow = [];
        power.comboHitsPerColor.orange = [];
        power.comboHitsPerColor.red = [];

        power.listOfEachAttack.forEach((eachAttack) => {
            const attackKeys = Object.keys(power.attacks)[eachAttack];
            if ($(ProtectivePolish).hasClass('gray')) {
                if ($('#dropWeaponType').val() !== 'Gunlance' || ($('#dropWeaponType').val() === 'Gunlance' && eachAttack < 28)) {
                    for (let i = 0; i < power.ticsPer + 1; i++) {
                        // applies DualBlades Sharpness Reduction
                        if ($(weaponType).val() === 'DualBlades') {
                            totalHitsOfSharpnessUsed += getAttacks()[attackKeys].hitsOfSharp / 3;
                        } else {
                            totalHitsOfSharpnessUsed += getAttacks()[attackKeys].hitsOfSharp;
                        }
                    }
                } else if ($('#dropWeaponType').val() === 'Gunlance' && eachAttack > 27) {
                    ++totalHitsOfSharpnessUsed;
                }
            }
            let totalHits = 0;
            if (totalHitsOfSharpnessUsed <= (totalHits += total.purple) && power.hitsOfSharpness.purple > 0) {
                power.comboHitsPerColor.purple.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.blue) && power.hitsOfSharpness.white > 0) {
                power.comboHitsPerColor.white.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.blue) && power.hitsOfSharpness.blue > 0) {
                power.comboHitsPerColor.blue.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.green) && power.hitsOfSharpness.green > 0) {
                power.comboHitsPerColor.green.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.yellow) && power.hitsOfSharpness.yellow > 0) {
                power.comboHitsPerColor.yellow.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.orange)) {
                power.comboHitsPerColor.orange.push(eachAttack);
            } else if (totalHitsOfSharpnessUsed <= (totalHits += total.red)) {
                power.comboHitsPerColor.red.push(eachAttack);
            }
        });
        let hits = totalHitsOfSharpnessUsed;
        [power.hitsOfSharpness.purple, hits] = hits - total.purple > 0 ? [0, hits - total.purple] : [total.purple - hits, 0];
        [power.hitsOfSharpness.white, hits] = hits - total.white > 0 ? [0, hits - total.white] : [total.white - hits, 0];
        [power.hitsOfSharpness.blue, hits] = hits > 0 && hits - total.blue > 0 ? [0, hits - total.blue] : [total.blue - hits, 0];
        [power.hitsOfSharpness.green, hits] = hits > 0 && hits - total.green > 0 ? [0, hits - total.green] : [total.green - hits, 0];
        [power.hitsOfSharpness.yellow, hits] = hits > 0 && hits - total.yellow > 0 ? [0, hits - total.yellow] : [total.yellow - hits, 0];
        [power.hitsOfSharpness.orange, hits] = hits > 0 && hits - total.orange > 0 ? [0, hits - total.orange] : [total.orange - hits, 0];
        [power.hitsOfSharpness.red, hits] = hits > 0 && hits - total.red > 0 ? [0, hits - total.red] : [total.red - hits, 0];
    }
    const width = (total.purple + total.white + total.blue + total.green + total.yellow + total.orange + total.red);
    const finalWidth = Math.min(width, $(section2).width() * 0.95);

    $('#white').parent().css('width', `${finalWidth}px`);
    purple.style.width = `${(power.hitsOfSharpness.purple / width) * finalWidth}px`;
    white.style.width = `${(power.hitsOfSharpness.white / width) * finalWidth}px`;
    blue.style.width = `${(power.hitsOfSharpness.blue / width) * finalWidth}px`;
    green.style.width = `${(power.hitsOfSharpness.green / width) * finalWidth}px`;
    yellow.style.width = `${(power.hitsOfSharpness.yellow / width) * finalWidth}px`;
    orange.style.width = `${(power.hitsOfSharpness.orange / width) * finalWidth}px`;
    red.style.width = `${(power.hitsOfSharpness.red / width) * finalWidth}px`;

    purple.innerHTML = power.hitsOfSharpness.purple > 0 ? ~~(power.hitsOfSharpness.purple + 0.7) : '';
    white.innerHTML = power.hitsOfSharpness.white > 0 ? ~~(power.hitsOfSharpness.white + 0.7) : '';
    blue.innerHTML = power.hitsOfSharpness.blue > 0 ? ~~(power.hitsOfSharpness.blue + 0.7) : '';
    green.innerHTML = power.hitsOfSharpness.green > 0 ? ~~(power.hitsOfSharpness.green + 0.7) : '';
    yellow.innerHTML = power.hitsOfSharpness.yellow > 0 ? ~~(power.hitsOfSharpness.yellow + 0.7) : '';
    orange.innerHTML = power.hitsOfSharpness.orange > 0 ? ~~(power.hitsOfSharpness.orange + 0.7) : '';
    red.innerHTML = power.hitsOfSharpness.red > 0 ? ~~(power.hitsOfSharpness.red + 0.7) : '';

    if (power.hitsOfSharpness.purple > 0) {
        Sharpness.selectedIndex = 7;
    } else if (power.hitsOfSharpness.white > 0) {
        Sharpness.selectedIndex = 6;
    } else if (power.hitsOfSharpness.blue > 0) {
        Sharpness.selectedIndex = 5;
    } else if (power.hitsOfSharpness.green > 0) {
        Sharpness.selectedIndex = 4;
    } else if (power.hitsOfSharpness.yellow > 0) {
        Sharpness.selectedIndex = 3;
    } else if (power.hitsOfSharpness.orange > 0) {
        Sharpness.selectedIndex = 2;
    } else if (power.hitsOfSharpness.red >= 0) {
        Sharpness.selectedIndex = 1;
    }

    return {...power };
}

function GetRemainingSkills(power) {
    [power.augEFR, power.augPRM, power.augPEM] = [1, 1, 1];

    /*
     * If an anti species type skill is selected it gets the list of monsters applicable and checks
     *if the selected monster is in the list.If true, it applies the skill.
     */
    if (
        getWeapon().rampageSlots === 0 &&
        Object.prototype.hasOwnProperty.call(info.types, $('#weaponRampage0').val()) &&
        Object.prototype.hasOwnProperty.call(info.types[$('#weaponRampage0').val()].Monsters, $('#dropMonster').val())
    ) {
        [power.augPRM, power.augPEM] = info.types[$('#weaponRampage0').val()];
    } else if (
        dropMonster.value !== 'Toadversary' &&
        getWeapon().rampageSlots > 0 &&
        Object.entries(info.types[dropMonster.value]).filter((isSpecies) => isSpecies[1] && weaponRampage0.value.match(isSpecies[0])).length > 0
    ) {
        power.PRM *= 1.05;
        power.PEM *= 1.05;
    }
    if (/blight Exploit/.test(weaponRampage0.value)) {
        power.PRM *= 1.1;
        power.PEM *= 1.1;
    }
    if (weaponRampage0.value === 'Magnamalo Soul') {
        power.BR += 12;
    }
    if (/BowGun/.test(weaponType.value)) {
        if (dropWeaponType.value === lbg && /Pierce|Spread|Normal/.test(power.attackName) && $(CriticalFirePower).hasClass('blue')) {
            if (/Normal/.test(power.attackName)) {
                power.PRM *= 1.3;
            } else if (/Spread/.test(power.attackName)) {
                power.PRM *= 1.2;
            } else if (/Pierce/.test(power.attackName)) {
                power.PRM *= 1.1;
            }
        }
        // Elemental Reload
        power.BEM *= JSON.parse(BarrelId.value).Element;
        // Power Barrel
        if ((TuneUp.selectedIndex === 0 || TuneUp.selectedIndex === 1) && BarrelId.options[BarrelId.selectedIndex].text === 'Power') {
            power.baseRaw = ~~(power.baseRaw * 1.125);
        } else if (TuneUp.selectedIndex === 2 && BarrelId.options[BarrelId.selectedIndex].text === 'Power') {
            power.baseRaw = ~~(power.baseRaw * 1.15);
        }
        if ((TuneUp.selectedIndex === 0 || TuneUp.selectedIndex === 1) && BarrelId.options[BarrelId.selectedIndex].text === 'Long') {
            power.baseRaw = ~~(power.baseRaw * 1.05);
        } else if (TuneUp.selectedIndex === 2 && BarrelId.options[BarrelId.selectedIndex].text === 'Long') {
            power.baseRaw = ~~(power.baseRaw * 1.075);
        }
        if (/(?<!snipe.*)explosion/.test(power.attackName)) {
            power.augEFR *= JSON.parse(Bombardier.value)[lower(power.attackName).match(/sticky|wyvern/)[0]][1];
            power.augPRM *= JSON.parse($(Bombardier).val())[lower(power.attackName).match(/sticky|wyvern/)[0]][0];
        }
    }
    if (weaponType.value === cb && power.skillType === 'Stickies' && power.phialType === 'Impact Phial') {
        power.augEFR *= JSON.parse(Bombardier.value)[1];
        power.augPRM *= JSON.parse(Bombardier.value)[0];

        if (weaponType.value === sa && /Sword|ZSD|ED/.test(power.attackName) && power.phialType === 'Impact Phial') {
            power.BRM *= 1.15;
        }
        if (weaponType.value === sa && /Sword|Elemental|ED/.test(power.attackName) && power.phialType === 'Elemental Phial') {
            power.BEM *= 1.45;
        }
    } // If elemental exploit is selected && power.eleHZV >= 25 applies elemental exploit
    if (power.eleType !== 'None') {
        power.PEM *= getWeapon().rampageSlots === 0 && $('#weaponRampage0').val() === 'Elemental Exploit' && getHZ()[lower(power.eleType)] >= 25 ?
            1.3 : 1;
        power.PEM *= power.PEM *= getWeapon().rampageSlots !== 0 && $('#weaponRampage0').val() == 'Element Exploit' && getHZ()[lower(power.eleType)] >= 25 && lower(power.eleType) !== 'none' ?
            1.15 :
            1;
        power.PEM *= getHZ()[lower(power.eleType)] >= 20 && lower(power.eleType) !== 'none' ? info.skills.ElementalExploit[ElementalExploit.selectedIndex] : 1;
    }
    power.augPEM = $('#weaponRampage0').val() === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : power.augPEM;
    // applies Dulling Strike to Base raw depending on sharpness and if selected
    [power.augEFR, power.augPRM] = $('#weaponRampage0').val() === 'Dulling Strike' && Sharpness.selectedIndex < 5 ? [1.02, 1.2] : [power.augEFR, power.augPRM];
    // applies Bludgeoner to Base raw depending on sharpness and selectedIndex

    if (Sharpness.selectedIndex > 0) {
        power.BRM *= Bludgeoner.selectedIndex === 1 && Sharpness.selectedIndex < 4 ? [1.05] : [1];
        power.BRM *= Bludgeoner.selectedIndex === 2 && Sharpness.selectedIndex < 4 ? [1.1] : [1];
        power.BRM *= Bludgeoner.selectedIndex === 3 && Sharpness.selectedIndex < 5 ? [1.1] : [1];
    }
    // applies sharpnessModifier to sever and blunt type attacks that use at least one hit of sharpness. This makes sure attacks like tackle or Bow skills don't get a sharpness modifier.

    const sharpnessModifier = [];
    [sharpnessModifier.PRM, sharpnessModifier.PEM] = power.noSharpMod === false && /sever|blunt/.test(lower(power.type)) ? [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM] : [1, 1];
    // adds minds eye
    power.PRM *= ~~(0.1 + 25 / sharpnessModifier.PRM) >= info.monster.hzv[$('#dropMonster').val()][dropHZ.selectedIndex][power.type] ?
        JSON.parse(document.getElementById(['MindsEye']).value).PRM :
        1;
    // if can crit adds crit boost
    power.critBoost = power.Crit === true ? info.skills.CriticalBoost[CriticalBoost.selectedIndex].PRM : 1;

    power.efrMulti = 1 + (power.critBoost - 1) * power.aff;

    /*
     * Brutal Strike
     * Converts -Aff to a positive then * chance to proc * dmg modifier then
     * adds the -dps to the +dps gain to find overall dps difference
     */

    if (getWeapon().rampageSlots === 0 && $('#weaponRampage0').val() === 'Brutal Strike' && power.aff < 0) {
        power.efrMulti = 1 + power.aff * -1 * 0.2 * 1.5 - power.aff * -1 * 0.8 * 0.75;
        power.critBoost = 1.5;
    } else if (getWeapon().rampageSlots !== 0 && $('#weaponRampage0').val() === 'Brutal Strike' && power.aff < 0) {
        power.efrMulti = 1 + power.aff * -1 * 0.25 * 2 - power.aff * -1 * 0.75 * 0.75;
        power.critBoost = 1.5;
    }
    // if can crit adds crit element
    power.eleCritBoost = info.skills.CriticalElement[CriticalElement.selectedIndex].PEM;

    return {...power };
}

function DamageCalculations(power) {
    if (power.Crit === false) {
        [power.critBoost, power.eleCritBoost] = [1, 1];
    }
    if (power.Raw === false) {
        [power.raw, power.rawNon, power.efr, power.rawCrit] = [0, 0, 0, 0];
    } else {
        power.raw = Math.min(power.baseRaw * power.BRM + power.BR, 2600);
        const rawFormula = (power.raw * power.PRM * power.rawHZV * power.enrage * power.rawMV) / 10000;
        power.rawNon = rawFormula * power.augPRM * JSON.parse(Marksman.value)[0];
        power.efr = rawFormula * power.efrMulti * power.augEFR * JSON.parse(Marksman.value)[1];
        power.rawCrit = rawFormula * power.critBoost * power.augPRM * JSON.parse(Marksman.value)[0];
    }
    if (power.Ele === false || lower(power.eleType) === 'none') {
        [power.ele, power.eleNon, power.efe, power.eleCrit] = [0, 0, 0, 0];
    } else {
        power.eleAmmo = /BowGun/.test($('#dropWeaponType').val()) && /(Ice|Fire|Water|Dragon|Thunder)/.test(power.eleType) ? 1 + power.raw / 100 : 1;
        power.ele = Math.min(power.baseEle * power.BEM + power.BE, 365) * power.eleAmmo;
        power.efeMulti = 1 + (power.eleCritBoost - 1) * power.aff;
        const eleFormula = power.NoEleBuff === true ? power.baseEle : power.ele * power.PEM * (power.eleHZV / 100) * power.enrage * power.eleMV * power.augPEM;

        power.eleNon = power.NoEleBuff === true ? power.baseEle : eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
        power.efe = power.NoEleBuff === true ?
            power.baseEle :
            eleFormula * power.efeMulti > 0 && eleFormula * power.efeMulti < 1 ?
            1 :
            ~~(0.1 + eleFormula * power.efeMulti);
        power.eleCrit = power.NoEleBuff === true ?
            power.baseEle :
            eleFormula * power.eleCritBoost > 0 && eleFormula * power.eleCritBoost < 1 ?
            1 :
            ~~(0.1 + eleFormula * power.eleCritBoost);
    }

    return {...power };
}

function BowComboDamage() {
    /*
     * for each combo input > 0 takes the damage listed for that skill * the number entered into the input field
     * += for every skill used then updates the Combo Damage field
     */
    const tableCell = ['c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const comboDamage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $('.inputs').each((index, input) => {
                let eachAttacksDamage = [];
                if (input.value > 0) {
                    $(tableCell).each((_index, letter) => {
                                eachAttacksDamage = eachAttacksDamage.concat(`${$(`#${[letter + input.id]}`).text()}`.match(/\d+/g));
        });
        eachAttacksDamage = eachAttacksDamage.map((damage) => +damage * input.value * $('.inputComboRepeat ').val());
        $(eachAttacksDamage).each((index) => {
          comboDamage[index] += +eachAttacksDamage[index];
        });
      }
    });

    return comboDamage;
  }

  function sharpnessReduction(reduction) {
    let total = 0;
    let hits = 1;
    while (hits >= 0.0001) {
      total += hits;
      hits *= reduction;
    }
    return total / 1 + 0.001;
  }
  function GunlanceShelling(currentDamage,comboDamage,power) {
    const regex = new RegExp(`${getWeapon().shellingType} Lv${getWeapon().shellingLevel}`);
    let Raw = 1;
    let EFR = 1;
    $(Object.entries(getAttacks()).filter((attack) => regex.test(attack))).each(function (index) {
      Raw = ~~(this[1].rawMV * info.skills.Bombardier[Bombardier.selectedIndex][0] * info.skills.Artillery[Artillery.selectedIndex].BRM);
      EFR = ~~(this[1].rawMV * info.skills.Bombardier[Bombardier.selectedIndex][1] * info.skills.Artillery[Artillery.selectedIndex].BRM);
      const final = [
        'replaceME',
        this[0],
        0,
        `${Raw} / ${Raw}`,
        `${this[1].baseEle} / ${this[1].baseEle}`,
        `${(Raw + this[1].baseEle) * (this[1].ticsPer + 1)} / ${(Raw + this[1].baseEle) * (this[1].ticsPer + 1)}`,
        EFR,
        this[1].baseEle,
        (EFR + this[1].baseEle) * (this[1].ticsPer + 1),
      ];
      currentDamage.push(final);
      comboDamage[0] += 0;
      comboDamage[1] += Raw * TimesUsed(index + 28);
      comboDamage[2] += Raw * TimesUsed(index + 28);
      comboDamage[3] += this[1].baseEle * TimesUsed(index + 28);
      comboDamage[4] += this[1].baseEle * TimesUsed(index + 28);
      comboDamage[5] += (Raw + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
      comboDamage[6] += (Raw + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
      comboDamage[7] += EFR * TimesUsed(index + 28);
      comboDamage[8] += this[1].baseEle * TimesUsed(index + 28);
      comboDamage[9] += (EFR + this[1].baseEle) * (power.ticsPer + 1) * TimesUsed(index + 28);
    });
    if (!/Inputs|inputButton/.test(window.event.target.className)) {
      BuildDamageTable(currentDamage,'dps', e);
    }
    c0.innerHTML = `${formatNumbers(comboDamage[0])}`;
    d0.innerHTML = `${formatNumbers(comboDamage[1])} / ${formatNumbers(comboDamage[2])}`;
    e0.innerHTML = `${formatNumbers(comboDamage[3])} / ${formatNumbers(comboDamage[4])}`;
    f0.innerHTML = `${formatNumbers(comboDamage[5])} / ${formatNumbers(comboDamage[6])}`;
    g0.innerHTML = `${formatNumbers(comboDamage[7])}`;
    h0.innerHTML = `${formatNumbers(comboDamage[8])}`;
    i0.innerHTML = `${formatNumbers(comboDamage[9])}`;
  }

  function BuildDamageTable(myDamage,id, e) {
    const currentAmmoTableStyle = ammoTable.style.display;
    const currentDamageTableStyle = dpsTable.style.display;
    const inputs = /gray/.test(filterCombo.className) ? document.querySelectorAll('.a') : document.querySelectorAll('.a:not(.gray)');
    let k = 0;
    const myHeader = document.querySelector(`#${id}Head`);
    const myBody = document.querySelector(`#${id}Body`);
    const table = document.createElement('table');
    const tHead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const tBody = document.createElement('tbody');

    const myHeaders = myDamage.splice(0,1);
    myHeaders[0].forEach((headerText) => {
      const header = document.createElement('th');
      const textNode = document.createTextNode(headerText);

      header.appendChild(textNode);
      headerRow.appendChild(header);
    });

    tHead.appendChild(headerRow);
    myHeader.replaceWith(tHead);
    myDamage.forEach((attack) => {
      const row = document.createElement('tr');

      Object.values(attack).forEach((text) => {
        if (text === 'replaceME') {
          if (
            $(previousWeaponType).val() === $(weaponType).val()
            && inputs.length > 0
            && (window.event.target===dropWeapon &&weaponType.value!==cb||window.event.target!==dropWeapon)
            && window.event.target.id !== 'BowChargePlus'
            && (($(weaponType).val() === 'Bow' && previousWeapon.value === dropWeapon.value) || $(weaponType).val() !== 'Bow')
          ) {
            row.appendChild(inputs[k]);
            ++k;
          } else {
            const cell = document.createElement('td');
            const adjuster = document.createElement('input');

            adjuster.setAttribute('type','Number');
            adjuster.setAttribute('class',`Combo skill ${k}`);
            adjuster.setAttribute('Max',20);
            if ($(weaponType).val() === 'Bow' && previousWeapon.value !== dropWeapon.value) {
              comboTracker = [];
              UpdateComboDisplay();
            }
            if (k === 0) {
              adjuster.setAttribute('id','inputComboRepeat');
              adjuster.setAttribute('Min',1);
              adjuster.setAttribute('value',1);
              adjuster.setAttribute('class','inputComboRepeat hitsOfSharpInputs inputs');
            } else {
              adjuster.setAttribute('id',k);
              adjuster.setAttribute('class','inputs hitsOfSharpInputs');
              adjuster.setAttribute('Min',0);
              adjuster.setAttribute('value',0);
            }
            ++k;
            cell.appendChild(adjuster);
            row.appendChild(cell);
          }
        } else {
          const cell = document.createElement('td');
          const textNode = document.createTextNode(text);

          cell.appendChild(textNode);
          row.appendChild(cell);
        }
      });
      tBody.appendChild(row);
      myBody.replaceWith(tBody);
    });
    table.setAttribute('id',`${id}Table`);
    tHead.setAttribute('id',`${id}Head`);
    tBody.setAttribute('id',`${id}Body`);
    tBody.className = /(BowGun)/.test($('#dropWeaponType').val()) ? 'rangedTable' : 'meleeTable';
    damageTable.className = /(BowGun)/.test($('#dropWeaponType').val()) ? 'rangedContainer' : 'meleeContainer';

    ammoTable.style.display = currentAmmoTableStyle;
    dpsTable.style.display = currentDamageTableStyle;

    if (id !== 'stats' && id !== 'ammo') {
      const [len,...column] = /BowGun/.test($('#dropWeaponType').val())
        ? [k,'a','b','c','d','e','f','g','h','i','j']
        : [k,'a','b','c','d','e','f','g','h','i'];

      if (/BowGun/.test($(weaponType).val()) && !/BowGun/.test($(previousWeaponType).val())) {
        $('#comboCountContainer').hide();
      } else if (!/BowGun/.test($(weaponType).val()) && /BowGun/.test($(previousWeaponType).val())) {
        $('#comboCountContainer').show();
      }
      $('#previousWeapon').val($('#dropWeapon').val());
      $('#previousWeaponType').val($('#dropWeaponType').val());
      for (let i = 0; i < len; ++i) {
        let j = 0;
        column.forEach((letter) => {
          $(`#${id}Body`)[0].children[i].children[j].id = letter + i;
          $(`#${id}Body`)[0].children[i].children[j].className = `${letter} ${i}`;
          ++j;
        });
      }

      if (!/BowGun/.test($(weaponType).val()) && !/inputButton/.test(window.event.target.className)) {
        $(`tbody#${id}Body>tr>td:nth-child(2)`).each(function (index,element) {
          const cell = document.createElement('td');
          cell.innerHTML = `<button type="button" aria-pressed="false" id="${index}" onclick="DecreaseComboCount()" class="inputButton dec"
				>&#8681</button><button type="button" aria-pressed="false" id="${index}" onclick="IncreaseComboCount()" class="inputButton inc">&#8679</button><output class="label">${element.textContent}</output>`;
          cell.id = `b${index}`;
          this.replaceWith(cell);
          $(cell).addClass(`b ${index} inputContainer`);
        });
      }
      if ($(window).width() > 850) {
        setHeight();
      }
      $('#weaponRampage0').on('change',function (e) {
        DataCompile(e)
      })
      $('.inputs').on('change',(e) => {
        DataCompile(e);
      });
    }
    if (/blue/.test(filterCombo.className)) {
      $('.a').each((index) => {
        if ($(`.${index}`)[0].style.display === 'none') {
          $(`.${index}`).hide();
        }
      });
    }
    const tableClass = !/BowGun/.test(weaponType.value) ? 'tableRowMelee' : 'tableRowRanged';
    Object.values(dpsTable.children).forEach((ele) => {
      Object.values(ele.children).forEach((row) => {
        $(row).addClass(tableClass);
      });
    });
    Object.values(damageTable.children[0].children[1].children).forEach((row) => {
      $(row).children().addClass('cell');
    });
  }
  function MonChart() {
    if (dropQuest.value !== '') {
      let mon = [];
      const type = /Bow/.test(weaponType.value) ? 'shot' : weaponType.value[0] === 'H' ? 'blunt' : 'sever';
      const headers = [`Spawn Area ${info.quest[dropQuest.value].spawn}`,'Sever','Blunt','Shot','Fire','Water','Thunder','Ice','Dragon'];
      const table = document.createElement('table');
      const myTable = document.querySelector('#monTable');
      const headerRow = document.createElement('tr');

      headers.forEach((headerText) => {
        const header = document.createElement('th');
        const textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
      });

      table.appendChild(headerRow);
      mon = Object.entries(info.monster.hzv[dropMonster.value]).sort((b,a) => {
        if (a[1][type] === b[1][type] && document.querySelector('#statsHead > tr > th:nth-child(4)').textContent !== 'none') {
          return (
            a[1][lower(document.querySelector('#statsHead > tr > th:nth-child(4)').textContent)]
            - b[1][lower(document.querySelector('#statsHead > tr > th:nth-child(4)').textContent)]
          );
        }
        return a[1][type] - b[1][type];
      });
      mon.forEach((element) => {
        const row = document.createElement('tr');
        const HZV = [`${element[1].part} ${element[1].state}`].concat(Object.values(element[1]).splice(3,8));

        for (let j = 0; j < 9; ++j) {
          const cell = document.createElement('td');
          // adds demon ammo and water blight to displayed HZV
          if (j !== 0) {
            HZV[j] = $(WaterBlight).hasClass('blue') && /1|2|3/.test(j) ? Math.min(100,~~(Math.max(HZV[j],HZV[j] * 0.63 + 22.2) + 3)) : HZV[j];

            if (HZV[j] < 14) {
              cell.setAttribute('class','F');
            } else if (HZV[j] < 15) {
              cell.setAttribute('class','C');
            } else if (HZV[j] < 45) {
              cell.setAttribute('class','B');
            } else if (HZV[j] < 65) {
              cell.setAttribute('class','A');
            } else if (HZV[j] >= 65) {
              cell.setAttribute('class','S');
            }
            HZV[j] = ~~HZV[j];
          }
          const textNode = document.createTextNode(HZV[j]);
          cell.appendChild(textNode);
          row.appendChild(cell);
        }
        table.appendChild(row);
      });
      table.setAttribute('id','monTable');
      myTable.replaceWith(table);
      Object.values(monTableContainer.children).forEach((ele) => {
        Object.values(ele.children).forEach((row) => {
          row.className = 'tableRow';
        });
      });
    }
  }
  $([dropWeapon,weaponType]).on('change',(_e) => {
    if (weaponType.value === 'Bow') {
      $(BowCoating).empty();
      const thisArr = [];
      getWeapon().coatings.forEach((thisCoating) => {
        const thisOption = document.createElement('option');
        thisOption.textContent = thisCoating;
        $(BowCoating).append(thisOption);
        thisArr.push(info.skills[`${thisCoating}`]);
      });
      info.skills.BowCoating = thisArr;
    }
  });
  function classChange() {
    if (Object.values(check).every((keyCard) => keyCard)) {
      if (previousWeaponType.textContent !== '') {
        ComboReset();
      }
      let ugh = [];
      // for Chain Crit
      if (weaponType.value === db) {
        ugh = info.skills.ChainCritDualBlades;
      } else if (weaponType.value === bow) {
        ugh = info.skills.ChainCritBow;
      } else if (weaponType.value === lbg || weaponType.value === hbg) {
        ugh = info.skills.ChainCritBowGun;
      } else {
        ugh = info.skills.ChainCritStandard;
      }
      info.skills.ChainCrit = ugh;

      let bomb = [];
      if (weaponType.value === cb) {
        bomb = [[1,1],[1.1,1.15],[1.15,1.15],[1.2,1.16],[1.25,1.17]];
      } else if (weaponType.value === gl) {
        bomb = [[1,1],[1.05,1.05],[1.1,1.1],[1.15,1.11],[1.2,1.12]];
      } else if (weaponType.value === lbg || weaponType.value === hbg) {
        bomb = [
          {"wyvern":[1,1,1],"sticky":[1,1,1]},
          {"wyvern":[1.1,1.1,1],"sticky":[1.1,1.1,1]},
          {"wyvern":[1.15,1.15,1],"sticky":[1.1,1.1,1]},
          {"wyvern":[1.20,1.16,1],"sticky":[1.2,1.16,1]},
          {"wyvern":[1.25,1.17,1.1],"sticky":[1.25,1.17,1.1]},
        ];
      }
      info.skills.Bombardier = bomb;
      $(bomb).each(function (index) {
        Bombardier[index].value = this;
      });

      $('.classSpecific').attr('selectedIndex',0);
      $('.classSpecific').hide();
      $('.classSpecific').parent().hide();
      weaponId.innerHTML = '';
      weaponId.innerHTML = $('#dropWeaponType').val();
      $(`.${$(weaponType).val()}`)
        .parent()
        .show();
      $(`.${$(weaponType).val()}`).show();

      if (/Bow/.test($(weaponType).val())) {
        $('.Shot').parent().show();
        $('.Shot').show();

        // getWeapon()['coatings'].forEach((coat, index)=>{
        // if(coat){
        // info.skills.BowCoating.push(info.skills[['CloseRange','Power','Poison','Para','Sleep','Blast','Exhaust'][index])
        // }
        // })
        // if=== 1?getWeapon().coatings.push(coat):enums[i]===2?getWeapon().coatings.push('Poison+'):enums[i]===3?getWeapon().coatings.push('Para+'):enums[i]===4?getWeapon().coatings.push('Sleep+'):getWeapon().coatings

        $(ammoTable).hide();
        UniqueColumnsDisplay();
      } else {
        MeleeElements();
        UniqueColumnsDisplay();
      }
    }
  }
  function MeleeElements() {
    $('.melee').parent().show();
    $('.melee').show();
    if ($('#dropWeaponType').val() === 'ChargeBlade') {
      if (getWeapon().phialType === 'Impact Phial') {
        impShieldCharge.parentNode.style = "display:''";
        eleShieldCharge.parentNode.style = 'display:none';
        eleShieldCharge.selectedIndex = 0;
      } else if (getWeapon().phialType === 'Element Phial') {
        impShieldCharge.parentNode.style = 'display:none';
        impShieldCharge.selectedIndex = 0;
        eleShieldCharge.parentNode.style = "display:''";
      }
    }
  }
  $(window).on('keypress',(e) => {
    keyDown = e.originalEvent.key === '-' ? ++keyDown : 0;
    if (keyDown === 3) {
      ResetSkills();
      DataCompile();
      keyDown = 0;
    }
  });
  function UniqueColumnsDisplay() {
    $('#dango')[0].style = Bombardier.style.display === 'none' ? 'grid-template-columns:repeat(2, 1fr); grid-area: 10/1/12/3;' : 'grid-template-columns:repeat(3, 1fr); grid-area: 10/1/12/4;';
    // forButtons.style = /BowGun/.test($(weaponType).val()) ? 'grid-template-columns: repeat(10. 1fr)' : 'grid-template-columns: repeat(6, 1fr)';
  }
  function ResetSkills(element = '.skill') {
    $('.skillButton').each(function () {
      if ($(this).hasClass('blue')) {
        $(this).toggleClass('blue gray');
      }
    });
    for (let i = 0; i < $(element).length; ++i) {
      $(element)[i].selectedIndex = 0;
    }
  }

  $(window).on('resize',() => {
    if (Object.values(check).every((keyCard) => keyCard)) {
      if (weaponType.value === 'Bow') {
        $(BowCoating).parent().css('max-width',`${$(dropWeapon).width() - $(dropWeaponType).width()}px`);
      }
      if (weaponType.value === (lbg || hbg)) {
        $(BarrelId).parent().css('max-width',`${($(dropWeapon).width() - $(dropWeaponType).width()) * 0.95}px`);
      }

      if ($(window).width() > 850) {
        setHeight();
      }
      section1.style = `width:${$('div#boxes.contain').width()}px; max-width:$($('div#boxes.contain').width()}px`;
    }
  });
  function setHeight() {
    const newHeight = +$(section1)
      .css('row-gap')
      .match(/\d.?\d+?/)[0]
      * 4
      + $('.title').height()
      + $(boxes).height()
      + $(weaponSelect).height()
      + $(raw).height();
    $('#section2').height(newHeight);
    // $('#section2').width($('#damageTable').width());
    $('#monTableContainer').height(newHeight * 0.2 + (newHeight * 0.59 - $(dpsTable).height() > 0 ? newHeight * 0.59 - $(dpsTable).height() > 0 : 0));
    // $('#monTableContainer').width($('#damageTable').width());
    $('#damageTable').height(Math.min(newHeight * 0.59,$(dpsTable).height()));
    if (/BowGun/.test(weaponType.value)) {
      $('#ammoTable').height(newHeight * 0.59);
    }
    $(comboCountContainer).css('height',+getComputedStyle(document.querySelector('#section2')).height.match(/\d.\d+?/)[0]);
    $('#monDropDowns').height($('#dropHeight').height());
    section1.style = `width:${$('div#boxes.contain').width()}px; max-width:$($('div#boxes.contain').width()}px`;
    if (weaponType.value === 'Bow') {
      $(BowCoating).parent().css('max-width',`${($(
        dropWeapon
      ).width() - $(dropWeaponType).width()) * 1.05}px`);
      // $([dropWeapon,weaponRampage]).css('max-width',`${$(dropWeapon).width()}px`)
      $(BowCoating).parent().css('min-width',`${($(
        dropWeapon
      ).width() - $(dropWeaponType).width()) * 1.05}px`);
      // $([dropWeapon,weaponRampage]).css('max-width',`${$(dropWeapon).width()}px`)
    }
  }

  $('#BowChargePlus').on('change',() => {
    ComboReset();
    UpdateComboDisplay();
  });

  $('.scroll').on('mousedown',() => {
    $('.scroll').toggleClass('vis invis');
    info.skills.MailofHellfire = $(redScroll).hasClass('invis') ? info.skills.MailofHellfireSourse.blue : info.skills.MailofHellfireSourse.red;
    info.skills.Dereliction = $(redScroll).hasClass('invis') ? info.skills.DerelictionSourse.blue : info.skills.DerelictionSourse.red;
    DataCompile();
  });

  $('.toggle').on('mousedown',function (e) {
    if (/DemonDrug/.test(e.target.id) && /gray/.test(e.target.className) && [DemonDrug.className,MegaDemonDrug.className].some((x) => /blue/.test(x))) {
      $('#DemonDrug').toggleClass('gray blue');

      $('#MegaDemonDrug').toggleClass('gray blue');
    } else {
      $(e.target).toggleClass('gray blue');
    }
    if (this !== filterCombo) {
      const ugh = dropHZ.selectedIndex;
      DataCompile();
      if (this === WaterBlight) {
        MonChart();
        dropHZ.selectedIndex = ugh;
        // $(dropHZ).
        // children().
        // each(function (index) {
        // if (this.textContent === document.querySelector('#monTable > tr:nth-child(2) > td:nth-child(1)').textContent) {
        // dropHZ.selectedIndex = index;
        // }
        // });
      }
    } else if (this === filterCombo) {
      FilterTableForComboAttacks();
    }
  });

  function ToggleAmmoTables() {
    dpsTable.style = dpsTable.style.display !== 'none' ? 'display:none' : "display:''";

    ammoTable.style = dpsTable.style.display !== 'none' ? 'display:none' : "display:''";
  }
  function calculateAmmoFrames(power) {
    let attackName = /Procs|\(RF\+\d\)/.test(power.attackName) ? power.attackName.replace(/ Procs| \(RF\+\d\)/,'') : power.attackName;
    attackName = /(?<!Lv)\d/.test(attackName) ? `${attackName.slice(0,attackName.length - 1)}Lv${attackName.slice(-1)}` : attackName;
    const ammo = {};
    ammo.ammoIncrease = info.ammo.AmmoUp[attackName][AmmoUP.selectedIndex];
    // converts to number to find frames used while staying within possible parameters
    ammo.recoilSpeed = info.ammo.recoil[attackName][
      Math.max(
        0,
        Math.min(
          5,
          power.recoil
          + RecoilDown.selectedIndex
          + (JSON.parse(BarrelId.value).Silencer > 0 ? TuneUp.selectedIndex + JSON.parse(BarrelId.value).Silencer : 0)
          - ($(CriticalFirePower).hasClass('blue') ? 2 : 0),
        ),
      )
    ];
    ammo.recoilSpeed = /\(RF\+\d\)/.test(power.attackName) ? `${ammo.recoilSpeed} ${power.attackName.match(/\(RF\+\d\)/)[0]}` : ammo.recoilSpeed;
    ammo.recoilFrames = info.ammo.recoil.frames[ammo.recoilSpeed];
    ammo.reloadSpeed = info.ammo.reload[attackName][
      Math.max(
        0,
        Math.min(
          8,
          power.reload
          - 2
          + ReloadSpeed.selectedIndex
          + JSON.parse(BarrelId.value).reload
          - [BarrelId.options[BarrelId.selectedIndex].text === '----' && TuneUp.selectedIndex > 0 ? 1 : 0][0],
        ),
      )
    ];
    ammo.reloadFrames = info.ammo.reload.frames[ammo.reloadSpeed];
    ammo.clipSize = power.clipSize[power.isUsed] + ammo.ammoIncrease;
    ammo.spareShot = info.skills.SpareShot[SpareShot.selectedIndex] + +spareAdjust.value;
    if (/(?<!snipe.*)explosion/.test(attackName) && Bombardier.selectedIndex > 0) {
      ammo.spareShot += JSON.parse(Bombardier.value)[lower(attackName).match(/sticky|wyvern/)[0]][2];
    }

    /*
        * finds time needed to shoot 100 shots as a base for calculations
        *                  ( (        actual shots consumed    times reloaded    for total frames spent reloading) + (total recoil frames) for total frames used / 30 frames for total second / 100 shots = seconds per shot)
          60 seconds / ( ( ( ( ( 100 shots-Spare Shot percent) / clip size -1 for inital clip) * frames per reload ) + (100 * recoil frames )) / 30 frames per second / 100 shots )
        */

    const shotsPerTimeLimit = 60;
    ammo.shotsPerMinBase = shotsCheck(ammo.recoilFrames / 30,ammo.reloadFrames / 30,power.clipSize[power.isUsed],shotsPerTimeLimit);
    ammo.shotsPerMin = shotsCheck(ammo.recoilFrames / 30,ammo.reloadFrames / 30,ammo.clipSize,shotsPerTimeLimit,100 / ammo.spareShot);
    ammo.shotsPerGain = `${Number.parseFloat((ammo.shotsPerMin / ammo.shotsPerMinBase - 1) * 100).toFixed(2)}%`;

    ammo.ticsAdjust = +power.ticsPer + 1;
    // Reduces total damage from pierce attacks displayed depending on selection
    // top is for piercing attacks, bottom is for elemental piercing attacks(elemental pierce is reduced by a higher percentage)
    if (/Pierce Lv|Pierce [1-3]/.test(attackName)) {
      ammo.ticsAdjust *=  JSON.parse(pierceAdjust.value)[0];
    } else if (/Pierc/.test(attackName)) {
      ammo.ticsAdjust *=    JSON.parse(pierceAdjust.value)[1];
    }
    return ammo;
  }

  function ComboReset() {
    // resets the combo inputs to default values
    if (!/BowGun/.test($(previousWeaponType).val()) && $(previousWeaponType).val() !== '') {
      $('.comboHits').remove();
      $('.0:nth-child(n+ 3)').val(0);
      $('.inputs').val(0);
      $('.inputComboRepeat').val(1);
      comboTracker = [];
      DataCompile();
    }
  }
  function FilterTableForComboAttacks() {
    $('.inputs').each((index,element) => {
      if (/blue/.test(filterCombo.className) && (element.value === '0' || element.style === 'display: none;')) {
        $(`.${index}`).hide();
      } else {
        $(`.${index}`).show();
      }
    });
  }

  function TimesUsed(ID,arr = comboTracker) {
    return arr.filter((attackId) => attackId == ID).length;
  }

  // $('.aug').on('click',function (e) {
  // /inc/.test(e.target.className)?$(`#${e.target.id}Augment`).value+1:$(`#${e.target.id}Augment`).value-1
  // })

  // $(document).on('click',function (e) {
  // $(e.target).removeClass('hover')
  // })
  function IncreaseComboCount() {
    if ($('.inputs')[window.event.target.id].value !== '20') {
      ++$('.inputs')[window.event.target.id].value;
      DataCompile();
    }
  }

  function DecreaseComboCount() {
    if (window.event.target.id === '0' && $('.inputs')[window.event.target.id].value !== '1') {
      --$('.inputs')[window.event.target.id].value;
      DataCompile();
    } else if (window.event.target.id !== '0' && $('.inputs')[window.event.target.id].value !== '0') {
      --$('.inputs')[window.event.target.id].value;
      DataCompile();
    }
  }
  $(document).on('mousedown',(e) => {
    const $target = $(e.target);
    if (!$target.closest(augToggle).length && $('#augToggle').css('display') !== 'none' && e.target !== Qurious) {
      $('.augToggle').toggleClass('augVis augInvis');
      $('#Qurious').toggleClass('blue gray');
    }
  });

  $('#Qurious').on('mousedown',() => {
    $('.augToggle').toggleClass('augVis augInvis');
  });
  $('.augButton').on('mousedown',(e) => {
    let ugh = 0;
    $('.augLabel').each((_x,output) => {
      ugh += +output.value;
    });
    if ($(e.target).hasClass('inc') && ugh + +e.target.value < 6 && (+$(e.target).siblings()[2].value + +e.target.value < 6 && !/elementalAug/.test(e.target.className) || /elementalAug/.test(e.target.className) && +$(e.target).siblings()[2].value < 3)) {
      $(e.target).siblings()[2].value = +$(e.target).siblings()[2].value + +e.target.value;
    } else if ($(e.target).hasClass('dec') && +$(e.target).siblings()[2].value > 0) {
      $(e.target).siblings()[2].value = +$(e.target).siblings()[2].value - +e.target.value;
    }
    DataCompile();
    if (/rampageAug/.test(e.target.className)) {
      $('#rampageResult').text($('output.rampageAug').val() > 0 ? +1 : +0);
      RampageSelect();
    }
  });
  function jsonsLoaded() {
    if (Object.values(check).every((keyCard) => keyCard)) {
      WeaponTypeSelect();
      WeaponSelect();
      RampageSelect();
      MonsterSelect();
      PartSelect();
      QuestSelect();
      HealthSelect();
      MonChart();
      classChange();
      DataCompile();
      setHeight();
    }
  }

  $(taWikiSetBuilder).on('paste',(e) => {
    e.preventDefault();

    const pasteurl = (event.clipboardData || window.clipboardData).getData('text');
    $('select.skill').each(function () {
      lastEvent = this;
      resetSkillDescription(this);
    });
    decodeURL(pasteurl,e);
    $(taWikiSetBuilder).text(document.createTextNode('Paste TA Wiki Set Builder Link Here'));
    DataCompile(e);
  });
  function decodeURL(url = taWikiSetBuilder.value,e) {
    if (/mhrise\.wiki-db\.com/.test(url)) {
      const decode = decodeURIComponent(url);
      const skills = decode.match('(?<=skills=)(.*?)(?=&)')[0].split(',');
      ResetSkills(document.querySelectorAll(`.thisSkill:not(.${$(weaponType).val()})`));
      $.each(skills,(_index,value) => {
        const thisSkill = value.split('Lv');
        thisSkill[0] = thisSkill[0].replace(/(\s)|(\/)/g,'');
        thisSkill[0] = thisSkill[0].replace(/'s/g,'s');
        thisSkill[0] = /Fire|Water|Wind|Ice|Dragon/.test(thisSkill[0]) ? 'ElementalAttack' : thisSkill[0];
        thisSkill[0] = /Kush|Teos|Storm|Thunder|Wind/.test(thisSkill[0]) ? 'ElderEssence' : thisSkill[0];
        if (document.querySelector(`#${thisSkill[0]}`) !== null && document.querySelector(`#${thisSkill[0]}`).style.display !== 'none') {
          document.querySelector(`#${thisSkill[0]}`).selectedIndex = thisSkill[1];
        }
      });
    } else if (JSON.parse(url).length === 5) {
      loadState(url,e);
    }
  }
  $('#taWikiSetBuilder').on('keyup',(e) => {
    e.target.textContent = (e.originalEvent.key === 'v' && e.originalEvent.ctrlKey) || e.originalEvent.metaKey
      ? (e.target.textContent = 'Build Successfully Decrypted')
      : 'Paste TA Wiki Set Builder Link Here';
  });
  function resetWikiText() {
    $('input#taWikiSetBuilder')[0].value = '';
    $('input#taWikiSetBuilder')[0].value = 'Paste TA Wiki Set Builder Link Here';
  }

  function PopulateDropDowns(json,dropDown) {
    $(dropDown).empty();
    $.each(json,(_key,value) => {
      $(dropDown).append($('<option></option>').attr('value',value).text(value));
    });
  }

  function WeaponTypeSelect() {
    PopulateDropDowns(weaponTypes,weaponType);
  }

  function WeaponSelect() {
    $(dropWeapon).empty();
    $(info[$(weaponType).val()].weapons).each((index,weapon) => {
      $('#dropWeapon').append($('<option></option>').attr('value',index).text(weapon.weapon));
    });
  }
  function RampageSelect() {
    // if (weaponType.value === 'Bow') {
    // $(BowCoating).empty();
    // getWeapon().coatings.forEach((coating, i) => {
    // info.skills.BowCoating[i] = info.skills[coating];
    // // $(BowCoating).append($('<option></option>').attr('value', info.skills[coating]).text(coating));
    // });
    // }
    $(weaponRampage.children).hide();
    $(weaponRampage0).show();
    if (getWeapon().rampageSlots !== 0) {
      const usableDecos = [];
      $(Object.keys(info.rampage.rampageDecos)).each((_index,element) => {
        // element == this
        const deco = element;
        if (+deco.slice(-1) <= getWeapon().rampageSlots + (+$('output.rampageAug').val() > 0 ? 1 : 0)) {
          usableDecos.push(info.rampage.rampageDecos[deco]);
        }
      });
      PopulateDropDowns(usableDecos,weaponRampage0);
    } else {
      $(weaponRampage.children).html('');
      $(weaponRampage.children).hide();
      $(weaponRampage0).show();
      if (/Rampage/.test(getWeapon().weapon)) {
        $(info.rampage[getWeapon().weapon].Rampage).each(function (index,_rampageSection) {
          $(weaponRampage.children[index]).show();
          PopulateDropDowns(Object.values(this),weaponRampage.children[index]);
        });
      } else {
        $(getWeapon().rampage).each(function (_index,_rampageSkill) {
          $(weaponRampage0).append($('<option></option>').attr('value',info.rampage.keys2[this]).text(info.rampage.keys2[this]));
        });
      }
    }
  }

  function MonsterSelect() {
    PopulateDropDowns(Object.keys(info.monster.hzv),dropMonster);
    dropMonster.selectedIndex = Object.keys(info.monster.hzv).indexOf('Toadversary');
  }
  function getHZ() {
    return info.monster.hzv[dropMonster.value][dropHZ.selectedIndex];
  }

  const getAttacks = () => ({ ...info[weaponType.value].attacks });

  const getWeapon = () => ({ ...info[weaponType.value].weapons[$('#dropWeapon').val()],...ele });

  function PartSelect() {
    const parts = [];
    info.monster.hzv[dropMonster.value].forEach((hitzone) => {
      parts.push([`${hitzone.part} ${hitzone.state}`]);
    });
    PopulateDropDowns(parts,dropHZ);
  }

  function QuestSelect() {
    $('#HR').empty();
    $('#MR').empty();
    $('#dropQuest').empty();
    const questMR = Object.entries(info.quest).filter((x) => x[1].monster === dropMonster.value && x[1].rank === 'MR');
    const questHR = Object.entries(info.quest).filter((x) => x[1].monster === dropMonster.value && x[1].rank === 'HR');
    questHR.forEach((quest) => {
      $('#HR').append($('<option></option>').attr('value',quest[0]).text(quest[1].quest));
    });
    questMR.forEach((quest) => {
      $('#MR').append($('<option></option>').attr('value',quest[0]).text(quest[1].quest));
    });
    if (questMR.length > 0) {
      $('#dropQuest').append($('<option></option>').attr('value',questMR[0][0]).text(questMR[0][1].quest));
    } else {
      $('#dropQuest').append($('<option></option>').attr('value',questHR[0][0]).text(questHR[0][1].quest));
      $('#MR').hide();
    }
  }
  function HealthSelect() {
    $(health).empty();
    $.each(getHealthPools(),(_key,value) => {
      $(health).append($('<option></option>').attr('value',value).text(formatNumbers(value)));
    });
  }

  $('#taWikiSetBuilder').on('mousedown',(_e) => {
    if ($(event.target).val() == 'Paste TA Wiki Set Builder Link Here') {
      $(event.target).val('');
    }
  });

  function isUnique(value,index,self) {
    return self.indexOf(value) === index;
  }
  // $(document).ready(function () {
  // var touch = $('#resp-menu');
  // var menu = $('.menu');
  //
  // $(touch).on('click', function (e) {
  // e.preventDefault();
  // menu.slideToggle();
  // });

  // $(window).resize(function () {
  // var w = $(window).width();
  // if (w > 767 && menu.is(':hidden')) {
  // menu.removeAttr('style');
  // }
  // });
  // 1;
  // });
  function showMenu() {
    $('.menu').show();
    document.querySelector('#MR').children.length > 0 ? $('#divMR').show() : $('#divMR').hide();
    if (document.querySelector('#HR').children.length > 0) {
      $('#divHR').show();
      $('div.menu').css('top','-46%');
    }
    if (document.querySelector('#HR').children.length === 0) {
      $('#divHR').hide();
      $('div.menu').css('top','-93%');
    }
  }

  function updateQuest(_event) {
    $('select#dropQuest').children()[0].outerHTML = window.event.path[0][window.event.path[0].selectedIndex].outerHTML;
    $('div.menu').hide();
    DataCompile();
  }

  $(document).on('mousedown',(event) => {
    const $target = $(event.target);
    if (!$target.closest(questButton).length && !$target.closest('.menu').length && !$target.closest(dropQuest).length && $('.menu').is(':visible')) {
      $('.menu').hide();
    }
  });
  function capital(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  function lower(str) {
    return str[0].toLowerCase() + str.slice(1);
  }
  function shotsCheck(convertedRecoilFrames,convertedReloadFrames,clipSize,maxTime = 60,spareShot = 0) {
    let spareShotAccumulator = 0;
    spareShotAccumulator += spareShot;
    let timeUsed = 0;
    let totalShots = 0;
    while (timeUsed <= maxTime) {
      for (let i = 0; i < clipSize; ++i) {
        timeUsed += convertedRecoilFrames;
        totalShots += timeUsed <= maxTime ? 1 : 0;
        if (totalShots >= spareShotAccumulator && spareShot !== 0 && spareShot !== Infinity) {
          --i;
          spareShotAccumulator += spareShot;
        }
      }
      timeUsed += convertedReloadFrames;
    }

    return totalShots;
  }

  function getHealthPools() {
    const healthMod = ~~(0.1 + info.quest[dropQuest.value][players.value] * ((info.quest[dropQuest.value].min / info.quest[dropQuest.value]['1p'] - 1) * -1))
      / info.quest[dropQuest.value].HPScale;
    let healthPool = [info.quest[dropQuest.value][$('#players').val()]];
    if (info.quest[dropQuest.value].HPScale === 0) {
      return healthPool;
    } if (info.quest[dropQuest.value].HPScale === 1) {
      healthPool = [[healthPool[0] - healthMod],[healthPool[0]],[healthPool[0] + healthMod]];

      return healthPool;
    }
    healthPool = [[healthPool[0] - healthMod * 2],[healthPool[0] - healthMod],[healthPool[0]],[healthPool[0] + healthMod],[healthPool[0] + healthMod * 2]];

    return healthPool;
  }
  // function json(arr) {
  // let headers = arr.splice(0, 1);
  // let newjson = {};
  // let i = 0;
  // let ugh = [];
  // let check = '';
  // arr.forEach(function (part, index) {
  // if (check !== '' && check !== part[0]) {
  // newjson[arr[index - 1][0]] = ugh;
  //
  // ugh = [];
  // i = 0;
  // }
  // ugh[i] = {};
  // $(part).each(function (index, element) {
  // if (index > 0) {
  // if (/[1-9]/.test(element)) {
  // ugh[i][headers[0][index]] = Number(element);
  // } else {
  // ugh[i][headers[0][index]] = element;
  // }
  // }
  // });
  // ++i;
  // check = part[0];
  // });
  // console.log(newjson);
  // }
  function saveState() {
    const ugh = [[],[],[],[],[]];

    $('select').each(function () {
      ugh[0].push($(this)[0].selectedIndex);
    });
    $('button.skillButton').each(function () {
      ugh[1].push($(this).hasClass('blue'));
    });
    $('.inputs').each(function () {
      ugh[2].push(this.value);
    });
    ugh[3].push(comboTracker[0]);
    $('.scroll').each(function () {
      ugh[4].push(this.className);
    });
    const copyText = document.createElement('input');
    copyText.setAttribute('value',JSON.stringify(ugh));
    copyText.select();
    copyText.setSelectionRange(0,99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value);
    return ugh;
  }
  function loadState(ugh,_e) {
    ugh = JSON.parse(ugh);
    $('.skillButton').each(function () {
      if ($(this).hasClass('blue')) {
        $(this).toggleClass('blue gray');
      }
    });

    const ugh2 = document.querySelectorAll('select');

    ugh2[0].selectedIndex = ugh[0][0];
    classChange();
    WeaponSelect();

    ugh2[3].selectedIndex = ugh[0][3];
    RampageSelect();
    ugh2[70].selectedIndex = ugh[0][70];
    QuestSelect();
    PartSelect();
    HealthSelect();
    $('select').each(function (index) {
      if (index !== (0 || 3 || 70)) {
        this.selectedIndex = ugh[0][index];
      }
    });
    $('button.skillButton').each((index,element) => {
      if (ugh[1][index]) {
        $(element).toggleClass('blue gray');
      }
    });

    $('.inputs').each((index,input) => {
      input.value = ugh[2][index];
    });
    $('.scroll').each(function (index) {
      this.className = ugh[4][index];
    });

    comboTracker = ugh[3];
    $('.inputs:not(".inputComboRepeat")').each(function () {
      if (this.value > 0) {
        let difference = $('.inputs')[this.id].value - TimesUsed(this.id);
        while (difference > 0) {
          comboTracker.push(this.id);
          --difference;
        }
        while (difference < 0) {
          comboTracker.splice(comboTracker.lastIndexOf(this.id),1);
          ++difference;
        }
      }
    });
    UpdateComboDisplay();
    setTimeout(() => {
      $('input#taWikiSetBuilder')[0].value = 'Paste TA Wiki Set Builder Link Here';
    },2000);
    $('input#taWikiSetBuilder')[0].value = 'Build Succsefully Loaded';
  }
  function resetSkillDescription() {
    if (lastEvent !== '') {
      if(lastEvent===BowCoating&&weaponType.value!=='Bow'){return}
      let theseOptions = [];
      if (Object.values(lastEvent.children).some((x) => x.tagName === 'OPTGROUP')) {
        theseOptions = Object.values($(lastEvent.children).children());
        theseOptions.splice(-2);
        theseOptions.splice(0,0,lastEvent[0]);
      } else {
        theseOptions = Object.values(lastEvent.children);
      }
      theseOptions.forEach((thisOption,index) => {
        let newText = '';
        if (lastEvent === BowCoating) {
          newText = getWeapon().coatings[index];
        } else if (lastEvent === BarrelId) {
          newText = ['----','Long','Power','Silencer','Guard-Up'][index];
        } else if (lastEvent === Dereliction) {
          newText = ['----','Lv-1 Charge-1','Lv-1 Charge-2','Lv-1 Charge-3','Lv-1 Charge-1','Lv-1 Charge-2','Lv-1 Charge-3','Lv-1 Charge-1','Lv-1 Charge-2','Lv-1 Charge-3'][index];
        } else {
          newText = `Lv-${index}`;
        }
        thisOption.textContent = index === 0 ? '----' : newText;
      });
      lastEvent = '';
    }
  }

  $(document).on('mousedown',(e) => {
    if (lastEvent !== '' && lastEvent === e.target) {
      return;
    }
    if (lastEvent !== '') {
      resetSkillDescription();
    }
    if (Object.values($('select.skill')).some((x) => x.id === e.target.id)) {
      setSkillDescriptions(e.target);
    }
  });
  $('select.skill').on('change',(e) => {
    resetSkillDescription();

    DataCompile();
    e.target.blur();
  });

  function setSkillDescriptions(thisSkill) {
    if (Object.values($('select.skill')).some((x) => x.id === thisSkill.id)) {
      const ugh2 = thisSkill.id;
      if (ugh2 !== 'Dereliction') {
        $(info.skills[ugh2]).each(function (index) {
          let option;
          if (index !== 0) {
            if (ugh2 === 'RecoilDown' || ugh2 === 'ReloadSpeed') {
              option = /Reload/.test(ugh2) ? `${ugh2.slice(0,6)} ${ugh2.slice(6)} +${index}` : `${ugh2.slice(0,6)} ${ugh2.slice(6)} +${index}`;
            } else if (ugh2 === 'AmmoUP' || ugh2 === 'SpareShot') {
              const inc = ugh2 === 'AmmoUP' ? ['No Change','+1 Lvl 2 & Ele Ammo','+1 Lvl 3 & Dragon Ammo'] : ['Spare Shot +5%','Spare Shot +10%','Spare Shot +20%'];
              option = `${index}: ${inc[index - 1]}`;
            } else if (ugh2 == 'Marksman') {
              option = `${index}: ${['Chance 20% Raw  + 5% EFR +1%','Chance 20% Raw+10% EFR +2%','Chance 60% Raw  + 5% EFR +3% ','Chance 40% Raw+10% EFR +4%'][index - 1]}`;
            } else if (ugh2 === 'Bombardier') {
              if (weaponType.value === cb) {
                option = ['Bombardier','1: Raw +10% EFR +10%','2: Raw +15% EFR +15%','3: Raw +20% EFR +16%','4: Raw + 25% EFR +17%'][index];
              } else if (weaponType.value === gl) {
                option = ['Bombardier','1: Raw + 5% EFR + 5%','2: Raw+10% EFR+10%','3: Raw+15% EFR+11%','4: Raw+20% EFR+12%'][index];
              } else if (weaponType.value === lbg) {
                option = ['Bombardier','1: Raw +10% EFR +10%','2: Raw +10% EFR +10%','3: Raw +20% EFR +16%','4: Raw +25% EFR +17%'][index];
              } else if (weaponType.value === hbg) {
                option = ['Bombardier','1: Raw + 10% EFR + 10%','2: Sticky+10% Wyvern+15%','3: Raw + 20% EFR + 16%','4: Raw + 25% EFR + 17%'][index];
              }
            } else if (ugh2 == 'BarrelId') {
              option = ['Barrels','Long: Raw + 5%','Power: Raw + 12.5%','Silencer: Recoil Down +1','Shield: Guard Up'][index];
            } else if (ugh2 == 'ElementalExploit') {
              option = `${index}: ${['----','Ele + 10%','Ele + 12.5%','Ele + 15%'][index]}`;
            } else {
              let raw = '';
              if (this.BR > 0 || this.PRM > 1 || this.BRM > 1) {
                raw = 'Raw';
                if (this.BR > 0) {
                  raw += /\d\.?\d/.test(this.BR) ? `+${this.BR}` : ` + ${this.BR}`;
                }
                if (this.BRM > 1) {
                  const brm = /\.[1-8]/.test((this.BRM - 1) * 100) ? ((this.BRM - 1) * 100).toFixed(1) : ((this.BRM - 1) * 100).toFixed(0);
                  raw += /\d\.?\d/.test(brm) ? `+${brm}%` : ` + ${brm}%`;
                }
                if (this.PRM > 1) {
                  const prm = /\.[1-8]/.test((this.PRM - 1) * 100) ? ((this.PRM - 1) * 100).toFixed(1) : ((this.PRM - 1) * 100).toFixed(0);
                  raw
                    += ugh2 === 'CriticalBoost' && /\d\.?\d/.test(prm - 25)
                      ? `+${prm - 25}%`
                      : ugh2 === 'CriticalBoost'
                        ? ` + ${prm - 25}%`
                        : /\d\.?\d/.test(prm)
                          ? `+${prm}%`
                          : ` + ${prm}%`;
                }
              }
              let ele = '';
              if (this.BE > 0 || this.PEM > 1 || this.BEM > 1) {
                ele = 'Ele';
                if (this.BE > 0) {
                  ele += /\d\.?\d/.test(this.BE) ? `+${this.BE}` : ` + ${this.BE}`;
                }
                if (this.BEM > 1) {
                  const bem = /\.[1-8]/.test((this.BEM - 1) * 100) ? ((this.BEM - 1) * 100).toFixed(1) : ((this.BEM - 1) * 100).toFixed(0);
                  ele += /\d\.?\d/.test(bem) ? `+${bem}%` : ` + ${bem}%`;
                }
                if (this.PEM > 1) {
                  const pem = /\.[1-8]/.test((this.PEM - 1) * 100) ? ((this.PEM - 1) * 100).toFixed(1) : ((this.PEM - 1) * 100).toFixed(0);
                  ele += /\d\.?\d/.test(pem) ? `+${pem}%` : ` + ${pem}%`;
                }
              }
              const aff = this.aff > 0 && /\d\.?\d/.test(this.aff) ? `Aff+${this.aff}` : this.aff > 0 ? `Aff + ${this.aff}` : '';
              raw = Object.prototype.hasOwnProperty.call(this,'Sharp') && this.Sharp < 1 ? `Sharp +${this.Sharp * 100}%` : raw;
              raw = Object.prototype.hasOwnProperty.call(this,'Sharp') && this.Sharp > 1 ? `Sharp +${this.Sharp}` : raw;
              raw = raw === '' && ele === '' && aff === '' ? 'No Change' : raw;
              if (thisSkill === BowCoating) {
                const text = getWeapon().coatings;
                option = `${text[index]}: ${[raw,ele,aff].join(' ')}`;
              } else {
                option = `${index}: ${[raw,ele,aff].join(' ')}`;
              }
            }
          } else {
            option = ugh2;
          }
          $(`#${ugh2}`)[0][index].textContent = option;
        });
        lastEvent = thisSkill;
      } else if (thisSkill === Dereliction) {
        const text = $(redScroll).hasClass('invis')
          ? [['1: Raw +15'],['2: Raw +20'],['3: Raw +25'],['1: Raw +20'],['2: Raw +25'],['3: Raw +30'],['1: Raw +25'],['2: Raw +30'],['3: Raw +35']]
          : [['1: Ele + 5'],['2: Ele + 8'],['3: Ele+12'],['1: Ele + 7'],['2: Ele+12'],['3: Ele+15'],['1: Ele+10'],['2: Ele+15'],['3: Ele+20']];
        let index = 0;
        $('select#Dereliction')
          .children()
          .each(function () {
            $(this)
              .children()
              .each(function () {
                this.textContent = text[index];
                ++index;
              });
          });
        Dereliction[0].textContent = 'Dereliction';
      }
      lastEvent = thisSkill;
    }

    if (
      (Object.values($('select.skill').children()).some((x) => x.id === thisSkill.id) && thisSkill.children[0]?.textContent === thisSkill.id)
      || !Object.values($('select.skill').children()).some((x) => x.id === thisSkill.id || thisSkill)
    ) {
      resetSkillDescription(thisSkill);
    }
  }

  function getStats(power,skills) {
    $(skills).each((_index,skill) => {
      power.BRM *= skill.BRM;
      power.BR += skill.BR;
      power.PRM *= skill.PRM;
      power.BEM *= skill.BEM;
      power.BE += skill.BE;
      power.PEM *= skill.PEM;
      power.aff += skill.aff;
    });
    return power;
  }

  function partSelector() {
    $(dropHZ)
      .children()
      .each(function (index) {
        if (this.textContent === document.querySelector('#monTable > tr:nth-child(2) > td:nth-child(1)').textContent) {
          dropHZ.selectedIndex = index;
        }
      });
  }
  const distanceCalc = (ammo,fps = 60) => {
    let time = 0;
    if (ammo.isPierce) {
      while (time < ammo.TickRate) {
        time += 1 / fps;
      }
    }

    return (time * ammo.Speed).toFixed(3);
  };

  function formatNumbers(numbers) {
    numbers = numbers.toString();
    if (numbers.length > 3) {
      let len = numbers.length;
      let result = '';
      while (len - 3 >= 0) {
        len += -3;
        const num = numbers.slice(len,len + 3);
        result = result === '' ? num : `${num},${result}`;
      }
      if (len === 0) {
        return result;
      }
      const num = numbers.slice(0,len);
      return `${num},${result}`;
    }
    return +numbers;
  }
