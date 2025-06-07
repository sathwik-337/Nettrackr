import React from "react";
import { BarChart3, MousePointerClick, Globe, Smartphone } from "lucide-react";

const analyticsData = [
  {
    title: "Total Clicks",
    value: 1324,
    icon: <MousePointerClick className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Top Browser",
    value: "Chrome",
    icon: <Globe className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Top Device",
    value: "Mobile",
    icon: <Smartphone className="text-purple-500 w-6 h-6" />,
  },
  {
    title: "Top Location",
    value: "India",
    icon: <BarChart3 className="text-red-500 w-6 h-6" />,
  },
];

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {analyticsData.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {item.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
