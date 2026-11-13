/* KQL-style filter over a bundled, synthetic log. Nothing is queried
   from a tenant and no data leaves the browser. */
(function (global) {
  "use strict";

  var EVENTS = [
    { TimeGenerated: "2026-11-10T14:02:11Z", Category: "SigninLogs", User: "alex@example.test", ResultType: "0", IP: "198.51.100.20", Device: "lab-laptop-01", Activity: "Sign-in success" },
    { TimeGenerated: "2026-11-10T14:03:44Z", Category: "SigninLogs", User: "alex@example.test", ResultType: "50126", IP: "203.0.113.44", Device: "unknown-device", Activity: "Sign-in failed: invalid password" },
    { TimeGenerated: "2026-11-10T14:04:02Z", Category: "SigninLogs", User: "alex@example.test", ResultType: "50126", IP: "203.0.113.44", Device: "unknown-device", Activity: "Sign-in failed: invalid password" },
    { TimeGenerated: "2026-11-10T14:05:10Z", Category: "SigninLogs", User: "sam@example.test", ResultType: "0", IP: "198.51.100.21", Device: "lab-laptop-02", Activity: "Sign-in success" },
    { TimeGenerated: "2026-11-10T15:12:03Z", Category: "SigninLogs", User: "jordan@example.test", ResultType: "50074", IP: "203.0.113.90", Device: "lab-phone-01", Activity: "Sign-in failed: MFA required" },
    { TimeGenerated: "2026-11-10T15:18:41Z", Category: "DeviceEvents", User: "alex@example.test", ResultType: "0", IP: "198.51.100.20", Device: "lab-laptop-01", Activity: "Process started" },
    { TimeGenerated: "2026-11-10T15:19:02Z", Category: "DeviceEvents", User: "alex@example.test", ResultType: "0", IP: "198.51.100.20", Device: "lab-laptop-01", Activity: "MalwareBlocked" },
    { TimeGenerated: "2026-11-10T16:01:00Z", Category: "EmailEvents", User: "sam@example.test", ResultType: "0", IP: "192.0.2.40", Device: "mail-lab-01", Activity: "Delivered" },
    { TimeGenerated: "2026-11-10T16:02:14Z", Category: "EmailEvents", User: "sam@example.test", ResultType: "1", IP: "203.0.113.80", Device: "mail-lab-01", Activity: "MovedToQuarantine" },
    { TimeGenerated: "2026-11-10T16:44:09Z", Category: "SigninLogs", User: "riley@example.test", ResultType: "0", IP: "198.51.100.30", Device: "lab-laptop-03", Activity: "Sign-in success" },
    { TimeGenerated: "2026-11-10T17:10:55Z", Category: "DeviceEvents", User: "riley@example.test", ResultType: "0", IP: "198.51.100.30", Device: "lab-laptop-03", Activity: "USB device inserted" },
    { TimeGenerated: "2026-11-10T17:22:18Z", Category: "SigninLogs", User: "alex@example.test", ResultType: "0", IP: "198.51.100.20", Device: "lab-laptop-01", Activity: "Sign-in success" },
    { TimeGenerated: "2026-11-10T18:03:33Z", Category: "EmailEvents", User: "jordan@example.test", ResultType: "0", IP: "192.0.2.40", Device: "mail-lab-01", Activity: "Delivered" },
    { TimeGenerated: "2026-11-10T18:40:01Z", Category: "DeviceEvents", User: "sam@example.test", ResultType: "0", IP: "198.51.100.21", Device: "lab-laptop-02", Activity: "MalwareBlocked" },
    { TimeGenerated: "2026-11-10T19:15:27Z", Category: "SigninLogs", User: "sam@example.test", ResultType: "50053", IP: "203.0.113.44", Device: "unknown-device", Activity: "Sign-in failed: account locked" },
    { TimeGenerated: "2026-11-10T19:16:02Z", Category: "SigninLogs", User: "sam@example.test", ResultType: "50053", IP: "203.0.113.44", Device: "unknown-device", Activity: "Sign-in failed: account locked" },
    { TimeGenerated: "2026-11-10T20:08:11Z", Category: "DeviceEvents", User: "jordan@example.test", ResultType: "0", IP: "198.51.100.22", Device: "lab-desktop-01", Activity: "Policy update applied" },
    { TimeGenerated: "2026-11-10T21:00:00Z", Category: "EmailEvents", User: "alex@example.test", ResultType: "1", IP: "203.0.113.80", Device: "mail-lab-01", Activity: "MovedToQuarantine" }
  ];

  var EXAMPLES = [
    "SigninLogs",
    "SigninLogs | where ResultType != \"0\"",
    "DeviceEvents | where Activity == \"MalwareBlocked\"",
    "SigninLogs | where IP startswith \"203.0.113\" | project TimeGenerated, User, IP, Activity",
    "EmailEvents | where Activity contains \"Quarantine\" | take 5",
    "SigninLogs | where ResultType != \"0\" | count"
  ];

  var TABLES = { SigninLogs: 1, DeviceEvents: 1, EmailEvents: 1 };

  function unquote(v) {
    v = v.trim();
    if ((v.charAt(0) === "\"" && v.charAt(v.length - 1) === "\"") ||
        (v.charAt(0) === "'" && v.charAt(v.length - 1) === "'")) {
      return v.slice(1, -1);
    }
    return v;
  }

  function getField(row, name) {
    var key = Object.keys(row).find(function (k) { return k.toLowerCase() === name.toLowerCase(); });
    return key ? String(row[key]) : "";
  }

  function applyWhere(rows, expr) {
    var m = expr.match(/^([A-Za-z][A-Za-z0-9_]*)\s*(==|!=|contains|startswith|has)\s*(.+)$/i);
    if (!m) throw new Error("This playground understands: Field == value, !=, contains, startswith, or has.");
    var field = m[1];
    var op = m[2].toLowerCase();
    var want = unquote(m[3]).toLowerCase();
    return rows.filter(function (row) {
      var have = getField(row, field).toLowerCase();
      if (op === "==") return have === want;
      if (op === "!=") return have !== want;
      if (op === "contains" || op === "has") return have.indexOf(want) !== -1;
      if (op === "startswith") return have.indexOf(want) === 0;
      return false;
    });
  }

  function runQuery(text) {
    var raw = (text || "").replace(/\/\/.*$/gm, "").trim();
    if (!raw) throw new Error("Enter a table name, then optional | where, | project, | take, or | count.");
    var parts = raw.split("|").map(function (p) { return p.trim(); }).filter(Boolean);
    var head = parts.shift();
    var rows;
    if (head === "*" ) {
      rows = EVENTS.slice();
    } else if (TABLES[head]) {
      rows = EVENTS.filter(function (e) { return e.Category === head; });
    } else {
      throw new Error("Start with SigninLogs, DeviceEvents, EmailEvents, or *.");
    }
    var columns = null;
    var counted = false;
    var countValue = 0;
    parts.forEach(function (step) {
      var lower = step.toLowerCase();
      if (lower.indexOf("where ") === 0) {
        rows = applyWhere(rows, step.slice(6).trim());
      } else if (lower.indexOf("project ") === 0) {
        columns = step.slice(8).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        if (!columns.length) throw new Error("| project needs at least one field name.");
      } else if (lower.indexOf("take ") === 0) {
        var n = parseInt(step.slice(5).trim(), 10);
        if (!n && n !== 0) throw new Error("| take needs a number.");
        rows = rows.slice(0, n);
      } else if (lower === "count") {
        counted = true;
        countValue = rows.length;
      } else {
        throw new Error("Unsupported step: " + step + ". Try where, project, take, or count.");
      }
    });
    if (counted) {
      return { columns: ["Count"], rows: [{ Count: String(countValue) }] };
    }
    var cols = columns || ["TimeGenerated", "Category", "User", "ResultType", "IP", "Device", "Activity"];
    return {
      columns: cols,
      rows: rows.map(function (row) {
        var out = {};
        cols.forEach(function (c) { out[c] = getField(row, c) || ""; });
        return out;
      })
    };
  }

  function renderTable(host, result) {
    host.textContent = "";
    var wrap = document.createElement("div");
    wrap.className = "demo-table-wrap";
    var table = document.createElement("table");
    table.className = "demo-table";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    result.columns.forEach(function (c) {
      var th = document.createElement("th");
      th.textContent = c;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    if (!result.rows.length) {
      var empty = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = result.columns.length;
      td.textContent = "No rows matched.";
      empty.appendChild(td);
      tbody.appendChild(empty);
    } else {
      result.rows.forEach(function (row) {
        var r = document.createElement("tr");
        result.columns.forEach(function (c) {
          var cell = document.createElement("td");
          cell.textContent = row[c];
          r.appendChild(cell);
        });
        tbody.appendChild(r);
      });
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    host.appendChild(wrap);
    var note = document.createElement("p");
    note.className = "demo-note";
    note.textContent = result.rows.length + " row(s). All rows are synthetic lab data (example.test, documentation IP ranges).";
    host.appendChild(note);
  }

  function init(root) {
    var area = root.querySelector("[data-role='input']");
    var out = root.querySelector("[data-role='output']");
    var run = root.querySelector("[data-role='run']");
    var examples = root.querySelector("[data-role='examples']");
    if (!area || !out || !run) return;

    if (examples) {
      EXAMPLES.forEach(function (q) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "demo-chip";
        btn.textContent = q;
        btn.addEventListener("click", function () {
          area.value = q;
          go();
        });
        examples.appendChild(btn);
      });
    }

    function go() {
      out.textContent = "";
      try {
        renderTable(out, runQuery(area.value));
      } catch (err) {
        var p = document.createElement("p");
        p.className = "demo-error";
        p.textContent = err.message || String(err);
        out.appendChild(p);
      }
    }
    run.addEventListener("click", go);
    area.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        go();
      }
    });
    area.value = EXAMPLES[1];
    go();
  }

  global.DemoKql = { init: init, runQuery: runQuery };
})(window);
