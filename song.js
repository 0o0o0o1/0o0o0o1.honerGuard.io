const tabs = document.querySelectorAll(".tab");
const songs = document.querySelectorAll(".song");
const player = document.getElementById("player");

const audioMap = {
  song1: "audio/song1.m4a",
  song2: "audio/song2.m4a",
  song3: "audio/song3.m4a"
};


// =========================
// 군가 탭 클릭
// =========================
tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    // 탭 초기화
    tabs.forEach(t => {
      t.classList.remove("active");
    });

    // 모든 곡 숨기기
    songs.forEach(song => {
      song.classList.remove("active");

      song.querySelectorAll(".lyric-line").forEach(line => {
        line.classList.remove("active");
      });
    });

    // 선택한 탭 활성화
    tab.classList.add("active");

    const songId = tab.dataset.song;
    const songEl = document.getElementById(songId);

    songEl.classList.add("active");

    // 음악 변경
    player.src = audioMap[songId];
    player.currentTime = 0;
    player.load();

    // 모바일에서는 탭 클릭 후 자동재생이 막힐 수 있으므로
    // 재생을 시도하되 오류는 무시
    player.play().catch(() => {});
  });

});


// =========================
// 가사 클릭 → 해당 시간으로 이동
// =========================
document.querySelectorAll(".lyric-line").forEach(line => {

  line.addEventListener("click", () => {

    const time = Number(line.dataset.time);

    if (!Number.isNaN(time)) {
      player.currentTime = time;

      player.play().catch(() => {});
    }

  });

});


// =========================
// 첫 진입 시 1번 곡 설정
// =========================
window.addEventListener("DOMContentLoaded", () => {

  if (tabs.length > 0) {
    tabs[0].classList.add("active");
  }

  if (songs.length > 0) {
    songs[0].classList.add("active");
  }

  player.src = audioMap["song1"];
  player.load();

});


// =========================
// 음악에 맞춰 가사 하이라이트
// =========================
function updateLyrics() {

  const current = player.currentTime;
  const activeSong = document.querySelector(".song.active");

  if (!activeSong) return;

  const lines = activeSong.querySelectorAll(".lyric-line");

  lines.forEach((line, index) => {

    const start = Number(line.dataset.time);

    const next = lines[index + 1]
      ? Number(lines[index + 1].dataset.time)
      : Infinity;

    if (current >= start && current < next) {

      line.classList.add("active");

    } else {

      line.classList.remove("active");

    }

  });

}


// 음악 재생 위치가 바뀔 때마다 가사 업데이트
player.addEventListener("timeupdate", updateLyrics);
player.addEventListener("play", updateLyrics);
player.addEventListener("seeked", updateLyrics);
