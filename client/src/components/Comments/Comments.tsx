import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { FC, Fragment, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  createComment,
  deleteComment,
  updateComment,
} from 'redux/slices/comments';
import { createTimeSince } from 'utils/createTimeSince';
import { useAppDispatch } from './../../redux/hooks';
import s from './Comments.module.scss';

interface ICommentsProps {}

export const Comments: FC<ICommentsProps> = () => {
  const isAuth = useAppSelector(isAuthSelector);

  const { currentUserPhoto, currentUserId, comments, postId } = useAppSelector(
    ({ auth, comments }) => ({
      currentUserPhoto: auth.data?.avatarUrl,
      currentUserId: auth.data?._id,
      comments: comments.comments,
      postId: comments.currentPost,
    }),
  );
  const dispatch = useAppDispatch();

  const [commentText, setCommentText] = useState({ id: '', text: '' });

  const onSubmitComment = async () => {
    if (commentText.id && commentText.text) {
      const updatedComment = { id: commentText.id, text: commentText.text };
      dispatch(updateComment(updatedComment));
      setCommentText({ id: '', text: '' });
      return;
    }
    const newComment = { postId, text: commentText.text };
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
            className={`button ${
              commentText.text ? `button_colored` : 'button_disabled'
            }`}
            title={!commentText.text ? 'Insert comment please!' : ''}
            text={commentText.id ? 'Update' : 'Comment'}
            onClick={onSubmitComment}
            disabled={!commentText.text || !isAuth}
          />
          {commentText.id && (
            <Button
              text="Cancel update"
              className="button button_cancel"
              onClick={() => setCommentText({ id: '', text: '' })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
