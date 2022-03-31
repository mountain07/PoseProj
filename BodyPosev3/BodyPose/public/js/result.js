const bg = document.getElementById("bg");
const innerdiv = document.getElementById("innerdiv");
const ind = document.getElementById("ind");
const data = JSON.parse(localStorage.getItem("data"))
const photo = JSON.parse(localStorage.getItem("photodata"))
const bigimg = document.getElementById("bigimg");
const downloadc = document.getElementById("downloadc");
const downloadd = document.getElementById("downloadd");
const downloadt = document.getElementById("downloadt");

let zoom = 1

bigimg.setAttribute("width",0)
bigimg.setAttribute("height",0)

let li = document.createElement('li');;
for(let i = 0;i<photo.length;i++){
    result = '<img id="'+photo[i].id+'" style="filter: blur(1px);-webkit-filter: blur(1px);-ms-filter: blur(1px);-moz-filter: blur(1px);height:150px;width:150px;" src="'+photo[i].base64+'" alt="'+photo[i].name+'"/>';
    li = document.createElement('li');
    li.innerHTML = result;
    bg.appendChild(li)
    li.onclick = function(){

        ind.setAttribute("style","z-index:2;position:absolute;top:0;left0;height:100%;width:100%")
        const close = document.createElement('button')
        close.setAttribute("style","margin-top:5px;margin-left:1%; height:5%;width:50%;")
        context=bigimg.getContext('2d');
        close.innerText="click it to close photo"
        innerdiv.appendChild(close)
        var img=new Image();
        img.onload=function() {
            getBase64("data:image/jpeg;base64,"+data[i].file).then(val=>{
                bigimg.setAttribute("width",val.width)
                bigimg.setAttribute("height",val.height)
                context.drawImage(img,0,0);
                context.fillStyle="#FF0000";
            })
        }
    
        img.src="data:image/jpeg;base64,"+data[i].file;
        close.onclick=function(){
            bigimg.setAttribute("width",0)
            bigimg.setAttribute("height",0)
            ind.setAttribute("style","")
            close.remove()
        }
        bigimg.onmousemove = function (e) {
            close.innerText="click it to close photo"+"(current position: X:"+parseInt(getLocation(e.clientX, e.clientY).x)+",Y:"+parseInt(getLocation(e.clientX, e.clientY).y)+")"
        }
    }
}


function getLocation(x, y) {
    var bbox = bigimg.getBoundingClientRect();
    return {
        x: (x - bbox.left) * (bigimg.width / bbox.width),
        y: (y - bbox.top) * (bigimg.height / bbox.height)
    };
}

function getBase64 (img) {
    const image = new Image()
    image.crossOrigin = ''
    image.src = img
    return new Promise((resolve, reject) => {
      image.onload = function () {
        const { width, height } = image
        resolve({ width, height })
      }
    })
}

console.log(data)
let datacsv = []

datacsv.push("imageName,nose_x,nose_y,left_eye_inner_x,left_eye_inner_y,left_eye_x,left_eye_y,left_eye_outer_x,left_eye_outer_y,right_eye_inner_x,right_eye_inner_y,right_eye_x,right_eye_y,right_eye_outer_x,right_eye_outer_y,left_ear_x,left_ear_y,right_ear_x,right_ear_y,mouth_left_x,mouth_left_y,mouth_right_x,mouth_right_y,left_shoulder_x,left_shoulder_y,right_shoulder_x,right_shoulder_y,left_elbow_x,left_elbow_y,right_elbow_x,right_elbow_y,left_wrist_x,left_wrist_y,right_wrist_x,right_wrist_y,left_pinky_x,left_pinky_y,right_pinky_x,right_pinky_y,left_index_x,left_index_y,right_index_x,right_index_y,left_thumb_x,left_thumb_y,right_thumb_x,right_thumb_y,left_hip_x,left_hip_y,right_hip_x,right_hip_y,left_knee_x,left_knee_y,right_knee_x,right_knee_y,left_ankle_x,left_ankle_y,right_ankle_x,right_ankle_y,left_heel_x,left_heel_y,right_heel_x,right_heel_y,left_foot_index_x,left_foot_index_y,right_foot_index_x,right_foot_index_y,top_head_x,top_head_y\n")
for(let i=0;i<data.length;i++){
    datacsv.push(data[i].imageName+","+
    data[i].nose_x+","+data[i].nose_y+","+
    data[i].left_eye_inner_x+","+data[i].left_eye_inner_y+","+
    data[i].left_eye_x+","+data[i].left_eye_y+","+
    data[i].left_eye_outer_x+","+data[i].left_eye_outer_y+","+
    data[i].right_eye_inner_x+","+data[i].right_eye_inner_y+","+
    data[i].right_eye_x+","+data[i].right_eye_y+","+
    data[i].right_eye_outer_x+","+data[i].right_eye_outer_y+","+
    data[i].left_ear_x+","+data[i].left_ear_y+","+
    data[i].right_ear_x+","+data[i].right_ear_y+","+
    data[i].mouth_left_x+","+data[i].mouth_left_y+","+
    data[i].mouth_right_x+","+data[i].mouth_right_y+","+
    data[i].left_shoulder_x+","+data[i].left_shoulder_y+","+
    data[i].right_shoulder_x+","+data[i].right_shoulder_y+","+
    data[i].left_elbow_x+","+data[i].left_elbow_y+","+
    data[i].right_elbow_x+","+data[i].right_elbow_y+","+
    data[i].left_wrist_x+","+data[i].left_wrist_y+","+
    data[i].right_wrist_x+","+data[i].right_wrist_y+","+
    data[i].left_pinky_x+","+data[i].left_pinky_y+","+
    data[i].right_pinky_x+","+data[i].right_pinky_y+","+
    data[i].left_index_x+","+data[i].left_index_y+","+
    data[i].right_index_x+","+data[i].right_index_y+","+
    data[i].left_thumb_x+","+data[i].left_thumb_y+","+
    data[i].right_thumb_x+","+data[i].right_thumb_y+","+
    data[i].left_hip_x+","+data[i].left_hip_y+","+
    data[i].right_hip_x+","+data[i].right_hip_y+","+
    data[i].left_knee_x+","+data[i].left_knee_y+","+
    data[i].right_knee_x+","+data[i].right_knee_y+","+
    data[i].left_ankle_x+","+data[i].left_ankle_y+","+
    data[i].right_ankle_x+","+data[i].right_ankle_y+","+
    data[i].left_heel_x+","+data[i].left_heel_y+","+
    data[i].right_heel_x+","+data[i].right_heel_y+","+
    data[i].left_foot_index_x+","+data[i].left_foot_index_y+","+
    data[i].right_foot_index_x+","+data[i].right_foot_index_y+","+
    data[i].top_head_x+","+data[i].top_head_y+","+
    "\n")
}
let blobc = new Blob(datacsv, {type:"text/csv,charset=UTF-8"})
let csvUrl = URL.createObjectURL(blobc)

let blobd = new Blob(datacsv, {type:"text/data,charset=UTF-8"})
let dataUrl = URL.createObjectURL(blobd)

let blobt = new Blob(datacsv, {type:"text/txt,charset=UTF-8"})
let txtUrl = URL.createObjectURL(blobt)

downloadc.download = "output.csv"
downloadc.href = csvUrl

downloadd.download = "output.data"
downloadd.href = csvUrl

downloadt.download = "output.txt"
downloadt.href = txtUrl


