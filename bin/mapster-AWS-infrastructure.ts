#!/usr/bin/env node
import 'source-map-support/register'
import { App, Tags } from '@aws-cdk/core'
import {
    DeploymentEnv,
    MapsterAWSInfrastructureStack,
} from '../lib/mapster-AWS-infrastructure'

console.log('process.env.DEPLOYMENT_ENV: ', process.env.DEPLOYMENT_ENV)
const environment = (process.env.DEPLOYMENT_ENV as DeploymentEnv) || 'dev'
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
