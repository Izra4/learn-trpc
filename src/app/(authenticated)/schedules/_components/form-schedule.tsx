"use client";
import { Button, Col, DatePicker, Flex, Form, Select, TimePicker } from "antd";
import { FC } from "react";
import { FormProps } from "antd/lib";
import { CustomException } from "@/types/cutom-exception";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { MOCK_STUDIOS } from "../../studios/_dummies/studio-mock-data";
import { MOCK_FILMS } from "../../films/_dummies/mock-film-data";
import { useScheduleForm } from "../_hooks/use-schedule-form";

type Props = {
  formProps: FormProps;
  loading: boolean;
  isUpdate?: boolean;
  error: CustomException | null;
};

export const FormSchedule: FC<Props> = ({ formProps, loading, error, isUpdate }) => {
  const [form] = Form.useForm();
  useFormErrorHandling(form, error);

  const filmOptions = MOCK_FILMS.data.map((film) => ({
    value: film.id,
    label: film.title,
  }));

  const studioOptions = MOCK_STUDIOS.data.map((studio) => ({
    value: studio.id,
    label: studio.name,
  }));

  const { handleStudioChange, handleOnFinish } = useScheduleForm(formProps, studioOptions, form);

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
            name="showTime"
            rules={[{ required: true, message: "Show Time wajib diisi" }]}
          >
            <TimePicker format={"HH:mm"} style={{ width: "100%" }}></TimePicker>
          </Form.Item>
        </Col>
      </Flex>

      <Form.Item
        label="Studio"
        name="studioIds"
        rules={[{ required: true, message: "Minimal satu studio harus dipilih" }]}
      >
        {isUpdate ? (
          <Select
            placeholder="Select studio"
            options={studioOptions}
            onChange={handleStudioChange}
            style={{ width: "100%" }}
          />
        ) : (
          <Select
            mode="multiple"
            placeholder="Select studio"
            options={studioOptions}
            onChange={handleStudioChange}
            style={{ width: "100%" }}
          />
        )}
      </Form.Item>
      <Form.Item
        label="Film"
        name="filmId"
        rules={[{ required: true, message: "Film harus diisi" }]}
      >
        <Select placeholder="Select film" options={filmOptions} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
