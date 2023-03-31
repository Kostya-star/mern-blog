import { ReactComponent as UploadSVG } from 'assets/upload.svg';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { Loader } from 'components/UI/Loader/Loader';
import { TextArea } from 'components/UI/TextArea/TextArea';
import 'easymde/dist/easymde.min.css';
import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { uploadFile } from 'redux/slices/files';
import { createPost, fetchPost, updatePost } from 'redux/slices/posts';
import { INewPostRequest } from 'types/INewPostRequest';

const options = {
  spellChecker: false,
  maxHeight: '400px',
  autofocus: true,
  hideIcons: ['side-by-side', 'fullscreen', 'preview'] as any,
  placeholder: "What's on your mind?",
  status: false,
  autosave: {
    enabled: true,
    delay: 1000,
    uniqueId: 'MyUniqueID',
  },
};

export const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const isEditing = Boolean(id);

  const fileUploadStatus = useAppSelector(({ files }) => files.status);

  const [newPost, setNewPost] = useState<INewPostRequest>({
    title: '',
    tags: '',
    text: '',
    imageUrl: '',
  });

  const [isLoading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('')

  const imageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchPost({ id }))
        .unwrap()
        .then(({ title, text, tags, imageUrl }) => {
          const tagsString = Array.isArray(tags) && tags.length === 1 && tags[0].trim() === '' 
          ? ''
          : tags.join(' ');
          
          setNewPost({
            title,
            text,
            tags: tagsString,
            imageUrl,
          });
          setLoading(false);
        });
    }
  }, []);

  const onSubmitNewPost = async () => {
    try {
      if (isEditing) {
        await dispatch(updatePost({ newPost, postId: id as string }));
        navigate(`/`);
      } else {
        await dispatch(createPost(newPost));
        navigate(`/`);
      }
    } catch (error) {
      alert('Error when creating the article');
      console.log(error);
    }
  };

  const onDeleteImage = () => {
    setNewPost({ ...newPost, imageUrl: '' });
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        const data = await dispatch(uploadFile(formData)).unwrap()
        if(data) {
          setNewPost({
            ...newPost,
            imageUrl: data.url,
          });
          setImageError('')
        }
      }
    } catch (error: any) {
      setImageError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="loader_center">
        <Loader className="loader_big" />
      </div>
    );
  }

  return (
    <div className="createPost">
      <div className="createPost__content">
        {fileUploadStatus === 'loading' ? (
          <div className="loader_center">
            <Loader className="loader_big" />
          </div>
        ) : newPost.imageUrl ? (
          <>
            <Button
              text="Delete"
              className="button button_delete"
              onClick={onDeleteImage}
            />
            <img
              className="createPost__content__img"
              src={newPost.imageUrl}
              alt="Uploaded img"
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
        <input ref={imageRef} type="file" onChange={onUploadFile} hidden />

        {imageError && (
          <div className="createPost__requiredErr">{ imageError }</div>
        )}

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
      </div>
      <div className="markdown__wrapper">
        <SimpleMDE
          className="editor"
          value={newPost.text}
          onChange={(value) => setNewPost({ ...newPost, text: value })}
          options={options}
        />
      </div>
      <div className="createPost__content__buttons">
        <Button
          text={isEditing ? 'Edit' : 'Publish'}
          className={`button ${
            !newPost.title
              ? 'button_disabled'
              : 'button_colored'
          }`}
          onClick={onSubmitNewPost}
          disabled={!newPost.title}
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
