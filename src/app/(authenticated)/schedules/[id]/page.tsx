"use client";

import { Page, Section } from "admiral";
import { useParams } from "next/navigation";
import { Descriptions } from "antd";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";

const SchedulePage = () => {
  const params = useParams();
  const scheduleId = typeof params.id === "string" ? params.id : "";
  const scheduleQuery = trpc.schedule.getSchedule.useQuery(scheduleId);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Schedule", path: "/schedules" },
  ];

  return (
    <Page title="Detail Schedule" breadcrumbs={breadcrumbs}>
      <Section loading={scheduleQuery.isLoading} title="Detail Studio">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Studio Id">
            {scheduleQuery.data?.id}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Studio Name">
            {scheduleQuery.data?.studio.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Title">
            {scheduleQuery.data?.film.title}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Film Duration">
            {scheduleQuery.data?.film.duration}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Capacity">
            {scheduleQuery.data?.studio.capacity}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {formatDate(scheduleQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {formatDate(scheduleQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default SchedulePage;
