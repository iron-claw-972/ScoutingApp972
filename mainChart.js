function createChart() {
	alert(tableData)
	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
		type: 'bar',

		data: {
			labels: tableData[0],
			datasets: [{
				label: "My First dataset",
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: tableData[1],
			}]
		},

		options: {}
	});
}