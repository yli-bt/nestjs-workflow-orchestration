import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from './workflows';
import * as constants from './constants';

@Controller('workflows')
export class WorkflowController {
    constructor(private readonly appService: AppService) {}

    @Get('run')
    run() {
        return this.runWorkflow();
    }

    async runWorkflow(): Promise<{
        msg: string;
        result: {
            greeting: string;
            greeting_two: string;
            greeting_three: string;
        };
    }> {
        console.log(__filename, 'runWorkflow');

        const connection = new Connection();
        const client = new WorkflowClient(connection.service, {
            namespace: constants.namespace,
        });

        const handle = await client.start(example, {
            args: ['Yicheng'],
            taskQueue: constants.task_queue,
            workflowId: constants.workflow_id_prefix + Math.floor(Math.random() * 1000),
        });

        const msg = `Started workflow ${handle.workflowId}`;
        const result = await handle.result();

        console.log(__filename, 'runWorkflow', result);

        return { msg, result };
    }
}
