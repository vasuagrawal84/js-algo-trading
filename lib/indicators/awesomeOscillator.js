import { AwesomeOscillator } from 'technicalindicators';
import _ from 'lodash';

export const getAwesomeOscillator = async (stockData) => {
    const input = {
        high: [],
        low: [],
        fastPeriod: 5,
        slowPeriod: 34,
        format: (output) => parseFloat(output.toFixed(2))
    }

    stockData.forEach(period => {
        const { highPrice, lowPrice } = period;
        input.high.push(highPrice);
        input.low.push(lowPrice);
    });

    return AwesomeOscillator.calculate(input);
}