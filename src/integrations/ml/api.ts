import { ML_API_URL } from "./config";
import type { PredictionResponse } from "./types";

export async function predictDisease(file: File): Promise<PredictionResponse> {
  const form = new FormData();
  form.append("image", file);

  const resp = await fetch(`${ML_API_URL}/predict`, {
    method: "POST",
    body: form,
  });

  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`Prediction failed: ${resp.status} ${msg}`);
  }

  return (await resp.json()) as PredictionResponse;
}