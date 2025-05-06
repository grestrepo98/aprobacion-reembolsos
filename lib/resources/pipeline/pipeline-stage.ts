import { Construct } from "constructs";
import { StackProps, Stage } from "aws-cdk-lib";

import { MicroservicioAprobacionReembolsosStack } from "../../microservicio-aprobacion-reembolsos-stack";

/**
 * Represents a pipeline stage for the MicroservicioProcesos service.
 *
 * @class
 * @extends {Stage}
 */
export class MicroservicioAprobacionReembolsosPipelineStage extends Stage {
  private microservicioAprobacionReembolsosStack: MicroservicioAprobacionReembolsosStack;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.microservicioAprobacionReembolsosStack =
      new MicroservicioAprobacionReembolsosStack(
        this,
        "MicroservicioAprobacionReembolsosStack",
        { env: props?.env }
      );
  }
}
