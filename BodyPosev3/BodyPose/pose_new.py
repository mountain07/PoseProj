import sys

import cv2
import time
import numpy as np
import mediapipe as mp
import base64


# import tensorflow as tf

def base64_cv2(base64_str):
    imgString = base64.b64decode(base64_str)
    nparr = np.frombuffer(imgString, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return image


def image_to_base64(image_np):
    image = cv2.imencode('.jpg', image_np)[1]
    image_code = str(base64.b64encode(image))[2:-1]
    return image_code


if __name__ == "__main__":

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose
    mp_holistic = mp.solutions.holistic
    joint_names = ['nose', 'left_eye_inner', 'left_eye', 'left_eye_outer', 'right_eye_inner', 'right_eye',
                   'right_eye_outer'
        , 'left_ear', 'right_ear', 'mouth_left', 'mouth_right', 'left_shoulder', 'right_shoulder', 'left_elbow'
        , 'right_elbow', 'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky', 'left_index', 'right_index'
        , 'left_thumb', 'right_thumb', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle'
        , 'right_ankle', 'left_heel', 'right_heel', 'left_foot_index', 'right_foot_index']

    with open(input_path, 'r', encoding='UTF-8') as file:
        inputs = []
        heights = []
        names = []
        # For each line in the .txt file, append the path to 'inputs'
        for line in file:
            data = line.split("@");
            # print(data)
            inputs.append(data[0].split(",")[1])
            heights.append(float(data[2].rstrip()))
            names.append(data[1])

    path = output_path + "\\output.csv"
    header = "imageName,height," \
             "nose_x,nose_y," \
             "left_eye_inner_x,left_eye_inner_y," \
             "left_eye_x,left_eye_y," \
             "left_eye_outer_x,left_eye_outer_y," \
             "right_eye_inner_x,right_eye_inner_y," \
             "right_eye_x,right_eye_y," \
             "right_eye_outer_x,right_eye_outer_y," \
             "left_ear_x,left_ear_y," \
             "right_ear_x,right_ear_y," \
             "mouth_left_x,mouth_left_y," \
             "mouth_right_x,mouth_right_y," \
             "left_shoulder_x,left_shoulder_y," \
             "right_shoulder_x,right_shoulder_y," \
             "left_elbow_x,left_elbow_y," \
             "right_elbow_x,right_elbow_y," \
             "left_wrist_x,left_wrist_y," \
             "right_wrist_x,right_wrist_y," \
             "left_pinky_x,left_pinky_y," \
             "right_pinky_x,right_pinky_y," \
             "left_index_x,left_index_y," \
             "right_index_x,right_index_y," \
             "left_thumb_x,left_thumb_y," \
             "right_thumb_x,right_thumb_y," \
             "left_hip_x,left_hip_y," \
             "right_hip_x,right_hip_y," \
             "left_knee_x,left_knee_y," \
             "right_knee_x,right_knee_y," \
             "left_ankle_x,left_ankle_y," \
             "right_ankle_x,right_ankle_y," \
             "left_heel_x,left_heel_y," \
             "right_heel_x,right_heel_y," \
             "left_foot_index_x,left_foot_index_y," \
             "right_foot_index_x,right_foot_index_y," \
             "top_head_x,top_head_y," \
             "file\n"
    with open(path, 'w') as fd:
        fd.write(header)
        fd.close()
    # image = cv2.imread('123.jpg')
    for input, name, height in zip(inputs, names, heights):
        image = base64_cv2(input)
        image_height, image_width, _ = image.shape
        with mp_pose.Pose(
                static_image_mode=True,
                model_complexity=2,
                min_detection_confidence=0.5) as pose:
            results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            n = 0
            out = name + ',' + str(height) + ','
            if results.pose_landmarks:
                for index, landmarks in enumerate(results.pose_landmarks.landmark):
                    if (landmarks.x < 1) & (landmarks.y < 1):
                        n += 1
                        out += str(int(landmarks.x * image_width)) + ',' + str(int(landmarks.y * image_height)) + ','
                        # print(joint_names[index], (int(landmarks.x * image_width), int(landmarks.y * image_height)))
                # print('The total number of nodes is:' + str(n))

        annotated_image = image.copy()
        # print(mp_pose.POSE_CONNECTIONS)
        mp_drawing.draw_landmarks(annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        # cv2.imshow('body-part', annotated_image)
        cv2.imwrite('body_file.jpg', annotated_image)
        # cv2.waitKey(0)

        protoFile = "pose_deploy_linevec_faster_4_stages.prototxt"
        weightsFile = "pose.caffemodel"
        net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

        nPoints = 15
        # POSE_PAIRS = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [1, 14], [14, 8], [8, 9], [9, 10], [14, 11],
        #               [11, 12], [12, 13]]

        frame = cv2.imread("body_file.jpg")
        frameCopy = np.copy(frame)
        frameWidth = frame.shape[1]
        frameHeight = frame.shape[0]
        threshold = 0.1

        t = time.time()
        # input image dimensions for the network
        inWidth = 368
        inHeight = 368

        inpBlob = cv2.dnn.blobFromImage(frame, 1.0 / 255, (inWidth, inHeight), (0, 0, 0), swapRB=False, crop=False)
        net.setInput(inpBlob)
        output = net.forward()
        # print("time taken by network : {:.3f}".format(time.time() - t))

        H = output.shape[2]
        W = output.shape[3]
        points = []
        for i in range(nPoints):
            # confidence map of corresponding body's part.
            probMap = output[0, i, :, :]

            # Find global maxima of the probMap.
            minVal, prob, minLoc, point = cv2.minMaxLoc(probMap)
            x = (frameWidth * point[0]) / W
            y = (frameHeight * point[1]) / H
            if i == 0:
                # print('Top head (%d,%d)' % (int(x), int(y)))
                out += str(int(x)) + ',' + str(int(y)) + ','
                cv2.circle(annotated_image, (int(x), int(y)), 8, (0, 0, 255), thickness=-1, lineType=cv2.FILLED)
            # print('the  coordinate of %d is: (%d,%d)' % (i, int(x), int(frameHeight-y)))

            # if prob > threshold:
            #     cv2.circle(frameCopy, (int(x), int(y)), 8, (0, 255, 255), thickness=-1, lineType=cv2.FILLED)
            #     cv2.putText(frameCopy, "{}".format(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2,
            #                 lineType=cv2.LINE_AA)
            #     # Add the point to the list if the probability is greater than the threshold
            #     points.append((int(x), int(y)))
            # else:
            #     points.append(None)

        # cv2.imshow('Output-final', annotated_image)
        cv2.imwrite('final.jpg', annotated_image)
        out += image_to_base64(annotated_image)
        with open(path, 'a') as fd2:
            fd2.write(out + '\n')
            fd2.close()
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
