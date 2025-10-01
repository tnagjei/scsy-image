"use client";

import React, { useState } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import DeleteButton from "@/components/button/delete-button";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";

export default function FontIdentifier(props: {
  lang: string;
  credit: number;
  model: string;
  version: string;
  effect_link_name: string;
}) {
  const t = useTranslations(props.lang);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      // 验证文件大小 (最大10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size cannot exceed 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.warning("Please upload an image first");
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      // 将base64图像转换为Blob
      const response = await fetch(image);
      const blob = await response.blob();
      const imageFile = new File([blob], "font-image.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("image", imageFile);
      
      // 可选：添加用户ID用于追踪
      if (user?.uuid) {
        formData.append("user_id", user.uuid);
        formData.append("user_email", user.email || "");
      }

      const apiResponse = await fetch("/api/font-identify", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API请求失败: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();

      if (apiData.success) {
        setResult(apiData.data);
        toast.success("字体识别完成！");
      } else {
        throw new Error(apiData.error || "识别失败");
      }
    } catch (error: any) {
      console.error("字体识别失败:", error);
      setError(error.message || "识别失败，请重试");
      toast.error(error.message || "字体识别失败");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardBody className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 上传区域 */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t("input.title")}
              </h2>
              <p className="text-gray-600">
                Upload an image containing text, AI will identify the font in seconds
              </p>
            </div>

            {/* 图片上传组件 */}
            <div className="relative">
              <label className="relative flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-300">
                {image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt="待识别字体"
                      className="h-full w-full object-contain rounded-lg"
                    />
                    <DeleteButton onClick={handleDeleteImage} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm text-gray-500 text-center">
                      Click or drag to upload image<br />
                      Supports JPG, PNG format, up to 10MB
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>

            {/* 分析按钮 */}
            <Button
              className="w-full"
              color="primary"
              size="lg"
              onClick={handleAnalyze}
              isLoading={analyzing}
              disabled={!image}
            >
              {analyzing ? "Analyzing fonts..." : "Start Font Identification"}
            </Button>

            <div className="text-sm text-gray-500 text-center">
              💡 Tip: Upload high-clarity images for more accurate results
            </div>
          </div>

          {/* 结果区域 */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Identification Results
              </h3>
            </div>

            {!image && (
              <div className="flex items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Upload image to view font identification results</p>
                </div>
              </div>
            )}

            {image && !result && !analyzing && (
              <div className="flex items-center justify-center h-64 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl">
                <div className="text-center text-blue-600">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Ready, click button to start identification</p>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="flex items-center justify-center h-64 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl">
                <div className="text-center text-blue-600">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="font-semibold">AI is analyzing the image...</p>
                  <p className="text-sm mt-1">Expected to take a few seconds</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Identification Successful</h4>
                  <p className="text-sm text-green-700">
                    Detected text: "{result.text_detected}"
                  </p>
                </div>

                <div className="space-y-3">
                  {result.fonts.map((font: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-lg">{font.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          font.confidence > 0.9 ? 'bg-green-100 text-green-800' :
                          font.confidence > 0.8 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(font.confidence * 100).toFixed(0)}% 匹配
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Font Foundry:</span>
                          {font.foundry}
                        </div>
                        <div>
                          <span className="font-medium">License Type:</span>
                          {font.license}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="font-medium text-sm">Similar Fonts:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {font.similar_fonts.map((similar: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {similar}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button color="primary" variant="flat" className="flex-1">
                    Download Font Package
                  </Button>
                  <Button color="secondary" variant="flat" className="flex-1">
                    Copy CSS Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}