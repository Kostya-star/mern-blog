import { FC, useState } from 'react';
import s from './Categories.module.scss';
import { useAppDispatch } from './../../redux/hooks';
import { fetchPosts } from 'redux/slices/posts';

const categories = [
  { value: 'New', label: 'createdAt' },
  { value: 'Popular', label: 'viewCount' },
];

export const Categories: FC = () => {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState(0);

  const onClickCategory = (ind: number, cat: string) => {
    dispatch(fetchPosts({ sortedCat: cat }));

    setActiveCategory(ind);
  };

  return (
    <div>
      {categories.map((cat, ind) => (
        <button
          key={ind}
          onClick={() => onClickCategory(ind, cat.label)}
          className={`${s.button} ${
            activeCategory === ind ? s.button__active : ''
          }`}
          disabled={activeCategory === ind}
        >
          {cat.value}
        </button>
      ))}
    </div>
  );
};
