"use client";

import { Page, Section } from "admiral";
import { Descriptions } from "antd";
import { useParams } from "next/navigation";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";

const DetailGenrePage = () => {
  const params = useParams();
  const genreId = typeof params.id === "string" ? params.id : "";
  const genreQuery = trpc.genre.getGenre.useQuery(genreId);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Genre", path: "/genres" },
    { label: genreQuery.data?.name ?? "", path: `/genres/${genreQuery.data?.id}` },
  ];

  return (
    <Page title="Detail Genre" breadcrumbs={breadcrumbs}>
      <Section loading={genreQuery.isLoading} title="Detail Genre">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Genre Id">
            {genreQuery.data?.id}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Genre Name">
            {genreQuery.data?.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {formatDate(genreQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {formatDate(genreQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailGenrePage;
