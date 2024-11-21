"use client";
import { Guard } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { Button, Flex } from "antd";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { TPaginationResponse } from "@/types/meta";
import { useFilter } from "@/hooks/datatable/use-filter";
import { useFetchGenres } from "./_hooks/mock-use-fetch-genre";
import { useDeleteGenre } from "./_hooks/mock-use-delete-genre";
import { useEffect, useState } from "react";
import { DataTable, Page } from "admiral";
import { makeSource } from "@/utils/datatable";
import { Genre } from "@prisma/client";

const GenresPage = () => {
  const { filters, pagination, handleChange } = useFilter();

  // Mock Fetch genres hook
  const { data, isLoading } = useFetchGenres(filters, pagination);
  const [localData, setLocalData] = useState<TPaginationResponse<Genre[]> | null>(data);

  useEffect(() => {
    setLocalData(data); // Sync local data when fetched data changes
  }, [data]);

  // Mock Delete genre hook
  const { handleDelete, isDeleting } = useDeleteGenre(setLocalData);

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
            <Guard permissions={[PERMISSIONS.GENRE_READ]}>
              <Button
                href={`/genres/${record?.id}`}
                type="link"
                icon={<EyeOutlined style={{ color: "green" }} />}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.GENRE_DELETE]}>
              <Button
                icon={<DeleteOutlined style={{ color: "red" }} />}
                type="link"
                onClick={() => handleDelete(record?.id)}
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
        source={makeSource(localData as TPaginationResponse<Genre[]>)}
        columns={columns}
        loading={isLoading || isDeleting}
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
