"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MOCK_GENRES } from "../../_dummies/genre-mock-data";
import { FormGenre } from "../../_components/form-genre";
import { Genre } from "@prisma/client";

const UpdateUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genre, setGenre] = useState({} as Genre);

  const genreId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    // Simulate fetching data
    const fetchGenre = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundGenre = MOCK_GENRES.data.find((g) => g.id === genreId);
        console.log(foundGenre);
        setGenre(foundGenre as Genre);
      } catch (error) {
        message.error("Failed to fetch genre data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenre();
  }, [genreId]);

  // Mock function to simulate API call for updating genre
  const updateGenre = async (data: Genre) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({
            success: true,
            data: {
              id: genreId,
              name: data.name,
            },
          });
        } else {
          reject(new Error("Simulated error: Unable to update genre."));
        }
      }, 1000);
    });
  };

  const handleOnFinish = async (data: Genre) => {
    setIsSubmitting(true);
    try {
      const response = await updateGenre(data);
      message.success("Genre updated successfully!");
      console.log("Response:", response);
      router.push("/genres");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page
      title="Update Genre"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Users", path: "/Users" },
      ]}
    >
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormGenre
            formProps={{
              onFinish: handleOnFinish,
              initialValues: genre,
              disabled: isLoading,
            }}
            error={null}
            loading={isSubmitting}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateUserPage;
