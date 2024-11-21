"use client";

import { useState, useEffect } from "react";
import { Page, Section } from "admiral";
import { Descriptions } from "antd";
import { useParams } from "next/navigation";
import { Facility } from "@prisma/client";
import { MOCK_FACILITIES } from "../_dummies/facility-mock-data";

const DetailFacilityPage = () => {
  const params = useParams();
  const facilityId = typeof params.id === "string" ? params.id : "";
  const [isLoading, setIsLoading] = useState(true);
  const [facility, setFacility] = useState({} as Facility);

  useEffect(() => {
    // Simulasi loading dan fetching data
    const fetchFacility = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi delay
        const foundFacility = MOCK_FACILITIES.data.find((item) => item.id === facilityId);
        setFacility(foundFacility as Facility);
      } catch (error) {
        console.error("Error fetching facility:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId]);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Facility", path: "/facilities" },
    { label: facility ? facility.name : "", path: `/facilities/${facilityId}` },
  ];

  return (
    <Page title="Detail Facility" breadcrumbs={breadcrumbs}>
      <Section loading={isLoading} title="Detail Facility">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Facility Id">
            {facility ? facility?.id : ""}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Facility Name">
            {facility.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At">
            {new Date(facility.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At">
            {new Date(facility.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default DetailFacilityPage;
