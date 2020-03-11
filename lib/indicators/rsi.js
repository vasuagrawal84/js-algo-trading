import {
    getStockDataByLimit,
    getStockDataFromDate
} from '../stockData';

export const getRSI = async (stockCode, tickLength = 'minute') => {
    const previous20Ticks = await getStockDataByLimit(stockCode, tickLength, 20);
    console.warn('Prev 20', previous20Ticks);

    return 50;
}