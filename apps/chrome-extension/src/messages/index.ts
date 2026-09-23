import { createMessage } from '@pixpilot/chrome-messenger';
import {
  createMessageEffect,
  createMessageState,
} from '@pixpilot/chrome-messenger/react';

const exampleMessage = createMessage<{ count: number }, void>('COUNT');

const fetchTime = createMessage<void, { time: string }>('FETCH_TIME');

const { send: sendAction, useMessage: useAction } = createMessageState<{
  action: string;
}>('ACTION');

const { send: logAction, useMessageEffect } = createMessageEffect<
  { action: string },
  void
>('LOG_ACTION');

export { exampleMessage, fetchTime, logAction, sendAction, useAction, useMessageEffect };
