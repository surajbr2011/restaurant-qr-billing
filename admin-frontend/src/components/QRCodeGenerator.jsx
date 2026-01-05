import { useState, useEffect } from 'react';
import { qrCodeAPI } from '../services/api';

const QRCodeGenerator = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTableId, setNewTableId] = useState('');

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await qrCodeAPI.getAll();
      setQrCodes(response.data);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newTableId) return;

    try {
      setLoading(true);
      await qrCodeAPI.generate({
        tableId: newTableId,
        zone: 'Main Hall'
      });
      setNewTableId('');
      await fetchQRCodes();
    } catch (error) {
      alert('Failed to generate QR: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (tableId) => {
    if (!confirm(`Regenerate QR for Table ${tableId}? The old code will stop working.`)) return;

    try {
      setLoading(true);
      await qrCodeAPI.regenerate(tableId);
      await fetchQRCodes();
    } catch (error) {
      alert('Failed to regenerate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tableId) => {
    if (!confirm(`Delete QR for Table ${tableId}?`)) return;

    try {
      setLoading(true);
      await qrCodeAPI.delete(tableId);
      await fetchQRCodes();
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (qrCodeUrl, tableId) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `Table-${tableId}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Generate New QR Code</h2>
        <form onSubmit={handleGenerate} className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Table ID (e.g. T-01)"
            value={newTableId}
            onChange={(e) => setNewTableId(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Generate New'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => (
          <div key={qr._id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Table: {qr.tableId}</h3>
            <div className="bg-gray-100 p-2 rounded mb-4">
              <img src={qr.qrCodeUrl} alt={`QR for ${qr.tableId}`} className="w-48 h-48 object-contain" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center w-full">
              <button
                onClick={() => handleDownload(qr.qrCodeUrl, qr.tableId)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Download
              </button>
              <button
                onClick={() => handleRegenerate(qr.tableId)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Regenerate
              </button>
              <button
                onClick={() => handleDelete(qr.tableId)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Scans: {qr.usageCount || 0}
            </div>
          </div>
        ))}
        {qrCodes.length === 0 && !loading && (
          <p className="text-gray-500 col-span-3 text-center">No QR codes found. Generate one!</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
