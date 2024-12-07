# Document Anonymizer 🕵️‍♀️🔒

## Problem Statement

In an era of increasing digital document sharing, protecting personal and sensitive information has become crucial. Individuals often need to share documents like passports, PAN cards, and Aadhaar cards for various purposes, but revealing full personal details can lead to privacy risks and potential identity theft.

The Document Anonymizer addresses this critical challenge by providing a user-friendly, secure solution to automatically blur and mask sensitive information in documents before sharing.

## Key Features 🌟

### 1. Intelligent Document Anonymization

- Automatically detects and blurs sensitive personal information
- Supports multiple document types:
  - Passport
  - PAN Card
  - Aadhaar Card

### 2. Advanced Anonymization Techniques

- Uses multiple layered anonymization approaches:
  - Machine Learning-based anonymization
  - Regex-based pattern matching
- Detects and masks:
  - Personal identification numbers
  - Dates of birth
  - Place of birth/residence
  - Images

### 3. User-Friendly Interface

- Drag and drop file upload
- Preview of original and anonymized documents
- One-click document download
- Support for pre-loaded sample documents

### 4. Cross-Platform Compatibility

- Web-based application
- Responsive design
- Works on desktop and mobile browsers

## How It Works 🔍

### Anonymization Process

1. **Initial Upload**

   - User uploads a document or selects a pre-loaded sample
   - Image is immediately sent to backend for processing

2. **Machine Learning Anonymization**

   - Human faces in the document are blurred using maching learning model

3. **Advanced OCR Processing**

   - Pytesseract performs Optical Character Recognition
   - Identifies text patterns using predefined regex rules
   - Detects sensitive information like:
     - Passport numbers
     - Date formats
     - Location names
     - PAN card numbers
     - Aadhaar number segments

4. **Intelligent Blurring**

   - Applies Gaussian blur to detected sensitive regions
   - Blurs bottom section of document for additional privacy
   - Ensures readability while protecting personal details

5. **Image Rendering**
   - Processed image returned to frontend
   - Side-by-side comparison of original and anonymized documents
   - Option to download anonymized document
  
## Demo and Visuals 🖼️📹

### Screenshot Gallery 📸

#### User Interface
![Screenshot 2024-12-07 164621](https://github.com/user-attachments/assets/92c807e4-67fa-4be5-98f2-9520c918387c)
![Screenshot 2024-12-07 165146](https://github.com/user-attachments/assets/b5182a26-5882-4448-a17d-9834cd4625bf)
*Intuitive drag-and-drop document upload interface*

#### Anonymization Process
![Screenshot 2024-12-07 164607](https://github.com/user-attachments/assets/2e2e8f13-b9ad-48da-82a6-141464bb1ea3)
![Screenshot 2024-12-07 164729](https://github.com/user-attachments/assets/2ab59c85-b0d6-4721-818b-9754bb37d115)
*Side-by-side comparison of original and anonymized document*

### Demo Video 🎥

#### Full Workflow Demonstration

https://github.com/user-attachments/assets/2c94e414-cf68-4f50-88f7-8d4892c9e7f7

*Click the image above to watch the full demo video*

## Tech Stack 💻

### Backend

- **Language**: Python
- **Web Framework**: Flask
- **Image Processing**:
  - OpenCV (cv2)
  - Pytesseract
- **Additional Libraries**:
  - NumPy
  - Requests
  - Logging

### Frontend

- **Language**: TypeScript
- **Framework**: React
- **State Management**: React Hooks
- **Styling**:
  - Tailwind CSS
  - Framer Motion (animations)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Prerequisites 🛠️

### Backend

- Python 3.8+
- Tesseract OCR installed
- pip packages:
  - flask
  - flask-cors
  - opencv-python
  - pytesseract
  - requests
  - numpy

### Frontend

- Node.js 20+
- npm/yarn
- React 17+

## Installation & Setup 🚀

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set Tesseract OCR path in script
# Modify pytesseract.pytesseract.tesseract_cmd in index.py

# Run the server
python index.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

## Security Considerations 🔐

- No personal documents are stored server-side
- Temporary file processing
- CORS configured for controlled access
