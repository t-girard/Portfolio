document.addEventListener("DOMContentLoaded", function () {
    const a_list = Array.from(document.querySelectorAll("main>a"));
    const arrowL = document.getElementById("arrowL");
    const arrowR = document.getElementById("arrowR");
    let isAnimating = false;
    let autoRotateTimer;

    function startAutoRotate() {
        clearInterval(autoRotateTimer);
        autoRotateTimer = setInterval(() => {
            rotate_a_list("left");
        }, 6000);
    }

    a_list.forEach(a => {
        a.addEventListener("click", function (e) {
            if (isAnimating) e.preventDefault();
        });
    });

    function rotate_a_list(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const positions = a_list.slice(0, 3).map(a => ({
            left: a.offsetLeft,
            top: a.offsetTop
        }));

        a_list[3].style.transition = "none";
        a_list[3].style.transform = "none";

        if (direction === "left") {
            a_list[3].innerHTML = a_list[0].innerHTML;
            a_list[3].setAttribute("href", a_list[0].getAttribute("href"));
            a_list[3].style.left = "200vw";
            a_list[3].style.top = "200vh";
        } else {
            a_list[3].innerHTML = a_list[2].innerHTML;
            a_list[3].setAttribute("href", a_list[2].getAttribute("href"));
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                a_list.forEach((a, index) => {
                    a.style.transition = "transform 0.5s ease-in-out";
                    if (direction === "left") {
                        if (index === 0) {
                            a.style.transform = `translate(-145vw, 200vh)`;
                        } else if (index < 3) {
                            const dx = positions[index - 1].left - positions[index].left;
                            const dy = positions[index - 1].top - positions[index].top;
                            a.style.transform = `translate(${dx}px, ${dy}px)`;
                        } else {
                            a.style.transform = `translate(-120vw, -160vh)`;
                        }
                    } else {
                        if (index === 2) {
                            a.style.transform = `translate(200vw, 200vh)`;
                        } else if (index < 3) {
                            const dx = positions[index + 1].left - positions[index].left;
                            const dy = positions[index + 1].top - positions[index].top;
                            a.style.transform = `translate(${dx}px, ${dy}px)`;
                        } else {
                            a.style.transform = `translate(120vw, -160vh)`;
                        }
                    }
                });

                setTimeout(() => {
                    a_list.forEach(a => {
                        a.style.transition = "none";
                        a.style.transform = "none";
                    });

                    if (direction === "left") {
                        const newContents = a_list.slice(1, 4).map(a => ({
                            html: a.innerHTML,
                            href: a.getAttribute("href")
                        }));
                        for (let i = 0; i < 3; i++) {
                            a_list[i].innerHTML = newContents[i].html;
                            a_list[i].setAttribute("href", newContents[i].href);
                        }
                    } else {
                        const newContents = [
                            a_list[3],
                            a_list[0],
                            a_list[1]
                        ].map(a => ({
                            html: a.innerHTML,
                            href: a.getAttribute("href")
                        }));
                        for (let i = 0; i < 3; i++) {
                            a_list[i].innerHTML = newContents[i].html;
                            a_list[i].setAttribute("href", newContents[i].href);
                        }
                    }

                    a_list[3].style.left = "-145vw";
                    a_list[3].style.top = "200vh";
                    startAutoRotate();
                    isAnimating = false;
                }, 500);
            });
        });
    }

    startAutoRotate();
    arrowR.addEventListener("click", () => rotate_a_list("right"));
    arrowL.addEventListener("click", () => rotate_a_list("left"));
});

document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector('header nav button.languageButton');
    const link = document.querySelector('header nav a.languageLink');
    link.style.display = "none";

    btn.addEventListener('click', function(event) {
        event.stopPropagation();
        link.style.display = (link.style.display === "none") ? "inline-flex" : "none";
    });

    document.addEventListener('click', function(event) {
        if (link.style.display !== "none") {
            link.style.display = "none";
        }
    });

    link.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Ajuste la taille du texte pour que le contenu .bouton-ensavoirplus tienne sur une seule ligne.
// Part d'une taille par défaut (24px) et descend jusqu'à minFontSize.
// Exécute au chargement et au resize (debounced).

(function () {
  const DEFAULT_SIZE = 24; // taille par défaut demandée
  const MIN_SIZE = 10;     // taille minimale acceptée
  const STEP = 0.5;        // diminution en px par itération (précision)
  const DEBOUNCE_MS = 120;

  function fitOne(btn) {
    // on choisit le span s'il existe, sinon le bouton lui-même
    const text = btn.querySelector('span');
    // remettre la taille par défaut avant de tester
    text.style.fontSize = DEFAULT_SIZE + 'px';

    // si le texte déborde (scrollWidth > clientWidth) on réduit progressivement
    // on boucle mais on protège contre les boucles infinies en utilisant MIN_SIZE
    let current = parseFloat(getComputedStyle(text).fontSize);
    // floating small loop — ok car les boutons rares et courts
    while (text.scrollWidth > btn.clientWidth -15 && current > MIN_SIZE) {
      current = Math.max(MIN_SIZE, current - STEP);
      text.style.fontSize = current + 'px';
      // si atteint min, on s'arrête ; ellipsis CSS montrera "..." si ça dépasse encore
      if (current <= MIN_SIZE) break;
    }
  }

  function fitAll() {
    const buttons = document.querySelectorAll('.bouton-ensavoirplus');
    buttons.forEach(btn => {
      // pour certains layouts, il est utile de forcer un reflow avant de mesurer
      // (read clientWidth triggers reflow)
      void btn.offsetWidth;
      fitOne(btn);
    });
  }

  // debounce helper
  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  // run on DOMContentLoaded et sur resize
  document.addEventListener('DOMContentLoaded', fitAll);
  window.addEventListener('resize', debounce(fitAll, DEBOUNCE_MS));

  // MutationObserver pour détecter un changement de texte dynamique (facultatif mais utile)
  const observer = new MutationObserver(debounce(fitAll, 60));
  document.querySelectorAll('.bouton-ensavoirplus').forEach(btn => {
    observer.observe(btn, { childList: true, subtree: true, characterData: true });
  });

  // si des boutons sont ajoutés dynamiquement plus tard, on peut détecter le container parent
  // (optionnel) : observer globale qui ajoute l'observer sur les nouveaux .bouton-ensavoirplus
  const bodyObs = new MutationObserver(debounce(() => {
    document.querySelectorAll('.bouton-ensavoirplus').forEach(btn => {
      observer.observe(btn, { childList: true, subtree: true, characterData: true });
    });
    fitAll();
  }, 200));
  bodyObs.observe(document.body, { childList: true, subtree: true });

})();
