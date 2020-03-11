import {
    getStockDataByLimit,
    getStockDataFromDate
} from '../stockData';

export const getBollingerBands = async (stockCode, tickLength = 'minute') => {
    let upperBollingerBand;
    let lowerBollingerBand;

    const previous20Ticks = await getStockDataByLimit(stockCode, tickLength, 20);
    console.warn('Prev 20', previous20Ticks);

    return {
        upperBollingerBand,
        lowerBollingerBand,
        currentPrice: previous20Ticks[previous20Ticks.length - 1]
    };
}