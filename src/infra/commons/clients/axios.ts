import Axios, { AxiosInstance } from "axios";
import { URL } from "url";

export abstract class AxiosClient {
  readonly http: AxiosInstance;

  constructor(private endpoint) {
    this.http = Axios.create();
  }

  protected getURL(path?: string): URL {
    if (path) {
      return new URL(`${this.endpoint}/${path}`);
    }
    return new URL(`${this.endpoint}`);
  }

  protected async get<RESPONSE>(url: string): Promise<RESPONSE> {
    const axios = await this.http;
    return axios.get<RESPONSE>(url).then((response) => response.data);
  }
}
