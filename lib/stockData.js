import { getClient } from './connection';

const getStockDataByLimit = async (stockCode, timeTick = 'minute', limit = 1) => {
    return await getClient().getBars(timeTick, stockCode, { limit });
};

const getStockDataFromDate = async (stockCode, timeTick, fromDate) => {
    return await getClient().getBars(timeTick, stockCode, { start: fromDate });
};

export default {
    getStockDataByLimit,
    getStockDataFromDate
}