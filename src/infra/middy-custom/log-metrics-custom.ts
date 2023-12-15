import { Metrics } from "@aws-lambda-powertools/metrics";
import type { ExtraOptions } from "@aws-lambda-powertools/metrics/lib/types";
import middy from "@middy/core";

/**
 * Map error status code to metric name
 *
 * statusCode >= 400 && statusCode <= 499 = "4xxError" else "5xxError"
 * @param statusCode
 * @returns
 */
export const mapMetricErrorByStatusCode = (statusCode: number) => {
  if (statusCode >= 400 && statusCode <= 499) return "4xxError";
  return "5xxError";
};

export const logMetricsCustom = (target: Metrics | Metrics, options: ExtraOptions = {}) => {
  const metricsInstances = target instanceof Array ? target : [target];
  const logMetricsBefore: middy.MiddlewareFn = async (request) => {
    metricsInstances.forEach((metrics) => {
      metrics.setDefaultDimensions({
        environment: process.env.STAGE || "N/A",
        FunctionName: request.context.functionName
      });

      const { throwOnEmptyMetrics, defaultDimensions, captureColdStartMetric } = options;
      if (throwOnEmptyMetrics !== undefined) {
        metrics.throwOnEmptyMetrics();
      }
      if (defaultDimensions !== undefined) {
        metrics.setDefaultDimensions(defaultDimensions);
      }
      if (captureColdStartMetric !== undefined) {
        metrics.captureColdStartMetric();
      }
    });
  };
  const logMetricsAfterOrError: middy.MiddlewareFn = async () => {
    metricsInstances.forEach((metrics) => {
      metrics.publishStoredMetrics();
    });
  };
  return {
    before: logMetricsBefore,
    after: logMetricsAfterOrError,
    onError: logMetricsAfterOrError
  };
};
