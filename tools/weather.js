import { z } from "zod";
import { OPENWEATHER_API_KEY } from "../config.js";
import { defineTool } from "../utils/func-tool.js";

export async function getWeather({ city }) {
  if (!OPENWEATHER_API_KEY) {
    return {
      error: "尚未設定 OPENWEATHER_API_KEY，請先在 .env 填入 OpenWeather API Key。",
      city,
    };
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", OPENWEATHER_API_KEY);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "zh_tw");

  const response = await fetch(url);
  if (!response.ok) {
    return {
      error: `OpenWeather API error: ${response.status}`,
      city,
    };
  }

  const data = await response.json();
  return {
    city: data.name,
    temperature: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    description: data.weather?.[0]?.description,
  };
}

export const weatherTool = defineTool({
  name: "get_weather",
  description: "取得指定城市的即時天氣資訊，包括溫度、體感溫度、濕度與天氣狀況。",
  fn: getWeather,
  parameters: z.object({
    city: z.string().describe("城市名稱，建議使用英文，例如 Taipei、Tokyo、Kaohsiung"),
  }),
});
