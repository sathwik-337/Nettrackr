import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShieldCheck, Globe, Link2, Radar } from 'lucide-react';
import { Disclosure, Tab } from '@headlessui/react';

const featuresData = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Security Monitoring",
    description: "Track malicious behavior and block unwanted users in real-time using powerful logging tools."
  },
  {
    icon: <Globe className="w-8 h-8 text-green-600" />,
    title: "Geolocation Logs",
    description: "Pinpoint the visitor's country, city, and even device type using IP-based analytics."
  },
  {
    icon: <Link2 className="w-8 h-8 text-purple-600" />,
    title: "Custom Smart Links",
    description: "Create redirect links with embedded tracking parameters for campaigns or engagement analysis."
  },
  {
    icon: <Radar className="w-8 h-8 text-red-500" />,
    title: "Real-time Alerts",
    description: "Get notified instantly when your links are accessed, using Firebase triggers and webhooks."
  }
];

const tabs = {
  "For Individuals": [
    "Understand who's viewing your shared links.",
    "Track clicks from job applications, portfolios, and more."
  ],
  "For Businesses": [
    "Track marketing campaign effectiveness.",
    "Monitor product launch performance in real-time."
  ],
};

export default function Features() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Video Demo Section */}
        <div className="mb-32" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6 text-center">Watch Our Demo</h2>
          <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <video
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center mb-10">Platform Features</h1>

        {/* Feature Cards with AOS */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
           {/* Tabs Section */}
        <div className="mb-20" data-aos="fade-left">
          <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
          <Tab.Group>
            <Tab.List className="flex space-x-2 bg-white rounded-lg p-2 shadow">
              {Object.keys(tabs).map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `flex-1 py-2 text-center rounded-lg ${
                      selected ? 'bg-black text-white' : 'text-gray-600'
                    }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4 bg-white rounded-lg shadow p-6">
              {Object.values(tabs).map((points, idx) => (
                <Tab.Panel key={idx}>
                  <ul className="list-disc pl-5 space-y-2 text-left">
                    {points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>




        {/* Accordion Section */}
        <div className="mb-20" data-aos="fade-right">
          <h2 className="text-2xl font-bold mb-6">FAQs</h2>
          <div className="space-y-4">
            {[
              ["Is this service free to use?", "Yes, we offer 1 free credit upon signup. Additional credits are available via our pricing plans."],
              ["Do I need to install anything?", "No, everything runs in the browser and server — no installation required."],
              ["What happens to my data?", "Your data is securely stored in Firebase and only accessible to you."]
            ].map(([question, answer], idx) => (
              <Disclosure key={idx}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="w-full text-left p-4 bg-white rounded-lg shadow font-medium">
                      {question}
                    </Disclosure.Button>
                    <Disclosure.Panel className="p-4 bg-gray-100 rounded-lg">
                      {answer}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>

       
        

        {/* Footer spacing */}
        <div className="h-32" />
      </div>
    </div>
  );
}
