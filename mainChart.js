function createChart() {
	var ctx = document.getElementById('myChart').getContext('2d');
	var labels = getColumn(tableData, 0)
	var data = getColumn(tableData, 6)
	var chart = new Chart(ctx, {
		type: 'bar',

		data: {
			labels: labels,
			datasets: [{
				label: "My First dataset",
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: data
			}]
		},

		options: {}
	});
}

function getColumn(table, col) {
	var c = []
	for (var i = 0; i < table.length; i++) {
		c.push(table[i][col])
	}
	return c
}