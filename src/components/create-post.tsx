import React, { useState, useEffect } from "react";
import {
  Input,
  InputOnChangeData,
  Button,
  Container,
  Header,
  Icon,
  Progress,
} from "semantic-ui-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { storage } from "../firebase";
import { api } from "../api";
import { cookies } from "../cookies";

const CreatePost: React.FC = () => {
  const [src, setSrc] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState<ReactCrop.Crop>({});
  const [image, setImage] = useState<HTMLImageElement | null>();
  const [progress, setProgress] = useState<number>(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (!cookies.get("token")) {
      window.location.pathname = "/login";
    }
  }, []);

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result), false);
      reader.readAsDataURL(e.target.files[0]);
      console.log(src);
    }
  };

  const onCropChange = (crop: ReactCrop.Crop) => {
    setCrop(crop);
  };

  const onImageLoaded = (image: HTMLImageElement) => {
    setImage(image);
    console.log(image.src);
  };

  const onCropComplete = (cro: ReactCrop.Crop) => {
    console.log("onCropComplete", crop);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: ReactCrop.Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width || 0;
    canvas.height = crop.height || 0;
    const x = crop.x || 0;
    const y = crop.y || 0;
    const w = crop.width || 0;
    const h = crop.height || 0;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        image,
        x * scaleX,
        y * scaleY,
        w * scaleX,
        h * scaleY,
        0,
        0,
        w,
        h
      );
    } else {
      throw new Error("Canvas failed");
    }
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        console.log(blob);
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handlePost = async () => {
    if (image) {
      try {
        let post_id: string = "";
        await api
          .post("/posts/add", {
            title: title,
            image: "...",
          })
          .then((res) => (post_id = res.data.id));
        const blob: any = await getCroppedImg(image, crop);
        const uploadTask = storage.ref(`images/${post_id}.jpeg`).put(blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(`${post_id}.jpeg`)
              .getDownloadURL()
              .then((url) => {
                console.log(url);
                api
                  .post("/posts/edit/" + post_id, {
                    title: title,
                    image: url,
                  })
                  .then((_res) => (window.location.pathname = "/"));
              });
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container text>
      <Header as="h1">Create Post: </Header>
      <Header as="h3">Title: </Header>
      <Input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fluid
      />
      <br /> <br />
      <Input
        type="file"
        onChange={handleFileInput}
        accept="image/png, image/jpeg"
      />
      <Header as="h2">
        <Icon name="crop" />
        Please Crop your image
      </Header>
      {src && (
        <ReactCrop
          src={src.toString()}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
      )}
      <br />
      <Progress percent={progress} indicating progress />
      <br />
      <Button onClick={handlePost}>Submit</Button>
    </Container>
  );
};

export default CreatePost;
