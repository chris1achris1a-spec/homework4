import { askAssistant } from "../lib/assistant.js";

const questions = [
  "現在幾點？",
  "台北天氣如何？",
  "現在幾點？台北天氣好嗎？",
];

for (const question of questions) {
  console.log("\n==============================");
  console.log(`測試問題：${question}`);
  const result = await askAssistant(question, { verbose: true });
  console.log("\nAI 回答：");
  console.log(result.answer);
}
