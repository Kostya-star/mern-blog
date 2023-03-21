import { ReactComponent as UploadSVG } from 'assets/upload.svg';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { Loader } from 'components/UI/Loader/Loader';
import { TextArea } from 'components/UI/TextArea/TextArea';
import 'easymde/dist/easymde.min.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import { useAppDispatch } from 'redux/hooks';
import { createPost, fetchPost, updatePost } from 'redux/slices/posts';
import { INewPostRequest } from 'types/INewPostRequest';
import { base64ToFile } from 'utils/base64ToFile';

const options = {
  spellChecker: false,
  maxHeight: '400px',
  autofocus: true,
  hideIcons: ['side-by-side', 'fullscreen'] as any,
  placeholder: 'Введите текст...',
  status: false,
  autosave: {
    enabled: true,
    delay: 1000,
    uniqueId: 'MyUniqueID',
  },
};

interface INewPost extends Omit<INewPostRequest, 'tags' | 'imageUrl'> {
  tags: string;
  image: null | File;
}

export const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id } = useParams();

  const [newPost, setNewPost] = useState<INewPost>({
    title: '',
    tags: '',
    text: '',
    image: null,
  });

  const [isLoading, setLoading] = useState(false);

  const imageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchPost({ id }))
        .unwrap()
        .then(({ title, text, tags, imageUrl }) => {
          const file = base64ToFile(imageUrl);

          setNewPost({
            title,
            text,
            tags: tags.join(' '),
            image: file as File,
          });
          setLoading(false);
        });
    }
  }, []);

  const isEditing = Boolean(id);

  const onSubmitNewPost = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('tags', newPost.tags.trim());
      formData.append('text', newPost.text);
      formData.append('image', newPost.image || '');
      formData.append('postId', id as string);

      if (isEditing) {
        await dispatch(updatePost(formData)).unwrap();
        navigate(`/`);
      } else {
        await dispatch(createPost(formData)).unwrap();
        navigate(`/`);
      }
    } catch (error) {
      alert('Error when creating the article');
      console.log(error);
    }
  };

  const onDeleteImage = () => {
    setNewPost({ ...newPost, image: null });
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="loader_center">
        <Loader className='loader_big'/>
      </div>
    );
  }

  return (
    <div className="createPost">
      <div className="createPost__content">
        {newPost.image ? (
          <>
            <Button
              text="Delete"
              className="button button_delete"
              onClick={onDeleteImage}
            />
            <img
              className="createPost__content__img"
              src={URL.createObjectURL(newPost.image)}
              alt="Uploaded"
            />
          </>
        ) : (
          <div className="createPost__content__upload">
            <Button
              onClick={() => imageRef.current?.click()}
              text="Upload image"
              className="button button_transparent"
            >
              <UploadSVG />
            </Button>
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          onChange={(e) =>
            setNewPost({
              ...newPost,
              image: e.target.files?.[0] as File,
            })
          }
          hidden
        />

        <TextArea
          placeholder="Post title..."
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <hr />
        {!newPost.title && (
          <div className="createPost__requiredErr">* Required</div>
        )}
        <Input
          type="text"
          placeholder="# t a g s"
          value={newPost.tags}
          title="No need to insert '#'. Insert words only"
          onChange={(e) =>
            setNewPost({
              ...newPost,
              tags: e.target.value
                .replace(/[,#.]/g, '')
                .replace(/\s{2,}/g, ' '),
            })
          }
        />
        <hr />
        {!newPost.tags && (
          <div className="createPost__requiredErr">* Required</div>
        )}
      </div>
      <div className="markdown__wrapper">
        <SimpleMDE
          className="editor"
          value={newPost.text}
          onChange={(value) => setNewPost({ ...newPost, text: value })}
          options={options}
        />
        {!newPost.text && (
          <div className="createPost__requiredErr">* Required</div>
        )}
      </div>
      <div className="createPost__content__buttons">
        <Button
          text={isEditing ? 'Edit' : 'Publish'}
          className={`button ${
            !newPost.title || !newPost.tags || !newPost.text
              ? 'button_disabled'
              : 'button_colored'
          }`}
          onClick={onSubmitNewPost}
          disabled={!newPost.title || !newPost.tags || !newPost.text}
        />
        <Button
          text="Cancel"
          className="button button_cancel"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};
