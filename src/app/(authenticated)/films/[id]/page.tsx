"use client";

import { Page, Section } from "admiral";
import { Descriptions, Image } from "antd";
import { useParams } from "next/navigation";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";

const DetailFilmPage = () => {
  const params = useParams();
  const filmId = typeof params.id === "string" ? params.id : "";
  const filmQuery = trpc.film.getFilm.useQuery(filmId);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Film", path: "/films" },
    { label: filmQuery.data?.title ?? "", path: `/films/${filmId}` },
  ];

  return (
    <Page title="Detail Film" breadcrumbs={breadcrumbs}>
      <Section loading={filmQuery.isLoading} title="Detail Film">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Film Id">
            {filmQuery ? filmQuery?.data?.id : ""}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Title">
            {filmQuery.data?.title}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Duration">
            {filmQuery.data?.duration} min
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Description">
            {filmQuery.data?.description}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Poster">
            <Image
              style={{ maxWidth: "200px" }}
              src={`${process.env.NEXT_PUBLIC_APP_URL}/${filmQuery.data?.poster}`}
              alt="Film poster"
            />
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {formatDate(filmQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {formatDate(filmQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailFilmPage;
