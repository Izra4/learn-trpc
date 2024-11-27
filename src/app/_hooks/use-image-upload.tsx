import { useState, useEffect } from "react";
import { UploadFile } from "antd/lib";
import { FormInstance } from "antd";
import { getBase64 } from "@/utils/file-util";

interface UseImageUploadProps {
  form: FormInstance;
  initialValue?: string;
}

export const useImageUpload = ({ form, initialValue }: UseImageUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Initialize fileList with initial value
  useEffect(() => {
    if (initialValue) {
      setFileList([
        {
          uid: "-1",
          name: "Default File",
          status: "done",
          url: `${process.env.NEXT_PUBLIC_APP_URL}/${initialValue}`,
        },
      ]);
      form.setFieldValue("poster", initialValue);
    }
  }, [initialValue]);

  const handleChange = ({
    fileList: newFileList,
    file,
  }: {
    fileList: UploadFile[];
    file: UploadFile;
  }) => {
    if (file.status === "removed") {
      form.setFieldValue("poster", null);
      setFileList([]);
    } else if (file.status === "done" && file.url) {
      form.setFieldValue("poster", file.url);
    }
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUpload = async ({ file, cb }: { file: File; cb: (url: string) => void }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (data.path) {
        const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${data.path}`;

        console.log("FILE", fileUrl);

        setPreviewImage(fileUrl);
        cb(data.path);
        form.setFieldValue("poster", data.path);
        setFileList([
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: fileUrl,
          },
        ]);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
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
