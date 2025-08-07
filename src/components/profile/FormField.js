import { Icon } from "@iconify/react";

export default function FormField({
  label,
  value,
  onChange,
  isEditing,
  type = "text",
  placeholder,
  icon,
  borderColor = "blue-500",
  mode,
  isReadOnly = false,
  readOnlyMessage,
  isLink = false,
  linkText,
}) {
  const getBorderColorClass = () => {
    const colors = {
      "blue-500": "border-paan-blue",
      "green-500": "border-paan-yellow",
      "purple-500": "border-paan-red",
      "orange-500": "border-paan-yellow",
      "blue-600": "border-paan-blue",
      "gray-400": "border-gray-400",
    };
    return colors[borderColor] || "border-paan-blue";
  };

  if (isReadOnly) {
    return (
      <div className="space-y-3">
        <label
          className={`block text-sm font-semibold ${
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
        <div
          className={`p-4 rounded-xl ${
            mode === "dark" ? "bg-gray-700/30" : "bg-gray-100"
          } border-l-4 border-gray-400`}
        >
          <p
            className={`font-medium ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {value || "Not provided"}
          </p>
          {readOnlyMessage && (
            <p
              className={`text-xs mt-1 ${
                mode === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {readOnlyMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        className={`block text-sm font-semibold ${
          mode === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      {isEditing ? (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-paan-yellow/20 ${
              mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:border-paan-yellow"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-paan-yellow focus:bg-white"
            }`}
            placeholder={placeholder}
          />
          {icon && (
            <Icon
              icon={icon}
              className="absolute right-3 top-3 w-5 h-5 text-gray-400"
            />
          )}
        </div>
      ) : (
        <div
          className={`p-4 rounded-xl ${
            mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"
          } border-l-4 ${getBorderColorClass()}`}
        >
          {isLink && value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors flex items-center space-x-2 ${
                borderColor === "blue-600"
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-blue-500 hover:text-blue-600"
              }`}
            >
              {icon && <Icon icon={icon} className="w-5 h-5" />}
              <span>{linkText || value}</span>
              <Icon icon="mdi:external-link" className="w-4 h-4" />
            </a>
          ) : (
            <p
              className={`font-medium ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {value || "Not provided"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
