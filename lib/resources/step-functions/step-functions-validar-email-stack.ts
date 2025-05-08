import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as path from 'path';
import { envs } from '../../../config/envs';
import { Construct } from 'constructs';

export class StepFunctionsValidarEmailStack extends Stack {
  private validarEmailFunction: lambda.Function;
  private validarSaldoFunction: lambda.Function;
  private finalizarFunction: lambda.Function;
  private validarEmailTarea: tasks.LambdaInvoke;
  private validarSaldoTarea: tasks.LambdaInvoke;
  private paralelo: sfn.Parallel;
  private stateMachine: sfn.StateMachine;
  private finalizarTarea: tasks.LambdaInvoke;
  private unirResultado: sfn.Pass;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.validarEmailFunction = new lambda.Function(
      this,
      `validar-email-function-${envs.ENV}`,
      {
        functionName: `validar-email-function-${envs.ENV}`,
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/validarEmail')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    this.validarSaldoFunction = new lambda.Function(
      this,
      `validar-saldo-function-${envs.ENV}`,
      {
        functionName: `validar-saldo-function-${envs.ENV}`,
        code: lambda.Code.fromAsset(
          path.join(__dirname, 'lambda/validarSaldo')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    this.finalizarFunction = new lambda.Function(
      this,
      `finalizar-function-${envs.ENV}`,
      {
        functionName: `finalizar-function-${envs.ENV}`,
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/finalizar')),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
      }
    );

    // Se crea la tarea de validar el email
    this.validarEmailTarea = new tasks.LambdaInvoke(
      this,
      `validar-email-tarea-${envs.ENV}`,
      {
        lambdaFunction: this.validarEmailFunction,
        stateName: `validar-email-tarea-state-${envs.ENV}`,
        outputPath: '$.Payload',
      }
    );

    // Se crea la tarea de validar el saldo
    this.validarSaldoTarea = new tasks.LambdaInvoke(
      this,
      `validar-saldo-tarea-${envs.ENV}`,
      {
        lambdaFunction: this.validarSaldoFunction,
        stateName: `validar-saldo-tarea-state-${envs.ENV}`,
        outputPath: '$.Payload',
      }
    );

    this.paralelo = new sfn.Parallel(this, `paralelo-${envs.ENV}`)
      .branch(this.validarEmailTarea)
      .branch(this.validarSaldoTarea);

    this.finalizarTarea = new tasks.LambdaInvoke(
      this,
      `finalizar-tarea-${envs.ENV}`,
      {
        lambdaFunction: this.finalizarFunction,
        stateName: `finalizar-tarea-state-${envs.ENV}`,
        outputPath: '$.Payload',
      }
    );

    this.unirResultado = new sfn.Pass(this, `unir-resultado-${envs.ENV}`, {
      parameters: {
        emailValido: sfn.JsonPath.stringAt('$.0.emailValido'),
        saldoSuficiente: sfn.JsonPath.stringAt('$.1.saldoSuficiente'),
      },
    });

    this.paralelo.next(this.unirResultado).next(this.finalizarTarea);

    this.stateMachine = new sfn.StateMachine(
      this,
      `state-machine-paralelo-${envs.ENV}`,
      {
        stateMachineName: `state-machine-paralelo-${envs.ENV}`,
        stateMachineType: sfn.StateMachineType.STANDARD,
        definition: this.paralelo,
      }
    );
  }
}
