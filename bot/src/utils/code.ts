export function decodeCode(encoded: string): {
  code: string | undefined;
  state: string | undefined;
} {
  const [base64Code, base64State] = encoded.split(":");

  return {
    code: base64Code && Buffer.from(base64Code, "base64").toString("utf-8"),
    state: base64State && Buffer.from(base64State, "base64").toString("utf-8"),
  };
}
