import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const START_URLS = [
  "https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=1",
  "https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=2",
];

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-certificate-errors"],
    });
    const page = await browser.newPage();

    const buttons: { id: string; title: string; from: string }[] = [];

    for (const url of START_URLS) {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const links = await page.$$eval("a[href^='javascript:__doPostBack']", (as) =>
        as.map((a) => ({
          id: a.getAttribute("id") || "",
          title: a.textContent?.trim() || "",
        }))
      );

      links.forEach((l) => buttons.push({ ...l, from: url }));
    }

    await browser.close();
    return NextResponse.json({ buttons });
  } catch (err) {
    if (browser) await browser.close();
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
