import cv2
import easyocr
import matplotlib.pyplot as plt
import numpy as np

# Read the image
image_path = '/home/phillip/Desktop/todays_tutorial/30_text_detection_easyocr/code/data/test2.png'
img = cv2.imread(image_path)

# Instantiate text detector
reader = easyocr.Reader(['en'], gpu=False)

# Detect text on the image
text_ = reader.readtext(img)

threshold = 0.25

# Draw bounding box and text
for t_ in text_:
    bbox, text, score = t_

    # Print only the recognized text
    print(text)

    if score > threshold:
        cv2.rectangle(img, bbox[0], bbox[2], (0, 255, 0), 5)
        cv2.putText(img, text, bbox[0], cv2.FONT_HERSHEY_COMPLEX, 0.65, (255, 0, 0), 2)

# Display the image with text and bounding boxes
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
plt.show()
