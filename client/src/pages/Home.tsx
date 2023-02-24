import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Tags } from 'components/Tags/Tags';
import { useState } from 'react';

const categories = ['New', 'Popular'];

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState(0);

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
        <PostItem isPopUpButtons={true}/>
        <div className="home__content__group">
          <Tags />
          <Comments />
        </div>
      </div>
    </div>
  );
};
