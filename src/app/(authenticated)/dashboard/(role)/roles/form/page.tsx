import { PageProps } from "@/types/app";
import { getRoleAction } from "@/server/role/actions/get-role";
import { DashboardCreateRolesModule } from "../../_components/form";

const DashboardCreateRolesPage = async (props: PageProps) => {
  const roleId = props.searchParams.id?.toString() ?? "";
  const data = await getRoleAction(roleId);
  return <DashboardCreateRolesModule data={data?.success?.data} roleId={roleId} />;
};

export default DashboardCreateRolesPage;
