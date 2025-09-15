// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function POST(request: Request) {
//   const { tr, eventTarget } = await request.json();

//   const url = `https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=${tr}`;

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.goto(url, { waitUntil: "networkidle2" });

//   await page.waitForSelector(`a[href*="${eventTarget}"]`, { timeout: 5000 }).catch(() => null);

//   if (eventTarget) {
//     // эмулируем __doPostBack через JS
//     await page.evaluate((eventTarget) => {
//       // @ts-expect-error
//       __doPostBack(eventTarget, "");
//     }, eventTarget);

//     await page.waitForSelector("a[href^='javascript:__doPostBack']", { timeout: 5000 }); // можно подождать дольше или добавить waitForSelector кнопок/таблицы
//   }

//   const content = await page.content();

//   const buttons = await page.evaluate(() => {
//     const btns: { title: string; eventTarget: string }[] = [];
//     document.querySelectorAll("a[href^='javascript:__doPostBack']").forEach((el) => {
//       const onclick = el.getAttribute("href") || "";
//       const match = /__doPostBack\('([^']+)'/.exec(onclick);
//       const eventTargetNext = match ? match[1] : "";
//       const titleEl = el.querySelector("span");
//       const title = titleEl ? titleEl.textContent?.trim() || "" : "";
//       if (eventTargetNext) btns.push({ title, eventTarget: eventTargetNext });
//     });
//     return btns;
//   });

//   await browser.close();

//   return NextResponse.json({ buttons, htmlLength: content.length });
// }