/**
 * Screenshot the harness in light and dark, and report console errors.
 *
 *   node test/harness/shoot.mjs [outdir]
 *
 * Not part of `npm test` — it needs a browser. It exists because a remote is a
 * layout-heavy card: unit tests can prove which service a button calls, but
 * only a picture proves the d-pad is round and the app grid is not stranding
 * two tiles in a quarter of the card.
 */

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import puppeteer from "puppeteer";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.argv[2] ?? resolve(here, "shots"));
mkdirSync(outDir, { recursive: true });

const page_url = (dark) =>
  `${pathToFileURL(resolve(here, "index.html")).href}${dark ? "?dark" : ""}`;

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--allow-file-access-from-files", "--no-sandbox"],
});

let failed = false;
for (const dark of [false, true]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1200, deviceScaleFactor: 2 });

  page.on("console", (message) => {
    if (message.type() === "error") {
      failed = true;
      console.error(`[console.error] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    failed = true;
    console.error(`[pageerror] ${error.message}`);
  });

  await page.goto(page_url(dark), { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.title === "ready", { timeout: 10_000 });

  // The v1 bug this guards against: getConfigElement() returned an element
  // that was never defined, so HA's editor rendered an empty box. Nothing in
  // the type system catches it — the tag name is a string.
  const checks = await page.evaluate(() => {
    const card = customElements.get("polr-android-tv-remote-card");
    const editorTag = card
      .getConfigElement()
      .tagName.toLowerCase();
    return {
      cardDefined: Boolean(card),
      editorTag,
      editorDefined: Boolean(customElements.get(editorTag)),
      stubHasEntity: Boolean(card.getStubConfig({ states: { "remote.a": {} } }).entity),
      padDefined: Boolean(customElements.get("polr-atv-nav-pad")),
    };
  });
  for (const [name, ok] of Object.entries(checks)) {
    if (ok === false) {
      failed = true;
      console.error(`[check] ${name} failed`);
    }
  }
  if (!checks.editorDefined) {
    console.error(`[check] <${checks.editorTag}> is not a defined custom element`);
  }

  // Gestures: a tap must fire, a scroll across a button must not. Only worth
  // running once; the check is behavioural, not visual.
  if (!dark) {
    const gestures = await page.evaluate(async () => {
      const card = document.querySelector("polr-android-tv-remote-card");
      const tile = card.shadowRoot.querySelector(".app-tile");
      const box = tile.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const send = (type, cx, cy) =>
        tile.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, composed: true, cancelable: true,
            clientX: cx, clientY: cy, button: 0, pointerId: 1, pointerType: "touch",
          }),
        );
      const settle = () => new Promise((r) => setTimeout(r, 60));

      window.__calls = [];
      send("pointerdown", x, y);
      send("pointerup", x, y);
      await settle();
      const onTap = window.__calls.length;

      // A thumb landing on the tile and dragging up the page to scroll.
      window.__calls = [];
      send("pointerdown", x, y);
      send("pointermove", x, y - 40);
      send("pointerup", x, y - 40);
      await settle();
      const onScroll = window.__calls.length;

      // The browser taking the gesture over for scrolling mid-press.
      window.__calls = [];
      send("pointerdown", x, y);
      send("pointercancel", x, y);
      send("pointerup", x, y);
      await settle();
      const onCancel = window.__calls.length;

      return { onTap, onScroll, onCancel };
    });

    for (const [name, actual, want] of [
      ["a tap", gestures.onTap, 1],
      ["scrolling across a button", gestures.onScroll, 0],
      ["a cancelled press", gestures.onCancel, 0],
    ]) {
      if (actual !== want) {
        failed = true;
        console.error(`[gesture] ${name} should send ${want} call(s), sent ${actual}`);
      }
    }
    console.log(
      `gestures: tap=${gestures.onTap} scroll=${gestures.onScroll} cancel=${gestures.onCancel}`,
    );

    // Native mode deliberately has two gestures: an ordinary press sends one
    // SHORT command, while a real hold forwards Android's physical key edges.
    // Every exit path after START_LONG must emit exactly one END_LONG or the TV
    // can believe the key is still down after the browser lets go.
    const native = await page.evaluate(async () => {
      const kase = [...document.querySelectorAll(".case")].find(
        (c) => c.querySelector("h2")?.textContent === "native hold",
      );
      const card = kase.querySelector("polr-android-tv-remote-card");
      const btn = card.shadowRoot.querySelector('[aria-label="Fast forward"]');
      if (!btn) return { error: "no Fast forward button" };
      const box = btn.getBoundingClientRect();
      const sendPointer = (type, pointerId = 41) =>
        btn.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, composed: true, cancelable: true,
            clientX: box.left + box.width / 2,
            clientY: box.top + box.height / 2,
            button: 0, pointerId, pointerType: "touch",
          }),
        );
      const commands = () => window.__calls.map((call) => call[2]?.command);
      const delays = () => window.__calls.map((call) => call[2]?.delay_secs);
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // A quick, normal press stays a SHORT command.
      window.__calls = [];
      sendPointer("pointerdown");
      sendPointer("pointerup");
      await wait(60);
      const quickTap = commands();

      // 600 ms is deliberately a fairly slow tap. It must still be usable as
      // a normal press; the native-hold threshold is 750 ms.
      window.__calls = [];
      sendPointer("pointerdown", 42);
      await wait(600);
      const beforeRelaxedRelease = commands();
      sendPointer("pointerup", 42);
      await wait(60);
      const relaxedTap = commands();

      // Only after the threshold does Android receive a real key-down.
      window.__calls = [];
      sendPointer("pointerdown", 43);
      await wait(825);
      const whileHeld = commands();
      const whileHeldDelays = delays();
      sendPointer("pointerup", 43);
      // Duplicate lifecycle events must not duplicate END_LONG.
      sendPointer("pointerup", 43);
      await wait(25);
      const released = commands();
      const releasedDelays = delays();
      await wait(180);
      const afterRelease = commands();

      // Cancelling before the threshold is neither a tap nor a hold.
      window.__calls = [];
      sendPointer("pointerdown", 44);
      sendPointer("pointercancel", 44);
      sendPointer("pointerup", 44);
      await wait(60);
      const cancelledPending = commands();

      // Once a hold has started, pointercancel is a release edge.
      window.__calls = [];
      sendPointer("pointerdown", 45);
      await wait(825);
      sendPointer("pointercancel", 45);
      sendPointer("pointerup", 45);
      await wait(25);
      const cancelledHeld = commands();

      // A release dispatched outside the button is caught at window level.
      window.__calls = [];
      sendPointer("pointerdown", 46);
      await wait(825);
      window.dispatchEvent(new PointerEvent("pointerup", {
        bubbles: true, cancelable: true, button: 0,
        pointerId: 46, pointerType: "touch",
      }));
      await wait(25);
      const releasedOutside = commands();

      // Losing pointer capture is another mandatory release path.
      window.__calls = [];
      sendPointer("pointerdown", 47);
      await wait(825);
      btn.dispatchEvent(new PointerEvent("lostpointercapture", {
        bubbles: true, pointerId: 47, pointerType: "touch",
      }));
      await wait(25);
      const lostCapture = commands();

      // Keyboard gets exactly the same relaxed tap/hold distinction.
      window.__calls = [];
      btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      btn.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
      await wait(60);
      const keyboardTap = commands();

      window.__calls = [];
      btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      await wait(825);
      btn.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
      await wait(25);
      const keyboardHold = commands();

      window.__calls = [];
      sendPointer("pointerdown", 48);
      await wait(825);
      window.dispatchEvent(new PageTransitionEvent("pagehide"));
      sendPointer("pointerup", 48);
      await wait(25);
      const pagehide = commands();

      return {
        quickTap, beforeRelaxedRelease, relaxedTap,
        whileHeld, whileHeldDelays, released, releasedDelays, afterRelease,
        cancelledPending, cancelledHeld, releasedOutside, lostCapture,
        keyboardTap, keyboardHold, pagehide,
      };
    });

    const short = "MEDIA_FAST_FORWARD";
    const start = "START_LONG:MEDIA_FAST_FORWARD";
    const end = "END_LONG:MEDIA_FAST_FORWARD";
    for (const [name, actual, expected] of [
      ["quick tap", native.quickTap, [short]],
      ["600 ms before release", native.beforeRelaxedRelease, []],
      ["600 ms tap", native.relaxedTap, [short]],
      ["held", native.whileHeld, [start]],
      ["released", native.released, [start, end]],
      ["settled after release", native.afterRelease, [start, end]],
      ["cancelled before threshold", native.cancelledPending, []],
      ["cancelled while held", native.cancelledHeld, [start, end]],
      ["released outside", native.releasedOutside, [start, end]],
      ["lost pointer capture", native.lostCapture, [start, end]],
      ["keyboard tap", native.keyboardTap, [short]],
      ["keyboard hold", native.keyboardHold, [start, end]],
      ["pagehide", native.pagehide, [start, end]],
    ]) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        failed = true;
        console.error(
          `[native] ${name}: wanted ${JSON.stringify(expected)}, got ${JSON.stringify(actual ?? native)}`,
        );
      }
    }
    for (const [name, actual] of [
      ["held", native.whileHeldDelays],
      ["released", native.releasedDelays],
    ]) {
      if (!actual?.every((delay) => delay === 0)) {
        failed = true;
        console.error(`[native] ${name}: every long edge must use delay_secs=0, got ${JSON.stringify(actual)}`);
      }
    }
    console.log("native hold: relaxed tap threshold and every release path verified");

    // The off-state "Turn on" button is a second entry point to power, and must
    // honour a power override exactly as the header button does — otherwise a
    // blaster-driven TV turns on through the wrong path.
    const power = await page.evaluate(async () => {
      const kase = [...document.querySelectorAll(".case")].find(
        (c) => c.querySelector("h2")?.textContent === "TV off + power override",
      );
      const card = kase.querySelector("polr-android-tv-remote-card");
      const btn = [...card.shadowRoot.querySelectorAll(".control-button")].find((b) =>
        b.textContent.includes("Turn on"),
      );
      if (!btn) return { error: "no Turn on button" };
      const box = btn.getBoundingClientRect();
      const send = (type) =>
        btn.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true, composed: true, cancelable: true,
            clientX: box.left + 5, clientY: box.top + 5,
            button: 0, pointerId: 1, pointerType: "touch",
          }),
        );
      window.__calls = [];
      send("pointerdown");
      send("pointerup");
      await new Promise((r) => setTimeout(r, 60));
      return { calls: window.__calls };
    });

    const call = power.calls?.[0];
    const usedOverride = call?.[0] === "remote" && call?.[1] === "send_command";
    if (!usedOverride) {
      failed = true;
      console.error(
        `[power] "Turn on" ignored the override, called ${JSON.stringify(call ?? power)}`,
      );
    }
    console.log(`power override via "Turn on": ${usedOverride ? "ok" : "FAILED"}`);
  }

  // Accessibility is a claim the README makes, so it is checked rather than
  // asserted: v1 wired click handlers onto bare divs, and nothing but a test
  // stops that creeping back.
  if (!dark) {
    const a11y = await page.evaluate(() => {
      const card = document.querySelector("polr-android-tv-remote-card");
      const root = card.shadowRoot;
      const pad = root.querySelector("polr-atv-nav-pad")?.shadowRoot;
      const controls = [
        ...root.querySelectorAll("button, [role='button'], input, [tabindex]"),
        ...(pad ? pad.querySelectorAll("button, [role='application'], [tabindex]") : []),
      ];
      const describe = (el) => el.className || el.tagName;
      return {
        count: controls.length,
        unlabelled: controls
          .filter(
            (el) =>
              !el.getAttribute("aria-label") &&
              !el.textContent.trim() &&
              !el.getAttribute("placeholder"),
          )
          .map(describe),
        unfocusable: controls
          .filter((el) => el.tagName !== "BUTTON" && el.tabIndex < 0)
          .map(describe),
        liveRegion: Boolean(root.querySelector("[aria-live]")),
      };
    });

    if (a11y.count < 10) {
      failed = true;
      console.error(`[a11y] only ${a11y.count} controls found — did the card render?`);
    }
    for (const [what, list] of [
      ["unlabelled", a11y.unlabelled],
      ["not keyboard focusable", a11y.unfocusable],
    ]) {
      if (list.length) {
        failed = true;
        console.error(`[a11y] ${list.length} controls ${what}: ${list.join(", ")}`);
      }
    }
    if (!a11y.liveRegion) {
      failed = true;
      console.error("[a11y] the now-playing line lost its aria-live region");
    }
    console.log(
      `a11y: ${a11y.count} controls, all labelled and focusable, live region present`,
    );
  }

  // The editor's tile-list machinery is shared by the app launcher and every
  // custom section. Nothing but this proves a section survives being edited:
  // the lists were one hardcoded `apps` list until sections arrived.
  if (!dark) {
    const roundTrip = await page.evaluate(async () => {
      const editor = document.createElement("polr-android-tv-remote-card-editor");
      const source = {
        type: "custom:polr-android-tv-remote-card",
        entity: "remote.main_tv",
        apps: [{ name: "Netflix", icon: "brand:netflix",
          action: { action: "activity", activity: "https://www.netflix.com/title" } }],
        sections: [{ name: "Home theater", buttons: [
          { name: "Projector", icon: "mdi:projector", entity: "media_player.projector",
            action: { action: "service", service: "media_player.toggle" } },
          { name: "Soundbar", icon: "mdi:soundbar",
            action: { action: "service", service: "remote.send_command" } },
        ] }],
      };
      editor.hass = document.querySelector("polr-android-tv-remote-card").hass;
      editor.setConfig(source);
      document.body.appendChild(editor);
      await editor.updateComplete;

      let emitted;
      editor.addEventListener("config-changed", (e) => { emitted = e.detail.config; });

      // Drive the real controls, not the methods behind them. Calling
      // _renameSection directly is what let "Add section" ship broken: the
      // method worked, the button did not.
      const clickByText = (text) => {
        const el = [...editor.shadowRoot.querySelectorAll("button")].find((b) =>
          b.textContent.trim().toLowerCase().includes(text),
        );
        if (!el) throw new Error(`no button matching "${text}"`);
        el.click();
      };

      clickByText("add section");
      await editor.updateComplete;
      // HA echoes every change back through setConfig; without that the editor
      // is testing its own optimism rather than the round-trip.
      if (emitted) editor.setConfig(emitted);
      await editor.updateComplete;
      const sectionsAfterAdd = emitted?.sections?.length;

      const nameInput = [...editor.shadowRoot.querySelectorAll("input")].find(
        (i) => i.value === "Theater" || i.value === "Home theater",
      );
      if (nameInput) {
        nameInput.value = "Theater";
        nameInput.dispatchEvent(new Event("change", { bubbles: true }));
        await editor.updateComplete;
      }

      const section = emitted?.sections?.[0];
      return {
        sectionsAfterAdd,
        renamed: section?.name,
        buttonCount: section?.buttons?.length,
        entityKept: section?.buttons?.[0]?.entity,
        blindButtonStaysBlind: section?.buttons?.[1]?.entity ?? null,
        appsUntouched: emitted?.apps?.[0]?.icon,
      };
    });

    const expected = {
      // Two: the one from the config, plus the one the button added.
      sectionsAfterAdd: 2,
      renamed: "Theater",
      buttonCount: 2,
      entityKept: "media_player.projector",
      blindButtonStaysBlind: null,
      appsUntouched: "brand:netflix",
    };
    for (const [key, want] of Object.entries(expected)) {
      if (roundTrip[key] !== want) {
        failed = true;
        console.error(
          `[editor] ${key}: expected ${JSON.stringify(want)}, got ${JSON.stringify(roundTrip[key])}`,
        );
      }
    }
    console.log("editor round-trip: sections survive an edit, apps untouched");
  }

  const file = resolve(outDir, dark ? "dark.png" : "light.png");
  await page.screenshot({ path: file, fullPage: true });
  console.log(`wrote ${file}`);
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
