"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { useParams, useRouter } from "next/navigation";
import { FormStudio } from "../../_components/form-studio";
import { useEffect, useState } from "react";
import { Studio } from "@prisma/client";
import { MOCK_STUDIOS } from "../../_dummies/studio-mock-data";
import { MOCK_FACILITY_STUDIO } from "../../_dummies/studio-facility-mock-data";
import { MOCK_FACILITIES } from "@/app/(authenticated)/facilities/_dummies/facility-mock-data";

const UpdateStudioPage = () => {
  const params = useParams();
  const studioId = String(params.id);
  const router = useRouter();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studio, setStudio] = useState<Studio | null>(null);

  useEffect(() => {
    const fetchStudioFacility = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const foundStudio = MOCK_STUDIOS.data.find((studio) => studio.id === studioId);
        if (!foundStudio) {
          message.error("Studio not found.");
          return;
        }

        const foundStudioFacility = MOCK_FACILITY_STUDIO.data.find(
          (fs) => fs.studioId === foundStudio.id,
        );

        const facilities = foundStudioFacility?.facilityIds
          .map((id) => {
            const facility = MOCK_FACILITIES.data.find((facility) => facility.id === id);
            return facility
              ? {
                  id: facility.id,
                  name: facility.name,
                }
              : null;
          })
          .filter(Boolean);

        const studioFacilityData = {
          studioId: foundStudio.id,
          studioName: foundStudio.name,
          facilities,
        };

        setStudio(foundStudio);
        setData(studioFacilityData);
      } catch (error) {
        message.error("Failed to fetch facility data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudioFacility();
  }, [studioId]);

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Studio",
      path: "/studio",
    },
  ];

  const handleOnFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitted values:", values);
      message.success("Studio updated successfully.");
      router.push("/studios");
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
          <FormStudio
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

export default UpdateStudioPage;
