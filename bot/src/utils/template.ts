export function template<K extends string | number>(
  strings: TemplateStringsArray,
  ...keys: K[]
) {
  return (dict: Record<K, string | number>): string => {
    const result: (string | number | undefined | string[] | number[])[] = [
      strings[0],
    ];

    for (const [i, key] of keys.entries()) {
      result.push(dict[key], strings[i + 1]);
    }

    return result.join("");
  };
}
