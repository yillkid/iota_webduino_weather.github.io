function xhr_success () { this.callback.apply(this, this.arguments); }
function xhr_error () { console.error(this.statusText); }

function http_request(type, address, callback) {
  var req = new XMLHttpRequest();
  req.callback = callback;
  req.arguments = Array.prototype.slice.call(arguments, 2);
  req.onload = xhr_success;
  req.onerror = xhr_error;
  req.open(type, address, true);
  req.send(null);
}
