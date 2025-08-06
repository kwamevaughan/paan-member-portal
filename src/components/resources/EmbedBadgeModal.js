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

  // Size options
  const sizeOptions = {
    small: { width: 80, height: 80, label: "Small (80x80px)" },
    medium: { width: 120, height: 120, label: "Medium (120x120px)" },
    large: { width: 160, height: 160, label: "Large (160x160px)" },
    xlarge: { width: 200, height: 200, label: "Extra Large (200x200px)" },
  };

  // Style options
  const styleOptions = {
    default: {
      label: "Default",
      css: "",
    },
    rounded: {
      label: "Rounded Corners",
      css: "border-radius: 12px;",
    },
    circular: {
      label: "Circular",
      css: "border-radius: 50%;",
    },
    shadow: {
      label: "With Shadow",
      css: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);",
    },
    border: {
      label: "With Border",
      css: "border: 2px solid #172840; padding: 4px;",
    },
  };

  // Format options
  const formatOptions = {
    html: {
      label: "HTML",
      icon: "mdi:language-html5",
      extension: "html",
    },
    markdown: {
      label: "Markdown",
      icon: "mdi:language-markdown",
      extension: "md",
    },
    react: {
      label: "React/JSX",
      icon: "mdi:react",
      extension: "jsx",
    },
    vue: {
      label: "Vue.js",
      icon: "mdi:vuejs",
      extension: "vue",
    },
    bbcode: {
      label: "BBCode",
      icon: "mdi:code-brackets",
      extension: "txt",
    },
    url: {
      label: "Direct URL",
      icon: "mdi:link",
      extension: "txt",
    },
  };

  // Generate code based on selected format
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

  // Download file
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
      width="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
            <Icon icon="mdi:code-tags" className="w-8 h-8 text-paan-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Embed Your {userTier === "Admin" ? "Gold" : userTier} Badge
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Generate code in multiple formats to display your verified PAAN
            membership badge on your website, portfolio, or social media
            profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customization Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Customize Your Badge
            </h4>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(sizeOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      selectedSize === key
                        ? "border-paan-blue bg-paan-blue/10 text-paan-blue"
                        : mode === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge Style
              </label>
              <div className="space-y-2">
                {Object.entries(styleOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStyle(key)}
                    className={`w-full p-2 text-sm text-left rounded-lg border transition-colors ${
                      selectedStyle === key
                        ? "border-paan-blue bg-paan-blue/10 text-paan-blue"
                        : mode === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formatOptions).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFormat(key)}
                    className={`p-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${
                      selectedFormat === key
                        ? "border-paan-blue bg-paan-blue/10 text-paan-blue"
                        : mode === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Icon icon={option.icon} className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Badge Preview
            </h4>
            <div
              className={`p-6 rounded-lg border-2 border-dashed ${
                mode === "dark"
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <div
                  style={{
                    display: "inline-block",
                    ...(selectedStyle === "rounded" && {
                      borderRadius: "12px",
                    }),
                    ...(selectedStyle === "circular" && {
                      borderRadius: "50%",
                    }),
                    ...(selectedStyle === "shadow" && {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
                    className="max-w-full h-auto"
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
        </div>

        {/* Code Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Icon
                icon={formatOptions[selectedFormat].icon}
                className="w-5 h-5"
              />
              {formatOptions[selectedFormat].label} Code
            </h4>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  copiedCode === currentCode
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-paan-blue hover:bg-paan-blue/80 text-white"
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
                {copiedCode === currentCode ? "Copied!" : "Copy Code"}
              </button>
              <button
                onClick={downloadFile}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:download" className="w-4 h-4" />
                Download {formatOptions[selectedFormat].label}
              </button>
            </div>
          </div>

          <div
            className={`relative rounded-lg ${
              mode === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <pre
              className={`p-4 text-sm overflow-x-auto ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start">
            <Icon
              icon="mdi:information"
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5"
            />
            <div>
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                How to Use
              </h5>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>
                  • Choose your preferred code format (HTML, Markdown, React,
                  Vue, BBCode, or Direct URL)
                </li>
                <li>
                  • Copy the generated code and paste it into your website,
                  documentation, or profile
                </li>
                <li>
                  • The badge automatically displays your current membership
                  tier
                </li>
                <li>• Customize size and style to match your design needs</li>
                <li>
                  • All formats are responsive and work across different devices
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
