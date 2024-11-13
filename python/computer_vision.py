from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image, ImageEnhance
import pytesseract
import cv2
import numpy as np
from io import BytesIO
from starlette.responses import JSONResponse

app = FastAPI()

@app.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    # Check if an image is uploaded
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")

    # Read the image file into PIL
    image_data = await image.read()
    pil_image = Image.open(BytesIO(image_data))

    # Convert image to OpenCV format
    img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

    # Step 1: Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Step 2: Apply thresholding to improve text contrast
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Step 3: Resize image to improve OCR accuracy
    thresh = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    # Step 4: Apply a median blur to remove small noises
    thresh = cv2.medianBlur(thresh, 3)

    # Optional: Use PIL to further enhance the image
    pil_img = Image.fromarray(thresh)
    enhancer = ImageEnhance.Contrast(pil_img)
    pil_img = enhancer.enhance(2)  # Increase contrast

    # Step 5: Run Tesseract OCR with custom configuration
    custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
    text = pytesseract.image_to_string(pil_img, config=custom_config)

    # Return the OCR text as JSON
    return JSONResponse(content={"extracted_text": text})
