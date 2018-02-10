function createChart(chart, row) {
	var ctx = document.getElementById(chart).getContext('2d');
	var labels = getColumn(tableData, 0)
	var data = getColumn(tableData, row)
	var chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: row,
				backgroundColor: 'orange',
				borderColor: 'orange',
				data: data
			}]
		},
		options: {
			// title: {
			// 	display: false
			// },
			// scales: {
			// 	xAxes: [{
			// 		gridLines: {
			// 			color: '#484848',
			// 			lineWidth: 1
			// 		}
			// 	}],
			// 	yAxes: [{
			// 		gridLines: {
			// 			color: '#484848',
			// 			lineWidth: 1
			// 		}
			// 	}]
			// }
		}
	});
}

function getColumn(table, col) {
	var c = []
	for (var i = 0; i < table.length; i++) {
		c.push(table[i][col])
	}
	return c
}