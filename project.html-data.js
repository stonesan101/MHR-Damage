const URLAttack = 'http://127.0.0.1:5500/json/Attacks.html-data.json';
const URLMonster = 'http://127.0.0.1:5500/json/Monster.html-data.json';
const URLQuest = 'http://127.0.0.1:5500/json/quest.html-data.json';
const URLRampage = 'http://127.0.0.1:5500/json/Rampage.html-data.json';
const URLSharp = 'http://127.0.0.1:5500/json/Sharpness.html-data.json';
const URLType = 'http://127.0.0.1:5500/json/catagory.html-data.json';
const URLWeapon = 'http://127.0.0.1:5500/json/Weapons.html-data.json';
const URLSPM = 'http://127.0.0.1:5500/json/ShotsPerMin.html-data.json';
const URLLight = 'http://127.0.0.1:5500/json/AmmoLight.html-data.json';
const URLHeavy = 'http://127.0.0.1:5500/json/AmmoHeavy.html-data.json';

jQuery(($) => {
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
		window.type = data;
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
		window.sharp = data;
	});
});
let comboTracker = [];
let previousEntranceCheck1 = '';
let previousEntranceCheck2 = 0;
const weapType = $('#dropWeaponTypeSelection');
const weap = $('#dropWeaponSelection');
const mon = $('#dropmonsterSelection');
const monHZ = $('#dropHZSelection');
const monEnrage = $('#dropenraged');
const monHunt = $('#dropquest');
const monHP = $('#drophealth');
const weapRamp0 = $('#weapRamp0');
const weapRamp1 = $('#weapRamp1');
const weapRamp2 = $('#weapRamp2');
const weapRamp3 = $('#weapRamp3');
const weapRamp4 = $('#weapRamp4');
const weapRamp5 = $('#weapRamp5');

arg1 = false;
arg2 = false;
arg3 = false;
arg4 = false;
arg5 = false;
arg6 = false;
arg7 = false;

// Monster HZV and Status Data

weap.empty();
weap.append('<option selected="true" value="Kamura Cleaver I">Kamura Cleaver I</option>');
weapType.selectedIndex = 0;

function WeaponSelect() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		weap.empty();
		$.each(window.weapon[weapType.val()], (key) => {
			weap.append($('<option></option>').attr('value', key).text(key));
		});
	}
}

function RampageSelect() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		weapRamp0.empty();
		weapRamp1.empty();
		weapRamp2.empty();
		weapRamp4.empty();
		weapRamp5.empty();
		weapRamp1.style = 'display:none';
		weapRamp2.style = 'display:none';
		weapRamp4.style = 'display:none';
		weapRamp5.style = 'display:none';
		if (/Rampage/.test(weap.val())) {
			$.each(weapRamp.children, (plusPlus, item) => {
				if (Object.hasOwn(window.rampage[weap.val()], [plusPlus])) {
					$.each(window.rampage[weap.val()][plusPlus], (key, entry) => {
						weapRamp.children[plusPlus].style = 'display:grid';
						$(weapRamp.children[plusPlus]).append($('<option></option>').attr('value', entry).text(entry));
					});
				} else {
					weapRamp.children[plusPlus].style = 'display:none';
				}
			});
		} else {
			$.each(weapRamp.children, (key) => {
				$(weapRamp.children[key]).empty();
				weapRamp.children[key].style = key !== 0 ? 'display:none' : 'display:grid';
			});
			$.each(window.weapon[weapType.val()][weap.val()].Rampage, (key, entry) => {
				weapRamp0.append($('<option></option>').attr('value', entry.key).text(entry));
			});
		}
	}
}

mon.prop('selectedIndex', 0);

monHZ.empty();
monHZ.append('<option selected="true" value="Head">Head</option>');

function PartSelect() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		monHZ.empty();
		$.each(window.monster[mon.val()].HitZone, (key) => {
			monHZ.append($('<option></option>').attr('value', key).text(key));
		});
	}
}
monHunt.empty();
monHunt.append('<option selected="true" disabled>Hunt</option>');
monHunt.prop('selectedIndex', 0);

function QuestSelect() {
	monHunt.empty();
	$.each(window.quest, (key) => {
		if (Object.hasOwn(window.quest[key], [mon.val()])) {
			monHunt.append($('<option></option>').attr('value', key).text(key));
		}
	});
}
monHP.empty();
monHP.append('<option selected="true" disabled>Health</option>');
monHP.prop('selectedIndex', 0);

function HealthSelect() {
	monHP.empty();
	$.each(window.quest[monHunt.val()][mon.val()], (key, value) => {
		monHP.append($('<option></option>').attr('value', value).text(value));
	});
}

