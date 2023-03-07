import { Avatar } from 'components/Avatar/Avatar';
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
import { IPost } from './../types/IPost';

export const FullPost = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { comments } = useAppSelector(({ comments }) => ({
    comments: comments.comments,
  }));

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const post = await dispatch(
            fetchPost({ id, isPostView: true }),
          ).unwrap();
          setPost(post);
          dispatch(fetchCommentsByPostId(id));
        } catch (error) {
          setError(error as any);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const post = await dispatch(fetchPost({ id })).unwrap();
          setPost(post);
        } catch (error) {
          setError(error as any);
        }
      })();
    }
  }, [comments.length]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>ERROR</div>;
  }

  return (
    <div >
      <div >
        <PostItem isPostText={true} post={post} />
      </div>
      <Comments />
    </div>
    // <div className="fullPost">
    //   <div className="post">
    //     <PostItem isPostText={true} post={post} />
    //   </div>
    //   <Comments />
    // </div>
  );
};
