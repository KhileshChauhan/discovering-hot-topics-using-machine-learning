/**********************************************************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICNSE-2.0                                                                     *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/

import { SynthUtils } from '@aws-cdk/assert';
import { BucketEncryption } from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core'
import '@aws-cdk/assert/jest';

import { TopicAnalysisProxy } from '../lib/integration/topic-analysis-proxy';
import { EventStorage } from '../lib/storage/event-storage-construct';
import { Bucket } from '@aws-cdk/aws-s3';

test('test Text Analysis Fireshose Stream Creation', () => {
    const stack = new Stack();
    new TopicAnalysisProxy(stack, 'TestTAProxy', {
        topicsStorage: new EventStorage(stack, 'Topic', {
            compressionFormat: 'UNCOMPRESSED',
            prefix: '/topic',
            s3Bucket: new Bucket(stack, 'topics', {
                encryption: BucketEncryption.S3_MANAGED
            })
        }),
        topicMappingsStorage: new EventStorage(stack, 'Mappings', {
            compressionFormat: 'UNCOMPRESSED',
            prefix: '/mappings',
            s3Bucket: new Bucket(stack, 'mappingsbucket', {
                encryption: BucketEncryption.S3_MANAGED
            })
        }),
        topicMappingsInfNS: 'com.analyze.inferece.topic',
        topicsAnalysisInfNS: 'com.analyze.inference.mapping'

    });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
