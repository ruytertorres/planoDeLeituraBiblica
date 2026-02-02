/* ============================================================================
   footer.js — Funcionalidades do Footer Profissional
============================================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Atualizar ano atual
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Atualizar versão do app
  const appVersionElement = document.getElementById("app-version");
  if (appVersionElement) {
    appVersionElement.textContent = "2.1.0";
  }

  // Atualizar data da última atualização
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("pt-BR");
    lastUpdateElement.textContent = formattedDate;
  }

  // Adicionar funcionalidade aos links de navegação
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-nav");

      // Implementar navegação real aqui
      switch (section) {
        case "home":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "calendar":
          const calendarElement = document.getElementById("calendar");
          if (calendarElement) {
            calendarElement.scrollIntoView({ behavior: "smooth" });
          }
          break;
        case "notes":
          const notasButton = document.getElementById("btn-notas");
          if (notasButton) {
            notasButton.click();
          }
          break;
        default:
      }
    });
  });

  // Adicionar funcionalidade aos links de ação
  document.querySelectorAll("[data-action]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const action = this.getAttribute("data-action");

      // Implementar ações reais aqui
      switch (action) {
        case "faq":
          alert("FAQ: Em desenvolvimento");
          break;
        case "tips":
          alert("Dicas de Leitura: Em desenvolvimento");
          break;
        case "versions":
          alert("Versões da Bíblia: Em desenvolvimento");
          break;
        case "guide":
          alert("Guia de Uso: Em desenvolvimento");
          break;
        case "contact":
          alert("Contato: Em desenvolvimento");
          break;
        default:
      }
    });
  });

  // Funcionalidade dos links sociais
  document.querySelectorAll(".social-icon").forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.preventDefault();
      const title = this.getAttribute("title");

      // Implementar ações sociais reais aqui
      switch (title) {
        case "Compartilhar":
          if (navigator.share) {
            navigator.share({
              title: "Leitura Bíblica Cronológica",
              text: "Transforme sua vida através da leitura organizada das Escrituras.",
              url: window.location.href,
            });
          } else {
            // Fallback para navegadores que não suportam Web Share API
            const dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            alert("Link copiado para a área de transferência!");
          }
          break;
        case "Feedback":
          alert("Feedback: Em desenvolvimento");
          break;
        case "Ajuda":
          alert("Ajuda: Em desenvolvimento");
          break;
      }
    });
  });

  // Links legais
  document.querySelectorAll(".legal-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const text = this.textContent;
      alert(`${text}: Em desenvolvimento`);
    });
  });
});
