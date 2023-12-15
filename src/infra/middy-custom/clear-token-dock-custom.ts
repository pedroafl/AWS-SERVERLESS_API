import { HttpDock } from "@infra/gateways/dock";
import middy from "@middy/core";

export const clearDockTokenCustom = () => {
  const clearToken: middy.MiddlewareFn = () => {
    HttpDock.clearToken();
  };
  return { after: clearToken, onError: clearToken };
};
