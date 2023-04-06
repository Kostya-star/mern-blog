import { ChangeEvent } from 'react';

export const extendTextAreaWhenTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
}