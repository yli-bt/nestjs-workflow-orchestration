import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as constants from './constants';

async function run() {
    // Step 1:
    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows'),
        taskQueue: constants.task_queue,
        activities: activities,
    });
    // Step 2:
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
