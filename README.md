# grammY Deno Deploy Queues (Proof of concept)
Delay your messages or task

*Note:* Very rough (but working) code only; making your own changes and fixes is the expectation

## Usage
Deploy the code in `main.ts` to Deno Deploy

Somewhere in your code, run something like the following:
```ts
const r = await fetch("https://<your project name>.deno.dev", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    msg: {
      chat_id: 1234567889,
      text: "Test text",
    },
    delay: 5000,
    // Alternatively, use your own web server as url so that you can process the job in your bot app
    url: "https://api.telegram.org/bot<bot token>/sendMessage",
  }),
});
```

The above is an example only. Please modify to your use case.
