import { ReactComponent as ArrowDownSVG } from 'assets/arrow-down.svg';
import { ReactComponent as ArrowUpSVG } from 'assets/arrow-up.svg';
import { ReactComponent as AttachSVG } from 'assets/attach.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { ChangeEvent, FC, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  addComment,
  clearCommentsSlice,
  createComment,
  deleteComment,
  likeComment,
  removeComment,
  updateComm,
  updateComment,
  updateCommentLike,
} from 'redux/slices/comments';
import { uploadFile } from 'redux/slices/files';
import { createTimeSince } from 'utils/createTimeSince';
import { MemoizedCommentItem } from './CommentItem/CommentItem';
import s from './Comments.module.scss';
import io from 'socket.io-client'
import { baseUrl } from 'API/baseUrl';
import { IComment } from 'types/IComment';
import { scrollToBottom } from 'utils/scrollToBottom';
import { extendTextAreaWhenTyping } from 'utils/extendTextAreaWhenTyping';

interface ICommentsProps {}

const socket = io(baseUrl)
// console.log(socket);


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
  const [commentImage, setCommentImage] = useState<string>('');
  const [fullCommentImage, setFullCommentImage] = useState('');
  const [isCommCreating, setCommCreating] = useState(false);
  const [isCommDeleting, setCommDeleting] = useState(false);

  const [serverError, setServerError] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sidebarCommentsRef = useRef<HTMLDivElement>(null);
  const commentFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom(sidebarCommentsRef)
  }, [])

  useEffect(() => {
    socket.on('newComment', async (newComm: IComment) => {
      if(newComm.post === postId) {
        const resp = await dispatch(addComment(newComm))
        if(resp) {
          scrollToBottom(sidebarCommentsRef)
        }
      }
    })

    socket.on('updateComment', updatedComment => {
      dispatch(updateComm(updatedComment))
    })

    socket.on('likeComment', resp => {
      dispatch(updateCommentLike(resp))
    })

    socket.on('deleteComment', commId => {
      dispatch(removeComment({ id: commId }))
    })

    return () => {
      socket.off('newComment')
      socket.off('updateComment')
      socket.off('likeComment')
      socket.off('deleteComment')
    }
  }, [socket])

  const onSubmitComment = async () => {
    try {
      setCommCreating(true);

      const comment = {
        text: commentText.text.trim() || '',
        postId,
        imageUrl: commentImage,
      };

      // UPDATING COMMENT
      if (commentText.id) {
        const updatedComm = await dispatch(updateComment({ comment, commId: commentText.id })).unwrap()
        if(updatedComm) {
          socket.emit('updateComment', updatedComm)
        }

        return;
      }

      // CREATING COMMENT
      const newComm = await dispatch(createComment(comment)).unwrap()
      if(newComm) {
        socket.emit('newComment', newComm)
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

    } catch (error) {
      console.log(error);
    } finally {
      setCommCreating(false);
      setCommentText({ id: '', text: '' });
      setCommentImage('');
    }
  };

  const onTypingCommentHandle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText({ ...commentText, text: e.target.value });
    extendTextAreaWhenTyping(e)
  }

  const onLikeComment = async (commId: string) => {
    const resp = await dispatch(likeComment(commId)).unwrap();
    if(resp) {
      socket.emit('likeComment', resp)
    }
  };

  const onDeleteComment = async (commId: string) => {
    try {
      setCommDeleting(true);
      const resp = await dispatch(deleteComment(commId)).unwrap()
      if(resp) {
        socket.emit('deleteComment', resp.id)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommDeleting(false);
    }
  };

  const onCloseComments = () => {
    dispatch(clearCommentsSlice());
  };

  const onHideComments = () => {
    setCommHidden(!isCommHidden);
  };

  const onUploadCommentImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setCommCreating(true)
      const file = e.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        await dispatch(uploadFile(formData))
          .unwrap()
          .then((data) => {
            if(data) {
              setCommentImage(data.url);
              // setCommCreating(false)
              setServerError('')
            }
          });
      }
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setCommCreating(false)
    }
  };

  const onCancelUpdateComm = () => {
    setCommentText({ id: '', text: '' });
    setCommentImage('');
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
                  isCommDeleting={isCommDeleting}
                  setCommentText={setCommentText}
                  setCommentImage={setCommentImage}
                  onShowFullImage={setFullCommentImage}
                  onDeleteComment={onDeleteComment}
                  onLikeComment={onLikeComment}
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
                  onChange={onTypingCommentHandle}
                />
                {commentText.text && !isAuth && (
                  <div className="input_error"> you are not authenticated!</div>
                )}
                <AttachSVG onClick={() => commentFileRef.current?.click()} />

                <input
                  ref={commentFileRef}
                  type="file"
                  key={commentImage}
                  onChange={onUploadCommentImage}
                  hidden
                />

                {commentImage && (
                  <div className={s.comments__create__group__image}>
                    <img src={commentImage} alt="comm img" />
                    <CloseSVG onClick={() => setCommentImage('')} />
                  </div>
                )}
              </div>

              {serverError && (
                  <div className="input input_error">{serverError}</div>
                )}

              <div className={s.comments__create__buttons}>
                {isCommCreating && (
                  <div className="loader_center">
                    <Loader className="loader_mini" />
                  </div>
                )}
                {!isCommCreating && (
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
