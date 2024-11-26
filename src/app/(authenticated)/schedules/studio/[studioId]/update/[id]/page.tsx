"use client";

import { Col, message, Row } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Page } from "admiral";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FormSchedule } from "@/app/(authenticated)/schedules/_components/form-schedule";
import { useFetchSchedule } from "../_hooks/use-fetch-schedule";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateSchedules = () => {
  const params = useParams();

  const scheduleId = String(params.id);
  const studioId = String(params.studioId);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useFetchSchedule(scheduleId);

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Schedule",
      path: "/schedules",
    },
    {
      label: "Update Schedule",
      path: "/schedules/update",
    },
  ];

  const handleOnFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitted values:", values);
      message.success("Studio updated successfully.");
      router.push(`/schedules/studio/${studioId}`);
    } catch (error) {
      message.error("Failed to update studio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Update Studio" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormSchedule
            isUpdate
            formProps={{
              initialValues: data,
              onFinish: handleOnFinish,
            }}
            error={null}
            loading={isLoading || isSubmitting}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateSchedules;
