# *ghpost Address*

**A very Small infact a minute library for getting address info of a location using Ghana's Digital Adress System**,


## Installing

```shell
npm install ghpost-address
```



## Usage

```js
const ghpost = require('ghpost-address')


addr.grabAddressInfo("AK-507-4460").then(function(res) {

	console.log(res);
})

```

This will give you something similar to the following:

```js
{ 
  streetName: 'Franco Hostel Rd, Kumasi, Ghana',
  region: 'Ashanti',
  district: 'Kumasi',
  postCode: 'AK507',
  lngLat: '6.669813,-1.561062' 
}

```

## API

```js
{ grabAddressInfo: [AsyncFunction] }

grabAddressInfo(adrress, options)


address can be PostCode, coodinates, Digital Address, Places


options is an object

{
	timeout: xxxxms
}


```

`options.timeout` is in milliseconds, optional and `10000ms` by default


## Contributing
email me
# ghanapost
