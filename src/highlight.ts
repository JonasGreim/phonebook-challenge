export interface HighlightPart {
  highlighted: boolean;
  text: string;
}

export function getHighlightParts(
  name: string,
  query: string,
): HighlightPart[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('de-DE');
  if (!normalizedQuery) return [{ highlighted: false, text: name }];

  const normalizedName = name.toLocaleLowerCase('de-DE');
  const parts: HighlightPart[] = [];
  let startIndex = 0;
  let matchIndex = normalizedName.indexOf(normalizedQuery, startIndex);

  while (matchIndex !== -1) {
    if (matchIndex > startIndex) {
      parts.push({
        highlighted: false,
        text: name.slice(startIndex, matchIndex),
      });
    }
    parts.push({
      highlighted: true,
      text: name.slice(matchIndex, matchIndex + normalizedQuery.length),
    });
    startIndex = matchIndex + normalizedQuery.length;
    matchIndex = normalizedName.indexOf(normalizedQuery, startIndex);
  }

  if (startIndex < name.length) {
    parts.push({ highlighted: false, text: name.slice(startIndex) });
  }

  return parts.length ? parts : [{ highlighted: false, text: name }];
}
