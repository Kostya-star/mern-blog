import React, { FC, ChangeEvent } from 'react';

import s from './TextArea.module.scss'

interface ITextAreaProps {
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea:FC<ITextAreaProps> = ({ ...props }) => {
  return (
    <>
      <textarea { ...props } name="" id=""  className={s.textarea}></textarea>
    </>
  );
};
