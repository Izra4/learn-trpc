"use client";
import { Guard } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { Button, Flex, message, Spin } from "antd";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { useFilter } from "@/hooks/datatable/use-filter";
import { DataTable, Page } from "admiral";
import { makePagination, makeSource } from "@/utils/datatable";
import { Genre } from "@prisma/client";
import { trpc } from "@/libs/trpc";
import { deleteGenreAction } from "@/server/genre/actions/genre.action";
import { useEffect, useState } from "react";
import { TPaginationResponse } from "@/types/meta";
import { formatDate } from "@/utils/formating-date";

const GenresPage = () => {
  const { filters, pagination, handleChange } = useFilter();
  const [localData, setLocalData] = useState<TPaginationResponse<Genre[]>>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = trpc.genre.getGenres.useQuery({
    ...makePagination(pagination),
    search: filters.search,
  });

  useEffect(() => {
    if (data) setLocalData(data as TPaginationResponse<Genre[]>);
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setLocalData((prev) => ({
        ...prev!,
        data: prev?.data.filter((genre) => genre.id !== id) ?? [],
      }));

      await deleteGenreAction(id);
      message.success("Genre deleted successfully");
    } catch (error) {
      message.error("Failed to delete genre");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Genre> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Genre",
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
            <Guard permissions={[PERMISSIONS.GENRE_READ]}>
              <Button
                href={`/genres/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.GENRE_DELETE]}>
              <Button
                icon={
                  isDeleting ? <Spin size="small" /> : <DeleteOutlined style={{ color: "red" }} />
                }
                type="link"
                onClick={() => handleDelete(record.id)}
                disabled={isDeleting}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.GENRE_DETAIL]}>
              <Button href={`/genres/${record?.id}/update`} type="link" icon={<EditOutlined />} />
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
      label: "Genres",
      path: "/genre",
    },
  ];

  return (
    <Page title="Genres" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        source={makeSource(localData)} // Gunakan localData
        columns={columns}
        loading={isLoading}
        search={filters.search}
      />
    </Page>
  );
};

export default GenresPage;

const TopAction = () => (
  <Guard permissions={[PERMISSIONS.GENRE_CREATE]}>
    <Link href="/genres/create">
      <Button icon={<PlusCircleOutlined />}>Add Genre</Button>
    </Link>
  </Guard>
);
