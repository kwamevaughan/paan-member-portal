import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import toast from "react-hot-toast";
import { normalizeTier } from "@/components/Badge";

const EmbedBadgeModal = ({ isOpen, onClose, mode, user }) => {
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedStyle, setSelectedStyle] = useState("default");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [copiedCode, setCopiedCode] = useState("");

  // Get user's normalized tier
  const userTier = normalizeTier(user?.selected_tier) || "Free Member";

  // Map tiers to badge file names
  const tierToBadgeMap = {
    "Free Member": "Free-Member",
    "Associate Member": "Associate-Member",
    "Full Member": "Full-Member",
    "Gold Member": "Gold-Member",
    Admin: "Gold-Member", // Admin users get Gold Member badge
  };

  const badgeFileName = tierToBadgeMap[userTier] || "Free-Member";
  const badgeUrl = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`;

  // Size options with enhanced styling
  const sizeOptions = {
    small: { width: 80, height: 80, label: "Small", sublabel: "80×80px" },
    medium: { width: 120, height: 120, label: "Medium", sublabel: "120×120px" },
    large: { width: 160, height: 160, label: "Large", sublabel: "160×160px" },
    xlarge: {
      width: 200,
      height: 200,
      label: "X-Large",
      sublabel: "200×200px",
    },
  };

  // Enhanced style options
  const styleOptions = {
    default: {
      label: "Default",
      icon: "mdi:image-outline",
      css: "",
    },
    rounded: {
      label: "Rounded",
      icon: "mdi:border-radius",
      css: "border-radius: 12px;",
    },
    circular: {
      label: "Circular",
      icon: "mdi:circle-outline",
      css: "border-radius: 50%;",
    },
    shadow: {
      label: "Shadow",
      icon: "mdi:shadow",
      css: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);",
    },
    border: {
      label: "Border",
      icon: "mdi:border-all",
      css: "border: 2px solid #172840; padding: 4px;",
    },
  };

  // Enhanced format options
  const formatOptions = {
    html: {
      label: "HTML",
      icon: "mdi:language-html5",
      extension: "html",
      color: "text-orange-500",
    },
    markdown: {
      label: "Markdown",
      icon: "mdi:language-markdown",
      extension: "md",
      color: "text-blue-500",
    },
    react: {
      label: "React",
      icon: "mdi:react",
      extension: "jsx",
      color: "text-cyan-500",
    },
    vue: {
      label: "Vue",
      icon: "mdi:vuejs",
      extension: "vue",
      color: "text-green-500",
    },
    bbcode: {
      label: "BBCode",
      icon: "mdi:code-brackets",
      extension: "txt",
      color: "text-purple-500",
    },
    url: {
      label: "Direct URL",
      icon: "mdi:link",
      extension: "txt",
      color: "text-gray-500",
    },
  };

  // Generate code based on selected format (keeping original logic)
  const generateCode = () => {
    const size = sizeOptions[selectedSize];
    const style = styleOptions[selectedStyle];
    const displayTier = userTier === "Admin" ? "Gold" : userTier;
    const altText = `${user?.name} - PAAN ${displayTier} Member`;
    const titleText = `Verified PAAN ${displayTier} Member`;

    switch (selectedFormat) {
      case "html":
        return `<!-- PAAN ${displayTier} Member Badge -->
<div style="display: inline-block; ${style.css}">
  <img 
    src="${badgeUrl}" 
    alt="${altText}" 
    width="${size.width}" 
    height="${size.height}" 
    style="max-width: 100%; height: auto; ${style.css}"
    title="${titleText}"
  />
</div>`;

      case "markdown":
        return `<!-- PAAN ${displayTier} Member Badge -->
![${altText}](${badgeUrl} "${titleText}")`;

      case "react":
        const reactStyle = {
          display: "inline-block",
          maxWidth: "100%",
          height: "auto",
          ...(selectedStyle === "rounded" && { borderRadius: "12px" }),
          ...(selectedStyle === "circular" && { borderRadius: "50%" }),
          ...(selectedStyle === "shadow" && {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }),
          ...(selectedStyle === "border" && {
            border: "2px solid #172840",
            padding: "4px",
          }),
        };

        return `{/* PAAN ${displayTier} Member Badge */}
