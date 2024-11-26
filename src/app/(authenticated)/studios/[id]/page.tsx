"use client";

import { Page, Section } from "admiral";
import { useParams } from "next/navigation";
import { Descriptions } from "antd";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";

const StudioPage = () => {
  const params = useParams();
  const studioId = typeof params.id === "string" ? params.id : "";
  const studioQuery = trpc.studio.getStudio.useQuery(studioId);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Studio", path: "/studios" },
    { label: studioQuery.data?.name ?? "", path: `/studios/${studioQuery.data?.id}` },
  ];

  return (
    <Page title="Detail Studio" breadcrumbs={breadcrumbs}>
      <Section loading={studioQuery.isLoading} title="Detail Studio">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Studio Id">
            {studioQuery.data?.id}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Studio Name">
            {studioQuery.data?.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Capacity">
            {studioQuery.data?.capacity}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Facilities">
            {studioQuery.data?.facilities.map((facility) => (
              <div key={facility.facility.id} style={{ marginTop: "10px" }}>
                {facility.facility.name}
              </div>
            ))}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {formatDate(studioQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {formatDate(studioQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default StudioPage;
