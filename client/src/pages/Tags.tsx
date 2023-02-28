import { PostItem } from 'components/PostItem/PostItem';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosts } from 'redux/slices/posts';

export const Tags = () => {
  const dispatch = useAppDispatch();
  const { tag } = useParams();

  const { posts, postsStatus } = useAppSelector(({ posts }) => ({
    posts: posts?.posts,
    postsStatus: posts?.status,
  }));

  useEffect(() => {
    if (tag) {
      dispatch(fetchPosts({ tag }));
    }
  }, []);

  return (
    <div className="tags">
      <div className="tags__heading">
        <h1>List of posts with tag:</h1>
        <span>#{tag}</span>
      </div>
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
