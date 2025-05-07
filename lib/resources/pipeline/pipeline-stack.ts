import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { envs } from "../../../config/envs";

import { MicroservicioAprobacionReembolsosPipelineStage } from "./pipeline-stage";

export class MicroservicioAprobacionReembolsosPipelineStack extends cdk.Stack {
  public readonly source: CodePipelineSource;
  public readonly pipeline: CodePipeline;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.source = CodePipelineSource.connection(
      `${envs.GITHUB_OWNER}/${envs.GITHUB_REPOSITORY}`,
      envs.ENV,
      { connectionArn: envs.GITHUB_ARN_CONNECTION!! },
    );

    this.pipeline = new CodePipeline(
      this,
      `MicroservicioAprobacionReembolsosCodePipeline-${envs.ENV}`,
      {
        pipelineName: `MicroservicioAprobacionReembolsosCodePipeline-${envs.ENV}`,
        synth: new ShellStep(
          `MicroservicioAprobacionReembolsosSynth-${envs.ENV}`,
          {
            env: {
              ENV: envs.ENV,
              AWS_ACCOUNT: envs.AWS_ACCOUNT || "",
              AWS_REGION: envs.AWS_REGION || "",
              GITHUB_ARN_CONNECTION: envs.GITHUB_ARN_CONNECTION || "",
              GITHUB_OWNER: envs.GITHUB_OWNER || "",
              GITHUB_REPOSITORY: envs.GITHUB_REPOSITORY || "",
            },
            input: this.source,
            installCommands: [
              "npm install",
              "npm install -g aws-cdk",
              'echo "Compilando la aplicación..."',
              'echo "Creando archivo .env..."',
              'echo "ENV=$ENV" > .env',
              'echo "AWS_ACCOUNT=$AWS_ACCOUNT" >> .env',
              'echo "AWS_REGION=$AWS_REGION" >> .env',
              'echo "GITHUB_ARN_CONNECTION=$GITHUB_ARN_CONNECTION" >> .env',
              'echo "GITHUB_OWNER=$GITHUB_OWNER" >> .env',
              'echo "GITHUB_REPOSITORY=$GITHUB_REPOSITORY" >> .env',
              "cat .env",
            ],
            commands: ["npm ci", "npx cdk synth"],
          },
        ),
      },
    );

    this.pipeline.addStage(
      new MicroservicioAprobacionReembolsosPipelineStage(
        this,
        `MicroservicioAprobacionReembolsosPipelineStage-${envs.ENV}`,
        { env: props?.env },
      ),
      {},
    );
  }
}
