import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { envs } from "../../../config/envs";

import { MicroservicioAprobacionReembolsosPipelineStage } from "./pipeline-stage";

class MicroservicioProcesosPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const source = CodePipelineSource.connection(
      `${envs.BITBUCKET_WORKSPACE}/${envs.BITBUCKET_REPOSITORY}`,
      envs.ENV,
      { connectionArn: envs.BITBUCKET_CONNECTION_ARN }
    );

    const pipeline = new CodePipeline(
      this,
      "MicroservicioProcesosCodePipeline",
      {
        pipelineName: "MicroservicioProcesosCodePipeline",
        synth: new ShellStep("MicroservicioProcesosSynth", {
          env: {
            ENV: envs.ENV,
            AWS_ACCOUNT: envs.AWS_ACCOUNT || "",
            AWS_REGION: envs.AWS_REGION || "",
          },
          input: source,
          installCommands: [
            "npm install",
            "npm install -g aws-cdk",
            "npm install",
            'echo "Compilando la aplicación..."',
            'echo "Creando archivo .env..."',
            'echo "ENV=$ENV" > .env',
            'echo "AWS_ACCOUNT=$AWS_ACCOUNT" >> .env',
            'echo "AWS_REGION=$AWS_REGION" >> .env',
            "cat .env",
          ],
          commands: ["npm ci", "npx cdk synth"],
        }),
      }
    );

    pipeline.addStage(
      new MicroservicioAprobacionReembolsosPipelineStage(
        this,
        `MicroservicioAprobacionReembolsosPipelineStage-${envs.ENV}`,
        { env: props?.env }
      ),
      {}
    );
  }
}

module.exports = { MicroservicioProcesosPipelineStack };
