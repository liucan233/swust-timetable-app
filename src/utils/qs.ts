export default {
  parse: (obj: Record<string, unknown>) =>
    Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join("&"),
};
