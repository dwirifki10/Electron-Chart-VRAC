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
let trial = null;
let boolReset = true;

async function createTxt(obj) {
  try{
    await fs.appendFile(`/LOG/Log - ${new Date().toDateString()}.txt`, `${JSON.stringify(obj)},`, (error) => {
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

function sendData() {
  let PWM = document.getElementById('PWM').value;
  let port = document.getElementById('port').value;
  let rate = document.getElementById('rate').value;
  
  console.log(PWM, port, rate);
  let res = new SerialPort({path: port, baudRate: parseInt(rate)});
  res.write(PWM.toString(), (err) => {
    if(err) {
      document.getElementById('val').innerHTML = "error occured : " + err;
      document.getElementById('val').classList.add('text-danger');
      document.getElementById('val').classList.remove('text-success');
      console.log(err);
    }
    document.getElementById('val').innerHTML = "successfully write data";
    document.getElementById('val').classList.add('text-success');
    document.getElementById('val').classList.remove('text-danger');
  });

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
    if(obj["Trial"] != undefined) {
      dataFirst.data.push(obj["RPM"]);
      dataSecond.data.push(obj["Lower Threshold"]);
      dataThird.data.push(obj["Upper Threshold"]);
      trial = obj["Trial"];
    }
    if(obj["Level"] != undefined) {
      if(trial >= 4 && trial <= 10) {
        dataFourth.data.push(obj["Level"]);
        labels.push((parseInt(trial) + 1) * 30);
      }else {
        dataFourth.data.push(obj["Level"]);
        labels.push((parseInt(trial) + 1) * 20);
      }
    }else {
      dataFourth.data.push("");
      labels.push("");
    }
    createTxt(obj);
    array = [obj];
    tableData = tableify(array)
    document.getElementById('result').innerHTML = tableData;
    if (document.getElementById('result').childNodes.length !== 0) {
        document.getElementById('val').classList.add('text-success');
        document.getElementById('val').classList.remove('text-danger');
        document.getElementById('connected').classList.add("d-none");
        document.getElementById('reset').classList.add("d-none");
        document.getElementById('disconnected').classList.remove("d-none");
        document.getElementById('val').innerHTML = "connected successfully";
    }
  });  
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
    if(obj["Trial"] != undefined) {
      dataFirst.data.push(obj["RPM"]);
      dataSecond.data.push(obj["Lower Threshold"]);
      dataThird.data.push(obj["Upper Threshold"]);
      trial = obj["Trial"];
    }
    if(obj["Level"] != undefined) {
      dataFourth.data.push(obj["Level"]);
      if(trial >= 4 && trial <= 10) {
        labels.push((parseInt(trial) + 1) * 30);
      }else {
        labels.push((parseInt(trial) + 1) * 20);
      }
    }else {
      dataFourth.data.push("");
      labels.push("");
    }
    createTxt(obj);
    array = [obj];
    tableData = tableify(array)
    document.getElementById('result').innerHTML = tableData;
    if (document.getElementById('result').childNodes.length !== 0) {
        document.getElementById('val').classList.add('text-success');
        document.getElementById('val').classList.remove('text-danger');
        document.getElementById('connected').classList.add("d-none");
        document.getElementById('reset').classList.add("d-none");
        document.getElementById('disconnected').classList.remove("d-none");
        document.getElementById('val').innerHTML = "connected successfully";
    }
  });  
}

// setInterval(collectData(1), 60000);

let ctx = document.getElementById('myChart').getContext('2d');
let ctg = document.getElementById('myGraph').getContext('2d');

async function saveData() {
  var canvas = document.getElementById("myChart");
  var dataURL = canvas.toDataURL("png/jpg");
  var dataURL2 = document.getElementById("myGraph").toDataURL("png/jpg");
  var dataName = new Date().toDateString() + " - " + Math.random().toString(36).substr(2, 9).toUpperCase();
  await fs.writeFile(`/LOG/Chart/Chart - ${dataName}.png`, dataURL.replace(/^data:image\/\w+;base64,/, ""), "base64", function(err) {
    if (err) throw err;
    console.log("File saved");
  });
  await fs.writeFile(`/LOG/Chart/Chart2 - ${dataName}.png`, dataURL2.replace(/^data:image\/\w+;base64,/, ""), "base64", function(err) {
    if (err) throw err;
    console.log("File saved");
  });
  document.getElementById('myFile').innerHTML = "File Saved";
  await setTimeout(() => {
    document.getElementById('myFile').innerHTML = ""
  }, 5000);
} 

async function resetChart() {
  if(trial == 5 && boolReset == true) {
    await saveData();
    labels = [];
    dataFirst.data = [];
    dataSecond.data = [];
    dataThird.data = [];
    dataFourth.data = [];
    boolReset = false;
  }else if(trial == 11 && boolReset == false) {
    await saveData();
    boolReset = true;
    collectData(0);
  }
}


setInterval(() => {
  // show chart
  resetChart();
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [dataFirst, dataThird, dataSecond],
    },
    options: options
  });
}, 3000);

setInterval(() => {
  // show chart
  resetChart();
  let myGraph = new Chart(ctg, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [dataFourth]
    },
    options: options2
  })
}, 3000);