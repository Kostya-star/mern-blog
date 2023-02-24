import s from './Tags.module.scss';
import { ReactComponent as HashSymbolSVG } from 'assets/hashSymbol.svg';

const tags = ['React', 'Typescript', 'Notes'];

export const Tags = () => {
  return (
    <div className={s.tags}>
      <h3>Tags</h3>
      <ul>
        {tags.map((tag, ind) => (
          <li key={ind}>
            <HashSymbolSVG />
            <span>{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
