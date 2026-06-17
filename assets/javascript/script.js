$(document).ready(() => {
  $(window).scroll(() => {
    if ($(window).scrollTop() > 30) {
      $(".overlay_header").addClass("scrolled");
    } else {
      $(".overlay_header").removeClass("scrolled");
    }
  });

  const carousel = document.getElementById("portfolio_wrapper_infinite_carousel");

  if (carousel) {
    const originalItems = Array.from(carousel.children);
    let cycleWidth = 0;
    let position = 0;
    let lastTime = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPosition = 0;
    let resumeAt = 0;
    const speed = 45;
    const resumeDelay = 700;

    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      carousel.appendChild(clone);
    });

    const calculateCycleWidth = () => {
      cycleWidth =
        carousel.children[originalItems.length]?.offsetLeft || carousel.scrollWidth / 2;
      normalizePosition();
      updateTransform();
    };

    const normalizePosition = () => {
      if (!cycleWidth) return;

      while (position <= -cycleWidth) {
        position += cycleWidth;
      }

      while (position > 0) {
        position -= cycleWidth;
      }
    };

    const updateTransform = () => {
      carousel.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    const stopDragging = (event) => {
      if (!isDragging) return;

      isDragging = false;
      carousel.classList.remove("is-dragging");
      carousel.releasePointerCapture?.(event.pointerId);
      resumeAt = performance.now() + resumeDelay;
    };

    carousel.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      isDragging = true;
      dragStartX = event.clientX;
      dragStartPosition = position;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      event.preventDefault();
      position = dragStartPosition + event.clientX - dragStartX;
      normalizePosition();
      updateTransform();
    });

    carousel.addEventListener("pointerup", stopDragging);
    carousel.addEventListener("pointercancel", stopDragging);
    carousel.addEventListener("pointerleave", stopDragging);

    carousel.addEventListener("click", (event) => {
      if (Math.abs(position - dragStartPosition) > 5) {
        event.preventDefault();
      }
    });

    const animate = (time) => {
      if (!lastTime) {
        lastTime = time;
      }

      const deltaSeconds = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDragging && time >= resumeAt) {
        position -= speed * deltaSeconds;
        normalizePosition();
        updateTransform();
      }

      requestAnimationFrame(animate);
    };

    calculateCycleWidth();
    window.addEventListener("resize", calculateCycleWidth);
    requestAnimationFrame(animate);
  }
});
