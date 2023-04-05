import { RefObject } from 'react';

export const scrollToBottom = (lastItem: RefObject<HTMLDivElement>) => {
  const parentNode = lastItem.current?.parentNode as HTMLElement;
  if (parentNode) {
    parentNode.scrollTop = parentNode.scrollHeight;
  }
}