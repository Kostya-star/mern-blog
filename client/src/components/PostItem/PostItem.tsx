import post_img from 'assets/post-img.webp';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import s from './PostItem.module.scss';
import { FC } from 'react';

interface IPostItemProps {
  isPostText?: boolean;
  isPopUpButtons?: boolean;
}

export const PostItem: FC<IPostItemProps> = ({
  isPostText,
  isPopUpButtons,
}) => {
  return (
    <div className={s.post}>
      {isPopUpButtons && (
        <div className={s.post__popupButtons}>
          <EditSVG />
          <CloseSVG />
        </div>
      )}
      <div className={s.post__header}>
        <h1>Roast the code #1</h1>
        <h2>TS Rock paper Scissors</h2>
      </div>
      <div className={s.post__content}>
        <div className={s.post__content__header}>
          <img src={post_img} />
          <div>
            <span>Keff</span>
            <span>12/46/1475</span>
          </div>
        </div>
        <div className={s.post__content__body}>
          <h2>Roast the code #1 | Rock paper Scissors</h2>
          <div className={s.post__content__body__tags}>
            <span>#react</span>
            <span>#fun</span>
            <span>#typescript</span>
          </div>
          {isPostText && (
            <div className={s.post__content__body__text}>
              Hey there! 👋 I'm starting a new series called "Roast the Code",
              where I will share some code, and let YOU roast and improve it.
              There's not much more to it, just be polite and constructive, this
              is an exercise so we can all learn together. Now then, head over
              to the repo and roast as hard as you can!!
            </div>
          )}
          <div className={s.post__content__body__statistics}>
            <div>
              <EyeSVG />
              150
            </div>
            <div>
              <CommentSVG />3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
