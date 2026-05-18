#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const inputPath = path.resolve(
  repoRoot,
  process.argv[2] ?? process.env.OFONE_VOICEOVER_INPUT ?? "media/remotion/voiceover/ofone-walkthrough-voiceover.txt"
);
const outputPath = path.resolve(
  repoRoot,
  process.argv[3] ?? process.env.OFONE_VOICEOVER_OUTPUT ?? "media/remotion/public/audio/ofone-walkthrough.mp3"
);

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const voice = process.env.OPENAI_TTS_VOICE ?? "alloy";
const responseFormat = process.env.OPENAI_TTS_FORMAT ?? "mp3";
const speed = Number(process.env.OPENAI_TTS_SPEED ?? "1");

if (!apiKey) {
  console.error("OPENAI_API_KEY is required to generate the OfOne voiceover.");
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Voiceover input not found: ${path.relative(repoRoot, inputPath)}`);
  process.exit(1);
}

const input = fs.readFileSync(inputPath, "utf8").trim();
if (!input) {
  console.error("Voiceover input is empty.");
  process.exit(1);
}

const response = await fetch("https://api.openai.com/v1/audio/speech", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model,
    voice,
    input,
    response_format: responseFormat,
    speed
  })
});

if (!response.ok) {
  const body = await response.text();
  console.error(`OpenAI speech request failed with HTTP ${response.status}:`);
  console.error(body);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const audio = Buffer.from(await response.arrayBuffer());
fs.writeFileSync(outputPath, audio);

console.log(`Wrote ${path.relative(repoRoot, outputPath)} using ${model}/${voice}.`);
