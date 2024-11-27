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
import { FilmSchedule } from "@prisma/client";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";
import { deleteScheduleByIdAction } from "@/server/schedule/actions/schedule.action";

const SchedulesPage = () => {
  const { filters, pagination, handleChange } = useFilter();
  const [localData, setLocalData] = useState<TPaginationResponse<FilmSchedule[]>>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = trpc.schedule.getSchedules.useQuery({
    ...makePagination(pagination),
    search: filters.search,
  });

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setLocalData((prev) => ({
        ...prev!,
        data: prev?.data.filter((genre) => genre.id !== id) ?? [],
      }));

      await deleteScheduleByIdAction(id);
      message.success("Schedule deleted successfully");
    } catch (error) {
      message.error("Failed to delete schedule");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<FilmSchedule> = [
    {
      dataIndex: "showTime",
      key: "showTime",
      title: "Show Time",
      render: (_, record) => {
        return formatDate(record.showTime);
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
            <Guard permissions={[PERMISSIONS.SCHEDULE_READ]}>
              <Button
                href={`/schedules/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.SCHEDULE_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
                disabled={isDeleting}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.SCHEDULE_UPDATE]}>
              <Button
                href={`/schedules/${record?.id}/update`}
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
      label: "Studio",
      path: "/studios",
    },
  ];

  return (
    <Page title="Studios" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData as TPaginationResponse<FilmSchedule[]>)}
        columns={columns}
        loading={isLoading}
        search={filters.search}
      />
    </Page>
  );
};

export default SchedulesPage;

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.SCHEDULE_CREATE]}>
    <Link href="/schedules/create">
      <Button icon={<PlusCircleOutlined />}>Add Schedule</Button>
    </Link>
  </Guard>
);
