import { MACD } from 'technicalindicators';
import _ from 'lodash';

export const getMACD = async (stockData) => {
    var input = {
        values: [],
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    }

    stockData.forEach(period => {
        const { closePrice } = period;
        input.values.push(closePrice);
    });

    return MACD.calculate(input);
}