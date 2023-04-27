/*! For license information please see setBuildWorker.js.LICENSE.txt */
(() => {
    "use strict";
    var e = {
        "./srcfiles/json/types.json": e => {
            e.exports = JSON.parse('{"decos":{"AffinitySliding":1,"BlastResistance":1,"Bombardier":1,"Botanist":1,"CarvingPro":1,"ChameleosBlessing":1,"DefenseBoost":1,"Defiance":1,"Diversion":1,"DragonAttack":1,"DragonResistance":1,"FireAttack":1,"FireResistance":1,"FlinchFree":1,"FreeMeal":1,"Geologist":1,"HornMaestro":1,"HungerResistance":1,"IceAttack":1,"IceResistance":1,"IntrepidHeart":1,"KushalaBlessing":1,"LeapofFaith":1,"MuckResistance":1,"ParalysisResistance":1,"PoisonAttack":1,"PoisonResistance":1,"RecoilDown":1,"RecoverySpeed":1,"ReloadSpeed":1,"ShockAbsorber":1,"SleepResistance":1,"SpeedSharpening":1,"SpiribirdsCall":1,"StaminaThief":1,"Steadiness":1,"StunResistance":1,"TeostraBlessing":1,"ThunderAttack":1,"ThunderResistance":1,"WallRunner(Boost)":1,"WaterAttack":1,"WaterResistance":1,"Windproof":1,"AdrenalineRush":2,"Agitator":2,"Artillery":2,"AttackBoost":2,"Ballistics":2,"BladescaleHone":2,"BlastAttack":2,"BlightResistance":2,"Bludgeoner":2,"BubblyDance":2,"Burst":2,"ChargeMaster":2,"Coalescence":2,"Constitution":2,"Counterstrike":2,"CriticalBoost":2,"CriticalElement":2,"CriticalEye":2,"DivineBlessing":2,"ElementExploit":2,"Embolden":2,"EvadeExtender":2,"EvadeWindow":2,"Focus":2,"Foray":2,"Fortify":2,"Guard":2,"GuardUp":2,"Heroics":2,"ItemProlonger":2,"LatentPower":2,"LoadShells":2,"MarathonRunner":2,"MasterMounter":2,"MastersTouch":2,"MaximumMight":2,"MindsEye":2,"ParalysisAttack":2,"Partbreaker":2,"PeakPerformance":2,"PowerProlonger":2,"ProtectivePolish":2,"PunishingDraw":2,"QuickSheathe":2,"RapidMorph":2,"RazorSharp":2,"RecoveryUp":2,"Resentment":2,"Resuscitate":2,"SleepAttack":2,"Slugger":2,"SneakAttack":2,"SpareShot":2,"SpecialAmmoBoost":2,"SpeedEating":2,"StaminaSurge":2,"TremorResistance":2,"WallRunner":2,"WeaknessExploit":2,"Wide-Range":2,"WirebugWhisperer":2,"AmmoUp":3,"BloodRite":3,"CriticalDraw":3,"Earplugs":3,"GoodLuck":3,"Grinder(S)":3,"Handicraft":3,"HellfireCloak":3,"JumpMaster":3,"Mushroomancer":3,"Normal/RapidUp":3,"OffensiveGuard":3,"PierceUp":3,"QuickBreath":3,"RapidFireUp":3,"Redirection":3,"SpreadUp":3,"StatusTrigger":3,"Tune-Up":3,"Bloodlust":4,"BowChargePlus":4,"Dragonheart":4},"maxLevel":{"AttackBoost":7,"Agitator":5,"PeakPerformance":3,"Resentment":5,"Resuscitate":3,"CriticalEye":7,"CriticalBoost":3,"WeaknessExploit":3,"LatentPower":5,"MaximumMight":3,"CriticalElement":3,"MastersTouch":3,"FireAttack":5,"WaterAttack":5,"IceAttack":5,"ThunderAttack":5,"DragonAttack":5,"PoisonAttack":3,"ParalysisAttack":3,"SleepAttack":3,"BlastAttack":3,"Handicraft":5,"RazorSharp":3,"SpareShot":3,"ProtectivePolish":3,"MindsEye":3,"Ballistics":3,"Bludgeoner":3,"BowChargePlus":1,"Focus":3,"PowerProlonger":3,"MarathonRunner":3,"Constitution":5,"StaminaSurge":3,"Guard":5,"GuardUp":3,"OffensiveGuard":3,"CriticalDraw":3,"PunishingDraw":3,"QuickSheathe":3,"Slugger":3,"StaminaThief":3,"AffinitySliding":1,"HornMaestro":1,"Artillery":3,"LoadShells":2,"SpecialAmmoBoost":2,"Normal/RapidUp":3,"PierceUp":3,"SpreadUp":3,"AmmoUp":3,"ReloadSpeed":3,"RecoilDown":3,"Steadiness":3,"RapidFireUp":3,"DefenseBoost":7,"DivineBlessing":3,"RecoveryUp":3,"RecoverySpeed":3,"SpeedEating":3,"Earplugs":5,"Windproof":3,"TremorResistance":3,"BubblyDance":3,"EvadeWindow":5,"EvadeExtender":3,"FireResistance":3,"WaterResistance":3,"IceResistance":3,"ThunderResistance":3,"DragonResistance":3,"BlightResistance":3,"PoisonResistance":3,"ParalysisResistance":3,"SleepResistance":3,"StunResistance":3,"MuckResistance":2,"BlastResistance":3,"Botanist":4,"Geologist":3,"Partbreaker":3,"CaptureMaster":1,"CarvingMaster":1,"GoodLuck":3,"SpeedSharpening":3,"Bombardier":3,"Mushroomancer":3,"ItemProlonger":3,"Wide-Range":5,"FreeMeal":3,"Heroics":5,"Fortify":1,"FlinchFree":3,"JumpMaster":1,"CarvingPro":1,"HungerResistance":3,"LeapofFaith":1,"Diversion":1,"MasterMounter":1,"ChameleosBlessing":4,"KushalaBlessing":4,"TeostraBlessing":4,"Dragonheart":5,"WirebugWhisperer":3,"WallRunner":3,"Counterstrike":3,"RapidMorph":3,"HellfireCloak":4,"WindAlignment":5,"ThunderAlignment":5,"Stormsoul":5,"BloodRite":3,"Dereliction":3,"Furious":3,"MailofHellfire":3,"Coalescence":3,"Bloodlust":3,"Defiance":5,"SneakAttack":3,"AdrenalineRush":3,"Redirection":2,"SpiribirdsCall":1,"ChargeMaster":3,"Foray":3,"Tune-Up":2,"Grinder(S)":3,"BladescaleHone":3,"WallRunner(Boost)":1,"QuickBreath":1,"ElementExploit":3,"Burst":3,"Guts":3,"StatusTrigger":3,"IntrepidHeart":2,"BuildupBoost":3,"Embolden":3,"WindMantle":3,"PowderMantle":3,"Berserk":2,"Strife":3,"Frostcraft":3,"DragonConversion":3,"Heaven-Sent":3,"FrenziedBloodlust":3,"ShockAbsorber":1},"qurious":{"AmmoUp":15,"AttackBoost":15,"CriticalBoost":15,"CriticalEye":15,"Guts":15,"MastersTouch":15,"Normal/RapidUp":15,"PierceUp":15,"RapidFireUp":15,"RazorSharp":15,"SpareShot":15,"SpreadUp":15,"WeaknessExploit":15,"Agitator":12,"Artillery":12,"BloodRite":12,"Bloodlust":12,"BuildupBoost":12,"Burst":12,"Coalescence":12,"DragonConversion":12,"Frostcraft":12,"GoodLuck":12,"Handicraft":12,"LatentPower":12,"MaximumMight":12,"PeakPerformance":12,"RapidMorph":12,"Resentment":12,"Resuscitate":12,"SneakAttack":12,"Tune-Up":12,"AdrenalineRush":9,"Ballistics":9,"BladescaleHone":9,"ChargeMaster":9,"CriticalDraw":9,"CriticalElement":9,"Dragonheart":9,"Earplugs":9,"ElementExploit":9,"Focus":9,"Foray":9,"Furious":9,"Grinder(S)":9,"HellfireCloak":9,"Heroics":9,"MailofHellfire":9,"MindsEye":9,"Mushroomancer":9,"OffensiveGuard":9,"PowderMantle":9,"PowerProlonger":9,"ProtectivePolish":9,"Redirection":9,"StatusTrigger":9,"Strife":9,"WindMantle":9,"WirebugWhisperer":9,"BlastAttack":6,"BubblyDance":6,"ChameleosBlessing":6,"Constitution":6,"Counterstrike":6,"Defiance":6,"Embolden":6,"EvadeExtender":6,"EvadeWindow":6,"Guard":6,"GuardUp":6,"IntrepidHeart":6,"KushalaBlessing":6,"LoadShells":6,"MarathonRunner":6,"ParalysisAttack":6,"Partbreaker":6,"PoisonAttack":6,"PunishingDraw":6,"QuickSheathe":6,"RecoilDown":6,"ReloadSpeed":6,"SleepAttack":6,"Slugger":6,"SpecialAmmoBoost":6,"SpeedEating":6,"StaminaSurge":6,"Steadiness":6,"TeostraBlessing":6,"TremorResistance":6,"WallRunner":6,"AffinitySliding":3,"BlastResistance":3,"BlightResistance":3,"DefenseBoost":3,"Diversion":3,"DivineBlessing":3,"DragonAttack":3,"FireAttack":3,"FlinchFree":3,"Fortify":3,"FreeMeal":3,"HornMaestro":3,"HungerResistance":3,"IceAttack":3,"ItemProlonger":3,"LeapofFaith":3,"MasterMounter":3,"MuckResistance":3,"ParalysisResistance":3,"PoisonResistance":3,"RecoverySpeed":3,"RecoveryUp":3,"SleepResistance":3,"SpeedSharpening":3,"SpiribirdsCall":3,"StaminaThief":3,"StunResistance":3,"ThunderAttack":3,"WallRunner(Boost)":3,"WaterAttack":3,"Wide-Range":3,"Windproof":3},"decoLevels":[[{"AffinitySliding":1},{"BlastResistance":1},{"Bombardier":1},{"Botanist":1},{"CarvingPro":1},{"ChameleosBlessing":1},{"DefenseBoost":1},{"Defiance":1},{"Diversion":1},{"DragonAttack":1},{"DragonResistance":1},{"FireAttack":1},{"FireResistance":1},{"FlinchFree":1},{"FreeMeal":1},{"Geologist":1},{"HornMaestro":1},{"HungerResistance":1},{"IceAttack":1},{"IceResistance":1},{"IntrepidHeart":1},{"KushalaBlessing":1},{"LeapofFaith":1},{"MuckResistance":1},{"ParalysisResistance":1},{"PoisonAttack":1},{"PoisonResistance":1},{"RecoilDown":1},{"RecoverySpeed":1},{"ReloadSpeed":1},{"ShockAbsorber":1},{"SleepResistance":1},{"SpeedSharpening":1},{"SpiribirdsCall":1},{"StaminaThief":1},{"Steadiness":1},{"StunResistance":1},{"TeostraBlessing":1},{"ThunderAttack":1},{"ThunderResistance":1},{"WallRunner(Boost)":1},{"WaterAttack":1},{"WaterResistance":1},{"Windproof":1}],[{"AdrenalineRush":1},{"Agitator":1},{"Artillery":1},{"AttackBoost":1},{"Ballistics":1},{"BladescaleHone":1},{"BlastAttack":1},{"BlightResistance":1},{"Bludgeoner":1},{"BubblyDance":1},{"Burst":1},{"ChargeMaster":1},{"Coalescence":1},{"Constitution":1},{"Counterstrike":1},{"CriticalBoost":1},{"CriticalElement":1},{"CriticalEye":1},{"DefenseBoost":2},{"DivineBlessing":1},{"DragonAttack":2},{"ElementExploit":1},{"Embolden":1},{"EvadeExtender":1},{"EvadeWindow":1},{"FireAttack":2},{"Focus":1},{"Foray":1},{"Fortify":1},{"Guard":1},{"GuardUp":1},{"Heroics":1},{"IceAttack":2},{"ItemProlonger":1},{"LatentPower":1},{"LoadShells":1},{"MarathonRunner":1},{"MasterMounter":1},{"MastersTouch":1},{"MaximumMight":1},{"MindsEye":1},{"ParalysisAttack":1},{"Partbreaker":1},{"PeakPerformance":1},{"PowerProlonger":1},{"ProtectivePolish":1},{"PunishingDraw":1},{"QuickSheathe":1},{"RapidMorph":1},{"RazorSharp":1},{"RecoveryUp":1},{"Resentment":1},{"Resuscitate":1},{"SleepAttack":1},{"Slugger":1},{"SneakAttack":1},{"SpareShot":1},{"SpecialAmmoBoost":1},{"SpeedEating":1},{"StaminaSurge":1},{"ThunderAttack":2},{"TremorResistance":1},{"WallRunner":1},{"WaterAttack":2},{"WeaknessExploit":1},{"Wide-Range":1},{"WirebugWhisperer":1}],[{"AmmoUp":1},{"BloodRite":1},{"CriticalDraw":1},{"DefenseBoost":3},{"DragonAttack":3},{"Earplugs":1},{"FireAttack":3},{"GoodLuck":1},{"Grinder(S)":1},{"Guard":2},{"Handicraft":1},{"HellfireCloak":1},{"IceAttack":3},{"IntrepidHeart":2},{"JumpMaster":1},{"Mushroomancer":1},{"Normal/RapidUp":1},{"OffensiveGuard":1},{"PierceUp":1},{"QuickBreath":1},{"RapidFireUp":1},{"Redirection":1},{"SpreadUp":1},{"StatusTrigger":1},{"ThunderAttack":3},{"Tune-Up":1},{"WaterAttack":3},{"Wide-Range":3}],[{"AdrenalineRush":2},{"Agitator":2},{"AmmoUp":2},{"Artillery":2},{"AttackBoost":2},{"Ballistics":2},{"BladescaleHone":2},{"BlastAttack":2},{"BlastResistance":3},{"BlightResistance":2},{"Bloodlust":1},{"Bombardier":3},{"Botanist":3},{"BowChargePlus":1},{"BubblyDance":2},{"Burst":2},{"ChargeMaster":2},{"Coalescence":2},{"Constitution":2},{"Counterstrike":2},{"CriticalDraw":2},{"CriticalElement":2},{"CriticalEye":2},{"DefenseBoost":5},{"Defiance":3},{"DivineBlessing":2},{"DragonAttack":4},{"DragonResistance":3},{"Dragonheart":1},{"Earplugs":2},{"ElementExploit":2},{"Embolden":2},{"EvadeExtender":2},{"EvadeWindow":2},{"FireAttack":4},{"FireResistance":3},{"FlinchFree":3},{"Focus":2},{"Foray":2},{"FreeMeal":3},{"Geologist":3},{"GoodLuck":2},{"Grinder(S)":2},{"GuardUp":2},{"Handicraft":2},{"HellfireCloak":2},{"Heroics":2},{"HungerResistance":3},{"IceAttack":4},{"IceResistance":3},{"ItemProlonger":3},{"LatentPower":2},{"LoadShells":2},{"MarathonRunner":2},{"MastersTouch":2},{"MaximumMight":2},{"MindsEye":2},{"Mushroomancer":2},{"Normal/RapidUp":2},{"OffensiveGuard":2},{"ParalysisAttack":2},{"ParalysisResistance":3},{"Partbreaker":2},{"PeakPerformance":2},{"PierceUp":2},{"PoisonAttack":3},{"PoisonResistance":3},{"PowerProlonger":2},{"ProtectivePolish":2},{"PunishingDraw":2},{"QuickSheathe":2},{"RapidMorph":2},{"RazorSharp":2},{"RecoverySpeed":3},{"RecoveryUp":2},{"Redirection":2},{"Resentment":2},{"Resuscitate":2},{"SleepAttack":2},{"SleepResistance":3},{"Slugger":2},{"SneakAttack":2},{"SpecialAmmoBoost":2},{"SpeedEating":2},{"SpeedSharpening":3},{"SpreadUp":2},{"StaminaSurge":2},{"StaminaThief":3},{"StatusTrigger":2},{"Steadiness":2},{"Steadiness":3},{"StunResistance":3},{"ThunderAttack":4},{"ThunderResistance":3},{"TremorResistance":2},{"Tune-Up":2},{"WallRunner":3},{"WaterAttack":4},{"WaterResistance":3},{"Wide-Range":4},{"Windproof":3},{"WirebugWhisperer":2}]],"IgnoreHZV":["AttackBoost","Dragonheart","OffensiveGuard","Fortify","Heroics","Resentment","Resuscitate","PeakPerformance","Counterstrike","WallRunner","Spiribird","Artillery","Coalescence","MailofHellfire","Booster","Dereliction","Burst","Foray","Adrenaline","Bloodlust","Strife","AdrenalineRush"],"Shot":["ElementalReload","Dragonheart","OffensiveGuard","Fortify","Resentment","Resuscitate","PeakPerformance","Counterstrike","Heroics","AttackBoost","Spiribird","WallRunner","CriticalEye","MaximumMight","LatentPower","DangoTemper","Dereliction","FanningManeuver","EvadeHop","Coalescence","Bloodlust","MailofHellfire","Foray","Adrenaline","Booster","Burst","AdrenalineRush","Strife","SneakAttack"],"Sever":["Dragonheart","OffensiveGuard","Fortify","Resentment","Resuscitate","PeakPerformance","Counterstrike","Dereliction","Heroics","AttackBoost","Spiribird","WallRunner","CriticalEye","MaximumMight","LatentPower","Coalescence","Bloodlust","MailofHellfire","Booster","Grinder(S)","Foray","Adrenaline","Burst","AdrenalineRush","Strife","PowerSheath"],"Blunt":["Dragonheart","OffensiveGuard","Fortify","Resentment","Resuscitate","PeakPerformance","Counterstrike","Dereliction","Heroics","AttackBoost","Spiribird","WallRunner","CriticalEye","MaximumMight","LatentPower","Coalescence","Bloodlust","MailofHellfire","Booster","Grinder(S)","Foray","Adrenaline","Burst","AdrenalineRush","Strife","PowerSheath"],"pointsPerSlot":[{"Bombardier":1,"Botanist":1,"CarvingPro":1,"DragonResistance":1,"FireResistance":1,"Geologist":1,"IceResistance":1,"ShockAbsorber":1,"ThunderResistance":1,"WaterResistance":1,"ChameleosBlessing":1,"Defiance":1,"IntrepidHeart":1,"KushalaBlessing":1,"PoisonAttack":1,"RecoilDown":1,"ReloadSpeed":1,"Steadiness":1,"TeostraBlessing":1,"AffinitySliding":1,"BlastResistance":1,"DefenseBoost":1,"Diversion":1,"DragonAttack":1,"FireAttack":1,"FlinchFree":1,"FreeMeal":1,"HornMaestro":1,"HungerResistance":1,"IceAttack":1,"LeapofFaith":1,"MuckResistance":1,"ParalysisResistance":1,"PoisonResistance":1,"RecoverySpeed":1,"SleepResistance":1,"SpeedSharpening":1,"SpiribirdsCall":1,"StaminaThief":1,"StunResistance":1,"ThunderAttack":1,"WallRunner(Boost)":1,"WaterAttack":1,"Windproof":1},{"Bludgeoner":1,"AttackBoost":1,"CriticalBoost":1,"CriticalEye":1,"MastersTouch":1,"RazorSharp":1,"SpareShot":1,"WeaknessExploit":1,"Agitator":1,"Artillery":1,"Burst":1,"Coalescence":1,"LatentPower":1,"MaximumMight":1,"PeakPerformance":1,"RapidMorph":1,"Resentment":1,"Resuscitate":1,"SneakAttack":1,"AdrenalineRush":1,"Ballistics":1,"BladescaleHone":1,"ChargeMaster":1,"CriticalElement":1,"ElementExploit":1,"Focus":1,"Foray":1,"Heroics":1,"MindsEye":1,"PowerProlonger":1,"ProtectivePolish":1,"WirebugWhisperer":1,"BlastAttack":1,"BubblyDance":1,"Constitution":1,"Counterstrike":1,"Embolden":1,"EvadeExtender":1,"EvadeWindow":1,"Guard":1,"GuardUp":1,"LoadShells":1,"MarathonRunner":1,"ParalysisAttack":1,"Partbreaker":1,"PunishingDraw":1,"QuickSheathe":1,"SleepAttack":1,"Slugger":1,"SpecialAmmoBoost":1,"SpeedEating":1,"StaminaSurge":1,"TremorResistance":1,"WallRunner":1,"ChameleosBlessing":1,"Defiance":1,"IntrepidHeart":1,"KushalaBlessing":1,"PoisonAttack":1,"RecoilDown":1,"ReloadSpeed":1,"Steadiness":1,"TeostraBlessing":1,"DefenseBoost":2,"DragonAttack":2,"FireAttack":2,"IceAttack":2,"ThunderAttack":2,"WaterAttack":2,"BlightResistance":1,"DivineBlessing":1,"Fortify":1,"ItemProlonger":1,"MasterMounter":1,"RecoveryUp":1,"Wide-Range":1,"AffinitySliding":1,"BlastResistance":1,"Diversion":1,"FlinchFree":1,"FreeMeal":1,"HornMaestro":1,"HungerResistance":1,"LeapofFaith":1,"MuckResistance":1,"ParalysisResistance":1,"PoisonResistance":1,"RecoverySpeed":1,"SleepResistance":1,"SpeedSharpening":1,"SpiribirdsCall":1,"StaminaThief":1,"StunResistance":1,"WallRunner(Boost)":1,"Windproof":1},{"JumpMaster":1,"QuickBreath":1,"AmmoUp":1,"Normal/RapidUp":1,"PierceUp":1,"RapidFireUp":1,"SpreadUp":1,"AttackBoost":1,"CriticalBoost":1,"CriticalEye":1,"MastersTouch":1,"RazorSharp":1,"SpareShot":1,"WeaknessExploit":1,"BloodRite":1,"GoodLuck":1,"Handicraft":1,"Tune-Up":1,"Agitator":1,"Artillery":1,"Burst":1,"Coalescence":1,"LatentPower":1,"MaximumMight":1,"PeakPerformance":1,"RapidMorph":1,"Resentment":1,"Resuscitate":1,"SneakAttack":1,"Guard":2,"IntrepidHeart":2,"CriticalDraw":1,"Earplugs":1,"Grinder(S)":1,"HellfireCloak":1,"Mushroomancer":1,"OffensiveGuard":1,"Redirection":1,"StatusTrigger":1,"AdrenalineRush":1,"Ballistics":1,"BladescaleHone":1,"ChargeMaster":1,"CriticalElement":1,"ElementExploit":1,"Focus":1,"Foray":1,"Heroics":1,"MindsEye":1,"PowerProlonger":1,"ProtectivePolish":1,"WirebugWhisperer":1,"DefenseBoost":3,"DragonAttack":3,"FireAttack":3,"IceAttack":3,"ThunderAttack":3,"WaterAttack":3,"Wide-Range":3,"ChameleosBlessing":1,"Defiance":1,"KushalaBlessing":1,"PoisonAttack":1,"RecoilDown":1,"ReloadSpeed":1,"Steadiness":1,"TeostraBlessing":1,"BlastAttack":1,"BubblyDance":1,"Constitution":1,"Counterstrike":1,"Embolden":1,"EvadeExtender":1,"EvadeWindow":1,"GuardUp":1,"LoadShells":1,"MarathonRunner":1,"ParalysisAttack":1,"Partbreaker":1,"PunishingDraw":1,"QuickSheathe":1,"SleepAttack":1,"Slugger":1,"SpecialAmmoBoost":1,"SpeedEating":1,"StaminaSurge":1,"TremorResistance":1,"WallRunner":1,"AffinitySliding":1,"BlastResistance":1,"Diversion":1,"FlinchFree":1,"FreeMeal":1,"HornMaestro":1,"HungerResistance":1,"LeapofFaith":1,"MuckResistance":1,"ParalysisResistance":1,"PoisonResistance":1,"RecoverySpeed":1,"SleepResistance":1,"SpeedSharpening":1,"SpiribirdsCall":1,"StaminaThief":1,"StunResistance":1,"WallRunner(Boost)":1,"Windproof":1,"BlightResistance":1,"DivineBlessing":1,"Fortify":1,"ItemProlonger":1,"MasterMounter":1,"RecoveryUp":1},{"BowChargePlus":1,"AmmoUp":2,"AttackBoost":2,"CriticalEye":2,"MastersTouch":2,"Normal/RapidUp":2,"PierceUp":2,"RazorSharp":2,"SpreadUp":2,"Agitator":2,"Artillery":2,"Burst":2,"Coalescence":2,"GoodLuck":2,"Handicraft":2,"LatentPower":2,"MaximumMight":2,"PeakPerformance":2,"RapidMorph":2,"Resentment":2,"Resuscitate":2,"SneakAttack":2,"Tune-Up":2,"AdrenalineRush":2,"Ballistics":2,"BladescaleHone":2,"ChargeMaster":2,"CriticalDraw":2,"CriticalElement":2,"Earplugs":2,"ElementExploit":2,"Focus":2,"Foray":2,"Grinder(S)":2,"HellfireCloak":2,"Heroics":2,"MindsEye":2,"Mushroomancer":2,"OffensiveGuard":2,"PowerProlonger":2,"ProtectivePolish":2,"Redirection":2,"StatusTrigger":2,"WirebugWhisperer":2,"Defiance":3,"PoisonAttack":3,"Steadiness":2,"WallRunner":3,"CriticalBoost":1,"SpareShot":1,"WeaknessExploit":1,"RapidFireUp":1,"DefenseBoost":5,"Bloodlust":1,"BloodRite":1,"BlastAttack":2,"BubblyDance":2,"Constitution":2,"Counterstrike":2,"Embolden":2,"EvadeExtender":2,"EvadeWindow":2,"GuardUp":2,"LoadShells":2,"MarathonRunner":2,"ParalysisAttack":2,"Partbreaker":2,"PunishingDraw":2,"QuickSheathe":2,"SleepAttack":2,"Slugger":2,"SpecialAmmoBoost":2,"SpeedEating":2,"StaminaSurge":2,"TremorResistance":2,"IntrepidHeart":2,"Guard":2,"DragonAttack":4,"FireAttack":4,"IceAttack":4,"ThunderAttack":4,"WaterAttack":4,"Wide-Range":4,"Dragonheart":1,"BlastResistance":3,"FlinchFree":3,"FreeMeal":3,"HungerResistance":3,"ItemProlonger":3,"ParalysisResistance":3,"PoisonResistance":3,"RecoverySpeed":3,"SleepResistance":3,"SpeedSharpening":3,"StaminaThief":3,"StunResistance":3,"Windproof":3,"ChameleosBlessing":1,"KushalaBlessing":1,"RecoilDown":1,"ReloadSpeed":1,"TeostraBlessing":1,"BlightResistance":2,"DivineBlessing":2,"RecoveryUp":2,"AffinitySliding":1,"Diversion":1,"HornMaestro":1,"LeapofFaith":1,"MuckResistance":1,"SpiribirdsCall":1,"WallRunner(Boost)":1,"Fortify":1,"MasterMounter":1}],"lvl4":{"AttackBoost":2,"Agitator":2,"PeakPerformance":2,"Resentment":2,"Resuscitate":2,"CriticalEye":2,"CriticalBoost":null,"WeaknessExploit":null,"LatentPower":2,"MaximumMight":2,"CriticalElement":2,"MastersTouch":2,"FireAttack":4,"WaterAttack":4,"IceAttack":4,"ThunderAttack":4,"DragonAttack":4,"PoisonAttack":3,"ParalysisAttack":2,"SleepAttack":2,"BlastAttack":2,"Handicraft":2,"RazorSharp":2,"SpareShot":null,"ProtectivePolish":2,"MindsEye":2,"Ballistics":2,"Bludgeoner":null,"BowChargePlus":1,"Focus":2,"PowerProlonger":2,"MarathonRunner":2,"Constitution":2,"StaminaSurge":2,"Guard":null,"GuardUp":2,"OffensiveGuard":2,"CriticalDraw":2,"PunishingDraw":2,"QuickSheathe":2,"Slugger":2,"StaminaThief":3,"AffinitySliding":null,"HornMaestro":null,"Artillery":2,"LoadShells":2,"SpecialAmmoBoost":2,"Normal/RapidUp":2,"PierceUp":2,"SpreadUp":2,"AmmoUp":2,"ReloadSpeed":null,"RecoilDown":null,"Steadiness":2,"RapidFireUp":null,"DefenseBoost":5,"DivineBlessing":2,"RecoveryUp":2,"RecoverySpeed":3,"SpeedEating":2,"Earplugs":2,"Windproof":3,"TremorResistance":2,"BubblyDance":2,"EvadeWindow":2,"EvadeExtender":2,"FireResistance":3,"WaterResistance":3,"IceResistance":3,"ThunderResistance":3,"DragonResistance":3,"BlightResistance":2,"PoisonResistance":3,"ParalysisResistance":3,"SleepResistance":3,"StunResistance":3,"MuckResistance":null,"BlastResistance":3,"Botanist":3,"Geologist":3,"Partbreaker":2,"CaptureMaster":null,"CarvingMaster":null,"GoodLuck":2,"SpeedSharpening":3,"Bombardier":3,"Mushroomancer":2,"ItemProlonger":3,"Wide-Range":4,"FreeMeal":3,"Heroics":2,"Fortify":null,"FlinchFree":3,"JumpMaster":null,"CarvingPro":null,"HungerResistance":3,"LeapofFaith":null,"Diversion":null,"MasterMounter":null,"ChameleosBlessing":null,"KushalaBlessing":null,"TeostraBlessing":null,"Dragonheart":1,"WirebugWhisperer":2,"WallRunner":3,"Counterstrike":2,"RapidMorph":2,"HellfireCloak":2,"WindAlignment":null,"ThunderAlignment":null,"Stormsoul":null,"BloodRite":null,"Dereliction":null,"Furious":null,"MailofHellfire":null,"Coalescence":2,"Bloodlust":1,"Defiance":3,"SneakAttack":2,"AdrenalineRush":2,"Redirection":2,"SpiribirdsCall":null,"ChargeMaster":2,"Foray":2,"Tune-Up":2,"Grinder(S)":2,"BladescaleHone":2,"WallRunner(Boost)":null,"QuickBreath":null,"ElementExploit":2,"Burst":2,"Guts":null,"StatusTrigger":2,"IntrepidHeart":null,"BuildupBoost":null,"Embolden":2,"WindMantle":null,"PowderMantle":null,"Berserk":null,"Strife":null,"Frostcraft":null,"DragonConversion":null,"Heaven-Sent":null,"FrenziedBloodlust":null,"ShockAbsorber":null},"Bow":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Booster","BowChargePlus","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","DangoTemper","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","HerculesDraw","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","Marksman","MaximumMight","NormalRapidUp","PeakPerformance","PierceUp","PunishingDraw","ReloadSpeed","Resentment","Resuscitate","SneakAttack","SpareShot","SpecialAmmoBoost","Spiribird","SpreadUp","StormSoul","Strife","TeostraBlessing","ThunderAttack","UpperCrit","WallRunner","WaterAttack","WeaknessExploit"],"ChargeBlade":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Bombardier","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","EleShieldCharge","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","ImpactShieldCharge","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RapidMorph","RazorSharp","Resentment","Resuscitate","SavageAxe","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"DualBlades":["Adrenaline","AdrenalineRush","Agitator","ArchdemonMode","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","DemonMode","Dereliction","DragonAttack","Dragonheart","ElementExploit","FeralDemonMode","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"GreatSword":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PowerSheath","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","StrongarmStance","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"Gunlance":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Bombardier","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"Hammer":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"HeavyBowGun":["Adrenaline","AdrenalineRush","Agitator","AmmoUp","Artillery","AttackBoost","Bloodlust","Bombardier","Booster","BowgunBarrel","Burst","ChargeLevel","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","DangoTemper","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","Marksman","MaximumMight","NormalRapidUp","OffensiveGuard","PeakPerformance","PierceUp","RapidFireUp","RecoilDown","ReloadSpeed","Resentment","Resuscitate","SneakAttack","SpareShot","SpecialAmmoBoost","Spiribird","SpreadUp","StormSoul","Strife","TeostraBlessing","ThunderAttack","Tune-Up","WallRunner","WaterAttack","WeaknessExploit"],"HuntingHorn":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"InsectGlaive":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KinsectBuff","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"Lance":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LanceCharge","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"LightBowGun":["Adrenaline","AdrenalineRush","Agitator","AmmoUp","Artillery","AttackBoost","Bloodlust","Bombardier","Booster","BowgunBarrel","Burst","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","CriticalFirePower","DangoTemper","Dereliction","DragonAttack","Dragonheart","ElementExploit","ElementalReload","EvadeHop","FanningManeuver","FireAttack","Foray","Fortify","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","Marksman","MaximumMight","NormalRapidUp","PeakPerformance","PierceUp","RapidFireUp","RecoilDown","ReloadSpeed","Resentment","Resuscitate","SneakAttack","SpareShot","SpecialAmmoBoost","Spiribird","SpreadUp","StormSoul","Strife","TeostraBlessing","ThunderAttack","Tune-Up","WallRunner","WaterAttack","WeaknessExploit"],"LongSword":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Helmbreaker","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SerenePose","SneakAttack","Spiribird","SpiritGauge","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"SwitchAxe":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RapidMorph","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"],"SwordNShield":["Adrenaline","AdrenalineRush","Agitator","Artillery","AttackBoost","Bloodlust","Bludgeoner","Booster","Burst","ChargeMaster","Coalescence","Counterstrike","CriticalBoost","CriticalElement","CriticalEye","Dereliction","DragonAttack","Dragonheart","ElementExploit","FireAttack","Foray","Fortify","Grinder(S)","Handicraft","Heroics","IceAttack","KushalaBlessing","LatentPower","MailofHellfire","MastersTouch","MaximumMight","MindsEye","OffensiveGuard","PeakPerformance","PunishingDraw","RazorSharp","Resentment","Resuscitate","SneakAttack","Spiribird","StormSoul","Strife","TeostraBlessing","ThunderAttack","WallRunner","WaterAttack","WeaknessExploit"]}');
        }
    }, t = {};
    function __webpack_require__(a) {
        var r = t[a];
        if (void 0 !== r) return r.exports;
        var i = t[a] = {
            exports: {}
        };
        return e[a](i, i.exports, __webpack_require__), i.exports;
    }
    __webpack_require__.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    };
    var a = {};
    (() => {
        __webpack_require__.r(a);
        var e = __webpack_require__("./srcfiles/json/types.json");
        const {decos: t, lvl4: r, maxLevel: i, qurious: n, pointsPerSlot: s} = e;
        function slotDecos(e, t) {
            let a = [];
            [ 0, 3, 2, 1 ].forEach((r => {
                for (const [i, n] of s[r]) {
                    if (!t[r]) break;
                    if (!e[i]) continue;
                    const s = Math.min(t[r], ~~(-e[i] / n));
                    s && (e[i] += s * n, t[r] -= s, a.push([ i, n, `Slot lvl${r + 1}`, s ]));
                }
            }));
            let r = {}, i = 0;
            return Object.entries(e).forEach((([e, t]) => {
                if (!t) return;
                const a = ~~(n[e] / 3);
                r[a] || (r[a] = {
                    total: 0
                }), r[a].total -= t, r[a][e] = -t, i += n[e] >= 9 ? t : .5 * t;
            })), [ a, r, i ];
        }
        let findBestSum3 = (e, t, a, r = {}) => {
            let i = [ 0, 0, 0, 0 ];
            const n = Object.keys(e).sort();
            let s, o, l;
            for (let c = 0, u = n.length; c < u; c++) {
                s = +n[c];
                for (let d = c; d < u; d++) if (1 !== e[n[d]].total || d !== c) {
                    o = +n[d];
                    for (let g = d; g < u && (l = +n[g], !(s + o + l > t)); g++) if ((1 !== e[l].total || l !== s && l !== o) && (2 !== e[l].total || l !== s || l !== o)) if (a) {
                        if (c !== d) {
                            if (c !== g) {
                                if (d !== g) {
                                    if ((void 0 === r[n[c]]) + (void 0 === r[n[d]]) + (void 0 === r[n[g]]) <= a) {
                                        if (s + o + l === t) return [ [ s, o, l ], s + o + l ];
                                        s + o + l > i[1] && (i = [ [ s, o, l ], s + o + l ]);
                                    }
                                } else if (2 === a || r[n[c]] || r[n[c]]?.total > 1) {
                                    if (s + o + l === t) return [ [ s, o, l ], s + o + l ];
                                    s + o + l > i[1] && (i = [ [ s, o, l ], s + o + l ]);
                                }
                            } else if (2 === a || r[n[d]] || r[n[c]]?.total > 1) {
                                if (s + o + l === t) return [ [ s, o, l ], s + o + l ];
                                s + o + l > i[1] && (i = [ [ s, o, l ], s + o + l ]);
                            }
                        } else if (2 === a || c === g || r[n[g]] || r[n[c]]?.total > 1) {
                            if (s + o + l === t) return [ [ s, o, l ], s + o + l ];
                            s + o + l > i[1] && (i = [ [ s, o, l ], s + o + l ]);
                        }
                    } else {
                        if (s + o + l === t) return [ [ s, o, l ], s + o + l ];
                        s + o + l > i[1] && (i = [ [ s, o, l ], s + o + l ]);
                    }
                }
            }
            return i;
        };
        function findBestSum2(e, t, a, r) {
            let i = [ 0, 0, 0, 0 ];
            const n = Object.keys(e).sort();
            let s;
            for (let o = 0, l = n.length; o < l; o++) {
                let c = +n[o];
                for (let u = o; u < l; u++) if (1 !== e[n[u]].total || u !== o) {
                    if (s = c + +n[u], s > t) break;
                    if (!a || o === u || r[o] || r[u]) {
                        if (s === t) return [ [ c, s - c ], s ];
                        s > i[1] && (i = [ [ c, s - c ], s ]);
                    } else ;
                }
            }
            return i;
        }
        const findBestSum1 = (e, t) => {
            let a = Object.keys(e);
            for (let e = a.length; e >= 0; --e) if (+a[e] <= t) return [ [ +a[e] ], +a[e] ];
        }, getPoints = (e, t) => {
            e.fodderSkills.length > 0 ? (e.augs.push({
                "-Skill": e.fodderSkills[++e.skillsRemovedCount]
            }), t.push([ e.fodderSkills[e.skillsRemovedCount], "-Skill", e.name, 1 ]), e.quriousPoints += 10) : (e.augs.push({
                "-Def": 5
            }), t.push([ 5, "-Def", e.name, 1 ]), e.quriousPoints += 5), e.unBloatedPoints = ~~(e.quriousPoints / 3);
        }, pushAugs = (e, t, a, r) => {
            for (const i of e) {
                const [e, n] = Array.isArray(i) ? i : [ Object.keys(a[i])[1], i ];
                if (t.innateSkills.has(e)) t.innateSkills.add(e); else if (5 === t.innateSkills.size) return console.log(t.name, e), 
                !0;
                t.augs.push({
                    "+Skill": e
                }), r.push([ e, 1, t.name, 1 ]), 0 == --a[n].total ? delete a[n] : 0 == --a[n][e] && delete a[n][e];
            }
        }, minimumCostForPossibleAugs = (e, t) => {
            let a = 0;
            for (let r = 0; e && r < t.length; ++r) {
                const i = Math.min(t[r][1].total, e);
                a += i * +t[r][0], e -= i;
            }
            return a;
        }, getQuriousSkills = (e, t) => {
            const a = [ 0, 0, 0, 0, 0 ];
            let [r, i, n] = e, s = Object.values(i).reduce(((e, t) => e + t.total), 0);
            for (const e of t) if (e.augs.length < 6) {
                const t = Object.entries(i);
                let a, n = Math.min(6 - e.augs.length, s), o = s < 6 - e.augs.length ? 6 - e.augs.length - s : 0;
                for (;n && minimumCostForPossibleAugs(n, t) > e.unBloatedPoints; ) ++o, --n;
                if (!n) continue;
                for (;o--; ) getPoints(e, r);
                if (3 === n) a = findBestSum3(i, e.unBloatedPoints, 0); else if (2 === n) a = findBestSum2(i, e.unBloatedPoints, 0); else {
                    if (!(1 === n && e.unBloatedPoints >= t[0][0])) continue;
                    a = findBestSum1(i, e.unBloatedPoints);
                }
                ((e.quriousPoints -= 3 * a[1]) < 0 || void 0 === e.quriousPoints) && console.log(`${e.name} has ${e.quriousPoints} points}`, e), 
                s -= a[0].length, pushAugs(a[0], e, i, r);
            }
            const replaceAugment = (e, t) => {
                e.augs.splice(t, 1);
                const a = findBestSum1(i, ~~(e.quriousPoints / 3));
                a[0] && (e.quriousPoints -= 3 * a[1], --s, pushAugs(a[0], e, i, r));
            };
            for (const e of t) if (s > 0) {
                if (e.innateSkills.size > 4 && Object.values(i).every((t => Object.keys(t[1]).every((t => !e.innateSkills.has(t)))))) continue;
                if (!Object.keys(i).length) break;
                for (let t = e.augs.length - 1; t >= 0 && e.quriousPoints > 8; t--) e.augs[t]["-Def"] && e.quriousPoints - 5 >= 3 * +Object.keys(i)[0] ? (e.quriousPoints -= 5, 
                replaceAugment(e, t)) : e.augs[t]["-Skill"] && e.quriousPoints - 10 >= 3 * +Object.keys(i)[0] && (e.quriousPoints -= 10, 
                replaceAugment(e, t));
            }
            if (Object.keys(i).length) return {
                quriousAugs: 0,
                finalSkillCheck: 0,
                returnArmors: 0,
                arr: !1
            };
            for (const e of t) {
                if (e.innateSkills.size > 4 || e.quriousPoints < 8) continue;
                let t = 0, r = 1;
                for (let a in e.augs) "-Def" === a && ++t;
                let i = e.augs.length, n = i < 6 ? 0 : --t > 0 ? 5 : 10, s = e.quriousPoints;
                for (;(s -= n) > 3 * r; ) a[~~(s / (3 * r))] = a[~~(s / (3 * r))] || 0 + ++r, i < 6 && ++i, 
                n = i < 6 - r ? 0 : --t > 0 ? 5 : 10;
            }
            return {
                quriousAugs: r,
                theseExtraPoints: a,
                newArmorSkills: {},
                newDecoSkills: [ 0, 0, 0, 0 ],
                arr: !s
            };
        }, max = (e, t) => e >= t ? e : t, getMostSkills = (e, t) => {
            for (const a of e) {
                for (let e = 0; e < 4; e++) t.remainingSlots[e] = max(t.remainingSlots[e] || 0, a.remainingSlots[e]);
                for (let e = 0; e < 5; e++) t.quriousSkills[e] = max(t.quriousSkills[e] || 0, a.quriousSkills[e]);
                for (const [e, r] of Object.entries(a.armorSkills)) t.armorSkills[e] = max(t.armorSkills[e] || 0, r);
            }
        };
        self.addEventListener("message", (e => {
            const t = {
                sets: [],
                count: {
                    sets: 0,
                    combos: 0
                },
                stats: {
                    quriousSkills: [ 0, 0, 0, 0, 0 ],
                    armorSkills: {},
                    remainingSlots: [ 0, 0, 0, 0 ]
                }
            };
            e.data.requiredSkills = Object.entries(e.data.skills), s.forEach(((t, a) => {
                s[a] = Object.entries(t).filter((t => e.data.skills[t[0]]));
            }));
            for (const a of e.data.permutations) {
                e.data.theseArmors = [ e.data.armors.helm[a[0]], e.data.armors.chest[a[1]], e.data.armors.arm[a[2]], e.data.armors.waist[a[3]], e.data.armors.leg[a[4]] ], 
                e.data.skills = Object.fromEntries(e.data.requiredSkills);
                const r = testThisBatch(e.data);
                r && (getMostSkills(r, t.stats), t.count.combos += r.length, ++t.count.sets, t.sets.length < 25 && t.sets.push(r));
            }
            postMessage({
                type: "rerun",
                final: t
            }), self.terminate;
        }));
        const testThisBatch = e => {
            const {thisWeapon: a, theseCharms: s, requiredSkills: o, skillInfo: l, theseArmors: c, skills: u} = e;
            let d = new Map, g = l.charmNeeded ? Object.entries(l.charmNeeded) : [];
            const h = {};
            for (const e of c) for (const [t, a] of e.skills) u[t] && (h[t] = (h[t] || 0) + a);
            const k = [ 0, 0, 0, 0 ];
            [ a, c[0].decos, c[1].decos, c[2].decos, c[3].decos, c[4].decos, e.charmSlots ].forEach((e => e.forEach(((e, t) => k[t] += e))));
            let S = [];
            for (const e of s) {
                if (g?.some((t => (h[t[0]] || 0) + (e[t[0]] || 0) < t[1])) || Object.entries(e).some((e => (h[e[0]] || 0) + e[1] > i[e[0]]))) continue;
                let a = "";
                if (Object.entries(e).forEach((e => {
                    a += `${n[e[0]]}-${t[e[0]]}-${r[e[0]]}-${e[1]}`;
                })), "fail" === d.get(a)) continue;
                o.forEach((t => {
                    t[1] + (h[t[0]] || 0) + (e[t[0]] || 0) < 0 ? u[t[0]] = t[1] + (h[t[0]] || 0) + (e[t[0]] || 0) : u[t[0]] = 0;
                }));
                for (const e of c) {
                    if (e.augs = e.startingAugs.map((e => Object.fromEntries(e))), e.quriousPoints = e.startingQuriousPoints, 
                    e.skillsRemovedCount = e.fodderCount < 3 ? e.fodderCount : 3, e.unBloatedPoints = ~~e.quriousPoints / 3, 
                    e.innateSkills = new Set(e.skills.map((e => e[0]))), void 0 === e.skillLimitation && 5 - Object.keys(e.skills).length - (6 - e.augs.length) >= 0) continue;
                    let t = {}, a = {};
                    for (let [e, a] of Object.entries(u)) {
                        if (!n[e] || !a) continue;
                        const r = ~~(n[e] / 3);
                        t[r] ? t[r].total < -a && (t[r].total = Math.max(t[r].total, -a), t[r].skill = e) : t[r] = {
                            total: -a,
                            skill: e
                        };
                    }
                    e.limitedSkills?.forEach((e => {
                        if (!n[e] || !u[e]) return;
                        const t = ~~(n[e] / 3);
                        a[t] || (a[t] = {
                            total: 0
                        }), a[t].total -= u[e];
                    }));
                    let r = [];
                    6 - e.augs.length == 3 ? r = findBestSum3(t, e.unBloatedPoints, 5 - e.skills.length, a) : 6 - e.augs.length == 2 && (r = findBestSum2(t, e.unBloatedPoints, 5 - e.skills.length, a)), 
                    r[1] && (e.quriousPoints -= 3 * r[1], r[0].forEach((a => {
                        let r = t[a].skill;
                        for (let t of e.innateSkills) if (n[t] === 3 * a && u[t]) {
                            r = t;
                            break;
                        }
                        ++u[r], e.augs.push({
                            "+Skill": r
                        });
                    })));
                }
                const s = slotDecos(u, k.slice(0)), {quriousAugs: l, theseExtraPoints: p, newArmorSkills: f, newDecoSkills: m, arr: R} = getQuriousSkills(s, c);
                R ? (c.some((e => null == e.name)) && console.log(c), S.push({
                    usedSkills: [].concat(l, Object.entries(h), Object.entries(e)),
                    armors: [ [ c[0].name, c[0] ], [ c[1].name, c[1] ], [ c[2].name, c[2] ], [ c[3].name, c[3] ], [ c[4]?.name, c[4] ] ],
                    remainingSlots: m,
                    quriousSkills: p,
                    armorSkills: f,
                    thisCharm: e,
                    decoArr: k
                })) : d.set(a, "fail");
            }
            if (S.length) return S;
        };
    })();
})();
//# sourceMappingURL=setBuildWorker.js.map