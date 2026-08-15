import { input } from "@inquirer/prompts";
import { spinner } from "./utils/spinner.js";
import { askAssistant } from "./lib/assistant.js";

try {
  while (true) {
    const userQuestion = (await input({ message: "請輸入你的問題：" })).trim();
    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("思考中...").start();
    const result = await askAssistant(userQuestion, { verbose: false });
    spin.stop();

    for (const call of result.toolCalls) {
      console.log(`[已呼叫工具] ${call.name}(${JSON.stringify(call.args)})`);
    }
    console.log(result.answer);
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
