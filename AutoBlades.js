//editable data
const BOpsminchance = 0.75 //minimal succes chance to attempt
const maxchandev = 0.05 //maximal devation between highest and lowest succes range for contracts and operations.
const minsucchance = 0.5 //minimal succes chance to let things go.
//main script
export async function main(ns) {
	//main loop
	let loc = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima", 0]
	let lastjob
	let restoverride = false
	while (true) {
		if (ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity()) < 1000000000) { ns.print("check"); changeloc() }
		work()
		while (getstamina() > 0.5) {
			spendskill()
			await ns.sleep(10000)
		}
		rest()
		while (getstamina() < 1) {
			spendskill()
			await ns.sleep(10000)
		}
	}
	//all the other functions (only works that way)
	function getstamina() {
		const res = ns.bladeburner.getStamina()
		return res[0] / res[1]
	}

	function getsucceschance(type, task) {
		const res = ns.bladeburner.getActionEstimatedSuccessChance(type, task)
		return [res[0], res[1] - res[0]]
	}
	//get best task and switches it on.
	function changeloc() {
		ns.bladeburner.switchCity(loc[loc[6] % 6])
		loc[6]++
		restoverride = true
	}
	function work() {
		let contracts = ns.bladeburner.getContractNames()
		let operations = ns.bladeburner.getOperationNames()
		let bestco
		let bestop
		for (let i = 0; i < contracts.length; i++) {
			let hold = getsucceschance("contract", contracts[i])
			contracts[i] = [contracts[i], ns.bladeburner.getActionRepGain("contract", contracts[i], ns.bladeburner.getActionCurrentLevel("contract", contracts[i])) * hold[0], hold[0]]
		}
		for (let i = 0; i < operations.length; i++) {
			let hold = getsucceschance("operation", operations[i])
			operations[i] = [operations[i], ns.bladeburner.getActionRepGain("operation", operations[i], ns.bladeburner.getActionCurrentLevel("operation", operations[i])) * hold[0], hold[0]]
		}
		//get best chance task
		for (let i = 0; i < contracts.length; i++) {
			if (bestco == undefined || (contracts[i][1] > bestco[1] && 0 < ns.bladeburner.getActionCountRemaining("contract", contracts[i][0]) && contracts[i][2] > minsucchance)) {
				bestco = contracts[i]
			}
		}

		for (let i = 0; i < operations.length; i++) {
			if ((bestop == undefined || (operations[i][1] > bestop[1] && 0 < ns.bladeburner.getActionCountRemaining("operation", operations[i][0])) && operations[i][2] > minsucchance)) {
				bestop = operations[i]
			}
		}
		bestco.unshift("contract")
		bestop.unshift("operation")
		if (bestop != undefined) {
			if (bestop[2] < bestco[2]) { ns.bladeburner.startAction(bestco[0], bestco[1]); lastjob = bestco }
			else { ns.bladeburner.startAction(bestop[0], bestop[1]); lastjob = bestop }
		}
		else { ns.bladeburner.startAction(bestop[0], bestop[1]); lastjob = bestop }
	}
	//checks for the lowest value and buys it, excludes 3 skills.
	function spendskill() {
		let skills = ns.bladeburner.getSkillNames()
		let uskill
		for (let i = 0; i < skills.length; i++) {
			if (skills[i] == "Hands of Midas" || skills[i] == "Cyber's Edge" || skills[i] == "Datamancer") { skills.splice(i, 1); i-- }
			else { skills[i] = [skills[i], ns.bladeburner.getSkillUpgradeCost(skills[i])] }
		}
		for (let i = 0; i < skills.length; i++) {
			if (uskill == undefined || skills[i][1] < uskill[1]) {
				uskill = skills[i]
			}
		}
		if (ns.bladeburner.getSkillPoints() >= uskill[1]) { ns.bladeburner.upgradeSkill(uskill[0]); ns.tprint("bought " + uskill[0]) }
	}
	// depending on succes devation threshhold, decides if it goes training or optimizing chances
	function rest() {
		let hold = getsucceschance(lastjob[0], lastjob[1])
		if (hold[1] > maxchandev || restoverride) { ns.bladeburner.startAction("General", "Field Analysis"); restoverride = false }
		else { ns.bladeburner.startAction("General", "Hyperbolic Regeneration Chamber") }
	}
}