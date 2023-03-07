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
		backgroundColor: "grey",
		borderColor: "grey"
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
					},
					scaleLabel: {
			          	display: true,
			         	labelString: 'Times (x)',
			         	fontColor: "blue",
			         	fontStyle: "bold",
			         	fontFamily: "Poppins"
			        }
				}],
				yAxes: [{
					ticks: {
					    fontFamily: "Poppins",
					    fontStyle: "bold",
					},
					scaleLabel: {
			          	display: true,
			         	labelString: 'RPM (y)',
			         	fontColor: "blue",
			         	fontStyle: "bold",
			         	fontFamily: "Poppins"
			        }
				}],
			},
		};

let options2 = {
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
					},
					scaleLabel: {
			          	display: true,
			         	labelString: 'Times (x)',
			         	fontColor: "blue",
			         	fontStyle: "bold",
			         	fontFamily: "Poppins"
			        }
				}],
				yAxes: [{
					ticks: {
					    fontFamily: "Poppins",
					    fontStyle: "bold",
					},
					scaleLabel: {
			          	display: true,
			         	labelString: 'Level (y)',
			         	fontColor: "blue",
			         	fontStyle: "bold",
			         	fontFamily: "Poppins"
			        }
				}],
			},
		};