import React from 'react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen p-12 max-w-5xl mx-auto bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>

      <p className="mb-6">
        The information provided by <strong>NetTrackr</strong> on this website is for general informational purposes only.
        While we strive to keep the data accurate and up to date, we make no warranties or representations about the
        completeness, reliability, or accuracy of the information.
      </p>

      <p className="mb-6">
        Our service provides detailed analytics and user data when you or your users click on shortened links created via our platform.
        This data is intended to help you understand visitor behavior and demographics but should not be relied upon as legally binding or
        absolutely precise.
      </p>

      <p className="mb-6">
        By using NetTrackr, you acknowledge that the tracking information is provided "as is" without warranties of any kind,
        and your use of this data is at your own risk.
      </p>

      <p>
        We disclaim any liability for damages resulting from the use or misuse of data obtained through our services.
        Always comply with applicable laws and privacy regulations when handling user data.
      </p>
    </div>
  );
}
