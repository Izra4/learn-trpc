import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { CustomException } from "@/types/cutom-exception";
import { Button, Form, FormProps, Input } from "antd";
import { FC, useEffect } from "react";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormFacility: FC<Props> = ({ formProps, error, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formProps.initialValues);
  }, [formProps.initialValues]);

  useFormErrorHandling(form, error);

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Form.Item
        label="Facility Name"
        name="name"
        rules={[{ required: true, message: "Facility name is required" }]}
      >
        <Input placeholder="Facility Name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
