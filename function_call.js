import { askAssistant } from "./lib/assistant.js";

const question = "現在幾點？台北天氣好嗎？";
const result = await askAssistant(question, { verbose: true });

console.log("\n[AI 回答]");
console.log(result.answer);
