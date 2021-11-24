import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins'

export class MapsterAWSInfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        // S3
        const devBucket = new s3.Bucket(this, 'mapsterBucketDevelopment', {
            bucketName: 'mapster-bucket-development',
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

        // CloudFront
        const distribution = new cloudfront.Distribution(
            this,
            'mapsterDistribution',
            {
                defaultBehavior: { origin: new S3Origin(devBucket) },
            }
        )

        // example resource
        // const queue = new sqs.Queue(this, 'InfrastructureForAwsQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
    }
}
