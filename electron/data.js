let dataFirst = {
	    label: "RPM",
	    data: [],
	    fill: false,
	    backgroundColor : 'blue',
	    borderColor: 'blue'
  	};
let dataSecond = {
	    label: "Lower Threshold",
	    data: [],
	    fill: false,
	    backgroundColor : 'red',
	  	borderColor: 'red'
	};
let dataThird = {
		label: "Upper Threshold",
		data: [],
		fill: false,
		backgroundColor: 'green',
		borderColor: 'green'
	};
let dataFourth = {
		label: "Load Level",
		data: [],
		fill: false,
		backgroundColor: "yellow",
		borderColor: "yellow"
	};
let options = {
			legend: {
				labels: {
					fontColor: "grey",
					fontStyle: "bold",
					fontFamily: "Poppins"
				}
			},
			scales: {
				xAxes: [{
					ticks: {
					    fontFamily: "Poppins",
					    fontStyle: "bold",
					}
				}],
				yAxes: [{
					ticks: {
					    fontFamily: "Poppins",
					    fontStyle: "bold",
					}
				}],
			},
		};