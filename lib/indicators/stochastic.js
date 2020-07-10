import { Stochastic } from 'technicalindicators';
import _ from 'lodash';

export const getStochastic = async (stockData) => {
    const input = {
        high: [],
        low: [],
        close: [],
        period: 14,
        signalPeriod: 3
    }

    stockData.forEach(period => {
        const { highPrice, lowPrice, closePrice } = period;
        input.high.push(highPrice);
        input.low.push(lowPrice);
        input.close.push(closePrice);
    });

    return Stochastic.calculate(input);
}