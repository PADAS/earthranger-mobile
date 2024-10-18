import { useEffect } from 'react';
import { getEventEmitter } from './AppEventEmitter';

export const useEventHandler = <T extends {}>(eventName: string, handler: (event: T) => void) => {
  useEffect(() => {
    const subscription = (event: T) => handler(event);
    const unsubscribe = getEventEmitter().addListener(eventName, subscription);

    return () => {
      unsubscribe.removeListener(eventName);
    };
  }, [eventName, handler]);
};
