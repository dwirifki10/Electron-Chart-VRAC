let dataFirst = {
	    label: "RPM",
	    data: [],
	    fill: false,
	    backgroundColor : 'blue',
	    borderColor: 'blue'
  	};
let dataSecond = {
	    label: "Set Point",
	    data: [],
	    fill: false,
	    backgroundColor : 'red',
	  	borderColor: 'red'
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