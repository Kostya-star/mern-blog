import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { IPost } from 'types/IPost'
import { createTimeSince } from 'utils/createTimeSince'
import s from './PostItem.module.scss';
import { Avatar } from 'components/Avatar/Avatar'

interface IPostItemProps {
  post: IPost;
  isCurrentUser?: boolean;
  isPostText?: boolean;
  deletePost?: (id: string) => void;
}

export const PostItem: FC<IPostItemProps> = ({
  post,
  isCurrentUser,
  isPostText,
  deletePost,
}) => {
  const timestamp = new Date(post.createdAt);

  const time = createTimeSince(timestamp);
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
        {post.imageUrl && 
          // {/* <img src={`http://localhost:5000${post.imageUrl}`} alt="post img" /> */}
          <img src={post.imageUrl} alt="post img" />
          // {/* <img src={`${process.env.REACT_APP_API_URL}${post.imageUrl}`} alt="post img" /> */}
        }
      </div>
      <div
        className={`${s.post__content} ${
          !post.imageUrl && s.post__content_trimtop
        }`}
      >
        <div className={s.post__content__header}>
          <Avatar avatar={post.user?.avatarUrl as string}/>
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
              <Link to={`/tags/${tag}`} key={ind}>
                <span>#{tag}</span>
              </Link>
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
            <Link to={`/posts/${post._id}`}>
            <div className={s.comments}>
              <CommentSVG />
              {post.commentCount}
            </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
