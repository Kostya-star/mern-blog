import { ReactComponent as HashSymbolSVG } from 'assets/hashSymbol.svg';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './Tags.module.scss';

interface ITagsProps {
  tags: string[];
}

export const Tags: FC<ITagsProps> = ({ tags }) => {
  return (
    <div className={s.tags}>
      <h3>Tags</h3>
      <ul>
        {tags?.map((tag, ind) => (
          <Link to={`/tags/${tag}`} key={ind}>
            <li >
              <HashSymbolSVG />
              <span>{tag}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
