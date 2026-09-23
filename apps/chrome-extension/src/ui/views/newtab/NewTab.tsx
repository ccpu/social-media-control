import { useEffect, useState } from 'react';
import { useMessageEffect } from '../../../messages';

const TIME_PAD_LENGTH = 2;
const TIME_UPDATE_INTERVAL = 1000;

export function NewTab() {
  const getTime = () => {
    const date = new Date();
    const hour = String(date.getHours()).padStart(TIME_PAD_LENGTH, '0');
    const minute = String(date.getMinutes()).padStart(TIME_PAD_LENGTH, '0');
    return `${hour}:${minute}`;
  };

  const [time, setTime] = useState(() => getTime());
  const [actions, setActions] = useState<{ id: number; action: string }[]>([]);
  const [actionId, setActionId] = useState(0);

  useMessageEffect((data) => {
    setActions((prev) => [...prev, { id: actionId, action: data.action }]);
    setActionId((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTime());
    }, TIME_UPDATE_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="relative flex h-screen w-screen flex-col items-center justify-between">
      {/* Background blur effect */}
      <div
        className="fixed inset-0 -z-10 h-full w-full bg-cover blur-sm filter"
        style={{
          backgroundImage: "url('https://source.unsplash.com/random')",
        }}
      />

      <div className="flex flex-col items-center">
        <h1 className="my-8 text-8xl text-cyan-400 uppercase">{time}</h1>
        <div className="my-4 max-h-40 overflow-y-auto">
          <h2 className="mb-2 text-xl text-white">Logged Actions:</h2>
          <ul className="text-white">
            {actions.map(({ id, action }) => (
              <li key={id}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="my-2 text-xs text-gray-400">Chrome Extension Template</p>
    </section>
  );
}

export default NewTab;
