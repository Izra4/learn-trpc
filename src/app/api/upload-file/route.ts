"use server";

import path from "path";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const UPLOAD_DIR = path.resolve("public/uploads");

export const POST = async (req: NextRequest) => {
  console.log("req", req);

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    fs.writeFileSync(path.resolve(UPLOAD_DIR, (body.file as File).name), buffer);
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    path: `uploads/${(body.file as File).name}`,
  });
};
