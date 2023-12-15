import { CoreException } from "./core-exception";

export class NotFoundException extends CoreException {
  private static readonly NAME = "not_found_exception";

  constructor(message: string) {
    super(404, NotFoundException.NAME, message);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  static of(message: string) {
    return new this(message);
  }
}
