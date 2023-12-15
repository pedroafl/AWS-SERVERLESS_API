export class RequestContext {
  private constructor() {}

  private static readonly values = new Map<string, any>();

  static add<T>(key: string, value: T) {
    RequestContext.throwIfExists(key);
    RequestContext.values.set(key, value);
  }

  static get<T>(key: string): T | undefined {
    return RequestContext.values.get(key);
  }

  static getNotNull<T>(key: string): T {
    RequestContext.throwIfNotExists(key);
    return RequestContext.values.get(key);
  }

  private static throwIfExists(key: string) {
    if (RequestContext.values.get(key)) throw new Error("Value already existis in @RequestContext");
  }

  private static throwIfNotExists(key: string) {
    if (!RequestContext.values.get(key)) throw new Error("Value not existis in @RequestContext");
  }

  static clear() {
    RequestContext?.values?.clear();
  }
}
