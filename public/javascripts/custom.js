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
    // console.log("imageURL", data);
    video.pause();
    setTimeout( () => {
      video.play();    // restart camera
    }, 500);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob){
      
      const photo = new FormData();
      photo.append('scan-img',blob,'filename.png');
      
      axios.post("/google", photo)
      .then(response => {
        console.log(response)
        window.location = "/scanplay";
      })
      .catch(function(err) {
        debugger;
        console.log(err);
      })
    })
  })

  // $('#langChange').click((e)=>{
  //   e.preventDefault();
  //   debugger;
  //   console.log("changing!"); 
  //   const lang = new FormData();
  //   lang.append('id',)
  //   axios.post("/profile/lang", lang)
  //     .then(response => {
  //       console.log(response)
  //       window.location = "/scanplay";
  //     })
  //     .catch(function(err) {
  //       debugger;
  //       console.log(err);
  //     })
  // })


  //modal
  $(function(){
    $('.js-modal-open').on('click',function(){
        let target = $(this).data('target');
        let modal = document.getElementById(target);
        console.log(modal);
        $(modal).fadeIn();
        return false;
      });
      $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
      });
  });
  

  //speech
  $(function(){
    if ('speechSynthesis' in window) {
      console.log("speech is ready");
      
      const voiceSelect = document.querySelector('#voice-select');
      // selectタグの中身を声の名前が入ったoptionタグで埋める
      function appendVoices() {
        const voices = speechSynthesis.getVoices()
        voiceSelect.innerHTML = ''
        voices.forEach(voice => { 
          if(!voice.lang.match('ja|en-US|nl|es')) return
          const option = document.createElement('option')
          option.value = voice.name
          option.text  = `${voice.name} (${voice.lang})` 
          option.setAttribute('selected', voice.default)
          voiceSelect.appendChild(option)
        });
      }
      appendVoices();
      speechSynthesis.onvoiceschanged = e => {
        appendVoices()
      }
      
  
      $('#speak').click(function(e){
        e.preventDefault();
        console.log("speaking");
        let text = document.getElementById('message').innerHTML;
        let translation = document.getElementById('translation').innerHTML;
        console.log("text",text);
        console.log("translation",translation);
        const msg = new SpeechSynthesisUtterance();
        // msg.text = text;
        msg.text = translation;
        msg.voice = speechSynthesis
        .getVoices()
        .filter(voice => voice.name === voiceSelect.value)[0]
        debugger;
        speechSynthesis.speak(msg);
      })
    } else {
      $('#modal1').openModal();
    }
  });

})