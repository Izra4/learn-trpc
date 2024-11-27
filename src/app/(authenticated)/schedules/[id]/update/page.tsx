"use client";

import { Col, Row } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Page } from "admiral";
import { useParams } from "next/navigation";
import { FormSchedule } from "@/app/(authenticated)/schedules/_components/form-schedule";
import { useUpdateScheduleMutation } from "./_hooks/use-update-schedule-mutation";
import { useScheduleQuery } from "../_hooks/use-schedule-query";
import { TCreateOrUpdateScheduleSchema } from "@/server/schedule/validations/schedule.validation";
import { transformTRPCError } from "@/utils/error";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateSchedules = () => {
  const params = useParams();
  const scheduleId = String(params.id);

  const updateScheduleMutation = useUpdateScheduleMutation();

  const { data, isLoading } = useScheduleQuery(scheduleId);

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

  const handleOnFinish = async (values: TCreateOrUpdateScheduleSchema) => {
    return updateScheduleMutation.mutate({ value: values, id: scheduleId });
  };

  return (
    <Page title="Update Schedule" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormSchedule
            isUpdate
            formProps={{
              initialValues: data,
              onFinish: handleOnFinish,
            }}
            error={transformTRPCError(updateScheduleMutation.error)}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateSchedules;
