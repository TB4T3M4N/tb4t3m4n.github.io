/* Renders project cards and wires the playgrounds on /demos/.
   Project data comes from assets/projects.js — edit that file to add
   or flip projects. */
(function () {
  "use strict";

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

  function projectByRepo(repo) {
    var list = window.SITE_PROJECTS || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].repo === repo) return list[i];
    }
    return null;
  }

  function renderCards(host) {
    var projects = window.SITE_PROJECTS || [];
    var github = window.SITE_GITHUB || "https://github.com/TB4T3M4N/";
    host.textContent = "";
    projects.forEach(function (project) {
      var card;
      if (project.live) {
        card = el("a", {
          className: "project-card is-live",
          href: github + project.repo,
          target: "_blank",
          rel: "noopener noreferrer"
        });
      } else {
        card = el("article", { className: "project-card is-soon" });
      }
      var badge = el(
        "span",
        { className: "project-badge " + (project.live ? "is-live" : "is-soon") },
        project.live ? "Live on GitHub" : "Coming soon"
      );
      card.appendChild(badge);
      card.appendChild(el("h3", null, project.name));
      card.appendChild(el("p", { className: "project-repo" }, "TB4T3M4N/" + project.repo));
      card.appendChild(el("p", null, project.summary));
      if (!project.live) {
        var note = el("p", { className: "project-pending" }, "The repository is not public yet, so this card does not link out.");
        card.appendChild(note);
      }
      host.appendChild(card);
    });
  }

  function sourceLinks(demo) {
    var wrap = el("p", { className: "demo-source" });
    var siteRepo = window.SITE_SOURCE_REPO || "https://github.com/TB4T3M4N/tb4t3m4n.github.io";
    if (demo.sourcePath) {
      var src = el("a", {
        href: siteRepo + "/blob/main/" + demo.sourcePath,
        target: "_blank",
        rel: "noopener noreferrer"
      }, "View this demo’s source");
      wrap.appendChild(src);
    }
    if (demo.repo) {
      wrap.appendChild(document.createTextNode(" · "));
      var match = projectByRepo(demo.repo);
      if (match && match.live) {
        var live = el("a", {
          href: (window.SITE_GITHUB || "https://github.com/TB4T3M4N/") + demo.repo,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Project repo");
        wrap.appendChild(live);
      } else {
        wrap.appendChild(el("span", { className: "is-soon-text" }, "Project repo coming soon (" + demo.repo + ")"));
      }
    }
    return wrap;
  }

  function fillMeta(demo) {
    var root = document.getElementById("demo-" + demo.id);
    if (!root) return;
    var shows = root.querySelector("[data-role='shows']");
    if (shows) shows.textContent = demo.shows;
    var sourceHost = root.querySelector("[data-role='source']");
    if (sourceHost) {
      sourceHost.textContent = "";
      sourceHost.appendChild(sourceLinks(demo));
    }
  }

  var cards = document.getElementById("project-cards");
  if (cards) renderCards(cards);

  var demos = window.SITE_DEMOS || [];
  demos.forEach(fillMeta);

  if (window.DemoHeaders) window.DemoHeaders.init(document.getElementById("demo-headers"));
  if (window.DemoPassword) window.DemoPassword.init(document.getElementById("demo-password"));
  if (window.DemoKql) window.DemoKql.init(document.getElementById("demo-kql"));
  if (window.DemoSound) window.DemoSound.init(document.getElementById("demo-sound"));
})();
