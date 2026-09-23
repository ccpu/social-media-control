import { exampleMessage, fetchTime } from '../messages';

console.warn('background is running');

exampleMessage.onMessage((data) => {
  console.warn('background has received a message from popup, and count is ', data.count);
});

fetchTime.onMessage(() => ({ time: new Date().toISOString() }));
