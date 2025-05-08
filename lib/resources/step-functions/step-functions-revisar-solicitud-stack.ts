import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import { envs } from '../../../config/envs';

export class StepFunctionsRevisarSolicitudStack extends Stack {
  private solicitarFunction: lambda.Function;
  private revisarTrasEsperaFunction: lambda.Function;
  private solicitarTarea: tasks.LambdaInvoke;
  private revisarTrasEsperaTarea: tasks.LambdaInvoke;
  private esperar: sfn.Wait;
  public readonly definition: sfn.Chain;
  public readonly stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.solicitarFunction = new lambda.Function(
      this,
      `solicitar-function-${envs.ENV}`,
      {
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/solicitar')),
        handler: 'index.handler',
        functionName: `solicitar-function-${envs.ENV}`,
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    this.revisarTrasEsperaFunction = new lambda.Function(
      this,
      `revisar-tras-espera-function-${envs.ENV}`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/revisarTrasEspera')
        ),
        handler: 'index.handler',
        functionName: `revisar-tras-espera-function-${envs.ENV}`,
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    this.solicitarTarea = new tasks.LambdaInvoke(
      this,
      `solicitar-tarea-${envs.ENV}`,
      {
        lambdaFunction: this.solicitarFunction,
        outputPath: '$.Payload',
      }
    );

    this.esperar = new sfn.Wait(this, `esperar-10-segundos-state-${envs.ENV}`, {
      stateName: `esperar-10-segundos-state-${envs.ENV}`,
      time: sfn.WaitTime.duration(Duration.seconds(10)),
    });

    this.revisarTrasEsperaTarea = new tasks.LambdaInvoke(
      this,
      `revisar-tras-espera-tarea-${envs.ENV}`,
      {
        lambdaFunction: this.revisarTrasEsperaFunction,
        outputPath: '$.Payload',
      }
    );

    this.definition = this.solicitarTarea
      .next(this.esperar)
      .next(this.revisarTrasEsperaTarea);

    this.stateMachine = new sfn.StateMachine(
      this,
      `state-machine-revisar-solicitud-${envs.ENV}`,
      {
        definition: this.definition,
        stateMachineName: `state-machine-revisar-solicitud-${envs.ENV}`,
      }
    );
  }
}
