"use client";

import { useFilter } from "@/hooks/datatable/use-filter";
import { TPaginationResponse } from "@/types/meta";
import { Film } from "@prisma/client";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Flex, message } from "antd";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { Guard } from "@/app/_components/guard";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { DataTable, Page } from "admiral";
import Link from "next/link";
import { makePagination, makeSource } from "@/utils/datatable";
import { trpc } from "@/libs/trpc";
import { deleteFilmAction } from "@/server/film/actions/film.action";

const FilmsPage = () => {
  const { filters, pagination, handleChange } = useFilter();
  const [localData, setLocalData] = useState<TPaginationResponse<Film[]>>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = trpc.film.getFilms.useQuery({
    ...makePagination(pagination),
    search: filters.search,
  });

  useEffect(() => {
    if (data) setLocalData(data as TPaginationResponse<Film[]>);
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setLocalData((prev) => ({
        ...prev!,
        data: prev?.data.filter((genre) => genre.id !== id) ?? [],
      }));

      await deleteFilmAction(id);
      message.success("Film deleted successfully");
    } catch (error) {
      message.error("Failed to delete film");
    } finally {
      setDeletingId(null);
    }
  };

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
        const isDeleting = deletingId === record.id;
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
                disabled={isDeleting}
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
        loading={isLoading}
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
