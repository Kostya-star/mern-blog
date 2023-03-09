import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { FC, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  clearCommentsSlice,
  createComment,
  updateComment,
} from 'redux/slices/comments';
import { createTimeSince } from 'utils/createTimeSince';
import { MemoizedCommentItem } from './CommentItem/CommentItem';
import s from './Comments.module.scss';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/arrow-down.svg';
import { ReactComponent as ArrowUpSVG } from 'assets/arrow-up.svg';

interface ICommentsProps {}

export const Comments: FC<ICommentsProps> = () => {
  const isAuth = useAppSelector(isAuthSelector);

  const { currentUserPhoto, comments, postId } = useAppSelector(
    ({ auth, comments }) => ({
      currentUserPhoto: auth.data?.avatarUrl,
      comments: comments.comments,
      postId: comments.currentPost,
    }),
  );
  const dispatch = useAppDispatch();

  const [commentText, setCommentText] = useState({ id: '', text: '' });
  const [isCommHidden, setCommHidden] = useState(false);

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

  const onCloseComments = () => {
    dispatch(clearCommentsSlice());
  };

  const onHideComments = () => {
    setCommHidden(!isCommHidden);
  };

  return (
    <div className={s.comments}>
      <div className={s.comments__header}>
        <h3>Comments</h3>
        <span onClick={onHideComments}>
          {
            isCommHidden
            ?
            <ArrowDownSVG  />
            :
            <ArrowUpSVG  />
          }
          <CloseSVG onClick={onCloseComments} />
        </span>
      </div>
      {!isCommHidden && (
        <>
          {comments.length ? comments.map((comment) => {
            const creationTime = createTimeSince(new Date(comment.createdAt));

            return (
              <MemoizedCommentItem
                key={comment._id}
                comment={comment}
                commRef={sidebarCommentsRef}
                creationTime={creationTime}
                setCommentText={setCommentText}
              />
            );
          }
          )
          :
          <h3 className={s.comments__noComments}>No comments yet</h3>
        }
          <div className={s.comments__create}>
            <Avatar avatar={currentUserPhoto as string} />
            <div className={s.comments__create__group}>
              <div className="input">
                <TextArea
                  placeholder="Write comment..."
                  value={commentText.text}
                  ref={textareaRef}
                  onChange={(e) => {
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
                    commentText.text &&
                    !/^\s*$/.test(commentText.text) &&
                    isAuth
                      ? `button_colored`
                      : 'button_disabled'
                  }`}
                  text={commentText.id ? 'Update' : 'Comment'}
                  onClick={onSubmitComment}
                  disabled={
                    !commentText.text ||
                    /^\s*$/.test(commentText.text) ||
                    !isAuth
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
        </>
      )}
    </div>
  );
};
