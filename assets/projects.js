/*
  Project cards and demo metadata for the /demos/ page.

  Edit THIS file to add a project, change its summary, or flip a card
  from "Coming soon" to "Live on GitHub". Then bump the ?v=N query on
  assets/projects.js in demos/index.html (and on style.css / site.js
  across every page if you also changed those files) so browsers do
  not keep a stale copy.

  For each project in SITE_PROJECTS:
    name     — card title
    repo     — repository name under https://github.com/TB4T3M4N/<repo>
    summary  — one or two sentences
    live     — set to true only after the public repo exists. Cards
               with live: false do not link out, so visitors are not
               sent to a 404. Checked against the GitHub API
               (https://api.github.com/users/TB4T3M4N/repos) when this
               file was written: the only public repo was
               tb4t3m4n.github.io, so all eleven plan repos start as
               coming soon.

  SITE_DEMOS describes the in-browser playgrounds on the same page.
  Their dedicated project repos use the same live flag as the matching
  card. Demo source itself lives in this site repo
  (tb4t3m4n.github.io), which already exists.

  Do not add a phone number, ticket text, tenant IDs, or any real
  customer data to this file or the bundled samples.
*/

(function (global) {
  "use strict";

  var GITHUB = "https://github.com/TB4T3M4N/";

  global.SITE_PROJECTS = [
    {
      name: "Live sound setup",
      repo: "live-sound-setup",
      summary: "Church, wedding, and event audio runbooks: gear inventory, input lists, and a day-of-show checklist.",
      live: false
    },
    {
      name: "PowerShell helpdesk toolkit",
      repo: "powershell-helpdesk-toolkit",
      summary: "Small, documented support scripts with -WhatIf, a handover note formatter, and a lab-only safety note.",
      live: false
    },
    {
      name: "Defender KQL hunting library",
      repo: "defender-kql-hunting",
      summary: "Commented Advanced Hunting queries for Defender, written against public docs and demo data — not customer tenants.",
      live: false
    },
    {
      name: "Phishing email header analyzer",
      repo: "phish-header-analyzer",
      summary: "A tool that reads saved email headers and explains SPF, DKIM, and DMARC results in plain language.",
      live: false
    },
    {
      name: "Hiking trail log",
      repo: "trail-log",
      summary: "A personal hike log — date, trail, distance, notes — with an optional simple map later.",
      live: false
    },
    {
      name: "Minecraft server automation",
      repo: "minecraft-server-ops",
      summary: "Compose files and a runbook to start, stop, and back up a small home Minecraft server.",
      live: false
    },
    {
      name: "Weekend game helpers",
      repo: "gaming-helpers",
      summary: "Path of Exile notes, a Tarkov checklist, and an optional Discord bot. No cheats or play automation.",
      live: false
    },
    {
      name: "Event sound site",
      repo: "event-sound-site",
      summary: "A small public page for wedding and event sound, with a simple email path to get in touch.",
      live: false
    },
    {
      name: "Entra ID Conditional Access audit",
      repo: "entra-ca-audit",
      summary: "Read-only Graph scripts that summarize Conditional Access policies in a lab tenant, with redacted sample output.",
      live: false
    },
    {
      name: "Home lab and self-hosting",
      repo: "home-lab",
      summary: "Notes and compose files for a home lab, including a way to serve this personal site locally.",
      live: false
    },
    {
      name: "SIEM home-lab writeups",
      repo: "siem-home-lab",
      summary: "Writeups of a small lab SIEM: what was installed, a detection, and how it was tested with simulated events.",
      live: false
    }
  ];

  global.SITE_DEMOS = [
    {
      id: "headers",
      title: "Email header red-flag check",
      shows: "How I read Authentication-Results, From vs Return-Path, and a few other header clues — on synthetic samples, in your browser only.",
      repo: "phish-header-analyzer",
      sourcePath: "assets/demos/headers.js"
    },
    {
      id: "password",
      title: "Password strength and entropy",
      shows: "A local estimate of charset size and entropy, plus a short list of weak patterns. The password never leaves this page.",
      repo: null,
      sourcePath: "assets/demos/password.js"
    },
    {
      id: "kql",
      title: "KQL-style log filter",
      shows: "A tiny subset of KQL (where, project, take, count) over a bundled, obviously fake sign-in and device log.",
      repo: "defender-kql-hunting",
      sourcePath: "assets/demos/kql.js"
    },
    {
      id: "sound",
      title: "Speaker delay calculator",
      shows: "The same distance-to-milliseconds math I use when time-aligning a speaker to another source in a room.",
      repo: "live-sound-setup",
      sourcePath: "assets/demos/sound.js"
    }
  ];

  global.SITE_GITHUB = GITHUB;
  global.SITE_SOURCE_REPO = "https://github.com/TB4T3M4N/tb4t3m4n.github.io";
})(window);
