import type { AWS } from "@serverless/typescript";
import { createAccountTriggers } from "@application/lambdas/account/create-account";
import { deleteAccountTriggers } from "@application/lambdas/account/delete-account";
import { findAccountTriggers } from "@application/lambdas/account/find-account";
import { updateAccountTriggers } from "@application/lambdas/account/update-account";

const serverlessConfiguration: AWS = {
  service: "catalisa-teste",
  frameworkVersion: "3",
  plugins: ["serverless-offline", "serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    timeout: 30,
    memorySize: 1024,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {
    createAccountInvoke: createAccountTriggers.invoke,
    deleteAccountInvoke: deleteAccountTriggers.invoke,
    findAccountInvoke: findAccountTriggers.invoke,
    updateAccountInvoke: updateAccountTriggers.invoke,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
