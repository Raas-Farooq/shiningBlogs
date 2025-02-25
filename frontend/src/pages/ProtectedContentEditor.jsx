import {useEffect, useRef, useState } from 'react';

// interface ProtectedConentProps{
  
// }

const ProtectedContentEditor = ({ value, onChange, onCursorPosition }) => {
  const [segments, setSegments] = useState([]);
  const textareaRef = useRef(null);

  // Split content into editable and protected segments
  useEffect(() => {
    const pattern = /(\[image-\d+\])/g;
    const parts = value.split(pattern);
    const newSegments = parts.map((part) => ({
      text: part,
      isProtected: part.match(/\[image-\d+\]/) !== null
    }));
    console.log("new Segements: ", newSegments);
    setSegments(newSegments);
  }, [value]);

  // Handle text selection and cursor position
  const handleSelect = () => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      onCursorPosition(cursorPos);
    }
  };

  // Custom change handler to preserve protected segments
  const handleChange = (e) => {
    const newValue = e.target.value;
    const pattern = /\[image-\d+\]/g;
    const existingImages = value.match(pattern) || [];
    const newImages = newValue.match(pattern) || [];

    // Check if all image placeholders are preserved
    if (existingImages.every(img => newImages.includes(img))) {
      onChange(newValue);
    } else {
      // If any image placeholder was modified, prevent the change
      e.target.value = value;
    }
  };

  return (
    <div className="relative">
      {/* Main textarea for editing */}
      <textarea
        ref={textareaRef}
        className="border-gray-500 border w-4/5 h-[350px] mt-4 font-mono"
        // value={value}
        onChange={handleChange}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        required
      />
      
      {/* Visual overlay to show protected segments */}
      <div className="absolute top-0 left-0 w-4/5 h-[350px] mt-4 pointer-events-none">
        {segments.map((segment, index) => (
          <span
            key={index}
            className={segment.isProtected ? "bg-blue-100 px-1" : ""}
          >
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
};

// export default ProtectedContentEditor;