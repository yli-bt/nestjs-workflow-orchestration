import { proxyActivities } from '@temporalio/workflow';
import * as activities from './activities';

const { greet, greet_two, greet_three } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<{ greeting: string; greeting_two: string; greeting_three: string }> {
    const greeting = await greet(name);
    const greeting_two = await greet_two(name);
    const greeting_three = await greet_three(name);

    return {
        greeting,
        greeting_two,
        greeting_three,
    };
}

export type Activities = {
    [key: string]: Function;
};

export type State = {
    functionRef: string;
    output?: any;
};

export type DSL = {
    input: any[];
    states: State[];
};

export async function dslHandler(workflow: DSL): Promise<any> {
    console.log(__filename, 'dslHandler', workflow);
    
    workflow.states.forEach(async (state: State) => {
        state.output = {};
        state.output[state.functionRef] = await activities[state.functionRef](...workflow.input);
    });

    return workflow;
}
