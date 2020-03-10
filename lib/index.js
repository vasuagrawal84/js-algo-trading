import { tradingStrategies } from './tradingStrategies';
import { API_KEY, API_SECRET, PAPER } from './config/alpaca'

const startApp = (() => {
  console.log('Welcome to algo-trading.');

  // Run the LongShort class
  // var ls = new LongShort(API_KEY, API_SECRET, PAPER);
  // ls.run();

  console.log('Running trading strategy 1');

  tradingStrategies['TEST1']().run();
})();

export default startApp;
