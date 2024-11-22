import { JWT } from "next-auth/jwt";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { ROUTE } from "../constant/route";
import { PERMISSIONS } from "@/common/enums/permissions.enum";
import { hasCommonElements } from "@/utils/type";

const permissionMapper = [
  {
    url: ROUTE.DASHBOARD,
    permissions: [PERMISSIONS.DASHBOARD],
  },
  {
    url: ROUTE.USERS,
    permissions: [PERMISSIONS.USER_READ],
  },
  {
    url: ROUTE.USERS_FORM,
    permissions: [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE],
  },
  {
    url: ROUTE.USERS_DETAIL,
    permissions: [PERMISSIONS.USER_DETAIL],
  },

  {
    url: ROUTE.ROLES,
    permissions: [PERMISSIONS.ROLE_READ],
  },
  {
    url: ROUTE.ROLES_FORM,
    permissions: [PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_UPDATE],
  },
  {
    url: ROUTE.ROLES_DETAIL,
    permissions: [PERMISSIONS.ROLE_DETAIL],
  },
];

export const middlewarePermission = (url: NextURL, session: JWT | null) => {
  const deniedUrl = new URL("/denied", url.origin);
  if (session) {
    const userRole = session?.user?.role;

    const matchingRoute = permissionMapper.find((route) => {
      const routeRegex = new RegExp(`^${route.url.replace(/\/$/, "")}$`);
      const isMatch = routeRegex.test(url.pathname);
      return isMatch;
    });

    if (matchingRoute) {
      const isAuthorized = hasCommonElements(matchingRoute.permissions, userRole?.permissions);
      if (!isAuthorized) {
        return NextResponse.redirect(deniedUrl);
      }
    }
  }

  return NextResponse.next();
};
