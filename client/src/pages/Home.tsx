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
        <PostItem />
        <div >
        <Tags />
        <div className="comments">COMMENTS</div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="home__wrapper">
  //     <div className="home__content">
  //       <div>
  //         <div className="home__categories">
  //           {categories.map((cat, ind) => (
  //             <span
  //               key={ind}
  //               onClick={() => setActiveCategory(ind)}
  //               className={activeCategory === ind ? 'active' : ''}
  //             >
  //               {cat}
  //             </span>
  //           ))}
  //         </div>
  //       <div className="tags">
  //         <PostItem />
  //         <Tags/>
  //       </div>
  //       </div>

  //       <div className="comments">COMMENTS</div>
  //     </div>
  //   </div>
  // );
};
