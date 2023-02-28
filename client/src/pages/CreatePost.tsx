import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useCallback, useState, useRef, ChangeEvent, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { instance } from 'API/instance';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from 'redux/hooks';
import {
  createPost,
  fetchPost,
  updatePost,
  uploadPostImage,
} from 'redux/slices/posts';
import { INewPostRequest } from 'types/INewPostRequest';
import { IUpdatePostRequest } from 'types/IUpdatePostRequest';

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
  imageUrl: File | string;
}

export const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id } = useParams();

  const [newPost, setNewPost] = useState<INewPost>({
    title: '',
    tags: '',
    text: '',
    imageUrl: '',
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id))
        .unwrap()
        .then(({ title, text, tags, imageUrl }) => {
          setNewPost({
            title,
            text,
            tags: tags.join(' '),
            imageUrl,
          });
        });
    }
  }, []);

  const isEditing = Boolean(id);

  // if !isEditing then newPost.imageUrl === File. In this case we are creating a post.
  // Otherwise if newPost.imageUrl is a string, then we are editing the post
  // and we dont need to perform the operations in the if operator and can proceed right to the post request
  const onCreatePostUploadImage = async () => {
    if (typeof newPost.imageUrl !== 'string') {
      const formData = new FormData();
      formData.append('image', newPost.imageUrl as File);
      const { url } = await dispatch(uploadPostImage(formData)).unwrap();
      return url;
    }
  };

  const onSubmitNewPost = async () => {
    try {
      let uploadedImgUrl = await onCreatePostUploadImage();

      const _newPost = {
        ...newPost,
        imageUrl: uploadedImgUrl || (newPost.imageUrl as string),
        tags: newPost.tags.split(' '),
      };

      if (isEditing) {
        await dispatch(
          updatePost({ id: id as string, updatedPost: _newPost }),
        ).unwrap();
        navigate(`/posts/${id}`);
      } else {
        const { data } = await dispatch(createPost(_newPost)).unwrap();
        navigate(`/posts/${data._id}`);
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

  const imgSrc =
    typeof newPost.imageUrl !== 'string'
      ? URL.createObjectURL(newPost.imageUrl)
      : // : `${process.env.REACT_APP_API_URL}${newPost.imageUrl}`;
        `http://localhost:5000${newPost.imageUrl}`;
  //
  return (
    <div className="createPost">
      <div className="createPost__content">
        {newPost.imageUrl ? (
          <>
            <Button
              text="Delete"
              className="button button_delete"
              onClick={onDeleteImage}
            />
            <img
              className="createPost__content__img"
              src={imgSrc}
              alt="Uploaded"
            />
          </>
        ) : (
          <Button
            onClick={() => imageRef.current?.click()}
            text="Upload image"
            className="button button_transparent"
          />
        )}
        <input
          ref={imageRef}
          type="file"
          onChange={(e) =>
            setNewPost({ ...newPost, imageUrl: e.target.files?.[0] as File })
          }
          hidden
        />
        <TextArea
          placeholder="Post title..."
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Input
          type="text"
          placeholder="#t a g s"
          value={newPost.tags}
          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
        />
        <hr />
      </div>
      <SimpleMDE
        className="editor"
        value={newPost.text}
        onChange={(value) => setNewPost({ ...newPost, text: value })}
        options={options}
      />
      <div className="createPost__content__buttons">
        <Button
          text={isEditing ? 'Edit' : 'Publish'}
          className="button button_colored"
          onClick={onSubmitNewPost}
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
