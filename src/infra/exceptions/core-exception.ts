export class CoreException extends Error {
  constructor(
    public httpCode: number,
    public name: string,
    public message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, Object.getPrototypeOf(this));
  }
}
