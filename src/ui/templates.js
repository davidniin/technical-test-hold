
export const renderDocumentRow = (doc) => {
  const contributorsHtml = formatListItemsHtml(doc.contributors);
  const attachmentsHtml = formatListItemsHtml(doc.attachments);

  const id = escapeHtml(doc.id);
  const name = escapeHtml(doc.name || 'Untitled');
  const version = doc.version ?? '';

  return `
    <article class="row" data-id="${id}">
      <div class="list-col">
        <div class="name">${name}</div>
        <div class="version">Version ${escapeHtml(version)}</div>
      </div>
      <div class="list-col">${contributorsHtml}</div>
      <div class="list-col">${attachmentsHtml}</div>
    </article>
  `;
}

export const listRow = renderDocumentRow;


const formatListItemsHtml = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  return items.map(i => escapeHtml(i)).join('<br/>');
}

const escapeHtml = (s) => {
  return String(s ?? '').replace(/[&<>"']/g, (m) =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m])
  );
}
