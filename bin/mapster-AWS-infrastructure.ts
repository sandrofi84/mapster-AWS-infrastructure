#!/usr/bin/env node
import 'source-map-support/register'
import { App, Tags } from '@aws-cdk/core'
import { MapsterAWSInfrastructureStack } from '../lib/mapster-AWS-infrastructure'

const environment = process.env.DEPLOYMENT_ENV === 'prod' ? 'prod' : 'dev'
const isProd = environment === 'prod'
const stackProps = {
    id: isProd
        ? 'MapsterAWSInfrastructureStackPRODUCTION'
        : 'MapsterAWSInfrastructureStackDEVELOPMENT',
    name: isProd ? 'mapster-stack-prod' : 'mapster-stack-dev',
}

const app = new App()

const websiteStack = new MapsterAWSInfrastructureStack(app, stackProps.id, {
    stackName: stackProps.name,
    env: {
        region: 'eu-west-2',
    },
    deploymentEnvironment: environment,
})

Tags.of(websiteStack).add('env', environment)
