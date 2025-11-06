const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const HTML_ESCAPE_REGEX = /[&<>"']/g;

const escapeHtml = (value) => {
  return String(value ?? '').replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char]);
};

const formatListItemsHtml = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '—';
  }

  return items.map(escapeHtml).join('<br/>');
};

const prepareDocumentData = (doc) => {
  return {
    id: escapeHtml(doc.id),
    name: escapeHtml(doc.name || 'Untitled'),
    version: escapeHtml(doc.version ?? '1.0.0'),
    contributors: formatListItemsHtml(doc.contributors),
    attachments: formatListItemsHtml(doc.attachments)
  };
};

const renderListRow = (doc) => {
  const data = prepareDocumentData(doc);

  return `<article class="row" data-id="${data.id}">
  <div class="list-col">
    <div class="name">${data.name}</div>
    <div class="version">Version ${data.version}</div>
  </div>
  <div class="list-col">${data.contributors}</div>
  <div class="list-col">${data.attachments}</div>
</article>`;
};

const renderGridCard = (doc) => {
  const data = prepareDocumentData(doc);

  return `<article class="card" data-id="${data.id}">
  <h3>${data.name}</h3>
  <div class="version">Version ${data.version}</div>
  <div class="stack">
    <strong>Contributors:</strong><br/>${data.contributors}
    <br/><br/>
    <strong>Attachments:</strong><br/>${data.attachments}
  </div>
</article>`;
};


export const listRow = renderListRow;
export const gridRow = renderGridCard;