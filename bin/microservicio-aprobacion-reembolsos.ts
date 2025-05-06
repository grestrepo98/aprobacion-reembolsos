#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { envs } from "../config/envs";
const app = new cdk.App();

import { MicroservicioAprobacionReembolsosPipelineStack } from "../lib/resources/pipeline/pipeline-stack";

new MicroservicioAprobacionReembolsosPipelineStack(
  app,
  `MicroservicioAprobacionReembolsosPipelineStack-${envs.ENV}`,
  {
    env: {
      account: envs.AWS_ACCOUNT,
      region: envs.AWS_REGION,
    },
    description: "Pipeline de aprobación de reembolsos",
  }
);

app.synth();
