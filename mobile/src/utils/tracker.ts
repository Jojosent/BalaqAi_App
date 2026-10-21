export const TRACKER_SOURCES = {
  growth: 'https://www.vinmec.com/eng/blog/table-of-fetal-weight-and-length-according-to-who-standards-en',
  development: 'https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy',
  early: 'https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/1st-trimester/week-8/',
};

// Approximate reference measurements, never a user's ultrasound measurements.
// Weights for weeks 11–19 are intentionally omitted because reference tables differ.
const lengthCm = [1.6, 2.3, 3.1, 4.1, 5.4, 6.7, 14.7, 16.7, 18.6, 20.4, 22.2, 24, 25.7, 27.4, 29, 30.6, 32.2, 33.7, 35.1, 36.6, 37.6, 39.3, 40.5, 41.8, 43, 44.1, 45.3, 46.3, 47.3, 48.3, 49.3, 50.1, 51, 51.5, 51.7];
const weightG: Record<number, number> = { 8: 1, 9: 2, 10: 4, 20: 330, 21: 400, 22: 476, 23: 565, 24: 665, 25: 756, 26: 900, 27: 1000, 28: 1100, 29: 1239, 30: 1396, 31: 1568, 32: 1755, 33: 2000, 34: 2200, 35: 2378, 36: 2600, 37: 2800, 38: 3000, 39: 3186, 40: 3338, 41: 3600, 42: 3700 };

export function trackerIllustration(week: number) { return week >= 20 ? 'baby' : 'moon'; }
export function pregnancyTrimester(totalDays: number) { return totalDays < 98 ? 1 : totalDays < 196 ? 2 : 3; }
export function trackerMeasurements(week: number) {
  return { length: Number.isInteger(week) && week >= 8 && week <= 42 ? lengthCm[week - 8] : null, weight: weightG[week] ?? null };
}

export function trackerArticle(week: number) {
  const baby = week <= 8
    ? 'Осы ерте кезеңде ми мен омыртқаның, аяқ-қолдың және бет мүшелерінің бастапқы құрылымдары қалыптаса бастайды.'
    : week <= 13
      ? 'Аяқ-қолдың шеміршектері қалыптасады, тырнақтар дами бастайды. Ағзалардың дамуы жалғасып жатыр.'
      : week <= 27
        ? 'Бұл кезеңде сәби жылдам өседі. Сүйектер мен жүйке жүйесі дамуын жалғастырады, дене мүшелері жетіледі.'
        : week <= 36
          ? 'Сәби салмақ қосып, май қоры жиналады. Қимылдары мен дене ерекшеліктері айқындала түседі.'
          : 'Жүктіліктің соңғы кезеңінде ми, өкпе және жүйке жүйесі дамуын жалғастырады. Босануға дайындық жүреді.';
  const mother = week < 14
    ? 'Сырт көзге жүктілік әлі байқалмауы мүмкін. Шаршау, жүрек айну немесе көңіл күй өзгерістері болуы ықтимал. Әр адамның сезімі әртүрлі.'
    : week < 28
      ? 'Денеңіз өзгеріп, ішіңіз өсе түседі. Өзіңізді қалай сезінетініңізді бақылап, сұрақтарыңызды дәрігеріңізбен талқылаңыз.'
      : 'Өсіп келе жатқан ішіңіз күнделікті жайлылығыңызға әсер етуі мүмкін. Демалысқа уақыт бөліп, босануға дайындықты дәрігеріңізбен талқылаңыз.';
  return { baby, mother, tips: 'Жоспарланған тексерулерге барыңыз. Күтім, күнделікті белсенділік және дәрілер туралы сұрақтарды өз дәрігеріңізбен нақтылаңыз.' };
}
