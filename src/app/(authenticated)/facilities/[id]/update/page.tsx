"use client";

import { Facility } from "@prisma/client";
import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MOCK_FACILITIES } from "../../_dummies/facility-mock-data";
import { FormFacility } from "../../_components/form-facility";

const UpdateUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facility, setFacility] = useState({} as Facility);

  const facilityId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    // Simulate fetching data
    const fetchFacility = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundFacility = MOCK_FACILITIES.data.find((facility) => facility.id === facilityId);
        console.log(foundFacility);
        setFacility(foundFacility as Facility);
      } catch (error) {
        message.error("Failed to fetch facility data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId]);

  // Mock function to simulate API call for updating facility
  const updateFacility = async (data: Facility) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({
            success: true,
            data: {
              id: facilityId,
              name: data.name,
            },
          });
        } else {
          reject(new Error("Simulated error: Unable to update facility."));
        }
      }, 1000);
    });
  };

  const handleOnFinish = async (data: Facility) => {
    setIsSubmitting(true);
    try {
      const response = await updateFacility(data);
      message.success("Facility updated successfully!");
      console.log("Response:", response);
      router.push("/facilities");
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page
      title="Update Facility"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Facility", path: "/facilities" },
      ]}
    >
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFacility
            formProps={{
              onFinish: handleOnFinish,
              initialValues: facility,
              disabled: isLoading,
            }}
            error={null}
            loading={isSubmitting}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateUserPage;
