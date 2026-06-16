// === Activation du mode JS ===
document.body.classList.add("js-enabled");

// Variables globales
let lastTrigger = null; // utilisé pour exercice modal

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

// exercice toggle class
const btn = document.querySelector(".toggle-btn");
const box = document.querySelector(".toggle-box");

if (btn && box) {
  btn.addEventListener("click", () => {
    box.classList.toggle("active");
  });
}

// exercice menu mobile
const toggleBtn = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-list");

if (toggleBtn && navList) {
  toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("open");

    const isOpen = navList.classList.contains("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
  });
}

// menu se ferme quand on clique sur un lien
const links = document.querySelectorAll(".nav-list a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("open");
  });
});

// menu se ferme si on clique en dehors du menu
document.addEventListener("click", (event) => {
  const clickedInsideMenu = navList.contains(event.target);
  const clickedButton = toggleBtn.contains(event.target);

  if (!clickedInsideMenu && !clickedButton) {
    navList.classList.remove("open");
  }
});

// faq accordéon
const questions = document.querySelectorAll(".faq-question");
const answers = document.querySelectorAll(".faq-answer");

questions.forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.classList.contains("open");

    answers.forEach((answer) => {
      answer.classList.remove("open");
    });

    if (!isOpen) {
      answer.classList.add("open");
    }
  });
});

// onglets tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  // bouton clique
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.tab;
    const targetPanel = document.querySelector(`#${targetId}`);

    tabButtons.forEach((b) => {
      // tous les boutons
      b.classList.remove("active");
    });

    tabPanels.forEach((panel) => {
      panel.classList.remove("active");
    });

    btn.classList.add("active");

    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  });
});

// filtre de projets
const filterDemo = document.querySelector(".js-filter-demo");

if (filterDemo) {
  const filterButtons = filterDemo.querySelectorAll(".filter-btn");
  const projects = filterDemo.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      projects.forEach((project) => {
        const category = project.dataset.category;

        if (filterValue === "all" || category === filterValue) {
          project.classList.remove("hidden");
          project.classList.remove("is-hidden");
        } else {
          project.classList.add("hidden");
          setTimeout(() => {
            project.classList.add("is-hidden");
          }, 250);
        }
      });
    });
  });
}

// exercice accordion
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");

  items.forEach((item) => {
    const btn = item.querySelector(".accordion-btn");
    const icon = item.querySelector(".accordion-icon");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      items.forEach((el) => {
        el.classList.remove("active");

        const elIcon = el.querySelector(".accordion-icon");
        if (elIcon) {
          elIcon.textContent = "+";
        }
      });

      if (!isOpen) {
        item.classList.add("active");
        if (icon) {
          icon.textContent = "-";
        }
      }
    });
  });
});

// exercice modal
// Sélection des éléments
const openButtons = document.querySelectorAll("[data-modal-target]");
const modals = document.querySelectorAll(".modal");

function getFocusableElements(modal) {
  return modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
}

function openModal(modal, trigger) {
  lastTrigger = trigger;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  const content = modal.querySelector(".modal-content");
  content.focus();
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (lastTrigger) {
    lastTrigger.focus();
  }
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selector = button.dataset.modalTarget;
    const targetModal = document.querySelector(selector);

    if (!targetModal) return;

    openModal(targetModal, button);
  });
});

modals.forEach((currentModal) => {
  const closeBtn = currentModal.querySelector(".modal-close");
  const overlay = currentModal.querySelector(".modal-overlay");

  closeBtn.addEventListener("click", () => {
    closeModal(currentModal);
  });

  overlay.addEventListener("click", () => {
    closeModal(currentModal);
  });
});

document.addEventListener("keydown", (e) => {
  const openModalElement = document.querySelector(".modal.is-open");

  if (!openModalElement) return;

  if (e.key === "Escape") {
    closeModal(openModalElement);
    return;
  }

  if (e.key === "Tab") {
    const focusableElements = getFocusableElements(openModalElement);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
