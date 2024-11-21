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
import { Facility } from "@prisma/client";
import { useFetchFacilities } from "./_hooks/mock-use-fetch-facilities";
import { useDeleteFacility } from "./_hooks/mock-use-delete-facilities";

const FasilityPage = () => {
  const { filters, pagination, handleChange } = useFilter();

  // Mock Fetch facilities hook
  const { data, isLoading } = useFetchFacilities(filters, pagination);
  const [localData, setLocalData] = useState<TPaginationResponse<Facility[]> | null>(data);

  useEffect(() => {
    setLocalData(data); // Sync local data when fetched data changes
  }, [data]);

  // Mock Delete facility hook
  const { handleDelete, isDeleting } = useDeleteFacility(setLocalData);

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
        loading={isLoading || isDeleting}
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
