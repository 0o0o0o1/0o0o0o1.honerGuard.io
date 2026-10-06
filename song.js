const tabs = document.querySelectorAll(".tab");
const songs = document.querySelectorAll(".song");
const player = document.getElementById("player");

const audioMap = {
  song1: "audio/song1.m4a",
  song2: "audio/song2.m4a",
  song3: "audio/song3.m4a"
};

// 탭 클릭
tabs.forEach(tab => {
  tab.onclick = () => {
    // 탭 초기화
    tabs.forEach(t => t.classList.remove("active"));

    // 가사 + 하이라이트 초기화
    songs.forEach(s => {
      s.classList.remove("active");
      s.querySelectorAll("p").forEach(p => p.classList.remove("active"));
    });

    tab.classList.add("active");

    const songId = tab.dataset.song;
    const songEl = document.getElementById(songId);
    songEl.classList.add("active");

    player.src = audioMap[songId];
    player.currentTime = 0;
    player.load();
    player.play();
  };
});

// 가사 클릭 → 해당 시간 이동
document.querySelectorAll(".song p").forEach(line => {
  line.onclick = () => {
    player.currentTime = Number(line.dataset.time);
    player.play();
  };
});

// 첫 진입 시 song1 세팅
window.addEventListener("DOMContentLoaded", () => {
  tabs[0].classList.add("active");
  songs[0].classList.add("active");
  player.src = audioMap["song1"];
  player.load();
});

// ⭐ 하이라이트 핵심 로직
function updateLyrics() {
  const current = player.currentTime;
  const activeSong = document.querySelector(".song.active");
  if (!activeSong) return;

  const lines = activeSong.querySelectorAll("p");

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

player.addEventListener("timeupdate", updateLyrics);
player.addEventListener("play", updateLyrics);
