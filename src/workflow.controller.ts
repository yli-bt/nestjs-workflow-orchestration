import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from './workflows';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly appService: AppService) {}

  @Get('run')
  run() {
    return this.runWorkflow();
  }

  async runWorkflow(): Promise<{ msg: string, result: { greeting: string, greeting_two: string, greeting_three: string } }> {
    //return this.appService.getVersion();

    const connection = new Connection({
      // // Connect to localhost with default ConnectionOptions.
      // // In production, pass options to the Connection constructor to configure TLS and other settings:
      // address: 'foo.bar.tmprl.cloud', // as provisioned
      // tls: {} // as provisioned
    });

    const client = new WorkflowClient(connection.service, {
      // namespace: 'default', // change if you have a different namespace
    });

    const handle = await client.start(example, {
      args: ['Yicheng'], // type inference works! args: [name: string]
      taskQueue: 'hello-world',
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
    });

    const msg = `Started workflow ${handle.workflowId}`;

    // optional: wait for client result
    const result = await handle.result(); // Hello, Temporal!

    return { msg, result };
  }
}