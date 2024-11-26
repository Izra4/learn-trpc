"use client";

import { Page } from "admiral";
import { Col, message, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { FormGenre } from "../../_components/form-genre";
import { trpc } from "@/libs/trpc";
import { TCreateOrUpdateGenreValidation } from "@/server/genre/validation/genre.validation";

const UpdateUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const genreId = typeof params.id === "string" ? params.id : "";

  const genreQuery = trpc.genre.getGenre.useQuery(genreId);
  const updateGenreMutation = trpc.genre.updateGenre.useMutation({
    onSuccess: () => {
      message.success("Genre updated successfully!");
      router.push("/genres");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateGenreValidation) => {
    updateGenreMutation.mutate({ value: data, id: genreId });
  };

  const breadcrumbs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Genre", path: "/genres" },
    { label: "Update Genre", path: `/genres/${genreId}/update` },
  ];

  return (
    <Page title="Update Genre" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormGenre
            formProps={{
              onFinish: handleOnFinish,
              initialValues: genreQuery.data,
              disabled: genreQuery.isLoading,
            }}
            error={null}
            loading={genreQuery.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateUserPage;
