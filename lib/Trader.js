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
import { getBollingerBands } from './indicators';

export class Trader {
    constructor(client, stockCodes) {
        this.client = client;
        this.stockCodes = stockCodes;
    }

    nextTick = async() => {
        const currentPortfolio = await getOpenPositions();
        console.warn('Current open positions: ', currentPortfolio);
        this.stockCodes.forEach(async (stockCode) => {
            
            const { upperBollingerBand, lowerBollingerBand, currentPrice } = await getBollingerBands(stockCode);

            // buy, sell or do nothing for each stock code
        });
    };
}