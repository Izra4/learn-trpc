"use client";

import { Page } from "admiral";
import { Col, Row } from "antd";
import { useParams } from "next/navigation";
import { FormFilm } from "../../_components/form-film";
import { useFilmUpdateMutation } from "./_hooks/use-update-film-mutation";
import { useFilmQuery } from "../_hooks/use-film-query";

const UpdateFilmPage = () => {
  const params = useParams();
  const filmId = typeof params.id === "string" ? params.id : "";

  const updateFilmMutation = useFilmUpdateMutation();

  const { data, isLoading } = useFilmQuery(filmId);

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Films",
      path: "/films",
    },
    {
      label: "Update Film",
      path: `/films/${filmId}/update`,
    },
  ];

  const handleOnFinish = async (values: any) => {
    console.log("values", values);
    return updateFilmMutation.mutate({ id: filmId, data: values });
  };

  return (
    <Page title="Update Film" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFilm
            formProps={{
              onFinish: handleOnFinish,
              initialValues: data,
              disabled: isLoading,
            }}
            error={null}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateFilmPage;
