import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { FC, useRef, useState, ChangeEvent } from 'react';
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
import { ReactComponent as AttachSVG } from 'assets/attach.svg';
import { Loader } from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';

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
  const [commentImage, setCommentImage] = useState<File | Blob | null>(null);
  const [fullCommentImage, setFullCommentImage] = useState('');
  const [isCommLoading, setCommLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sidebarCommentsRef = useRef<HTMLDivElement>(null);
  const commentFileRef = useRef<HTMLInputElement>(null);

  const onSubmitComment = async () => {
    setCommLoading(true);

    const formData = new FormData();
    formData.append('text', commentText.text.trim() || '');
    formData.append('postId', postId);
    formData.append('image', commentImage || '');

    if (commentText.id) {
      formData.append('id', commentText.id);

      dispatch(updateComment(formData)).then(() => setCommLoading(false));
      setCommentText({ id: '', text: '' });
      setCommentImage(null);
      return;
    }

    dispatch(createComment(formData)).then(() => {
      const parentNode = sidebarCommentsRef.current?.parentNode as HTMLElement;
      if (parentNode) {
        parentNode.scrollTop = parentNode.scrollHeight;
      }
      setCommLoading(false);
    });
    setCommentText({ id: '', text: '' });
    setCommentImage(null);
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

  const onUploadCommentImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setCommentImage(file);
    }
  };

  const onCancelUpdateComm = () => {
    setCommentText({ id: '', text: '' });
    setCommentImage(null);
  };

  return (
    <div className={s.comments}>
      <div className={s.comments__header}>
        <h3>Comments</h3>
        <span onClick={onHideComments}>
          {isCommHidden ? <ArrowDownSVG /> : <ArrowUpSVG />}
          <CloseSVG onClick={onCloseComments} />
        </span>
      </div>
      {!isCommHidden && (
        <>
          {comments?.length ? (
            comments.map((comment) => {
              const creationTime = createTimeSince(new Date(comment.createdAt));

              return (
                <MemoizedCommentItem
                  key={comment._id}
                  comment={comment}
                  commRef={sidebarCommentsRef}
                  creationTime={creationTime}
                  setCommentText={setCommentText}
                  setCommentImage={setCommentImage}
                  onShowFullImage={setFullCommentImage}
                />
              );
            })
          ) : (
            <h3 className={s.comments__noComments}>No comments yet</h3>
          )}
          <div className={s.comments__create}>
            <Avatar avatar={currentUserPhoto as string} />
            <div className={s.comments__create__group}>
              <div className={`input ${s.textarea}`}>
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
                <AttachSVG onClick={() => commentFileRef.current?.click()} />

                <input
                  ref={commentFileRef}
                  type="file"
                  key={(commentImage as File)?.name}
                  onChange={onUploadCommentImage}
                  hidden
                />

                {commentImage && (
                  <div className={s.comments__create__group__image}>
                    <img
                      src={URL.createObjectURL(commentImage)}
                      alt="comm img"
                    />
                    <CloseSVG onClick={() => setCommentImage(null)} />
                  </div>
                )}
              </div>

              <div className={s.comments__create__buttons}>
                {isCommLoading && (
                  <div className="loader_center">
                    <Loader className="loader_mini" />
                  </div>
                )}
                {!isCommLoading && (
                  <Button
                    className={`button ${
                      ((commentText.text && !/^\s*$/.test(commentText.text)) ||
                        commentImage) &&
                      isAuth
                        ? `button_colored`
                        : 'button_disabled'
                    }`}
                    text={commentText.id ? 'Update' : 'Comment'}
                    onClick={onSubmitComment}
                    disabled={
                      ((!commentText.text || /^\s*$/.test(commentText.text)) &&
                        !commentImage) ||
                      !isAuth
                    }
                  />
                )}
                {commentText.id && (
                  <Button
                    text="Cancel update"
                    className="button button_cancel"
                    onClick={onCancelUpdateComm}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        isVisible={Boolean(fullCommentImage)}
        onCloseModal={() => setFullCommentImage('')}
      >
        <div className={s.modal__fullImage}>
          <img src={fullCommentImage} alt="full img" />
        </div>
      </Modal>
    </div>
  );
};
