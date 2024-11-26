"use client";

import { Col, Row } from "antd";
import { Page } from "admiral";
import { useParams } from "next/navigation";
import { FormStudio } from "../../_components/form-studio";
import { TCreateOrUpdateStudioValidation } from "@/server/studio/validations/studio.validation";
import { transformTRPCError } from "@/utils/error";
import { useStudioQuery } from "../_hooks/use-studio-query";
import { useUpdateStudioMutation } from "./_hooks/use-update-studio-mutation";

const UpdateStudioPage = () => {
  const params = useParams();
  const studioId = params.id.toString() ?? "";

  const updateStudioMutation = useUpdateStudioMutation();

  const { data, isLoading } = useStudioQuery(studioId);

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

  const handleOnFinish = async (values: TCreateOrUpdateStudioValidation) => {
    return updateStudioMutation.mutate({ value: values, id: studioId });
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
            error={transformTRPCError(updateStudioMutation.error)}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateStudioPage;
