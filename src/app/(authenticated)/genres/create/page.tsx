"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { TCreateOrUpdateUserValidation } from "@/server/user/validations/create-or-update.validation";
import { FormGenre } from "../_components/form-genre";

const CreateGenrePage = () => {
  const breadcrumb = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Genres", path: "/genres" },
  ];

  // Mock function to simulate API call
  const createGenre = async (data: TCreateOrUpdateUserValidation) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error("Simulated error: Unable to create user."));
        }
      }, 1000); // Simulate a delay
    });
  };

  const handleOnFinish = async (data: TCreateOrUpdateUserValidation) => {
    try {
      const response = await createGenre(data);
      message.success("Genre created successfully!");
      console.log("Response:", response);
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    }
  };

  return (
    <Page title="Add Genre" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormGenre
            formProps={{ onFinish: handleOnFinish }}
            error={null} // Since there's no backend, no error state to pass
            loading={false} // Replace with actual loading state if needed
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateGenrePage;
