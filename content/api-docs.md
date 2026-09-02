# AnyModel API

AnyModel is an OpenAI-compatible gateway: one API key and one base URL for models from many vendors (GPT, Claude, Gemini, DeepSeek, Qwen, Kimi, GLM and more), plus image, video, audio, embedding, reranking and web-search endpoints.

It is meant to be given to a coding assistant as-is — download it from https://anymodel.org/api-docs.md or paste it into the model's context. Chat, reranking, research, image and video are documented in full below. Embeddings, speech, transcription, search and fetch appear in the endpoint table with the rule that prices them; their own rates and parameters come from `GET /v1/models` and `GET /v1/models/info`.

## Quick start

```bash
export ANYMODEL_API_KEY="<YOUR_API_KEY>"

curl -sS https://anymodel.org/v1/chat/completions \
  -X POST \
  -H "Authorization: Bearer $ANYMODEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "am/gpt-5.6-terra", "messages": [{"role": "user", "content": "Hello"}]}'
```

- **Base URL:** `https://anymodel.org/v1`
- **Authentication:** `Authorization: Bearer <key>` (`x-api-key: <key>` also works).
- **Compatibility:** any OpenAI SDK works by pointing `base_url` at `https://anymodel.org/v1`. Anthropic-format clients can call `/v1/messages` instead; both formats reach the same models.

### Your API key

Get one in the AnyModel cabinet, under API Keys. **Replace `<YOUR_API_KEY>` with it in your own code — do not paste the real key into a chat with an AI assistant, a public repository, or a screenshot.** Keep it in an environment variable, as the examples do, and the assistant only ever sees the variable name.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /v1/chat/completions | Chat completions (OpenAI format). Detailed below. |
| POST | /v1/messages | Messages (Anthropic format). Vendor-executed server tools are forwarded as sent: web_search and friends need an Anthropic pool, google_search needs a Gemini one; a pool that cannot run the requested tool is refused with 400 unsupported_builtin_tool. Sources come back as annotations[].url_citation. |
| POST | /v1/responses | Responses API, used by Deep Research routes. Detailed below. |
| GET | /v1/models | Catalog of callable models with prices. Detailed below. |
| GET | /v1/models/{kind} | Same list filtered: image, video, tts, stt, embedding, rerank, image-to-text, web. |
| GET | /v1/models/info?id={id} | Metadata for one model: kind, endpoint, parameters, billing. |
| GET | /v1/balance | Balance tokens left on the key. |
| POST | /v1/images/generations | Image generation. Detailed below. |
| POST | /v1/videos/generations | Video generation (asynchronous). Detailed below. |
| GET | /v1/videos/{request_id} | Poll a video job. |
| GET | /v1/videos/{request_id}/content | Download the finished video through the gateway. |
| POST | /v1/videos/edits | Edit an existing clip. Flat-billed — see the video section. |
| POST | /v1/videos/extensions | Continue an existing clip with a new fragment. See the video section for how it is billed. |
| POST | /v1/embeddings | Embeddings. |
| POST | /v1/rerank | Document reranking. Detailed below. |
| POST | /v1/audio/speech | Text to speech. |
| POST | /v1/audio/transcriptions | Speech to text. |
| POST | /v1/search | Web search. |
| POST | /v1/web/fetch | Web page fetch. |

## Models and what they cost

Balance is denominated in **balance tokens**. Every model except a combo carries a **coefficient**: how many balance tokens one raw token of that model burns. A cheap model can cost ×0.05 and a flagship ×16, so the coefficient — not the raw token count — decides how fast a balance drains.

`GET /v1/models` returns the callable catalog with that coefficient attached:

```bash
curl -sS https://anymodel.org/v1/models -H "Authorization: Bearer $ANYMODEL_API_KEY"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "am/gpt-5.6-terra",
      "object": "model",
      "owned_by": "am",
      "billing": {
        "unit": "token",
        "coefficient": {
          "input": 3,
          "output": 3
        }
      }
    },
    {
      "id": "am/gpt-image-2",
      "object": "model",
      "owned_by": "am",
      "kind": "image",
      "billing": {
        "unit": "image",
        "base_tokens": 100000,
        "scales": {
          "quality": {
            "low": 0.25,
            "medium": 1,
            "auto": 1,
            "standard": 1,
            "high": 4,
            "hd": 4
          },
          "size": {
            "256x256": 0.4,
            "512x512": 0.6,
            "1024x1024": 1,
            "auto": 1,
            "1024x1536": 1.5,
            "1536x1024": 1.5,
            "1024x1792": 1.75,
            "1792x1024": 1.75
          }
        },
        "coefficient": {
          "input": 2.5,
          "output": 2.5
        }
      }
    }
  ]
}
```

