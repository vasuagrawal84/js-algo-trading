import Alpaca from '@alpacahq/alpaca-trade-api'
import { API_KEY, API_SECRET, PAPER } from './config/alpaca'
import { BUY, SELL } from './constants';

let client = null;

export const createConnection = () => {
    client = new Alpaca({
        keyId: API_KEY,
        secretKey: API_SECRET,
        paper: PAPER
    });
    return client;
};

export const getClient = () => {
    return client;
}

export const getOpenOrders = async () => {
    return await client.getOrders({
        status: 'open',
        direction: 'desc'
    });
};

export const getOpenPositions = async () => {
    return await client.getPositions();
}

export const cancelAllOrders = async () => {
    const orders = await getOpenOrders();
    await Promise.all(orders.map(async (order) => (await client.cancelOrder(order.id))));
};

export const sellAllPositions = async () => {
    await client.closePositions();
};

export const getTimeTillMarketClose = async () => {
    const marketClock = await client.getClock();

    var openTime = new Date(marketClock.next_open.substring(0, marketClock.next_close.length - 6));
    var currTime = new Date(marketClock.timestamp.substring(0, marketClock.timestamp.length - 6));
    return  Math.floor((openTime - currTime) / 1000 / 60);

}

export const isMarketOpen = async () => {
    const timeToClose = await getTimeTillMarketClose();
    console.log(timeToClose + " minutes til next market open.")

    return client.getClock().is_open ? true : false;
};

export const awaitMarketOpening = async () => {
    const isOpen = await isMarketOpen();

    if (isOpen) {
        console.log('Market is open!');
        return;
    }

    var wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
    await wait(60000);
    await awaitMarketOpening();
};

const submitOrder = async (stockCode, amount, side) => {
    return client.createOrder({
        symbol: stockCode,
        qty: amount,
        side: side,
        type: 'market',
        time_in_force: 'day',
    });
}

export const buyStock = async (stockCode, amount) => {
    await submitOrder(stockCode, amount, BUY);
};

export const sellStock = async (stockCode, amount) => {
    await submitOrder(stockCode, amount, SELL);
};

export const dumpStock = async (stockCode) => {
    await client.closePosition(stockCode);
};

export const getAccount = async () => {
    return await client.getAccount();
};
