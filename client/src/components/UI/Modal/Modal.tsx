import { FC, ReactNode } from 'react';
import s from './Modal.module.scss';
import { ReactComponent as CloseSVG } from 'assets/close.svg'

interface IModalProps {
  children: ReactNode;
  isVisible: boolean;
  onCloseModal: () => void
}

export const Modal: FC<IModalProps> = ({ isVisible, onCloseModal, children }) => {
  
  return (
    <div className={`${s.modal} ${isVisible ? s.modal__visible : ''}`} onClick={onCloseModal}>
      <CloseSVG className={s.modal__closeSVG}/>
      <div className={s.modal__content} >{children}</div>
    </div>
  );
};
