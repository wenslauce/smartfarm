import React, { useState } from "react";
import { Upload, AlertCircle, Leaf, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendMessageToGroq } from '@/lib/groq';
import ReactMarkdown from "react-markdown";

const LoadingAnimation = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6"
          style={{
            bottom: '2rem',
            animation: `bounce ${1 + i * 0.2}s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          <Leaf
            className={`text-emerald-500 transform ${
              i % 2 === 0 ? "rotate-[-45deg]" : "rotate-45deg]"
            }`}
          />
        </div>
      ))}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-emerald-600 font-medium">
        Analyzing Plant...
      </div>
    </div>
  </div>
);

// Function to analyze image and extract features
const analyzeImageFeatures = async (imageElement) => {
  const features = {
    colors: [],
    patterns: [],
    affected_areas: []
  };

  // Create a canvas to analyze the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Analyze colors (simplified)
  const colorCounts = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.floor(data[i] / 32) * 32;
    const g = Math.floor(data[i + 1] / 32) * 32;
    const b = Math.floor(data[i + 2] / 32) * 32;
    const color = `rgb(${r},${g},${b})`;
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }

  // Get dominant colors
  features.colors = Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color);

  // Detect patterns (simplified)
  const regions = {
    top: features.colors[0],
    middle: features.colors[1] || features.colors[0],
    bottom: features.colors[2] || features.colors[0]
  };

  if (regions.top !== regions.bottom) {
    features.patterns.push('vertical_gradient');
  }
  if (regions.top !== regions.middle) {
    features.patterns.push('spots');
  }

  // Analyze affected areas
  const thirds = canvas.height / 3;
  const areas = ['upper', 'middle', 'lower'];
  areas.forEach((area, i) => {
    const startY = i * thirds;
    const endY = (i + 1) * thirds;
    let affected = false;

    // Simple check for color variations
    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const avgColor = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (Math.abs(avgColor - 128) > 50) {
          affected = true;
          break;
        }
      }
      if (affected) {
        features.affected_areas.push(area);
        break;
      }
    }
  });

  return features;
};

const formatAnalysisResponse = (content) => {
  // Add proper markdown formatting to the response
  return `## 🌿 Plant Disease Analysis

### 🔍 Primary Diagnosis
${content.match(/Primary Diagnosis[^:]*:[^\n]*/)?.[0]?.split(':')?.[1]?.trim() || 'Analysis in progress...'}

### ⚖️ Analysis Confidence
${content.match(/Analysis Confidence[^:]*:[^\n]*/)?.[0]?.split(':')?.[1]?.trim() || 'Calculating...'}

### 🔬 Disease Characteristics
${(content.match(/Disease Characteristics[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `- **${line.trim()}**`)
  .join('\n')}

### 🚩 Visual Indicators
${(content.match(/Visual Indicators[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `- ${line.trim()}`)
  .join('\n')}

### 🦠 Pathogen Analysis
${(content.match(/Pathogen Analysis[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `- ${line.trim()}`)
  .join('\n')}

### 💊 Treatment Protocol
${(content.match(/Treatment Protocol[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `1. **${line.trim()}**`)
  .join('\n')}

### 🛡️ Prevention Strategy
${(content.match(/Prevention Strategy[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `1. **${line.trim()}**`)
  .join('\n')}

### 🌱 Recovery Indicators
${(content.match(/Recovery Indicators[^:]*:([\s\S]*?)(?=###|$)/)?.[1] || '')
  .split('\n')
  .filter(line => line.trim())
  .map(line => `- ${line.trim()}`)
  .join('\n')}

---
*Analysis powered by advanced agricultural pathology AI*`;
};

const MedicalImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("english");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: `Uploaded: ${file.name}`,
        },
      ]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create an image element to analyze
      const img = new Image();
      const reader = new FileReader();

      const imageFeatures = await new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          img.onload = async () => {
            try {
              const features = await analyzeImageFeatures(img);
              resolve(features);
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(selectedFile);
      });

      // Create a detailed prompt with extracted features
      const analysisPrompt = `You are an advanced agricultural pathology AI system. Analyze the following plant characteristics and provide a detailed diagnostic report:

Image Features:
- Dominant Colors: ${imageFeatures.colors.join(', ')}
- Detected Patterns: ${imageFeatures.patterns.join(', ') || 'uniform'}
- Affected Areas: ${imageFeatures.affected_areas.join(', ') || 'none detected'}

Please provide a comprehensive analysis covering:

1. Primary Diagnosis
- Based on the color patterns and affected areas
- Consider common diseases with similar visual characteristics
- Assess the stage of the condition

2. Analysis Confidence
- Evaluate confidence based on the clarity of symptoms
- List key identifying features
- Note any potential ambiguities

3. Disease Characteristics
- Typical progression pattern
- Environmental factors that may contribute
- Common varieties affected

4. Visual Indicators
- Interpretation of the color patterns
- Significance of affected areas
- Typical vs. atypical presentation

5. Treatment Protocol
- Immediate actions needed
- Long-term management strategies
- Environmental modifications

6. Prevention Strategy
- Cultural practices
- Monitoring recommendations
- Risk mitigation

7. Recovery Indicators
- Signs of improvement to look for
- Timeline expectations
- Follow-up actions

Provide the analysis in ${language}, focusing on practical, actionable recommendations.`;

      try {
        const response = await sendMessageToGroq([{
          role: 'user',
          content: analysisPrompt
        }]);

        // Format the response with enhanced markdown
        const formattedContent = formatAnalysisResponse(response.content);

        setMessages(prev => [...prev, {
          type: "bot",
          content: formattedContent
        }]);
      } catch (error) {
        console.error("Error from Groq:", error);
        setError(error.message || "Failed to analyze the image. Please try again.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update the message rendering to enhance the visual presentation
  const MessageContent = ({ content, type }) => (
    <div
      className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
        type === "bot"
          ? "bg-white border border-emerald-100 text-emerald-800 prose prose-emerald max-w-none"
          : "bg-emerald-500 text-white"
      }`}
    >
      {type === "bot" ? (
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-emerald-800 mb-4 mt-2 flex items-center gap-2 border-b border-emerald-100 pb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-emerald-700 mb-3 mt-4 flex items-center gap-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-emerald-700 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-4 mb-4 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 mb-4 space-y-2">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-emerald-600 leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-emerald-800 bg-emerald-50 px-1 rounded">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="text-emerald-600 italic">{children}</em>
            ),
            hr: () => <hr className="my-6 border-emerald-100" />,
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-full relative py-4">
            <h1 className="text-2xl font-bold text-emerald-800 flex items-center justify-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              Plant Health Analysis
            </h1>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-800">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[120px] bg-white text-emerald-800">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white shadow-md border-emerald-100">
            <CardHeader className="text-center">
              <CardTitle className="text-emerald-700">Upload Plant Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-10 w-10 text-emerald-400" />
                      <div className="text-emerald-600 font-medium">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-sm text-emerald-500">
                        PNG, JPG, GIF up to 10MB
                      </div>
                    </div>
                  </label>
                </div>

                {/* Preview */}
                {preview && (
                  <div className="rounded-lg overflow-hidden border-2 border-emerald-100">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-sm transition-all duration-300 ${
                    !selectedFile || loading
                      ? "bg-emerald-300 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-md"
                  }`}
                >
                  {loading ? "Analyzing..." : "Analyze Plant"}
                </button>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white shadow-md border-emerald-100">
            <CardHeader className="text-center">
              <CardTitle className="text-emerald-700">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-emerald-50 to-white rounded-lg h-[400px] flex flex-col border border-emerald-100">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-emerald-500">
                      Upload a plant image to begin analysis
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${
                          message.type === "bot" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "bot"
                              ? "bg-emerald-100"
                              : "bg-emerald-500"
                          }`}
                        >
                          {message.type === "bot" ? (
                            <Leaf className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <MessageContent content={message.content} type={message.type} />
                      </div>
                    ))
                  )}
                </div>
                {loading && <LoadingAnimation />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalImageAnalysis;
