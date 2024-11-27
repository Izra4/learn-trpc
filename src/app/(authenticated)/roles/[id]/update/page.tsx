"use client";

import { FormRole } from "../../_components/form-roles";
import { Col, Row } from "antd";
import { Page } from "admiral";
import { useParams } from "next/navigation";
import { useRoleQuery } from "../_hooks/use-role-query";
import { useUpdateRoleMutation } from "./_hooks/use-update-role-mutation";
import { TCreateOrUpdateRoleValidation } from "@/server/role/validations/create-or-update-role.validation";

const UpdateRolePage = () => {
  const params = useParams();
  const roleId = params.id.toString() ?? "";

  const updateRoleMutation = useUpdateRoleMutation();

  const { data } = useRoleQuery(roleId);

  const handleOnFinish = async (value: TCreateOrUpdateRoleValidation) => {
    return updateRoleMutation.mutate({
      value,
      id: roleId,
    });
  };

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Roles",
      path: "/Roles",
    },
  ];

  return (
    <Page title="Update Role" breadcrumbs={breadcrumbs}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormRole
            isUpdate={true}
            formProps={{ initialValues: data, onFinish: handleOnFinish }}
            error={updateRoleMutation.error}
            loading={updateRoleMutation.isLoading}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default UpdateRolePage;