<div style={{ display: 'inline-block'${
          selectedStyle !== "default"
            ? `, ${style.css
                .replace(/;/g, "")
                .split(":")
                .map((part, i) =>
                  i % 2 === 0
                    ? part
                        .trim()
                        .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                    : `'${part.trim()}'`
                )
                .join(": ")}`
            : ""
        } }}>
  <img 
    src="${badgeUrl}"
    alt="${altText}"
    width={${size.width}}
    height={${size.height}}
    style={${JSON.stringify(reactStyle, null, 4).replace(/"/g, "'")}}
    title="${titleText}"
  />
</div>`;

      case "vue":
        return `<!-- PAAN ${displayTier} Member Badge -->
<template>
  <div :style="{ display: 'inline-block'${
    selectedStyle !== "default" ? `, ${style.css}` : ""
  } }">
    <img 
      :src="badgeUrl"
      :alt="altText"
      :width="${size.width}"
      :height="${size.height}"
      :style="{ maxWidth: '100%', height: 'auto'${
        selectedStyle !== "default" ? `, ${style.css}` : ""
      } }"
      :title="titleText"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      badgeUrl: '${badgeUrl}',
      altText: '${altText}',
      titleText: '${titleText}'
    }
  }
}
</script>`;

      case "bbcode":
        return `[img width=${size.width} height=${size.height}]${badgeUrl}[/img]`;

      case "url":
        return badgeUrl;

      default:
        return generateCode("html");
    }
  };

  // Copy code to clipboard
  const copyToClipboard = async () => {
    const code = generateCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(
        `${formatOptions[selectedFormat].label} code copied to clipboard!`
      );

      // Reset copied state after 3 seconds
      setTimeout(() => setCopiedCode(""), 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy code. Please try again.");
    }
  };

  // Download file (keeping original logic)
  const downloadFile = () => {
    const code = generateCode();
    const format = formatOptions[selectedFormat];
    let fileContent = code;
    let mimeType = "text/plain";

    // Create full file content based on format
    if (selectedFormat === "html") {
      fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user?.name} - PAAN Member Badge</title>
</head>
<body>
    ${code}
</body>
</html>`;
      mimeType = "text/html";
    } else if (selectedFormat === "markdown") {
      mimeType = "text/markdown";
    } else if (selectedFormat === "react") {
      mimeType = "text/jsx";
    } else if (selectedFormat === "vue") {
      mimeType = "text/vue";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${user?.name?.replace(/\s+/g, "_")}_PAAN_Badge.${
      format.extension
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${format.label} file downloaded!`);
  };

  const currentCode = generateCode();

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Embed Your PAAN Badge"
      mode={mode}
      width="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-paan-blue/10 via-transparent to-paan-red/10 rounded-2xl blur-3xl -z-10" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-paan-blue rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon icon="mdi:code-tags" className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-paan-blue mb-3">
              Embed Your {userTier === "Admin" ? "Gold" : userTier} Badge
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate beautiful, responsive code in multiple formats to
              showcase your verified PAAN membership across all your platforms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Size Selection */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:resize"
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Badge Size
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(sizeOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedSize === key
                        ? "border-paan-blue bg-paan-blue/10 shadow-md scale-105"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.sublabel}
                      </div>
                    </div>
                    {selectedSize === key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-paan-blue rounded-full flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:palette-outline"
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Badge Style
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(styleOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStyle(key)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedStyle === key
                        ? "border-paan-blue bg-paan-blue/10 shadow-md scale-105"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102"
                    }`}
                  >
                    <div className="text-center">
                      <Icon
                        icon={option.icon}
                        className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-300"
                      />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                    </div>
                    {selectedStyle === key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-paan-blue rounded-full flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:code-json"
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Output Format
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(formatOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFormat(key)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedFormat === key
                        ? "border-paan-blue bg-paan-blue/10 shadow-md scale-105"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-102"
                    }`}
                  >
                    <div className="text-center">
                      <Icon
                        icon={option.icon}
                        className={`w-6 h-6 mx-auto mb-2 ${option.color}`}
                      />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                    </div>
                    {selectedFormat === key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-paan-blue rounded-full flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="mdi:eye-outline"
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h4>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl opacity-50" />
                <div className="relative p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <div className="flex items-center justify-center">
                    <div
                      className="transition-all duration-300"
                      style={{
                        display: "inline-block",
                        ...(selectedStyle === "rounded" && {
                          borderRadius: "12px",
                        }),
                        ...(selectedStyle === "circular" && {
                          borderRadius: "50%",
                        }),
                        ...(selectedStyle === "shadow" && {
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                        }),
                        ...(selectedStyle === "border" && {
                          border: "2px solid #172840",
                          padding: "4px",
                        }),
                      }}
                    >
                      <img
                        src={badgeUrl}
                        alt={`${userTier} Badge Preview`}
                        width={sizeOptions[selectedSize].width}
                        height={sizeOptions[selectedSize].height}
                        className="max-w-full h-auto transition-all duration-300"
                        style={{
                          ...(selectedStyle === "rounded" && {
                            borderRadius: "12px",
                          }),
                          ...(selectedStyle === "circular" && {
                            borderRadius: "50%",
                          }),
                        }}
                        onError={(e) => {
                          e.target.src = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {sizeOptions[selectedSize].sublabel}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {styleOptions[selectedStyle].label} •{" "}
                  {formatOptions[selectedFormat].label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${formatOptions[
                  selectedFormat
                ].color
                  .replace("text-", "bg-")
                  .replace("500", "100")} dark:bg-opacity-30`}
              >
                <Icon
                  icon={formatOptions[selectedFormat].icon}
                  className={`w-5 h-5 ${formatOptions[selectedFormat].color}`}
                />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {formatOptions[selectedFormat].label} Code
              </h4>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  copiedCode === currentCode
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : "bg-paan-blue hover:bg-paan-blue/80 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                <Icon
                  icon={
                    copiedCode === currentCode
                      ? "mdi:check"
                      : "mdi:content-copy"
                  }
                  className="w-4 h-4"
                />
                {copiedCode === currentCode ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadFile}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:scale-105"
              >
                <Icon icon="mdi:download" className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  badge.{formatOptions[selectedFormat].extension}
                </span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {currentCode.split("\n").length} lines
              </div>
            </div>
            <pre className="p-4 text-sm overflow-x-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 max-h-64">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>

        {/* Enhanced Usage Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-paan-blue rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:lightbulb-on" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Quick Start Guide
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>
                      Choose your preferred format and styling options
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>Copy the generated code or download the file</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>
                      Paste into your website, documentation, or profile
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>All formats are fully responsive</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>Badge updates automatically with tier changes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 mt-0.5 text-green-600"
                    />
                    <span>Works across all modern browsers and devices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 px-6 py-3 bg-paan-red hover:shadow-lg text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Icon icon="mdi:content-copy" className="w-4 h-4" />
            Copy {formatOptions[selectedFormat].label} Code
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default EmbedBadgeModal;
