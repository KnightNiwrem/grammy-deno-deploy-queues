const kv = await Deno.openKv();

interface Value {
  nonce: string;
  msg: unknown;
  url: string;
}

kv.listenQueue(async (value) => {
  const { nonce, msg, url } = (value as Value);
  const kvNonce = await kv.get(["nonces", nonce]);
  if (kvNonce.value === null) {
    // This messaged was already processed.
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });

  const success = await kv.atomic()
    // Ensure this message was not yet processed
    .check({ key: kvNonce.key, versionstamp: kvNonce.versionstamp })
    .delete(kvNonce.key)
    .sum(["processed_count"], 1n)
    .commit();
});

Deno.serve(async (req: Request) => {
  try {
    const jsonReq = await req.json();
    const nonce = crypto.randomUUID();

    const { msg, delay, url } = jsonReq;
    if (!url) {
      throw Error("url is required");
    }

    await kv
      .atomic()
      .check({ key: ["nonces", nonce], versionstamp: null })
      .enqueue({ nonce, msg, url }, { delay: delay ?? 10 })
      .set(["nonces", nonce], true)
      .sum(["enqueued_count"], 1n)
      .commit();

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(err, { status: 500 });
  }
});
