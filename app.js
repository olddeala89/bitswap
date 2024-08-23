const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const app = express();

const token = '7302572246:AAEucwSnGibhOahr8hanxHphbocq5nU103o';
const bot = new TelegramBot(token, {polling: true});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.json()); // Для обработки JSON-данных

var currencies = [
    {
        id: 1,
        name: "Bitcoin",
        code: "BTC",
        adress: "bc1quny2qxamzfssh8xggl7ev42y6cex22f39zkfmr",
        currencyId: "90"
    },
    {
        id: 2,
        name: "Tron",
        code: "TRX",
        adress: "TBDitMwsFBHx19g7paihprj1mwADAFpFYv",
        currencyId: "2713"
    },
    {
        id: 3,
        name: "Tether USD",
        code: "USDT",
        adress: "TBDitMwsFBHx19g7paihprj1mwADAFpFYv",
        currencyId: "518"
    },
    {
        id: 4,
        name: "USD Coin",
        code: "USDC",
        adress: "TBDitMwsFBHx19g7paihprj1mwADAFpFYv",
        currencyId: "33285"
    },
    {
        id: 5,
        name: "Polygon",
        code: "MATIC",
        adress: "0xA8cCc16eEa1F8754Cd72b75Ae9b3ff895280a6f6",
        currencyId: "33536"
    },
    {
        id: 6,
        name: "Solana",
        code: "SOL",
        adress: "FqrXXVo9J87DCJkf5qa89TTEanCJyPFca1DP4GXmbtVA",
        currencyId: "48543"
    },
    {
        id: 7,
        name: "Ethereum",
        code: "ETH",
        adress: "0xA8cCc16eEa1F8754Cd72b75Ae9b3ff895280a6f6",
        currencyId: "80"
    },
    {
        id: 8,
        name: "Binance USD",
        code: "BUSD",
        adress: "0xA8cCc16eEa1F8754Cd72b75Ae9b3ff895280a6f6",
        currencyId: "48591"
    },
    {
        id: 9,
        name: "BNB",
        code: "BNB",
        adress: "0xA8cCc16eEa1F8754Cd72b75Ae9b3ff895280a6f6",
        currencyId: "2710"
    },
    {
        id: 10,
        name: "PancakeSwap",
        code: "CAKE",
        adress: "0xA8cCc16eEa1F8754Cd72b75Ae9b3ff895280a6f6",
        currencyId: "45985"
    },
    {
        id: 11,
        name: "Toncoin",
        code: "TON",
        adress: "UQCXWMKtRXA2OoYqvq7c5VdHNmPXO2zooIKGT_XvYiSq0_En",
        currencyId: "54683"
    },
    {
        id: 12,
        name: "Notcoin",
        code: "NOT",
        adress: "UQCXWMKtRXA2OoYqvq7c5VdHNmPXO2zooIKGT_XvYiSq0_En",
        currencyId: "54683"
    }
];

function findAdress(Currency) {
    currencies.forEach(element => {
        if (element.name == Currency) {
            return element.adress;
        }
    });
};

function getFileNameFromPath(filePath) {
    // Разделяем строку по символу "/" или "\", затем берем последний элемент массива
    const parts = filePath.split(/[/\\]/);
    return parts[parts.length - 1];
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/rools', (req, res) => {
    res.sendFile(__dirname + '/views/rools.html');
});

app.get('/amlkyc', (req, res) => {
    res.sendFile(__dirname + '/views/amlkyc.html');
});

app.get('/contacts', (req, res) => {
    res.sendFile(__dirname + '/views/contacts.html');
});

// Функция для получения курса криптовалюты к доллару
async function getCurrencyToUSDRate(currencyId) {
    try {
        const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=${currencyId}`);
        if (!response.data || !response.data[0] || !response.data[0].price_usd) {
            throw new Error('Invalid currency');
        }
        return response.data[0].price_usd;
    } catch (error) {
        throw new Error('Failed to fetch currency to USD exchange rate');
    }
}

app.get('/convert', async (req, res) => {
    const { baseCurrency, targetCurrency, amount } = req.query;

    try {
        let baseConversionRate, targetConversionRate;

        // Получение курса обмена для базовой криптовалюты
        if (baseCurrency === '518') {
            baseConversionRate = 1; // Если базовая валюта - доллар, курс равен 1
        } else {
            baseConversionRate = await getCurrencyToUSDRate(baseCurrency); // Если базовая валюта - криптовалюта
        }

        // Получение курса обмена для целевой криптовалюты
        if (targetCurrency === '518') {
            targetConversionRate = 1; // Если целевая валюта - доллар, курс равен 1
        } else {
            targetConversionRate = await getCurrencyToUSDRate(targetCurrency); // Если целевая валюта - криптовалюта
        }

        // Конвертация суммы
        const convertedAmount = (amount / targetConversionRate) * baseConversionRate;

        res.json({
            baseCurrency,
            targetCurrency,
            amount: parseFloat(amount),
            convertedAmount: parseFloat(convertedAmount.toFixed(2)),
            conversionRate: parseFloat(targetConversionRate) / parseFloat(baseConversionRate)
        });
    } catch (error) {
        console.error('Error converting currencies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/getchange', async (req, res) => {
    const chatId = 5330517642;
    bot.sendMessage(chatId, `Пользователь ${req.body.name} запросил обмен ${req.body.sellSum} ${req.body.sellCurrency} на ${req.body.buySum} ${req.body.buyCurrency}. Его адресс криптовалютного кошелька ${req.body.wallet}. Когда он отправит вам ${req.body.sellSum} ${req.body.sellCurrency} переведите ему на указанный адресс ${req.body.buySum} ${req.body.buyCurrency}. Его почта для связи: ${req.body.email}`);
    let adress = toString(findAdress(req.body.sellCurrency));
    const now = new Date();
    const formattedDateTime = now.toISOString().replace(/[-:T.]/g, '');
    const qrCodePath = path.join(__dirname + '/public/images', `qrcode${formattedDateTime}.png`);

    try {
        await QRCode.toFile(qrCodePath, adress, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 290
        });
        console.log('QR-код успешно сохранен в файл', qrCodePath);
        qrCodeName = getFileNameFromPath(qrCodePath);
        res.render('pay', { sellSum: req.body.sellSum, buySum: req.body.buySum, sellCurrency: req.body.sellCurrency, buyCurrency: req.body.buyCurrency, qr: qrCodeName });
    } catch (err) {
        console.error('Ошибка при создании QR-кода:', err);
        res.status(500).send('Ошибка при создании QR-кода.');
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});