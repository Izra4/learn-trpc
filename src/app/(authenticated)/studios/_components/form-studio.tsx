"use client";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import { CustomException } from "@/types/cutom-exception";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { trpc } from "@/libs/trpc";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: CustomException | null;
};

export const FormStudio: FC<Props> = ({ formProps, loading, error }) => {
  const [form] = Form.useForm();
  const [facilitiesOptions, setFacilitiesOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [facilityAdded, setFacilityAdded] = useState<string[]>([]);
  const [facilityRemoved, setFacilityRemoved] = useState<string[]>([]);

  useFormErrorHandling(form, error);

  const { data } = trpc.facility.getFacilities.useQuery({ page: 1, perPage: 100 });

  useEffect(() => {
    if (data) {
      const facilityOptions = data.data.map((facility) => ({
        value: facility.id,
        label: facility.name,
      }));
      setFacilitiesOptions(facilityOptions);
    }
  }, [data]);

  useEffect(() => {
    if (formProps.initialValues) {
      const defaultFacilities =
        formProps.initialValues.facilities?.map((facility: any) => facility.facilityId) || [];

      form.setFieldsValue({
        ...formProps.initialValues,
        name: formProps.initialValues.name,
        facilityIds: defaultFacilities,
      });
    }
  }, [formProps.initialValues, form]);

  const handleFacilityChange = (selectedValues: string[]) => {
    const initialFacilities =
      formProps.initialValues?.facilities?.map((facility: any) => facility.facilityId) || [];
    const removedFacilities = initialFacilities.filter(
      (id: string) => !selectedValues.includes(id),
    );
    const addedFacilities = selectedValues.filter((id) => !initialFacilities.includes(id));

    setFacilityAdded(addedFacilities);
    setFacilityRemoved(removedFacilities);
  };

  const handleOnFinish = async (values: any) => {
    const formData = {
      name: values.name,
      capacity: values.capacity,
      facilityAdded: facilityAdded,
      facilityRemoved: facilityRemoved,
    };

    formProps.onFinish?.(formData);
  };

  return (
    <Form {...formProps} form={form} layout="vertical" onFinish={handleOnFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Studio name is required" }]}
      >
        <Input placeholder="Studio Name" />
      </Form.Item>

      <Form.Item
        label="Capacity"
        name="capacity"
        rules={[{ required: true, message: "Capacity is required" }]}
      >
        <InputNumber placeholder="Capacity" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Facility"
        name="facilityIds"
        rules={[{ required: true, message: "Min 1 facility must be selected" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select facility"
          options={facilitiesOptions}
          onChange={handleFacilityChange}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
