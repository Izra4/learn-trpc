"use client";
import { Guard } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { Button, Flex, message } from "antd";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { TPaginationResponse } from "@/types/meta";
import { useFilter } from "@/hooks/datatable/use-filter";
import { useEffect, useState } from "react";
import { DataTable, Page } from "admiral";
import { makePagination, makeSource } from "@/utils/datatable";
import { Studio } from "@prisma/client";
import { trpc } from "@/libs/trpc";
import { deleteStudioAction } from "@/server/studio/actions/studio.action";
import { formatDate } from "@/utils/formating-date";

const StudioPage = () => {
  const { filters, pagination, handleChange } = useFilter();
  const [localData, setLocalData] = useState<TPaginationResponse<Studio[]>>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = trpc.studio.getStudios.useQuery({
    ...makePagination(pagination),
    search: filters.search,
  });

  useEffect(() => {
    if (data) setLocalData(data as TPaginationResponse<Studio[]>);
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setLocalData((prev) => ({
        ...prev!,
        data: prev?.data.filter((genre) => genre.id !== id) ?? [],
      }));

      await deleteStudioAction(id);
      message.success("Studio deleted successfully");
    } catch (error) {
      message.error("Failed to delete studio");
    } finally {
      setDeletingId(null);
    }
  };

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
        return formatDate(record.createdAt);
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        const isDeleting = deletingId === record.id;
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
                disabled={isDeleting}
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
        loading={isLoading}
        search={filters.search}
      />
    </Page>
  );
};

export default StudioPage;

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.STUDIO_CREATE]}>
    <Link href="/studios/create">
      <Button icon={<PlusCircleOutlined />}>Add Studio</Button>
    </Link>
  </Guard>
);
