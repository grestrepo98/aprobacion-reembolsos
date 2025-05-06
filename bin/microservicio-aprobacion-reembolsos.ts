#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MicroservicioAprobacionReembolsosStack } from "../lib/microservicio-aprobacion-reembolsos-stack";
import { envs } from "../config/envs";
const app = new cdk.App();

new MicroservicioAprobacionReembolsosStack(
  app,
  `MicroservicioAprobacionReembolsosStack-${envs.ENV}`,
  {
    env: {
      account: envs.AWS_ACCOUNT,
      region: envs.AWS_REGION,
    },
    description: "Microservicio de aprobación de reembolsos",
  }
);

app.synth();
