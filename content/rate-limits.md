> ## Documentation Index
> Fetch the complete documentation index at: https://docs.together.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Rate limits

> Understand serverless performance, how to handle rate limits during high demand, and options for throughput guarantees.

In most cases, you can use Together AI [serverless inference](/docs/serverless/overview) without encountering rate limits. Rate limiting may occasionally occur with high request volumes or large bursts of traffic.

## Demand and performance

Response times can vary depending on the model and current demand.

Together aims to maintain high performance for serverless requests, including:

* **Tokens per second (TPS):** The speed at which a model generates output tokens.
* **Time to first token (TTFT):** The time between sending a request and receiving the first output token.

When demand is high, Together may limit requests to maintain these performance goals. You may receive a `429 Too Many Requests` or `503 Service Unavailable` response.

Serverless performance is best-effort. For committed throughput and reliability guarantees, see [provisioned throughput](/docs/inference/provisioned-throughput).

## Handle errors during high demand

The response code tells you how to adjust your requests:

* **`429 Too Many Requests`:** Reduce your request rate. Spread requests out over time and avoid sending large bursts. Use exponential backoff when retrying.
* **`503 Service Unavailable`:** Wait briefly, then retry. Use exponential backoff if the error continues.

Limit retries to fit your application's latency needs. For workloads that need committed throughput and reliability, consider [provisioned throughput](/docs/inference/provisioned-throughput).

## Get throughput guarantees

If your workload needs committed throughput and reliability guarantees, [provisioned throughput](/docs/inference/provisioned-throughput) reserves capacity for a selected model or model family with a defined service level agreement (SLA). [Contact sales](https://www.together.ai/contact-sales-pt) to discuss your workload and capacity requirements.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.