function DataCompile() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		if (MegaDemondrug.style.background !== 'gray' && Demondrug.style.background !== 'gray') {
			MegaDemondrug.style.background = MegaDemondrug === window.event.path[0] ? '' : 'gray';
			Demondrug.style.background = Demondrug === window.event.path[0] ? '' : 'gray';
		}
		const enrage = monEnrage.val() === 'Enraged' ? window.monster[mon.val()].Enrage / 100 : 1;
		enrageDisplay.innerHTML = `${~~(enrage * 100)}%`;
		if (/BowGun/.test(weapType.val())) {
			RangedDPS();
		} else {
			MeleeDPS();

			ComboDamage();
		}
	}
}
function RangedDPS() {
	let rangedDamage = [];
	let allAmmo = [];
	let stats = [];
	const power = {};
	const sharpnessModifier = [];

	$.each(window[`ammo${weapType.val()}`][weap.val()].Ammo, (key) => {
		const ammoType = key,
			{ rawMV } = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType],
			type = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].Type;

		power.eleMV = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].eleMV;
		const ticsPer = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].TicsPer;

		power.clip = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].Clip;
		power.baseRaw = window.weapon[weapType.val()][weap.val()].Raw;

		power.baseEle = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].baseEle[1];

		power.eleType = window[`ammo${weapType.val()}`][weap.val()].Ammo[ammoType].baseEle[0];
		power.BR = 0;
		power.BRM = 1;
		power.PRM = 1;
		power.BEM = 1;
		power.BE = 0;
		power.PEM = 1;
		power.recoil = window[`ammo${weapType.val()}`][weap.val()].Recoil;
		power.reload = window[`ammo${weapType.val()}`][weap.val()].Reload;
		power.bAFF = window.weapon[weapType.val()][weap.val()].AFF;
		for (let i = 0; i < 6; ++i) {
			if (weapRamp.children[i].hidden === false) {
				for (let j = 0; j < Object.values(window.rampage.Keys).length; ++j) {
					if (Object.hasOwn(window.rampage['Ramp-Up Skill'], [weapRamp.children[i].value])) {
						if (Object.hasOwn(window.rampage['Ramp-Up Skill'][weapRamp.children[i].value], window.rampage.Keys[j])) {
							power[window.rampage.Keys[j]] += window.rampage['Ramp-Up Skill'][weapRamp.children[i].value][window.rampage.Keys[j]];
						}
					}
				}
			}
		}
		const ammoIncrease = window.spm.AmmoUp[ammoType][AmmoUPid.value];
		const recoilSpeed =
			window.spm.Recoil[ammoType][Math.max(0, Math.min(5, power.recoil - Recoilid.value - JSON.parse(Barrelid.value).Silencer))];
		const recoilFrames = window.spm.Recoil.frames[recoilSpeed];
		const reloadSpeed =
			window.spm.Reload[ammoType][Math.max(0, Math.min(8, power.reload - Reloadid.value + JSON.parse(Barrelid.value).Reload))];
		const reloadFrames = window.spm.Reload.frames[reloadSpeed];
		const clipSize = power.clip + ammoIncrease;
		const spareShot = SpareShotid.value + spareAdjust.value;
		const shotsPerMinBase = ~~(60 / (((100 / power.clip - 1) * reloadFrames + 100 * recoilFrames) / 30 / 100));
		const shotsPerMin = ~~(60 / ((((100 - spareShot) / clipSize - 1) * reloadFrames + 100 * recoilFrames) / 30 / 100));
		const shotsPerGain = `${Number.parseFloat((shotsPerMin / shotsPerMinBase - 1) * 100).toFixed(2)}%`;
		let rawHZV = window.monster[mon.val()].HitZone[monHZ.val()][type];
		// For skills unaffected by HZV

		if (rawHZV === undefined || rawHZV.isNaN || rawHZV === null) {
			rawHZV = 100;
		}
		let eleHZV = window.monster[mon.val()].HitZone[monHZ.val()][power.eleType]; // For non ele Weapons

		if (eleHZV === undefined || eleHZV.isNaN || eleHZV === null) {
			eleHZV = 0;
		} // Bowgun

		let getSkills;

		switch (type) {
			case 'Sever':
			case 'Blunt':
				getSkills = window.type.Sever;
				break;
			case 'Shot':
				getSkills = window.type.Gunner;
				break;
			case 'None':
			case 'Stickies':
			case 'IMPAED':
			case 'IMPUAED':
				getSkills = window.type.Stickies;
				break;
			case 'Cluster':
				getSkills = window.type.Clusters;
				break;
			default:
				getSkills = window.type.AllSkills;
				break;
		} // Bowgun

		if (Object.hasOwn(window.attack[weapType.val()][key], 'unique')) {
			getSkills = getSkills.concat(window.attack[weapType.val()][key].unique);
		}
		for (let i = 0; i < $('.skillButton').length; ++i) {
			if (document.getElementsByClassName('skillButton')[i].style.background !== 'gray') {
				const skills = JSON.parse($('.skillButton')[i].value);

				power.BRM *= skills.BRM;
				power.BR += skills.BR;
				power.PRM *= skills.PRM;
				power.BEM *= skills.BEM;
				power.BE += skills.BE;
				power.PEM *= skills.PEM;
				power.bAFF += skills.Affinity;
			}
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
				power.bAFF += skills.Affinity;
			}
		});
		// Bowgun
		let [augPRM, augPEM] = [1, 1];

		[power.BR, power.bAFF] =
			type === ('Shot' || 'Sever' || 'Blunt') && monEnrage.val() === 'Enraged'
				? [JSON.parse(Agitator.value).BR + power.BR, JSON.parse(Agitator.value).Affinity + power.bAFF]
				: [power.BR, power.bAFF];

		[, augPRM, augPEM] = [1, 1, 1];
		if (Object.hasOwn(window.type, weapRamp0.val())) {
			for (let i = 0; i < window.type[weapRamp0.val()].Monsters.length; ++i) {
				[augPRM, augPEM] =
					window.type[weapRamp0.val()].Monsters[i] === mon.val()
						? [window.type[weapRamp0.val()].PRM, window.type[weapRamp0.val()].PEM]
						: [1, 1];
			} // Ant-Species-Skills
		}

		power.PEM *= JSON.parse(Barrelid.value).Element; // Elemental Reload

		augPEM = weapRamp0.value === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : augPEM;

		augPEM =
			weapRamp0.value === 'Elemental Exploit' && window.monster[mon.val()].HitZone[monHZ.val()][power.eleType] >= 25 ? 1.3 : augPEM;

		const enrage = monEnrage.val() === 'Enraged' ? window.monster[mon.val()].Enrage / 100 : 1;

		power.bAFF = power.rawHZV >= 45 ? power.bAFF + JSON.parse($('#Weakness_Exploit').val()) : power.bAFF;
		power.bAFF = Math.min(power.bAFF, 100) / 100;

		let [critBoost, eleCritBoost] = !/(Sever)|(Blunt)|(Shot)/.test(type)
			? [1, 1]
			: [JSON.parse($('#Critical_Boost').val()).PRM, JSON.parse($('#Critical_Element').val()).PEM];
		let efrMulti = 1 + (critBoost - 1) * power.bAFF;
		const brutalEFR =
			/*
			 * Converts -Aff to a + * proc% * dmg modifier to find overall dps difference
			 * then adds the -dps to the +dps gain
			 */
			(power.bAFF - power.bAFF * 2) * 0.25 * 0.5 + (power.bAFF - power.bAFF * 2) * 0.75 * -0.25;

		[efrMulti, critBoost] = weapRamp0.val() === 'Brutal Strike' && power.bAFF < 0 ? [1 + brutalEFR, 1.5] : [efrMulti, critBoost];

		const raw = Math.min(power.baseRaw * power.BRM + power.BR, power.baseRaw * 3);
		const rawFormula = (raw * power.PRM * rawHZV * enrage * rawMV * augPRM * JSON.parse(Barrelid.value).Power) / 10000;
		const rawNon = ~~(0.1 + rawFormula * JSON.parse(felineMarksmanid.value)[0]);
		const efr = ~~(0.1 + rawFormula * efrMulti * JSON.parse(felineMarksmanid.value)[1]);
		const rawCrit = ~~(0.1 + rawFormula * critBoost * JSON.parse(felineMarksmanid.value)[0]);
		const eleAmmo = /(Ice)|(Fire)|(Water)|(Dragon)|(Thunder)/.test(power.eleType) ? 1 + raw / 100 : 1;
		const efeMulti = 1 + (eleCritBoost - 1) * power.bAFF;
		const ele = Math.min(power.baseEle * power.BEM + power.BE, power.baseEle * 3);
		const eleFormula = (ele * power.PEM * eleHZV * enrage * power.eleMV * eleAmmo * augPEM) / 100;
		const eleNon = eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
		const efe = eleFormula * efeMulti > 0 && eleFormula * efeMulti < 1 ? 1 : ~~(0.1 + eleFormula * efeMulti);
		const eleCrit = eleFormula * eleCritBoost > 0 && eleFormula * eleCritBoost < 1 ? 1 : ~~(0.1 + eleFormula * eleCritBoost);

		let ticsAdjust = ticsPer;

		if (/Pierce/.test(ammoType)) {
			ticsAdjust = ~~(ticsPer * JSON.parse(pierceAdjust.value)[0]);
		} else if (/Pierc/.test(ammoType)) {
			ticsAdjust = ~~(ticsPer * JSON.parse(pierceAdjust.value)[1]);
		} // Pierce Adjustment Reduces all damage not on target HZ by 50% of that targets value (TotalTics - TicsOnHZ * .5 + TicsOnHZ)

		const totalEffective = (efr + efe) * ticsAdjust;
		const totalCrit = (rawCrit + eleCrit) * ticsAdjust;
		const totalNon = (rawNon + eleNon) * ticsAdjust;
		const shotsToKill = ~~(1 + JSON.parse(monHP.val()) / totalEffective);
		const timeToKill = /(Sticky)|(Slicing)/.test(ammoType)
			? 5 + ~~(0.5 + (60 / shotsPerMin) * shotsToKill)
			: ~~(0.5 + (60 / shotsPerMin) * shotsToKill);
		// Adds delay time for stickies/ slicin;
		const rawBoth = [].concat(`${rawNon}/${rawCrit}`);
		const eleBoth = [].concat(`${eleNon}/${eleCrit}`);
		const total = [].concat(`${totalNon}/${totalCrit}`);
		const damage = {
			ammoType,
			rawBoth,
			eleBoth,
			total,
			efr,
			efe,
			totalEffective,
			shotsPerGain,
			shotsToKill,
			timeToKill,
		};

		rangedDamage = [].concat(rangedDamage, damage);

		const ammoStats = {
			ammoType,
			rawMV,
			reloadSpeed,
			recoilSpeed,
			clipSize,
			ticsPer,
			shotsPerMinBase,
			shotsPerMin,
		};

		allAmmo = [].concat(allAmmo, ammoStats);

		stats = [
			['Base', ~~power.baseRaw, window.weapon[weapType.val()][weap.val()].AFF, 11],
			['Cap', ~~raw, ~~(power.bAFF * 100), ~~(0.1 + 11 * power.BEM + power.BE)],
			[
				'Post Cap',
				~~(raw * critBoost * power.PRM * enrage * augPRM * JSON.parse(felineMarksmanid.value)[0]),
				~~(power.bAFF * 100),
				~~(0.1 + (11 * power.BEM + power.BE) * power.PEM * enrage * eleAmmo * augPEM * eleCrit),
			],
			[
				'Effective',
				~~(raw * efrMulti * power.PRM * enrage * augPRM * JSON.parse(felineMarksmanid.value)[1]),
				~~(power.bAFF * 100),
				~~(0.1 + (11 * power.BEM + power.BE) * power.PEM * augPEM * enrage * eleAmmo * efeMulti),
			],
		];
	});
	const statsHeaders = ['Stat', 'Raw', 'Affinity', 'Ele Ammo'];

	BuildTableDamage(stats, statsHeaders, (id = 'stats'));
	const rangedHeaders = [
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
	];

	BuildTableDamage(rangedDamage, rangedHeaders, (id = 'dps'));
	const ammoStatsHeaders = [
		'Ammo Type',
		'rawMV',
		'Reload',
		'Recoil',
		'Clip Size',
		'Tics Per Shot',
		'Shots Per \n Min Base',
		'Shots \n Per Min',
	];

	BuildTableDamage(allAmmo, ammoStatsHeaders, (id = 'ammo'));
}