- `billing.unit` — what the coefficient multiplies: `token`, `image`, `character`, `minute`, `second` or `request`.
- `billing.base_tokens` — fixed charge for one unit, present when a unit is not a token.
- `billing.scales` — further multipliers that unit is scaled by before the coefficient (images: `quality` and `size`). `base_tokens` alone is the cheapest variant, not the price of an arbitrary request.
- `billing.rates` — per-unit charge that depends on a request parameter rather than one fixed number (video: balance tokens per second for each resolution).
- `billing.coefficient` — whenever a `billing` block is present, it is `{ "input": number, "output": number }`, never a bare number. A flat-rate model reports the same value in both directions; partner routes priced per direction report two. Outside chat there is no direction: both numbers are equal and the charge uses `output`.
- Combo models (`"owned_by": "combo"`) carry no `billing` block: the id names a fallback chain, and the charge belongs to whichever member actually answered. Their cost cannot be predicted from the catalog — compare `GET /v1/balance` before and after if you need the figure.
- Text models carry no `kind` field — `kind` appears only on image, video, tts, stt, embedding, rerank, imageToText and web entries. There is no `/v1/models/{kind}` slug for text: list them from `GET /v1/models` and keep the entries without a `kind`. (`imageToText` models are vision chat models: they are called on `/v1/chat/completions` like text ones and are metered per token.)

### Use the id exactly as the catalog returns it

Every id the catalog returns carries a provider prefix (`am/…`, `cc/…`, `xai/…`). A bare id is still accepted, but it is a **different route**: `gpt-5.6-terra` goes to a direct OpenAI pool, `am/gpt-5.6-terra` to the partner route. Same model, different availability — and, for models whose price is set per provider, a different coefficient (one Kimi coding route is ×4.5 where the bare spelling resolves to ×0.5). The price in `billing` belongs to the id it is published under, so call the id you read the price from.

Which prefixes exist depends on what the gateway has connected, so treat the ids in the examples below as illustrations and take the real ones from `GET /v1/models`. The worked snippets keep the short spellings the cabinet shows; your client should not.

### Charge formulas

Chat and any other call metered from prompt/completion token usage:

```
billed = ceil(prompt_tokens × coefficient.input + completion_tokens × coefficient.output)
```

Embeddings and reranking are metered from input token usage (estimated from text when the provider omits it), and that whole count is charged at `coefficient.output` — the same side every non-chat modality uses.

A route priced at coefficient 0 costs nothing; any other charged request costs at least 1 balance token.

