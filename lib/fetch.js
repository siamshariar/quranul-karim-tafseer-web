import { config } from "./config";

const apiBaseUrl = config.apiBaseUrl;
const localizationCode = config.localizationCode;
const translationCode = config.translationCode;

async function waitToCallApi() {
  await new Promise((resolve, reject) => setTimeout(resolve, 1200));
}

export async function getChaptersInfo() {
  await waitToCallApi()
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(
        `${apiBaseUrl}/chapters/localizations/${localizationCode}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const info = await res.json();
      return info;
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.log(`getChaptersInfo attempt ${attempt} timed out, retrying...`);
      } else {
        console.log(`getChaptersInfo attempt ${attempt} failed: ${error.message}`);
      }
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds before retry
      }
    }
  }

  throw lastError;
}

export async function getChapterDetails(chapterNo) {
  // waitToCallApi()
  // let data
  // await firebase.database().ref(chapterNo - 1).once('value').then(snapshot => {
  //     data = snapshot.val()
  // })

  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(
        `${apiBaseUrl}/translations/${translationCode}/chapters/${chapterNo}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.log(`Attempt ${attempt} timed out, retrying...`);
      } else {
        console.log(`Attempt ${attempt} failed: ${error.message}`);
      }
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds before retry
      }
    }
  }

  throw lastError;
}

export async function getVerseDetails(chapterNo, verseNo) {
  //waitToCallApi()

  // let data
  // await firebase.database().ref(`${chapterNo - 1}/verses/${verseNumber - 1}`).once('value').then(snapshot => {
  //     data = Array(snapshot.val())
  // })

  try {
    const url = `${apiBaseUrl}/translations/${translationCode}/chapters/${chapterNo}/verses/${verseNo}`;
    const res = await fetch(url, { timeout: 15000 });
    if (res.status === 500 || !res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch verse ${chapterNo}:${verseNo}`, error);
    return null;
  }
}

export async function getVersesByQuery(verses) {
  const url = `${apiBaseUrl}/translations/${translationCode}?verses=${verses}`;
  return fetchDataByUrl(url);
}

export async function fetchDataByUrl(url) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 500) {
        return null;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.log(`fetchDataByUrl attempt ${attempt} timed out for ${url}, retrying...`);
      } else {
        console.log(`fetchDataByUrl attempt ${attempt} failed for ${url}: ${error.message}`);
      }
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds before retry
      }
    }
  }

  throw lastError;
}

// Start Subjective
export async function getSubjectives() {
  const url = `${apiBaseUrl}/subjective/localizations/${localizationCode}?type=1`;
  return fetchDataByUrl(url);
}

export async function getParentSubjectives() {
  const url = `${apiBaseUrl}/subjective/localizations/${localizationCode}?type=2`;
  return fetchDataByUrl(url);
}

export async function getParentSubjectiveBySlug(slug) {
  const url = `${apiBaseUrl}/subjective/${slug}/localizations/${localizationCode}`;
  return fetchDataByUrl(url);
}

export async function getSubjectiveVersesBySlug(slug) {
  const url = `${apiBaseUrl}/subjective/${slug}/verses/localizations/${localizationCode}`;
  return fetchDataByUrl(url);
}

export async function getAllSubjectives() {
  const url = `${apiBaseUrl}/subjective/localizations/${localizationCode}`;
  return fetchDataByUrl(url);
}
// End Subjective

// 99 names of Allah
export async function getNamesOfAllah() {
  const url = `${apiBaseUrl}/names-of-allah/localizations/${localizationCode}`;
  return fetchDataByUrl(url);
}
