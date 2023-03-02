import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { FC, Fragment, ReactNode } from 'react';
import { createTimeSince } from 'utils/createTimeSince';
import { IComment } from '../../types/IComment';
import s from './Comments.module.scss';

interface ICommentsProps {
  comments: IComment[];
  children?: ReactNode;
  isCreatePost?: boolean;
  postId?: string;
  currentUserId?: string
  onDelete?: (id: string) => void;
}

export const Comments: FC<ICommentsProps> = ({
  comments,
  children,
  isCreatePost,
  currentUserId,
  postId,
  onDelete,
}) => {
  return (
    <div className={s.comments}>
      <h3>Comments</h3>
      {comments.map((comment) => {
        const timestamp = new Date(comment.createdAt);
        const creationTime = createTimeSince(timestamp);
        console.log();
        
        return (
          <Fragment key={comment._id}>
            <div className={s.comment}>
              {onDelete && (currentUserId === comment.user._id) && (
                <div
                  onClick={() => onDelete(comment._id)}
                  className={s.comment_deleteSvg}
                >
                  <CloseSVG />
                </div>
              )}

              <img
                src="https://mui.com/static/images/avatar/1.jpg"
                alt="userIMG"
              />
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
