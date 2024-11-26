"use client";
import { Guard } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { Button, Flex } from "antd";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { TPaginationResponse } from "@/types/meta";
import { useFilter } from "@/hooks/datatable/use-filter";
import { useEffect, useState } from "react";
import { DataTable, Page } from "admiral";
import { makeSource } from "@/utils/datatable";
import { FilmSchedule } from "@prisma/client";
import { useFetchScheduleByStudioId } from "../../_hooks/mock-use-fetch-schedule-by-studio-id";
import { useParams } from "next/navigation";
import { useDeleteSchedule } from "../../_hooks/mock-use-delete-schedule";
import { MOCK_FILMS } from "@/app/(authenticated)/films/_dummies/mock-film-data";
import { MOCK_STUDIOS } from "@/app/(authenticated)/studios/_dummies/studio-mock-data";

const SchedulesPage = () => {
  const params = useParams();
  const studioId = String(params.studioId);
  const studioName = MOCK_STUDIOS.data.find((studio) => studio.id == studioId)?.name;
  const { filters, pagination, handleChange } = useFilter();

  // Mock Fetch studio hook
  const { data, isLoading } = useFetchScheduleByStudioId(studioId, filters, pagination);
  const [localData, setLocalData] = useState<TPaginationResponse<FilmSchedule[]> | null>(data);

  useEffect(() => {
    setLocalData(data); // Sync local data when fetched data changes
  }, [data]);

  // Mock Delete studio hook
  const { handleDelete, isDeleting } = useDeleteSchedule(setLocalData);

  const columns: ColumnsType<FilmSchedule> = [
    {
      dataIndex: "filmId",
      key: "filmId",
      title: "Film",
      render: (_, record) => {
        const film = MOCK_FILMS.data.find((film) => film.id == record.filmId);
        return film?.title;
      },
    },
    {
      dataIndex: "showTime",
      key: "showTime",
      title: "Show Time",
      render: (_, record) => {
        const date = new Date(record.showTime);

        const options = {
          weekday: "long" as const,
          day: "2-digit" as const,
          month: "short" as const,
          year: "numeric" as const,
          hour: "2-digit" as const,
          minute: "2-digit" as const,
          timeZone: "UTC",
        };

        return date.toLocaleDateString("en-US", options);
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Guard permissions={[PERMISSIONS.SCHEDULE_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.SCHEDULE_UPDATE]}>
              <Button
                href={`/schedules/studio/${studioId}/update/${record?.id}`}
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
    {
      label: "Schedules",
      path: "/schedules",
    },
  ];

  return (
    <Page title={`Schedules - ${studioName}`} breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData as TPaginationResponse<FilmSchedule[]>)}
        columns={columns}
        loading={isLoading || isDeleting}
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
