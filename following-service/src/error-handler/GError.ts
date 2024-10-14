interface GErrorConstructor {
  message: string;
  status: number;
  serviceName?: string;
  methodName: string;
  className?: string;
}

class GError extends Error {
  public status: number;
  public methodName: string;
  public serviceName?: string;
  constructor({ message, status, serviceName, methodName }: GErrorConstructor) {
    super(message);
    this.status = status;
    this.serviceName = serviceName;
    this.serviceName = serviceName;
    this.methodName = methodName;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default GError;
