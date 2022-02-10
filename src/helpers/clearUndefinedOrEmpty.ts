export function clearUndefinedOrEmpty(
  object: Record<string, string>,
): Record<string, string> {
  const newObject = object;
  for (const propertyName in newObject) {
    if (
      newObject[propertyName] === undefined ||
      newObject[propertyName]?.length === 0
    ) {
      delete newObject[propertyName];
    }
  }
  return newObject;
}
