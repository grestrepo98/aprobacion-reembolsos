import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';

import {
  DefinitionBody,
  StateMachine,
  Pass,
} from 'aws-cdk-lib/aws-stepfunctions';
import { envs } from '../../../config/envs';

export class MicroservicioAprobacionReembolsosStepFunctionsStack extends Stack {
  public readonly startState: Pass;
  public readonly stateMachine: StateMachine;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.startState = Pass.jsonata(this, `StartState-${envs.ENV}`, {
      stateName: `StartState-${envs.ENV}`,
    });

    this.stateMachine = new StateMachine(this, `StateMachine-${envs.ENV}`, {
      definitionBody: DefinitionBody.fromChainable(this.startState),
      stateMachineName: `StateMachine-${envs.ENV}`,
    });
  }
}
