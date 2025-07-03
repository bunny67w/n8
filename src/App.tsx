import React, { useState } from 'react';
import { InstagramIcon, DownloadIcon, LoaderIcon, AlertCircleIcon, CheckCircleIcon } from './components/Icons';

interface DownloadResponse {
  download_link?: string;
  error?: string;
}

function App() {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidInstagramUrl = (url: string) => {
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
    return instagramRegex.test(url);
  };

  const handleDownload = async () => {
    if (!instagramUrl.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    if (!isValidInstagramUrl(instagramUrl)) {
      setError('Please enter a valid Instagram post, reel, or IGTV URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    setDownloadLink('');

    try {
      const webhookUrl = 'https://ciaszz.app.n8n.cloud/webhook-test/ig-download';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link: instagramUrl
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DownloadResponse = await response.json();
      
      if (data.download_link) {
        setDownloadLink(data.download_link);
        setSuccess(true);
      } else {
        setError('Failed to extract download link. Please try again.');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to process the Instagram URL. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectDownload = () => {
    if (downloadLink) {
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = 'instagram-media';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setInstagramUrl('');
    setDownloadLink('');
    setError('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-instagram-gradient rounded-full shadow-lg">
                <InstagramIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Instagram Downloader
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Download Instagram posts, reels, and IGTV videos quickly and easily
            </p>
          </div>

          {/* Main Card */}
          <div className="card">
            <div className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  id="instagram-url"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="input-field"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste the URL of an Instagram post, reel, or IGTV video
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && downloadLink && (
                <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm">Media ready for download!</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!success ? (
                  <button
                    onClick={handleDownload}
                    disabled={isLoading || !instagramUrl.trim()}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="w-5 h-5" />
                        <span>Get Download Link</span>
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDirectDownload}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <DownloadIcon className="w-5 h-5" />
                      <span>Download Media</span>
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Download Another
                    </button>
                  </>
                )}
              </div>

              {/* Download Link Display */}
              {downloadLink && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Direct Download Link:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={downloadLink}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded focus:outline-none"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(downloadLink)}
                      className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to use</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto">1</div>
                <p>Copy the Instagram post, reel, or IGTV URL</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto">2</div>
                <p>Paste the URL in the input field above</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-instagram-gradient rounded-full flex items-center justify-center text-white font-bold mx-auto">3</div>
                <p>Click "Get Download Link" and then download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;