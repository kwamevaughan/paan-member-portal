import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import TooltipIconButton from "@/components/TooltipIconButton";

const LanguageSwitch = ({ mode }) => {
  const dropdownRef = useRef(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { name: "English", flag: "flag:us-1x1", code: "en" },
    { name: "French", flag: "flag:fr-1x1", code: "fr" },
    { name: "Swahili", flag: "flag:ke-1x1", code: "sw" },
    { name: "Arabic", flag: "flag:sa-1x1", code: "ar" },
    { name: "Hausa", flag: "flag:ng-1x1", code: "ha" },
    { name: "Akan", flag: "flag:gh-1x1", code: "ak" },
  ];

  const toastMessages = {
    en: "Language set to English",
    fr: "Langue définie en Français",
    sw: "Lugha imewekwa kwa Kiswahili",
    ar: "تم تعيين اللغة إلى العربية",
    ha: "An saita harshe zuwa Hausa",
    ak: "Wɔasiesie kasa kɔ Akan",
  };

  const detectInitialLanguage = () => {
    if (typeof window === "undefined") return "English";

    const saved = window.localStorage.getItem("selectedLanguage");
    if (saved) return saved;

    const browserLang = window.navigator.language.toLowerCase();
    const match = languages.find((lang) => browserLang.startsWith(lang.code));
    const defaultLang = match ? match.name : "English";

    window.localStorage.setItem("selectedLanguage", defaultLang);
    return defaultLang;
  };

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedLanguage(detectInitialLanguage());
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple translation function using Google Translate API
  const translatePage = async (targetLang) => {
    if (typeof window === "undefined") return;

    setIsTranslating(true);
    
    try {
      // Use Google Translate widget if available
      if (window.google && window.google.translate) {
        const selectBox = document.querySelector(".goog-te-combo");
        if (selectBox) {
          selectBox.value = targetLang;
          selectBox.dispatchEvent(new Event("change"));
          return;
        }
      }

      // Fallback: Load Google Translate script dynamically
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement("script");
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            const translateElement = new window.google.translate.TranslateElement({
              pageLanguage: "en",
              includedLanguages: languages.map(lang => lang.code).join(","),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            }, document.createElement("div"));
            
            // Apply translation after initialization
            setTimeout(() => {
              const selectBox = document.querySelector(".goog-te-combo");
              if (selectBox) {
                selectBox.value = targetLang;
                selectBox.dispatchEvent(new Event("change"));
              }
            }, 1000);
          }
        };
        
        document.head.appendChild(script);
      } else {
        // Script already exists, just apply translation
        setTimeout(() => {
          const selectBox = document.querySelector(".goog-te-combo");
          if (selectBox) {
            selectBox.value = targetLang;
            selectBox.dispatchEvent(new Event("change"));
          }
        }, 500);
      }

      // Hide Google Translate banner
      const hideBanner = () => {
        const banner = document.querySelector(".goog-te-banner-frame");
        if (banner) {
          banner.style.display = "none";
          banner.style.visibility = "hidden";
        }
        
        const skipLink = document.querySelector(".goog-te-banner-frame-skiplink");
        if (skipLink) {
          skipLink.style.display = "none";
        }
      };

      // Hide banner periodically
      const bannerInterval = setInterval(hideBanner, 100);
      setTimeout(() => clearInterval(bannerInterval), 5000);

    } catch (error) {
      console.warn("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language.name);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("selectedLanguage", language.name);
    }
    setIsOpen(false);

    // Show toast immediately
    toast.success(toastMessages[language.code]);

    // Apply translation
    await translatePage(language.code);
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      <TooltipIconButton
        label={<span className="text-black">Change Language</span>}
        mode={mode}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/50"
        disabled={isTranslating}
      >
        <Icon
          icon={
            languages.find((lang) => lang.name === selectedLanguage)?.flag ||
            languages[0].flag
          }
          className={`h-6 w-6 rounded-full ${isTranslating ? "opacity-50" : ""}`}
        />
      </TooltipIconButton>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
            mode === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-[#231812]"
          }`}
        >
          {languages.map((language) => (
            <button
              key={language.name}
              onClick={() => handleLanguageSelect(language)}
              disabled={isTranslating}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedLanguage === language.name
                  ? "bg-opacity-5 bg-gray-500"
                  : ""
              }`}
            >
              <Icon icon={language.flag} className="h-6 w-6 mr-2 rounded-full" />
              {language.name}
              {isTranslating && selectedLanguage === language.name && (
                <Icon icon="mdi:loading" className="ml-auto animate-spin" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;