"use client";

import { Col, message, Row } from "antd";
import { Page } from "admiral";
import { useRouter } from "next/navigation";
import { FormFilm } from "../_components/form-film";
import { trpc } from "@/libs/trpc";
import { transformTRPCError } from "@/utils/error";
import { TCreateOrUpdateFilmValidation } from "@/server/film/validations/film.validation";

const CreateFilmPage = () => {
  const router = useRouter();

  const createFilmMutation = trpc.film.createFilm.useMutation({
    onSuccess: () => {
      router.refresh();
      message.success("Film created successfully!");
      router.push("/films");
    },
    onError: (error) => {
      !error.data?.zodError && message.error(error.message);
    },
  });

  const handleOnFinish = (data: TCreateOrUpdateFilmValidation) => {
    createFilmMutation.mutate(data);
  };

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Films",
      path: "/films",
    },
  ];

  return (
    <Page title="Add Film" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormFilm
            formProps={{ onFinish: handleOnFinish }}
            error={transformTRPCError(createFilmMutation.error)}
            loading={createFilmMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default CreateFilmPage;
