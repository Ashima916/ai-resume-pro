import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
});

export const generateResume = (data) =>
  API.post("/generate-resume", data);

export const generateCoverLetter = (data) =>
  API.post("/generate-cover-letter", data);

// Use arraybuffer (not blob) for reliable binary downloads
export const downloadPDF = (content) =>
  API.post(
    "/export/pdf",
    { content },
    {
      responseType: "arraybuffer",
      headers: { "Content-Type": "application/json" },
    }
  );

export const downloadDOCX = (content) =>
  API.post(
    "/export/docx",
    { content },
    {
      responseType: "arraybuffer",
      headers: { "Content-Type": "application/json" },
    }
  );
