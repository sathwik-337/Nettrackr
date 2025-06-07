import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const plans = [
  { id: "basic", name: "Basic", price: 100, credits: 10 },
  { id: "pro", name: "Pro", price: 500, credits: 50 },
  { id: "enterprise", name: "Enterprise", price: 1000, credits: 100 },
];

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Pricing = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      setUser(currentUser);
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setCredits(docSnap.exists() ? docSnap.data().credits || 0 : 0);
      } catch (error) {
        toast.error("Failed to fetch credits.");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handlePayment = async (plan) => {
    if (!user) {
      toast.error("Please log in to purchase credits.");
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Failed to load Razorpay SDK. Are you online?");
      return;
    }

    setLoading(true);

    // Call your backend to create an order for Razorpay
    // You must implement /api/create-order endpoint in your backend to create Razorpay order and return orderId
    let orderData;
    try {
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price * 100 }), // amount in paise
      });
      orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Order creation failed");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to initiate payment: " + error.message);
      return;
    }

    const options = {
      key: "rzp_test_cXk0NkjIrFQRpC", // Replace with your Razorpay key id
      amount: orderData.amount,
      currency: orderData.currency,
      name: "NetTrackr",
      description: `${plan.name} Plan Purchase`,
      order_id: orderData.id,
      handler: async function (response) {
        // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
        // Verify payment on backend and add credits
        try {
          const verifyRes = await fetch("http://localhost:5000/api/add-credits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              planName: plan.name,
              credits: plan.credits,
              price: plan.price,
              paymentDetails: response,
            }),
          });
          const data = await verifyRes.json();
          if (verifyRes.ok && data.newCredits !== undefined) {
            setCredits(data.newCredits);
            toast.success(`Payment successful! Added ${plan.credits} credits.`);
          } else {
            toast.error(data.error || "Payment verification failed.");
          }
        } catch (err) {
          toast.error("Server error while verifying payment.");
        }
      },
      prefill: {
        email: user.email,
        name: user.displayName || "User",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <ToastContainer />
      <h1 className="text-5xl font-extrabold text-center mb-12 text-black">Choose Your Plan</h1>
      <p className="text-center text-lg mb-8">
        Your current credits:{" "}
        <span className="font-semibold text-black text-xl">{credits}</span>
      </p>
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">{plan.name}</h2>
              <p className="text-4xl font-extrabold text-black mb-5">₹{plan.price}</p>
              <p className="text-lg text-gray-600 mb-6">{plan.credits} Credits</p>
              <ul className="mb-6 text-gray-500 list-disc list-inside">
                <li>Instant credit top-up</li>
                <li>Priority support</li>
                <li>Access to all features</li>
              </ul>
            </div>
            <button
              onClick={() => handlePayment(plan)}
              disabled={loading}
              className="mt-auto bg-black hover:text-[#cccccc] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : `Buy ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
