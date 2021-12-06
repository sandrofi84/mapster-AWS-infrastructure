import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins'

export type DeploymentEnv = 'prod' | 'dev'
interface MapsterAWSInfrastructureStackProps extends cdk.StackProps {
    deploymentEnvironment: DeploymentEnv
}
interface BucketData {
    id: string
    props: s3.BucketProps
}

export class MapsterAWSInfrastructureStack extends cdk.Stack {
    constructor(
        scope: cdk.Construct,
        id: string,
        props: MapsterAWSInfrastructureStackProps
    ) {
        super(scope, id, props)
        const environment = props.deploymentEnvironment
        const isProd = environment === 'prod'
        const bucketData: BucketData = {
            id: isProd ? 'mapsterBucketProduction' : 'mapsterBucketDevelopment',
            props: {
                bucketName: isProd
                    ? 'mapster-bucket-production'
                    : 'mapster-bucket-development',
                websiteIndexDocument: 'index.html',
                publicReadAccess: true,
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            },
        }
        // create S3 bucket
        const bucket = new s3.Bucket(this, bucketData.id, bucketData.props)

        if (isProd) {
            // CloudFront
            new cloudfront.Distribution(this, 'mapsterDistribution', {
                defaultBehavior: { origin: new S3Origin(bucket) },
            })
        }
    }
}
