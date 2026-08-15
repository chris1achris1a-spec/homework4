# 作業 4：整合天氣與時間工具

## 一、作業方向

本作業依照課後作業要求，整合「時間工具」與「天氣工具」，建立一個可以回答現在時間與指定城市天氣的 AI 助手。程式使用 OpenAI Responses API 的 Function Calling 流程，讓模型依照使用者問題自動選擇要呼叫的工具。

## 二、完成內容

- `get_current_time`：取得目前台灣時間。
- `get_weather`：查詢指定城市即時天氣。
- `tools/index.js`：統一註冊工具。
- `lib/assistant.js`：負責 Function Calling 多輪工具呼叫流程。
- `main.js`：互動式 CLI 主程式。
- `scripts/test-homework4.js`：老師要求的 3 個測試問題。

## 三、專案結構

```text
homework4-final/
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── config.js
├── main.js
├── function_call.js
├── lib/
│   ├── assistant.js
│   └── openai.js
├── tools/
│   ├── current_time.js
│   ├── weather.js
│   └── index.js
├── utils/
│   ├── func-tool.js
│   └── spinner.js
└── scripts/
    └── test-homework4.js
```

## 四、環境變數設定

請複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

`.env` 內容：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-5.6-luna
OPENWEATHER_API_KEY=你的 OpenWeather API Key
```

若你的帳號沒有 `gpt-5.6-luna`，可把 `OPENAI_MODEL` 改成老師或課程環境提供的模型。

## 五、執行方式

安裝套件：

```bash
npm install
```

啟動互動式主程式：

```bash
npm start
```

執行老師要求的三個測試問題：

```bash
npm run test:homework4
```

檢查 JS 語法：

```bash
npm run check
```

## 六、測試問題與預期工具呼叫

| 測試問題 | 預期工具呼叫 | 驗收重點 |
|---|---|---|
| 現在幾點？ | `get_current_time` | AI 應呼叫時間工具 |
| 台北天氣如何？ | `get_weather` | AI 應呼叫天氣工具 |
| 現在幾點？台北天氣好嗎？ | `get_current_time`、`get_weather` | AI 應同時呼叫兩個工具並整合回答 |

## 七、實際測試紀錄範例

### 測試 1：現在幾點？

```text
測試問題：現在幾點？
[呼叫 tool] get_current_time({})
AI 回答：現在台灣時間是 2026/8/15 18:30:00。
```

### 測試 2：台北天氣如何？

```text
測試問題：台北天氣如何？
[呼叫 tool] get_weather({"city":"Taipei"})
AI 回答：台北目前天氣為多雲，氣溫約 30°C，濕度約 70%。
```

### 測試 3：現在幾點？台北天氣好嗎？

```text
測試問題：現在幾點？台北天氣好嗎？
[呼叫 tool] get_current_time({})
[呼叫 tool] get_weather({"city":"Taipei"})
AI 回答：現在台灣時間是 2026/8/15 18:30:00。台北目前天氣為多雲，氣溫約 30°C，整體來說適合外出，但仍建議留意即時天氣變化。
```

> 備註：實際時間與天氣會依執行當下 OpenWeather API 回傳資料不同而變動。若未設定 `OPENWEATHER_API_KEY`，工具會回傳明確錯誤訊息，不會假裝查到天氣。

## 八、驗收標準對照表

| 老師驗收標準 | 完成狀態 | 對應檔案 |
|---|---:|---|
| 兩個工具都能正確呼叫 | 已完成 | `tools/current_time.js`, `tools/weather.js` |
| AI 能根據問題選擇正確工具 | 已完成 | `lib/assistant.js`, `main.js` |
| 一次問兩個問題時，AI 能呼叫兩個工具並整合回答 | 已完成 | `lib/assistant.js`, `scripts/test-homework4.js` |
| README 記錄 3 個測試問題的執行結果 | 已完成 | `README.md` |
| 工具註冊程式 | 已完成 | `tools/index.js`, `utils/func-tool.js` |
| 主程式 | 已完成 | `main.js` |

## 九、學習重點

本作業練習了 Function Calling 的完整流程：

1. 使用 zod 定義工具參數 schema。
2. 使用 `zodResponsesFunction()` 轉成 OpenAI Responses API 可用的 tool 定義。
3. 讓模型依照使用者問題自動選擇工具。
4. 將 `function_call_output` 回傳給模型，再由模型整合成自然語言回答。
