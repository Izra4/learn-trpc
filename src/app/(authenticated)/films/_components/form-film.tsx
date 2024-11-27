"use client";

import { ImagePreview } from "@/app/_components/image-preview";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { useImageUpload } from "@/hooks/use-image-upload";
import { trpc } from "@/libs/trpc";
import { CustomException } from "@/types/cutom-exception";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Input, InputNumber, message, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect, useState } from "react";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormFilm: FC<Props> = ({ formProps, error, loading }) => {
  const [form] = Form.useForm();
  const [genreOptions, setGenreOptions] = useState<{ value: string; label: string }[]>([]);
  const [genreRemoved, setGenreRemoved] = useState<string[]>([]);
  const [genreAdded, setGenreAdded] = useState<string[]>([]);

  const { data } = trpc.genre.getGenres.useQuery({ page: 1, perPage: 100 });

  const {
    fileList: posterFile,
    previewOpen,
    previewImage,
    setPreviewOpen,
    setPreviewImage,
    handleChange,
    handleUpload,
    handlePreview,
    setFileList,
  } = useImageUpload({
    form,
    initialValue: formProps.initialValues?.poster,
  });

  useEffect(() => {
    if (data) {
      const genreOptions = data.data.map((facility) => ({
        value: facility.id,
        label: facility.name,
      }));
      setGenreOptions(genreOptions);
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue(formProps.initialValues);

    if (formProps.initialValues?.poster) {
      setFileList([
        {
          uid: "-1",
          name: "Default Poster",
          status: "done",
          url: `${process.env.NEXT_PUBLIC_APP_URL}/${formProps.initialValues.poster}`,
        },
      ]);
    }
  }, [formProps.initialValues]);

  const handleGenreChange = (selectedValues: string[]) => {
    const initialGenres = formProps.initialValues?.genres?.map((genre: any) => genre.genreId) || [];
    const removedGenres = initialGenres.filter((id: string) => !selectedValues.includes(id));
    const addedGenres = selectedValues.filter((id) => !initialGenres.includes(id));

    setGenreRemoved(removedGenres);
    setGenreAdded(addedGenres);
  };

  const handleOnFinish = (values: any) => {
    const formData = {
      title: values.title,
      description: values.description,
      duration: values.duration,
      poster: values.poster,
      genreAdded,
      genreRemoved,
    };

    formProps.onFinish?.(formData);
  };

  const beforeUpload = async (file: File) => {
    return await handleUpload({
      file,
      cb: (url: string) => {
        form.setFieldValue("poster", url);
        message.success("Image uploaded successfully");
      },
    });
  };

  useFormErrorHandling(form, error);

  return (
    <Form {...formProps} form={form} layout="vertical" onFinish={handleOnFinish}>
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
        label="Genre"
        name="genreIds"
        rules={[{ required: true, message: "Genre wajib diisi" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select facility"
          options={genreOptions}
          onChange={handleGenreChange}
        />
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
            maxCount={1}
            listType="picture-card"
            fileList={posterFile}
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
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
