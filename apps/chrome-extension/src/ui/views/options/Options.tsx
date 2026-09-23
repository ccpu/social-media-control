import { useEffect, useState } from 'react';
import { exampleMessage } from '../../../messages';

export function Options() {
  const [countSync, setCountSync] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result: { count?: number }) => {
      setCountSync(result.count ?? 0);
    });

    exampleMessage.onMessage((data) => {
      setCountSync(data.count);
    });
  }, []);

  return (
    <main className="mx-auto min-h-screen min-w-80 p-4 text-center">
      <h3 className="my-8 text-2xl leading-5 font-extralight text-cyan-400 uppercase">
        Options Page
      </h3>
      <h4 className="mb-4 text-lg">Count from Popup: {countSync}</h4>
      <p className="my-2 text-xs text-gray-400">Chrome Extension Template</p>
    </main>
  );
}

export default Options;
