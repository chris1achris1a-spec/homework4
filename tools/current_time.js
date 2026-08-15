import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

export function getCurrentTime() {
  return new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
  });
}

export const currentTimeTool = defineTool({
  name: "get_current_time",
  description: "取得現在的台灣時間，適合回答現在幾點、目前時間、台灣時間等問題。",
  fn: getCurrentTime,
  parameters: z.object({}),
});
