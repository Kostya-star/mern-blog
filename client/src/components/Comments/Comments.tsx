import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { FC, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  createComment,
  deleteComment,
  updateComment,
} from 'redux/slices/comments';
import { createTimeSince } from 'utils/createTimeSince';
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sidebarCommentsRef = useRef<HTMLDivElement>(null);

  const onSubmitComment = async () => {
    if (commentText.id && commentText.text) {
      const updatedComment = { id: commentText.id, text: commentText.text };
      dispatch(updateComment(updatedComment));
      setCommentText({ id: '', text: '' });
      return;
    }
    const newComment = { postId, text: commentText.text };
    dispatch(createComment(newComment)).then(() => {
      const parentNode = sidebarCommentsRef.current?.parentNode as HTMLElement;
      if (parentNode) {
        parentNode.scrollTop = parentNode.scrollHeight;
      }
    });
    setCommentText({ id: '', text: '' });
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
          <div
            key={comment._id}
            className={s.comment__wrapper}
            ref={sidebarCommentsRef}
          >
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
          </div>
        );
      })}

      <div className={s.comments__create}>
        <Avatar avatar={currentUserPhoto as string} />
        <div className={s.comments__create__group}>
          <div className="input">
            <TextArea
              placeholder="Write comment..."
              value={commentText.text}
              ref={textareaRef}
              onInput={(e) => {
                setCommentText({ ...commentText, text: e.target.value });
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            {commentText.text && !isAuth && (
              <div className="input_error"> you are not authenticated!</div>
            )}
          </div>

          <div className={s.comments__create__buttons}>
            <Button
              className={`button ${
                commentText.text && !/^\s*$/.test(commentText.text)
                  ? `button_colored`
                  : 'button_disabled'
              }`}
              text={commentText.id ? 'Update' : 'Comment'}
              onClick={onSubmitComment}
              disabled={
                !commentText.text || /^\s*$/.test(commentText.text) || !isAuth
              }
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
    </div>
  );
};
