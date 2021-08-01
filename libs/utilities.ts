export function capitalize(string: string | string[] | undefined): string | string[] | undefined {
  if (typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return string
}