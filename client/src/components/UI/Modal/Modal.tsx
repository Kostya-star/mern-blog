import React, { FC, ReactNode } from 'react';
import s from './Modal.module.scss';

interface IModalProps {
  children: ReactNode;
  isVisible: boolean;
  setVisible: (val: boolean) => void
}

export const Modal: FC<IModalProps> = ({ isVisible, setVisible, children }) => {
  return (
    <div className={`${s.modal} ${isVisible && s.modal__visible}`} onClick={() => setVisible(false)}>
      <div className={s.modal__content} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};
