import { ReactComponent as ArrowUpSVG } from 'assets/arrow-up.svg';
import { Categories } from 'components/Categories/Categories';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { isAuthSelector } from 'redux/slices/auth';
import { fetchPosts } from 'redux/slices/posts';
import { ReactComponent as PlusSVG } from 'assets/plus.svg'

export const Home = () => {
  const dispatch = useAppDispatch();
  const [isScrollBtnVisible, setScrollBtnVisible] = useState(false);

  const { posts, postsStatus, commentStatus, isComments } = useAppSelector(
    ({ posts, tags, comments }) => ({
      posts: posts?.posts,
      postsStatus: posts?.status,
      tagsStatus: tags?.status,
      tags: tags?.tags,
      commentStatus: comments?.status,
      isComments: comments.isComments,
    }),
  );

  const isAuth = useAppSelector(isAuthSelector);

  useEffect(() => {
    dispatch(fetchPosts({ sortedCat: 'createdAt' }));
    // dispatch(fetchTags());
    // dispatch(fetchComments());
  }, []);

  useEffect(() => {
    const handlePageScroll = () => {
      if (window.pageYOffset > 300 && !isScrollBtnVisible) {
        setScrollBtnVisible(true);
      } else if (window.pageYOffset < 300 && isScrollBtnVisible) {
        setScrollBtnVisible(false);
      }
    };
    window.addEventListener('scroll', handlePageScroll);

    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  });

  const onClickScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`home__wrapper ${!isComments && 'home__wrapper_shrink'}`}>
      <div className={`home__navbar ${isComments && 'home__navbar_shrink'}`}>
        <Categories />
        {isAuth && (
          <Link to="/add-post">
            <div className="home__navbar__add">
              <PlusSVG />
            </div>
            {/* <Button text="Add post" className="button button_colored" /> */}
          </Link>
        )}
      </div>
      {isComments ? (
        <div className="home__content">
          <div className="home__content__posts">
            {postsStatus === 'loading' && (
              <div className="loader_center">
                <Loader className="loader_big" />
              </div>
            )}
            {postsStatus === 'error' && <div>ERROR</div>}
            {postsStatus === 'success' &&
              posts?.map((post) => <PostItem key={post._id} post={post} />)}
          </div>

          <div className="home__content__sidebar">
            <div className="home__content__comments">
              {commentStatus === 'loading' && (
                <div className="loader_center">
                  <Loader className="loader_big" />
                </div>
              )}
              {commentStatus === 'error' && <div>ERROR</div>}
              {commentStatus === 'success' && <Comments />}
            </div>
          </div>
        </div>
      ) : (
        <div className="home__content__posts">
          {postsStatus === 'loading' && (
            <div className="loader_center">
              <Loader className="loader_big" />
            </div>
          )}
          {postsStatus === 'error' && <div>ERROR</div>}
          {postsStatus === 'success' &&
            posts?.map((post) => <PostItem key={post._id} post={post} />)}
        </div>
      )}
      {isScrollBtnVisible && (
        <div className="home__scrollUp">
          <Button
            text="scroll up"
            className="button button_transparent"
            onClick={onClickScrollTop}
          >
            <ArrowUpSVG />
          </Button>
        </div>
      )}
    </div>
  );
};
