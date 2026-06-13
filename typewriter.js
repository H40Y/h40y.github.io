(function () {
  const target = document.getElementById("typed-text");

  if (!target) {
    return;
  }

  const greetings = {
    morning: [
      { lang: "zh-Hans", text: "上午好。" },
      { lang: "zh-Hant", text: "早安。" },
      { lang: "en", text: "Good morning." },
      { lang: "ja", text: "おはようございます。" },
    ],
    afternoon: [
      { lang: "zh-Hans", text: "下午好。" },
      { lang: "zh-Hant", text: "午安。" },
      { lang: "en", text: "Good afternoon." },
      { lang: "ja", text: "こんにちは。" },
    ],
    evening: [
      { lang: "zh-Hans", text: "晚上好。" },
      { lang: "zh-Hant", text: "晚安。" },
      { lang: "en", text: "Good evening." },
      { lang: "ja", text: "こんばんは。" },
    ],
  };

  const typeDelay = 120;
  const deleteDelay = 80;
  const holdDelay = 5000;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phrases = greetings[getDayPeriod()];

  let phraseIndex = 0;
  let characterIndex = target.textContent.length;

  function characters(value) {
    return Array.from(value);
  }

  function getClientHour() {
    const localDate = new Date();
    const localHour = localDate.getHours();

    if (Number.isInteger(localHour) && localHour >= 0 && localHour <= 23) {
      return localHour;
    }

    const chinaDate = new Date(Date.now() + 8 * 60 * 60 * 1000);
    return chinaDate.getUTCHours();
  }

  function getDayPeriod() {
    const hour = getClientHour();

    if (hour >= 5 && hour < 12) {
      return "morning";
    }

    if (hour >= 12 && hour < 18) {
      return "afternoon";
    }

    return "evening";
  }

  function setText(value) {
    target.textContent = value;
    target.setAttribute("lang", phrases[phraseIndex].lang);
  }

  function typePhrase() {
    const phrase = phrases[phraseIndex];
    const letters = characters(phrase.text);

    if (characterIndex < letters.length) {
      characterIndex += 1;
      setText(letters.slice(0, characterIndex).join(""));
      window.setTimeout(typePhrase, typeDelay);
      return;
    }

    window.setTimeout(deletePhrase, holdDelay);
  }

  function deletePhrase() {
    const phrase = phrases[phraseIndex];
    const letters = characters(phrase.text);

    if (characterIndex > 0) {
      characterIndex -= 1;
      setText(letters.slice(0, characterIndex).join(""));
      window.setTimeout(deletePhrase, deleteDelay);
      return;
    }

    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(typePhrase, typeDelay);
  }

  if (motionQuery.matches) {
    setText(phrases[0].text);
    return;
  }

  target.textContent = "";
  characterIndex = 0;
  typePhrase();
})();
