var sellCurrencyId = 0;
var buyCurrencyId = 0;

var sellSum = 0;
var buySum = 0;

let sellCurrency = ''; //Хранит название продаваемой валюты STRING
let buyCurrency = ''; //Хранит название покупаемой валюты STRING
let sellCurMark = document.getElementById('sellCurMark');
let buyCurMark = document.getElementById('buyCurMark');
let cur1_sum = document.getElementById('cur1_sum');
let cur2_sum = document.getElementById('cur2_sum');

let sellinput = document.getElementById('sellinput');
let buyinput = document.getElementById('buyinput');

//Функция которая повышает число на коэффицент
function increase(number) {
    return number * 1.08;
}

//Функция которая понижает число на коэффицент
function decrease(number) {
    return number * 0.92;
}

//Функция которая принимает название валюты словом и возвращает строку с маркой валюты
function getCurrencyMark(currency) {
    switch(currency) {
        case 'Tron':
            return 'TRX';
        case 'Bitcoin':
            return 'BTC';
        case 'Ethereum':
            return 'ETH';
        case 'Polygon':
            return 'MATIC';
        case 'Solana':
            return 'SOL';
        case 'Tether USD':
            return 'USDT';
        case 'USD Coin':
            return 'USDC';
        case 'Binance USD':
            return 'BUSD';
        case 'BNB':
            return 'BNB';
        case 'PancakeSwap':
            return 'CAKE';
        case 'Toncoin':
            return 'TON';
        case 'Notcoin':
            return 'NOT';
        default:
            return '';
    }
}

//Функция которая принимает название валюты словом и возвращает id валюты для API числом INT
function getCurrencyId(currency) {
    switch(currency) {
        case 'Tron':
            return 2713;
        case 'Bitcoin':
            return 90;
        case 'Ethereum':
            return 80;
        case 'Polygon':
            return 33536;
        case 'Solana':
            return 48543;
        case 'Tether USD':
            return 518;
        case 'USD Coin':
            return 33285;
        case 'Binance USD':
            return 48591;
        case 'BNB':
            return 2710;
        case 'PancakeSwap':
            return 45985;
        case 'Toncoin':
            return 54683;
        case 'Notcoin':
            return 54683;
        default:
            return 0;
    }
}



        //Функция которая ревгирует на нажатие на вариант валюты в поле выбора
        function handleVariationClick(event, type) {
            let variations = event.target.closest('.selector').querySelectorAll('.variation');
            variations.forEach(item => {
                item.classList.remove('active_variation');
            });

            let selectedVariation = event.target.closest('.variation');
            selectedVariation.classList.add('active_variation');

            let selectedCurrency = selectedVariation.querySelector('.var_name').textContent;

            if (type === 'sell') {
                sellCurrency = selectedCurrency; // Записывает название продаваемой валюты STRING
                console.log('Selected Sell Currency:', sellCurrency);
                sellCurMark.innerHTML = getCurrencyMark(sellCurrency);
                cur1_sum.innerHTML = `${sellSum} ${getCurrencyMark(sellCurrency)}`;
            } else if (type === 'buy') {
                buyCurrency = selectedCurrency; // Записывает название покупаемой валюты STRING
                console.log('Selected Buy Currency:', buyCurrency);
                buyCurMark.innerHTML = getCurrencyMark(buyCurrency);
                cur2_sum.innerHTML = `${buySum} ${getCurrencyMark(buyCurrency)}`;
            }
            updateIcons();
        }

        // Обработчики события для предидущих функций
        // Add event listeners for sell variations
        document.querySelectorAll('.sell .variation').forEach(variation => {
            variation.addEventListener('click', (event) => handleVariationClick(event, 'sell'));
        });

        // Add event listeners for buy variations
        document.querySelectorAll('.buy .variation').forEach(variation => {
            variation.addEventListener('click', (event) => handleVariationClick(event, 'buy'));
        });

var sc = document.getElementById('sc');
var ss = document.getElementById('ss');
var bc = document.getElementById('bc');
var bs = document.getElementById('bs');


// Функция котрая реагирует на ввод суммы продаваемой валюты
sellinput.addEventListener('input', async function(event) {
    let inputValue = event.target.value;
    buyinput.style.pointerEvents = 'none';
    const baseCurrency = getCurrencyId(sellCurrency);
    const targetCurrency = getCurrencyId(buyCurrency);
    const amount = inputValue;
    
    try {
        const response = await fetch(`/convert?baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}&amount=${amount}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error converting currencies');
        }
        
        console.log(data);
        buyinput.value = data.convertedAmount;
        cur1_sum.innerHTML = `${inputValue} ${getCurrencyMark(sellCurrency)}`;
        cur2_sum.innerHTML = `${decrease(data.convertedAmount)} ${getCurrencyMark(buyCurrency)}`;
        sellSum = inputValue;
        buySum = decrease(data.convertedAmount);
        sc.value = sellCurrency;
        ss.value = sellSum;
        bc.value = buyCurrency;
        bs.value = buySum;
    } catch (error) {
        console.error('Error:', error);
    }
});

// Функция котрая реагирует на ввод суммы покупаемой валюты
buyinput.addEventListener('input', async function(event) {
    let inputValue = event.target.value;
    sellinput.style.pointerEvents = 'none';
    const baseCurrency = getCurrencyId(buyCurrency);
    const targetCurrency = getCurrencyId(sellCurrency);
    const amount = inputValue;
    
    try {
        const response = await fetch(`/convert?baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}&amount=${amount}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error converting currencies');
        }
        
        console.log(data);
        sellinput.value = data.convertedAmount;
        cur1_sum.innerHTML = `${increase(data.convertedAmount)} ${getCurrencyMark(sellCurrency)}`;
        cur2_sum.innerHTML = `${inputValue} ${getCurrencyMark(buyCurrency)}`;
        sellSum = increase(data.convertedAmount);
        buySum = inputValue;
        sc.value = sellCurrency;
        ss.value = sellSum;
        bc.value = buyCurrency;
        bs.value = buySum;
    } catch (error) {
        console.error('Error:', error);
    }
});

//Функция которая устанавливает иконки валют
function updateIcons() {
    let sellCurIcon1 = document.getElementById('sellCurIcon1');
    let buyCurIcon1 = document.getElementById('buyCurIcon1');
    let sellCurIcon2 = document.getElementById('sellCurIcon2');
    let buyCurIcon2 = document.getElementById('buyCurIcon2');

    let sMark = getCurrencyMark(sellCurrency).toLowerCase();
    let bMark = getCurrencyMark(buyCurrency).toLowerCase();

    sellCurIcon1.src = `/images/${sMark}.png`;
    sellCurIcon2.src = `/images/${sMark}.png`;
    buyCurIcon1.src = `/images/${bMark}.png`;
    buyCurIcon2.src = `/images/${bMark}.png`;
}