"use client";

import { useFilter } from "@/hooks/datatable/use-filter";
import { useFetchFilms } from "./_hooks/mock-use-fetch-films";
import { TPaginationResponse } from "@/types/meta";
import { Film } from "@prisma/client";
import { useEffect, useState } from "react";
import { useDeleteFilm } from "./_hooks/mock-use-delete-films";
import { ColumnsType } from "antd/es/table";
import { Button, Flex } from "antd";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { Guard } from "@/app/_components/guard";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { DataTable, Page } from "admiral";
import Link from "next/link";
import { makeSource } from "@/utils/datatable";

const FilmsPage = () => {
  const { filters, pagination, handleChange } = useFilter();

  // Mock Fetch films hook
  const { data, isLoading } = useFetchFilms(filters, pagination);
  const [localData, setLocalData] = useState<TPaginationResponse<Film[]> | null>(data);

  useEffect(() => {
    setLocalData(data); // Sync local data when fetched data changes
  }, [data]);

  // Mock delete films hook
  const { handleDelete, isDeleting } = useDeleteFilm(setLocalData);

  const columns: ColumnsType<Film> = [
    {
      dataIndex: "title",
      key: "title",
      title: "Film Title",
    },
    {
      dataIndex: "duration",
      key: "duration",
      title: "Duration",
      render: (_, record) => {
        return `${record.duration} min`;
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Guard permissions={[PERMISSIONS.FILM_READ]}>
              <Button
                href={`/films/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.FILM_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.FILM_UPDATE]}>
              <Button href={`/films/${record?.id}/update`} type="link" icon={<EditOutlined />} />
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
      label: "Films",
      path: "/films",
    },
  ];

  return (
    <Page title="Films" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData as TPaginationResponse<Film[]>)}
        columns={columns}
        loading={isLoading || isDeleting}
        search={filters.search}
      />
    </Page>
  );
};

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.FILM_CREATE]}>
    <Link href="/films/create">
      <Button icon={<PlusCircleOutlined />}>Add Film</Button>
    </Link>
  </Guard>
);

export default FilmsPage;
