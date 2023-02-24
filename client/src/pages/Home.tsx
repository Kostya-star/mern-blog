import { PostItem } from 'components/PostItem/PostItem';

export const Home = () => {
  return (
    <div className="home__wrapper">
      <div className="home__content">

        <div>
          <div>
            <span>New</span>
            <span>Popular</span>
          </div>
          <PostItem />
        </div>

        <div className='tags'>TAGS</div>
        <div className='comments'>COMMENTS</div>

      </div>
    </div>
  );
};
