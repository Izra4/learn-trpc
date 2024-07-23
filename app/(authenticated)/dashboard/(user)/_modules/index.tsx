"use client";
import type { FC, ReactElement } from "react";
import { User } from "../_actions/get-users";
import { TMetaResponse } from "@/types/meta";
import { Page } from "admiral";
import { Button, Flex, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { deleteUserAction } from "../_actions/delete-user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Datatable from "admiral/table/datatable/index";
import { ColumnsType } from "antd/es/table";
import { makeSource } from "@/utils";

export const DashboardUsersModule: FC<{ data: TMetaResponse<User[]> }> = ({
  data,
}): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns: ColumnsType<User> = [
    {
      dataIndex: "fullname",
      key: "fullname",
      title: "Name",
    },
    {
      dataIndex: "email",
      title: "Email",
      key: "email",
    },
    {
      dataIndex: "createdAt",
      title: "Created At",
      key: "createdAt",
      render: (_, record) => {
        return new Date(record.createdAt as Date).toLocaleString();
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Button
              href={`/dashboard/users/${record?.id}`}
              type="link"
              icon={<EyeOutlined style={{ color: "green" }} />}
            />
            <Button
              icon={<DeleteOutlined style={{ color: "red" }} />}
              type="link"
              onClick={() => {
                deleteUserAction(record?.id as string);
                router.refresh();
                message.success("User berhasil dihapus");
              }}
            />
            <Button
              href={`/dashboard/users/form?id=${record?.id}`}
              type="link"
              icon={<EditOutlined />}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <Page
      title="Users"
      breadcrumbs={[
        {
          label: "Dashboard",
          path: "/dashboard",
        },
        {
          label: "Users",
          path: "/dashboard/users",
        },
      ]}
      topActions={
        <Button href="/dashboard/users/form" icon={<PlusCircleOutlined />}>
          Add Users
        </Button>
      }
    >
      <Datatable
        onChange={(_cf, _st, _dt, paging) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(paging?.page));
          params.set("perPage", String(paging?.per_page));
          router.push(`${pathname}?${params.toString()}`);
        }}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(data)}
        columns={columns}
      />
    </Page>
  );
};
