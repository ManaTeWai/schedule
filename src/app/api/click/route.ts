/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  const { tr, eventTarget } = await request.json();

  const url = `https://rasp.bukep.ru/Default.aspx?idFil=10006&tr=${tr}`;

  // 1. Загружаем страницу, чтобы вытащить скрытые поля
  const response = await axios.get(url, {
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });
  const $ = cheerio.load(response.data);

  const viewState = $("#__VIEWSTATE").val();
  const eventValidation = $("#__EVENTVALIDATION").val();
  const viewStateGen = $("#__VIEWSTATEGENERATOR").val();

  // 2. Формируем тело POST
  const formData = new URLSearchParams();
  if (viewState) formData.append("__VIEWSTATE", viewState.toString());
  if (eventValidation) formData.append("__EVENTVALIDATION", eventValidation.toString());
  if (viewStateGen) formData.append("__VIEWSTATEGENERATOR", viewStateGen.toString());

  formData.append("__EVENTTARGET", eventTarget);
  formData.append("__EVENTARGUMENT", "");

  // 3. Делаем POST
  const postResponse = await axios.post(url, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  // 4. Парсим новые кнопки
  const $$ = cheerio.load(postResponse.data);
  const buttons: { title: string; eventTarget: string }[] = [];

  $$("a[href^=\"javascript:__doPostBack\"]").each((_, el) => {
    const onclick = $$(el).attr("href") || "";
    const match = /__doPostBack\('([^']+)'/.exec(onclick);
    const eventTargetNext = match ? match[1] : "";
    const title = $$(el).find("span").text().trim();
    if (eventTargetNext) {
      buttons.push({ title, eventTarget: eventTargetNext });
    }
  });

  return NextResponse.json({ buttons });
}
