/* ============================================================================
  normalizar_html_nota.js — Normas Bloco de Notas
   versão 0.6

============================================================================ */

export function normalizarHTMLNota(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const permitidas = ["P", "H1", "H2", "UL", "LI", "STRONG", "EM", "U", "SPAN"];

  doc.body.querySelectorAll("*").forEach((el) => {
    if (!permitidas.includes(el.tagName)) {
      el.replaceWith(...el.childNodes);
      return;
    }

    [...el.attributes].forEach((attr) => {
      if (
        el.tagName === "SPAN" &&
        attr.name === "data-highlight" &&
        ["yellow", "green", "blue"].includes(attr.value)
      )
        return;

      el.removeAttribute(attr.name);
    });

    if (el.tagName === "SPAN" && !el.hasAttribute("data-highlight")) {
      el.replaceWith(...el.childNodes);
    }
  });

  return doc.body.innerHTML;
}
