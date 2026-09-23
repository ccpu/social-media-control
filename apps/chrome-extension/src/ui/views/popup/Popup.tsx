import { useEffect, useState } from 'react';
import {
  exampleMessage,
  fetchTime,
  logAction,
  sendAction,
  useAction,
  useMessageEffect,
} from '../../../messages';

export function Popup() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState('');
  const [action] = useAction({ action: '' });

  const minus = () => {
    if (count > 0) setCount(count - 1);
  };

  const add = () => setCount(count + 1);

  const fetchTimeHandler = () => {
    fetchTime
      .send()
      .then((result) => {
        setTime(result.time);
        sendAction({ action: 'fetched time' }).catch(console.error);
      })
      .catch(console.error);
  };

  const logActionHandler = () => {
    logAction({ action: 'button clicked' }).catch(console.error);
  };

  useMessageEffect((data) => {
    console.warn('Action logged:', data.action);
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result: { count?: number }) => {
      setCount(result.count ?? 0);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync
      .set({ count })
      .then(() => {})
      .catch(console.error);
    exampleMessage
      .send({ count })
      .then(() => {})
      .catch(console.error);
  }, [count]);

  return (
    <main className="mx-auto p-4 text-center">
      <h3 className="my-8 text-2xl leading-5 font-extralight text-cyan-400 uppercase">
        Popup Page
      </h3>
      <div className="my-8 flex items-center justify-center">
        <button
          type="button"
          onClick={minus}
          disabled={count <= 0}
          className="mx-0 w-12 cursor-pointer rounded border border-cyan-400 bg-transparent px-4 py-2 text-base text-cyan-400 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          -
        </button>
        <span className="mx-4 text-2xl">{count}</span>
        <button
          type="button"
          onClick={add}
          className="mx-0 w-12 cursor-pointer rounded border border-cyan-400 bg-transparent px-4 py-2 text-base text-cyan-400 outline-none"
        >
          +
        </button>
      </div>
      <div className="my-4">
        <button
          type="button"
          onClick={() => fetchTimeHandler()}
          className="mx-2 cursor-pointer rounded border border-cyan-400 bg-transparent px-4 py-2 text-base text-cyan-400 outline-none"
        >
          Fetch Time
        </button>
        <button
          type="button"
          onClick={() => logActionHandler()}
          className="mx-2 cursor-pointer rounded border border-cyan-400 bg-transparent px-4 py-2 text-base text-cyan-400 outline-none"
        >
          Log Action
        </button>
      </div>
      <p className="my-2 text-sm text-gray-600">Time: {time}</p>
      <p className="my-2 text-sm text-gray-600">Action: {action.action}</p>
      <p className="my-2 text-xs text-gray-400">Chrome Extension Template</p>
    </main>
  );
}

export default Popup;
