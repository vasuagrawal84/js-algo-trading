import { KST } from 'technicalindicators';
import _ from 'lodash';

export const getKST = async (stockData) => {
    var input = {
        values: [],
        ROCPer1: 10,
        ROCPer2: 15,
        ROCPer3: 20,
        ROCPer4: 30,
        SMAROCPer1: 10,
        SMAROCPer2: 10,
        SMAROCPer3: 10,
        SMAROCPer4: 15,
        signalPeriod: 3
    };

    stockData.forEach(period => {
        const { closePrice } = period;
        input.values.push(closePrice);
    });

    return KST.calculate(input);
}