import { instance } from 'API/instance';
import axios from 'axios';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Tags } from 'components/Tags/Tags';
import { useEffect, useState } from 'react';
import { fetchPosts } from 'redux/slices/posts';
import { useAppDispatch, useAppSelector } from './../redux/hooks';

const categories = ['New', 'Popular'];

export const Home = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(({ posts }) => posts.posts);

  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    dispatch(fetchPosts());
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
          {posts?.map((post) => (
            <PostItem isPopUpButtons={true} />
          ))}
        </div>
        <div className="home__content__sidebar">
          <Tags />
          <Comments />
        </div>
      </div>
    </div>
  );
};
