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
import { Facility } from "@prisma/client";
import { trpc } from "@/libs/trpc";
import { deleteFacilityAction } from "@/server/facility/actions/facility.action";
import { formatDate } from "@/utils/formating-date";

const FasilityPage = () => {
  const { filters, pagination, handleChange } = useFilter();
  const [localData, setLocalData] = useState<TPaginationResponse<Facility[]>>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = trpc.facility.getFacilities.useQuery({
    ...makePagination(pagination),
    search: filters.search,
  });

  useEffect(() => {
    if (data) setLocalData(data as TPaginationResponse<Facility[]>);
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setLocalData((prev) => ({
        ...prev!,
        data: prev?.data.filter((genre) => genre.id !== id) ?? [],
      }));

      await deleteFacilityAction(id);
      message.success("Facility deleted successfully");
    } catch (error) {
      message.error("Failed to delete facility");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Facility> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Fasility",
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
            <Guard permissions={[PERMISSIONS.FACILITY_READ]}>
              <Button
                href={`/facilities/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.FACILITY_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
                disabled={isDeleting}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.FACILITY_UPDATE]}>
              <Button
                href={`/facilities/${record?.id}/update`}
                type="link"
                icon={<EditOutlined />}
              />
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
      label: "Facility",
      path: "/facilities",
    },
  ];

  return (
    <Page title="Facility" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData as TPaginationResponse<Facility[]>)}
        columns={columns}
        loading={isLoading}
        search={filters.search}
      />
    </Page>
  );
};

export default FasilityPage;

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.FACILITY_CREATE]}>
    <Link href="/facilities/create">
      <Button icon={<PlusCircleOutlined />}>Add Facility</Button>
    </Link>
  </Guard>
);
