import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { div } from 'framer-motion/client';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Helper function to normalize URLs
function normalizeUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

// Helper to export CSV
function exportToCSV(links) {
  const headers = ['ID', 'Original URL', 'Short URL', 'Date', 'Status'];
  const rows = links.map(link => [
    link.id,
    link.original,
    link.short,
    link.date,
    link.status,
  ]);

  let csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows].map(e => e.map(a => `"${a}"`).join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'shortened_links.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Profile = () => {
  const [urlInput, setUrlInput] = useState('');
  const [shortLinks, setShortLinks] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);

  // New states for search & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view') || 'dashboard';

  // Fetch or initialize user credit and user links on login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            credits: 1,
            createdAt: new Date().toISOString(),
            displayName: currentUser.displayName || 'User',
            email: currentUser.email || '',
          });
          setCredits(1);
          toast.success('Welcome! You’ve received 1 free credit.');
        } else {
          setCredits(userSnap.data().credits || 0);
        }

        // Fetch all user links from backend
        try {
          const resLinks = await fetch(`http://localhost:5000/api/links?user_id=${currentUser.uid}`);
          if (resLinks.ok) {
            const dataLinks = await resLinks.json();
            setShortLinks(dataLinks.links || []);
          }
        } catch (e) {
          toast.error('Failed to fetch links: ' + e.message);
        }

        // Fetch real analytics data from backend
        try {
          const resAnalytics = await fetch(`http://localhost:5000/api/analytics?user_id=${currentUser.uid}`);
          if (resAnalytics.ok) {
            const dataAnalytics = await resAnalytics.json();
            setAnalyticsData(dataAnalytics);
          } else {
            // fallback hardcoded data if backend fails
            setAnalyticsData({
              visitorsByDate: {
                labels: ['May 18', 'May 19', 'May 20', 'May 21', 'May 22'],
                data: [10, 20, 15, 25, 30],
              },
              visitorsByLocation: [
                { lat: 37.7749, lng: -122.4194, count: 20, city: 'San Francisco' },
                { lat: 51.5074, lng: -0.1278, count: 15, city: 'London' },
                { lat: 35.6895, lng: 139.6917, count: 10, city: 'Tokyo' },
              ],
              deviceInfo: {
                devices: { Mobile: 60, Desktop: 35, Tablet: 5 },
                browsers: { Chrome: 50, Firefox: 20, Safari: 20, Edge: 10 },
                networks: { WiFi: 70, Cellular: 30 },
              },
            });
          }
        } catch (e) {
          toast.error('Failed to fetch analytics: ' + e.message);
        }
      } else {
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSubmit = async () => {
    if (credits <= 0) {
      toast.error('No credits left. Please buy more credits.');
      return;
    }

    const normalizedUrl = normalizeUrl(urlInput);

    const id = nanoid(6);
    const newLink = {
      id,
      original: normalizedUrl,
      short: `http://localhost:5000/${id}`, // Backend URL here
      date: new Date().toLocaleString(),
      status: 'Active',
    };

    try {
      // Call backend API to create and store the link in Firestore
      const response = await fetch('http://localhost:5000/api/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link_id: id,
          original_url: normalizedUrl,
          user_id: user.uid,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error('Error creating link: ' + (err.error || 'Unknown error'));
        return;
      }

      setShortLinks((prev) => [newLink, ...prev]); // add new link to front
      setGeneratedLink(newLink.short);
      setUrlInput('');

      // Deduct one credit
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits: increment(-1),
      });
      setCredits((prev) => prev - 1);

      toast.success('Link shortened successfully!');
    } catch (error) {
      toast.error('Network error: ' + error.message);
    }
  };

  // Pagination logic
  const filteredLinks = shortLinks.filter(link =>
    link.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.short.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart data
  const lineChartData = {
    labels: analyticsData?.visitorsByDate?.labels || [],
    datasets: [
      {
        label: 'Visitors',
        data: analyticsData?.visitorsByDate?.data || [],
        fill: false,
        borderColor: 'rgb(37, 99, 235)',
        tension: 0.3,
      },
    ],
  };

  return (
    <DashboardLayout>
      <ToastContainer />
      {view === 'dashboard' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Welcome, {user?.displayName || 'User'} 👋</h2>
            <div className="text-sm text-gray-600">
              Credits: <span className="font-semibold">{credits}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Paste your URL here..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 w-full"
            />
            <button
              onClick={handleSubmit}
              className="bg-black text-white rounded-full px-6 py-2 hover:bg-gray-800 transition"
            >
              Shorten
            </button>
          </div>

          {generatedLink && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="border border-gray-300 rounded-full px-4 py-2 w-full"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700 transition"
              >
                Copy
              </button>
            </div>
          )}

          <button
            onClick={() => setShowTable(!showTable)}
            className="mt-6 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            {showTable ? 'Hide Links' : 'Show Links'}
          </button>

          {showTable && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset page on search
                  }}
                  className="border border-gray-300 rounded px-3 py-1 w-64"
                />
                <button
                  onClick={() => exportToCSV(filteredLinks)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Export CSV
                </button>
              </div>

              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Original URL</th>
                    <th className="border border-gray-300 px-4 py-2">Short URL</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLinks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No links found.
                      </td>
                    </tr>
                  )}
                  {paginatedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{link.id}</td>
                      <td className="border border-gray-300 px-4 py-2 break-all">{link.original}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href={link.short} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {link.short}
                        </a>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{link.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{link.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="flex justify-center space-x-2 mt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                  }`}
                >
                  Prev
                </button>

                {[...Array(totalPages).keys()].map((num) => {
                  const pageNum = num + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded border ${
                        pageNum === currentPage ? 'bg-black text-white' : 'hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'analytics' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="hover:scale-105 transition border rounded-xl p-4 shadow flex flex-col items-start">
              <span className="text-2xl">📄</span>
              <p className="font-semibold">Documents</p>
              <p className="text-sm text-gray-500">Track your link records</p>
            </div>
            <div className="hover:scale-105 transition border rounded-xl p-4 shadow flex flex-col items-start">
              <span className="text-2xl">🔢</span>
              <p className="font-semibold">Analytics</p>
              <p className="text-sm text-gray-500">See stats for your links</p>
            </div>
            <div className="hover:scale-105 transition border rounded-xl p-4 shadow flex flex-col items-start">
              <span className="text-2xl">🌐</span>
              <p className="font-semibold">Network</p>
              <p className="text-sm text-gray-500">Monitor visits worldwide</p>
            </div>
            <div className="hover:scale-105 transition border rounded-xl p-4 shadow flex flex-col items-start">
              <span className="text-2xl">📅</span>
              <p className="font-semibold">History</p>
              <p className="text-sm text-gray-500">Link creation timeline</p>
            </div>
            <div
              className="hover:scale-105 transition border rounded-xl p-4 shadow cursor-pointer hover:bg-gray-50"
              onClick={() => setShowTable(!showTable)}
            >
              <span className="text-2xl">🔔</span>
              <p className="font-semibold">Show all</p>
              <p className="text-sm text-black">See all your generated links</p>
            </div>
          </div>

          {showTable && (
            <div className="overflow-x-auto border rounded-lg shadow mt-6">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm uppercase">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Original URL</th>
                    <th className="px-4 py-2">Short URL</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shortLinks.map((link) => (
                    <tr key={link.id} className="border-t">
                      <td className="px-4 py-2 font-mono">{link.id}</td>
                      <td className="px-4 py-2 truncate max-w-xs">{link.original}</td>
                      <td className="px-4 py-2 font-mono text-blue-600 underline">
                        <a href={link.short} target="_blank" rel="noopener noreferrer">
                          {link.short}
                        </a>
                      </td>
                      <td className="px-4 py-2">{link.date}</td>
                      <td className="px-4 py-2">{link.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

          {/* Map */}
          <div className="h-96 rounded-md overflow-hidden border border-gray-300">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {analyticsData?.visitorsByLocation?.map(({ lat, lng, count, city }, i) => (
                <Marker key={i} position={[lat, lng]}>
                  <Popup>
                    {city} - {count} visitors
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Line chart */}
          <div className="bg-white p-4 rounded-md shadow border border-gray-300">
            <Line data={lineChartData} />
          </div>

          {/* Device / Browser / Network Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Devices */}
            {/* <div className="bg-white rounded-md p-4 border border-gray-300 shadow">
              <h3 className="font-semibold mb-2">Device Types</h3>
              {analyticsData?.deviceInfo?.devices
                ? Object.entries(analyticsData.deviceInfo.devices).map(([device, value]) => (
                    <div key={device} className="flex justify-between border-b py-1">
                      <span>{device}</span>
                      <span>{value}%</span>
                    </div> */}
                  {/* ))
                : 'No device info available.'}
            </div> */}

            {/* Browsers */}
            {/* <div className="bg-white rounded-md p-4 border border-gray-300 shadow">
              <h3 className="font-semibold mb-2">Browsers</h3>
              {analyticsData?.deviceInfo?.browsers
                ? Object.entries(analyticsData.deviceInfo.browsers).map(([browser, value]) => (
                    <div key={browser} className="flex justify-between border-b py-1">
                      <span>{browser}</span>
                      <span>{value}%</span>
                    </div>
                  ))
                : 'No browser info available.'}
            </div> */}

            {/* Networks
            <div className="bg-white rounded-md p-4 border border-gray-300 shadow">
              <h3 className="font-semibold mb-2">Network Types</h3>
              {analyticsData?.deviceInfo?.networks
                ? Object.entries(analyticsData.deviceInfo.networks).map(([network, value]) => (
                    <div key={network} className="flex justify-between border-b py-1">
                      <span>{network}</span>
                      <span>{value}%</span>
                    </div>
                  ))
                : 'No network info available.'} */}
            </div>
          </div>
        
      )}
     
        
      
     
    </DashboardLayout>
  );
};

export default Profile;
