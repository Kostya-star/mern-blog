import { Categories } from 'components/Categories/Categories';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Tags } from 'components/Tags/Tags';
import { useEffect } from 'react';
import { fetchComments } from 'redux/slices/comments';
import { fetchPosts } from 'redux/slices/posts';
import { fetchTags } from 'redux/slices/tags';
import { useAppDispatch, useAppSelector } from './../redux/hooks';
import { deletePost } from './../redux/slices/posts';

export const Home = () => {
  const dispatch = useAppDispatch();

  const {
    posts,
    tags,
    comments,
    postsStatus,
    tagsStatus,
    commentStatus,
    currentUserId,
  } = useAppSelector(({ posts, tags, auth, comments }) => ({
    posts: posts?.posts,
    postsStatus: posts?.status,
    tagsStatus: tags?.status,
    tags: tags?.tags,
    comments: comments?.comments,
    commentStatus: comments?.status,
    currentUserId: auth?.data?._id,
  }));

  useEffect(() => {
    dispatch(fetchPosts({ sortedCat: 'createdAt' }));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  const onSortPosts = (sortedCat: string) => {
    dispatch(fetchPosts({ sortedCat }));
  };

  const removePost = (id: string) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="home__wrapper">
      <div className="home__categories">
        <Categories sortPosts={onSortPosts} />
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
                isCurrentUser={currentUserId === post.user._id}
                deletePost={removePost}
              />
            ))}
        </div>
        <div className="home__content__sidebar">
          {tagsStatus === 'loading' && <div>Loading...</div>}
          {tagsStatus === 'error' && <div>ERROR</div>}
          {tagsStatus === 'success' && <Tags tags={tags} />}

          {commentStatus === 'loading' && <div>Loading...</div>}
          {commentStatus === 'error' && <div>ERROR</div>}
          {commentStatus === 'success' && <Comments comments={comments} />}
        </div>
      </div>
    </div>
  );
};
