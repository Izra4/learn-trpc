"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { FormFacility } from "../../_components/form-facility";
import { trpc } from "@/libs/trpc";
import { TCreateOrUpdateFacilityValidation } from "@/server/facility/validations/facility.validation";

const UpdateFacilityPage = () => {
  const params = useParams();
  const router = useRouter();
  const facilityId = typeof params.id === "string" ? params.id : "";

  const facilityQuery = trpc.facility.getFacility.useQuery(facilityId);
  const updateFacilityMutation = trpc.facility.updateFacility.useMutation({
    onSuccess: () => {
      message.success("Facility updated successfully!");
      router.push("/facilities");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateFacilityValidation) => {
    updateFacilityMutation.mutate({ value: data, id: facilityId });
  };

  return (
    <Page
      title="Update Facility"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Facility", path: "/facilities" },
        { label: "Update Facility", path: `/facilities/${facilityId}/update` },
      ]}
    >
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFacility
            formProps={{
              onFinish: handleOnFinish,
              initialValues: facilityQuery.data,
              disabled: facilityQuery.isLoading,
            }}
            error={null}
            loading={facilityQuery.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateFacilityPage;
