import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MicroservicioAprobacionReembolsosStepFunctionsStack } from './resources/step-functions/step-functions-stack';
import { envs } from '../config/envs';
import { StepFunctionsRevisarMontoStack } from './resources/step-functions/step-functions-revisar-monto-stack';
import { StepFunctionsRevisarSolicitudStack } from './resources/step-functions/step-functions-revisar-solicitud-stack';
import { StepFunctionsValidarEmailStack } from './resources/step-functions/step-functions-validar-email-stack';
export class MicroservicioAprobacionReembolsosStack extends cdk.Stack {
  private stepFunctionsStack: MicroservicioAprobacionReembolsosStepFunctionsStack;
  private stepFunctionsRevisarMontoStack: StepFunctionsRevisarMontoStack;
  private stepFunctionsRevisarSolicitudStack: StepFunctionsRevisarSolicitudStack;
  private stepFunctionsValidarEmailStack: StepFunctionsValidarEmailStack;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stepFunctionsStack =
      new MicroservicioAprobacionReembolsosStepFunctionsStack(
        this,
        `MicroservicioAprobacionReembolsosStepFunctionsStack-${envs.ENV}`,
        {
          env: props?.env,
        }
      );

    this.stepFunctionsRevisarMontoStack = new StepFunctionsRevisarMontoStack(
      this,
      `StepFunctionsRevisarMontoStack-${envs.ENV}`,
      {
        env: props?.env,
      }
    );

    this.stepFunctionsRevisarSolicitudStack =
      new StepFunctionsRevisarSolicitudStack(
        this,
        `StepFunctionsRevisarSolicitudStack-${envs.ENV}`,
        {
          env: props?.env,
        }
      );

    this.stepFunctionsValidarEmailStack = new StepFunctionsValidarEmailStack(
      this,
      `StepFunctionsValidarEmailStack-${envs.ENV}`,
      {
        env: props?.env,
      }
    );
  }
}
