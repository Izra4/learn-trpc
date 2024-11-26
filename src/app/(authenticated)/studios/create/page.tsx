"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { FormStudio } from "../_components/form-studio";
import { useRouter } from "next/navigation";
import { trpc } from "@/libs/trpc";
import { TCreateOrUpdateStudioValidation } from "@/server/studio/validations/studio.validation";
import { transformTRPCError } from "@/utils/error";

const CreateStudioPage = () => {
  const router = useRouter();

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Studios",
      path: "/studios",
    },
    {
      label: "Create Studio",
      path: "/studios/create",
    },
  ];

  const createStudioMutation = trpc.studio.createStudio.useMutation({
    onSuccess: () => {
      router.refresh();
      message.success("Studio created successfully!");
      router.push("/studios");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateStudioValidation) =>
    createStudioMutation.mutate(data);

  return (
    <Page title="Add Studio" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormStudio
            formProps={{ onFinish: handleOnFinish }}
            error={transformTRPCError(createStudioMutation.error)}
            loading={createStudioMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateStudioPage;
