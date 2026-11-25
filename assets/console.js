/*
  The console header on every page: name plate, the one-line description,
  and the four channel strips that act as the menu.

  Edit THIS file to change the name, the line under it, or the strips.
  Every page (home, resume, about, demos) picks the change up.

  The strip for the page you are on lights its signal LED, its fader
  handle is pushed to the top of its track, and its label switches to
  "Go back", which returns to the home page. The other handles rest at
  the bottom. The tracks themselves never move between pages.

  The same name and strips are also built as a compact bar that slides
  in at the top of the screen once the main header scrolls out of view.
*/
(function () {
  "use strict";
  var NAME = "Tyler Bateman";
  var LINE = "I work in IT security, I would rather be gaming, and I am outdoors when I can.";
  var STRIPS = [
    { id: "resume", label: "Resume", href: "resume/", cap: "red" },
    { id: "about",  label: "About me",    href: "about/",  cap: "yellow" },
    { id: "demos",  label: "Demos",       href: "demos/",  cap: "green" },
    { id: "email",  label: "Email me",    href: "mailto:tyler@thebatemans.com", cap: "blue" }
  ];

  var mount = document.getElementById("console");
  if (!mount) return;
  var root = mount.getAttribute("data-root") || "";
  var path = window.location.pathname;
  var page = /\/resume\/?(index\.html)?$/.test(path) ? "resume"
           : /\/about\/?(index\.html)?$/.test(path) ? "about"
           : /\/demos\/?(index\.html)?$/.test(path) ? "demos" : "home";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var desk = el("header", "desk");
  var plate = el("div", "plate");
  var nameP = el("p", "plate-name");
  var home = el("a", null, NAME);
  home.href = root || "./";
  nameP.appendChild(home);
  plate.appendChild(nameP);
  plate.appendChild(el("p", "plate-line", LINE));
  desk.appendChild(plate);

  var nav = el("nav", "strips");
  nav.setAttribute("aria-label", "Primary");
  STRIPS.forEach(function (s) {
    var here = s.id === page;
    var a = el("a", "strip" + (here ? " is-up" : ""));
    a.href = here ? (root || "./") : (/^mailto:/.test(s.href) ? s.href : root + s.href);
    if (here) a.setAttribute("aria-current", "page");
    var knobs = el("span", "knobs");
    knobs.setAttribute("aria-hidden", "true");
    for (var k = 0; k < 3; k++) knobs.appendChild(el("i", "knob cap-" + (k === 0 ? s.cap : "grey")));
    a.appendChild(knobs);
    var led = el("span", "led");
    led.setAttribute("aria-hidden", "true");
    a.appendChild(led);
    a.appendChild(el("span", "scrib", here ? "Go back" : s.label));
    var slot = el("span", "slot");
    slot.setAttribute("aria-hidden", "true");
    slot.appendChild(el("i", "fader"));
    a.appendChild(slot);
    nav.appendChild(a);
  });
  desk.appendChild(nav);

  // Compact bar: same name and strips, shown after the header scrolls away.
  var mini = el("div", "mini");
  mini.setAttribute("aria-hidden", "true");
  mini.setAttribute("inert", "");
  var miniIn = el("div", "mini-in");
  var miniName = el("a", "mini-name", NAME);
  miniName.href = root || "./";
  miniIn.appendChild(miniName);
  var miniNav = el("nav", "mini-strips");
  miniNav.setAttribute("aria-label", "Quick menu");
  STRIPS.forEach(function (s) {
    var here = s.id === page;
    var a = el("a", "mstrip" + (here ? " is-up" : ""));
    a.href = here ? (root || "./") : (/^mailto:/.test(s.href) ? s.href : root + s.href);
    if (here) a.setAttribute("aria-current", "page");
    var top = el("span", "mtop");
    top.setAttribute("aria-hidden", "true");
    top.appendChild(el("i", "knob mknob cap-" + s.cap));
    top.appendChild(el("i", "led mled"));
    a.appendChild(top);
    a.appendChild(el("span", "scrib", here ? "Go back" : s.label));
    var slot = el("span", "mslot");
    slot.setAttribute("aria-hidden", "true");
    slot.appendChild(el("i", "mfader"));
    a.appendChild(slot);
    miniNav.appendChild(a);
  });
  miniIn.appendChild(miniNav);
  mini.appendChild(miniIn);

  mount.textContent = "";
  mount.appendChild(desk);
  mount.appendChild(mini);

  function setShown(on) {
    if (on === mini.classList.contains("is-on")) return;
    mini.classList.toggle("is-on", on);
    if (on) {
      mini.removeAttribute("aria-hidden");
      mini.removeAttribute("inert");
    } else {
      if (mini.contains(document.activeElement)) document.activeElement.blur();
      mini.setAttribute("aria-hidden", "true");
      mini.setAttribute("inert", "");
    }
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      setShown(!e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(desk);
  } else {
    var check = function () { setShown(desk.getBoundingClientRect().bottom < 0); };
    window.addEventListener("scroll", check, { passive: true });
    check();
  }
})();
