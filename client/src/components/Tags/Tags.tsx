import s from './Tags.module.scss';
import { ReactComponent as HashSymbolSVG } from 'assets/hashSymbol.svg';
import { FC } from 'react';

interface ITagsProps {
  tags: string[]
}

export const Tags:FC<ITagsProps> = ({ tags }) => {
  return (
    <div className={s.tags}>
      <h3>Tags</h3>
      <ul>
        {tags?.map((tag, ind) => (
          <li key={ind}>
            <HashSymbolSVG />
            <span>{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
