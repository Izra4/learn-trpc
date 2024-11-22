"use client";
import { Button, Form, Input, Select } from "antd";
import { FC, useEffect } from "react";
import { FormProps } from "antd/lib";
import { CustomException } from "@/types/cutom-exception";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { MOCK_FACILITIES } from "../../facilities/_dummies/facility-mock-data";
import { Facility } from "@prisma/client";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormStudio: FC<Props> = ({ formProps, loading, error }) => {
  const [form] = Form.useForm();

  useFormErrorHandling(form, error);

  const facilityOptions = MOCK_FACILITIES.data.map((facility) => ({
    value: facility.id,
    label: facility.name,
  }));

  // Mock to default form values
  useEffect(() => {
    if (formProps.initialValues) {
      const defaultFacilities =
        formProps.initialValues.facilities?.map((facility: Facility) => ({
          name: facility.name,
          id: facility.id,
        })) || [];

      form.setFieldsValue({
        ...formProps.initialValues,
        name: formProps.initialValues.studioName,
        facilities: defaultFacilities.map((f: Facility) => f.name),
        facilityIds: defaultFacilities.map((f: Facility) => f.id),
      });
    }
  }, [formProps.initialValues, form]);

  // Mock to handle facility change
  const handleFacilityChange = (selectedValues: string[]) => {
    form.setFieldValue("facilityIds", selectedValues);
  };

  return (
    <Form
      {...formProps}
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const formData = {
          name: values.name,
          facilityIds: form.getFieldValue("facilityIds"),
        };
        formProps.onFinish?.(formData);
      }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Nama studio wajib diisi" }]}
      >
        <Input placeholder="Studio Name" />
      </Form.Item>

      <Form.Item
        label="Facility"
        name="facilityIds"
        rules={[{ required: true, message: "Minimal satu facilitas harus dipilih" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select facility"
          options={facilityOptions}
          onChange={handleFacilityChange}
        />
      </Form.Item>

      {/* Hidden form item to store facilityIds if needed */}
      <Form.Item name="facilities" hidden>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
