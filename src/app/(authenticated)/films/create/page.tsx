"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { useRouter } from "next/navigation";
import { TFilmCreateOrUpdateValidation } from "../_validation/film-create-or-update.validation";
import { FormFilm } from "../_components/form-film";
import { useState } from "react";

const CreateFilmPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  // Mock function to simulate API call
  const createFilm = async (data: TFilmCreateOrUpdateValidation) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error("Simulated error: Unable to create film."));
        }
      }, 1000); // Simulate a delay
    });
  };

  const handleOnFinish = async (data: TFilmCreateOrUpdateValidation) => {
    try {
      setIsLoading(true);
      const response = await createFilm(data);
      message.success("Film created successfully!");
      console.log("Response:", response);
      router.push("/films");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Add Film" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFilm formProps={{ onFinish: handleOnFinish }} error={null} loading={isLoading} />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateFilmPage;
