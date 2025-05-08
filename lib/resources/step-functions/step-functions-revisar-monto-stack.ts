import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import * as path from 'path';

import { envs } from '../../../config/envs';

export class StepFunctionsRevisarMontoStack extends Stack {
  public readonly evaluarMontoFunction: lambda.Function;
  public readonly revisarFunction: lambda.Function;
  public readonly aprobarFunction: lambda.Function;
  public readonly tareaEvaluar: tasks.LambdaInvoke;
  public readonly tareaRevisar: tasks.LambdaInvoke;
  public readonly tareaAprobar: tasks.LambdaInvoke;
  public readonly decision: sfn.Choice;
  public readonly definition: sfn.Chain;
  public readonly stateMachine: sfn.StateMachine;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.evaluarMontoFunction = new lambda.Function(
      this,
      `EvaluarMontoFunction-${envs.ENV}`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/evaluarMonto')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `EvaluarMontoHandler-${envs.ENV}`,
      }
    );

    // Lambda para revisión manual

    this.revisarFunction = new lambda.Function(
      this,
      `RevisarFunction-${envs.ENV}`,
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/revisar')),
        functionName: `RevisarHandler-${envs.ENV}`,
      }
    );

    // Lambda para aprobación automática
    this.aprobarFunction = new lambda.Function(
      this,
      `AprobarFunction-${envs.ENV}`,
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/aprobar')),
        functionName: `AprobarHandler-${envs.ENV}`,
      }
    );

    // Tarea: evaluar monto
    this.tareaEvaluar = new tasks.LambdaInvoke(
      this,
      `evaluar-monto-task-${envs.ENV}`,
      {
        lambdaFunction: this.evaluarMontoFunction,
        outputPath: '$.Payload',
      }
    );

    // Tarea: revisión manual
    this.tareaRevisar = new tasks.LambdaInvoke(
      this,
      `revisar-task-${envs.ENV}`,
      {
        lambdaFunction: this.revisarFunction,
        outputPath: '$.Payload',
      }
    );

    // Tarea: aprobación automática
    this.tareaAprobar = new tasks.LambdaInvoke(
      this,
      `aprobar-task-${envs.ENV}`,
      {
        lambdaFunction: this.aprobarFunction,
        outputPath: '$.Payload',
      }
    );

    // Definición de la máquina de estados
    this.decision = new sfn.Choice(this, `decision-monto-${envs.ENV}`, {
      comment: 'Decision',
      stateName: `decision-monto-${envs.ENV}`,
    })
      .when(
        sfn.Condition.booleanEquals('$.requiereRevision', true),
        this.tareaRevisar
      )
      .otherwise(this.tareaAprobar);

    this.definition = this.tareaEvaluar.next(this.decision);

    this.stateMachine = new sfn.StateMachine(
      this,
      `state-machine-monto-${envs.ENV}`,
      {
        definition: this.definition,
        stateMachineName: `state-machine-monto-${envs.ENV}`,
      }
    );
  }
}
