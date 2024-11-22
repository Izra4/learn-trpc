"use client";
import { Guard } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { Button, Flex } from "antd";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { TPaginationResponse } from "@/types/meta";
import { useFilter } from "@/hooks/datatable/use-filter";
import { useEffect, useState } from "react";
import { DataTable, Page } from "admiral";
import { makeSource } from "@/utils/datatable";
import { useFetchStudios } from "./_hooks/mock-use-fetch-studios";
import { Studio } from "@prisma/client";
import { useDeleteStudio } from "./_hooks/mock-use-delete-studios";

const FasilityPage = () => {
  const { filters, pagination, handleChange } = useFilter();

  // Mock Fetch studio hook
  const { data, isLoading } = useFetchStudios(filters, pagination);
  const [localData, setLocalData] = useState<TPaginationResponse<Studio[]> | null>(data);

  useEffect(() => {
    setLocalData(data); // Sync local data when fetched data changes
  }, [data]);

  // Mock Delete studio hook
  const { handleDelete, isDeleting } = useDeleteStudio(setLocalData);

  const columns: ColumnsType<Studio> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Studio Name",
    },
    {
      dataIndex: "createdAt",
      title: "Created At",
      key: "createdAt",
      render: (_, record) => {
        return new Date(record.createdAt).toLocaleString();
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Guard permissions={[PERMISSIONS.STUDIO_READ]}>
              <Button
                href={`/studios/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.STUDIO_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.STUDIO_UPDATE]}>
              <Button href={`/studios/${record?.id}/update`} type="link" icon={<EditOutlined />} />
            </Guard>
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
      label: "Studios",
      path: "/studios",
    },
  ];

  return (
    <Page title="Studios" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData as TPaginationResponse<Studio[]>)}
        columns={columns}
        loading={isLoading || isDeleting}
        search={filters.search}
      />
    </Page>
  );
};

export default FasilityPage;

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.STUDIO_CREATE]}>
    <Link href="/studios/create">
      <Button icon={<PlusCircleOutlined />}>Add Studio</Button>
    </Link>
  </Guard>
);
