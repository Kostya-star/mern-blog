import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, LegacyRef, memo } from 'react';
import { IComment } from 'types/IComment';
import s from './CommentItem.module.scss';

interface ICommentItemProps {
  comment: IComment;
  currentUserId?: string;
  commRef: LegacyRef<HTMLDivElement>;
  creationTime: string;
  setCommentText: ({ id, text }: { id: string; text: string }) => void;
  onDeleteComment: (commId: string) => void;
}

export const CommentItem: FC<ICommentItemProps> = ({
  comment,
  currentUserId,
  commRef,
  creationTime,
  setCommentText,
  onDeleteComment,
}) => {
  return (
    <div className={s.comment__wrapper} ref={commRef}>
      <div className={s.comment}>
        {currentUserId && currentUserId === comment.user._id && (
          <div className={s.comment__edit_delete}>
            <EditSVG
              onClick={() =>
                setCommentText({ id: comment._id, text: comment.text })
              }
            />
            <CloseSVG onClick={() => onDeleteComment(comment._id)} />
          </div>
        )}
        <Avatar avatar={comment.user?.avatarUrl as string} />
        <div className={s.comment__body}>
          <p>{comment?.user.fullName}</p>
          <p>{comment.text}</p>
        </div>
      </div>
      <span className={s.comment__time}>{creationTime}</span>
      <hr />
    </div>
  );
};

export const MemoizedCommentItem = memo(CommentItem, (prevProps, nextProps) => {
  return (
    prevProps.comment === nextProps.comment &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.creationTime === nextProps.creationTime
  );
});
