import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as ThumbUpSVG } from 'assets/thumb-up.svg';
import { ReactComponent as ThumbUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, LegacyRef, memo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { deleteComment, likeComment } from 'redux/slices/comments';
import { IComment } from 'types/IComment';
import s from './CommentItem.module.scss';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'components/UI/Loader/Loader';

interface ICommentItemProps {
  comment: IComment;
  commRef: LegacyRef<HTMLDivElement>;
  creationTime: string;
  isCommDeleting: boolean
  setCommentText: ({ id, text }: { id: string; text: string }) => void;
  setCommentImage: (imgUrl: string) => void;
  onShowFullImage: (imgUrl: string) => void;
  onDeleteComment: (commId: string) => void
  onLikeComment: (commId: string) => void
}

export const CommentItem: FC<ICommentItemProps> = ({
  comment,
  commRef,
  creationTime,
  isCommDeleting,
  setCommentText,
  setCommentImage,
  onShowFullImage,
  onDeleteComment,
  onLikeComment
}) => {
  const navigate = useNavigate();


  const { isLiked, likeCount, isShowEditDelete } = useAppSelector(
    ({ auth }) => ({
      isLiked: comment.usersLiked.includes(auth.data?._id as string),
      likeCount: comment.usersLiked.length,
      isShowEditDelete: comment.user._id === auth.data?._id,
    }),
  );

  const onEditComment = () => {
    setCommentText({ id: comment._id, text: comment.text });
    setCommentImage(comment.imageUrl);
  };


  const onRedirectAboutProfile = () => {
    navigate(`/profile/about/${comment.user._id}`);
  };

  return (
    <div className={s.comment__wrapper} ref={commRef}>
      {isCommDeleting ? (
        <div className="loader_center">
          <Loader className="loader_mini" />
        </div>
      ) : (
        <>
          <div className={s.comment}>
            {isShowEditDelete && (
              <div className={s.comment__edit_delete}>
                <EditSVG onClick={onEditComment} />
                <CloseSVG onClick={() => onDeleteComment(comment._id)} />
              </div>
            )}
            <Avatar
              avatar={comment.user?.avatarUrl as string}
              onClick={onRedirectAboutProfile}
            />
            <div className={s.comment__body}>
              <span onClick={onRedirectAboutProfile}>
                {comment?.user.fullName}
              </span>
              <div className={s.comment__body__text}>
                {comment.text && <p>{comment.text}</p>}
                {comment.imageUrl && (
                  <img
                    src={comment.imageUrl}
                    onClick={() => onShowFullImage(comment.imageUrl)}
                    alt="comment img"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={s.comment__footer}>
            <p onClick={() => onLikeComment(comment._id)}>
              {isLiked ? <ThumbUpColoredSVG /> : <ThumbUpSVG />}
              {likeCount}
            </p>
            <span className={s.comment__time}>{creationTime}</span>
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export const MemoizedCommentItem = memo(CommentItem, (prevProps, nextProps) => {
  return (
    prevProps.comment === nextProps.comment &&
    prevProps.creationTime === nextProps.creationTime
  );
});