The token counts come back in the response, so the charge is verifiable from the client side:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "am/gpt-5.6-terra",
  "choices": [
    { "index": 0, "finish_reason": "stop",
      "message": { "role": "assistant", "content": "..." } }
  ],
  "usage": { "prompt_tokens": 10000, "completion_tokens": 2000, "total_tokens": 12000 }
}
```

With the coefficient above, that answer costs `ceil(10000 × 3 + 2000 × 3)` = 36 000 balance tokens.

Images (`unit: "image"`), counted over the images actually delivered — a batch that comes back short costs what arrived, and a "success" with no image costs nothing:

```
billed = ceil(round(base_tokens × quality_multiplier × size_multiplier) × delivered_images × coefficient.output)
```

| Quality | Multiplier |
| --- | --- |
| low | ×0.25 |
| medium | ×1 |
| auto | ×1 |
| standard | ×1 |
| high | ×4 |
| hd | ×4 |

Models served by an attached subscription (`gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`) use a flatter quality ladder instead — their upstream cost does not fall with the quality knob, so a low-quality image is not a cheaper image:

| Quality (subscription-served models) | Multiplier |
| --- | --- |
| low | ×1 |
| medium | ×1 |
| auto | ×1 |
| standard | ×1 |
| high | ×2 |
| hd | ×2 |

| Size | Multiplier |
| --- | --- |
| 256x256 | ×0.4 |
| 512x512 | ×0.6 |
| 1024x1024 | ×1 |
| auto | ×1 |
| 1024x1536 | ×1.5 |
| 1536x1024 | ×1.5 |
| 1024x1792 | ×1.75 |
| 1792x1024 | ×1.75 |

Size scales the same way on every route. The ladder that applies to a given model is published with it as `billing.scales`, so a client can compute the price without hardcoding these tables or guessing which one is in force. At most 10 images are billed per request: a larger `n` is clamped to that number for both the hold and the charge, and providers may return fewer images than asked for.

Other non-token units (`character` for speech, `minute` for transcription, `request` for search and fetch) charge `ceil(base_tokens × units × coefficient.output)`; a transcription is billed by started minute, so 61 seconds counts as two.

Video is priced per second by resolution (`billing.rates`), and that rate is multiplied by the model's coefficient like every other unit — the worked example in the video section below is for a model at coefficient 1. Two rules cost real money here:

- **An omitted `duration` or `resolution` is billed at that model's maximum**, not at a cheap default: 15 seconds and its dearest supported resolution. Send both explicitly.
- **`/v1/videos/edits` and `/v1/videos/extensions` are flat-billed** at the selected model's maximum (2 625 000 raw tokens on the legacy route or 9 375 000 on 1.5), multiplied by the model coefficient, regardless of what the body says: their duration fields describe the input clip, and nothing in the request predicts the cost of the result. This is the xAI shape, where the provider bills a whole clip for either operation.
- **A model that publishes `capabilities` prices a continuation by the model instead of flat.** `/v1/videos/extensions` is billed for the seconds the model actually appends — 7 on `flow/omni-video`, 8 on `flow/veo-3.1`, 7 on `flow/veo-3.1-lite` — at the same per-second rate as a clip of that model. The step is fixed by the model, so `duration` in the body changes nothing; pass `aspect_ratio`, though — the appended fragment renders landscape unless the request says otherwise. A clip can only be continued at the quality it was shot in, so `resolution` is not read on this route either.

Metadata for a single model — the same billing block plus what the catalog recorded about it (`kind`, the endpoint to call, `params`, `capabilities`, `contextWindow` where present). `params` lists what the catalog noted for that model, not the full set its endpoint accepts — the parameter tables in the sections below are the reference for that:

```bash
curl -sS "https://anymodel.org/v1/models/info?id=am/gpt-image-2" -H "Authorization: Bearer $ANYMODEL_API_KEY"
```

```json
{
  "id": "am/gpt-image-2", "name": "GPT Image 2", "kind": "image", "owned_by": "am",
  "endpoint": "/v1/images/generations", "params": ["n", "size", "quality", "response_format"],
  "billing": {"unit":"image","base_tokens":100000,"scales":{"quality":{"low":0.25,"medium":1,"auto":1,"standard":1,"high":4,"hd":4},"size":{"256x256":0.4,"512x512":0.6,"1024x1024":1,"auto":1,"1024x1536":1.5,"1536x1024":1.5,"1024x1792":1.75,"1792x1024":1.75}},"coefficient":{"input":2.5,"output":2.5}}
}
```

## Balance

```bash
curl -sS https://anymodel.org/v1/balance -H "Authorization: Bearer $ANYMODEL_API_KEY"
```

```json
{ "object": "balance", "balance": 4200000, "unlimited": false, "status": "active", "key": "sk-a1b2c3…9f4e" }
```

`balance` is in balance tokens — the same unit the coefficients above are denominated in.

## Text models

OpenAI-compatible Chat Completions. Get a model ID from Model catalog or GET /v1/models.

```bash
curl -sS https://anymodel.org/v1/chat/completions \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "gpt-5.6-terra",
  "messages": [
    {
      "role": "user",
      "content": "Explain this code in simple terms."
    }
  ],
  "reasoning_effort": "high"
}'
```

| Parameter | Description |
| --- | --- |
| model | Required. Model ID from the catalog. |
| messages | Required. Chat history: role user, assistant, or system and content. |
| stream | Optional boolean. true returns Server-Sent Events. |
| temperature | Optional 0–2. Lower is more deterministic. |
| max_tokens | Optional maximum response tokens. |
| reasoning_effort | Optional for GPT reasoning models: none, low, medium, high. |

## Document reranking

Rank candidate passages by relevance to a query with POST /v1/rerank. The public response follows the common results/index/relevance_score shape; the model's original unbounded logit is also retained as logit.

```bash
curl -sS https://anymodel.org/v1/rerank \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "am/llama-nemotron-rerank-vl-1b-v2",
  "query": "Which passage is about astronomy?",
  "documents": [
    "Tomatoes grow best in warm weather.",
    "Saturn is the sixth planet from the Sun.",
    "A violin normally has four strings."
  ],
  "top_n": 2,
  "return_documents": true,
  "truncate": "END"
}'
```

| Parameter | Description |
| --- | --- |
| model | Required. Free models: am/llama-nemotron-rerank-vl-1b-v2. |
| query | Required string, or an object with a text field. |
| documents | Required array of strings or objects with a text field. Up to 1,000 passages. |
| top_n | Optional number of highest-ranked results to return; defaults to every document. |
| return_documents | Optional boolean. Include each matching document in the result. |
| truncate | END (default) truncates overlong input; NONE asks the provider to reject it. |

## Deep Research

Grok Multi-Agent is the live Research route. It runs on the Responses API — send it to /v1/responses, or use Chat Completions and we route it there for you. The model has no client-side function calling, so do not send tools.

```bash
curl -sS https://anymodel.org/v1/responses \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "xai/grok-4.20-multi-agent-0309",
  "input": "Research the AI coding-agent market. Compare products, pricing and recent launches, and cite the sources used."
}'
```

**GPT Deep Research (eligible OpenAI API pool required)**

```bash
curl -sS https://anymodel.org/v1/responses \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "openai/o3-deep-research",
  "input": "Produce a cited research report about the requested topic.",
  "tools": [
    {
      "type": "web_search_preview"
    }
  ]
}'
```

**Gemini grounded search**

```bash
curl -sS https://anymodel.org/v1/chat/completions \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "gemini/gemini-3-pro",
  "messages": [
    {
      "role": "user",
      "content": "Research the requested topic and cite your sources."
    }
  ],
  "tools": [
    {
      "google_search": {}
    }
  ]
}'
```

**Claude Research (server-tool capable pool required)**

```bash
curl -sS https://anymodel.org/v1/messages \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "claude-opus-5",
  "max_tokens": 8192,
  "system": "Act as a research analyst. Search the web, compare sources, and include citations.",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Research the requested topic."
        }
      ]
    }
  ],
  "tools": [
    {
      "type": "web_search_20260209",
      "name": "web_search",
      "max_uses": 12
    }
  ]
}'
```

| Parameter | Description |
| --- | --- |
| model | Use xai/grok-4.20-multi-agent-0309 for the live Grok Research route. |
| input | The research brief. State scope, comparison criteria, dates and citation requirements. |
| stream | Optional. Research can be slow; streaming keeps the connection active when supported upstream. |
| GPT | OpenAI uses openai/o3-deep-research with a hosted data-source tool. It appears only when a direct OpenAI API pool grants that model. |
| Claude | Claude has no separate Research ID. Use /v1/messages with a Claude model and web_search_20260209 (current models) or web_search_20250305 (older ones). The tool runs on Anthropic's own backend, so the selected pool has to be an Anthropic one: anywhere else the request is refused with 400 unsupported_builtin_tool rather than answered without the tool. |
| Gemini | Google names its server-side tools by key, not by a type field: send {"google_search": {}} in tools, alongside your own functions if you have them. url_context and code_execution work the same way. The search runs on Google's backend, so a Gemini pool is required. |
| citations | Sources come back as OpenAI annotations[].url_citation whichever vendor searched — on choices[].delta.annotations while streaming, on choices[].message.annotations otherwise. A Claude client on /v1/messages keeps Anthropic's native web_search_tool_result blocks instead. |

## Image generation and references

Generate with POST /v1/images/generations. The free am/flux.2-klein-4b and am/flux.1-dev routes return base64 JPEG data. Reference images are sent as data URLs in image or images; do not send a public URL unless the selected model explicitly supports it.

```bash
curl -sS https://anymodel.org/v1/images/generations \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "gpt-image-2",
  "prompt": "Editorial product photo of a ceramic coffee cup on a blue table, soft daylight",
  "n": 1,
  "size": "1792x1024",
  "quality": "high",
  "output_format": "png",
  "response_format": "b64_json",
  "images": [
    "data:image/png;base64,BASE64_REFERENCE_IMAGE"
  ]
}'
```

**Free FLUX through AnyModel**

```bash
curl -sS https://anymodel.org/v1/images/generations \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "am/flux.2-klein-4b",
  "prompt": "Editorial product photo of a ceramic coffee cup on a blue table, soft daylight",
  "n": 1,
  "size": "1024x1024",
  "response_format": "b64_json"
}'
```

**Decode a b64_json image**

```bash
jq -r ".data[0].b64_json" result.json | base64 --decode > image.png
```

| Parameter | Description |
| --- | --- |
| model | Required. Image-capable model ID, for example am/flux.2-klein-4b (free) or gpt-image-2. |
| prompt | Required. Describe the result and how a reference should be used. |
| n | Optional number of images, at most 10 — a larger value is clamped to that. Each delivered image is billed separately, from 100,000 tokens for a medium square one, scaled by quality and size. |
| size | Optional. Common values: 1024x1024, 1792x1024, 1024x1792. Availability depends on the model. |
| quality | Optional: low, medium, high, or auto where supported. The DALL·E-3 names standard and hd are accepted too, and are billed as medium and high. |
| image / images | Optional one or several base64 data URLs for references. Up to four references in Image Studio. |
| output_format | Optional png, jpeg, or webp where supported. |
| response_format | Use b64_json to receive base64 in JSON. Save it as a file locally. What a model returns without this parameter depends on the model, so pass it when you need one shape. |

## Video generation

Video is asynchronous: create a job, save request_id and the x-9router-connection-id response header, then poll until a result URL is returned. Where the provider supports it, creation also returns interaction_id — pass it back as previous_interaction_id to continue that clip. The poll answers with the upstream provider's own job body, so read its status and result fields as that provider documents them. Download the finished clip through /v1/videos/{request_id}/content rather than the provider URL directly: the same-origin route works where the provider's own cookies block a direct download, and it supports range requests.

```bash
curl -sS https://anymodel.org/v1/videos/generations \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -D video-headers.txt \
  -d '{
  "model": "xai/grok-imagine-video",
  "prompt": "Cinematic slow tracking shot through a rainy neon city alley at night",
  "duration": 8,
  "resolution": "720p",
  "aspect_ratio": "16:9"
}'
```

**Grok Imagine Video 1.5 (native 1080p)**

```bash
curl -sS https://anymodel.org/v1/videos/generations \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -D video-headers.txt \
  -d '{
  "model": "xai/grok-imagine-video-1.5",
  "prompt": "Slow cinematic push-in as the subject turns toward the sunrise",
  "duration": 8,
  "resolution": "1080p",
  "aspect_ratio": "16:9"
}'
```

**Continue the clip (Flow)**

```bash
curl -sS https://anymodel.org/v1/videos/extensions \
  -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
  "model": "flow/omni-video",
  "prompt": "The camera keeps moving forward as the character turns the corner",
  "previous_interaction_id": "INTERACTION_ID"
}'
```

**Poll job status**

```bash
curl -sS "https://anymodel.org/v1/videos/REQUEST_ID" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "x-9router-connection-id: OPAQUE_TICKET"
```

**Download the result**

```bash
curl -sS "https://anymodel.org/v1/videos/REQUEST_ID/content" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "x-9router-connection-id: OPAQUE_TICKET" \
  -o clip.mp4
