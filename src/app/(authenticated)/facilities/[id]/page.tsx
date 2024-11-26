"use client";

import { Page, Section } from "admiral";
import { Descriptions } from "antd";
import { useParams } from "next/navigation";
import { trpc } from "@/libs/trpc";
import { formatDate } from "@/utils/formating-date";

const DetailFacilityPage = () => {
  const params = useParams();
  const facilityId = typeof params.id === "string" ? params.id : "";
  const facilityQuery = trpc.facility.getFacility.useQuery(facilityId);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Facility", path: "/facilities" },
    { label: facilityQuery.data?.name ?? "", path: `/facilities/${facilityQuery.data?.id}` },
  ];

  return (
    <Page title="Detail Facility" breadcrumbs={breadcrumbs}>
      <Section loading={facilityQuery.isLoading} title="Detail Facility">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Facility Id">
            {facilityQuery.data?.id}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Facility Name">
            {facilityQuery.data?.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {formatDate(facilityQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {formatDate(facilityQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailFacilityPage;
