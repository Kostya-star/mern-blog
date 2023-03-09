import { Categories } from 'components/Categories/Categories';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Button } from 'components/UI/Button/Button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthSelector } from 'redux/slices/auth';
import { fetchComments } from 'redux/slices/comments';
import { fetchPosts } from 'redux/slices/posts';
import { fetchTags } from 'redux/slices/tags';
import { useAppDispatch, useAppSelector } from './../redux/hooks';

export const Home = () => {
  const dispatch = useAppDispatch();

  const { posts, postsStatus, commentStatus, isComments } = useAppSelector(
    ({ posts, tags, comments }) => ({
      posts: posts?.posts,
      postsStatus: posts?.status,
      tagsStatus: tags?.status,
      tags: tags?.tags,
      commentStatus: comments?.status,
      isComments: comments.isComments,
    }),
  );

  const isAuth = useAppSelector(isAuthSelector);

  useEffect(() => {
    dispatch(fetchPosts({ sortedCat: 'createdAt' }));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  return (
    <div className="home__wrapper">
      <div className={`home__navbar ${isComments && 'home__navbar_shrink'}`}>
        <Categories />
        {isAuth && (
          <Link to="/add-post">
            <Button text="Add post" className="button button_colored" />
          </Link>
        )}
      </div>
      {isComments ? (
        <div className="home__content">
          <div className="home__content__posts">
            {postsStatus === 'loading' && <div>Loading...</div>}
            {postsStatus === 'error' && <div>ERROR</div>}
            {postsStatus === 'success' &&
              posts?.map((post) => <PostItem key={post._id} post={post} />)}
          </div>
          <div className="home__content__sidebar">
            {commentStatus === 'loading' && <div>Loading...</div>}
            {commentStatus === 'error' && <div>ERROR</div>}
            {commentStatus === 'success' && (
              <div className="home__content__comments">
                <Comments />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="home__content__posts">
          {postsStatus === 'loading' && <div>Loading...</div>}
          {postsStatus === 'error' && <div>ERROR</div>}
          {postsStatus === 'success' &&
            posts?.map((post) => <PostItem key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
};
