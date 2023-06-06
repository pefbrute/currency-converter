const form = document.getElementById('converter-form');
		const resultDiv = document.getElementById('result');

		const clearButton = document.getElementById("clear");
		const exchangeRatesTextarea = document.getElementById("exchange-rates");	
		
		  
		clearButton.addEventListener("click", function() {
		  exchangeRatesTextarea.value = "";
		});
		
		
		const currencyDropdown = document.getElementById("currency");

		currencyDropdown.addEventListener("change", () => {
		   makeCalculations() 
		});
		
		var amountInput = document.getElementById("amount");

		amountInput.addEventListener("input", function() {
	            makeCalculations()
		});
		
		var exchangeRatesInput = document.getElementById("exchange-rates");
		
		exchangeRatesInput.addEventListener("input", function() {
	            makeCalculations()
		});
		
		var deliveryTimeCheckBox = document.getElementById("delivery-time-checkbox")
		
		deliveryTimeCheckBox.addEventListener("click", function() {
		    makeCalculations();
		});
		
		var onlineExchangeCheckBox = document.getElementById("online-exchange-checkbox")
		
		onlineExchangeCheckBox.addEventListener("click", function() {
		    makeCalculations();
		});
		
		var atmCheckBox = document.getElementById("atm-checkbox")
		
		atmCheckBox.addEventListener("click", function() {
		    makeCalculations();
		});
		
		var secondPartnerCheckBox = document.getElementById("second-partner-checkbox")
		
		secondPartnerCheckBox.addEventListener("click", function() {
		    makeCalculations();
		});



		  form.addEventListener('submit', (event) => {
		    makeCalculations()
		  });

	function get_rate_and_rubles(amountRupee, exchangeRatesStr) {
	  // Проверка на невалидный ввод
	  amountRupee = parseInt(amountRupee);
	  if (isNaN(amountRupee) || amountRupee <= 0) {
	    return 'Invalid input';
	  }

	  // Парсинг строки с курсами обмена
	  const exchangeRates = parseExchangeRates(exchangeRatesStr)

	  // Нахождение курса для заданного количества рупий
	  let rate = null;
	  let foundRate = false;
	  let rubles = 0;
	  
	  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
	    if (limit * exchangeRate >= amountRupee) {
	      foundRate = true;
	      rate = exchangeRate;
	      rubles = amountRupee / rate;
	      break;
	    }
	  }
	  
    	  if (!foundRate) {
		  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
		  const limits = Object.keys(exchangeRates);
		  const maxLimit = Math.max(...limits);
		  const maxRate = exchangeRates[maxLimit];
		  
		  rubles = amountRupee / maxRate;
		  rate = maxRate;
	  }

	  // Расчёт значений для нижнего и верхнего предела рупий
	  const low = 5000 * Math.floor(amountRupee / 5000);
	  const high = 5000 * Math.ceil(amountRupee / 5000);

	  // Нахождение курса для заданного количества рупий (нижний предел)
	  let lowRubles = 0;
	  let lowRate = 0;
	  let foundLowRate = false;
	  for (const [limit, rate] of Object.entries(exchangeRates)) {
	    if (limit * rate >= low) {
	      foundLowRate = true;
	      lowRubles = low / rate;
	      lowRate = rate;
	      break;
	    }
	  }
	  
  	  if (!foundLowRate) {
		  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
		  const limits = Object.keys(exchangeRates);
		  const maxLimit = Math.max(...limits);
		  const maxRate = exchangeRates[maxLimit];
		  
		  lowRubles = low / maxRate;
		  lowRate = maxRate;
	  }

	  lowRubles = Math.round(lowRubles);

	  // Нахождение курса для заданного количества рупий (верхний предел)
	  let highRate = 0;
	  let highRubles = 0;
	  let foundHighRate = false;
	  for (const [limit, rate] of Object.entries(exchangeRates)) {
	    if (limit * rate >= high) {
	      foundHighRate = true;
	      highRubles = high / rate;
	      highRate = rate;
	      break;
	    }
	  }
	  
	  if (!foundHighRate) {
		  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
		  const limits = Object.keys(exchangeRates);
		  const maxLimit = Math.max(...limits);
		  const maxRate = exchangeRates[maxLimit];
		  
		  highRubles = high / maxRate;
		  highRate = maxRate;
	  }
	  
	  highRubles = Math.round(highRubles);

		// Форматирование чисел с помощью метода toLocaleString
		const formattedLowRubles = formatNumber(lowRubles);
		const formattedLowRupees = formatNumber(low);
		const formattedRubles = formatNumber(rubles)
		const formattedRupees = formatNumber(amountRupee);
		const formattedHighRubles = formatNumber(highRubles);
		const formattedHighRupees = formatNumber(high);
		
		let deliveryTimeCheckBox = '';
		if (document.getElementById('delivery-time-checkbox').checked) {
			deliveryTimeCheckBox = '\n\nМы доставим рупии в течении 1-2 часов';
		}
		
  		let onlineExchangeCheckBox = '';
		if (document.getElementById('online-exchange-checkbox').checked) {
			onlineExchangeCheckBox = 'онлайн обмен через оператора';
		}
		
		let atmCheckBox = '';
		if (document.getElementById('atm-checkbox').checked) {
			atmCheckBox = 'АТМ';
		}	
		
		let secondPartnerCheckBox = '';
		if (document.getElementById('second-partner-checkbox').checked) {
			secondPartnerCheckBox = 'партнёр 2';
		}
		

		// Возвращение строки с результатами
		return `Стоимость: ${formattedRubles} рублей\nКурс обмена: 1 рубль = ${rate} рупий\nПолучите: ${formattedRupees} рупий${deliveryTimeCheckBox}\n\nМы принимаем оплату через банковский перевод на Тинькофф и СБЕР\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedRubles} / ${rate} / ${formattedRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}#${formattedLowRubles} / ${lowRate} / ${formattedLowRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}_${formattedHighRubles} / ${highRate} / ${formattedHighRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}`;
	}			
		
		
		function get_rate_and_rupees(amountRubles, exchangeRatesStr) {
		    amountRubles = parseInt(amountRubles);

		    if (amountRubles <= 0) {
			return 'Invalid input';
		    }

		    const exchangeRates = parseExchangeRates(exchangeRatesStr);	    		   
		
		    		   
		    let rate = null;
		    let rupees = 0;
		    let foundRate = false;

		    // Find exchange rate for the given amount in rubles
		    for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
			if (limit >= amountRubles) {
		            foundRate = true;
			    rate = exchangeRate;
			    rupees = Math.round(amountRubles * exchangeRate);
			    break;
			}
		    }

  	        if (!foundRate) {
		  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
		  const limits = Object.keys(exchangeRates);
		  const maxLimit = Math.max(...limits);
		  const maxRate = exchangeRates[maxLimit];
		  
		  rupees = amountRubles * maxRate;
		  rate = maxRate;
	  	}	
		
		  // Расчёт значений для нижнего и верхнего предела рупий
		  const low = 5000 * Math.floor(rupees / 5000);
		  const high = 5000 * Math.ceil(rupees / 5000);

		  // Нахождение курса для заданного количества рупий (нижний предел)
		  let lowRubles = 0;
		  let lowRate = 0;
		  let foundLowRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= low) {
		      foundLowRate = true;
		      lowRubles = low / rate;
		      lowRate = rate;
		      break;
		    }
		  }
		  
	  	  if (!foundLowRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  lowRubles = low / maxRate;
			  lowRate = maxRate;
		  }

		  lowRubles = Math.round(lowRubles);

		  // Нахождение курса для заданного количества рупий (верхний предел)
		  let highRate = 0;
		  let highRubles = 0;
		  let foundHighRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= high) {
		      foundHighRate = true;
		      highRubles = high / rate;
		      highRate = rate;
		      break;
		    }
		  }
		  
		  if (!foundHighRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  highRubles = high / maxRate;
			  highRate = maxRate;
		  }
		  
		  highRubles = Math.round(highRubles);
		
		  const formattedLowRubles = formatNumber(lowRubles);
		  const formattedLowRupees = formatNumber(low);
		  const formattedRubles = formatNumber(amountRubles);
		  const formattedRupees = formatNumber(rupees);			 
		  const formattedHighRubles = formatNumber(highRubles);
		  const formattedHighRupees = formatNumber(high); 
		  
		  
		  
		let deliveryTimeCheckBox = '';
		if (document.getElementById('delivery-time-checkbox').checked) {
			deliveryTimeCheckBox = '\n\nМы доставим рупии в течении 1-2 часов';
		}
		
  		let onlineExchangeCheckBox = '';
		if (document.getElementById('online-exchange-checkbox').checked) {
			onlineExchangeCheckBox = 'онлайн обмен через оператора';
		}
		
		let atmCheckBox = '';
		if (document.getElementById('atm-checkbox').checked) {
			atmCheckBox = 'АТМ';
		}
		
		let secondPartnerCheckBox = '';
		if (document.getElementById('second-partner-checkbox').checked) {
			secondPartnerCheckBox = 'партнёр 2';
		}
		
		return `Стоимость: ${formattedRubles} рублей\nКурс обмена: 1 рубль = ${rate} рупий\nПолучите: ${formattedRupees} рупий${deliveryTimeCheckBox}\n\nМы принимаем оплату через банковский перевод на Тинькофф и СБЕР\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedRubles} / ${rate} / ${formattedRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}#${formattedLowRubles} / ${lowRate} / ${formattedLowRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}_${formattedHighRubles} / ${highRate} / ${formattedHighRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}`;
		}
		
		
		function get_rate_and_USDT(amountUSDT, exchangeRatesStr) {
		    amountUSDT = parseInt(amountUSDT);

		    if (amountUSDT <= 0) {
			return 'Invalid input';
		    }

		    const exchangeRates = parseUSDTExchangeRates(exchangeRatesStr);		 		
		    		   
		    let rate = null;
		    let rupees = 0;
		    let foundRate = false;

		    // Find exchange rate for the given amount in rubles
		    for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
			if (limit >= amountUSDT) {
		            foundRate = true;
			    rate = exchangeRate;
			    rupees = Math.round(amountUSDT * exchangeRate);
			    break;
			}
		    }

  	        if (!foundRate) {
		  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
		  const limits = Object.keys(exchangeRates);
		  const maxLimit = Math.max(...limits);
		  const maxRate = exchangeRates[maxLimit];
		  
		  rupees = amountUSDT * maxRate;
		  rate = maxRate;
	  	}	
		
		  // Расчёт значений для нижнего и верхнего предела рупий
		  const low = 5000 * Math.floor(rupees / 5000);
		  const high = 5000 * Math.ceil(rupees / 5000);
		 
		  // Нахождение курса для заданного количества рупий (нижний предел)
		  let lowUSDT = 0;
		  let lowRate = 0;
		  let foundLowRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= low) {
		      foundLowRate = true;
		      lowUSDT = low / rate;
		      lowRate = rate;
		      break;
		    }
		  }
		  
	  	  if (!foundLowRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  lowUSDT = low / maxRate;
			  lowRate = maxRate;
		  }

		  lowUSDT = Math.round(lowUSDT);

		  // Нахождение курса для заданного количества рупий (верхний предел)
		  let highRate = 0;
		  let highUSDT = 0;
		  let foundHighRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= high) {
		      foundHighRate = true;
		      highUSDT = high / rate;
		      highRate = rate;
		      break;
		    }
		  }
		  
		  if (!foundHighRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  highUSDT = high / maxRate;
			  highRate = maxRate;
		  }
		  
		  highUSDT = Math.round(highUSDT);
		
		  const formattedLowUSDT = formatNumber(lowUSDT)
		  const formattedLowRupees = formatNumber(low)
		  const formattedUSDT = formatNumber(amountUSDT)
		  const formattedRupees = formatNumber(rupees)		 
		  const formattedHighUSDT = formatNumber(highUSDT);
		  const formattedHighRupees = formatNumber(high);
		  
  		let deliveryTimeCheckBox = '';
		if (document.getElementById('delivery-time-checkbox').checked) {
			deliveryTimeCheckBox = '\n\nМы доставим рупии в течении 1-2 часов';
		}
		
  		let onlineExchangeCheckBox = '';
		if (document.getElementById('online-exchange-checkbox').checked) {
			onlineExchangeCheckBox = 'онлайн обмен через оператора';
		}
		
		let atmCheckBox = '';
		if (document.getElementById('atm-checkbox').checked) {
			atmCheckBox = 'АТМ';
		}
		
		let secondPartnerCheckBox = '';
		if (document.getElementById('second-partner-checkbox').checked) {
			secondPartnerCheckBox = 'партнёр 2';
		}
			  
			return `Стоимость: ${formattedUSDT} USDT\nКурс обмена: 1 USDT = ${rate} рупий\nПолучите: ${formattedRupees} рупий ${deliveryTimeCheckBox}\n\nМы принимаем оплату через Binance\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedUSDT} / ${rate} / ${formattedRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}#${formattedLowUSDT} / ${lowRate} / ${formattedLowRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}_${formattedHighUSDT} / ${highRate} / ${formattedHighRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}`;
		}
		
		function get_USDT_to_Rupees(amountRupee, exchangeRatesStr) {
		  // Проверка на невалидный ввод
		  amountRupee = parseInt(amountRupee);
		  if (isNaN(amountRupee) || amountRupee <= 0) {
		    return 'Invalid input';
		  }

		  // Парсинг строки с курсами обмена
		  const exchangeRates = parseUSDTExchangeRates(exchangeRatesStr)

		  // Нахождение курса для заданного количества рупий
		  let rate = null;
		  let foundRate = false;
		  let USDT = 0;
		  
		  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
		    if (limit * exchangeRate >= amountRupee) {
		      foundRate = true;
		      rate = exchangeRate;
		      USDT = amountRupee / rate;
		      break;
		    }
		  }
		  
	    	  if (!foundRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  USDT = amountRupee / maxRate;
			  rate = maxRate;
		  }

		  // Расчёт значений для нижнего и верхнего предела рупий
		  const low = 5000 * Math.floor(amountRupee / 5000);
		  const high = 5000 * Math.ceil(amountRupee / 5000);

		  // Нахождение курса для заданного количества рупий (нижний предел)
		  let lowUSDT = 0;
		  let lowRate = 0;
		  let foundLowRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= low) {
		      foundLowRate = true;
		      lowUSDT = low / rate;
		      lowRate = rate;
		      break;
		    }
		  }
		  
	  	  if (!foundLowRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  lowUSDT = low / maxRate;
			  lowRate = maxRate;
		  }

		  lowUSDT = Math.round(lowUSDT);

		  // Нахождение курса для заданного количества рупий (верхний предел)
		  let highRate = 0;
		  let highUSDT = 0;
		  let foundHighRate = false;
		  for (const [limit, rate] of Object.entries(exchangeRates)) {
		    if (limit * rate >= high) {
		      foundHighRate = true;
		      highUSDT = high / rate;
		      highRate = rate;
		      break;
		    }
		  }
		  
		  if (!foundHighRate) {
			  // Обработка случая, когда заданное количество рупий не попадает в нижний предел
			  const limits = Object.keys(exchangeRates);
			  const maxLimit = Math.max(...limits);
			  const maxRate = exchangeRates[maxLimit];
			  
			  highUSDT = high / maxRate;
			  highRate = maxRate;
		  }
		  
		  highUSDT = Math.round(highUSDT);

		// Форматирование чисел с помощью метода toLocaleString
		const formattedLowUSDT = formatNumber(lowUSDT);
		const formattedLowRupees = formatNumber(low)
		const formattedUSDT = formatNumber(USDT)
		const formattedRupees = formatNumber(amountRupee)
		const formattedHighUSDT = formatNumber(highUSDT)
		const formattedHighRupees = formatNumber(high)
			
  		let deliveryTimeCheckBox = '';
		if (document.getElementById('delivery-time-checkbox').checked) {
			deliveryTimeCheckBox = '\n\nМы доставим рупии в течении 1-2 часов';
		}	
		
  		let onlineExchangeCheckBox = '';
		if (document.getElementById('online-exchange-checkbox').checked) {
			onlineExchangeCheckBox = 'онлайн обмен через оператора';
		}
		
		let atmCheckBox = '';
		if (document.getElementById('atm-checkbox').checked) {
			atmCheckBox = 'АТМ';
		}
		
		let secondPartnerCheckBox = '';
		if (document.getElementById('second-partner-checkbox').checked) {
			secondPartnerCheckBox = 'партнёр 2';
		}
			  
			return `Стоимость: ${formattedUSDT} USDT\nКурс обмена: 1 USDT = ${rate} рупий\nПолучите: ${formattedRupees} рупий ${deliveryTimeCheckBox}\n\nМы принимаем оплату через Binance\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedUSDT} / ${rate} / ${formattedRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}#${formattedLowUSDT} / ${lowRate} / ${formattedLowRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}_${formattedHighUSDT} / ${highRate} / ${formattedHighRupees} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}`;
		}


		
		function copyToClipboard(id) {
			const result = document.getElementById(id).innerText;

			const tempTextArea = document.createElement('textarea');
			tempTextArea.value = result;
			document.body.appendChild(tempTextArea);

			tempTextArea.select();
			document.execCommand('copy');

			document.body.removeChild(tempTextArea);
		}
		
	function parseExchangeRates(exchangeRatesStr) {
	  const exchangeRates = {};
	  const pattern = /^До (\d+)-(\d+\.\d+)$/gm;
	  let matches;
	  while ((matches = pattern.exec(exchangeRatesStr)) !== null) {
	    const limit = parseInt(matches[1]);
	    const rate = parseFloat(matches[2]);
	    exchangeRates[limit] = rate;
	  }
	  return exchangeRates;
	}
	
	function parseUSDTExchangeRates(exchangeRatesStr) {
	  const exchangeRates = {};
	  const pattern = /^До (\d+)-(\d+)$/gm;
	  let matches;
	  while ((matches = pattern.exec(exchangeRatesStr)) !== null) {
	    const limit = parseInt(matches[1]);
	    const rate = parseFloat(matches[2]);
	    exchangeRates[limit] = rate;
	  }
	  return exchangeRates;
	}
	
	function makeCalculations(){
	    const amountInput = document.getElementById('amount');
	    const amount = parseInt(amountInput.value);
	    const exchangeRatesInput = document.getElementById('exchange-rates');
	    const exchangeRates = exchangeRatesInput.value.trim();
	    const currencyInput = document.getElementById('currency');
	    const currency = currencyInput.value;



	    let result;

	    if (currency === 'rubles') {
		result = get_rate_and_rubles(amount, exchangeRates);
	    } else if (currency === 'rupees') {
		result = get_rate_and_rupees(amount, exchangeRates);
	    } else if (currency === 'USDT') {
	        result = get_rate_and_USDT(amount, exchangeRates);		    	
	    } else if (currency === 'USDT-Rupees') {
	        result = get_USDT_to_Rupees(amount, exchangeRates);		    	
	    }

	    const lastVrtclLnIndex = result.lastIndexOf("|");
	    const lastGateIndex = result.lastIndexOf("#");
	    const lastUnderlineIndex = result.lastIndexOf("_");
	    
	    const clientsString = result.slice(0, lastVrtclLnIndex);
	    const stringCommon = result.slice(lastVrtclLnIndex + 1, lastGateIndex)
	    const stringLow = result.slice(lastGateIndex + 1, lastUnderlineIndex);
	    const stringHigh = result.slice(lastUnderlineIndex + 1)
	    
	    console.log(stringLow)
	
	    const clientsResultDiv = document.getElementById('result_clients');
	    clientsResultDiv.innerText = clientsString;
	    
    	    const commonResultDiv = document.getElementById('result_common');
	    commonResultDiv.innerText = stringCommon;
	
	    const lowResultDiv = document.getElementById('result_low');
	    lowResultDiv.innerText = stringLow;
	    
	    const highResultDiv = document.getElementById('result_high');
	    highResultDiv.innerText = stringHigh;
	}
	
	
	function formatNumber(num) {
	  return num.toLocaleString('ru', {
	    minimumFractionDigits: 0,
	    maximumFractionDigits: 0,
	    useGrouping: true,
       });
}
