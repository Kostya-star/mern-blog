import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, Fragment, ReactNode } from 'react';
import { IComment } from 'types/IComment';
import { createTimeSince } from 'utils/createTimeSince';
import s from './Comments.module.scss';

interface ICommentsProps {
  comments: IComment[];
  children?: ReactNode;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  onEditComment?: (comment: IComment) => void;
}

export const Comments: FC<ICommentsProps> = ({
  comments,
  children,
  currentUserId,
  onDelete,
  onEditComment,
}) => {
  return (
    <div className={s.comments}>
      <h3>Comments</h3>
      {comments.map((comment) => {
        const timestamp = new Date(comment.createdAt);
        const creationTime = createTimeSince(timestamp);

        return (
          <Fragment key={comment._id}>
            <div className={s.comment}>
              {onDelete &&
                onEditComment &&
                currentUserId === comment.user._id && (
                  <div className={s.comment__edit_delete}>
                    <EditSVG onClick={() => onEditComment(comment)} />
                    <CloseSVG onClick={() => onDelete(comment._id)} />
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
          </Fragment>
        );
      })}

      {children}
    </div>
  );
};
