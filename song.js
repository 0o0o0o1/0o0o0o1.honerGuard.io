const tabs = document.querySelectorAll(".tab");
const songs = document.querySelectorAll(".song");
const player = document.getElementById("player");

const audioMap = {
  song1: "audio/song1.m4a",
  song2: "audio/song2.m4a",
  song3: "audio/song3.m4a"
};


// ==================================================
// 가사 가져오기
// HTML의 <div class="song"> 안에 있는 <p>를 가사로 사용
// ==================================================
function getLyrics(songElement) {
  if (!songElement) return [];

  return Array.from(
    songElement.querySelectorAll("p[data-time]")
  );
}


// ==================================================
// 모든 가사 하이라이트 제거
// ==================================================
function clearAllLyricsActive() {
  songs.forEach(song => {
    getLyrics(song).forEach(line => {
      line.classList.remove("active");
    });
  });
}


// ==================================================
// 현재 곡의 특정 가사 하이라이트
// ==================================================
function setActiveLyric(line) {

  const song = line.closest(".song");

  if (!song) return;

  // 현재 곡의 모든 가사에서 active 제거
  getLyrics(song).forEach(lyric => {
    lyric.classList.remove("active");
  });

  // 선택한 가사만 활성화
  line.classList.add("active");

  // 선택한 가사가 화면에 보이도록 이동
  line.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ==================================================
// 군가 탭 클릭
// ==================================================
tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    const songId = tab.dataset.song;
    const songEl = document.getElementById(songId);

    if (!songEl) return;


    // ----------------------------------------------
    // 탭 초기화
    // ----------------------------------------------
    tabs.forEach(t => {
      t.classList.remove("active");
    });


    // ----------------------------------------------
    // 모든 곡 숨기기
    // ----------------------------------------------
    songs.forEach(song => {

      song.classList.remove("active");

      getLyrics(song).forEach(line => {
        line.classList.remove("active");
      });

    });


    // ----------------------------------------------
    // 선택한 탭 활성화
    // ----------------------------------------------
    tab.classList.add("active");


    // ----------------------------------------------
    // 선택한 곡 활성화
    // ----------------------------------------------
    songEl.classList.add("active");


    // ----------------------------------------------
    // 음악 변경
    // ----------------------------------------------
    if (audioMap[songId]) {

      player.pause();

      player.src = audioMap[songId];

      player.currentTime = 0;

      player.load();


      // 자동재생 시도
      // 브라우저 정책으로 막히면 무시
      player.play().catch(() => {});

    }

  });

});


// ==================================================
// 가사 클릭
//
// 클릭한 가사의 data-time 위치로 이동
// ==================================================
songs.forEach(song => {

  const lyrics = getLyrics(song);

  lyrics.forEach(line => {

    line.addEventListener("click", () => {

      const time = Number(line.dataset.time);

      if (Number.isNaN(time)) {
        return;
      }


      // --------------------------------------------
      // 해당 시간으로 이동
      // --------------------------------------------
      player.currentTime = time;


      // --------------------------------------------
      // 클릭한 가사 즉시 하이라이트
      // --------------------------------------------
      setActiveLyric(line);


      // --------------------------------------------
      // 음악 재생
      // --------------------------------------------
      player.play().catch(() => {});

    });

  });

});


// ==================================================
// 현재 재생 시간에 맞춰 가사 찾기
// ==================================================
function updateLyrics() {

  const activeSong = document.querySelector(".song.active");

  if (!activeSong) return;


  const lyrics = getLyrics(activeSong);

  if (lyrics.length === 0) return;


  const currentTime = player.currentTime;

  let activeIndex = -1;


  // ----------------------------------------------
  // 현재 시간이 어느 가사 구간인지 확인
  // ----------------------------------------------
  for (let i = 0; i < lyrics.length; i++) {

    const currentLine = lyrics[i];

    const startTime = Number(
      currentLine.dataset.time
    );


    const nextLine = lyrics[i + 1];

    const nextTime = nextLine
      ? Number(nextLine.dataset.time)
      : Infinity;


    if (
      currentTime >= startTime &&
      currentTime < nextTime
    ) {

      activeIndex = i;

      break;

    }

  }


  // ----------------------------------------------
  // 모든 가사 하이라이트 제거
  // ----------------------------------------------
  lyrics.forEach(line => {
    line.classList.remove("active");
  });


  // ----------------------------------------------
  // 현재 가사 하이라이트
  // ----------------------------------------------
  if (activeIndex !== -1) {

    const activeLine = lyrics[activeIndex];

    activeLine.classList.add("active");

  }

}


// ==================================================
// 음악 재생 위치가 변경될 때
// ==================================================
player.addEventListener(
  "timeupdate",
  updateLyrics
);


// ==================================================
// 재생 시작
// ==================================================
player.addEventListener(
  "play",
  updateLyrics
);


// ==================================================
// 일시정지
// ==================================================
player.addEventListener(
  "pause",
  updateLyrics
);


// ==================================================
// 재생 위치를 직접 이동했을 때
// ==================================================
player.addEventListener(
  "seeked",
  updateLyrics
);


// ==================================================
// 곡이 끝났을 때
// ==================================================
player.addEventListener(
  "ended",
  () => {

    clearAllLyricsActive();

  }
);


// ==================================================
// 첫 진입 시 1번 곡 설정
// ==================================================
window.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------
  // 첫 번째 탭 활성화
  // ----------------------------------------------
  if (tabs.length > 0) {

    tabs.forEach(tab => {
      tab.classList.remove("active");
    });

    tabs[0].classList.add("active");

  }


  // ----------------------------------------------
  // 첫 번째 곡 활성화
  // ----------------------------------------------
  if (songs.length > 0) {

    songs.forEach(song => {
      song.classList.remove("active");
    });

    songs[0].classList.add("active");

  }


  // ----------------------------------------------
  // 첫 번째 음악 설정
  // ----------------------------------------------
  if (audioMap.song1) {

    player.src = audioMap.song1;

    player.currentTime = 0;

    player.load();

  }


  // ----------------------------------------------
  // 가사 초기화
  // ----------------------------------------------
  clearAllLyricsActive();

});
