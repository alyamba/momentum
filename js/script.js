console.log(
  " 1. Часы и календарь +15 \n 2. Приветствие +10 \n 3. Смена фонового изображения +20 \n 4. Виджет погоды +15 \n 5. Виджет цитата дня +10 \n 6. Аудиоплеер +15 \n 7. Продвинутый аудиоплеер +0 \n 8. Перевод приложения на два языка (en/ru или en/be) +15 \n 9. Получение фонового изображения от API +0 \n 10. Настройки приложения +0 \n 11. Дополнительный функционал на выбор +0 \n Итого: 100"
);

import playList from "./playList.js";

const dateTuday = document.querySelector(".date");
const time = document.querySelector(".time");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const body = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");

const city = document.querySelector(".city");

const weatherError = document.querySelector(".weather-error");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");

const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");

const audio = document.querySelector("audio");
const playPrevButton = document.querySelector(".play-prev");
const play = document.querySelector(".play");
const playNextButtomButton = document.querySelector(".play-next");

const playListContainer = document.querySelector(".play-list");

const languageBtn = document.querySelector(".language");
let language = "en";

const date = new Date();
const hours = date.getHours();

const greetingTranslation = {
  en: {
    good: {
      night: "Good",
      morning: "Good",
      afternoon: "Good",
      evening: "Good",
    },
    night: "night",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
  },
  ru: {
    good: {
      night: "Доброй",
      morning: "Доброе",
      afternoon: "Добрый",
      evening: "Добрый",
    },
    night: "ночи",
    morning: "утро",
    afternoon: "день",
    evening: "вечер",
  },
};

//Демонстрация даты
function showDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const currentDate = date.toLocaleDateString(language, options);

  dateTuday.textContent = currentDate;
}

//Демонстрация времени
function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();

  time.textContent = currentTime;

  setTimeout(showTime, 1000);
  showDate();
  showGreeting();
}

//Приветсивие
function showGreeting() {
  const timeOfDay = getTimeOfDay(hours);
  const greetingText = `${greetingTranslation[language].good[timeOfDay]} ${greetingTranslation[language][timeOfDay]},`;

  greeting.textContent = greetingText;
}

//Функция, возвращающая время суток
function getTimeOfDay(hours) {
  if (parseInt(hours / 6) === 0) {
    return "night";
  } else if (parseInt(hours / 6) === 1) {
    return "morning";
  } else if (parseInt(hours / 6) === 2) {
    return "afternoon";
  } else return "evening";
}

//Сохранения данных перед закрытием
function setLocalStorage() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorage);

//Возобновление и отображение данных перед загрузкой страницы
function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }
}
// window.addEventListener("load", getLocalStorage);

let randomNum;
//Возвращает рандомное число [1; 20]
function getRandomNum() {
  randomNum = (Math.floor(Math.random() * (21 - 1)) + 1).toString();
  return randomNum;
}

//Новый фон после перезапуска страницы
function setBg() {
  const timeOfDay = getTimeOfDay(hours);
  const bgNum = getRandomNum().padStart(2, "0");

  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
  };
}

//Следующий фон
function getSlideNext() {
  randomNum === 20 ? (randomNum = 1) : (randomNum = randomNum + 1);
  setBg();
}
slideNext.addEventListener("click", getSlideNext);

//Предыдущий фон
function getSlidePrev() {
  randomNum === 1 ? (randomNum = 20) : (randomNum = randomNum - 1);
  setBg();
}
slidePrev.addEventListener("click", getSlidePrev);

//Вывод погоды
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${
    city.value ? city.value : "Minsk"
  }&lang=${language}&appid=886dde82de9cb83e321758a5b9abaf10&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod === "404") {
    weatherError.textContent = `${data.message}`;
    weatherIcon.className = "";
    weatherIcon.classList.remove(
      weatherIcon.classList.value
        .split(" ")
        .find((className) => className.includes("owf-"))
    );
    temperature.textContent = "";
    weatherDescription.textContent = "";
    wind.textContent = "";
    humidity.textContent = "";
    return;
  }

  if (!city.value) {
    city.value = "Minsk";
  }
  weatherError.textContent = "";
  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `${Math.round(data.wind.speed)} m/s`;
  humidity.textContent = `${Math.round(data.main.humidity)} %`;
}
city.addEventListener("change", getWeather);

//Цитаты
let number;
let data;
async function getQuotes(isLanguageChanged) {
  if (!isLanguageChanged) {
    const quotes = "../data.json";
    const res = await fetch(quotes);
    data = await res.json();

    number = Math.floor(Math.random() * (data.length - 1 - 0 + 1)) + 0;
  }

  quote.textContent = `"${data[number][language]}"`;
  author.textContent = `${data[number].author}`;
}
changeQuote.addEventListener("click", () => getQuotes());

//Плеер
let isPlay = false;

function getAudioTitleFromRoute(route) {
  return route?.split("/")[route?.split("/").length - 1];
}

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;

  if (!isPlay) {
    isPlay = true;
    audio.play();
  } else {
    isPlay = false;
    audio.pause();
  }

  const currentAudio = playList.find(
    (el) =>
      getAudioTitleFromRoute(el.src) ===
      getAudioTitleFromRoute(audio.src).replaceAll("%20", " ")
  );
  showPlayList(currentAudio);
}
play.addEventListener("click", playAudio);

//Меняет класс при проигрывании и паузе
function toggleBtn() {
  play.classList.toggle("pause");
}
play.addEventListener("click", toggleBtn);

let playNum = 0;
//Пролистывание музыки вперед
function playNext() {
  playNum === playList.length - 1 ? (playNum = 0) : (playNum += 1);
  if (!isPlay) {
    isPlay = true;
  } else {
    isPlay = false;
  }
  playAudio();
}
playNextButtomButton.addEventListener("click", playNext);

audio.addEventListener("ended", playNext);

//Пролистывание музыки назад
function playPrev() {
  playNum === 0 ? (playNum = playList.length - 1) : (playNum -= 1);
  if (!isPlay) {
    isPlay = true;
  } else {
    isPlay = false;
  }
  playAudio();
}
playPrevButton.addEventListener("click", playPrev);

//Список музыки
function showPlayList(currentAudio) {
  if (currentAudio) {
    Object.values(playListContainer.children).forEach((el) => {
      playListContainer.removeChild(el);
    });
  }
  playList.forEach((el) => {
    const li = document.createElement("li");
    li.classList.add("play-item");
    if (currentAudio && currentAudio.title === el.title) {
      li.classList.add("colored-audio");
    }
    li.textContent = el.title;
    playListContainer.append(li);
  });
}

function changeLanguage() {
  if (language === "en") {
    language = "ru";
  } else {
    language = "en";
  }
  languageBtn.textContent = language;
  showDate();
  getWeather();
  getQuotes(true);
}
languageBtn.addEventListener("click", changeLanguage);

getLocalStorage();
showTime();
showGreeting();
setBg();
getWeather();
getQuotes();
showPlayList();
