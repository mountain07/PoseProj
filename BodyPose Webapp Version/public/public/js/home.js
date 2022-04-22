const pic = document.getElementById("pic");
const re = document.getElementById('re');
const pbutton = document.getElementById('pbutton');
const cbutton = document.getElementById('cbutton');
const home = document.getElementById('home');
const about = document.getElementById('about');
const aboutbg = document.getElementById('aboutbg');
const right = document.getElementById('right');

let dataArr = [];
let t_id = 0

if(typeof FileReader==='undefined'){
    alert("sorry, can't support FileReader");
    pic.setAttribute('disabled','disabled');
}else{
    pic.addEventListener('change',readFile,false);
}

function readFile(){
    fd = new FormData();
    let iLen = this.files.length;
    for(var i=0;i<iLen;i++){
        if (!pic['value'].match(/.jpg|.png/i)){
            return alert("file format error");
        }
        var reader = new FileReader();
        fd.append(i,this.files[i]);
        reader.readAsDataURL(this.files[i]); 
        reader.fileName = this.files[i].name;

        reader.onload = function(e){
            t_id++;
            let imgMsg = {
                name : this.fileName,
                base64 : this.result,
                id: t_id,
                hg: 160
            }
            dataArr.push(imgMsg);
            result = '<img id="'+t_id+'" style="filter: blur(1px);-webkit-filter: blur(1px);-ms-filter: blur(1px);-moz-filter: blur(1px);'
                +'height:100px;width:100px;" src="'+this.result+'" alt="'+this.fileName+'"/>';
            const li = document.createElement('li');
            li.innerHTML = result;
            re.appendChild(li)
            li.onclick = function(){
                let height = prompt("submit height(cm)(default:160):","160");
                for(let i=0;i<dataArr.length;i++){
                    if(dataArr[i].id == this.childNodes[0].getAttribute("id")){
                        if(!(parseInt(height)<=0||Number.isNaN(parseInt(height)))){
                            dataArr[i].hg = parseInt(height)
                        }else{
                            alert("Height is default value.")
                        }
                    }
                }
                this.childNodes[0].setAttribute("style","height:100px;width:100px;")
            }
        }
    }
}



function send(){
    const url = 'http://localhost:3000'
    let sendRequest = new Request(url + '/process', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataArr)
    })

    fetch(sendRequest).then(response => {
        let result = response.text()
        result.then(res => {
            localStorage.setItem("data", res);
            localStorage.setItem("photodata",JSON.stringify(dataArr))
            window.location.href='/result';
        })
    })
    
}

pbutton.onclick=function(){
    if(!dataArr.length){
        return alert('Please upload file');
    }
    send();
}

cbutton.onclick=function(){
    re.innerHTML=''
    dataArr=[]
    pic.value=''
}


about.onclick=function(){
    alert("App that input pictures of a person doing yoga, automatically determine the x,y coordinates of"+
    "key body parts(knees, hips, shoulders, elbows, head, etc.), and then output these"+
     "coordinates to a data file. \nThe app is meant to be used in the CWRU ENGR 200(statics)"+
      "course, and in high school STEM programs with collaborating high schools in Ethiopia.")

}