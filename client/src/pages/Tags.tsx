import { PostItem } from 'components/PostItem/PostItem';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosts } from 'redux/slices/posts';
import { useParams } from 'react-router-dom';

export const Tags = () => {
  const dispatch = useAppDispatch();
  const { tag } = useParams()

  const { posts, postsStatus } = useAppSelector(({ posts }) => ({
    posts: posts?.posts,
    postsStatus: posts?.status,
  }));

  useEffect(() => {
    if(tag) {
      dispatch(fetchPosts({tag}));
    }
  }, []);

  return (
    <div className="tags">
      {postsStatus === 'loading' && <div>Loading...</div>}
      {postsStatus === 'error' && <div>ERROR</div>}
      {postsStatus === 'success' &&
        posts?.map((post) => (
          <div key={post._id} className="tags__post">
            <PostItem post={post} />
          </div>
        ))}
    </div>
  );
};
