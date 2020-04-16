const addr = require('./app');

console.log(addr);

addr.grabAddressInfo("AK-507-4460",{timeout: 100000}).then(function(da) {
	console.log(da);
})