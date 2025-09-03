from flask import Flask, request, jsonify
import recommend  # this imports your recommend.py file

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def get_recommendation():
    try:
        data = request.json
        movie = data.get("movie")

        if not movie:
            return jsonify({"error": "Movie name is required"}), 400

        # Assuming recommend.py has a function like get_recommendations(movie)
        results = recommend.get_recommendations(movie)

        return jsonify({"recommendations": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "Movie Recommendation ML API is running!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

