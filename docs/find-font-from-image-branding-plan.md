# 品牌关键词替换计划：Find Font From Image

## 目标
- 将项目内现有的品牌关键词（如“AI Video Generator”“AI Image Generator”“AI Image Video Generator Template”等）统一替换为“Find Font From Image”。
- 保持功能逻辑不变，优先完成显性的文案、SEO 元信息、法务文本及 README 的品牌名同步。

## 主要影响范围
| 模块 | 文件/位置 | 当前关键词 | 说明 |
| ---- | ---------- | ---------- | ---- |
| 翻译文案 | `messages/en.json` | 多处 "AI Video Generator"/"AI Image Generator" | 涉及导航、SEO、落地页、FAQ、定价、仪表盘等所有文案片段，需要全文搜索替换并调整描述语气。 |
| 布局组件 | `src/components/layout/navbar/navbar.tsx`<br>`src/components/layout/footer/footer.tsx` | "AI Video Generator" | 顶部导航品牌名、页脚标题与版权信息需更新。 |
| 页面标题 | `src/app/not-found.tsx` | 标题/正文中含 "AI Video Generator" | 404 页面标题及提示文案需要同步。 |
| 落地页模块 | `src/components/landingpage/**` | Testimonials 数据中的品牌名 | 多条用户评价文本直接引用原品牌，需要替换或重写。 |
| 定价区块 | `src/components/price/app.tsx` | “Pick Your Best Plan of AI Video Generator” | 主标题至少替换品牌关键词，必要时结合新业务调整文案。 |
| 法务文本 | `src/app/[locale]/(free)/legal/privacy-policy/page.tsx`<br>`src/app/[locale]/(free)/legal/terms-of-service/page.tsx` | 多处 "AI Video Generator" | 法务条款全文引用旧品牌，需逐条替换。 |
| SEO/对外文件 | `public/llms.txt`<br>`messages/en.json` 内 SEO 字段 | "AI Image Video Generator Template" 等 | 面向爬虫/LLM 的描述应改为新品牌并考虑业务契合度。 |
| 文档 | `README.md` | 项目名称、描述 | 顶部标题及功能描述应改为围绕字体识别业务。 |

## 替换策略与注意事项
1. **先做文案定位**：确认新品牌“Find Font From Image”对应的产品定位（找字体/字体识别）。除替换品牌名外，需评估是否同步调整与“视频生成”相关的描述，以避免语义冲突。
2. **按模块分批更新**：
   - 先处理 `messages/en.json`，确保所有引用自动同步。
   - 之后更新组件与页面中硬编码的品牌名（导航、Footer、404、定价等）。
   - 最后更新法务、README、LLM 文档等不影响运行的文本。
3. **保持大小写一致**：根据场景决定使用“Find Font From Image”或全小写 `find font from image`，必要时定义常量以避免混用。
4. **二次校对**：更新后运行 `rg "AI Video"` 等命令确认无遗漏；同时检查是否存在图片/视频资源文件名需后续替换（本轮仅关注文本）。

## 后续验证
- 本地运行 `npm run lint`/`npm run build` 确保文案替换未破坏组件。
- 手动巡检关键页面（首页、定价页、仪表盘、法务页面）确认显示正确。
- 记录仍与“视频生成”强相关的文案，待下一阶段按照新业务逻辑改写。

## 执行步骤
1. **准备**：备份当前仓库或创建新分支，并拉取最新代码，确认无未提交冲突。
2. **翻译文案更新**：集中处理 `messages/en.json` 中的品牌与业务描述，替换为“Find Font From Image”并同步调整语义。
3. **组件与页面替换**：按导航 → 页脚 → 404 → 落地页 → 定价页面的顺序修改硬编码品牌词，确保 UI 组件一致。
4. **法务与外部文档**：更新隐私政策、服务条款、`README.md`、`public/llms.txt` 等对外文本，使其与新定位匹配。
5. **验证与巡检**：运行 `rg "AI Video"` 等命令确认旧品牌已清除，执行 `npm run lint`/`npm run build`，并逐页手动确认展示内容。
6. **提交与记录**：整理变更说明，提交代码并记录尚需后续优化的文案或资源。

## 进度记录
- [x] 步骤1：创建工作分支 `feature/rebrand-find-font` 并同步远端最新提交（git fetch & merge）。
- [x] 步骤2：更新 `messages/en.json`，全面替换品牌文案并改写首页、定价、FAQ 等描述以贴合 Find Font From Image。
