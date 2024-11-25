import { UploadFile } from "antd/lib";
import { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const createInitialUploadFile = (url: string): UploadFile => ({
  uid: "-1",
  name: "Default File",
  status: "done",
  url,
});
