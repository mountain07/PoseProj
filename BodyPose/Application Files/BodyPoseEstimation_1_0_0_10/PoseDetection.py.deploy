import cv2
import mediapipe
import sys
import math

class PoseDetection:

    def __init__(self):
        self.mp_drawing = mediapipe.solutions.drawing_utils
        self.mp_pose = mediapipe.solutions.pose
        self.mp_holistic = mediapipe.solutions.holistic

        self.joint_names = ['nose'
            , 'left_eye_inner'
            , 'left_eye'
            , 'left_eye_outer'
            , 'right_eye_inner'
            , 'right_eye'
            , 'right_eye_outer'
            , 'left_ear'
            , 'right_ear'
            , 'mouth_left'
            , 'mouth_right'
            , 'left_shoulder'
            , 'right_shoulder'
            , 'left_elbow'
            , 'right_elbow'
            , 'left_wrist'
            , 'right_wrist'
            , 'left_pinky'
            , 'right_pinky'
            , 'left_index'
            , 'right_index'
            , 'left_thumb'
            , 'right_thumb'
            , 'left_hip'
            , 'right_hip'
            , 'left_knee'
            , 'right_knee'
            , 'left_ankle'
            , 'right_ankle'
            , 'left_heel'
            , 'right_heel'
            , 'left_foot_index'
            , 'right_foot_index']

    def dist(self, x1, y1, x2, y2):
        ans = ((x2 - x1) ** 2) + ((y2 - y1) ** 2)
        return math.sqrt(ans)


    def avg_dist(self, x1, y1, x2, y2):
        x = (x1 + x2) / 2
        y = (y1 + y2) / 2
        return x, y

    def coordinate_image(self, input_path, output_path, height, csv_path):
        with self.mp_pose.Pose(
                static_image_mode=True,
                model_complexity=2,
                min_detection_confidence=0.5) as pose:
            image = cv2.imread(input_path)  # Insert your Image Here
            image_height, image_width, _ = image.shape
            # Convert the BGR image to RGB before processing.
            results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            n = 0

            # important information to save
            r = 0
            nose_x, nose_y = 0, 0
            r_shoulder_x, r_shoulder_y = 0, 0
            l_shoulder_x, l_shoulder_y = 0, 0
            r_hip_x, r_hip_y = 0, 0
            l_hip_x, l_hip_y = 0, 0
            r_knee_x, r_knee_y = 0, 0
            r_foot_x, r_foot_y = 0, 0
            l_knee_x, l_knee_y = 0, 0
            l_foot_x, l_foot_y = 0, 0

            if results.pose_landmarks:
                for index, landmarks in enumerate(results.pose_landmarks.landmark):
                    # If the joint is in frame, save the important points
                    if (landmarks.x < 1) & (landmarks.y < 1):
                        if self.joint_names[index] == 'nose':
                            nose_x = landmarks.x * image_width
                            nose_y = landmarks.y * image_height
                        if self.joint_names[index] == 'right_shoulder':
                            r_shoulder_x = landmarks.x * image_width
                            r_shoulder_y = landmarks.y * image_height
                        if self.joint_names[index] == 'left_shoulder':
                            l_shoulder_x = landmarks.x * image_width
                            l_shoulder_y = landmarks.y * image_height
                        if self.joint_names[index] == 'right_hip':
                            r_hip_x = landmarks.x * image_width
                            r_hip_y = landmarks.y * image_height
                        if self.joint_names[index] == 'left_hip':
                            l_hip_x = landmarks.x * image_width
                            l_hip_y = landmarks.y * image_height
                        if self.joint_names[index] == 'right_knee':
                            r_knee_x = landmarks.x * image_width
                            r_knee_y = landmarks.y * image_height
                        if self.joint_names[index] == 'left_knee':
                            l_knee_x = landmarks.x * image_width
                            l_knee_y = landmarks.y * image_height
                        if self.joint_names[index] == 'right_foot_index':
                            r_foot_x = landmarks.x * image_width
                            r_foot_y = landmarks.y * image_height
                        if self.joint_names[index] == 'left_foot_index':
                            l_foot_x = landmarks.x * image_width
                            l_foot_y = landmarks.y * image_height

                # midpoint between both shoulders
                chest_x, chest_y = self.avg_dist(r_shoulder_x, r_shoulder_y, l_shoulder_x, l_shoulder_y)

                # midpoint between both hips
                pelvis_x, pelvis_y = self.avg_dist(r_hip_x, r_hip_y, l_hip_x, l_hip_y)

                # Find the total height of the person in pixels
                total_dist = 0
                total_dist += self.dist(nose_x, nose_y, chest_x, chest_y)  # distance between nose and chest
                total_dist += self.dist(chest_x, chest_y, pelvis_x, pelvis_y)  # distance between chest and pelvis
                total_dist += self.dist(pelvis_x, pelvis_y, r_knee_x, r_knee_y)  # distance between pelvis and right knee
                total_dist += self.dist(r_knee_x, r_knee_y, r_foot_x, r_foot_y)  # distance between right knee and rightfoot

                # save the conversion between pixels and inches
                r = (height) / (total_dist/.92)

            picture = str(input_path.rsplit('/', 1)[-1])
            picture = picture[:-4]

            # Put all calibrated points into one string
            # TODO: add name of image. Maybe pass the name as an input?
            image_info = picture + "," + str(height) + "," + str(nose_x * r) + "," + str(
                        nose_y * r) + "," + str(r_shoulder_x * r) + "," + str(r_shoulder_y * r) + "," + str(
                                     l_shoulder_x * r) + "," + str(l_shoulder_y * r) + "," + str(r_hip_x * r) + "," + str(
                                     r_hip_y * r) + "," + str(l_hip_x * r) + "," + str(l_hip_y * r) + "," + str(
                                     r_knee_x * r) + "," + str(r_knee_y * r) + "," + str(l_knee_x * r) + "," + str(
                                     l_knee_y * r) + "," + str(r_foot_x * r) + "," + str(r_foot_y * r) + "," + str(l_foot_x * r) + "," + str(l_foot_y * r) + "\n"
        
            # TODO: ATTACH TO CSV FILE CONTAINING ALL IMAGE INFO. Might want to do this in the main (I wrote something there)
            with open(csv_path, 'a') as fd2:
                fd2.write(image_info)
            n += 1
            print(image_info)


if __name__ == "__main__":
    pd = PoseDetection()
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    # Open the .txt file with each of the paths
    with open(input_path, 'r') as file:
        inputs = []
        heights = []
        # For each line in the .txt file, append the path to 'inputs'
        for line in file:
            data = line.split(",");
            print(data)
            inputs.append(data[0])
            heights.append(float(data[1].rstrip()))

    path = output_path + "\\output.csv"
    header = "imageName,height,nose_x,nose_y,r_shoulder_x,r_shoulder_y,l_shoulder_x,l_shoulder_y,r_hip_x,r_hip_y,l_hip_x,l_hip_y,r_knee_x,r_knee_y,l_knee_x,l_knee_y,r_foot_x,r_foot_y,l_foot_x,l_foot_y\n"
    with open(path, 'w') as fd:
                fd.write(header)
                fd.close()

    # For each input,
    # TODO: Not accepting height yet. CSV file should probably be made before this step. That way, each call of coordinate_image will be able to add to the .csv
    for input, height in zip(inputs,heights):
        pd.coordinate_image(input, output_path, height, path)