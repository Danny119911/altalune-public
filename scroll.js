// Trigger gate fade‑in as soon as the user scrolls even 1 pixel
window.addEventListener('scroll', () => {
    document.body.classList.add('scrolled');
}, { once: true });

