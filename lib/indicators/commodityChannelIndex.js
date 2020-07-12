import { CCI } from 'technicalindicators';
import _ from 'lodash';

export const getCCI = async (stockData) => {
    const input = {
        open: [],
        high: [],
        low: [],
        close: [],
        period: 20
    }

    stockData.forEach(period => {
        const { openPrice, highPrice, lowPrice, closePrice } = period;
        input.open.push(openPrice);
        input.high.push(highPrice);
        input.low.push(lowPrice);
        input.close.push(closePrice);
    });

    return CCI.calculate(input);
}