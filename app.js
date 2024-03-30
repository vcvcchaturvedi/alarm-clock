import * as DOMscript from "./script.js";
const setAlarmBtn = document.getElementById("setAlarm");
//Fetch alarms from localStorage and assign it to alarms variable
let alarms = [];
const localData = localStorage.getItem("alarms");
//set alarm sound selector change event listener
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
//function to render set alarms in My Alarms module
const renderMyAlarms = () => {
  const myAlarmsElem = document.querySelector("#myAlarms");
  myAlarmsElem.innerHTML = ""; //clear out the current container
  alarms.forEach((alarm) => {
    const alarmElem = document.createElement("div"); //main div for current alarm
    alarmElem.classList.add(
      "flex",
      "flex-wrap",
      "justify-content-center",
      "align-items-center"
    );
    const alarmValueElem = document.createElement("span"); //alarm value element
    alarmValueElem.textContent = alarm.time;
    const alarmDeleteBtn = document.createElement("button"); //delete alarm element
    alarmDeleteBtn.textContent = "Delete";
    //add event listener on alarm's delete button
    alarmDeleteBtn.addEventListener("click", () => {
      alarms.splice(alarms.indexOf(alarm), 1); //remove current alarm from main alarms variable
      localStorage.setItem("alarms", JSON.stringify(alarms)); //reset localStorage with alarms variable
      alarmElem.remove(); //remove DOM element of current alarm for which delete button was pressed
    });
    alarmElem.append(alarmValueElem, alarmDeleteBtn);
    myAlarmsElem.appendChild(alarmElem);
  });
};
//on end of play of current alarm we will stop the animation of keyframes set by changeBackgroundColor animation
alarmSoundElem.addEventListener("ended", () => {
  if (DOMscript.bodyElem.classList.contains("alarmAnimation"))
    DOMscript.bodyElem.classList.remove("alarmAnimation");
});

//This is the main function that runs every second and checks for any alarms matching time and
//plays the sound of alarmand removes them from alarms variable and localStorage
let cronJob = setInterval(() => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTimeElem = document.getElementById("currentTime"); //header currentTime element that needs to be refreshed each second
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
      //if alarm if found at current time remove it from storage
      alarms.splice(i, 1);
      localStorage.setItem("alarms", JSON.stringify(alarms));

      //re render my alarms section
      renderMyAlarms();

      //play the alarm
      alarmSoundElem.pause();
      alarmSoundElem.src = alarm.sound;
      alarmSoundElem.load();
      alarmSoundElem.play();

      //load the animation
      if (!DOMscript.bodyElem.classList.contains("alarmAnimation")) {
        DOMscript.bodyElem.classList.add("alarmAnimation");
      }
    }
  });
}, 1000);

//if localData is not empty means we need to render the my alarms section
if (localData) {
  alarms = JSON.parse(localData);
  renderMyAlarms();
}

//event listener for setting the alarm at specific time
setAlarmBtn.addEventListener("click", () => {
  const inputTimeElem = document.getElementById("time");
  if (inputTimeElem.value !== "") {
    //that is if user selected any non empty value in time input
    const alarmSound = document.querySelector("#alarmSound").value;

    //set new alarm in storage
    alarms.push({ time: inputTimeElem.value, sound: alarmSound });
    localStorage.setItem("alarms", JSON.stringify(alarms));

    //re render my alarms section
    renderMyAlarms();
  }
});
