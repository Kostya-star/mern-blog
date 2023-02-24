import React, { FC } from 'react';

import s from './TextArea.module.scss'

interface ITextAreaProps {
  placeholder: string
}

export const TextArea:FC<ITextAreaProps> = ({ ...props }) => {
  return (
    <>
      <textarea { ...props } name="" id=""  className={s.textarea}></textarea>
    </>
  );
};
