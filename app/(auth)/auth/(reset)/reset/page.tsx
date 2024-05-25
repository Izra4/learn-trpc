"use server";
import { NextPage } from "next";
import { ReactElement } from "react";
import { ResetFormModule } from "../_modules";

const AuthResetPage: NextPage = (): ReactElement => {
  return <ResetFormModule />;
};

export default AuthResetPage;
