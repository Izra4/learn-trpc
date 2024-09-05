import { CustomException, FieldErrorType } from "@/types/cutom-exception";

export class ForbiddenException extends CustomException {
  constructor(message: string, errors?: Array<FieldErrorType>) {
    super(403, message, errors || []);
    this.name = "ForbiddenException";
  }
}

export default ForbiddenException;
