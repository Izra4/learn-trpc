"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { FormFacility } from "../_components/form-facility";
import { TFacilityCreateOrUpdateValidation } from "../_validation/facility-create-or-update.validation";
import { useRouter } from "next/navigation";

const CreateFacilityPage = () => {
  const router = useRouter();
  const breadcrumb = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Facility", path: "/facility" },
  ];

  // Mock function to simulate API call
  const createFacility = async (data: TFacilityCreateOrUpdateValidation) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error("Simulated error: Unable to create facility."));
        }
      }, 1000); // Simulate a delay
    });
  };

  const handleOnFinish = async (data: TFacilityCreateOrUpdateValidation) => {
    try {
      const response = await createFacility(data);
      message.success("Facility created successfully!");
      console.log("Response:", response);
      router.push("/facilities");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    }
  };

  return (
    <Page title="Add Facility" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFacility
            formProps={{ onFinish: handleOnFinish }}
            error={null} // Since there's no backend, no error state to pass
            loading={false} // Replace with actual loading state if needed
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateFacilityPage;
