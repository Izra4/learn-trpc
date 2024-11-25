import { Image } from "antd";
import { FC } from "react";

interface ImagePreviewProps {
  previewOpen: boolean;
  previewImage: string;
  onPreviewChange: (visible: boolean) => void;
  onAfterPreviewChange?: (visible: boolean) => void;
}

export const ImagePreview: FC<ImagePreviewProps> = ({
  previewOpen,
  previewImage,
  onPreviewChange,
  onAfterPreviewChange,
}) => {
  if (!previewImage) return null;

  return (
    <Image
      alt="preview"
      wrapperStyle={{ display: "none" }}
      preview={{
        visible: previewOpen,
        onVisibleChange: onPreviewChange,
        afterOpenChange: onAfterPreviewChange,
      }}
      src={previewImage}
    />
  );
};
