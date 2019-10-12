$(document).ready(()=>{
  const video = document.getElementById("video");　　　　　　// video 要素を取得
  const canvas = document.getElementById("canvas");       // canvas 要素の取得
  // const context = canvas.getContext("2d");                // canvas の context の取得

  // Camera setting
  const constraints = {
    audio: false, 
    video: {
      facingMode: "environment"
    }
  };

  //syncronize camera & video
  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

  //scan
  $('#scan').click((e)=>{
    e.preventDefault();
    // e.preventPropagation();
    console.log("scanned!"); 
    const ctx = canvas.getContext("2d"); 
    let data = canvas.toDataURL('png');
    console.log("imageURL", data);
    video.pause();
    setTimeout( () => {
      video.play();    // restart camera
    }, 500);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob){
      const photo = new FormData();
      photo.append('scan-img',blob,'filename.png');
      axios.post("/google", photo).then(responseOfGoogle => {
      }).catch(err => {
        debugger
        console.log(err.response);
      })
    })
  })
})