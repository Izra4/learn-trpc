"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { FormFacility } from "../_components/form-facility";
import { useRouter } from "next/navigation";
import { trpc } from "@/libs/trpc";
import { transformTRPCError } from "@/utils/error";
import { TCreateOrUpdateFacilityValidation } from "@/server/facility/validations/facility.validation";

const CreateFacilityPage = () => {
  const router = useRouter();

  const breadcrumb = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Facility", path: "/facility" },
  ];

  const createFacilityMutation = trpc.facility.createFacility.useMutation({
    onSuccess: () => {
      router.refresh();
      message.success("Facility created successfully!");
      router.push("/facilities");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateFacilityValidation) =>
    createFacilityMutation.mutate(data);

  return (
    <Page title="Add Facility" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFacility
            formProps={{ onFinish: handleOnFinish }}
            error={transformTRPCError(createFacilityMutation.error)}
            loading={createFacilityMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateFacilityPage;
