"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormSchedule } from "../_components/form-schedule";
import { trpc } from "@/libs/trpc";
import { TCreateOrUpdateScheduleSchema } from "@/server/schedule/validations/schedule.validation";
import { transformTRPCError } from "@/utils/error";

const CreateSchedulePage = () => {
  const router = useRouter();

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

  const createScheduleMutation = trpc.schedule.createSchedule.useMutation({
    onSuccess: () => {
      router.refresh();
      message.success("Schedule created successfully!");
      router.push("/schedules");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateScheduleSchema) => {
    createScheduleMutation.mutate(data);
  };

  return (
    <Page title="Add Schedule" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormSchedule
            formProps={{ onFinish: handleOnFinish }}
            error={transformTRPCError(createScheduleMutation.error)}
            loading={createScheduleMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateSchedulePage;
