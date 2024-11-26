"use client";

import { ImagePreview } from "@/app/_components/image-preview";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { useImageUpload } from "@/hooks/use-image-upload";
import { CustomException } from "@/types/cutom-exception";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, InputNumber, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect } from "react";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormFilm: FC<Props> = ({ formProps, error, loading }) => {
  const [form] = Form.useForm();

  const {
    fileList: posterFile,
    previewOpen,
    previewImage,
    setPreviewOpen,
    setPreviewImage,
    handleChange,
    handlePreview,
    handleUpload,
    setFileList,
  } = useImageUpload({
    form,
    fieldName: "poster",
    initialValue: formProps.initialValues?.poster,
  });

  useEffect(() => {
    form.setFieldsValue(formProps.initialValues);

    if (formProps.initialValues?.poster) {
      setFileList([
        {
          uid: "-1",
          name: "Default Poster",
          status: "done",
          url: formProps.initialValues.poster,
        },
      ]);
    }
  }, [formProps.initialValues]);

  useFormErrorHandling(form, error);

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Form.Item
        label="Film Title"
        name="title"
        rules={[{ required: true, message: "Film Title wajib diisi" }]}
      >
        <Input placeholder="Film Title" />
      </Form.Item>
      <Form.Item
        label="Duration"
        name="duration"
        rules={[{ required: true, message: "Duration wajib diisi" }]}
      >
        <InputNumber placeholder="Duration" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description wajib diisi" }]}
      >
        <TextArea placeholder="Description" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Poster"
        name="poster"
        rules={[{ required: true, message: "Poster wajib diisi" }]}
      >
        <Flex>
          <Upload
            customRequest={({ file }) => handleUpload(file as any)}
            maxCount={1}
            listType="picture-card"
            fileList={posterFile}
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            <button style={{ border: 0, background: "none", cursor: "pointer" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
          <ImagePreview
            previewOpen={previewOpen}
            previewImage={previewImage}
            onPreviewChange={setPreviewOpen}
            onAfterPreviewChange={(visible) => !visible && setPreviewImage("")}
          />
        </Flex>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
