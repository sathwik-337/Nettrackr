import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-12 max-w-5xl mx-auto bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="mb-6">
        At <strong>NetTrackr</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect
        the information gathered when you or your users interact with our URL shortening and analytics service.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
      <p className="mb-6">
        When a shortened link created via NetTrackr is clicked, we collect certain data automatically, including:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Device type and operating system</li>
        <li>Browser name and version</li>
        <li>Geolocation information (approximate IP-based location)</li>
        <li>Network details such as ISP and connection type</li>
        <li>Timestamp of the visit</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">How We Use This Data</h2>
      <p className="mb-6">
        The data collected helps provide analytics and insights into your audience and link performance.
        We do not sell or share this information with third parties except as required by law.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Your Responsibilities</h2>
      <p className="mb-6">
        If you share shortened links that collect personal data, you are responsible for informing your users and complying
        with relevant data protection regulations (such as GDPR or CCPA).
      </p>

      <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
      <p className="mb-6">
        We implement industry-standard security measures to protect collected data but cannot guarantee complete security.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy periodically. We encourage you to review it regularly.
      </p>

      <p>
        For any questions about privacy or data, please contact us directly.
      </p>
    </div>
  );
}
