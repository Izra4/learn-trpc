"use client";

import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { TLoginForm } from "./_entities/schema";
import { useLoginByCredentialsMutation } from "./_hooks/use-login-by-credentials-mutation";

const LoginPage: React.FC = () => {
  const loginByCredentialMutation = useLoginByCredentialsMutation();

  const onFinish: FormProps<TLoginForm>["onFinish"] = async (values) => {
    loginByCredentialMutation.mutate(values);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<TLoginForm>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TLoginForm>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type={"primary"}
          loading={loginByCredentialMutation.isLoading}
          htmlType="submit"
          disabled={loginByCredentialMutation.isLoading}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
