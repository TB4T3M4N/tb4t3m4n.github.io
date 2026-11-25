/*
  Career timeline under each job. Every bar is the same single line,
  one block per calendar quarter, from the quarter of the first job
  (FIRST_JOB) to the current quarter. A block is lit green when the
  job the bar belongs to was active in any month of that quarter.

  Each bar in the HTML names its own job with data-start and data-end
  (YYYY-MM, or "present"). Change FIRST_JOB only if an earlier job is added.
*/
(function () {
  "use strict";
  var FIRST_JOB = "2019-04";
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var now = new Date();
  var nowIdx = now.getFullYear() * 12 + now.getMonth();
  function idx(ym) {
    if (ym === "present") return nowIdx;
    var p = ym.split("-");
    return parseInt(p[0], 10) * 12 + parseInt(p[1], 10) - 1;
  }
  var first = idx(FIRST_JOB);
  var q0 = Math.floor(first / 3), q1 = Math.floor(nowIdx / 3), total = q1 - q0 + 1;
  function label(text, col, cls) {
    var l = document.createElement("span");
    l.className = "tl-y" + (cls ? " " + cls : "");
    l.textContent = text;
    if (col != null) l.style.left = (col / total * 100) + "%";
    return l;
  }
  document.querySelectorAll(".tl[data-start]").forEach(function (bar) {
    var s = idx(bar.getAttribute("data-start")), e = idx(bar.getAttribute("data-end"));
    bar.textContent = "";
    var line = document.createElement("span");
    line.className = "tl-line";
    line.setAttribute("aria-hidden", "true");
    line.style.gridTemplateColumns = "repeat(" + total + ", minmax(0, 1fr))";
    for (var q = q0; q <= q1; q++) {
      var block = document.createElement("i");
      if (s <= q * 3 + 2 && e >= q * 3) block.className = "on";
      line.appendChild(block);
    }
    var labels = document.createElement("span");
    labels.className = "tl-labels";
    labels.setAttribute("aria-hidden", "true");
    labels.appendChild(label(MONTHS[first % 12] + " " + Math.floor(first / 12), null, "tl-start"));
    for (var y = Math.floor(first / 12) + 1; y <= Math.floor(nowIdx / 12); y++) {
      var col = y * 4 - q0, f = col / total, rest = (total - col) / total;
      if (f < 0.06 || rest < 0.06) continue;
      var phone = (y % 2 === 0) && f >= 0.25 && rest >= 0.15;
      labels.appendChild(label(String(y), col, phone ? "" : "tl-wide"));
    }
    labels.appendChild(label("Now", null, "tl-end"));
    bar.appendChild(line);
    bar.appendChild(labels);
  });
})();
