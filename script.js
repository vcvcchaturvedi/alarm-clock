const currentTime = new Date();
const evening = currentTime.getHours() > 18 ? true : false;
const bodyElem = document.querySelector("body");
if (evening) {
  bodyElem.classList.add("light-theme");
} else {
  bodyElem.classList.add("dark-theme");
}
export { bodyElem };
