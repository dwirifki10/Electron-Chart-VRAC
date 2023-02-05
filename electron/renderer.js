// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort }  = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const tableify = require('tableify');
const fs = require('fs').promises;

const { ipcRenderer } = require('electron');

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

async function createTxt(obj) {
  try{
    await fs.appendFile(`/Log/Log - ${new Date().toDateString()}.txt`, `${JSON.stringify(obj)},`, (error) => {
    if(error) throw error;
      document.getElementById('val').classList.add('text-success');
      document.getElementById('val').classList.remove('text-remove');
      document.getElementById('val').innerHTML = 'successfully write to a file';
    })
  }catch(error) {
      document.getElementById('val').classList.add('text-danger');
      document.getElementById('val').classList.remove('text-success');
      document.getElementById('val').innerHTML = `Got an error trying to write to a file: ${error.message}`;
  }
}

function collectData(param) {
  let port = document.getElementById('port').value;
  let rate = document.getElementById('rate').value;

  console.log(port, rate);
  document.getElementById('session').value = param;
  let res = new SerialPort({path: port, baudRate: parseInt(rate)});

  if(param == 0) { 
    ipcRenderer.send('relaunch');
  }

  res.on('error', (err) => {
    if(err) {
      console.log(err);
      document.getElementById('val').classList.add('text-danger');
      document.getElementById('val').classList.remove('text-success');
      document.getElementById('val').innerHTML = "an error occured : " + err
      return;
    }
  });

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
    createTxt(obj);
    array = [obj];
    tableData = tableify(array)
    document.getElementById('result').innerHTML = tableData;
    if (document.getElementById('result').childNodes.length !== 0) {
        document.getElementById('val').classList.add('text-success');
        document.getElementById('val').classList.remove('text-danger');
        document.getElementById('connected').classList.add("d-none");
        document.getElementById('disconnected').classList.remove("d-none");
        document.getElementById('val').innerHTML = "connected successfully";
    }
  });  
}

// setInterval(collectData(1), 60000);

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