/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export class ObjectUtils {
  private constructor() {}

  /**
   * Checks if an items contains in array.
   *
   * ObjectUtils.containsElement([null], null) = true
   * ObjectUtils.containsElement([""], "") = true
   * ObjectUtils.containsElement([1], 1) = true
   * ObjectUtils.containsElement([], "") = false
   *
   * @param item
   * @param array
   */
  static containsElement<T>(array: T[], item: T): boolean {
    if (ObjectUtils.isEmptyArray(array)) return false;
    return array.includes(item);
  }

  /**
   * Add item to array.
   *
   * ObjectUtils.addElementToArray(null, "item") = [item]
   * ObjectUtils.addElementToArray([""], "") = ["", ""]
   * ObjectUtils.addElementToArray([1], 1) = [1, 1]
   *
   * @param item
   * @param array
   */
  static addElementToArray<T>(array: T[], item: T): T[] {
    return (array || []).concat(item);
  }

  /**
   * Checks if an Array is empty ([]) or null.
   *
   * ObjectUtils.isEmptyArray(null) = true
   * ObjectUtils.isEmptyArray(undefined) = true
   * ObjectUtils.isEmptyArray([]) = true
   * ObjectUtils.isEmptyArray([1]) = false
   * @param array
   */
  static isEmptyArray(array: unknown[]): boolean {
    return (array || []).length === 0;
  }

  /**
   * Checks if an Array is not empty ([]) and null.
   *
   * ObjectUtils.isNotEmptyArray(null) = false
   * ObjectUtils.isNotEmptyArray(undefined) = false
   * ObjectUtils.isNotEmptyArray([]) = false
   * ObjectUtils.isNotEmptyArray([1]) = true
   * @param array
   */
  static isNotEmptyArray(array: unknown[]): boolean {
    return !ObjectUtils.isEmptyArray(array);
  }

  /**
   * Checks if a String is not empty ("") or null.
   *
   * ObjectUtils.isEmptyString(null) = true
   * ObjectUtils.isEmptyString("") = true
   * ObjectUtils.isEmptyString("null") = false
   * ObjectUtils.isEmptyString(" ") = false
   * @param value
   */
  static isEmptyString(value: string): boolean {
    return (value || "").length === 0;
  }

  /**
   * Checks if a String is not empty ("") or null.
   *
   * ObjectUtils.isNotEmptyString(null) = false
   * ObjectUtils.isNotEmptyString("") = false
   * ObjectUtils.isNotEmptyString("null") = true
   * ObjectUtils.isNotEmptyString(" ") = true
   * @param value
   */
  static isNotEmptyString(value?: string): boolean {
    return (value || "").trim().length > 0;
  }

  /**
   * Checks if a String is blank ("") or null.
   *
   * ObjectUtils.isBlankString(null) = true
   * ObjectUtils.isBlankString(undefined) = true
   * ObjectUtils.isBlankString("") = true
   * ObjectUtils.isBlankString(" ") = true
   * ObjectUtils.isBlankString("null") = false
   * ObjectUtils.isBlankString(" null ") = false
   * @param value
   */
  static isBlankString(value: string): boolean {
    return (value || "").trim().length === 0;
  }

  /**
   * Checks if a String is not blank ("") or null.
   *
   * ObjectUtils.isNotBlankString(null) = false
   * ObjectUtils.isNotBlankString(undefined) = false
   * ObjectUtils.isNotBlankString("") = false
   * ObjectUtils.isNotBlankString(" ") = false
   * ObjectUtils.isNotBlankString("null") = true
   * ObjectUtils.isNotBlankString(" null ") = true
   * @param value
   */
  static isNotBlankString(value: string): boolean {
    return !ObjectUtils.isBlankString(value);
  }

  /**
   * Returns defaultValue If the value is null
   *
   * ObjectUtils.defaulIfIsNull(null, "") = ""
   * ObjectUtils.defaulIfIsNull("null", "") = "null"
   * ObjectUtils.defaulIfIsNull(undefined, "") = ""
   * @param value
   * @param defaultValue
   */
  static defaulIfIsNull<T>(value: T, defaultValue: T): T {
    return ObjectUtils.isNull(value) ? defaultValue : value;
  }

  /**
   * Checks if a value is null or undefined.
   *
   * ObjectUtils.isNull(null) = true
   * ObjectUtils.isNull(undefined) = true
   * ObjectUtils.isNull("null") = false
   * ObjectUtils.isNull("") = false
   * @param value
   */
  static isNull(value: unknown): boolean {
    return value === null || value === undefined;
  }

  /**
   * Checks if a value is null or undefined.
   *
   * ObjectUtils.isNotNull(null) = false
   * ObjectUtils.isNotNull(undefined) = false
   * ObjectUtils.isNotNull("null") = true
   * ObjectUtils.isNotNull("") = true
   * @param value
   */
  static isNotNull(value: unknown): boolean {
    return !ObjectUtils.isNull(value);
  }

  /**
   * Compares two String, returning true if they represent equal sequences of characters, ignoring case.
   * ObjectUtils.equalsIgnoreCase(null, *) = false
   * ObjectUtils.equalsIgnoreCase(*, null) = false
   * ObjectUtils.equalsIgnoreCase("null", "null") = true
   * ObjectUtils.isNotNull("", "") = true
   * @param str1
   * @param str2
   */
  static equalsIgnoreCase(str1: string, str2: string): boolean {
    if (ObjectUtils.isNull(str1) || ObjectUtils.isNull(str2)) return false;
    return (str1 || "").toLowerCase() === (str2 || "").toLowerCase();
  }

  static everyIsNotNull(...params: any[]) {
    if (ObjectUtils.isEmptyArray(params)) return false;
    return params.every((param) => ObjectUtils.isNotNull(param));
  }

  static everyIsNull(...params: any[]) {
    if (ObjectUtils.isEmptyArray(params)) return false;
    return params.every((param) => ObjectUtils.isNull(param));
  }

  static containsValue<T>(value: T, ...values: T[]): boolean {
    if (ObjectUtils.isEmptyArray(values)) return false;
    return values.includes(value);
  }

  static executeIfIsNotNull<T, R>(value: T | undefined, execution: (value: T) => R): R | undefined {
    if (ObjectUtils.isNotNull(value)) {
      return execution(value!);
    }
    return undefined;
  }

  static clone<T>(value: T): T {
    return { ...value };
  }

  static deletePropertyWithEmptyValues(array: any): void {
    Object.keys(array).forEach((key) => {
      if (ObjectUtils.isNull(array[key])) delete array[key];
    });
  }

  static deleteProperties(object: any, properties: string[]): void {
    properties.forEach((property) => {
      delete object[property];
    });
  }
}
