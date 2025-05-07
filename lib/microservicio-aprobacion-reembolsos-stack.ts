import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { MicroservicioAprobacionReembolsosStepFunctionsStack } from "./resources/step-functions/step-functions-stack";
import { envs } from "../config/envs";

export class MicroservicioAprobacionReembolsosStack extends cdk.Stack {
  private stepFunctionsStack: MicroservicioAprobacionReembolsosStepFunctionsStack;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stepFunctionsStack =
      new MicroservicioAprobacionReembolsosStepFunctionsStack(
        this,
        `MicroservicioAprobacionReembolsosStepFunctionsStack-${envs.ENV}`,
        { env: props?.env }
      );
  }
}
