import { Categories } from 'components/Categories/Categories';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Tags } from 'components/Tags/Tags';
import { useEffect } from 'react';
import { fetchComments, fetchCommentsByPostId } from 'redux/slices/comments';
import { fetchPosts } from 'redux/slices/posts';
import { fetchTags } from 'redux/slices/tags';
import { useAppDispatch, useAppSelector } from './../redux/hooks';
import { deletePost } from './../redux/slices/posts';
import { Link } from 'react-router-dom';
import { Button } from 'components/UI/Button/Button';
import { isAuthSelector } from 'redux/slices/auth';

export const Home = () => {
  const dispatch = useAppDispatch();

  const { posts, tags, postsStatus, tagsStatus, commentStatus } =
    useAppSelector(({ posts, tags, comments }) => ({
      posts: posts?.posts,
      postsStatus: posts?.status,
      tagsStatus: tags?.status,
      tags: tags?.tags,
      commentStatus: comments?.status,
      commentCount: comments.comments?.length
    }));

  const isAuth = useAppSelector(isAuthSelector);

  useEffect(() => {
    dispatch(fetchPosts({ sortedCat: 'createdAt' }));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  const onSortPosts = (sortedCat: string) => {
    dispatch(fetchPosts({ sortedCat }));
  };


  // const fetchCommsByPostId = (postId: string) => {
  //   dispatch(fetchCommentsByPostId(postId));
  // };

  return (
    <div className="home__wrapper">
      <div className="home__navbar">
        <Categories sortPosts={onSortPosts} />
        {isAuth && (
          <Link to="/add-post">
            <Button text="Create post" className="button button_colored" />
          </Link>
        )}
      </div>
      <div className="home__content">
        <div className="home__content__posts">
          {postsStatus === 'loading' && <div>Loading...</div>}
          {postsStatus === 'error' && <div>ERROR</div>}
          {postsStatus === 'success' &&
            posts?.map((post) => (
              <PostItem
                key={post._id}
                post={post}
                // deletePost={removePost}
                // fetchCommsByPostId={fetchCommsByPostId}
              />
            ))}
        </div>
        <div className="home__content__sidebar">
          {tagsStatus === 'loading' && <div>Loading...</div>}
          {tagsStatus === 'error' && <div>ERROR</div>}
          {tagsStatus === 'success' && <Tags tags={tags} />}

          {commentStatus === 'loading' && <div>Loading...</div>}
          {commentStatus === 'error' && <div>ERROR</div>}
          {commentStatus === 'success' && (
            <div className="home__content__comments">
              <Comments />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
