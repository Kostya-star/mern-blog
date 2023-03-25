import { FC, ReactNode } from 'react';
import s from './Modal.module.scss';
import { ReactComponent as CloseSVG } from 'assets/close.svg'
import ReactDOM from 'react-dom'

interface IModalProps {
  children: ReactNode;
  isVisible: boolean | null;
  onCloseModal: () => void
}

export const Modal: FC<IModalProps> = ({ isVisible, onCloseModal, children }) => {
  
  return ReactDOM.createPortal(
    <div className={`${s.modal} ${isVisible ? s.modal__visible : ''}`} onClick={onCloseModal}>
      <CloseSVG className={s.modal__closeSVG}/>
      <div className={`${s.modal__content} ${isVisible ? s.modal__content__active : ''}`}>{children}</div>
    </div>, document.body
  );
};
