/* Email header red-flag check — runs entirely in the browser. Sample
   messages are synthetic (example.test). Do not paste real customer mail. */
(function (global) {
  "use strict";

  var SAMPLE_CLEAN = [
    "From: Alex Rivera <alex@example.test>",
    "Return-Path: <alex@example.test>",
    "Reply-To: alex@example.test",
    "To: sam@lab.example.test",
    "Subject: Lab notes from Tuesday",
    "Message-ID: <clean-001@example.test>",
    "Received-SPF: pass (example.test: domain of alex@example.test designates 192.0.2.10 as permitted sender)",
    "Authentication-Results: mx.lab.example.test;",
    "       spf=pass smtp.mailfrom=alex@example.test;",
    "       dkim=pass header.d=example.test;",
    "       dmarc=pass header.from=example.test",
    "DKIM-Signature: v=1; a=rsa-sha256; d=example.test; s=selector1; /* trimmed */",
    "Received: from mail.example.test (mail.example.test [192.0.2.10])",
    "        by mx.lab.example.test with ESMTPS"
  ].join("\n");

  var SAMPLE_FLAGS = [
    "From: Billing Support <billing@examp1e.test>",
    "Return-Path: <bounce@unrelated-mailer.test>",
    "Reply-To: help@unrelated-mailer.test",
    "To: sam@lab.example.test",
    "Subject: Urgent: confirm your mailbox now",
    "Message-ID: <phish-lab-002@unrelated-mailer.test>",
    "Received-SPF: fail (unrelated-mailer.test: domain of bounce@unrelated-mailer.test does not designate 203.0.113.80 as permitted sender)",
    "Authentication-Results: mx.lab.example.test;",
    "       spf=fail smtp.mailfrom=bounce@unrelated-mailer.test;",
    "       dkim=fail header.d=unrelated-mailer.test;",
    "       dmarc=fail header.from=examp1e.test",
    "Received: from outbound.unrelated-mailer.test (unknown [203.0.113.80])",
    "        by mx.lab.example.test with ESMTP",
    "X-Announcement: Please visit http://203.0.113.80/reset or https://bit.ly/lab-demo-link"
  ].join("\n");

  function domainOf(value) {
    if (!value) return "";
    var angle = value.match(/<([^>]+)>/);
    var email = (angle ? angle[1] : value).trim();
    var at = email.lastIndexOf("@");
    return at === -1 ? "" : email.slice(at + 1).toLowerCase().replace(/[>\s]+$/g, "");
  }

  function firstHeader(text, name) {
    var re = new RegExp("^" + name + "\\s*:\\s*(.*)$", "im");
    var m = text.match(re);
    return m ? m[1].trim() : "";
  }

  function authResults(text) {
    var block = [];
    var lines = text.split(/\r?\n/);
    var capture = false;
    for (var i = 0; i < lines.length; i++) {
      if (/^Authentication-Results\s*:/i.test(lines[i])) {
        capture = true;
        block.push(lines[i].replace(/^Authentication-Results\s*:\s*/i, ""));
        continue;
      }
      if (capture) {
        if (/^[A-Za-z0-9-]+:/.test(lines[i]) && !/^\s/.test(lines[i])) break;
        if (/^\s/.test(lines[i]) || /^;/.test(lines[i].trim())) block.push(lines[i]);
        else if (lines[i].trim() === "") break;
        else block.push(lines[i]);
      }
    }
    var blob = block.join(" ");
    function verdict(key) {
      var m = blob.match(new RegExp("\\b" + key + "\\s*=\\s*([a-z]+)", "i"));
      return m ? m[1].toLowerCase() : "";
    }
    return { spf: verdict("spf"), dkim: verdict("dkim"), dmarc: verdict("dmarc"), raw: blob };
  }

  function receivedSpf(text) {
    var line = firstHeader(text, "Received-SPF");
    var m = line.match(/^(pass|fail|softfail|neutral|none|temperror|permerror)\b/i);
    return m ? m[1].toLowerCase() : "";
  }

  function findUrls(text) {
    var found = text.match(/https?:\/\/[^\s<>"']+/gi) || [];
    return found.map(function (u) { return u.replace(/[).,;]+$/, ""); });
  }

  function suspiciousUrl(url) {
    var reasons = [];
    if (/https?:\/\/\d{1,3}(?:\.\d{1,3}){3}/i.test(url)) reasons.push("URL uses a raw IP address");
    if (/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly)\//i.test(url)) reasons.push("URL uses a public shortener");
    return reasons;
  }

  function toneFor(v) {
    if (v === "pass") return "ok";
    if (v === "fail" || v === "softfail" || v === "permerror") return "bad";
    if (v) return "warn";
    return "muted";
  }

  function analyze(text) {
    var from = firstHeader(text, "From");
    var ret = firstHeader(text, "Return-Path");
    var reply = firstHeader(text, "Reply-To");
    var auth = authResults(text);
    var spfLine = receivedSpf(text);
    var fromDom = domainOf(from);
    var retDom = domainOf(ret);
    var replyDom = domainOf(reply);
    var flags = [];
    var spf = auth.spf || spfLine;
    if (spf === "fail" || spf === "softfail") flags.push("SPF did not pass (" + spf + ").");
    if (auth.dkim === "fail") flags.push("DKIM did not pass.");
    if (auth.dmarc === "fail") flags.push("DMARC did not pass.");
    if (fromDom && retDom && fromDom !== retDom) {
      flags.push("Return-Path domain (" + retDom + ") does not match the From domain (" + fromDom + ").");
    }
    if (fromDom && replyDom && replyDom !== fromDom) {
      flags.push("Reply-To domain (" + replyDom + ") does not match the From domain (" + fromDom + ").");
    }
    if (/examp1e|rnicrosoft|paypa1|g00gle/i.test(from + " " + fromDom)) {
      flags.push("The From display or domain looks like a lookalike of a well-known name (lab sample).");
    }
    var urls = findUrls(text);
    urls.forEach(function (u) {
      suspiciousUrl(u).forEach(function (reason) { flags.push(reason + ": " + u); });
    });
    return {
      from: from, ret: ret, reply: reply,
      fromDom: fromDom, retDom: retDom, replyDom: replyDom,
      spf: spf, dkim: auth.dkim, dmarc: auth.dmarc,
      flags: flags, urls: urls
    };
  }

  function pill(label, value) {
    var span = document.createElement("span");
    span.className = "demo-pill demo-pill-" + toneFor(value);
    span.textContent = label + ": " + (value || "not found");
    return span;
  }

  function renderResult(host, result) {
    host.textContent = "";
    var pills = document.createElement("div");
    pills.className = "demo-pills";
    pills.appendChild(pill("SPF", result.spf));
    pills.appendChild(pill("DKIM", result.dkim));
    pills.appendChild(pill("DMARC", result.dmarc));
    host.appendChild(pills);

    var meta = document.createElement("ul");
    meta.className = "demo-kv";
    function li(k, v) {
      var item = document.createElement("li");
      var s = document.createElement("strong");
      s.textContent = k;
      item.appendChild(s);
      item.appendChild(document.createTextNode(" " + (v || "—")));
      meta.appendChild(item);
    }
    li("From", result.from);
    li("Return-Path", result.ret);
    li("Reply-To", result.reply);
    host.appendChild(meta);

    var flags = document.createElement("div");
    flags.className = "demo-flags";
    if (result.flags.length === 0) {
      var ok = document.createElement("p");
      ok.className = "demo-ok";
      ok.textContent = "No header red flags in the checks this demo runs. That is not a guarantee the message is safe — it is only a reading of these fields.";
      flags.appendChild(ok);
    } else {
      var title = document.createElement("p");
      title.className = "demo-flag-title";
      title.textContent = "Red flags in this sample:";
      flags.appendChild(title);
      var list = document.createElement("ul");
      result.flags.forEach(function (f) {
        var item = document.createElement("li");
        item.textContent = f;
        list.appendChild(item);
      });
      flags.appendChild(list);
    }
    host.appendChild(flags);
  }

  function init(root) {
    var area = root.querySelector("[data-role='input']");
    var out = root.querySelector("[data-role='output']");
    var run = root.querySelector("[data-role='run']");
    if (!area || !out || !run) return;
    function go() { renderResult(out, analyze(area.value || "")); }
    run.addEventListener("click", go);
    root.querySelectorAll("[data-sample]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        area.value = btn.getAttribute("data-sample") === "flags" ? SAMPLE_FLAGS : SAMPLE_CLEAN;
        go();
      });
    });
  }

  global.DemoHeaders = { init: init, analyze: analyze };
})(window);
