import { MFI } from 'technicalindicators';
import _ from 'lodash';

export const getMFI = async (stockData) => {
    const input = {
        high: [],
        low: [],
        close: [],
        volume: [],
        period: 14
    }

    stockData.forEach(period => {
        const { highPrice, lowPrice, closePrice, volume } = period;
        input.high.push(highPrice);
        input.low.push(lowPrice);
        input.close.push(closePrice);
        input.volume.push(volume);
    });

    return MFI.calculate(input);
}