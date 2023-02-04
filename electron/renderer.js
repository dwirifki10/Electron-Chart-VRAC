// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort }  = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const tableify = require('tableify');

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return;
    } else {
      document.getElementById('error').textContent = '';
    }
    // console.log('ports', ports);

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered';
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML;
  });
}

function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 2000);

listSerialPorts();

let labels = [];

function collectData() {
  let port = document.getElementById('port').value;
  let rate = document.getElementById('rate').value;

  console.log(port, rate);
  const res = new SerialPort({path: port, baudRate: parseInt(rate)});

  res.on('error', (err) => {
    if(err) {
      document.getElementById('val').classList.add('text-danger');
      document.getElementById('val').classList.remove('text-success');
      document.getElementById('val').innerHTML = "an error occured : " + err
      return;
    } 
  })

  const parser = res.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  parser.on('data', (data) => {
    data = data.toString().split("\t");
    obj = {};
    for (let i = 0; i < data.length; i++) {
      let keyValue = data[i].split(" : ");
      obj[keyValue[0]] = keyValue[1];
    }
    if(obj["trial"] != undefined) {
      dataFirst.data.push(obj["RPM"]);
      dataSecond.data.push(obj["current set point"]);
      labels.push("Trial " + obj["trial"]);
    }
    array = [obj];
    tableData = tableify(array)
    document.getElementById('result').innerHTML = tableData;
    if (document.getElementById('result').childNodes.length !== 0) {
        document.getElementById('val').classList.add('text-success');
        document.getElementById('val').classList.remove('text-danger');
        document.getElementById('val').innerHTML = "connected successfully";
    }
  });  
}

let ctx = document.getElementById('myChart').getContext('2d');

setInterval(() => {
  // check dataFirst is 10
  if(dataFirst.data.length == 0) {

  }
  if(dataFirst.data.length >= 12) {
    setTimeout(() => {
      labels = [];
      dataFirst.data = [];
      dataSecond.data = [];
    }, 4500);
  }
  // show chart
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [dataFirst, dataSecond],
    },
    options: options
  });
}, 5000);