import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as EyeSVG } from 'assets/eye.svg';
import { ReactComponent as ThumbsUpSVG } from 'assets/thumb-up.svg';
import { ReactComponent as ThumbsUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { ReactComponent as CircleDownSVG } from 'assets/circle-down.svg';
import { ReactComponent as CircleUpSVG } from 'assets/circle-up.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { IPost } from 'types/IPost';
import { createTimeSince } from 'utils/createTimeSince';
import s from './PostItem.module.scss';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosts, likePost } from 'redux/slices/posts';

interface IPostItemProps {
  post: IPost;
  isPostText?: boolean;
  deletePost?: (id: string) => void;
  fetchCommsByPostId?: (postId: string) => void
}

export const PostItem: FC<IPostItemProps> = ({
  post,
  isPostText,
  deletePost,
  fetchCommsByPostId
}) => {
  const dispatch = useAppDispatch();

  const { isShowEditDelete, isPostLiked } = useAppSelector(
    ({ auth }) => ({
      isShowEditDelete: auth.data?._id === post.user?._id,
      isPostLiked: post.likes?.usersLiked.includes(auth.data?._id as string)
    }),
  );

  const [likes, setLikes] = useState({
    isLiked: isPostLiked,
    likeCount: post.likes?.likesCount,
  });

  const [isShowText, setShowText] = useState(false)

  const timestamp = new Date(post.createdAt);
  const time = createTimeSince(timestamp);

  const onClickLike = async (postId: string) => {
    const { data } = await dispatch(likePost(postId)).unwrap();
    setLikes({ isLiked: data.isLiked, likeCount: data.likeCount });
  };

  return (
    <div className={s.post}>
      {isShowEditDelete && deletePost ? (
        <div className={s.post__popupButtons}>
          <Link to={`/posts/${post._id}/edit`}>
            <EditSVG />
          </Link>

          <CloseSVG onClick={() => deletePost(post._id)} />
        </div>
      ) : null}
      <div className={s.post__header}>
        {post.imageUrl && <img src={post.imageUrl} alt="post img" />}
      </div>
      <div
        className={`${s.post__content} ${
          !post.imageUrl && s.post__content_trimtop
        }`}
      >
        <div className={s.post__content__header}>
          <Avatar avatar={post.user?.avatarUrl as string} />
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
          <div className={s.post__content__body__dropdown}>
            <p onClick={() => setShowText(!isShowText)}>
              {isShowText ? (
                <>
                  <span>Close text</span>
                  <CircleUpSVG />
                </>
              ) : (
                <>
                  <span>Show text</span>
                  <CircleDownSVG />
                </>
              )}
            </p>
          </div>
          {isShowText && (
            <div className={s.post__content__body__text}>
              <ReactMarkdown children={post.text} />
            </div>
          )}
          <div className={s.post__content__body__statistics}>
            <div className={s.post__content__body__statistics__group}>
              <div onClick={() => onClickLike(post._id)}>
                {likes.isLiked ? <ThumbsUpColoredSVG /> : <ThumbsUpSVG />}
                {likes.likeCount}
              </div>
              <div
                onClick={() =>
                  fetchCommsByPostId && fetchCommsByPostId(post._id)
                }
              >
                <CommentSVG />
                {post.commentCount}
              </div>
            </div>
            <div>
              <EyeSVG />
              {post.viewCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
