(function() {
  /**
   * 截取视频方法
   *
   * @param {HTMLVideoElement} video 视频dom
   * @param {number} timePoint 截取时间点
   * @param {(imgUrl) => void} callback  截取成功回调
   * @param {Object} options  可选项
   * @param {number} options.imgQuality 图片质量 默认为3
   */
  function captureVideo(video, timePoint, callback, options = {}) {
    const newOptions = {
      imgQuality: 3,
      ...options,
    };

    // 获取图片url
    const videoSrc = video.getAttribute('src');
    // 生成图片url
    let imgUrl = '';
    let videoWidth = 0;
    let videoHeight = 0;

    const ndVideo = document.createElement('video');
    const ndCanvas = document.createElement('canvas');
    const context = ndCanvas.getContext('2d');

    ndVideo.currentTime = timePoint;
    ndVideo.addEventListener('canplay', function() {
      videoWidth = ndVideo.videoWidth;
      videoHeight = ndVideo.videoHeight;
      ndCanvas.width = videoWidth;
      ndCanvas.height = videoHeight;

      context.drawImage(ndVideo, 0, 0, videoWidth, videoHeight, 0, 0, videoWidth, videoHeight);

      const dataURL = ndCanvas.toDataURL('image/jpeg', options.imgQuality);
      callback && callback(dataURL);
    });

    ndVideo.src = video.src;
  }

  /**
   * 生成视频海报
   *
   * @param {string} imgSrc 图片
   * @param {HTMLVideoElement} video  原视频
   */
  function genVideoPoster(imgSrc, video) {
    video.setAttribute('poster', imgSrc);
  }

  /**
   * 生一个介于两值之间随机数
   *
   * @param {*} minNumber
   * @param {*} maxNumber
   * @returns
   */
  function genRandomNumber(minNumber, maxNumber) {
    var randomNumber = (Math.random() * maxNumber + minNumber) >> 0;
    return randomNumber - minNumber > 0 ? randomNumber : minNumber;
  }

  /** -----your logic------ */
  /**
   * 随机截取图片
   *
   * @param {number} [number=1]
   * @param {HTMLVideoElement} video
   */
  function genRandomCapture(number = 1, video) {
    for (let i = 0; i < number; i++) {
      const randomNum = genRandomNumber(5, video.duration);
      console.log(randomNum);
      captureVideo(video, randomNum, function(src) {
        const ndPosterBox = document.querySelector('.poster-list');
        const ndImg = new Image();
        const ndImgBox = document.createElement('div');
        const ndText = document.createElement('span');
        ndText.innerHTML = `${randomNum}s截图`;

        ndImg.title = `${randomNum}s截图`;
        ndImg.alt = `${randomNum}s截图`;
        ndImg.src = src;

        ndImgBox.appendChild(ndImg);
        ndImgBox.appendChild(ndText);
        ndPosterBox.appendChild(ndImgBox);
        genVideoPoster(src, video);
      });
    }
  }

  const videos = document.querySelectorAll('.video');
  videos.forEach(video => {
    video.addEventListener('canplay', function() {
      genRandomCapture(3, video);
    });
  });
})();
