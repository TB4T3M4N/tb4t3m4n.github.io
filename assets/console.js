/*
  The console header on every page: name plate, the one-line description,
  and the four channel strips that act as the menu.

  Edit THIS file to change the name, the line under it, or the strips.
  Every page (home, resume, about, demos) picks the change up.

  The strip for the page you are on gets its fader pushed up and its
  label switches to "Go back", which returns to the home page.
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
  STRIPS.forEach(function (s, i) {
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
    var cap = el("i", "fader");
    cap.style.setProperty("--pos", here ? "6%" : (page === "home" ? [38, 52, 44, 60][i] + "%" : "72%"));
    slot.appendChild(cap);
    a.appendChild(slot);
    var num = el("span", "chnum", String(i + 1));
    num.setAttribute("aria-hidden", "true");
    a.appendChild(num);
    nav.appendChild(a);
  });
  desk.appendChild(nav);
  mount.textContent = "";
  mount.appendChild(desk);
})();
