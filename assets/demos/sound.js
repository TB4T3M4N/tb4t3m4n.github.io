/* Speaker delay calculator. Distance to milliseconds at a typical
   indoor air temperature. Runs only in the browser. */
(function (global) {
  "use strict";

  // Approx. 20 °C / 68 °F, dry air. Live-sound shorthand is often “1 ms per foot.”
  var SPEED_M_S = 343;
  var SPEED_FT_S = 1125;

  function delayMs(distance, unit) {
    var n = Number(distance);
    if (!isFinite(n) || n < 0) return null;
    var speed = unit === "m" ? SPEED_M_S : SPEED_FT_S;
    return (n / speed) * 1000;
  }

  function fmt(ms) {
    if (ms === 0) return "0 ms";
    if (ms < 1) return ms.toFixed(2) + " ms";
    if (ms < 10) return ms.toFixed(2) + " ms";
    return ms.toFixed(1) + " ms";
  }

  function init(root) {
    var dist = root.querySelector("[data-role='distance']");
    var other = root.querySelector("[data-role='other']");
    var unitInputs = root.querySelectorAll("[name='sound-unit']");
    var out = root.querySelector("[data-role='output']");
    if (!dist || !out) return;

    function unit() {
      var checked = root.querySelector("[name='sound-unit']:checked");
      return checked ? checked.value : "ft";
    }

    function render() {
      var u = unit();
      var a = delayMs(dist.value, u);
      var bVal = other && other.value !== "" ? delayMs(other.value, u) : null;
      out.textContent = "";
      if (a === null) {
        var err = document.createElement("p");
        err.className = "demo-error";
        err.textContent = "Enter a distance of zero or more.";
        out.appendChild(err);
        return;
      }
      var ul = document.createElement("ul");
      ul.className = "demo-kv";
      function li(k, v) {
        var item = document.createElement("li");
        var s = document.createElement("strong");
        s.textContent = k;
        item.appendChild(s);
        item.appendChild(document.createTextNode(" " + v));
        ul.appendChild(item);
      }
      var unitLabel = u === "m" ? "meters" : "feet";
      li("Delay for this distance", fmt(a) + " (" + dist.value + " " + unitLabel + ")");
      li("Rule of thumb", u === "m" ? "about 2.9 ms per meter" : "about 0.89 ms per foot (often rounded to 1 ms/ft)");
      if (bVal !== null) {
        var delta = Math.abs(a - bVal);
        li("Second source delay", fmt(bVal));
        li("Relative delay to apply", fmt(delta) + " to the closer source, so both arrive together");
      }
      out.appendChild(ul);
      var note = document.createElement("p");
      note.className = "demo-note";
      note.textContent = "Uses 343 m/s (1,125 ft/s) at about 20 °C / 68 °F. Temperature, humidity, and wind change the real figure a little. This is a starting number, then you listen.";
      out.appendChild(note);
    }

    dist.addEventListener("input", render);
    if (other) other.addEventListener("input", render);
    unitInputs.forEach(function (el) { el.addEventListener("change", render); });
    if (!dist.value) dist.value = "20";
    render();
  }

  global.DemoSound = { init: init };
})(window);
