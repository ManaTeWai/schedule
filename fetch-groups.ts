/**
 * fetch-groups.js
 *
 * Node.js script (CommonJS) that crawls rasp.bukep.ru start pages,
 * кликает по элементам, следит за постбэками __doPostBack и собирает
 * итоговый список групп с breadcrumb-метаданными.
 *
 * Настройки — см. константы ниже.
 *
 * Требования:
 *   node >= 16/18
 *   npm i puppeteer
 *
 * Запуск:
 *   node fetch-groups.js
 *
 * Для отладки:
 *   - поставить HEADLESS=false в окружении, чтобы увидеть реальный браузер
 *   - уменьшить MAX_GROUPS до малого числа
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // node-level (внимание: безопасно только в доверенной среде)

///////////////////// НАСТРОЙКИ /////////////////////
const START_URLS = [
  "https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=1",
  "https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=2",
];

const OUTPUT_FILE = path.resolve(__dirname, "groups.json");

const NAV_TIMEOUT = 25_000; // ожидание навигации (ms)
const CLICK_WAIT_AFTER = 700; // ждать после клика (ms) — нужен для динамических постбэков
const MAX_GROUPS = 2000; // лимит найденных групп (чтобы не гонять бесконечно)
const HEADLESS = process.env.HEADLESS === "false" ? false : true; // установить HEADLESS=false для отладки
const MAX_STACK_ITEMS = 20000; // защита от взрывного роста очереди
////////////////////////////////////////////////////

function sanitizeText(s) {
  if (!s) return "";
  return s.replace(/\s+/g, " ").trim();
}

function extractGroupIdFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const g = u.searchParams.get("g");
    if (g) return g;
    // Иначе ищем число в конце параметров / id
    const m = urlStr.match(/[?&]g=(\d+)/) || urlStr.match(/(\d{3,})/);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}

async function getClickableItemsFromPage(page) {
  // Собирамеся все элементы, которые могут быть "кнопками" на странице:
  // - <a href="javascript:__doPostBack(...)">  (основной случай)
  // - <input type="submit" id="..." value="...">
  // Возвращаем массив { id, text, href }
  return page.$$eval(
    "a[href^='javascript:__doPostBack'], input[type='submit']",
    (nodes) =>
      Array.from(nodes).map((el) => {
        if (el.tagName.toLowerCase() === "a") {
          return {
            id: el.getAttribute("id") || "",
            text: el.textContent || el.innerText || el.getAttribute("title") || "",
            href: el.getAttribute("href") || "",
            tag: "a",
          };
        } else {
          return {
            id: el.getAttribute("id") || "",
            text: el.getAttribute("value") || el.textContent || el.innerText || "",
            href: null,
            tag: "input",
          };
        }
      })
  );
}

async function clickElementById(page, id) {
  // Надёжно кликнуть элемент по id (учитываем, что id могут содержать спецсимволы)
  const clicked = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) {
      // попробуем найти элемент с атрибутом id, который содержит id (на всякий случай)
      const alt = Array.from(document.querySelectorAll("[id]")).find((x) => x.id === id);
      if (!alt) {
        return { ok: false, reason: "not_found" };
      }
      alt.click();
      return { ok: true, reason: "clicked_alt" };
    }
    el.click();
    return { ok: true, reason: "clicked" };
  }, id);
  return clicked;
}

async function navigatePathAndCollect(browser, startUrl, pathIdsTexts) {
  // pathIdsTexts: [{id, text}] - последовательность кликов от стартовой страницы до текущего узла
  // Возвращает объект:
  //  { ok: true, sublinks: [{id,text}], isLeaf: boolean, url, title, breadcrumb: [...texts] }
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(NAV_TIMEOUT + 5000);
  try {
    await page.goto(startUrl, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
  } catch (e) {
    // иногда networkidle2 слишком строго — пробуем domcontentloaded
    try {
      await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    } catch (err) {
      await page.close();
      return { ok: false, error: "start_goto_failed" };
    }
  }

  // По шагам кликаем
  for (let i = 0; i < pathIdsTexts.length; i++) {
    const step = pathIdsTexts[i];
    const id = step.id;
    if (!id) {
      // если нет id, пытаемся найти по тексту — рискованно
      await page.waitForTimeout(300);
      continue;
    }

    // Если элемент на экране может быть скрыт или вне вьюпорта — прокрутим
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    }, id);

    // Кликаем
    const clickResult = await clickElementById(page, id);
    // Ждём либо навигацию, либо немного времени, чтобы JS успел отработать
    await Promise.race([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: NAV_TIMEOUT }).catch(() => null),
      page.waitForTimeout(CLICK_WAIT_AFTER),
    ]);

    // Иногда postback обновляет часть страницы, но не меняет URL. Дожидаемся загрузки контента.
    await page.waitForTimeout(200);
  }

  // После того как дошли до текущего узла — собираем возможные следующие клики
  const sublinks = await getClickableItemsFromPage(page);

  // Иногда страница содержит контейнер с расписанием и не имеет дополнительных ссылок —
  // в таком случае sublinks.length === 0 — значит leaf
  const urlNow = page.url();
  const title = await page.title();

  await page.close();

  return {
    ok: true,
    sublinks,
    isLeaf: sublinks.length === 0,
    url: urlNow,
    title,
    breadcrumb: pathIdsTexts.map((p) => sanitizeText(p.text)),
  };
}

(async () => {
  console.log("Start crawling. HEADLESS =", HEADLESS);
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--allow-insecure-localhost",
    ],
  });

  const groups = []; // финальные найденные группы
  const visitedPaths = new Set(); // ключ: startUrl|id1>id2>... (чтобы не повторять)
  const stack = []; // стек путей для обработки. Элементы: { startUrl, path: [{id,text}] }

  try {
    // Инициализация: для каждого стартового URL собираем топ-уровнев клики
    for (const startUrl of START_URLS) {
      const page = await browser.newPage();
      try {
        await page.goto(startUrl, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
      } catch (e) {
        try {
          await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
        } catch (err) {
          console.error("Не удалось открыть стартовую страницу:", startUrl, err.message || err);
          await page.close();
          continue;
        }
      }

      const topLinks = await getClickableItemsFromPage(page);
      await page.close();

      for (const l of topLinks) {
        const key = `${startUrl}|${l.id}`;
        if (!visitedPaths.has(key)) {
          visitedPaths.add(key);
          stack.push({ startUrl, path: [{ id: l.id, text: sanitizeText(l.text || "") }] });
        }
      }
    }

    console.log("Initial stack size:", stack.length);
    let processed = 0;

    while (stack.length > 0 && groups.length < MAX_GROUPS) {
      if (stack.length > MAX_STACK_ITEMS) {
        console.warn("Stack exceeded MAX_STACK_ITEMS. Breaking to avoid runaway.");
        break;
      }
      const item = stack.pop(); // DFS
      processed++;
      if (processed % 50 === 0) {
        console.log(`Processed ${processed} nodes. Found groups: ${groups.length}. Stack: ${stack.length}`);
      }

      const key = `${item.startUrl}|${item.path.map((p) => p.id).join(">")}`;
      // Safety: если уже посещали точь-в-точь этот путь — пропускаем
      if (visitedPaths.has(key)) continue;
      visitedPaths.add(key);

      const res = await navigatePathAndCollect(browser, item.startUrl, item.path);
      if (!res.ok) {
        console.warn("Navigate failed for path", item.path.map(p=>p.text), res.error);
        continue;
      }

      if (res.sublinks && res.sublinks.length > 0) {
        // добавляем каждый дочерний элемент в стек (path + child)
        for (const child of res.sublinks) {
          const childId = child.id || "";
          const childText = sanitizeText(child.text || "");
          const newPath = item.path.concat([{ id: childId, text: childText }]);
          const newKey = `${item.startUrl}|${newPath.map((p) => p.id).join(">")}`;
          if (!visitedPaths.has(newKey)) {
            // защита: если newKey слишком длинный — пропускаем
            if (newPath.length > 20) {
              console.warn("Path too deep, skipping:", newPath.map((p) => p.text));
              continue;
            }
            visitedPaths.add(newKey);
            stack.push({ startUrl: item.startUrl, path: newPath });
          }
        }
      } else {
        // Leaf: трактуем как группа (или конечная страница)
        const breadcrumb = res.breadcrumb;
        const last = breadcrumb[breadcrumb.length - 1] || "";
        const url = res.url || "";
        const title = res.title || last || "";
        const groupId = extractGroupIdFromUrl(url) || (item.path[item.path.length - 1].id.match(/\d+/) || [null])[0] || null;

        // Составим понятный label: "Group (Faculty, Program, Course)"
        // Параметры breadcrumb могут содержать: Факультет, Программа, Курс, Название группы
        // Попробуем выделить: last = group name, предыдущие — faculty/program/course
        const labelParts = [];
        const groupName = last;
        const faculty = breadcrumb.length >= 3 ? breadcrumb[0] : breadcrumb[0] || "";
        const program = breadcrumb.length >= 3 ? breadcrumb[1] : breadcrumb[1] || "";
        const course = breadcrumb.length >= 3 ? breadcrumb[2] : breadcrumb[2] || "";

        // Формируем описательный заголовок для автокомплита:
        const display = `${groupName} ${faculty ? `(${faculty}${program ? ", " + program : ""}${course ? ", " + course : ""})` : ""}`.trim();

        groups.push({
          id: groupId,
          title: groupName,
          display,
          breadcrumb,
          url,
          sourceStart: item.startUrl,
          rawPathIds: item.path.map((p) => p.id),
        });
      }
    }

    // Сохраняем
    console.log("Crawling finished. Found groups:", groups.length);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), groups }, null, 2), "utf-8");
    console.log("Saved to", OUTPUT_FILE);
  } catch (err) {
    console.error("Fatal error:", err);
  } finally {
    await browser.close().catch(() => {});
  }
})();
