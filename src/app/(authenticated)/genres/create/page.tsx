"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { FormGenre } from "../_components/form-genre";
import { trpc } from "@/libs/trpc";
import { useRouter } from "next/navigation";
import { TCreateOrUpdateGenreValidation } from "@/server/genre/validation/genre.validation";
import { transformTRPCError } from "@/utils/error";

const CreateGenrePage = () => {
  const router = useRouter();

  const breadcrumb = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Genres", path: "/genres" },
  ];

  const createGenreMutation = trpc.genre.createGenre.useMutation({
    onSuccess: () => {
      router.refresh();
      message.success("Genre created successfully!");
      router.push("/genres");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateGenreValidation) => createGenreMutation.mutate(data);

  return (
    <Page title="Add Genre" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormGenre
            formProps={{ onFinish: handleOnFinish }}
            error={transformTRPCError(createGenreMutation.error)}
            loading={createGenreMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateGenrePage;
