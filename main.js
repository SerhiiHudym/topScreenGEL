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

let socket = new WebSocket("ws://192.168.13.85:9990");

socket.onopen = function(e) {
	console.log("Connection is established.");
};

socket.onmessage = function(event) {
	console.log('Data received.');
	const currenciesRates = JSON.parse(event.data);
	console.log(currenciesRates);

	fillUI = currency => {
		let name = document.querySelector(`#name${currency}`);
		let price = document.querySelector(`#price${currency}`);
		name.innerText = currency;

		if (currenciesRates[currency + ' GEL'].lquantity.toFixed(3) < 10) {
			price.innerText = currenciesRates[currency + ' GEL'].lquantity.toFixed(3);
			//'0' + currenciesRates[currency + ' GEL'].lquantity.toFixed(3);
		} else {
			price.innerText = currenciesRates[currency + ' GEL'].lquantity.toFixed(3);
		}
	}

	for (let i in currenciesRates) {
		switch (i.replace(' GEL', '')) {
			case 'USD':
				fillUI('USD')
			case 'EUR':
				fillUI('EUR')
			case 'RUB':
				fillUI('RUB')
			// case 'PLN':
			// 	fillUI('PLN')
		}
	}
};

socket.onclose = function(event) {
	if (event.wasClean) {
		console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
	} else {
		console.log('Connection was rejected by an error.')
	}
};

socket.onerror = function(error) {
	console.log(error.message);
};
