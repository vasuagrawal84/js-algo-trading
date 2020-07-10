import { BollingerBands } from 'technicalindicators';
import _ from 'lodash';
import { stdev } from 'stats-lite';

export const getBollingerBands = async (stockData) => {
    const typicalPrices = _.map(stockData, ({ highPrice, lowPrice, closePrice }) => (Math.round(((highPrice + lowPrice + closePrice) / 3) * 100)) / 100);
    const standardDeviation = stdev(typicalPrices);

    return BollingerBands.calculate({ period: 20, stdDev: standardDeviation, values: typicalPrices })
}