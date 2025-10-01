import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
你是一个专业的字体识别专家。用户上传了一张图片，请仅基于图像内容自动识别其中的字体。忽略任何其他元素，只关注文本部分的字体特征（如粗细、斜体、间距、字重等）。输出格式：字体名称（置信度百分比），例如："Arial (95%)"。如果图片中有多种字体，请列出所有识别结果，按置信度从高到低排序。如果无法识别，提供最相似的字体建议，并注明建议原因。

输出严格遵守以下JSON格式：
{
  "fonts": [
    {
      "name": "字体名称",
      "confidence": "置信度百分比 (0-100)",
      "foundry": "字体厂商 (如果可识别)",
      "license": "许可类型 (Commercial/Open Source)",
      "similar_fonts": ["相似字体1", "相似字体2"]
    }
  ],
  "text_detected": "检测到的文本内容 (如果可识别)",
  "notes": "额外说明或建议"
}

[用户上传的图片将在这里插入]
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('user_id') as string;
    const userEmail = formData.get('user_email') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    // Call OpenAI Vision API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please identify the fonts in this image.',
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Parse JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseError) {
      // If not JSON, fallback to simple parsing
      parsedResult = {
        fonts: [
          {
            name: responseText.split('(')[0].trim() || 'Unknown Font',
            confidence: responseText.includes('(') ? responseText.split('(')[1].replace('%)', '') : '80',
            foundry: 'Unknown',
            license: 'Unknown',
            similar_fonts: ['Arial', 'Helvetica'],
          },
        ],
        text_detected: 'Text detected but parsing failed',
        notes: 'Raw AI response: ' + responseText,
      };
    }

    // Here you can save to database if needed
    // await saveFontIdentificationResult(userId, userEmail, base64Image, parsedResult);

    return NextResponse.json({
      success: true,
      data: parsedResult,
    });

  } catch (error) {
    console.error('Font identification error:', error);
    return NextResponse.json(
      { error: 'Font identification failed. Please try again.' },
      { status: 500 }
    );
  }
}