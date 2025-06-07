from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import pytz
import os
import json
import razorpay
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Firebase Initialization
firebase_creds = os.environ.get("FIREBASE_CREDENTIALS")

if not firebase_admin._apps:
    try:
        if firebase_creds and firebase_creds.endswith('.json') and os.path.exists(firebase_creds):
            cred = credentials.Certificate(firebase_creds)
        elif firebase_creds and firebase_creds.strip().startswith('{'):
            cred_dict = json.loads(firebase_creds)
            cred = credentials.Certificate(cred_dict)
        else:
            raise RuntimeError("FIREBASE_CREDENTIALS is not set or invalid")

        firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Firebase: {str(e)}")

# Razorpay Initialization
razorpay_client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_SECRET")
))

@app.route("/api/create-link", methods=["POST", "OPTIONS"])
def create_link():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        original_url = data.get("original_url")
        user_id = data.get("user_id")
        link_id = data.get("link_id")

        if not original_url or not user_id or not link_id:
            return jsonify({"error": "Missing required fields"}), 400

        expiration_time = datetime.now(pytz.UTC) + timedelta(hours=24)

        db.collection("shortLinks").document(link_id).set({
            "original_url": original_url,
            "user_id": user_id,
            "created_at": firestore.SERVER_TIMESTAMP,
            "expires_at": expiration_time
        })

        return jsonify({"message": "Link created", "link_id": link_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/add-credits", methods=["POST", "OPTIONS"])
def add_credits():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        uid = data.get("uid")
        credits_to_add = data.get("credits")

        if not uid or credits_to_add is None:
            return jsonify({"error": "Invalid request"}), 400

        user_ref = db.collection("users").document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        current_credits = user_doc.get("credits") or 0
        new_credits = current_credits + credits_to_add
        user_ref.update({"credits": new_credits})

        return jsonify({"message": "Credits added", "newCredits": new_credits}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/create-order", methods=["POST", "OPTIONS"])
def create_order():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        amount = data.get("amount")

        if not amount:
            return jsonify({"error": "Amount is required"}), 400

        order = razorpay_client.order.create({
            "amount": int(amount),
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify(order), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/verify-payment", methods=["POST", "OPTIONS"])
def verify_payment():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        params_dict = {
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        }

        if not all(params_dict.values()):
            return jsonify({"error": "Missing Razorpay credentials"}), 400

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
            return jsonify({"verified": True}), 200
        except:
            return jsonify({"error": "Signature verification failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/<link_id>", methods=["GET", "OPTIONS"])
def redirect_link(link_id):
    if request.method == "OPTIONS":
        return '', 200

    try:
        doc_ref = db.collection("shortLinks").document(link_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Link not found or expired"}), 404

        data = doc.to_dict()
        original_url = data.get("original_url")
        user_id = data.get("user_id")
        expires_at = data.get("expires_at")

        if not original_url or not user_id:
            return jsonify({"error": "Invalid link data"}), 400

        if expires_at and datetime.now(pytz.UTC) > expires_at:
            doc_ref.delete()
            return jsonify({"error": "Link has expired"}), 410

        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        current_credits = user_doc.get("credits") or 0
        if current_credits <= 0:
            return jsonify({"error": "No credits left"}), 402

        info = request.args.to_dict()
        try:
            lat = float(info.get("lat", 0))
            lng = float(info.get("lng", 0))
        except ValueError:
            lat, lng = 0.0, 0.0

        location = {
            "city": info.get("city"),
            "lat": lat,
            "lng": lng
        }

        db.collection("click_logs").add({
            "link_id": link_id,
            "user_id": user_id,
            "timestamp": datetime.now(pytz.UTC),
            "location": location
        })

        user_ref.update({"credits": current_credits - 1})

        return redirect(original_url, code=302)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    try:
        logs_ref = db.collection('click_logs').where('user_id', '==', user_id)
        logs = logs_ref.stream()

        visitors_by_location = defaultdict(int)
        visitors_by_date = Counter()

        for log in logs:
            data = log.to_dict()
            location = data.get('location', {})
            city = location.get('city', 'Unknown')
            lat = location.get('lat')
            lng = location.get('lng')

            if lat and lng:
                key = (round(lat, 4), round(lng, 4), city)
                visitors_by_location[key] += 1

            timestamp = data.get('timestamp')
            if timestamp:
                dt = timestamp.astimezone(pytz.UTC)
                day = dt.strftime('%b %d')
                visitors_by_date[day] += 1

        locations_output = [
            {'lat': lat, 'lng': lng, 'city': city, 'count': count}
            for (lat, lng, city), count in visitors_by_location.items()
        ]

        sorted_dates = sorted(visitors_by_date.items(), key=lambda x: datetime.strptime(x[0], '%b %d'))
        labels = [label for label, _ in sorted_dates]
        data = [count for _, count in sorted_dates]

        return jsonify({
            'visitorsByLocation': locations_output,
            'visitorsByDate': {
                'labels': labels,
                'data': data
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

handler = app

if __name__ == "__main__":
    app.run(debug=True)
