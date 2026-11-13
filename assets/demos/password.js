/* Password strength + entropy estimate. The value is not stored, logged,
   or sent anywhere. A short bundled list of common passwords is local. */
(function (global) {
  "use strict";

  var COMMON = {
    "password": 1, "password1": 1, "password123": 1, "123456": 1, "12345678": 1,
    "123456789": 1, "qwerty": 1, "qwerty123": 1, "letmein": 1, "welcome": 1,
    "admin": 1, "iloveyou": 1, "monkey": 1, "dragon": 1, "abc123": 1,
    "111111": 1, "000000": 1, "login": 1, "princess": 1, "football": 1,
    "baseball": 1, "starwars": 1, "passw0rd": 1, "master": 1, "sunshine": 1
  };

  function charsetSize(pw) {
    var size = 0;
    if (/[a-z]/.test(pw)) size += 26;
    if (/[A-Z]/.test(pw)) size += 26;
    if (/[0-9]/.test(pw)) size += 10;
    if (/[^A-Za-z0-9]/.test(pw)) size += 32;
    return size;
  }

  function entropyBits(pw) {
    var c = charsetSize(pw);
    if (!pw || c === 0) return 0;
    return pw.length * (Math.log(c) / Math.log(2));
  }

  function notes(pw) {
    var out = [];
    if (!pw) return out;
    var lower = pw.toLowerCase();
    if (COMMON[lower]) out.push("This matches a very common password on a short local list.");
    if (pw.length < 8) out.push("Shorter than 8 characters.");
    if (pw.length >= 8 && pw.length < 12) out.push("Length is acceptable; 12 or more is a stronger habit.");
    if (/^[a-z]+$/.test(pw) || /^[A-Z]+$/.test(pw)) out.push("Only one letter case is used.");
    if (/^[0-9]+$/.test(pw)) out.push("Digits only.");
    if (/(.)\1{2,}/.test(pw)) out.push("It repeats the same character in a row.");
    if (/0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf/.test(lower)) {
      out.push("It contains a simple sequence or keyboard run.");
    }
    return out;
  }

  function labelFor(bits, pw) {
    if (!pw) return { label: "Enter a password", tone: "muted" };
    if (COMMON[pw.toLowerCase()]) return { label: "Very weak (common password)", tone: "bad" };
    if (bits < 28) return { label: "Very weak", tone: "bad" };
    if (bits < 36) return { label: "Weak", tone: "bad" };
    if (bits < 60) return { label: "Fair", tone: "warn" };
    if (bits < 80) return { label: "Strong", tone: "ok" };
    return { label: "Very strong (estimate)", tone: "ok" };
  }

  function init(root) {
    var input = root.querySelector("[data-role='input']");
    var out = root.querySelector("[data-role='output']");
    if (!input || !out) return;

    function render() {
      var pw = input.value || "";
      var bits = entropyBits(pw);
      var size = charsetSize(pw);
      var grade = labelFor(bits, pw);
      out.textContent = "";

      var gradeEl = document.createElement("p");
      gradeEl.className = "demo-grade demo-pill demo-pill-" + grade.tone;
      gradeEl.textContent = grade.label;
      out.appendChild(gradeEl);

      var meta = document.createElement("ul");
      meta.className = "demo-kv";
      function li(k, v) {
        var item = document.createElement("li");
        var s = document.createElement("strong");
        s.textContent = k;
        item.appendChild(s);
        item.appendChild(document.createTextNode(" " + v));
        meta.appendChild(item);
      }
      li("Length", String(pw.length));
      li("Assumed charset size", pw ? String(size) : "—");
      li("Estimated entropy", pw ? bits.toFixed(1) + " bits" : "—");
      out.appendChild(meta);

      var list = notes(pw);
      if (list.length) {
        var ul = document.createElement("ul");
        ul.className = "demo-flags";
        list.forEach(function (n) {
          var item = document.createElement("li");
          item.textContent = n;
          ul.appendChild(item);
        });
        out.appendChild(ul);
      }

      var cave = document.createElement("p");
      cave.className = "demo-note";
      cave.textContent = "Entropy here is a local math estimate (length × log2 of the character set), not a guarantee. This value is not sent or stored.";
      out.appendChild(cave);
    }

    input.addEventListener("input", render);
    render();
  }

  global.DemoPassword = { init: init };
})(window);