```

| Parameter | Description |
| --- | --- |
| model | Use xai/grok-imagine-video or xai/grok-imagine-video-1.5. Version 1.5 supports native 1080p for text-to-video and image-to-video. |
| prompt | Required. Describe motion, camera, subject, lighting and style. |
| image | Optional for image-to-video: { url: "https://..." } or a supported data URL containing the source frame. |
| duration | 1–15 seconds. Billed per started second. Omit it and the request is billed for the full 15 seconds — send it explicitly. |
| resolution | 480p or 720p on grok-imagine-video; 480p, 720p, or 1080p on grok-imagine-video-1.5. Omit it and the request is billed at that model's dearest rate. |
| aspect_ratio | Optional output aspect ratio, for example 16:9, 9:16, 1:1, 4:3, or 3:4. Image-to-video defaults to the source image ratio. |
| end_image | Optional last frame, alongside image, on models whose params list end_image: the clip travels from the first frame to this one. |
| previous_interaction_id | Required on /v1/videos/extensions: the interaction_id of the clip to continue. The clip must have been created with the same API key. Pass the aspect_ratio the source clip was shot in — the provider renders the appended fragment landscape by default, and a portrait scene would gain a horizontal tail. Creation returns the id next to request_id on providers that support this route, and the same value is accepted as interaction_id. A continuation keeps the characters and the voice of the clip it extends, so no frames are sent with it. |

| Header | Description |
| --- | --- |
| Idempotency-Key | Optional. Forwarded to the provider, which answers a retry with the job it already created. That answer is recognised here and is not charged a second time. |
| x-9router-connection-id | Returned on create — an opaque ticket for one job. Save it with the request_id and send it on every poll and download: that is the documented path. A client that cannot read response headers may omit it and poll with the same API key that created the job, and the gateway resolves the binding itself. |

| Billing | Description |
| --- | --- |
| Price | duration × the selected model's resolution rate: grok-imagine-video: 480p — 125,000 tokens per second, 720p — 175,000 tokens per second; grok-imagine-video-1.5: 480p — 200,000 tokens per second, 720p — 350,000 tokens per second, 1080p — 625,000 tokens per second. An 8-second 480p clip on grok-imagine-video costs 1,000,000 tokens. A request that names neither duration nor resolution is billed at that model's maximum (2,625,000 for the legacy route; 9,375,000 for 1.5). |
| Edits and extensions | On the xAI routes /v1/videos/edits and /v1/videos/extensions are flat-billed at the selected model's maximum (2,625,000 tokens on the legacy route; 9,375,000 on 1.5): their duration fields describe the input clip, so the body cannot price the result. |
| Continuations | A model that declares capabilities (flow/*) prices a continuation by the model, not flat: 7 s on flow/omni-video, 8 s on flow/veo-3.1, 7 s on flow/veo-3.1-lite for one step, at the same per-second rate as a clip of that model. duration is not read on this route: the step is fixed by the model. resolution is not read either — a clip is continued at the quality it was shot in. |
| Charge | Booked once, when the provider accepts the job. Polling and downloading are free. |
| Refund | A job that ends without a video is returned in full: automatically for jobs started in Video Studio, and on the poll that first reports the failure for jobs created through this API. Keep polling a job you have given up on — through this API the refund is what that poll triggers. |

## Streaming

Send `"stream": true` to receive Server-Sent Events in the OpenAI chunk format, terminated by `data: [DONE]`:

```
data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"}}]}

