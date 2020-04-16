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
		    }, options.timeout)
		  }
		});

		await page.goto('https://ghanapostgps.com/mapview.html');

		await page.waitForFunction('document.querySelector("#location-detail > div > .da-code").innerText.length > 0');

		const searchValue = await page.$eval('#location-detail > div > .da-code', el => el.innerText);

		await page.click("#addrsearch");	
		await page.keyboard.type(address);

		await page.keyboard.press('Enter');
		
		// await page.click("#search > div.search-control > div > div.col-xs-2 > button");

		let d = await page.evaluate( () => {
			let loc = document.querySelector("#location-detail > div > .da-code").innerText;
			return {"d": loc};
		})

		await page.waitForFunction(`document.querySelector("#location-detail > div > .da-code").innerText != '${searchValue}'`,{timeout: options.timeout || 10000 });

		
		const streetName = await page.$eval('.address-list > li.row:nth-child(2) > .col > .text-warning', el => el.innerText);
		const region = await page.$eval('.address-list > li.row:nth-child(3) > .col > .text-warning', el => el.innerText);
		const district = await page.$eval('.address-list > li.row:nth-child(4) > .col > .text-warning', el => el.innerText);
		const postCode = await page.$eval('.address-list > li.row:nth-child(5) > .col > .text-warning', el => el.innerText);
		const lngLat = await page.$eval('.address-list > li.row:nth-child(6) > .col > .text-warning', el => el.innerText);

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

