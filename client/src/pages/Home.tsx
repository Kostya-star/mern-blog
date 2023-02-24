import { PostItem } from 'components/PostItem/PostItem';
import { useState } from 'react';

const categories = ['New', 'Popular']

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState(0)
  return (
    <div className="home__wrapper">
      <div className="home__content">
        <div>
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
          <PostItem />
        </div>

        <div className="tags">TAGS</div>
        <div className="comments">COMMENTS</div>
      </div>
    </div>
  );
};
