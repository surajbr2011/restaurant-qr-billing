import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const [tableCount, setTableCount] = useState(5);
  const [showQRCodes, setShowQRCodes] = useState(false);

  const baseUrl = window.location.origin.replace('admin-frontend', 'customer-frontend');

  const handleGenerate = (e) => {
    e.preventDefault();
    setShowQRCodes(true);
  };

  const handleDownload = (tableId) => {
    const canvas = document.getElementById(`qr-canvas-${tableId}`);
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `table-${tableId}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">QR Code Generator for Tables</h2>
      <form onSubmit={handleGenerate} className="mb-6 flex gap-4 items-center">
        <label htmlFor="tableCount" className="font-medium">Number of Tables:</label>
        <input
          id="tableCount"
          type="number"
          min="1"
          value={tableCount}
          onChange={e => setTableCount(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generate</button>
      </form>
      {showQRCodes && (
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: tableCount }, (_, i) => i + 1).map(tableId => {
            const url = `${baseUrl}/index.html?table=${tableId}`;
            return (
              <div key={tableId} className="flex flex-col items-center border p-4 rounded">
                <QRCode id={`qr-canvas-${tableId}`} value={url} size={160} includeMargin={true} />
                <div className="mt-2 font-semibold">Table {tableId}</div>
                <button
                  className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => handleDownload(tableId)}
                >
                  Download QR
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
