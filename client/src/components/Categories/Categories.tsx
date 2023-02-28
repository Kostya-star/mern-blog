import { FC, useState } from 'react';

interface ICategoriesProps {
  sortPosts: (category: string) => void
}

const categories = [
  {value: 'New', label: "createdAt"}, 
  {value: 'Popular', label: "viewCount"} 
];

export const Categories:FC<ICategoriesProps> = ({ sortPosts }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const onClickCategory = (ind: number, cat: string) => {
    sortPosts(cat)
    setActiveCategory(ind)
  }

  return (
    <>
      {categories.map((cat, ind) => (
        <button
          key={ind}
          onClick={() => onClickCategory(ind, cat.label)}
          className={activeCategory === ind ? 'active' : ''}
          disabled={activeCategory === ind}
        >
          {cat.value}
        </button>
      ))}
    </>
  );
};
