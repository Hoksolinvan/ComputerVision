from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image, ImageEnhance
import pytesseract
import cv2
import numpy as np
from io import BytesIO
from starlette.responses import JSONResponse

app = FastAPI()

# Add a root endpoint to avoid 404 on base URL
@app.get("/")
async def root():
    return {"message": "Welcome to the OCR API! Use /ocr to process an image."}

@app.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")

    image_data = await image.read()
    pil_image = Image.open(BytesIO(image_data))

    img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    thresh = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    thresh = cv2.medianBlur(thresh, 3)

    pil_img = Image.fromarray(thresh)
    enhancer = ImageEnhance.Contrast(pil_img)
    pil_img = enhancer.enhance(2)

    custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
    text = pytesseract.image_to_string(pil_img, config=custom_config)

    return JSONResponse(content={"extracted_text": text})
