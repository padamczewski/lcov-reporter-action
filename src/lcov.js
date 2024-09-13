import lcov from "lcov-parse"
import * as _ from "lodash"

// Parse lcov string into lcov data
export function parse(data) {
	return new Promise(function(resolve, reject) {
		lcov(data, function(err, res) {
			if (err) {
				reject(err)
				return
			}
			resolve(res)
		})
	})
}

// Get the total coverage percentage from the lcov data.
export function percentage(lcov) {
	let hit = 0
	let found = 0
	for (const entry of lcov) {
		hit += entry.lines.hit
		found += entry.lines.found
	}

	return (hit / found) * 100
}

const getTotals = (objKey, lcov) => {
	const found = _.sumBy(lcov, obj => _.get(obj, [objKey, "found"]))
	const hit = _.sumBy(lcov, obj => _.get(obj, [objKey, "hit"]))
	return ((hit / found) * 100).toFixed(2)
}
// Get the total coverage percentage from the lcov data for {}lcov.entry.lines
export function percentageByType(lcov) {
	return {
		lines: getTotals("lines", lcov),
		branches: getTotals("branches", lcov),
		functions: getTotals("functions", lcov),
	}
}
