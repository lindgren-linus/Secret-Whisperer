import React, { useRef, useEffect, useState } from "react";

export function Canvas(props: {
  show?: boolean;
  fontSize: number;
  renderString: string;
  onImageChange: (blob: Blob) => void;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<Blob>();

  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const ctx = canvasEl.current.getContext("2d");
      if (ctx) {
        const width = canvasEl.current.width;
        const height = canvasEl.current.height;
        ctx.clearRect(0, 0, width, height);
        ctx.font = `${props.fontSize}px Courier`;
        ctx.fillText(props.renderString, 0, height / 2 + 5);

        canvasEl.current.toBlob((blob: Blob | null) => {
          if (blob) {
            setImage(blob);
          }
        });
      }
    }
  }, [props.renderString]);

  const handleImageChange = (image: Blob) => {
    props.onImageChange(image);
  };

  useEffect(() => {
    if (image) {
      handleImageChange(image);
    }
  }, [image]);

  return (
    <canvas
      ref={canvasEl}
      style={{ opacity: props.show ? 1.0 : 0.0 }}
      width={props.renderString.length * (props.fontSize / 1.5)}
    />
  );
}