function MeleeDPS() {
	const power = {};
	let DPS = [];
	let stats = [];
	let meleeDamage = [];
	let attacks = [];
	const sharpnessModifier = [];
	let c = 0;
	let rawMV;
	let type;
	let eleMV;
	power.enrage = monEnrage.val() === 'Enraged' ? window.monster[mon.val()].Enrage / 100 : 1;
	power.baseRaw = window.weapon[weapType.val()][weap.val()].Raw;
	power.bAFF = window.weapon[weapType.val()][weap.val()].AFF;
	[power.eleType, power.baseEle] = window.weapon[weapType.val()][weap.val()].Ele;

	power.BR = 0;
	power.BRM = 1;
	power.PRM = 1;
	power.BEM = 1;
	power.BE = 0;
	power.PEM = 1;
	for (let i = 0; i < 6; ++i) {
		if (weapRamp.children[i].hidden === false) {
			for (let j = 0; j < Object.values(window.rampage.Keys).length; ++j) {
				if (Object.hasOwn(window.rampage['Ramp-Up Skill'], [weapRamp.children[i].value])) {
					if (Object.hasOwn(window.rampage['Ramp-Up Skill'][weapRamp.children[i].value], window.rampage.Keys[j])) {
						power[window.rampage.Keys[j]] += window.rampage['Ramp-Up Skill'][weapRamp.children[i].value][window.rampage.Keys[j]];
					}
				}
			}
		}
	}
	if (/Fire/.test(weapRamp.children[1].value)) {
		power.eleType = 'Fire';
	} else if (/Water/.test(weapRamp.children[1].value)) {
		power.eleType = 'Water';
	} else if (/Thunder/.test(weapRamp.children[1].value)) {
		power.eleType = 'Thunder';
	} else if (/Ice/.test(weapRamp.children[1].value)) {
		power.eleType = 'Ice';
	} else if (/Dragon/.test(weapRamp.children[1].value)) {
		power.eleType = 'Dragon';
	}

	// EnrageDisplay.innerHTML = `${enrage * 100}%`;

	attacks =
		window.weapon[weapType.val()][weap.val()].Phial === 'Impact Phial'
			? Object.keys(window.attack[weapType.val()]).filter((skill) => !/Element Phial/.test(skill))
			: Object.keys(window.attack[weapType.val()]).filter((skill) => !/Impact Phial/.test(skill));

	$.each(attacks, (key) => {
		const attackName = attacks[key];

		const Attacks = window.attack[weapType.val()][attackName];

		rawMV = Attacks.MV;
		type = Attacks.Type;
		eleMV = Attacks.EleMV;

		let rawHZV = window.monster[mon.val()].HitZone[monHZ.val()][type];

		if (rawHZV === undefined || rawHZV.isNaN || rawHZV === null) {
			rawHZV = 100; // For non ele Weapons
		}

		let eleHZV = window.monster[mon.val()].HitZone[monHZ.val()][power.eleType];

		if (eleHZV === undefined || eleHZV.isNaN || eleHZV === null) {
			eleHZV = 0; // For non ele Weapons
		}

		// Melee
		let getSkills;

		switch (type) {
			case 'Sever':
			case 'Blunt':
				getSkills = window.type.Sever;
				break;
			case 'Shot':
				getSkills = window.type.Gunner;
				break;
			case 'None':
			case 'Stickies':
			case 'IMPAED':
			case 'IMPUAED':
				getSkills = window.type.Stickies;
				break;
			case 'Cluster':
				getSkills = window.type.Clusters;
				break;
			default:
				getSkills = window.type.AllSkills;
				break;
		}
		// Melee

		power.BR = 0;
		power.BRM = 1;
		power.PRM = 1;
		power.BEM = 1;
		power.BE = 0;
		power.PEM = 1;

		if (Object.hasOwn(Attacks, 'unique')) {
			getSkills = getSkills.concat(Attacks.unique);
		}

		getSkills = monEnrage.val() === 'Enraged' ? getSkills.concat(['Agitator']) : getSkills;

		for (let i = 0; i < $('.skillButton').length; ++i) {
			if (document.getElementsByClassName('skillButton')[i].style.background !== 'gray') {
				const skills = JSON.parse($('.skillButton')[i].value);

				power.BRM *= skills.BRM;
				power.BR += skills.BR;
				power.PRM *= skills.PRM;
				power.BEM *= skills.BEM;
				power.BE += skills.BE;
				power.PEM *= skills.PEM;
				power.bAFF += skills.Affinity;
			}
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
				power.bAFF += skills.Affinity;
			}
		});
		let [augEFR, augPRM, augPEM] = [1, 1, 1];

		if (Object.hasOwn(window.type, weapRamp0.val())) {
			for (let i = 0; i < window.type[weapRamp0.val()].Monsters.length; ++i) {
				if (window.type[weapRamp0.val()].Monsters[i] === mon.val()) {
					({ augPEM, augPRM } = window.type[weapRamp0.val()]);
				}
			}
		} // Anti-Skills
		power.PEM *=
			weapRamp0.value === 'Elemental Exploit' && window.monster[mon.val()].HitZone[monHZ.val()][power.eleType] >= 25 ? 1.3 : 1;

		augPEM = weapRamp0.value === 'Valstrax Soul' && power.eleType === 'Dragon' ? 1.2 : augPEM;
		[augEFR, augPRM] = weapRamp0.value === 'Dulling Strike' && /(2)|(3)|(1)/.test(Sharpness.selectedIndex) ? [1.02, 1.2] : [1, 1];

		power.BRM *= weapRamp0.value === 'Bludgeoner' && Sharpness.selectedIndex === 3 ? [1.05] : [1];
		power.BRM *= (weapRamp0.value === 'Bludgeoner' && Sharpness.selectedIndex === 2) || Sharpness.selectedIndex === 1 ? [1.1] : [1];

		rawHZV *= DemonAmmo.style.background !== 'gray' && /(Sever)|(Blunt)/.test(type) ? 1.1 : 1;

		if (WaterBlight.style.background !== 'gray' && /(Sever)|(Blunt)|(Shot)/.test(type) && rawHZV < 60) {
			rawHZV += 25;
		} else if (WaterBlight.style.background !== 'gray' && /(Sever)|(Blunt)|(Shot)/.test(type) && rawHZV >= 60) {
			rawHZV += 3;
		}

		const WEX = JSON.parse($('#Weakness_Exploit').val());
		power.bAFF = rawHZV >= 45 ? power.bAFF + WEX : power.bAFF;

		power.bAFF = Math.min(power.bAFF, 100) / 100;
		let entranceCheck1 = '';
		let entranceCheck2 = 0;
		$('.hitsOfSharp').each(function () {
			entranceCheck1 += $(this).val();
		});
		$('.hitsOfSharpInputs').each(function () {
			entranceCheck2 += $(this).val();
		});
		if (
			(previousEntranceCheck1 !== entranceCheck1 && previousEntranceCheck2 === entranceCheck2) ||
			(previousEntranceCheck1 === entranceCheck1 && previousEntranceCheck2 !== entranceCheck2 && previousEntranceCheck2 !== 0) ||
			previousEntranceCheck1 === ''
		) {
			if (!/Bow/.test(weapType.val())) {
				previousEntranceCheck1 = entranceCheck1;
				previousEntranceCheck2 = entranceCheck2 === 0 ? 1 : entranceCheck2;
				HitsOfSharpness(power.bAFF);
			}
		}
		[sharpnessModifier.PRM, sharpnessModifier.PEM] = [JSON.parse(Sharpness.value).PRM, JSON.parse(Sharpness.value).PEM];
		power.PRM *=
			~~(0.1 + 25 / sharpnessModifier.PRM) >= window.monster[mon.val()].HitZone[monHZ.val()][type]
				? json.parse(document.getElementById(['Minds_Eye']).value).PRM
				: 1;
		let critBoost = /(Sever)|(Blunt)|(Shot)/.test(type) ? JSON.parse($('#Critical_Boost').val()).PRM : 1;
		let efrMulti = 1 + (critBoost - 1) * power.bAFF;
		const brutalEFR = (power.bAFF - power.bAFF * 2) * 0.25 * 0.5 + (power.bAFF - power.bAFF * 2) * -0.25 * 0.75;

		[efrMulti, critBoost] = weapRamp0.val() === 'Brutal Strike' && power.bAFF < 0 ? [1 + brutalEFR, 1.5] : [efrMulti, critBoost];

		const eleCritBoost = /(Sever)|(Blunt)|(Shot)/.test(type) ? JSON.parse($('#Critical_Element').val()).PEM : 1;
		// Melee;
		const raw = Math.min(power.baseRaw * power.BRM + power.BR, power.baseRaw * 3);
		const rawFormula = (raw * power.PRM * augPRM * rawHZV * power.enrage * rawMV) / 10000;
		power.rawNon = rawFormula * JSON.parse(felineMarksmanid.value)[0];
		power.efr = rawFormula * efrMulti * JSON.parse(felineMarksmanid.value)[1];
		power.rawCrit = rawFormula * critBoost * JSON.parse(felineMarksmanid.value)[0];
		const ele = Math.min(power.baseEle * power.BEM + power.BE, power.baseEle * 3);
		const efeMulti = 1 + (eleCritBoost - 1) * power.bAFF;
		const eleFormula = (ele * power.PEM * eleHZV * power.enrage * eleMV * augPEM) / 100;
		power.eleNon = eleFormula > 0 && eleFormula < 1 ? 1 : ~~(0.1 + eleFormula);
		power.efe = eleFormula * efeMulti > 0 && eleFormula * efeMulti < 1 ? 1 : ~~(0.1 + eleFormula * efeMulti);
		power.eleCrit = eleFormula * eleCritBoost > 0 && eleFormula * eleCritBoost < 1 ? 1 : ~~(0.1 + eleFormula * eleCritBoost);
		const ticsPer = Object.hasOwn(window.attack[weapType.val()][attackName], 'TicsPer')
			? window.attack[weapType.val()][attackName].TicsPer
			: 1;
		// const totalEffective = (efr + efe) * ticsPer;
		// const totalCrit = (rawCrit + eleCrit) * ticsPer;
		// const totalNon = (rawNon + eleNon) * ticsPer;
		// const rawBoth = [].concat(`${rawNon} / ${rawCrit}`);
		// const eleBoth = [].concat(`${eleNon} / ${eleCrit}`);
		// const totalDmg = [].concat(`${totalNon} / ${totalCrit}`);
		const damage = {
			'replaceME': 'replaceME',
			'Attack Name': attackName,
			'MV': rawMV,
			'Raw': `${~~(0.1 + power.rawNon * sharpnessModifier.PRM)} / ${~~(0.1 + power.rawCrit * sharpnessModifier.PRM)}`,
			'Ele': `${~~(0.1 + power.eleNon * sharpnessModifier.PEM)} / ${~~(0.1 + power.eleCrit * sharpnessModifier.PEM)}`,
			'Total': `${~~(0.1 + power.rawNon * sharpnessModifier.PRM) + ~~(0.1 + power.eleNon * sharpnessModifier.PEM)} / ${
				~~(0.1 + power.rawCrit * sharpnessModifier.PRM) + ~~(0.1 + power.eleCrit * sharpnessModifier.PEM)
			}`,
			'EFR': ~~(0.1 + power.efr * sharpnessModifier.PRM),
			'EFE': ~~(0.1 + power.efe * sharpnessModifier.PEM),
			'Effective': ~~(0.1 + power.efe * sharpnessModifier.PEM) + ~~(0.1 + power.efr * sharpnessModifier.PRM),
		};
		// Melee

		meleeDamage = [].concat(meleeDamage, damage);
		if (attackName === 'Combo Damage') {
			stats = [
				['Base', ~~power.baseRaw, +[window.weapon[weapType.val()][weap.val()].AFF], power.baseEle],
				['Cap', ~~raw, ~~(power.bAFF * 100), ~~ele],
				[
					'Post Cap',

					~~(raw * critBoost * power.PRM * power.enrage * augPRM * JSON.parse(felineMarksmanid.value)[0] * sharpnessModifier.PRM),
					~~(power.bAFF * 100),
					~~(ele * eleCritBoost * power.PEM * power.enrage * augPEM * sharpnessModifier.PEM),
				],
				[
					'Effective',
					~~(raw * efrMulti * power.PRM * power.enrage * augEFR * JSON.parse(felineMarksmanid.value)[1] * sharpnessModifier.PRM),
					~~(power.bAFF * 100),
					~~(ele * efeMulti * power.PEM * augPEM * power.enrage * augEFR * sharpnessModifier.PEM),
				],
			];
		}
		let comboRawNon = 0;
		let comboRawCrit = 0;
		let comboEFR = 0;
		let comboEFE = 0;
		let comboEleNon = 0;
		let comboEleCrit = 0;
		const comboSharp = HitsOfSharpness();
		if (Object.prototype.hasOwnProperty.call(comboSharp, 2) && c > 0) {
			if (comboSharp[c].length > 0) {
				for (let k = 0; k < 6; k++) {
					comboRawNon += comboSharp[c][k][1] * ~~(0.1 + power.rawNon * comboSharp[c][k][0]);
					comboRawCrit += ~~(0.1 + power.rawCrit * comboSharp[c][k][0]) * comboSharp[c][k][1];
					comboEleNon += comboRawNon += comboSharp[c][k][1] * ~~(0.1 + power.eleNon * comboSharp[c][k][2]);
					comboEleCrit += comboRawCrit += ~~(0.1 + power.eleCrit * comboSharp[c][k][2]) * comboSharp[c][k][1];
					comboEFR += ~~(0.1 + power.efr * comboSharp[c][k][0]) * comboSharp[c][k][1];
					comboEFE += ~~(0.1 + power.efe * comboSharp[c][k][2]) * comboSharp[c][k][1];
				}
			}
		}
		// : ;
		++c;
		const [...dps] = [
			rawMV,
			comboRawNon,
			comboRawCrit,
			comboEleNon,
			comboEleCrit,
			comboRawNon + comboEleNon,
			comboRawCrit + comboEleCrit,
			comboEFR,
			comboEFE,
			comboEFR + comboEFE,
		];

		DPS = DPS.concat([dps]);
	});
	const statsHeaders = ['Stat', 'Raw', 'Affinity', power.eleType];
	const meleeHeaders = ['Combo', 'Attack Name', 'MV', 'Raw', 'Element', 'Total', 'EFR', 'EFE', 'Effective'];

	BuildTableDamage(stats, statsHeaders, (id = 'stats'));
	BuildTableDamage(meleeDamage, meleeHeaders, (id = 'dps'));
	console.table(DPS);
	return DPS;
}
const BuildTableDamage = (myDamage, headers, id) => {
	const inputs = document.querySelectorAll('.a');
	let k = 0;

	/*
	 * Const myTable = document.querySelector([
	 * document.getElementById(`${id}Table`),
	 * ]);
	 */
	const myHeader = document.querySelector(`#${id}Head`),
		myBody = document.querySelector(`#${id}Body`),
		table = document.createElement('table'),
		tHead = document.createElement('thead'),
		headerRow = document.createElement('tr'),
		tBody = document.createElement('tbody');

	headers.forEach((headerText) => {
		const header = document.createElement('th'),
			textNode = document.createTextNode(headerText);

		header.appendChild(textNode);
		headerRow.appendChild(header);
	});

	tHead.appendChild(headerRow);
	myHeader.replaceWith(tHead);
	myDamage.forEach((Attack) => {
		const row = document.createElement('tr');

		Object.values(Attack).forEach((text) => {
			if (text === 'replaceME') {
				if ($('#current').val() === weapType.val() && inputs.length > 0) {
					row.appendChild(inputs[k]);
					++k;
				} else {
					const cell = document.createElement('td'),
						adjuster = document.createElement('input');

					adjuster.setAttribute('type', 'Number');
					adjuster.setAttribute('class', 'Combo skill');
					adjuster.setAttribute('Max', 20);
					if (k === 0) {
						adjuster.setAttribute('id', 'comboMultiplier');
						adjuster.setAttribute('Min', 1);
						adjuster.setAttribute('value', 1);
						adjuster.setAttribute('class', 'comboMultiplier hitsOfSharpInputs');
					} else {
						adjuster.setAttribute('id', k);
						adjuster.setAttribute('class', 'inputs hitsOfSharpInputs');
						adjuster.setAttribute('Min', 0);
						adjuster.setAttribute('value', 0);
					}
					++k;
					adjuster.setAttribute('onChange', 'DataCompile()');
					cell.appendChild(adjuster);
					row.appendChild(cell);
				}
			} else {
				const cell = document.createElement('td'),
					textNode = document.createTextNode(text);

				cell.appendChild(textNode);
				row.appendChild(cell);
			}
		});
		tBody.appendChild(row);
		myBody.replaceWith(tBody);
	});
	table.setAttribute('id', `${id}Table`);
	tHead.setAttribute('id', `${id}Head`);
	tBody.setAttribute('id', `${id}Body`);
	tBody.className = /(BowGun)/.test(weapType.val()) ? 'rangedTable' : 'meleeTable';
	// MyTable.replaceWith(table);
	dpsTable.style = 'display:block';
	ammoTable.style = 'display:none';

	if (id !== 'stats' && id !== 'ammo') {
		const [len, ...column] = /BowGun/.test(weapType.val())
			? [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
			: [k, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

		$('#current').val(weapType.val());
		for (let i = 0; i < len; ++i) {
			let j = 0;

			column.forEach((letter) => {
				$(`#${id}Body`)[0].children[i].children[j].className = `${letter} ${i}`;
				$(`#${id}Body`)[0].children[i].children[j].id = letter + i;
				++j;
			});
		}
	}
};

function ChangeTypes() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7 && (redKeyCard || window.event.path[0] === weapType[0])) {
		for (let i = 0; i < $('.classSpecific').length; ++i) {
			$('.classSpecific')[i].parentNode.style = 'display:none';
			$('.classSpecific')[i].selectedIndex = 0;
			Weapid.parentNode.style = 'display:none';
			Weapid.innerHTML = '';
		}
		if (/(Bow)/.test(weapType.val())) {
			Weapid.append(`${[weapType.val()]}`);
			Weapid.parentNode.style = 'display:grid';
			$('#sharpContainer').style = 'display:none';
			if (/(BowGun)/.test(weapType.val())) {
				$('#resetCombo').style = 'display:none';
				$('#ammoChange').style = 'display:grid';
			} else {
				$('#resetCombo').style = 'display:grid';
				$('#ammoChange').style = 'display:none';
			}
			for (let i = 0; i < $(`.${weapType.val()}`).length; ++i) {
				$(`.${weapType.val()}`)[i].parentNode.style = 'display:grid';
			}
			for (let i = 0; i < $('.Shot').length; ++i) {
				$('.Shot')[i].parentNode.style = 'display:grid';
			}
		} else if (/(InsectGlaive)|(ChargeBlade)|(LongSword)/.test(weapType.val())) {
			Weapid.innerHTML = `${[weapType.val()]} Skills`;
			Weapid.parentNode.style = 'display:grid';
			$('#ammoChange').style = 'display:none';
			$('#resetCombo').style = 'display:grid';

			for (let i = 0; i < $(`.${weapType.val()}`).length; ++i) {
				$(`.${weapType.val()}`)[i].parentNode.style = 'display:grid';
			}
			for (let i = 0; i < $('.melee').length; ++i) {
				$('.melee')[i].parentNode.style = 'display:grid';
			}
		} else {
			for (let i = 0; i < $('.melee').length; ++i) {
				$('.melee')[i].parentNode.style = 'display:grid';
				document.getElementById('ammoChange').style = 'display:none';
				document.getElementById('resetCombo').style = 'display:grid';
			}
		}
		if (weapType.val() === 'ChargeBlade' && window.weapon[weapType.val()][weap.val()].Phial === 'Impact Phial') {
			shieldChargeEleid.parentNode.style = 'display:none';
			shieldChargeIMPid.parentNode.style = 'display:grid';
		} else if (weapType.val() === 'ChargeBlade' && window.weapon[weapType.val()][weap.val()].Phial === 'Element Phial') {
			shieldChargeIMPid.parentNode.style = 'display:none';
			shieldChargeEleid.parentNode.style = 'display:grid';
		}
		let uniqueColumns = 0;

		$.each($('#unique').children(), (data) => {
			if ($('#unique').children()[data].style.display === 'grid') {
				++uniqueColumns;
			}
		});
		if (uniqueColumns > 1) {
			$('#unique')[0].style = `grid-template-columns: repeat(${Math.min(uniqueColumns, 4)}, 1fr)`;
		}
		redKeyCard = false;
	}
}

