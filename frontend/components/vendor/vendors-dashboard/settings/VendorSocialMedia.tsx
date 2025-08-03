import React from "react";

const mockSocials = [
  { name: "Facebook", connected: false, url: "https://facebook.com" },
  { name: "Twitter", connected: true, url: "https://twitter.com/vendor" },
  { name: "Instagram", connected: false, url: "https://instagram.com" },
  // Add more as needed
];

const VendorSocialMedia: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full mt-0 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-black">Social Media Accounts</h2>
      <div className="space-y-4">
        {mockSocials.map((social) => (
          <div
            key={social.name}
            className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0"
          >
            <div>
              <span className="font-semibold text-black">{social.name}</span>
              {social.connected && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-black text-white rounded">Connected</span>
              )}
            </div>
            {social.connected ? (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline text-sm font-medium hover:text-gray-700 transition"
              >
                View
              </a>
            ) : (
              <button
                className="px-4 py-1.5 bg-black text-white rounded hover:bg-gray-800 transition text-sm font-semibold shadow"
                // onClick={() => handleConnect(social.name)}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorSocialMedia;
