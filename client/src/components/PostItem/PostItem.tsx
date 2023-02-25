import post_img from 'assets/post-img.webp';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import s from './PostItem.module.scss';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IPost } from 'types/IPost';

interface IPostItemProps {
  post: IPost;
  isPostText?: boolean;
  isPopUpButtons?: boolean;
  isUser?: boolean;
}

export const PostItem: FC<IPostItemProps> = ({
  post,
  isPostText,
  isPopUpButtons,
  isUser,
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
        {post.imageUrl && <img src={post.imageUrl} />}
        {/* <img src='https://www.marujaenlacocina.es/wp-content/uploads/2015/11/header-img.png' /> */}
      </div>
      <div className={`${s.post__content} ${!post.imageUrl && s.post__content_trimtop}`}>
        <div className={s.post__content__header}>
          <img src={post_img} alt="avatar" />
          <div>
            {isUser && <span>{post.user.fullName}</span>}
            <span>{post.createdAt}</span>
          </div>
        </div>
        <div className={s.post__content__body}>
          <Link to={`/posts/${post._id}`}>
            <h2>{post.title}</h2>
          </Link>

          <div className={s.post__content__body__tags}>
            {post.tags?.map((tag, ind) => (
              <span key={ind}>{tag}</span>
            ))}
          </div>
          {isPostText && (
            <div className={s.post__content__body__text}>{post.text}</div>
          )}
          <div className={s.post__content__body__statistics}>
            <div>
              <EyeSVG />
              {post.viewCount}
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
