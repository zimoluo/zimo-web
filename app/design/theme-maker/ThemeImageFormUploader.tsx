"use client";

import { useState } from "react";

export default function ThemeImageFormUploader() {
  const [file, setFile] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("index", "0");
    formData.append("suffix", "png");

    try {
      const response = await fetch("/api/themeMaker/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="w-full px-3 pt-2 h-40 text-base pb-8 rounded-xl shadow-sm border-0.4 border-primary border-opacity-20 bg-transparent bg-widget-70 resize-none placeholder:text-saturated placeholder:text-opacity-70 my-2">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  );
}
