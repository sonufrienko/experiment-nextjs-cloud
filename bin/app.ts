#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExperimentNextjsCloudStack } from '../lib/experiment-nextjs-cloud-stack';

const app = new cdk.App();
new ExperimentNextjsCloudStack(app, 'ExperimentNextjsCloudStack');
