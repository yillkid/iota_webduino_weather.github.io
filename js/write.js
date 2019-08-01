var rgbled;
var dht;

function write_to_blockchain(datetime, temperature, humidity) {
  var value = datetime+","+temperature+","+humidity;
  var xhr = new XMLHttpRequest();
  var url = "http://node.deviceproof.org:5566/transaction/";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.log("Blockchain write fail:" + value);
    }
  };
  
  var data = JSON.stringify({"value": 0, "message": value, "tag": "WEBDURINOTESTAE", "address": "QOWEREDBYTANGLEACCELERATOR9999999999999999999999999999999999999999999999999999999"});
  console.log("Writing data to blockchain...");
  xhr.send(data);
  console.log("Written done.");
}

function get_time(t) {
  var varNow = new Date().getTime();
  return varNow;
}

boardReady({board: 'Smart', device: '10Qpbgjy', transport: 'mqtt'}, function (board) {
  board.samplingInterval = 50;
  rgbled = getRGBLedCathode(board, 15, 12, 13);
  dht = getDht(board, 5);
  rgbled.setColor('#33ff33');
  dht.read(function(evt){
    var datetime = get_time("hms");
    document.getElementById('demo-area-01-show').innerHTML = (['<br>Time:',datetime,'<br>T(Celsius):',dht.temperature,'<br>H(%):',dht.humidity].join(''));
    write_to_blockchain(datetime, dht.temperature, dht.humidity);
  }, 1);
});
