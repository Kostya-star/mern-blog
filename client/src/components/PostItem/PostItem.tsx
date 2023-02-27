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
  deletePost?: (id: string) => void
}

export const PostItem: FC<IPostItemProps> = ({
  post,
  isCurrentUser,
  isPostText,
  deletePost,
}) => {
  return (
    <div className={s.post}>
      {(isCurrentUser && deletePost) ? (
        <div className={s.post__popupButtons}>
          <Link to={`/posts/${post._id}/edit`}>
            <EditSVG/>
          </Link>

          <CloseSVG onClick={() => deletePost(post._id)}/>
        </div>
      ) : null}
      <div className={s.post__header}>
        {post.imageUrl && (
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
            <span>{post.user?.fullName}</span>
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
