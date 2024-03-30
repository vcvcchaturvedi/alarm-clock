import * as DOMscript from "./script.js";
const setAlarmBtn = document.getElementById("setAlarm");
let alarms = [];
const localData = localStorage.getItem("alarms");
const alarmSoundSelectElem = document.querySelector("#alarmSound");
alarmSoundSelectElem.addEventListener("change", (e) => {
  const sound = e.target.value;
  alarmSoundElem.pause();
  alarmSoundElem.src = sound;
  alarmSoundElem.load();
  alarmSoundElem.play();
  setTimeout(() => {
    alarmSoundElem.pause();
    alarmSoundElem.currentTime = 0;
  }, 2000);
});
const alarmSoundElem = document.getElementById("alarmAudio");
const renderMyAlarms = () => {
  const myAlarmsElem = document.querySelector("#myAlarms");
  myAlarmsElem.innerHTML = "";
  alarms.forEach((alarm) => {
    const alarmElem = document.createElement("div");
    alarmElem.classList.add(
      "flex",
      "flex-wrap",
      "justify-content-center",
      "align-items-center"
    );
    const alarmValueElem = document.createElement("span");
    alarmValueElem.textContent = alarm.time;
    const alarmDeleteBtn = document.createElement("button");
    alarmDeleteBtn.textContent = "Delete";
    alarmDeleteBtn.addEventListener("click", () => {
      alarms.splice(alarms.indexOf(alarm), 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));
      alarmElem.remove();
    });
    alarmElem.append(alarmValueElem, alarmDeleteBtn);
    myAlarmsElem.appendChild(alarmElem);
  });
};
alarmSoundElem.addEventListener("ended", () => {
  if (DOMscript.bodyElem.classList.contains("alarmAnimation"))
    DOMscript.bodyElem.classList.remove("alarmAnimation");
});
let cronJob = setInterval(() => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTimeElem = document.getElementById("currentTime");
  currentTimeElem.textContent = `Current time ${
    currentHours <= 9 ? "0" + currentHours : currentHours
  } : ${currentMinutes <= 9 ? "0" + currentMinutes : currentMinutes} : ${
    currentSeconds <= 9 ? "0" + currentSeconds : currentSeconds
  }`;
  alarms.forEach((alarm, i, alarms) => {
    const alarmTimeInHours = alarm.time.split(":")[0];
    const alarmTimeInMinutes = alarm.time.split(":")[1];
    if (
      alarmTimeInHours == currentHours &&
      alarmTimeInMinutes == currentMinutes
    ) {
      alarms.splice(i, 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));
      renderMyAlarms();
      alarmSoundElem.pause();
      alarmSoundElem.src = alarm.sound;
      alarmSoundElem.load();
      alarmSoundElem.play();
      if (!DOMscript.bodyElem.classList.contains("alarmAnimation")) {
        DOMscript.bodyElem.classList.add("alarmAnimation");
      }
    }
  });
}, 1000);
if (localData) {
  alarms = JSON.parse(localData);
  renderMyAlarms();
}
setAlarmBtn.addEventListener("click", () => {
  const inputTimeElem = document.getElementById("time");
  if (inputTimeElem.value !== "") {
    const alarmSound = document.querySelector("#alarmSound").value;
    alarms.push({ time: inputTimeElem.value, sound: alarmSound });
    localStorage.setItem("alarms", JSON.stringify(alarms));
    renderMyAlarms();
  }
});
