import path from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "node:fs";

export const uploadFileToServer = async (file: File): Promise<string> => {
  const fileExtension = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExtension}`;
  const uploadDir = path.resolve(__dirname, "../../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, fileName);

  const buffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  return `/uploads/${fileName}`;
};
