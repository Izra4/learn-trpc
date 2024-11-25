"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MOCK_FILMS } from "../../_dummies/mock-film-data";
import { Film } from "@prisma/client";
import { FormFilm } from "../../_components/form-film";

const UpdateFilmPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [film, setFilm] = useState<Film>({} as Film);

  const filmId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    // Simulate fetching data
    const fetchFilm = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundFilm = MOCK_FILMS.data.find((film) => film.id === filmId);
        setFilm(foundFilm as Film);
      } catch (error) {
        message.error("Failed to fetch film data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);

  // Mock function to simulate API call for updating film
  const updateFilm = async (data: Film) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({
            success: true,
            data: { data },
          });
        } else {
          reject(new Error("Simulated error: Unable to update film."));
        }
      }, 1000);
    });
  };

  const handleOnFinish = async (data: Film) => {
    setIsSubmitting(true);
    try {
      const response = await updateFilm(data);
      message.success("Film updated successfully!");
      console.log("Response:", response);
      router.push("/films");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page
      title="Update Film"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Films", path: "/films" },
      ]}
    >
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFilm
            formProps={{
              onFinish: handleOnFinish,
              initialValues: film,
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

export default UpdateFilmPage;
