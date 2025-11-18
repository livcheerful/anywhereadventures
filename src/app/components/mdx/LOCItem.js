import { useState } from "react";
import { useNotifications } from "../../lib/NotificationsContext";
import Toast from "../Toast";
import { saveLCItem } from "../../lib/storageHelpers";

export default function LOCItem({
  image,
  linkOut,
  caption,
  licenseLink,
  licenseText,
  allowSave,
  type,
  alt,
}) {
  const { addNotification } = useNotifications();
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // save in localStorage + context
    addNotification("lcItem", linkOut, { id: linkOut });
    saveLCItem(
      linkOut,
      image,
      caption,
      type,
      window.location.pathname.substring(1)
    );

    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-1 pb-3 relative">
      <img src={image} id={`lcitem-${image}`} alt={alt} />
      <div className="absolute right-2 top-0 flex flex-row gap-2">
        {linkOut && (
          <a href={linkOut} target="_blank" rel="noopener noreferrer">
            <button className="h-full relative cursor-pointer font-mono bg-emerald-700 active:bg-emerald-800 p-2 -top-1 drop-shadow-2xl font-bold text-white underline decoration-white rounded-b-lg text-sm">
              source
            </button>
          </a>
        )}
        {allowSave && (
          <button
            className="font-bold cursor-pointer relative bg-emerald-700 active:bg-emerald-800 p-2 -top-1 drop-shadow-2xl text-white rounded-b-lg h-fit"
            onClick={handleSave}
          >
            save
          </button>
        )}
      </div>
      {caption && (
        <div className="italic font-serif text-sm p-2">
          {caption}{" "}
          {licenseText && licenseLink && (
            <a className="blue-500" href={licenseLink}>
              {licenseText}
            </a>
          )}
        </div>
      )}
      {showToast && <Toast message="Saved to travel log" />}
    </div>
  );
}
