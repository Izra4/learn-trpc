"use client";

import { Film } from "@prisma/client";
import { useState, useEffect } from "react";
import { Page, Section } from "admiral";
import { Descriptions, Image } from "antd";
import { useParams } from "next/navigation";
import { MOCK_FILMS } from "../_dummies/mock-film-data";

const DetailFilmPage = () => {
  const params = useParams();
  const filmId = typeof params.id === "string" ? params.id : "";
  const [isLoading, setIsLoading] = useState(true);
  const [film, setFilm] = useState<Film>({} as Film);

  useEffect(() => {
    // Simulasi loading dan fetching data
    const fetchFilm = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi delay
        const foundFilm = MOCK_FILMS.data.find((item) => item.id === filmId);
        setFilm(foundFilm as Film);
      } catch (error) {
        console.error("Error fetching film:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Film", path: "/films" },
    { label: film ? film.title : "", path: `/films/${filmId}` },
  ];

  return (
    <Page title="Detail Film" breadcrumbs={breadcrumbs}>
      <Section loading={isLoading} title="Detail Film">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Film Id">
            {film ? film?.id : ""}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Title">
            {film.title}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Duration">
            {film.duration} min
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Description">
            {film.description}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Poster">
            <Image src={film.poster}></Image>
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {new Date(film.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {new Date(film.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailFilmPage;
