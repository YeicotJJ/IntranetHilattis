import DOMPurify from "dompurify"

export function sanitizeInput(input) {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input.trim())
  } else if (typeof input === "object" && input !== null) {
    return Object.keys(input).reduce((acc, key) => {
      acc[key] = sanitizeInput(input[key])
      return acc
    }, {})
  }
  return input
}

