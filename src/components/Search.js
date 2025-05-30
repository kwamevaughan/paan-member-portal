import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { Icon } from "@iconify/react";

const Search = ({ mode, onSearchModalToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsPopupOpen(query.length > 0);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (onSearchModalToggle) {
      onSearchModalToggle(isPopupOpen);
    }

    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen, onSearchModalToggle]);

  return (
    <div className="relative z-10">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className={`pl-14 pr-4 py-2 text-sm w-full focus:outline-none rounded-lg ${
          mode === "dark"
            ? "bg-transparent text-white placeholder-white"
            : "bg-transparent text-black placeholder-black"
        } placeholder:font-bold transition-colors duration-200`}
      />
      <Icon
        icon="material-symbols:search-rounded"
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 ${
          mode === "dark" ? "text-gray-400" : "text-indigo-800"
        }`}
      />

      {isPopupOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* Background overlay with backdrop-blur */}
            <div
              className={`fixed inset-0 z-[9998] transition-all duration-300 h-screen ${
                mode === "dark" ? "bg-gray-900/70" : "bg-gray-900/50"
              }`}
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              onClick={closePopup}
            />

            {/* Modal content */}
            <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-20 pointer-events-none">
              <div
                className={`rounded-2xl shadow-2xl border transition-all duration-300 backdrop-blur-sm pointer-events-auto max-w-lg w-full mx-4 ${
                  mode === "dark"
                    ? "bg-gray-800/80 text-white border-gray-600/50 shadow-black/50"
                    : "bg-white/95 text-[#231812] border-gray-300/50 shadow-gray-500/20"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="material-symbols:search-rounded"
                        className={`h-6 w-6 ${
                          mode === "dark" ? "text-gray-300" : "text-indigo-800"
                        }`}
                      />
                      <span className="text-sm font-medium">{searchQuery}</span>
                    </div>
                    <button
                      onClick={closePopup}
                      className={`p-1 rounded-full transition-colors ${
                        mode === "dark"
                          ? "hover:bg-gray-700/50 text-gray-400 hover:text-white"
                          : "hover:bg-gray-200/50 text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon icon="material-symbols:close" className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`text-sm ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <p className="font-medium">Results: 0</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-base">Pages</p>
                      <p
                        className={`text-sm ${
                          mode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No results found for "{searchQuery}"
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div
                        className={`text-xs ${
                          mode === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Start typing to search across pages, documents, and
                        content...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body // Render directly to body
        )}
    </div>
  );
};

export default Search;