function MaxSkills() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		for (let i = 0; i < $('.skill').length; ++i) {
			$('.skill')[i].selectedIndex = $('.skill')[i].hidden ? 0 : Object.values($('.skill')[i]).length - 1;
		}
	}
}

function ResetSkills() {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		for (let i = 0; i < $('.skill').length; ++i) {
			$('.skill')[i].selectedIndex = 0;
		}
	}
}

function MonChart() {
	if (Object.hasOwn(window, 'monster')) {
		const headers = [`${mon.val()}`, 'Sever', 'Blunt', 'Shot', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon'],
			table = document.createElement('table'),
			mons = window.monster[mon.val()].HitZone,
			myTable = document.querySelector('#monTable'),
			headerRow = document.createElement('tr');

		headers.forEach((headerText) => {
			const header = document.createElement('th'),
				textNode = document.createTextNode(headerText);

			header.appendChild(textNode);
			headerRow.appendChild(header);
		});

		table.appendChild(headerRow);
		for (let i = 0; i < Object.keys(mons).length; ++i) {
			const row = document.createElement('tr'),
				HZV = [].concat(Object.keys(mons)[i], Object.values(mons[Object.keys(mons)[i]]));

			for (let j = 0; j < 9; ++j) {
				const cell = document.createElement('td');

				HZV[j] = DemonAmmo.style.background !== 'gray' && i > 0 && (j === 1 || j === 2) ? ~~(HZV[j] *= 1.1) : HZV[j];
				if (WaterBlight.style.background !== 'gray' && i > 0 && (j === 1 || j === 2 || j === 3) && HZV[j] < 60) {
					HZV[j] += 25;
				} else if (WaterBlight.style.background !== 'gray' && i > 0 && (j === 1 || j === 2 || j === 3) && HZV[j] >= 60) {
					HZV[j] += 3;
				}

				const textNode = document.createTextNode(HZV[j]);

				if (HZV[j] < 14) {
					cell.setAttribute('class', 'F');
				} else if (HZV[j] < 25) {
					cell.setAttribute('class', 'C');
				} else if (HZV[j] < 45) {
					cell.setAttribute('class', 'B');
				} else if (HZV[j] < 70) {
					cell.setAttribute('class', 'A');
				} else if (HZV[j] >= 70) {
					cell.setAttribute('class', 'S');
				}
				cell.appendChild(textNode);
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		table.setAttribute('id', 'monTable');
		myTable.replaceWith(table);
		$('#monTable > tr:nth-child(1) > th:nth-child(1)').replaceWith(mon);
	}
}

function SkillButtonToggle() {
	if (window.event.target.style.background !== 'gray') {
		window.event.target.style.background = 'gray';
		window.event.target.style.color = 'midnightblue';
	} else {
		window.event.target.style.background = '';
		window.event.target.style.color = '';
	}
}
function Toggle() {
	dpsTable.style = dpsTable.style.display === 'block' ? 'display:none' : 'display:block';

	ammoTable.style = dpsTable.style.display === 'block' ? 'display:none' : 'display:block';
}

//resets the combo inputs to minimum values
function ComboReset() {
	if (window.event.path[0] === (resetCombo || weapType) || redKeyCard) {
	}
	comboTracker = [];
	{
		$('.inputs').val(0);
		comboMultiplier.value = 1;
	}
	d0.innerHTML = `${0}/${0}`;
	e0.innerHTML = `${0}/${0}`;
	f0.innerHTML = `${0}/${0}`;
	[c0.innerHTML, , , , , , , g0.innerHTML, h0.innerHTML, i0.innerHTML] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}
// finds HitsOfSharpness per color as well as the total modifier to be used for the combo damage calculation
function HitsOfSharpness(affinity) {
	let comboCount = [];
	const total = {};
	let [whiteMin, whiteMax] = window.sharp[weapType.val()][weap.val()].Sharpness.white;
	let [blueMin, blueMax] = window.sharp[weapType.val()][weap.val()].Sharpness.blue;
	let [greenMin, greenMax] = window.sharp[weapType.val()][weap.val()].Sharpness.green;
	let [yellowMin, yellowMax] = window.sharp[weapType.val()][weap.val()].Sharpness.yellow;
	let [orangeMin, orangeMax] = window.sharp[weapType.val()][weap.val()].Sharpness.orange;
	let [redMin, redMax] = window.sharp[weapType.val()][weap.val()].Sharpness.red;

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

	if (window.event !== undefined) {
		comboTracker =
			window.event.path.length > 0 && window.event.path[0].className === 'inputs hitsOfSharpInputs'
				? comboTracker.concat(window.event.path[0].id)
				: comboTracker;
	}
	let comboCheck = 0;
	comboinputs = document.querySelectorAll('.inputs');
	for (let i = 0; i < comboinputs.length; i++) {
		if (parseFloat(comboinputs[i].value) > 0) {
			comboCheck += parseFloat(comboinputs[i].value);
		}
	}
	if (comboTracker.length == comboCheck + 2) {
		const eventTrigger = comboTracker.pop();
		const undo = comboTracker.lastIndexOf(eventTrigger);
		comboTracker.splice(undo, 1);
	}

	for (let i = 0; i < comboMultiplier.value; i++) {
		comboCount = comboCount.concat(comboTracker);
	}
	let hits = comboCount.length;
	const mTBonus = affinity > 0 ? 5 * (1 + +mastersTouch.value * affinity) : 5;

	total.white = ~~(mTBonus * whiteMin);
	total.blue = ~~(mTBonus * blueMin);
	total.green = ~~(mTBonus * greenMin);
	total.yellow = ~~(mTBonus * yellowMin);
	total.orange = ~~(mTBonus * orangeMin);
	total.red = ~~(mTBonus * redMin);

	[whiteMin, hits] = hits - total.white > 0 ? [0, hits - total.white] : [total.white - hits, 0];
	[blueMin, hits] = hits > 0 && hits - total.blue > 0 ? [0, hits - total.blue] : [total.blue - hits, 0];
	[greenMin, hits] = hits > 0 && hits - total.green > 0 ? [0, hits - total.green] : [total.green - hits, 0];
	[yellowMin, hits] = hits > 0 && hits - total.yellow > 0 ? [0, hits - total.yellow] : [total.yellow - hits, 0];
	[orangeMin, hits] = hits > 0 && hits - total.orange > 0 ? [0, hits - total.orange] : [total.orange - hits, 0];
	[redMin, hits] = hits > 0 && hits - total.red > 0 ? [0, hits - total.red] : [total.red - hits, 0];

	white.parentNode.style = `display:grid; width:${[5 * (whiteMax + blueMax + greenMax + yellowMax + orangeMax + redMax)]}px`;
	white.style.width = [`${whiteMin}px`];
	blue.style.width = [`${blueMin}px`];
	green.style.width = [`${greenMin}px`];
	yellow.style.width = [`${yellowMin}px`];
	orange.style.width = [`${orangeMin}px`];
	red.style.width = [`${redMin}px`];

	white.innerHTML = whiteMin > 0 ? whiteMin : '';
	blue.innerHTML = blueMin > 0 ? blueMin : '';
	green.innerHTML = greenMin > 0 ? greenMin : '';
	yellow.innerHTML = yellowMin > 0 ? yellowMin : '';
	orange.innerHTML = orangeMin > 0 ? orangeMin : '';
	red.innerHTML = redMin > 0 ? redMin : '';

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
	const hitsOfSharpUsed = {};
	hitsOfSharpUsed.white = comboCount.splice(0, total.white);
	hitsOfSharpUsed.blue = comboCount.splice(0, total.blue);
	hitsOfSharpUsed.green = comboCount.splice(0, total.green);
	hitsOfSharpUsed.yellow = comboCount.splice(0, total.yellow);
	hitsOfSharpUsed.orange = comboCount.splice(0, total.orange);
	hitsOfSharpUsed.red = comboCount.splice(0, total.red);
	let attackID = 0;
	let results = [];
	results[0] = 0;

	$('.inputs').each(function (index, element) {
		let totalMultiplier = [];
		attackID = Number(this.id);
		let totalHits = 0;
		// this === window.event.path[0]
		// ? comboMultiplier.value* (1 + this.value)
		// : comboMultiplier.value * this.value;

		if ($(this).val() > 0) {
			$.each(Object.keys(hitsOfSharpUsed), (value, color) => {
				totalMultiplier = [].concat(totalMultiplier, [
					[window.sharp.mod[color].PRM, hitsOfSharpUsed[color].filter((x) => x == attackID).length, window.sharp.mod[color].PEM],
				]);

				totalHits = [].concat();
			});
		}
		// const resultsLog = totalMulttiplier / totalHits;
		results = results.concat([totalMultiplier]);
	});
	console.table(results);
	return results;
}

function ComboDamage(DPS = MeleeDPS()) {
	if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
		const comboResult = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let i = 1; i < DPS.length; ++i) {
			// reduces the results from every attack/damage category

			for (let j = 0; j < DPS[1].length; ++j) {
				comboResult[j] += DPS[i - 1][j];
			}
		}
		d0.innerHTML = `${comboResult[1]}/${comboResult[2]}`;
		e0.innerHTML = `${comboResult[3]}/${comboResult[4]}`;
		f0.innerHTML = `${comboResult[5]}/${comboResult[6]}`;
		[, , , , , , , g0.innerHTML, h0.innerHTML, i0.innerHTML] = comboResult;

		// Adds the ticsPer attack to the combo MV
		c0.textContent = '';
		let tempC = 0;

		for (let i = 0; i < $('.inputs').length; ++i) {
			if ($('.inputs')[i].value > 0) {
				if (Object.prototype.hasOwnProperty.call(window.attack[weapType.val()][$('.b')[i].textContent], 'TicsPer')) {
					tempC +=
						$('.inputs')[i].value *
						$('.c')[i + 1].textContent *
						window.attack[weapType.val()][$('.b')[i].textContent].TicsPer *
						comboMultiplier.value;
				} else {
					tempC += $('.inputs')[i].value * $('.c')[i + 1].textContent * comboMultiplier.value;
				}
			}
		}
		c0.textContent = tempC;
	}
}

// Event to fire when quest and monster data loaded successfully.
$(document).ajaxSuccess(() => {
	if (!arg1 || !arg2 || !arg3 || !arg4 || !arg5 || !arg6 || !arg7) {
		arg1 = window.event.target.responseURL === URLAttack || arg1 === true;
		arg2 = window.event.target.responseURL === URLMonster || arg2 === true;
		arg3 = window.event.target.responseURL === URLQuest || arg3 === true;
		arg4 = window.event.target.responseURL === URLRampage || arg4 === true;
		arg5 = window.event.target.responseURL === URLSharp || arg5 === true;
		arg6 = window.event.target.responseURL === URLType || arg6 === true;
		arg7 = window.event.target.responseURL === URLWeapon || arg7 === true;
		if (arg1 && arg2 && arg3 && arg4 && arg5 && arg6 && arg7) {
			WeaponSelect();
			RampageSelect();
			PartSelect();
			QuestSelect();
			HealthSelect();
			MonChart();
			ChangeTypes((redKeyCard = true));
			DataCompile();
			ComboReset((redKeyCard = true));
		}
	}
});
