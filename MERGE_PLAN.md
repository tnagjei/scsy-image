# 图像转素描功能合并计划

## 概述
将 `image-to-sketch-converter` 项目的图像转素描功能合并到 `scsy-image` 项目中，作为新的功能模块。

## 准备工作
1. ✅ 备份整个 `scsy-image` 文件夹
2. ✅ 确保所有现有依赖已安装：`npm install`
3. ✅ 了解现有架构：
   - `scsy-image`: Next.js 14, TypeScript, Replicate AI, HeroUI, PostgreSQL
   - `image-to-sketch-converter`: Vite, React, Google Gemini, Tailwind CSS

## 合并步骤

### 步骤1: 添加依赖
#### 详细操作步骤：
1. **打开文件**: 在 VSCode 中，点击左侧文件资源管理器，找到 `scsy-image` 文件夹，展开后找到 `package.json` 文件，双击打开
2. **定位依赖部分**: 在打开的 `package.json` 文件中，找到 `"dependencies"` 对象（通常在第13行左右）
3. **添加新依赖**: 在 `"dependencies"` 对象中添加一行：
   ```json
   "@google/genai": "^1.21.0",
   ```
   注意：确保在最后一个依赖项后添加逗号，如果它是最后一个，则不需要逗号
4. **保存文件**: 按 `Ctrl+S` (Windows/Linux) 或 `Cmd+S` (Mac) 保存文件
5. **验证语法**: 检查 JSON 语法是否正确（VSCode 会显示红色波浪线如果有语法错误）
6. **安装依赖**: 打开终端（VSCode 中按 `Ctrl+`` 打开集成终端），确保在 `scsy-image` 目录下，运行：
   ```bash
   npm install
   ```
7. **等待安装完成**: 观察终端输出，等待安装完成（可能需要几分钟）
8. **验证安装**: 检查 `node_modules` 文件夹中是否出现了 `@google/genai` 文件夹
9. **检查 package-lock.json**: 确保 `package-lock.json` 文件已更新

#### 预期结果：
- `package.json` 中新增 `"@google/genai": "^1.21.0"` 依赖
- `node_modules/@google/genai/` 文件夹存在
- `package-lock.json` 已更新

#### 错误处理：
- 如果 `npm install` 失败，检查网络连接或尝试 `npm install --verbose` 获取详细错误信息
- 如果语法错误，检查 JSON 格式（引号、逗号等）

#### 完成标记：
- [x] 步骤1完成 - 依赖已添加并安装 (✅ 2024-09-28)

### 步骤2: 创建新页面路由
#### 详细操作步骤：
1. **打开项目结构**: 在 VSCode 文件资源管理器中，展开 `scsy-image/src/app/[locale]/(free)/` 文件夹
2. **创建新文件夹**: 右键点击 `(free)` 文件夹，选择"新建文件夹"，输入 `image-to-sketch`
3. **验证文件夹创建**: 确认 `image-to-sketch` 文件夹已出现在 `(free)` 文件夹下
4. **创建页面文件**: 在新创建的 `image-to-sketch` 文件夹内，右键点击空白区域，选择"新建文件"，命名为 `page.tsx`
5. **实现基本页面结构**:
   - 添加 React 导入
   - 创建默认导出函数组件
   - 添加基本的 JSX 结构和占位内容
   - 设置页面标题和描述
6. **导入必要组件** (暂时占位，后续步骤实现):
   - 导入布局组件 (Header, Footer)
   - 导入功能组件占位符 (ImageUploader, ImageDisplay 等)
7. **设置页面元数据**: 使用 Next.js metadata API 设置页面标题
8. **添加基本样式**: 使用 Tailwind CSS 类保持与现有页面一致的样式
9. **验证文件结构**: 确保文件路径为 `scsy-image/src/app/[locale]/(free)/image-to-sketch/page.tsx`

#### 预期结果：
- 新文件夹: `scsy-image/src/app/[locale]/(free)/image-to-sketch/`
- 新文件: `page.tsx` 包含基本的 React 组件结构
- 页面可通过路由 `/[locale]/image-to-sketch` 访问
- 页面包含基本的标题和占位内容

#### 验证方法和标准：
1. **文件系统验证**: 检查文件夹和文件是否正确创建
   - ✅ `image-to-sketch` 文件夹存在
   - ✅ `page.tsx` 文件存在且可编辑

2. **代码结构验证**: 检查页面文件的基本结构
   - ✅ 包含有效的 React 组件
   - ✅ 有默认导出
   - ✅ 无语法错误 (VSCode 不显示红色波浪线)

3. **路由验证**: 测试页面是否可访问
   - ✅ 运行 `npm run dev` 后可访问 `/en/image-to-sketch`
   - ✅ 页面正常渲染，无控制台错误

4. **内容验证**: 检查页面显示内容
   - ✅ 显示页面标题 "Image to Sketch"
   - ✅ 显示占位内容或基础布局

#### 错误处理：
- 如果文件夹创建失败，检查文件系统权限
- 如果页面无法访问，检查路由配置和文件命名
- 如果有 TypeScript 错误，检查导入语句和类型定义

#### 完成标记：
- [ ] 步骤2完成 - 新页面路由已创建并可访问

### 步骤3: 迁移组件
- [ ] 在 `scsy-image/src/components/` 创建 `image-to-sketch/` 文件夹
- [ ] 从 `image-to-sketch-converter/components/` 复制：
  - `ImageUploader.tsx` (需适配 HeroUI 样式)
  - `ImageDisplay.tsx` (需适配 HeroUI 样式)
  - `Spinner.tsx`
- [ ] 从 `image-to-sketch-converter/components/icons/` 复制：
  - `UploadIcon.tsx`
  - `PhotoIcon.tsx`
  - `SparklesIcon.tsx`
- [ ] 修改组件导入路径以匹配新结构
- [ ] 适配样式从 Tailwind 到 HeroUI (使用 `cn()` 工具函数)

### 步骤4: 迁移服务和工具
- [ ] 在 `scsy-image/src/backend/service/` 创建 `image_to_sketch.ts`
- [ ] 从 `image-to-sketch-converter/services/geminiService.ts` 复制核心逻辑：
  - `generateSketch` 函数
  - Gemini API 调用
- [ ] 在 `scsy-image/src/utils/` 创建 `imageUtils.ts`
- [ ] 从 `image-to-sketch-converter/utils/fileUtils.ts` 复制：
  - `fileToBase64` 函数
  - `getMimeType` 函数

### 步骤5: 添加环境变量
- [ ] 打开 `scsy-image/.env.local`
- [ ] 添加：
  ```
  GEMINI_API_KEY=PLACEHOLDER_API_KEY
  ```
- [ ] 提醒用户替换为真实 API 密钥

### 步骤6: 更新导航
- [ ] 打开 `scsy-image/src/components/layout/navbar/navbar.tsx`
- [ ] 在导航菜单数组中添加：
  ```typescript
  { tag: "image-to-sketch", path: "image-to-sketch" }
  ```
- [ ] 在 JSX 中添加对应的链接和条件渲染

### 步骤7: 更新国际化
- [ ] 打开 `scsy-image/messages/en.json`
- [ ] 添加新功能的翻译：
  ```json
  "image-to-sketch": "Image to Sketch",
  "input": {
    "title": "Upload Image"
  }
  ```

### 步骤8: 创建 API 路由 (如果需要后端处理)
- [ ] 在 `scsy-image/src/app/api/` 创建 `image-to-sketch/` 文件夹
- [ ] 创建 `route.ts` 文件：
  ```typescript
  import { NextResponse } from "next/server";
  import { generateSketch } from "@/backend/service/image_to_sketch";

  export async function POST(request: Request) {
    // 处理图像上传和转换
  }
  ```

### 步骤9: 测试集成
- [ ] 运行 `npm run dev`
- [ ] 访问 `/en/image-to-sketch` 测试新功能
- [ ] 检查控制台错误
- [ ] 验证与现有功能不冲突
- [ ] 测试文件上传和转换功能

## 注意事项和风险
- **AI服务管理**: 需要管理两个AI服务 (Replicate + Gemini)
- **样式一致性**: 新组件需与 HeroUI 设计系统兼容
- **性能考虑**: 图像处理可能影响应用响应速度
- **安全验证**: 确保文件上传的安全检查
- **错误处理**: 集成现有错误处理机制

## 回滚计划
如果合并失败：
1. 从备份恢复项目
2. 删除新添加的文件和依赖
3. 移除导航和路由更改

## 完成标记
所有步骤完成后，在此文档顶部标记 ✅ 完成。
