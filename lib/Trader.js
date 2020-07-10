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
import { getBollingerBands, getMFI, getStochastic } from './indicators';
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

    nextTick = async () => {
        this.resetScores();

        const currentPortfolio = await getOpenPositions();
        console.warn('Current open positions: ', currentPortfolio);
        this.stockCodes.forEach(async (stockCode) => {
            console.warn('Checking stock: ', stockCode);
            const previous20Minutes = await getStockDataByLimit(stockCode, '1Min', 20);
            const previous20Days = await getStockDataByLimit(stockCode, '1D', 20);

            const previous20QauterHours = await getStockDataByLimit(stockCode, '15Min', 20); // 5 hours
            const bollingerBands = await getBollingerBands(Object.values(previous20Minutes)[0]);

            if (bollingerBands[0].pb < 0) {
                this.increaseScore(stockCode);
            } else if (bollingerBands[0] > 1) {
                this.decreaseScore(stockCode);
            }

            const mfiMinutes = await getMFI(Object.values(previous20Minutes)[0]);
            // console.warn('!!MFI', mfiMinutes);

            const latestMfi = mfiMinutes[mfiMinutes.length - 1];
            const secondLastMfi = mfiMinutes[mfiMinutes.length - 1];
            if (secondLastMfi < 10 && latestMfi > 10) {
                this.increaseScore(stockCode);
            } else if (secondLastMfi > 90 && latestMfi < 90) {
                this.decreaseScore(stockCode);
            }

            const stochastic = await getStochastic(Object.values(previous20Minutes)[0].slice(0, 14));
            // console.warn('!!!stochastic', stochastic[0].k);

            if (stochastic > 80) {
                this.decreaseScore(stockCode);
            } else if (stochastic < 20) {
                this.increaseScore(stockCode);
            }
            console.warn('!!scores', this.scores);

            // buy, sell or do nothing for each stock code
        });
        return Promise.resolve('success');
    };
}