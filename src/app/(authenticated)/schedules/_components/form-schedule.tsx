"use client";
import { Button, Col, DatePicker, Flex, Form, InputNumber, Select, TimePicker } from "antd";
import { FC, useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import { CustomException } from "@/types/cutom-exception";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { trpc } from "@/libs/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type Props = {
  formProps: FormProps;
  loading: boolean;
  isUpdate?: boolean;
  error: CustomException | null;
};

export const FormSchedule: FC<Props> = ({ formProps, loading, error }) => {
  const [form] = Form.useForm();
  useFormErrorHandling(form, error);
  const [filmOptions, setFilmOptions] = useState<{ value: string; label: string }[]>([]);
  const [studioOptions, setStudioOptions] = useState<{ value: string; label: string }[]>([]);

  const { data: studioData } = trpc.studio.getStudios.useQuery({ page: 1, perPage: 100 });

  const { data: filmData } = trpc.film.getFilms.useQuery({ page: 1, perPage: 100 });

  useEffect(() => {
    if (studioData) {
      setStudioOptions(studioData.data.map((studio) => ({ value: studio.id, label: studio.name })));
    }

    if (filmData) {
      setFilmOptions(filmData.data.map((film) => ({ value: film.id, label: film.title })));
    }
  }, [studioData, filmData]);

  useEffect(() => {
    if (formProps.initialValues?.showTime) {
      const dateTime = dayjs(formProps.initialValues.showTime);
      form.setFieldsValue({
        ...formProps.initialValues,
        date: dateTime,
        startTime: dateTime,
      });
    }
  }, [formProps.initialValues, form]);

  const handleOnFinish = (values: any) => {
    const date = dayjs(values.date);
    const startTime = dayjs(date)
      .set("hour", values.startTime.hour())
      .set("minute", values.startTime.minute())
      .set("second", 0)
      .set("millisecond", 0)
      .format("YYYY-MM-DD HH:mm:ss");

    const formData = {
      startTime: startTime,
      filmId: values.filmId,
      studioId: values.studioId,
      price: Number(values.price),
    };

    formProps.onFinish?.(formData);
  };

  return (
    <Form {...formProps} form={form} layout="vertical" onFinish={handleOnFinish}>
      <Flex gap={5}>
        <Col flex={1}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Date wajib diisi" }]}
          >
            <DatePicker needConfirm style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item
            label="Show Time"
            name="startTime"
            rules={[{ required: true, message: "Show Time wajib diisi" }]}
          >
            <TimePicker format={"HH:mm"} style={{ width: "100%" }}></TimePicker>
          </Form.Item>
        </Col>
      </Flex>

      <Form.Item
        label="Studio"
        name="studioId"
        rules={[{ required: true, message: "Minimal satu studio harus dipilih" }]}
      >
        <Select
          placeholder="Select studio"
          options={studioOptions}
          // onChange={handleStudioChange}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        label="Film"
        name="filmId"
        rules={[{ required: true, message: "Film harus diisi" }]}
      >
        <Select placeholder="Select film" options={filmOptions} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Price is required" }]}
      >
        <InputNumber placeholder="Price" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
