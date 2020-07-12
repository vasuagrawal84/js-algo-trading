import {
    createConnection,
    getOpenOrders,
    getOpenPositions,
    cancelAllOrders,
    getTimeTillMarketClose,
    checkIfMarketIsOpen,
    sellAllPositions,
    awaitMarketOpening,
    buyStock,
    sellStock,
    dumpStock,
    getAccount
} from './connection';
import { getBollingerBands, getMFI, getStochastic, getAwesomeOscillator, getCCI, getKST, getMACD } from './indicators';
import {
    getStockDataByLimit,
    getStockDataFromDate
} from './stockData';

export class Trader {
    constructor(client, stockCodes) {
        this.client = client;
        this.stockCodes = stockCodes;

        this.scores = {};

        this.resetScores();
    }

    resetScores = () => {
        this.stockCodes.forEach(stockCode => {
            this.scores[stockCode] = {
                score: 0,
                code: stockCode
            }
        });
    }

    increaseScore = (stockCode, increase = 1) => {
        this.scores[stockCode].score = this.scores[stockCode].score + increase;
    }

    decreaseScore = (stockCode, decrease = 1) => {
        this.scores[stockCode].score = this.scores[stockCode].score - decrease;
    }

    getDataForStockCode = async (stockCode) => {
        const previous40Minutes = await getStockDataByLimit(stockCode, '1Min', 40);
        const previous40Days = await getStockDataByLimit(stockCode, '1D', 40);
        const previous40QauterHours = await getStockDataByLimit(stockCode, '15Min', 40); // 5 hours

        return {
            previous40Minutes: Object.values(previous40Minutes)[0],
            previous40Days: Object.values(previous40Minutes)[0],
            previous40QauterHours: Object.values(previous40Minutes)[0]
        };
    }

    formatForTechnicalIndicatorsLib = (stockData, length) => {
        const formattedData = {
            high: [],
            low: [],
            close: [],
            volume: [],
            open: []
        };
        Object.values(stockData)[0].forEach(period => {
            const { highPrice, lowPrice, closePrice, volume, openPrice } = period;
            input.high.push(highPrice);
            input.low.push(lowPrice);
            input.close.push(closePrice);
            input.volume.push(volume);
            input.open.push(openPrice);
        });

        return formattedData;
    }

    nextTick = async () => {
        this.resetScores();

        const currentPortfolio = await getOpenPositions();
        console.warn('Current open positions: ', currentPortfolio);
        this.stockCodes.forEach(async (stockCode) => {
            console.warn('Checking stock: ', stockCode);
            const { previous40Minutes, previous40Days, previous40QauterHours } = await this.getDataForStockCode(stockCode);



            const bollingerBands = await getBollingerBands(previous40Minutes.slice(previous40Minutes.length - 20, previous40Days.length));
            if (bollingerBands[0].pb < 0) {
                this.increaseScore(stockCode);
            } else if (bollingerBands[0] > 1) {
                this.decreaseScore(stockCode);
            }

            const mfiMinutes = await getMFI(previous40Minutes.slice(previous40Minutes.length - 20, previous40Days.length));
            const latestMfi = mfiMinutes[mfiMinutes.length - 1];
            const secondLastMfi = mfiMinutes[mfiMinutes.length - 2];
            if (secondLastMfi < 10 && latestMfi > 10) {
                this.increaseScore(stockCode);
            } else if (secondLastMfi > 90 && latestMfi < 90) {
                this.decreaseScore(stockCode);
            }

            const stochastic = await getStochastic(previous40Minutes.slice(previous40Minutes.length - 14, previous40Days.length));
            if (stochastic > 80) {
                this.decreaseScore(stockCode);
            } else if (stochastic < 20) {
                this.increaseScore(stockCode);
            }

            const awesomeOscillator = await getAwesomeOscillator(previous40Minutes.slice(previous40Minutes.length - 35, previous40Days.length));
            // TODO: look into double peaks and saucer strategies
            const latestAO = awesomeOscillator[awesomeOscillator.length - 1];
            const secondLastAO = awesomeOscillator[awesomeOscillator.length - 2];
            if (secondLastAO < 0 && latestAO > 0) {
                this.increaseScore(stockCode);
            } else if (secondLastAO > 0 && latestAO < 0) {
                this.decreaseScore(stockCode);
            }

            const commodityChannelIndex = await getCCI(previous40Minutes.slice(previous40Minutes.length - 20, previous40Days.length));
            if (commodityChannelIndex > 100) {
                this.increaseScore(stockCode);
            } else if (commodityChannelIndex < -100) {
                this.increaseScore(stockCode);
            }

            // const knowSureThing = await getKST(previous40Minutes);
            // console.warn(knowSureThing);

            const macd = await getMACD(previous40Minutes.slice(previous40Minutes.length - 35, previous40Days.length));
            const latestMACD = macd[macd.length - 1];
            const secondLastMACD = macd[macd.length - 2];
            if (secondLastMACD.histogram <= 0 && latestMACD.histogram > 0) {
                this.increaseScore(stockCode);
            } else if (secondLastMACD.histogram >= 0 && latestMACD.histogram < 0) {
                this.decreaseScore(stockCode);
            }

            console.warn('!!scores', this.scores);

            // buy, sell or do nothing for each stock code
        });
        return Promise.resolve('success');
    };
}