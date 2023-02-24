import post_img from 'assets/post-img.webp';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import s from './PostItem.module.scss';

export const PostItem = () => {
  return (
    <div className={s.post}>
      <div className={s.post__popupButtons}>
        <EditSVG/>
        <CloseSVG/>
      </div>
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
