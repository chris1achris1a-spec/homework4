import { client, DEFAULT_MODEL } from "./openai.js";
import { toOpenAITool } from "../utils/func-tool.js";
import * as allTools from "../tools/index.js";

const SYSTEM_PROMPT = `你是一位能整合時間與天氣工具的繁體中文助理。
回答規則：
1. 使用者問「現在幾點」、「目前時間」或「台灣時間」時，必須呼叫 get_current_time。
2. 使用者問「天氣」、「氣溫」、「濕度」或指定城市天氣時，必須呼叫 get_weather。
3. 如果同一個問題同時問時間與天氣，必須在同一輪回答中呼叫兩個工具，並整合成自然的繁體中文回答。
4. 不要假裝查過工具；如果工具回傳錯誤，要清楚說明錯誤與可修正方式。`;

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const toolsByName = Object.fromEntries(toolList.map((tool) => [tool.name, tool]));
const MAX_TOOL_ROUNDS = 8;

export async function askAssistant(userQuestion, { verbose = true } = {}) {
  const history = [
    { role: "developer", content: SYSTEM_PROMPT },
    { role: "user", content: userQuestion },
  ];
  const toolCalls = [];

  for (let round = 1; round <= MAX_TOOL_ROUNDS; round += 1) {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: history,
      tools,
      tool_choice: "auto",
    });

    history.push(...response.output);

    const functionCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    if (functionCalls.length === 0) {
      return {
        answer: response.output_text,
        toolCalls,
      };
    }

    for (const functionCall of functionCalls) {
      const tool = toolsByName[functionCall.name];
      if (!tool) {
        throw new Error(`模型要求了未註冊的工具：${functionCall.name}`);
      }

      const rawArgs = functionCall.arguments ? JSON.parse(functionCall.arguments) : {};
      const args = tool.parameters.parse(rawArgs);
      if (verbose) {
        console.log(`\n[呼叫 tool] ${functionCall.name}(${JSON.stringify(args)})`);
      }

      const result = await tool.fn(args);
      toolCalls.push({ name: functionCall.name, args, result });

      history.push({
        type: "function_call_output",
        call_id: functionCall.call_id,
        output: JSON.stringify(result),
      });
    }
  }

  throw new Error(`Tool calling 超過 ${MAX_TOOL_ROUNDS} 輪，已停止執行`);
}
