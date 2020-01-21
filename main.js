// Time and date render section
const renderDateAndTime = () => {
	let today = new Date();
	let month = today.getMonth();

	function getDate() {
		if (month < 10) {
			month = '0' + (month+1);
		} else {
			month+1;
		}

		return today.getDate() + '.' + month;
	}

	function getTime() {
		let hours = today.getHours();
		let minutes = today.getMinutes();

		if (hours < 10) hours = '0' + hours;
		if (minutes < 10) minutes = '0' + minutes;

		return hours + ':' + minutes;
	}

	const dateValue = document.querySelector('#dateValue');
	const timeValue = document.querySelector('#timeValue');

	dateValue.innerText = getDate();
	timeValue.innerText = getTime();
};

setInterval(renderDateAndTime, 1000);

function connect() {
	let ws = new WebSocket("ws://192.168.13.85:9990");
	ws.onopen = function(e) {
		console.log("Connection is established.");
	};
  
	ws.onmessage = function(event) {
		console.log('Data received.');
		const currenciesRates = JSON.parse(event.data);
	
		console.log(currenciesRates);
	
		fillUI = currency => {
			let name = document.querySelector(`#name${currency}`);
			let priceSell = document.querySelector(`#price${currency}Sell`);
			let priceBuy = document.querySelector(`#price${currency}Buy`);
			name.innerText = currency;
	
			let sellPrice = currenciesRates[currency + ' GEL'].lquantity;
			let buyPrice = currenciesRates[currency + ' GEL'].rquantity;
	
			if (sellPrice < 10) {
				fillPrices(4, true)
			} else if (sellPrice < 100) {
				fillPrices(3, true)
			} else if (sellPrice < 1000) {
				fillPrices(2, true)
			} else if (sellPrice < 10000) {
				fillPrices(1, true)
			}
	
			if (buyPrice < 10) {
				fillPrices(4, false)
			} else if (buyPrice < 100) {
				fillPrices(3, false)
			} else if (buyPrice < 1000) {
				fillPrices(2, false)
			} else if (buyPrice < 10000) {
				fillPrices(1, false)
			}
			
			function fillPrices(pointToFix, isSellPrice) {
				isSellPrice 
					? priceSell.innerText = currenciesRates[currency + ' GEL'].lquantity.toFixed(pointToFix)
					: priceBuy.innerText = currenciesRates[currency + ' GEL'].rquantity.toFixed(pointToFix);
			}
		}
	
		for (let i in currenciesRates) {
			switch (i.replace(' GEL', '')) {
				case 'USD':
					fillUI('USD')
				case 'EUR':
					fillUI('EUR')
				// case 'RUB':
				// 	fillUI('RUB')
				// case 'PLN':
				// 	fillUI('PLN')
			}
		}
	};
  
	ws.onclose = function(e) {
	  console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
	  setTimeout(function() {
		connect();
	  }, 1000);
	};
  
	ws.onerror = function(err) {
	  console.error('Socket encountered error: ', err.message, 'Closing socket');
	  ws.close();
	};
}

connect();