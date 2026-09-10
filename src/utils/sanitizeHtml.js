const ALLOWED_TAGS = ["B", "I", "U", "MARK"];

export function sanitizeLyricsHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;

  function cleanNode(node) {
    // Remove comments
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      return;
    }

    // Text nodes are fine
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    // Remove anything that isn't an element
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    // If the tag isn't allowed, keep its text/content
    // but remove the tag itself.
    if (!ALLOWED_TAGS.includes(node.tagName)) {
      const parent = node.parentNode;

      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }

      node.remove();
      return;
    }

    // Allowed tags: remove all attributes
    [...node.attributes].forEach((attribute) => {
      node.removeAttribute(attribute.name);
    });

    [...node.childNodes].forEach(cleanNode);
  }

  [...div.childNodes].forEach(cleanNode);

  return div.innerHTML;
}
