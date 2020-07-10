import { getClient } from './connection';

export const getStockDataByLimit = async (stockCode, timeTick = '1Min', limit = 1) => {
    return await getClient().getBars(timeTick, [stockCode], { limit });
};

export const getStockDataFromDate = async (stockCode, timeTick, fromDate) => {
    return await getClient().getBars(timeTick, stockCode, { start: fromDate });
};