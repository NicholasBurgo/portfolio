import { useEffect } from "react";

interface ImageViewerProps {
  imageSrc: string | null;
  imageList: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageViewer({
  imageSrc,
  imageList,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ImageViewerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      } else if (e.key === "ArrowLeft" && isOpen && currentIndex > 0) {
        onPrev();
      } else if (
        e.key === "ArrowRight" &&
        isOpen &&
        currentIndex < imageList.length - 1
      ) {
        onNext();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, currentIndex, imageList.length, onClose, onNext, onPrev]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      id="image-viewer"
      className={`image-viewer ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <button
        id="image-viewer-close"
        className="absolute top-6 right-6 text-white text-3xl z-10 bg-red-600 rounded-full p-3 hover:bg-red-700 transition-all duration-300 hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image viewer"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      {imageList.length > 1 && currentIndex > 0 && (
        <button
          id="viewer-prev"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10 bg-black/60 rounded-full p-3 hover:bg-blue-500/80 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous image"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      )}
      <img id="viewer-image" src={imageSrc} alt="Full size image" />
      {imageList.length > 1 && currentIndex < imageList.length - 1 && (
        <button
          id="viewer-next"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10 bg-black/60 rounded-full p-3 hover:bg-blue-500/80 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next image"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
}


