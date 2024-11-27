"use client";
import { Button, Form, Input, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import { CustomException } from "@/types/cutom-exception";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { useFormErrorHandling } from "@/hooks/form/use-form-error-handling";
import { Permission } from "@prisma/client/index";
import { trpc } from "@/libs/trpc";

type Props = {
  formProps: FormProps;
  loading: boolean;
  isUpdate?: boolean;
  error: CustomException | null;
};

export const FormRole: FC<Props> = ({ formProps, loading, error, isUpdate }) => {
  const [form] = Form.useForm();
  useFormErrorHandling(form, error);

  const permissionOptions = Object.values(PERMISSIONS).map((value) => ({
    value: value,
    label: value,
  }));

  useEffect(() => {
    if (formProps.initialValues) {
      const defaultPermissions =
        formProps.initialValues.rolePermissions?.map(
          (rolePermission: { permission: { name: string; id: string } }) => ({
            name: rolePermission.permission.name,
            id: rolePermission.permission.id,
          }),
        ) || [];

      form.setFieldsValue({
        ...formProps.initialValues,
        permissions: defaultPermissions.map((p: Permission) => p.name),
        permissionIds: defaultPermissions.map((p: Permission) => p.id),
      });
    }
  }, [formProps.initialValues, form]);

  const handlePermissionChange = (selectedValues: string[]) => {
    const selectedIds = selectedValues.map((name) => {
      const permission = permissionOptions.find((option) => option.value === name);
      return permission ? permission.value : name;
    });
    form.setFieldValue("permissionIds", selectedIds);
  };

  return (
    <Form
      {...formProps}
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const formData = {
          ...values,
          permissionIds: form.getFieldValue("permissionIds"),
        };
        console.log("formData", formData);
        formProps.onFinish?.(formData);
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Nama wajib diisi" }]}>
        <Input placeholder="Admin" />
      </Form.Item>

      <Form.Item
        label="Permission"
        name="permissions"
        rules={[{ required: true, message: "Minimal satu permission harus dipilih" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select permissions"
          options={permissionOptions}
          onChange={handlePermissionChange}
        />
      </Form.Item>

      {/* Hidden form item to store permissionIds */}
      <Form.Item name="permissionIds" hidden>
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
