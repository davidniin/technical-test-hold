
const toTimestamp = (dateValue) => {
  if (!dateValue) return 0;
  const timestamp = new Date(dateValue).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

const compareVersionStrings = (versionA, versionB) => {
  const partsA = String(versionA).split('.').map(part => parseInt(part, 10) || 0);
  const partsB = String(versionB).split('.').map(part => parseInt(part, 10) || 0);
  const maxLength = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLength; i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a !== b) {
      return a - b;
    }
  }
  return 0;
}

const compareDocumentsByField = (field, docA, docB) => {
  switch (field) {
    case 'name': {
      const nameA = String(docA?.name ?? docA?.Title ?? '').toLowerCase();
      const nameB = String(docB?.name ?? docB?.Title ?? '').toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    }
    case 'version': {
      const versionA = docA?.version ?? docA?.Version ?? '0';
      const versionB = docB?.version ?? docB?.Version ?? '0';
      return compareVersionStrings(versionA, versionB);
    }
    case 'createdAt': {
      const timestampA = toTimestamp(docA?.createdAt ?? docA?.UpdatedAt ?? docA?.CreatedAt);
      const timestampB = toTimestamp(docB?.createdAt ?? docB?.UpdatedAt ?? docB?.CreatedAt);
      return timestampA - timestampB;
    }
    default: {
      console.warn(`Unknown sort field: ${field}`);
      return 0;
    }
  }
}

export const sortDocuments = (documentList, sortExpression = 'createdAt:desc') => {
  if (!Array.isArray(documentList)) {
    console.warn('sortDocuments: input must be an array');
    return [];
  }

  if (documentList.length === 0) {
    return [];
  }

  if (sortExpression === 'none' || !sortExpression) {
    return documentList.slice();
  }

  const [rawField, rawDirection] = String(sortExpression).split(':');
  const field = rawField?.trim();
  const direction = rawDirection?.trim() || 'desc';
  
  const multiplier = direction === 'asc' ? 1 : -1;
  const sortedArray = documentList.slice();
  
  sortedArray.sort((a, b) => {
    const primaryComparison = compareDocumentsByField(field, a, b);
    if (primaryComparison !== 0) {
      return primaryComparison * multiplier;
    }
    return compareDocumentsByField('name', a, b);
  });
  return sortedArray;
}
