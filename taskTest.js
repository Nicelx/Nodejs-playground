var el = [
    ["Mallory", "Everest", "Mont Blanc", "Pillar Rock"],
    ["Mawson", "South Pole", "New Hebrides"],
    ["Hillary", "Everest", "South Pole"]
]

const fn = (el) => {
	const places = {};

	for (let i = 0; i< el.length; i++) {
		for (let j = 1; j< el[i].length; j++) {
			const element = el[i][j];
			const explorer = el[i][0]
			if (places[element]) {
				places[element].push(explorer)
			} else {
				places[element] = [element, explorer];
			}
		}
	}
	console.log(places);
	return extractArraysFromProperty(places);
}

const extractArraysFromProperty = (placesObj) => {
	const result = [];
	for (item in placesObj) {
		if (placesObj.hasOwnProperty(item)) {
			const arr = placesObj[item];
			const place = arr[0]
			const sortedExplorer = arr.splice(1,).sort();
			
			result.push([place, ...sortedExplorer]);
		}
	}
	return result;
}

console.log(fn(el));