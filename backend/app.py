from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import os

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Initialize Firebase Admin SDK
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Route to create a short link
@app.route("/api/create-link", methods=["POST", "OPTIONS"])
def create_link():
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        return '', 200

    try:
        data = request.get_json()
        original_url = data.get("original_url")
        user_id = data.get("user_id")
        link_id = data.get("link_id")  # or generate here if needed

        if not original_url or not user_id:
            return jsonify({"error": "Missing required fields"}), 400

        # Save link to Firestore
        link_ref = db.collection("shortLinks").document(link_id)
        link_ref.set({
            "original_url": original_url,
            "user_id": user_id,
            "created_at": firestore.SERVER_TIMESTAMP,
        })

        return jsonify({"message": "Link created", "link_id": link_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to add credits
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

# Route to handle redirect + expire link (one-time use)
@app.route("/<link_id>", methods=["GET", "OPTIONS"])
def redirect_link(link_id):
    if request.method == "OPTIONS":
        return '', 200

    try:
        doc_ref = db.collection("shortLinks").document(link_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Link not found or already used"}), 404

        data = doc.to_dict()
        original_url = data.get("original_url")
        user_id = data.get("user_id")

        if not original_url or not user_id:
            return jsonify({"error": "Invalid link data"}), 400

        # Get the user document
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        current_credits = user_doc.get("credits") or 0
        if current_credits <= 0:
            return jsonify({"error": "No credits left"}), 402

        # Deduct 1 credit and delete the link BEFORE redirect
        user_ref.update({"credits": current_credits - 1})
        doc_ref.delete()

        # Redirect with HTTP 302
        return redirect(original_url, code=302)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
