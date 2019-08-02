var ta_url = "https://demokits.biilabs.io:5567"
var txn_tag = "WEBDURINOTESTAD"
var list_hash = [];
var list_temp = [];
var list_humidity = [];
var timer_interval = 300000;


// TODO:
// Flowchart
// Code refactory: Search HERE
// Cateory by date
// Device trigger

function draw_humidity_gchart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'humidity');
      
      data.addRows(list_humidity);
      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Temperature'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_humidity_div'));

      chart.draw(data, options);
    }
function draw_temp_gchart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'temperature');
      
      data.addRows(list_temp);
      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Temperature'
        },
	colors: ['red']
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_temperature_div'));

      chart.draw(data, options);
    }

function fromTrytes(inputTrytes) {

    // If input is not a string, return null
    if ( typeof inputTrytes !== 'string' ) return null

    // If input length is odd, return null
    if ( inputTrytes.length % 2 ) return null

    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var outputString = "";

    for (var i = 0; i < inputTrytes.length; i += 2) {
        // get a trytes pair
        var trytes = inputTrytes[i] + inputTrytes[i + 1];

        var firstValue = TRYTE_VALUES.indexOf(trytes[0]);
        var secondValue = TRYTE_VALUES.indexOf(trytes[1]);
        var decimalValue = firstValue + secondValue * 27;

        var character = String.fromCharCode(decimalValue);
        outputString += character;
    }

    return outputString;
}

function calculate() {

  // HERE
  // console.log("GOOOOOD" + this.responseText);
  // return;

  var json_list_txn = JSON.parse(this.responseText);
  if (json_list_txn.transactions.length == 0)
	return false;

  console.log("Start to parsing ... " + json_list_txn.transactions.length.toString());
  for (var i = 0; i < json_list_txn.transactions.length; i++) { 
    list_hash.push(json_list_txn.transactions[i].signature_and_message_fragment);
  } 

  for (var i = 0; i < list_hash.length; i++) {
	  // Get transaction message field
	  var message = fromTrytes(list_hash[i].substring(0, 38));
	  console.log(message);
	  var div = document.getElementById('divID');
	  div.innerHTML += message + "<br>";

	  // Append data
          var array_temp = ([i, parseInt(message.split(",")[1])]);
	  list_temp.push(array_temp);
          var array_humidity = ([i, parseInt(message.split(",")[2])]);
	  list_humidity.push(array_humidity);
  }

  // GChart drawing temperature
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(draw_temp_gchart);
  
  // GChart drawing humidity
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(draw_humidity_gchart);
}

// The timer function
function read_data_from_blockchain() {
  var req_url = ta_url + "/tag/" + txn_tag;
  console.log(req_url);
  http_request('GET', req_url, calculate);
}

// The timer triggered function
function get_txn_timer() {
  read_data_from_blockchain();
}

// The timer
setInterval(get_txn_timer, timer_interval);
get_txn_timer();
