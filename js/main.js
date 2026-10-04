(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  /* Contact links: one source of truth in data.js */
  $$("[data-link]").forEach((a) => {
    const v = SITE[a.dataset.link];
    if (v) a.href = a.dataset.link === "email" ? `mailto:${v}` : `https://${v}`;
  });
  $$("[data-text]").forEach((n) => (n.textContent = SITE[n.dataset.text]));

  /* Projects */
  const linkBtn = (label, href) => {
    const a = el("a", "btn ghost sm", label);
    if (href) {
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.setAttribute("aria-disabled", "true");
      a.title = "Link coming soon";
    }
    return a;
  };

  PROJECTS.forEach((p) => {
    const card = el("article", "card project reveal");
    const thumb = el("div", "thumb");
    thumb.append(
      el(
        "span",
        null,
        p.title
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 3),
      ),
    );
    if (p.image) {
      const img = new Image();
      img.alt = `${p.title} preview`;
      img.loading = "lazy";
      img.onload = () => thumb.append(img); // only shown if it really loads
      img.src = p.image;
    }
    const body = el("div", "project-body");
    const tech = el("ul", "chips small");
    p.tech.forEach((t) => tech.append(el("li", null, t)));
    const actions = el("div", "btns");
    actions.append(linkBtn("GitHub", p.github));
    if (p.demo) actions.append(linkBtn("Live Demo", p.demo));
    body.append(
      el("span", "tag", p.status),
      el("h3", null, p.title),
      el("p", null, p.description),
      tech,
      actions,
    );
    card.append(thumb, body);
    $("#project-grid").append(card);
  });

  /* Profile photo: show placeholder unless the image really loads */
  const photo = $(".photo");
  const img = $("img", photo);
  const checkPhoto = () =>
    photo.classList.toggle("no-photo", !(img.complete && img.naturalWidth > 0));
  img.addEventListener("load", checkPhoto);
  img.addEventListener("error", checkPhoto);
  checkPhoto();

  /* Navbar: scrolled style + mobile menu */
  const nav = $(".nav"),
    burger = $(".burger"),
    menu = $("#menu");
  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  };
  burger.addEventListener("click", () =>
    setOpen(burger.getAttribute("aria-expanded") !== "true"),
  );
  menu.addEventListener(
    "click",
    (e) => e.target.closest("a") && setOpen(false),
  );
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && setOpen(false),
  );
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Fade-in on scroll */
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
              }
            }),
          { threshold: 0.1 },
        )
      : null;
  $$(".reveal").forEach((n) => (io ? io.observe(n) : n.classList.add("in")));

  $("#year").textContent = new Date().getFullYear();
})();
