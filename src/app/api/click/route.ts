/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  const url = "https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=2";

  const response = await axios.get(url, {
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  const $ = cheerio.load(response.data);

  const buttons: { title: string; eventTarget: string }[] = [];

  $("a[href^=\"javascript:__doPostBack\"]").each((_, el) => {
    const onclick = $(el).attr("href") || "";
    const match = /__doPostBack\('([^']+)'/.exec(onclick);
    const eventTarget = match ? match[1] : "";
    const title = $(el).find("span").text().trim();
    if (eventTarget) {
      buttons.push({ title, eventTarget });
    }
  });

  return NextResponse.json({ buttons });
}