data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hel"}}]}

data: {"id":"chatcmpl-...","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

The first chunk may carry only the role, and a chunk may carry an empty `delta` — read `choices[0].delta.content` and skip what is absent. Streaming is charged exactly like a non-streamed call, by the same formula: the whole prompt plus the completion tokens actually produced, so a stream cut short pays for the answer it delivered rather than the one it was going to.

A stream carries no `usage` by default. Send `"stream_options": {"include_usage": true}` to ask for a final chunk that has one — most routes pass it upstream, but a provider that does not support the parameter simply drops it, so treat the usage chunk as optional and fall back to comparing `GET /v1/balance` before and after when you need the exact figure.

## Errors

Failures return the OpenAI error shape with the HTTP status repeated in the body:

```json
{ "error": { "message": "...", "type": "...", "code": "...", "status": 429, "request_id": "..." } }
```

An error response carries `X-Request-Id` (also repeated as `request_id` in the body) — quote it when reporting a problem. A `429` also carries `Retry-After` in seconds.

| Status | type | code |
| --- | --- | --- |
| 400 | invalid_request_error | bad_request |
| 401 | authentication_error | invalid_api_key |
| 402 | billing_error | payment_required |
| 403 | permission_error | insufficient_quota |
| 404 | invalid_request_error | model_not_found |
| 406 | invalid_request_error | model_not_supported |
| 422 | invalid_request_error | unprocessable_request |
| 429 | rate_limit_error | rate_limit_exceeded |
| 500 | server_error | internal_server_error |
| 502 | server_error | bad_gateway |
| 503 | server_error | service_unavailable |
| 504 | server_error | gateway_timeout |

- `401` — the key is missing, revoked or mistyped.
- `402` — the balance ran out; top it up in the cabinet. This, not `403`, is the out-of-money answer.
- `403` — the account behind the key is not active (blocked, or the email is not confirmed yet). Its `code` reads `insufficient_quota` for OpenAI-SDK compatibility; do not map it to "top up".
- `429` — slow down and retry after `Retry-After` seconds.
- `5xx` — transient; retry with backoff. A request that produced no output is not charged, with one exception: a video job is booked once the provider accepts it, and a job that then ends without a video is reversed by a refund (see the video section).

This is the shape on every endpoint, including the Anthropic-format `/v1/messages`; only the Gemini-compatible `/v1beta` routes answer in Google's error shape.
