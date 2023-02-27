import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Tags } from 'components/Tags/Tags';
import { useEffect, useState } from 'react';
import { fetchPosts } from 'redux/slices/posts';
import { fetchTags } from 'redux/slices/tags';
import { useAppDispatch, useAppSelector } from './../redux/hooks';

const categories = ['New', 'Popular'];

export const Home = () => {
  const dispatch = useAppDispatch();
  const { posts, tags, postsStatus, tagsStatus, currentUserId } =
    useAppSelector(({ posts, tags, auth }) => ({
      posts: posts?.posts,
      postsStatus: posts?.status,
      tagsStatus: tags?.status,
      tags: tags?.tags,
      currentUserId: auth?.data?._id,
    }));

  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <div className="home__wrapper">
      <div className="home__categories">
        {categories.map((cat, ind) => (
          <span
            key={ind}
            onClick={() => setActiveCategory(ind)}
            className={activeCategory === ind ? 'active' : ''}
          >
            {cat}
          </span>
        ))}
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
                isPopUpButtons={true}
                isUser={true}
              />
            ))}
        </div>
        <div className="home__content__sidebar">
          {tagsStatus === 'loading' && <div>Loading...</div>}
          {tagsStatus === 'error' && <div>ERROR</div>}
          {tagsStatus === 'success' && <Tags tags={tags} />}

          <Comments />
        </div>
      </div>
    </div>
  );
};
