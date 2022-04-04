import { Connection, WorkflowClient } from '@temporalio/client';
import * as constants from './constants';
import { dslHandler } from './workflows';

const jsonDSL: string = `{
    "name": "Low Budget DSL",
    "input": ["Yicheng"],
    "states": [
        { "functionRef": "greet" },
        { "functionRef": "greet_two" },
        { "functionRef": "greet_three" }
    ]
}`;

async function run(dsl: string) {
    const workflow = JSON.parse(dsl);
    const workflowId = constants.workflow_id_prefix + Math.floor(Math.random() * 1000);
    const connection = new Connection();
    const client = new WorkflowClient(connection.service);
    const handle = await client.start(dslHandler, {
        args: [ workflow ],
        taskQueue: constants.task_queue,
        workflowId: workflowId
    });
    const result = await handle.result();
    return {
        workflowId,
        result
    };
}

run(jsonDSL).then(res => {
    console.log('run.then result', JSON.stringify(res, null, 4));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
