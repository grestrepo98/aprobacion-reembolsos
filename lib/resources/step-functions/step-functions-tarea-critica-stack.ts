import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { envs } from '../../../config/envs';
import * as path from 'path';

export class StepFunctionsTareaCriticaStack extends Stack {
  public readonly tareaCritica: lambda.Function;
  public readonly tareaConRetryCatch: sfn.TaskStateBase;
  public readonly stateMachineRetryCatch: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda que puede fallar
    this.tareaCritica = new lambda.Function(
      this,
      `TareaCriticaFunction-${envs.ENV}`,
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/tareaCritica')
        ),
        functionName: `TareaCritica-${envs.ENV}`,
      }
    );

    // Paso que invoca Lambda con retry y catch
    this.tareaConRetryCatch = new tasks.LambdaInvoke(
      this,
      `TareaCríticaTask-${envs.ENV}`,
      {
        lambdaFunction: this.tareaCritica,
        stateName: `TareaCríticaTask-${envs.ENV}`,
        outputPath: '$.Payload',
      }
    )
      .addRetry({
        maxAttempts: 2,
        interval: Duration.seconds(5),
      })
      .addCatch(
        new sfn.Fail(this, `Falló definitivamente-${envs.ENV}`, {
          cause: 'Error persistente en la tarea crítica',
          error: 'TareaCriticaError',
        }),
        {
          resultPath: '$.error',
        }
      );

    // Máquina de estados
    this.stateMachineRetryCatch = new sfn.StateMachine(
      this,
      `StateMachineRetryCatch-${envs.ENV}`,
      {
        definition: this.tareaConRetryCatch,
        stateMachineType: sfn.StateMachineType.STANDARD,
        stateMachineName: `StateMachineRetryCatch-${envs.ENV}`,
      }
    );
  }
}
