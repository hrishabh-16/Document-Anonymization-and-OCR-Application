from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import re
import requests
import numpy as np
import base64
from io import BytesIO
import traceback
import logging
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

EDEN_AI_API_KEY = os.getenv('EDEN_AI_API_KEY')
if not EDEN_AI_API_KEY:
    logger.error("Eden AI API Key not found in environment variables")
    raise ValueError("Eden AI API Key must be set in .env file")

headers = {"Authorization": f"Bearer {EDEN_AI_API_KEY}"}
url = "https://api.edenai.run/v2/image/anonymization"

patterns_to_blur = {
    "passport_number": r"[A-Z]\d{7}",  
    "date_format": r"\b[\dO]{2}/[\dO]{2}/[\dO]{4}\b",  
    "place_format": r"[A-Z][a-z]+,\s?[A-Z][a-z]+",  
    "pan_number": r"[A-Z]{5}\d{4}[A-Z]",  
    "aadhaar_number": r"\b(\d{4}\s?)\b",
}

def blur_region(image, x, y, w, h):
    """Apply Gaussian blur to a specific region of the image."""
    try:
        image[y : y + h, x : x + w] = cv2.GaussianBlur(
            image[y : y + h, x : x + w], (51, 51), 30
        )
    except Exception as e:
        logger.error(f"Error in blur_region: {e}")
        raise

@app.route("/process-image", methods=["POST", "OPTIONS"])
def process_image():
    try:

        if request.method == "OPTIONS":
            return jsonify({"message": "Preflight request successful"}), 200

        if "file" not in request.files:
            logger.error("No file part in the request")
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        file.seek(0)
        image_data = file.read()

        if len(image_data) == 0:
            logger.error("Empty file received")
            return jsonify({"error": "Empty file"}), 400

        logger.debug(f"File received: {file.filename}, Size: {len(image_data)} bytes")

        np_arr = np.frombuffer(image_data, np.uint8)
        passport_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if passport_img is None:
            logger.error("Failed to decode image")
            return jsonify({"error": "Failed to decode image"}), 400

        files = {"file": (file.filename, BytesIO(image_data), file.content_type)}
        data = {
            "providers": "api4ai",
        }

        try:
            response = requests.post(url, data=data, files=files, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Eden AI API request failed: {e}")
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

        try:
            result = response.json()
            anonymized_image_base64 = result["api4ai"]["image"]
            anonymized_image_bytes = base64.b64decode(anonymized_image_base64)
            anonymized_image_array = np.frombuffer(
                anonymized_image_bytes, dtype=np.uint8
            )
            passport_img = cv2.imdecode(anonymized_image_array, cv2.IMREAD_COLOR)
        except (KeyError, base64.binascii.Error, cv2.error) as e:
            logger.error(f"Error processing anonymized image: {e}")
            return jsonify({"error": "Failed to process anonymized image"}), 500

        try:
            custom_config = r"--oem 3 --psm 6"
            data = pytesseract.image_to_data(
                passport_img, config=custom_config, output_type=pytesseract.Output.DICT
            )
        except pytesseract.TesseractError as e:
            logger.error(f"Tesseract OCR error: {e}")
            return jsonify({"error": "OCR processing failed"}), 500

        for i, text in enumerate(data["text"]):
            text = text.strip()
            x, y, w, h = (
                data["left"][i],
                data["top"][i],
                data["width"][i],
                data["height"][i],
            )

            for pattern_name, pattern in patterns_to_blur.items():
                if re.search(pattern, text):
                    blur_region(passport_img, x, y, w, h)

        try:
            height, width = passport_img.shape[:2]
            bottom_section_coords = (
                max(0, width // 10),
                max(0, height * 7 // 8),
                max(0, width * 9 // 10),
                height,
            )
            x1, y1, x2, y2 = bottom_section_coords

            if x1 < x2 and y1 < y2:
                passport_img[y1:y2, x1:x2] = cv2.GaussianBlur(
                    passport_img[y1:y2, x1:x2], (51, 51), 30
                )
        except Exception as e:
            logger.error(f"Bottom section blur error: {e}")

        _, img_encoded = cv2.imencode(".png", passport_img)
        img_bytes = img_encoded.tobytes()

        return send_file(
            BytesIO(img_bytes),
            mimetype="image/png",
            as_attachment=True,
            download_name="blurred_document.png",
        )

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)