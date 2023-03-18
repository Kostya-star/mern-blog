import { ReactComponent as CommentColoredSVG } from 'assets/comment-colored.svg';
import emptyImage from 'assets/no-image.jpg';
import { ReactComponent as ThumbsUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { FC } from 'react';
import { IPost } from 'types/IPost';
import s from './PostThumbnail.module.scss';

interface IPostThumbnailProps {
  post: IPost;
  onShowFullPost: () => void;
}

export const PostThumbnail: FC<IPostThumbnailProps> = ({
  post,
  onShowFullPost,
}) => {
  return (
    <div className={s.postThumbnail} onClick={onShowFullPost}>
      <img src={post.imageUrl || emptyImage} alt="postimage" />
      <div className={s.postThumbnail__statistics}>
        <span>
          <ThumbsUpColoredSVG /> {post.usersLiked.length}
        </span>
        <span>
          <CommentColoredSVG /> {post.usersCommented.length}
        </span>
      </div>
    </div>
  );
};
