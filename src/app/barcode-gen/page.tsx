"use client";
import React, { useRef, useState } from "react";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const BarcodeGen = () => {
  const [isbn, setIsbn] = useState<string>("");
  const [error, setError] = useState<string>("");
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) {
      setError("Please, just input the 13 ISBN digits without hyphen!");
    } else {
      setError("");
    }
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 13);
    setIsbn(newValue);
  };

  const formatIsbn = (isbn: string): string => {
    if (isbn.length === 13) {
      return `ISBN: ${isbn.slice(0, 3)}-${isbn.slice(3, 6)}-${isbn.slice(
        6,
        11,
      )}-${isbn.slice(11, 12)}-${isbn.slice(12)}`;
    }
    return "ISBN: " + isbn;
  };

  const downloadImage = () => {
    document.querySelector(".isbnNumbers")?.classList.remove("mt-4") // Temporary fix for PDF download;
    document.querySelector(".isbnNumbers")?.classList.add("-mt-4") // Temporary fix for PDF download;

    const scale = 3;
    const extraHeight = 20;

    if (barcodeRef.current)
      html2canvas(barcodeRef.current, {
        scale: scale,
        height: barcodeRef.current.offsetHeight + extraHeight,
        windowHeight: barcodeRef.current.offsetHeight + extraHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "px", [
          canvas.width / scale,
          canvas.height / scale,
        ]);
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          canvas.width / scale,
          canvas.height / scale,
        );
        pdf.save("barcode.pdf");
      });
    
      // Reformat UI
      document.querySelector(".isbnNumbers")?.classList.remove("-mt-4") // Temporary fix for PDF download;
      document.querySelector(".isbnNumbers")?.classList.add("mt-4")
  };

  return (
    <div className="barcodeGeneralContainer" id="barcode-generator">
      <h1 className="barcodeTitle">Barcode Generator</h1>

      <main className="barcodeMain">
        <input
          value={isbn}
          onChange={handleInputChange}
          placeholder="Enter ISBN-13 code"
          maxLength={13}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`barcodeInput text-center h5 ${error ? "" : ""}`}
        />
        {error && <div className="error-message text-red-600">{error}</div>}
        {isbn && isbn.length === 13 && (
          <div className="barcodeContainer" ref={barcodeRef}>
            <div className="isbnText">
              <span>{formatIsbn(isbn)}</span>
            </div>
            <div className="barcodeWrapper">
              <Barcode
                value={isbn}
                displayValue={false}
                height={100}
                width={1.8}
                margin={0}
              />
              <div className="isbnNumbers mt-4">
                <span style={{ marginLeft: -20 }}>{isbn[0]}</span>
                <span style={{ marginLeft: "10%" }}>{isbn.slice(1, 7)}</span>
                <span style={{ marginLeft: "15%" }}>{isbn.slice(7)}</span>
              </div>
              <div className="barcodeLines">
                {[0, 2, 49, 51, 98, 100].map((left, index) => (
                  <div
                    key={index}
                    style={{
                      left: `${left}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="buttonContainer">
          <button
            onClick={downloadImage}
            className="btn-primary rounded-md py-2 px-4 flex items-center justify-center"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default BarcodeGen;
