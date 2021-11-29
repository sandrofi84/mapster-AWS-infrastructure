import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins'

export type DeploymentEnv = 'prod' | 'dev'
interface MapsterAWSInfrastructureStackProps extends cdk.StackProps {
    deploymentEnvironment: DeploymentEnv
}

export class MapsterAWSInfrastructureStack extends cdk.Stack {
    constructor(
        scope: cdk.Construct,
        id: string,
        props: MapsterAWSInfrastructureStackProps
    ) {
        super(scope, id, props)

        const isProd = props.deploymentEnvironment === 'prod'
        const bucketId = isProd
            ? 'mapsterBucketProduction'
            : 'mapsterBucketDevelopment'
        const bucketProps: s3.BucketProps = {
            bucketName: isProd
                ? 'mapster-bucket-production'
                : 'mapster-bucket-development',
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        }
        // S3
        const bucket = new s3.Bucket(this, bucketId, bucketProps)

        if (isProd) {
            // CloudFront
            new cloudfront.Distribution(this, 'mapsterDistribution', {
                defaultBehavior: { origin: new S3Origin(bucket) },
            })
        }

        // example resource
        // const queue = new sqs.Queue(this, 'InfrastructureForAwsQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
    }
}
