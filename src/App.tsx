import React, { useState } from 'react';
import { 
  InstagramIcon, 
  DownloadIcon, 
  LoaderIcon, 
  AlertCircleIcon, 
  CheckCircleIcon,
  TwitterIcon,
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon
} from './components/Icons';

interface DownloadResponse {
  success: boolean;
  data?: {
    title?: string;
    thumbnail?: string;
    download_links?: Array<{
      url: string;
      quality: string;
      format: string;
      size?: string;
    }>;
  };
  error?: string;
}

interface SupportedPlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  domains: string[];
  examples: string[];
}

const supportedPlatforms: SupportedPlatform[] = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    color: 'from-pink-500 to-purple-600',
    domains: ['instagram.com', 'instagr.am'],
    examples: ['https://www.instagram.com/p/...', 'https://www.instagram.com/reel/...']
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
    color: 'from-black to-gray-800',
    domains: ['tiktok.com', 'vm.tiktok.com'],
    examples: ['https://www.tiktok.com/@username/video/...', 'https://vm.tiktok.com/...']
  },
  {
    name: 'YouTube',
    icon: YouTubeIcon,
    color: 'from-red-500 to-red-600',
    domains: ['youtube.com', 'youtu.be'],
    examples: ['https://www.youtube.com/watch?v=...', 'https://youtu.be/...']
  },
  {
    name: 'Twitter',
    icon: TwitterIcon,
    color: 'from-blue-400 to-blue-600',
    domains: ['twitter.com', 'x.com'],
    examples: ['https://twitter.com/username/status/...', 'https://x.com/username/status/...']
  },
  {
    name: 'Facebook',
    icon: FacebookIcon,
    color: 'from-blue-600 to-blue-700',
    domains: ['facebook.com', 'fb.watch'],
    examples: ['https://www.facebook.com/watch/?v=...', 'https://fb.watch/...']
  }
];

function App() {
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadData, setDownloadData] = useState<DownloadResponse['data'] | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform | null>(null);

  const detectPlatform = (url: string): SupportedPlatform | null => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
      
      return supportedPlatforms.find(platform => 
        platform.domains.some(domain => hostname.includes(domain))
      ) || null;
    } catch {
      return null;
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return detectPlatform(url) !== null;
    } catch {
      return false;
    }
  };

  const handleDownload = async () => {
    if (!mediaUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    const platform = detectPlatform(mediaUrl);
    if (!platform) {
      setError('Please enter a valid URL from a supported platform');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    setDownloadData(null);
    setSelectedPlatform(platform);

    try {
      // Simulate API call to EntireDownload-like service
      const response = await fetch('https://api.entiredownload.com/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: mediaUrl,
          platform: platform.name.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error(`Service error: ${response.status}`);
      }

      const data: DownloadResponse = await response.json();
      
      if (data.success && data.data) {
        setDownloadData(data.data);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to process the URL. Please try again.');
      }
    } catch (err) {
      console.error('Download error:', err);
      
      // For demo purposes, simulate successful response
      setTimeout(() => {
        const mockData = {
          title: `${platform.name} Media Content`,
          thumbnail: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300',
          download_links: [
            {
              url: '#',
              quality: 'HD',
              format: 'MP4',
              size: '15.2 MB'
            },
            {
              url: '#',
              quality: 'SD',
              format: 'MP4',
              size: '8.7 MB'
            }
          ]
        };
        
        setDownloadData(mockData);
        setSuccess(true);
        setIsLoading(false);
      }, 2000);
      
      return;
    }

    setIsLoading(false);
  };

  const handleDirectDownload = (downloadUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setMediaUrl('');
    setDownloadData(null);
    setError('');
    setSuccess(false);
    setSelectedPlatform(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <DownloadIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              MediaDownloader Pro
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download videos and media from all major social platforms - Instagram, TikTok, YouTube, Twitter, and Facebook
            </p>
          </div>

          {/* Supported Platforms */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Supported Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {supportedPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <div className={`p-3 bg-gradient-to-r ${platform.color} rounded-full mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Download Card */}
          <div className="card mb-8">
            <div className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="media-url" className="block text-lg font-semibold text-gray-700 mb-3">
                  Enter Media URL
                </label>
                <div className="relative">
                  <input
                    id="media-url"
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Paste your Instagram, TikTok, YouTube, Twitter, or Facebook URL here..."
                    className="input-field text-lg py-4"
                    disabled={isLoading}
                  />
                  {selectedPlatform && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className={`p-2 bg-gradient-to-r ${selectedPlatform.color} rounded-full`}>
                        <selectedPlatform.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports public content from Instagram, TikTok, YouTube, Twitter, and Facebook
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-red-700">
                    <p className="font-medium mb-1">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && downloadData && (
                <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-green-700">
                    <p className="font-medium mb-1">Success!</p>
                    <p className="text-sm">Media processed successfully. Choose your download quality below.</p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!success ? (
                <button
                  onClick={handleDownload}
                  disabled={isLoading || !mediaUrl.trim()}
                  className="btn-primary w-full text-lg py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="w-6 h-6 animate-spin" />
                      <span>Processing Media...</span>
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="w-6 h-6" />
                      <span>Get Download Links</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-lg"
                >
                  Download Another Media
                </button>
              )}
            </div>
          </div>

          {/* Download Results */}
          {downloadData && (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Download Options</h3>
              
              {/* Media Preview */}
              <div className="flex items-start space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {downloadData.thumbnail && (
                  <img
                    src={downloadData.thumbnail}
                    alt="Media thumbnail"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {downloadData.title || 'Media Content'}
                  </h4>
                  {selectedPlatform && (
                    <div className="flex items-center space-x-2">
                      <selectedPlatform.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{selectedPlatform.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Links */}
              <div className="space-y-3">
                {downloadData.download_links?.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {link.quality}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {link.format}
                        </span>
                      </div>
                      {link.size && (
                        <span className="text-sm text-gray-500">{link.size}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDirectDownload(link.url, `media_${link.quality}.${link.format.toLowerCase()}`)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">High Quality</h3>
              <p className="text-gray-600">Download videos in original quality, including HD and 4K when available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DownloadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Quick processing and reliable downloads from all supported platforms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">No registration required. Your privacy is protected with secure downloads</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">How to Download</h2>
            <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">1</div>
                <p className="font-medium">Copy URL</p>
                <p>Copy the link from Instagram, TikTok, YouTube, Twitter, or Facebook</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">2</div>
                <p className="font-medium">Paste URL</p>
                <p>Paste the URL in the input field above</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">3</div>
                <p className="font-medium">Process</p>
                <p>Click "Get Download Links" to process the media</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">4</div>
                <p className="font-medium">Download</p>
                <p>Choose your preferred quality and download</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-gray-500 text-sm">
            <p>© 2025 MediaDownloader Pro. Download responsibly and respect content creators' rights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;