"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormSchedule } from "../_components/form-schedule";

const CreateSchedulePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Schedules",
      path: "/schedules",
    },
    {
      label: "Create Schedule",
      path: "/schedules/create",
    },
  ];

  // Mock function to simulate API call
  const createSchedule = async (data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, data: data });
        } else {
          reject(new Error("Simulated error: Unable to create schedule."));
        }
      }, 1000); // Simulate a delay
    });
  };

  const handleOnFinish = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await createSchedule(data);
      message.success("Schedule created successfully!");
      console.log("Response:", response);
      router.push("/schedules");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Add Schedule" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormSchedule formProps={{ onFinish: handleOnFinish }} error={null} loading={isLoading} />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateSchedulePage;
