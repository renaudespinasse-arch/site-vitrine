// === Activation du mode JS ===
document.body.classList.add("js-enabled");

// Sélectionne toutes les sections ayant un data-anim
const animatedSections = document.querySelectorAll("[data-anim]");

// Crée l’observateur principal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return; // ignore si pas visible

      const section = entry.target;
      const type = section.dataset.anim; // récupère "fade" ou "stagger"

      // Cas 1 : animation simple (fade)
      if (type === "fade") {
        section.classList.add("visible");
      }

      // Cas 2 : animation en cascade (stagger)
      if (type === "stagger") {
        const items = section.querySelectorAll(".card, .reveal-item");
        items.forEach((item, index) => {
          setTimeout(() => item.classList.add("visible"), index * 200);
        });
      }

      // Stoppe l’observation après le premier déclenchement
      observer.unobserve(section);
    });
  },
  { threshold: 0.2 },
);

// Observe chaque section animée
animatedSections.forEach((section) => observer.observe(section));

// Contact form UX (sans backend)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const messageInput = form.querySelector("#message");
  const charCount = form.querySelector(".char-count");
  const MAX_CHARS = 300;

  messageInput.addEventListener("input", () => {
    const length = messageInput.value.length;
    charCount.textContent = `${length} / ${MAX_CHARS}`;

    if (length > MAX_CHARS) {
      charCount.classList.add("is-error");
    } else {
      charCount.classList.remove("is-error");
    }
  });

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  // Crée un message de feedback (inséré après le bouton)
  const feedback = document.createElement("p");
  feedback.className = "form-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;

  submitBtn.insertAdjacentElement("afterend", feedback);

  function showError(msg) {
    feedback.textContent = msg;
    feedback.classList.remove("is-success");
    feedback.classList.add("is-error");
    feedback.hidden = false;
  }

  function showSuccess(msg) {
    feedback.textContent = msg;
    feedback.classList.remove("is-error");
    feedback.classList.add("is-success");
    feedback.hidden = false;
  }

  const emailInput = form.querySelector("#email");

  // ✅ Super fiable : se déclenche dès qu'un champ est invalide (même si submit est bloqué)
  form.addEventListener(
    "invalid",
    () => {
      if (emailInput && emailInput.validity.valueMissing) {
        showError("⚠️ Merci de renseigner votre email.");
      } else {
        showError("⚠️ Merci de corriger les champs indiqués.");
      }
    },
    true, // capture indispensable pour "invalid"
  );

  // Option UX : dès que l'utilisateur modifie un champ, on masque le message global
  form.addEventListener("input", () => {
    feedback.hidden = true;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // on garde la main sur le submit

    // Laisse le navigateur afficher ses messages natifs si invalide
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (messageInput.value.length > MAX_CHARS) {
      showError("⚠️ Le message ne doit pas dépasser 300 caractères.");
      return;
    }

    // Cas valide → comportement normal (UX)
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Envoi...";

    window.setTimeout(() => {
      showSuccess("✅ Merci ! Votre message a bien été envoyé.");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 600);
  });
});
