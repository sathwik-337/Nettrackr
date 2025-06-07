import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-12 max-w-5xl mx-auto bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-6">
        Welcome to <strong>NetTrackr</strong>. By accessing or using our website and services, you agree to comply with these Terms of Service.
        Please read them carefully before using our platform.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
      <p className="mb-6">
        NetTrackr allows you to create shortened URLs that track user visits and provide detailed analytics including device, location, browser,
        and network information. You agree to use this service only for lawful purposes and not to violate any applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mb-4">User Data and Privacy</h2>
      <p className="mb-6">
        You acknowledge and agree that the data collected from link clicks is governed by our Privacy Policy. You are responsible for
        obtaining any necessary consents from end-users when sharing shortened links that collect personal data.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
      <p className="mb-6">
        You may not use NetTrackr to create links that distribute malware, phishing scams, or content that infringes on others’ rights.
        We reserve the right to suspend or terminate accounts violating these rules.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Modification of Terms</h2>
      <p className="mb-6">
        We may update these Terms of Service at any time by posting a revised version on our website. Your continued use of NetTrackr
        after changes constitute acceptance of the updated terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
      <p>
        NetTrackr is provided "as is" without warranties. We are not liable for any damages arising from use of our services.
      </p>
    </div>
  );
}
