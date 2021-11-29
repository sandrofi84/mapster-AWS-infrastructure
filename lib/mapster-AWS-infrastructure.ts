import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
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
        const environment = props.deploymentEnvironment
        const isProd = environment === 'prod'
        const bucketId = isProd
            ? 'mapsterBucketProduction'
            : 'mapsterBucketDevelopment'
        const bucketPolicyId = isProd
            ? 'mapsterBucketPolicyProduction'
            : 'mapsterBucketPolicyDevelopment'
        const bucketProps: s3.BucketProps = {
            bucketName: isProd
                ? 'mapster-bucket-production'
                : 'mapster-bucket-development',
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        }
        // create S3 bucket
        const bucket = new s3.Bucket(this, bucketId, bucketProps)

        // create the bucket policy
        const bucketPolicy = new s3.BucketPolicy(this, bucketPolicyId, {
            bucket: bucket,
        })

        // add policy statements ot the bucket policy
        bucketPolicy.document.addStatements(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:GetObject', 's3:DeleteObject', 's3:PutObject'],
                resources: [`${bucket.bucketArn}/*`],
                conditions: {
                    StringEquals: { 'aws:PrincipalTag/env': environment },
                },
            })
        )

        if (isProd) {
            // CloudFront
            new cloudfront.Distribution(this, 'mapsterDistribution', {
                defaultBehavior: { origin: new S3Origin(bucket) },
            })
        }
    }
}
