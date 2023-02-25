import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { instance } from './../API/instance';
import { IPost } from './../types/IPost';

export const FullPost = () => {
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const resp = await instance.get(`/posts/${id}`)
        setPost(resp.data);
      } catch (error) {
        setError(error as any)
      } finally {
        setLoading(false);
      }
    }
    fetchPost()
  }, []);
  console.log(error);
  
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
