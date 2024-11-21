"use client";

import { useState, useEffect } from "react";
import { Page, Section } from "admiral";
import { Descriptions } from "antd";
import { useParams } from "next/navigation";
import { MOCK_GENRES } from "../_dummies/genre-mock-data";
import { Genre } from "@prisma/client";

const DetailGenrePage = () => {
  const params = useParams();
  const genreId = typeof params.id === "string" ? params.id : "";
  const [isLoading, setIsLoading] = useState(true);
  const [genre, setGenre] = useState({} as Genre);

  useEffect(() => {
    // Simulasi loading dan fetching data
    const fetchGenre = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi delay
        const foundGenre = MOCK_GENRES.data.find((item) => item.id === genreId);
        setGenre(foundGenre as Genre);
      } catch (error) {
        console.error("Error fetching genre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenre();
  }, [genreId]);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Genre", path: "/genres" },
    { label: genre ? genre.name : "", path: `/genres/${genreId}` },
  ];

  return (
    <Page title="Detail Genre" breadcrumbs={breadcrumbs}>
      <Section loading={isLoading} title="Detail Genre">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Genre Id">
            {genre ? genre?.id : ""}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Genre Name">
            {genre.name}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailGenrePage;
