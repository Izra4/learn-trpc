"use client";

import { Page, Section } from "admiral";
import { useParams } from "next/navigation";
import { Descriptions } from "antd";
import { useEffect, useState } from "react";
import { Facility, Studio } from "@prisma/client";
import { MOCK_STUDIOS } from "../_dummies/studio-mock-data";
import { MOCK_FACILITY_STUDIO } from "../_dummies/studio-facility-mock-data";
import { MOCK_FACILITIES } from "../../facilities/_dummies/facility-mock-data";

const StudioPage = () => {
  const params = useParams();
  const studioId = typeof params.id === "string" ? params.id : "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchStudioData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        // Find studio by ID
        const foundStudio = MOCK_STUDIOS.data.find((item) => item.id === studioId) as Studio | null;
        setStudio(foundStudio);

        // Find facilities for the studio
        const foundFacilityStudios = MOCK_FACILITY_STUDIO.data.filter(
          (item) => item.studioId === studioId,
        );

        const facilities = MOCK_FACILITIES.data.filter((facility) =>
          foundFacilityStudios.some((studioFacility) =>
            studioFacility.facilityIds.includes(facility.id),
          ),
        );

        setFacilities(facilities);
      } catch (error) {
        console.error("Error fetching studio or facilities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudioData();
  }, [studioId]);

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Studio", path: "/studios" },
    { label: studio ? studio.name : "", path: `/studios/${studioId}` },
  ];

  return (
    <Page title="Detail Studio" breadcrumbs={breadcrumbs}>
      <Section loading={isLoading} title="Detail Studio">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Studio Name">
            {studio?.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Facilities">
            {facilities.map((facility) => (
              <div key={facility.id}>{facility.name}</div>
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default StudioPage;
