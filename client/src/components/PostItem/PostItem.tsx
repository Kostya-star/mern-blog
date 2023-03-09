import { ReactComponent as ArrowDownSVG } from 'assets/arrow-down.svg';
import { ReactComponent as ArrowUpSVG } from 'assets/arrow-up.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as ThumbsUpSVG } from 'assets/thumb-up.svg';
import { ReactComponent as ThumbsUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchCommentsByPostId } from 'redux/slices/comments';
import { deletePost, likePost } from 'redux/slices/posts';
import { IPost } from 'types/IPost';
import { createTimeSince } from 'utils/createTimeSince';
import s from './PostItem.module.scss';

interface IPostItemProps {
  post: IPost;
}

export const PostItem: FC<IPostItemProps> = ({ post }) => {
  const dispatch = useAppDispatch();

  const { isShowEditDelete, isLiked, likeCount } = useAppSelector(
    ({ auth }) => ({
      isShowEditDelete: auth.data?._id === post.user?._id,
      isLiked: post.usersLiked.includes(auth.data?._id as string),
      likeCount: post.usersLiked.length,
    }),
  );

  const [isShowText, setShowText] = useState(false);

  const onClickLike = (postId: string) => {
    dispatch(likePost(postId));
  };

  const fetchCommsByPostId = (postId: string) => {
    dispatch(fetchCommentsByPostId(postId));
  };

  const removePost = (id: string) => {
    dispatch(deletePost(id));
  };

  const timeCreation = createTimeSince(new Date(post.createdAt));

  return (
    <div className={s.post}>
      {isShowEditDelete ? (
        <div className={s.post__popupButtons}>
          <Link to={`/posts/${post._id}/edit`}>
            <EditSVG />
          </Link>

          <CloseSVG onClick={() => removePost(post._id)} />
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
            <span className={s.time}>{timeCreation}</span>
          </div>
        </div>
        <div className={s.post__content__body}>
          {/* <Link to={`/posts/${post._id}`}> */}
          <div className={s.post__content__body__heading}>
            <h2>{post.title}</h2>
          </div>
          {/* </Link> */}

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
                  <ArrowUpSVG />
                </>
              ) : (
                <>
                  <span>Show text</span>
                  <ArrowDownSVG />
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
                {isLiked ? <ThumbsUpColoredSVG /> : <ThumbsUpSVG />}
                {likeCount}
              </div>
              <div onClick={() => fetchCommsByPostId(post._id)}>
                <CommentSVG />
                {post.commentCount}
              </div>
            </div>
            <div>
              {/* <EyeSVG /> */}
              {/* {post.viewCount} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
