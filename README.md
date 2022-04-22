# User Guide

1. Install node.js
2. In command prompt, use 'pip install pybase64' to install base64
   use 'pip install opencv-python' to install cv
   use 'pip install mediapipe' to install mediapipe
3. Change the current directory to the application (an example would be                                     cd C:\ab\cd\BodyPose) and input the following command:
    npm i
    node app.js
    If it starts normally, 'server start at localhost: 3000' should be displayed
4. In your browser, go to 'localhost:3000' 
5. Click on the original blurred image to show the mapped image with all the nodes highlighted
6. Use ctrl with mouse wheel to zoom in on the mapped image
7. Hover your mouse over any of the nodes to inspect the coordinates
8. To save the mapped image, go ahead and right click on it and click 'Save image as'; To download the result as .csv, .data, or .txt files, click on the 'click it to close photo' button at the bottom and click 'download all...'
