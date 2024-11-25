import { useState } from "react";
import { UploadFile } from "antd/lib";
import { FormInstance } from "antd";
import { getBase64 } from "@/utils/file-util";

interface UseImageUploadProps {
  form: FormInstance;
  fieldName: string;
  initialValue?: string;
}

export const useImageUpload = ({ form, fieldName, initialValue }: UseImageUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialValue
      ? [
          {
            uid: "-1",
            name: "Default File",
            status: "done",
            url: initialValue,
          },
        ]
      : [],
  );

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const file = newFileList.slice(-1)[0];
    setFileList(newFileList);
    form.setFieldValue(fieldName, file?.originFileObj || null);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUpload = async (file: UploadFile) => {
    return file;
  };

  return {
    fileList,
    previewOpen,
    previewImage,
    setPreviewOpen,
    setPreviewImage,
    handleChange,
    handlePreview,
    handleUpload,
    setFileList,
  };
};
