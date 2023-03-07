import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { FC, Fragment, ReactNode, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import { createComment, deleteComment, updateComment } from 'redux/slices/comments';
import { IComment } from 'types/IComment';
import { createTimeSince } from 'utils/createTimeSince';
import s from './Comments.module.scss';
import { useAppDispatch } from './../../redux/hooks';

interface ICommentsProps {
  comments: IComment[];
}

export const Comments: FC<ICommentsProps> = ({
  comments,
}) => {
  const [commentText, setCommentText] = useState({ id: '', text: '' });

  const isAuth = useAppSelector(isAuthSelector);

  const { currentUserPhoto, currentUserId } = useAppSelector(
    ({ auth }) => ({
      currentUserPhoto: auth.data?.avatarUrl,
      currentUserId: auth.data?._id
    }),
  );
  const dispatch = useAppDispatch()

  const onSubmitComment = async () => {
    if (commentText.id && commentText.text) {
      const updatedComment = { id: commentText.id, text: commentText.text };
      dispatch(updateComment(updatedComment));
      setCommentText({ id: '', text: '' });
      return;
    }
// @ts-expect-error
    const newComment = { postId: id as string, text: commentText.text };
    dispatch(createComment(newComment));
    setCommentText({ id: '', text: '' });
  };

  const onDeleteComment = async (commId: string) => {
    dispatch(deleteComment(commId));
  };


  return (
    <div className={s.comments}>
      <h3>Comments</h3>
      {comments.map((comment) => {
        const timestamp = new Date(comment.createdAt);
        const creationTime = createTimeSince(timestamp);

        return (
          <Fragment key={comment._id}>
            <div className={s.comment}>
              {currentUserId === comment.user._id && (
                  <div className={s.comment__edit_delete}>
                    <EditSVG onClick={() =>  setCommentText({ id: comment._id, text: comment.text })} />
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
          </Fragment>
        );
      })}

      <div className="comments__create">
        <Avatar avatar={currentUserPhoto as string} />
        <div className="comments__create__group">
          <div className="input">
            <Input
              type="text"
              placeholder="Write comment..."
              value={commentText.text}
              onChange={(e) =>
                setCommentText({ ...commentText, text: e.target.value })
              }
            />
            {commentText.text && !isAuth && (
              <div className="input_error"> you are not authenticated!</div>
            )}
          </div>

          <Button
            className="button button_colored"
            text={commentText.text && commentText.id ? 'Update' : 'Comment'}
            onClick={onSubmitComment}
            disabled={!commentText.text || !isAuth}
          />
        </div>
      </div>
    </div>
  );
};
