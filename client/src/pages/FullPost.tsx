import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPost } from './../types/IPost';
import { useAppDispatch } from 'redux/hooks';
import { fetchPost } from 'redux/slices/posts';

export const FullPost = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const post = await dispatch(fetchPost(id as string)).unwrap();
        setPost(post);
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <Comments isCreatePost={true} />
    </div>
  );
};
