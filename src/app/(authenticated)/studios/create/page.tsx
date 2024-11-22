"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { FormStudio } from "../_components/form-studio";
import { TStudioCreateOrUpdateValidation } from "../_validation/studio-create-or-update.validation";
import { useRouter } from "next/navigation";

const CreateStudioPage = () => {
  const router = useRouter();
  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Studios",
      path: "/studios",
    },
  ];

  // Mock function to simulate API call
  const createStudio = async (data: TStudioCreateOrUpdateValidation) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error("Simulated error: Unable to create studio."));
        }
      }, 1000); // Simulate a delay
    });
  };

  const handleOnFinish = async (data: TStudioCreateOrUpdateValidation) => {
    try {
      const response = await createStudio(data);
      message.success("Studio created successfully!");
      console.log("Response:", response);
      router.push("/studios");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    }
  };

  return (
    <Page title="Add Studio" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormStudio
            formProps={{ onFinish: handleOnFinish }}
            error={null} // Since there's no backend, no error state to pass
            loading={false} // Replace with actual loading state if needed
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateStudioPage;
