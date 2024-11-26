"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { MainLayout as Layout } from "admiral";
import { TBreadcrumbsItem } from "admiral/breadcrumb";
import {
  BuildOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  DashboardOutlined,
  HolderOutlined,
  PieChartFilled,
  TagOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { Session } from "next-auth";
import { hasCommonElements } from "@/utils/type";
import Image from "next/image";
import { Flex, Grid, Typography } from "antd";
import UserProfile from "./user-profile";

export type TMainLayoutProps = {
  title?: string;
  children: React.ReactNode;
  breadcrumbs?: TBreadcrumbsItem[];
  topActions?: React.ReactNode;
  session?: Session | null;
};

const NavbarMenu = [
  {
    key: "/dashboard",
    label: <Link href="/dashboard">Dashboard</Link>,
    icon: <DashboardOutlined />,
    permissions: [PERMISSIONS.DASHBOARD],
  },
  {
    key: "/users",
    label: <Link href="/users">Users</Link>,
    icon: <UserOutlined />,
    permissions: [PERMISSIONS.USER_READ],
  },
  {
    key: "/roles",
    label: <Link href="/roles">Roles</Link>,
    icon: <PieChartFilled />,
    permissions: [PERMISSIONS.ROLE_READ],
  },
  {
    key: "/genres",
    label: <Link href="/genres">Genres</Link>,
    icon: <HolderOutlined />,
    permissions: [PERMISSIONS.GENRE_READ],
  },
  {
    key: "/facilities",
    label: <Link href="/facilities">Facilities</Link>,
    icon: <BuildOutlined />,
    permissions: [PERMISSIONS.FACILITY_READ],
  },
  {
    key: "/studios",
    label: <Link href="/studios">Studios</Link>,
    icon: <CoffeeOutlined />,
    permissions: [PERMISSIONS.STUDIO_READ],
  },
  {
    key: "/films",
    label: <Link href="/films">Films</Link>,
    icon: <VideoCameraOutlined />,
    permissions: [PERMISSIONS.FILM_READ],
  },
  {
    key: "/schedules",
    label: <Link href="/schedules">Schedules</Link>,
    icon: <CalendarOutlined />,
    permissions: [PERMISSIONS.SCHEDULE_READ],
  },
];

export const MainLayout: React.FC<TMainLayoutProps> = ({ children, session }) => {
  const router = usePathname();

  const userPermissions = useMemo(
    () => session?.user?.role?.permissions || [],
    [session?.user?.role?.permissions],
  );

  const filteredNavbarMenu = useMemo(() => {
    return NavbarMenu.filter((item) => hasCommonElements(item.permissions, userPermissions));
  }, [userPermissions]);

  const activeMenuKey = useMemo(() => {
    const pathParts = router.split("/");
    if (pathParts.length < 3) {
      return router;
    }

    const [, topLevel, subLevel] = pathParts;
    const activeMenuKey = `/${topLevel}/${subLevel}`;
    return activeMenuKey;
  }, [router]);

  const defaultOpenedKey = useMemo(() => {
    if (!filteredNavbarMenu) return undefined;
    let commonPart = activeMenuKey.split("/");

    filteredNavbarMenu.forEach((item) => {
      if (item && "key" in item && typeof item.key === "string" && item.key) {
        const parts = (item.key as string).split("/");
        let i = 0;
        while (i < commonPart.length && i < parts.length && commonPart[i] === parts[i]) {
          i++;
        }
        commonPart = commonPart.slice(i);
      }
    });
    return commonPart || undefined;
  }, [activeMenuKey, filteredNavbarMenu]);

  const { md } = Grid.useBreakpoint();

  return (
    <Layout
      header={{
        brandLogo: (
          <Flex align="center" gap={8}>
            <Image src="/logo.svg" width={30} height={30} priority alt="" />
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: md ? "white" : "black", whiteSpace: "nowrap" }}
            >
              Ant Design
            </Typography.Title>
          </Flex>
        ),
      }}
      sidebar={{
        width: 250,
        defaultSelectedKeys: [activeMenuKey],
        defaultOpenKeys: [`/${defaultOpenedKey && defaultOpenedKey[0]}`],
        menu: filteredNavbarMenu,
        theme: "light",
        extra: <UserProfile />,
      }}
    >
      {children}
    </Layout>
  );
};
