const puppeteer = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');


exports.grabAddressInfo = async function (address, options) {

	const browser = await puppeteer.launch({headless: true,defaultViewport: {width: 1024,height: 780,isMobile: false}});
	const page = await browser.newPage();


	try {
		 
		 await page.evaluateOnNewDocument(function() {
		  navigator.geolocation.getCurrentPosition = function (cb) {
		    setTimeout(() => {
		      cb({
		        'coords': {
		          accuracy: 21,
		          altitude: null,
		          altitudeAccuracy: null,
		          heading:null,
		          latitude: 5.603717,
		          longitude: -0.186964,
		          speed:null
		        }
		      })
		    }, 1000)
		  }
		});

		await page.goto('https://ghanapostgps.com/mapview.html');

		await page.waitForFunction('document.querySelector("#location-detail > div > span").innerText.length > 0');

		const searchValue = await page.$eval('#location-detail > div > span', el => el.innerText);

		await page.click("#addrsearch");
		await page.keyboard.type(address);

		await page.click("#search > div.search-control > div > div.col-xs-2 > button");

		await page.waitForFunction(`document.querySelector("#location-detail > div > span").innerText != '${searchValue}'`,{timeout: options.timeout || 10000 });

		const streetName = await page.$eval('#mainpage > div > div:nth-child(4) > ul > li:nth-child(1) > div.text-warning.bold', el => el.innerText);
		const region = await page.$eval('#mainpage > div > div:nth-child(4) > ul > li:nth-child(2) > div.text-warning.bold', el => el.innerText);
		const district = await page.$eval('#mainpage > div > div:nth-child(4) > ul > li:nth-child(3) > div.text-warning.bold', el => el.innerText);
		const postCode = await page.$eval('#mainpage > div > div:nth-child(4) > ul > li:nth-child(4) > div.text-warning.bold', el => el.innerText);
		const lngLat = await page.$eval('#mainpage > div > div:nth-child(4) > ul > li:nth-child(5) > div.text-warning.bold', el => el.innerText);

		const data = {
			"streetName": streetName,
			"region": region,
			"district": district,
			"postCode": postCode,
			"lngLat": lngLat
		};

		await browser.close();

		return data;

	}catch (e ){
		await browser.close();
		return [e];
	}
}

