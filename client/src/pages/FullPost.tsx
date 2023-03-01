import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { createComment, fetchComments, fetchCommentsByPostId } from 'redux/slices/comments';
import { fetchPost } from 'redux/slices/posts';
import { IPost } from './../types/IPost';
import { IComment } from './../types/IComment';

export const FullPost = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const post = await dispatch(fetchPost(id as string)).unwrap();
        setPost(post);
        const comments = await dispatch(fetchCommentsByPostId(id as string)).unwrap();
        setComments(comments);
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  const onCreateComment = async () => {
    dispatch(createComment({ postId: id as string, text: commentText }))
    const comments = await dispatch(fetchCommentsByPostId(id as string)).unwrap();
    setComments(comments);
    setCommentText('')
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
      <Comments comments={comments}>
        <div className="comments__create">
          <img src="https://mui.com/static/images/avatar/2.jpg" alt="" />
          <div>
            <div className="input">
              <Input
                type="text"
                placeholder="Write comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            <Button
              className="button button_colored"
              text="send"
              onClick={onCreateComment}
              disabled={!commentText}
            />
          </div>
        </div>
      </Comments>
    </div>
  );
};
