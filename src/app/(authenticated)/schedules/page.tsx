// "use client";
// import { Guard } from "@/app/_components/guard";
// import { PERMISSIONS } from "@/common/enums/permissions.enum";
// import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

// import { Button, Flex } from "antd";
// import Link from "next/link";
// import { ColumnsType } from "antd/es/table";
// import { TPaginationResponse } from "@/types/meta";
// import { useFilter } from "@/hooks/datatable/use-filter";
// import { useEffect, useState } from "react";
// import { DataTable, Page } from "admiral";
// import { makeSource } from "@/utils/datatable";
// import { Studio } from "@prisma/client";
// import { useFetchStudios } from "../studios/_hooks/mock-use-fetch-studios";

// const ScheduleStudioPage = () => {
//   const { filters, pagination, handleChange } = useFilter();

//   // Mock Fetch studio hook
//   const { data, isLoading } = useFetchStudios(filters, pagination);
//   const [localData, setLocalData] = useState<TPaginationResponse<Studio[]> | null>(data);

//   useEffect(() => {
//     setLocalData(data); // Sync local data when fetched data changes
//   }, [data]);

//   const columns: ColumnsType<Studio> = [
//     {
//       dataIndex: "name",
//       key: "name",
//       title: "Studio Name",
//     },
//     {
//       dataIndex: "Action",
//       title: "Action",
//       key: "Action",
//       render: (_, record) => {
//         return (
//           <Flex>
//             <Guard permissions={[PERMISSIONS.SCHEDULE_READ]}>
//               <Button
//                 href={`/schedules/studio/${record?.id}`}
//                 type="link"
//                 icon={<EyeOutlined style={{ color: "green" }} />}
//               />
//             </Guard>
//           </Flex>
//         );
//       },
//     },
//   ];

//   const breadcrumbs = [
//     {
//       label: "Dashboard",
//       path: "/dashboard",
//     },
//     {
//       label: "Studio",
//       path: "/studios",
//     },
//   ];

//   return (
//     <Page title="Studios" breadcrumbs={breadcrumbs} topActions={<TopAction />}>
//       <DataTable
//         onChange={handleChange}
//         rowKey="id"
//         showRowSelection={false}
//         source={makeSource(localData as TPaginationResponse<Studio[]>)}
//         columns={columns}
//         loading={isLoading}
//         search={filters.search}
//       />
//     </Page>
//   );
// };

// export default ScheduleStudioPage;

// const TopAction = () => (
//   <Guard permissions={[PERMISSIONS.STUDIO_CREATE]}>
//     <Link href="/schedules/create">
//       <Button icon={<PlusCircleOutlined />}>Add Studio</Button>
//     </Link>
//   </Guard>
// );
