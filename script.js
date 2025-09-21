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
    const link = document.querySelector('header nav a.languageButton');
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
