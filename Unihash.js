export async function main(ns) {
	ns.disableLog('sleep')
	const hnt = eval("ns.hacknet")
	let tasklist = ["Sell for Money", "Reduce Minimum Security", "Increase Maximum Money", "Improve Studying", "Improve Gym Training", "Generate Coding Contract"]
	let file3 = false
	let file6 = false
	let file9 = false
	for (let file of ns.getOwnedSourceFiles()) {
		if (file.n == 3) { file3 = true }
		if (file.n == 6) { file6 = true }
		if (file.n == 9) { file9 = true }
	}
	if (file9) {
		if (file3) { tasklist.push("Sell for Corporation Funds"); tasklist.push("Exchange for Corporation Research") }
		if (file6) { tasklist.push("Exchange for Bladeburner Rank"); tasklist.push("Exchange for Bladeburner SP") }
		let task = ns.args[0] || await ns.prompt("which upgrade do you want to automate?", { type: "select", choices: tasklist })
		if (task == "Reduce Minimum Security" || task == "Increase Maximum Money") { var server = ns.args[1] ||  ns.prompt("Which server?", { type: "text" }) }
		if (server != undefined) { await serverfunction(task, server) } else { await regulartask(task) }
	}
	else { ns.tprint("you need source-file 9, dummy!") }

	async function regulartask(task) {
		while (true) {
			if (hnt.hashCost(task) < hnt.numHashes()) { hnt.spendHashes(task); ns.print("bought " + task) }
			if (hnt.hashCost(task) > hnt.hashCapacity()) { ns.alert("Cost is greater than Storage, shutting down."); break }
			if (task == "Sell for Money") { await ns.sleep(10) } else { await ns.sleep(1000) }
		}
	}

	async function serverfunction(task, target) {
		while (true) {
			if (hnt.hashCost(task) < hnt.numHashes()) { hnt.spendHashes(task, target); ns.print("Used " + task + " on " + server) }
			if (hnt.hashCost(task) > hnt.hashCapacity()) { ns.alert("Cost is greater than Storage, shutting down."); break }
			await ns.sleep(1000)
		}
	}
}
