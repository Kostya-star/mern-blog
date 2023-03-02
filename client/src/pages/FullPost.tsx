import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import {
  createComment,
  deleteComment,
  fetchCommentsByPostId,
  updateComment,
} from 'redux/slices/comments';
import { fetchPost } from 'redux/slices/posts';
import { IComment } from './../types/IComment';
import { IPost } from './../types/IPost';

export const FullPost = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState({ id: '', text: '' });
  // const [commentToUpdate, setCommentToUpdate] = useState<IComment | null>(null);

  const isAuth = useAppSelector(isAuthSelector);
  const currentUserId = useAppSelector(({ auth }) => auth.data?._id)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const post = await dispatch(fetchPost(id as string)).unwrap();
        setPost(post);
        const comments = await dispatch(
          fetchCommentsByPostId(id as string),
        ).unwrap();
        setComments(comments);
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmitComment = async () => {
    if(commentText.id && commentText.text) {
      const updatedComment = { id: commentText.id, text: commentText.text }
      dispatch(updateComment(updatedComment))
      setComments(comments.map(comm => {
        if(comm._id === commentText.id) {
          return { ...comm, text: commentText.text }
        }
        return comm
      }));
      setCommentText({id: '', text: ''})
      return;
    }
    const { comment, updatedPost } = await dispatch(
      createComment({ postId: id as string, text: commentText.text }),
      ).unwrap();
      console.log('comment', comment);
      console.log('updatedPost', updatedPost);
      
      setComments(() => [...comments, comment]);
      setPost(updatedPost);
      setCommentText({id: '', text: ''})
  };

  const onDeleteComment = async (commId: string) => {
    const { id, updatedPost } = await dispatch(deleteComment(commId)).unwrap();
    setComments(comments.filter((comm) => comm._id !== id));
    setPost(updatedPost);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>ERROR</div>;
  }

  return (
    <div className="fullPost">
      <div className="post">
        <PostItem isPostText={true} post={post} />
      </div>
      <Comments
        comments={comments}
        onDelete={onDeleteComment}
        // onEditComment={onEditComment}
        onEditComment={(comm) => setCommentText({ id: comm._id, text: comm.text })}
        currentUserId={currentUserId}
      >
        <div className="comments__create">
          <img src="https://mui.com/static/images/avatar/2.jpg" alt="" />
          <div>
            <div className="input">
              <Input
                type="text"
                placeholder="Write comment..."
                value={commentText.text }
                onChange={(e) => setCommentText({ ...commentText, text: e.target.value })}
              />
              {commentText && !isAuth && (
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
      </Comments>
    </div>
  );
};
