import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';
import { Construct } from 'constructs';

import { envs } from '../../../config/envs';

export class StepFunctionsProductosStack extends Stack {
  public readonly procesarProductoLambda: lambda.Function;
  public readonly mapState: sfn.Map;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //Lambda que procesa el producto
    this.procesarProductoLambda = new lambda.Function(
      this,
      `procesar-producto-${envs.ENV}`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/procesarProducto')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `procesar-producto-${envs.ENV}`,
      }
    );

    // Paso Map: itera sobre una lista de productos
    this.mapState = new sfn.Map(
      this,
      `procesar-lista-productos-map-${envs.ENV}`,
      {
        stateName: `procesar-lista-productos-map-${envs.ENV}`,
        inputPath: '$.productos',
        itemsPath: '$',
        resultPath: '$.resultados',
      }
    );

    this.mapState.itemProcessor(
      new tasks.LambdaInvoke(
        this,
        `procesar-producto-itemProcessor-${envs.ENV}`,
        {
          stateName: `procesar-producto-itemProcessor-${envs.ENV}`,
          lambdaFunction: this.procesarProductoLambda,
          outputPath: '$.Payload',
        }
      )
    );

    // Máquina de estados
    new sfn.StateMachine(this, `state-machine-map-${envs.ENV}`, {
      definition: this.mapState,
      stateMachineType: sfn.StateMachineType.STANDARD,
      stateMachineName: `state-machine-map-${envs.ENV}`,
    });
  }
}
