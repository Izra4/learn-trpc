import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { CustomException } from "@/types/cutom-exception";
import { Button, Form, FormProps, Input } from "antd";
import { FC, useEffect } from "react";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormGenre: FC<Props> = ({ formProps, error, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formProps.initialValues);
  }, [formProps.initialValues]);

  useFormErrorHandling(form, error);

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Form.Item
        label="Genre Name"
        name="name"
        rules={[{ required: true, message: "Genre wajib diisi" }]}
      >
        <Input placeholder="Genre Name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
