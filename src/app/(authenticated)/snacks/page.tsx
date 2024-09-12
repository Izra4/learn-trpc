"use client";
import Datatable from "admiral/table/datatable/index";
import { FC } from "react";
import { Page } from "admiral";
import { Button, Flex, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnType } from "antd/es/table";
import { makeSource } from "@/utils/index";
import { useFilter } from "@/utils/filter";
import { Snack } from "@/libs/drizzle/schemas/snack.schema";
import { deleteSnackAction } from "@/server/snack/actions/snack.action";
import { useSnacksQuery } from "./_hooks/use-snacks-query";
import Link from "next/link";

const { confirm } = Modal;

const SnacksPage = () => {
  const router = useRouter();
  const { implementDataTable, filter } = useFilter();
  const searchParams = useSearchParams();

  const snacksQuery = useSnacksQuery({
    page: Number(searchParams.get("page") || 1),
    perPage: Number(searchParams.get("perPage") || 10),
    search: String(searchParams.get("search") || ""),
  });

  const columns: ColumnType<Snack>[] = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
    },
    {
      dataIndex: "cost",
      title: "Cost",
      key: "cost",
      render: (_, row) => {
        return `Rp ${row?.cost?.toLocaleString()}`;
      },
    },
    {
      dataIndex: "expiryDate",
      title: "Expiry Date",
      key: "expiryDate",
      render: (_, row) => {
        return new Date(row?.expiryDate as Date).toLocaleString();
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, row) => {
        return (
          <Flex>
            <Button
              href={`/snacks/${row?.id}`}
              type="link"
              icon={<EyeOutlined style={{ color: "green" }} />}
            />
            <Button
              icon={<DeleteOutlined style={{ color: "red" }} />}
              type="link"
              onClick={() => {
                confirm({
                  title: "Are you sure you want to delete this snack?",
                  okText: "Delete",
                  okType: "danger",
                  icon: <DeleteOutlined />,
                  cancelText: "Cancel",
                  onOk() {
                    deleteSnackAction(row?.id as string);
                    router.refresh();
                    message.success("Snack berhasil dihapus");
                  },
                });
              }}
            />
            <Button href={`/snacks/form?id=${row?.id}`} type="link" icon={<EditOutlined />} />
          </Flex>
        );
      },
    },
  ];

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Snacks",
      path: "/snacks",
    },
  ];

  return (
    <Page title="Snacks" breadcrumbs={breadcrumbs} topActions={<TopActions />}>
      <Datatable
        source={makeSource(snacksQuery.data)}
        loading={snacksQuery.isLoading}
        columns={columns}
        onChange={implementDataTable}
        search={filter.search}
      />
    </Page>
  );
};

export default SnacksPage;

const TopActions: FC = () => (
  <Link href="/snacks/create">
    <Button icon={<PlusCircleOutlined />}>Add Snack</Button>
  </Link>
);
