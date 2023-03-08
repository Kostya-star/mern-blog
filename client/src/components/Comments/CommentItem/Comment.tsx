import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC } from 'react';
import { IComment } from 'types/IComment';
import { createTimeSince } from 'utils/createTimeSince';
import s from './CommentItem.module.scss';

interface ICommentItemProps {
  comment: IComment;
  currentUserId?: string;
  setCommentText: ({ id, text }: { id: string; text: string }) => void;
  onDeleteComment: (commId: string) => void;
  commRef: any;
}

export const CommentItem: FC<ICommentItemProps> = ({
  comment,
  currentUserId,
  commRef,
  setCommentText,
  onDeleteComment,
}) => {
  const timestamp = new Date(comment.createdAt);
  const creationTime = createTimeSince(timestamp);

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
