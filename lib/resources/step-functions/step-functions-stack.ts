import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { envs } from '../../../config/envs';

export class MicroservicioAprobacionReembolsosStepFunctionsStack extends Stack {
  public readonly lambdaA: lambda.Function;
  public readonly lambdaB: lambda.Function;
  public readonly taskA: tasks.LambdaInvoke;
  public readonly taskB: tasks.LambdaInvoke;
  public readonly definition: sfn.Chain;
  public readonly stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaA = new lambda.Function(this, `LambdaA-${envs.ENV}`, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/LambdaA')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      functionName: `LambdaA-${envs.ENV}`,
    });

    this.lambdaB = new lambda.Function(this, `LambdaB-${envs.ENV}`, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/LambdaB')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      functionName: `LambdaB-${envs.ENV}`,
    });

    this.taskA = new tasks.LambdaInvoke(this, `TaskA-${envs.ENV}`, {
      lambdaFunction: this.lambdaA,
      outputPath: '$.Payload',
      stateName: `TaskA-${envs.ENV}`,
    });

    this.taskB = new tasks.LambdaInvoke(this, `TaskB-${envs.ENV}`, {
      lambdaFunction: this.lambdaB,
      inputPath: '$.Payload',
      // outputPath: '$.Payload',
      stateName: `TaskB-${envs.ENV}`,
    });

    // State Machine Definition
    this.definition = this.taskA.next(this.taskB);

    // Create the State Machine
    this.stateMachine = new sfn.StateMachine(this, `StateMachine-${envs.ENV}`, {
      // definition: this.definition,
      definitionBody: sfn.DefinitionBody.fromChainable(this.definition),
      stateMachineType: sfn.StateMachineType.STANDARD,
      stateMachineName: `StateMachine-${envs.ENV}`,
    });
  }
}
