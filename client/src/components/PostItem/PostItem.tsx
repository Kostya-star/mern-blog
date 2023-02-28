import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import post_img from 'assets/post-img.webp';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { IPost } from 'types/IPost';
import s from './PostItem.module.scss';

interface IPostItemProps {
  post: IPost;
  isCurrentUser?: boolean;
  isPostText?: boolean;
  deletePost?: (id: string) => void;
}

const setTimeSince = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + 'year ago';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + 'month ago';
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + 'd ago';
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + 'hr ago';
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + 'min ago';
  }
  return Math.floor(seconds) + 'sec ago';
};

export const PostItem: FC<IPostItemProps> = ({
  post,
  isCurrentUser,
  isPostText,
  deletePost,
}) => {
  const timestamp = new Date(post.createdAt);

  const time = setTimeSince(timestamp);
  return (
    <div className={s.post}>
      {isCurrentUser && deletePost ? (
        <div className={s.post__popupButtons}>
          <Link to={`/posts/${post._id}/edit`}>
            <EditSVG />
          </Link>

          <CloseSVG onClick={() => deletePost(post._id)} />
        </div>
      ) : null}
      <div className={s.post__header}>
        {post.imageUrl && (
          // <img src={`${process.env.REACT_APP_API_URL}${post.imageUrl}`} alt="post img" />
          <img src={`http://localhost:5000${post.imageUrl}`} alt="post img" />
        )}
      </div>
      <div
        className={`${s.post__content} ${
          !post.imageUrl && s.post__content_trimtop
        }`}
      >
        <div className={s.post__content__header}>
          <img src={post_img} alt="avatar" />
          <div>
            <span className={s.fullName}>{post.user?.fullName}</span>
            <span className={s.time}>{time}</span>
          </div>
        </div>
        <div className={s.post__content__body}>
          <Link to={`/posts/${post._id}`}>
            <div className={s.post__content__body__heading}>
              <h2>{post.title}</h2>
            </div>
          </Link>

          <div className={s.post__content__body__tags}>
            {post.tags?.map((tag, ind) => (
              <span key={ind}>#{tag}</span>
            ))}
          </div>
          {isPostText && (
            <div className={s.post__content__body__text}>
              <ReactMarkdown children={post.text} />
            </div>
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
