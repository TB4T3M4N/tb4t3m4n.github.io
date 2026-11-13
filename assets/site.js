/*
  Shared header + hero for every page on this site.

  Edit THIS file to change the name, personal tagline, about-me line,
  location, navigation, or the button row. Those updates then appear
  on every page (home, /resume/, /about/, /demos/, and any future
  page that includes the placeholder and this script).

  After you change this file or style.css, bump the cache-busting
  query on every page — style.css?v=N and assets/site.js?v=N — so
  browsers do not keep a stale copy. Increment N (for example ?v=2).

  Each page should contain only:

    <div id="site-chrome">
      <noscript>…minimal name + links with paths relative to that page…</noscript>
    </div>
    <script src="[relative path]/assets/site.js?v=N"></script>

  Place the script immediately after #site-chrome (before <main>) so
  the hero is in the document before the rest of the page paints.

  Button row, same slots and size on every page:
    [View resume]  [About me]  [Demos]  [Email me]
  On the page a button points to, that same slot becomes "Go back"
  and links to the home page. Email me stays a mailto: link and is
  never replaced. The home page always shows the four normal labels.

  Links are resolved from this script's URL (…/assets/site.js), so
  the site works at the domain root or under a sub-path. Do not add
  a phone number to this file or the rest of the public site.
*/

(function () {
  "use strict";

  var NAME = "Tyler Bateman";
  var TAGLINE = "IT Security Pro · Outdoors Lover · Gamer";
  var LOCATION = "Lake City, Washington, United States";
  var ABOUT_LINE =
    "I hike and spend time outdoors, play games, and run live sound for my church, weddings, and events.";
  var EMAIL = "mailto:tyler@thebatemans.com";

  var NAV = [
    { id: "home", label: "Home", href: "./" },
    { id: "resume", label: "Resume", href: "resume/" },
    { id: "about", label: "About", href: "about/" },
    { id: "demos", label: "Demos", href: "demos/" }
  ];

  var BUTTONS = [
    { id: "resume", label: "View resume", href: "resume/", style: "btn-primary" },
    { id: "about", label: "About me", href: "about/", style: "btn-ghost" },
    { id: "demos", label: "Demos", href: "demos/", style: "btn-ghost" },
    { id: "email", label: "Email me", href: EMAIL, style: "btn-ghost" }
  ];

  var script = document.currentScript;
  if (!script || !script.src) return;

  var rootUrl = new URL("../", script.src);
  if (!rootUrl.pathname.endsWith("/")) {
    rootUrl.pathname += "/";
  }

  function abs(rel) {
    if (/^[a-z]+:/i.test(rel)) return rel;
    return new URL(rel, rootUrl).href;
  }

  function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/i, "/").replace(/\/+$/, "") || "/";
  }

  function currentPageId() {
    var here = normalizePath(window.location.pathname);
    var rootPath = normalizePath(rootUrl.pathname);
    var rel = here;
    if (rootPath !== "/" && (here === rootPath || here.indexOf(rootPath + "/") === 0)) {
      rel = here.slice(rootPath.length);
    }
    rel = rel.replace(/^\/+/, "").replace(/\/+$/, "");
    if (rel === "resume") return "resume";
    if (rel === "about") return "about";
    if (rel === "demos") return "demos";
    return "home";
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (attrs[key] == null || attrs[key] === false) return;
        if (key === "className") node.className = attrs[key];
        else node.setAttribute(key, attrs[key] === true ? "" : attrs[key]);
      });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  var page = currentPageId();
  var homeHref = abs("./");

  var logo = el("a", {
    className: "logo",
    href: homeHref,
    "aria-label": NAME + ", home"
  });
  logo.appendChild(el("span", { className: "logo-mark", "aria-hidden": "true" }, "TB"));
  logo.appendChild(el("span", { className: "logo-name" }, NAME));

  var nav = el("nav", { className: "nav", "aria-label": "Primary" });
  NAV.forEach(function (item) {
    var link = el("a", { href: abs(item.href) }, item.label);
    if (item.id === page) link.setAttribute("aria-current", "page");
    nav.appendChild(link);
  });

  var headerInner = el("div", { className: "wrap header-inner" });
  headerInner.appendChild(logo);
  headerInner.appendChild(nav);

  var header = el("header", { className: "site-header" });
  header.appendChild(headerInner);

  var actions = el("div", { className: "hero-actions" });
  BUTTONS.forEach(function (btn) {
    var label = btn.label;
    var href = abs(btn.href);
    if (btn.id === page && btn.id !== "email") {
      label = "Go back";
      href = homeHref;
    }
    var link = el("a", { className: "btn " + btn.style, href: href }, label);
    actions.appendChild(link);
  });

  var wrap = el("div", { className: "wrap" });
  wrap.appendChild(el("p", { className: "eyebrow" }, LOCATION));
  wrap.appendChild(el("h1", null, NAME));
  wrap.appendChild(el("p", { className: "tagline" }, TAGLINE));
  wrap.appendChild(el("p", { className: "lede" }, ABOUT_LINE));
  wrap.appendChild(actions);

  var hero = el("section", { className: "hero", id: "top" });
  hero.appendChild(wrap);

  var mount = document.getElementById("site-chrome");
  if (!mount) return;
  mount.innerHTML = "";
  mount.appendChild(header);
  mount.appendChild(hero);
})();
