/** @param {NS} ns */
export async function main(ns) {
	const height = ns.stanek.giftHeight()
	const width = ns.stanek.giftWidth()
	if (await ns.prompt("Save (Y) or Load? (N)")) {
		const list = ns.stanek.activeFragments()
		let type = null
		for (let frag of list) {
			switch (frag.id) {
				case 0, 1, 5, 6, 7:
					type = "hack"
					break
				case 30:
					type = "blade"
					break
				case 10, 12, 14, 16, 28:
					type = "crime"
					break
				default:
					break
			}
			if (type != null) { break }
		}
		if (type == null) ns.alert("Error: no aligment could be found")
		else {
			let final = []
			let i = 0
			for (let frag of list) {
				final[i] = [frag.x, frag.y, frag.rotation, frag.id]
				i++
			}
			await ns.write("/storage/" + type + width + height + ".txt", final, "w")
		}
	}
	else {
		const type = await ns.prompt("Which type?", { type: "select", choices: ["hack", "crime", "blade"] })
		if (ns.read("/storage/" + type + width + height + ".txt") != "") {
			const data = ns.read("/storage/" + type + width + height + ".txt").split(",")
			let list = []
			let i = 0
			for (let point of data) {
				if(i % 4 == 0) list.push([""])
				list[Math.floor(i / 4)][i % 4] = parseInt(point)
				list[0][i % 4] = parseInt(point)
				i++
			}
			for (let i = 0; i < list.length; i++) {
				if (list[i] != "") {
					ns.stanek.placeFragment(list[i][0], list[i][1], list[i][2], list[i][3])
				}
			}
		}
		else ns.alert("Error: File doesn't exist, I'd advise creating a new layout.")
	}
}