type ApiErrorResponse = { error?: string }

export async function readApiErrorMessage(res: Response): Promise<string | null> {
  try {
    const json: unknown = await res.json()
    if (typeof json === "object" && json !== null && "error" in json) {
      const msg = (json as ApiErrorResponse).error
      return typeof msg === "string" && msg.trim() !== "" ? msg : null
    }
    return null
  } catch {
    return null
  }
}

