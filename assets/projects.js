/*
  Project cards and demo metadata for the /demos/ page.

  Edit THIS file to add a project, change its summary, or flip a card
  from "Coming soon" to "Live on GitHub". Then raise the ?v=N number on
  assets/projects.js in demos/index.html so browsers load the new copy.

  For each project in SITE_PROJECTS:
    name     card title
    repo     repository name under https://github.com/TB4T3M4N/<repo>
    summary  one or two sentences
    live     set to true once the public repo exists, and the card
             becomes a link to it. live-sound-setup is public.

  SITE_DEMOS describes the in-browser demos on the same page. Each
  demo's project link uses the live flag of the matching card. Demo
  source lives in this site repo (tb4t3m4n.github.io).

  Keep this file to public, made-up sample data.
*/

(function (global) {
  "use strict";

  var GITHUB = "https://github.com/TB4T3M4N/";

  global.SITE_PROJECTS = [
    {
      name: "Live sound setup",
      repo: "live-sound-setup",
      summary: "Church, wedding, and event audio runbooks: gear inventory, input lists, and a day-of-show checklist.",
      live: true
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
      summary: "Commented Advanced Hunting queries for Defender, written against public docs and demo data.",
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
      summary: "Path of Exile notes, a Tarkov checklist, and an optional Discord bot.",
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
      shows: "A local estimate of charset size and entropy, plus a short list of weak patterns. The math runs right on this page.",
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
