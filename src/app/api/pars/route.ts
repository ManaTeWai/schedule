// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const from = searchParams.get("from");
//   const id = searchParams.get("id");

//   if (!from || !id) {
//     return NextResponse.json({ error: "Params 'from' and 'id' are required" }, { status: 400 });
//   }

//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       headless: true,
//       ignoreHTTPSErrors: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--ignore-certificate-errors",
//       ],
//     });

//     const page = await browser.newPage();
//     await page.goto(from, { waitUntil: "networkidle2" });

//     // кликаем по нужной кнопке
//     const el = await page.$(`#${id}`);
//     if (!el) {
//       await browser.close();
//       return NextResponse.json({ error: `Button ${id} not found` }, { status: 404 });
//     }

//     await Promise.all([
//       el.click(),
//       page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => null),
//     ]);

//     // проверяем, есть ли новые postback-ссылки
//     const subLinks = await page.$$eval("a[href^='javascript:__doPostBack']", (as) =>
//       as.map((a) => ({
//         id: a.getAttribute("id") || "",
//         title: a.textContent?.trim() || "",
//       }))
//     );

//     let result;
//     if (subLinks.length > 0) {
//       // значит есть еще уровень вложенности
//       result = { type: "links", items: subLinks };
//     } else {
//       // конечная страница: собираем текст (расписание или "нет данных")
//       const content = await page.$eval("body", (b) => b.innerText);
//       result = { type: "content", content };
//     }

//     await browser.close();
//     return NextResponse.json(result);
//   } catch (err) {
//     if (browser) await browser.close();
//     return NextResponse.json({ error: (err as Error).message }, { status: 500 });
//   }
// }