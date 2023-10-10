# grammY + Deno Deploy + CloudAMQP (Proof of concept)
Queue your tasks on CloudAMQP

*Note:* Very rough (but working) code only; making your own changes and fixes is the expectation

## Setup
Create a new LavinMQ instance at [CloudAMQP](https://www.cloudamqp.com/plans.html).

On the left-hand panel in your free instance, go to Integrations > Webhooks. Create a webhook with the right queue name and deno deploy url + path.

## Usage
Deploy the code in `main.ts` to Deno Deploy

The above is an example only. Please modify to your use case.
