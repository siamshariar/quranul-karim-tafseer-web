import { config } from "./config";

const apiBaseUrl = config.apiBaseUrl;
const localizationCode = config.localizationCode;
const translationCode = config.translationCode;

async function waitToCallApi() {
  // Only add delay in development, not during build
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve, reject) => setTimeout(resolve, 1200));
  }
}

export async function getChaptersInfo() {
  await waitToCallApi()
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(
      `${apiBaseUrl}/chapters/localizations/${localizationCode}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Quran-App/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const info = await res.json();
    return info;
  } catch (error) {
    console.error('Error fetching chapters info:', error);
    throw error;
  }
}

export async function getChapterDetails(chapterNo) {
  // waitToCallApi()
  // let data
  // await firebase.database().ref(chapterNo - 1).once('value').then(snapshot => {
  //     data = snapshot.val()
  // })

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch(
      `${apiBaseUrl}/translations/${translationCode}/chapters/${chapterNo}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Quran-App/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status} for chapter ${chapterNo}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNo} details:`, error);
    throw error;
  }
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
  const res = await fetch(url);
  if (res.status === 500) {
    return null;
  }
  return await res.json();
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
