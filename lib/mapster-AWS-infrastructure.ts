import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-s3";

export class MapsterAWSInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfrastructureForAwsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
