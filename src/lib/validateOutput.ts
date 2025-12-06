import Ajv from "ajv";
import schema from "@/src/schemas/medhealth_output.schema.json";

export function validateMedHealthOutput<T = unknown>(data: T): T {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = (validate.errors || [])
      .map((e) => `${e.instancePath || "<root>"} ${e.message}`)
      .join("; ");
    const err = new Error("Invalid LLM output based on MedHealth schema: " + errors);
    (err as Error & { details?: unknown }).details = validate.errors;
    throw err;
  }

  return data;
}

