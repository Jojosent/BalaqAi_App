import { taskGroups } from '../utils/tasks';
import personalDetails from './personalTaskDetails.json';
export type TaskArticle = { title: string; body: string; source: string; sourceName: string; references?: { url: string; name: string }[] };
const personalInfo = personalDetails as Record<string, string>;
const personalArticles = Object.fromEntries(taskGroups.flatMap(group => [
  [`personal-${group.id}`, { title: group.title, body: personalInfo[`personal-${group.id}`], source: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-care-and-appointments/', sourceName: 'NHS' }],
  ...group.tasks.map((title, index) => [`personal-${group.id}-${index}`, { title, body: personalInfo[`personal-${group.id}-${index}`], source: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-care-and-appointments/', sourceName: 'NHS' }]),
])) as Record<string, TaskArticle>;
export const taskArticles: Record<string, TaskArticle> = {
  ...personalArticles,
  clinic: { title: 'Алғашқы қабылдауға дайындық', body: "Емханаға хабарласып, алғашқы қабылдауға жазылыңыз. Өзіңізбен бірге жеке куәлігіңізді, бұрынғы зерттеу нәтижелерін және қабылдайтын дәрілер тізімін дайындаңыз. Қажетті мамандар мен тексерулерді дәрігермен бірге жоспарлаңыз.", source: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-care-and-appointments/', sourceName: 'NHS' },
  "scan-first": {
    "title": "I триместрдегі УДЗ-скрининг",
    "body": "Бірінші УДЗ-скрининг 11 аптадан 13 апта 6 күнге дейін жүргізіледі. Дәрігер жүктілік мерзімін, сәбидің дамуын және мойын тұсындағы кеңістікті бағалайды. Бұл өлшем қан талдауы және басқа мәліметтермен бірге қаралады. Скрининг кейбір хромосомалық жағдайлардың ықтималдығын есептейді, бірақ диагноз қоймайды.",
    "source": "https://www.nhs.uk/pregnancy/your-pregnancy-care/12-week-scan/",
    "sourceName": "NHS",
    "references": [
      {
        "url": "https://www.gov.kz/org/dsm/documents/details/242451?lang=ru",
        "name": "ҚР ДСМ"
      }
    ]
  },
  "papp-a": {
    "title": "Биохимиялық скрининг PAPP-A",
    "body": "PAPP-A — бірінші триместрдегі біріктірілген скрининг кезінде ана қанында өлшенетін ақуыз. Нәтиже бос β-ХГЧ, УДЗ және ана жасы туралы мәліметтермен бірге бағаланады. Жеке бір көрсеткіш диагноз қоймайды; қорытындыны дәрігер түсіндіреді.",
    "source": "https://www.genomicseducation.hee.nhs.uk/genotes/knowledge-hub/combined-first-trimester-screening/",
    "sourceName": "NHS Genomics"
  },
  "beta-hcg": {
    "title": "Биохимиялық скрининг β-ХГЧ",
    "body": "Бос β-ХГЧ — бірінші триместрдегі қан көрсеткіші. Ол PAPP-A және УДЗ мәліметтерімен бірге хромосомалық жағдайлардың ықтималдығын есептеуге қолданылады. Жеке мән диагноз қоймайды.",
    "source": "https://www.gov.kz/org/dsm/documents/details/242451?lang=ru",
    "sourceName": "ҚР ДСМ"
  },
  "scan-second": {
    "title": "II УДЗ-скрининг",
    "body": "Екінші УДЗ-скринингте сәбидің дене құрылымдары мен өсуі, плацента және басқа көрсеткіштер бағаланады. Кейбір даму ерекшеліктері осы кезеңде анығырақ көрінеді. Дегенмен УДЗ барлық жағдайды анықтай алмайды. Дәрігер қорытындыны түсіндіріп, қажет болса қосымша тексеруді ұсынады.",
    "source": "https://www.nhs.uk/pregnancy/your-pregnancy-care/20-week-scan/",
    "sourceName": "NHS"
  },
  "scan-third": {
    "title": "III УДЗ-скрининг",
    "body": "Үшінші УДЗ-скрининг Қазақстанда 30–32 аптаға жоспарланады. Ол ұрықтың дамуын бағалайды. Нақты күнді және қосымша тексерулерді дәрігер анықтайды.",
    "source": "https://www.gov.kz/org/dsm/documents/details/242451?lang=ru",
    "sourceName": "ҚР ДСМ"
  },
  "folate": {
    "title": "Фолий қышқылы",
    "body": "Фолий қышқылы сәбидің жүйке түтігінің дамуы үшін маңызды. ДДҰ жүктілік кезінде күн сайын 400 мкг фолий қышқылын ұсынады. Кей жағдайларда мөлшер басқаша болады, сондықтан препарат пен дозаны дәрігерден нақтылаңыз. Чек-лист тек қабылдауды белгілеуге арналған.",
    "source": "https://www.who.int/tools/elena/interventions/daily-iron-pregnancy",
    "sourceName": "WHO"
  },
  "specialists": {
    "title": "Бейінді мамандар кеңесі",
    "body": "Жүктілік кезіндегі мамандар кеңесі денсаулық жағдайын және күтім жоспарын нақтылауға көмектеседі. Қай маманға бару қажет екенін акушер-гинеколог шағымдар, ауру тарихы және тексеру нәтижелері бойынша анықтайды. Қабылдауға алдыңғы қорытындылар мен сұрақтарыңызды дайындаңыз.",
    "source": "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/",
    "sourceName": "NHS"
  },
  "sma": {
    "title": "Жұлын бұлшықет атрофиясы",
    "body": "Жұлын бұлшықет атрофиясы — бұлшықет қозғалысын басқаратын жүйке жасушаларына әсер ететін тұқым қуалайтын ауру. Кей адамдар ауру белгісінсіз гендік өзгерісті тасымалдауы мүмкін. Генетик отбасылық тарихты бағалап, тасымалдаушылыққа тест қажет пе екенін түсіндіреді.",
    "source": "https://medlineplus.gov/genetics/condition/spinal-muscular-atrophy/",
    "sourceName": "MedlinePlus"
  },
  "duchenne": {
    "title": "Дюшенн бұлшықет дистрофиясы",
    "body": "Дюшенн бұлшықет дистрофиясы — үдемелі бұлшықет әлсіздігімен байланысты тұқым қуалайтын ауру. Ол дистрофин ақуызын түзетін гендегі өзгерістерге байланысты және көбіне ұлдарда байқалады. Отбасылық тарих пен генетикалық тест мүмкіндігін генетикпен талқылауға болады.",
    "source": "https://medlineplus.gov/genetics/condition/duchenne-and-becker-muscular-dystrophy/",
    "sourceName": "MedlinePlus"
  },
  "hearing": {
    "title": "Есту қабілетінің төмендеуі",
    "body": "Есту қабілетінің төмендеуі тұқым қуалайтын және тұқым қуаламайтын себептерден болуы мүмкін. Генетикалық тексеру оның кейбір тұқым қуалайтын түрлерін бағалайды, бірақ барлық себепті қамтымайды. Отбасында есту мәселелері болса, дәрігерге айтып, қандай тексеру қажет екенін талқылаңыз.",
    "source": "https://medlineplus.gov/genetics/condition/nonsyndromic-hearing-loss/",
    "sourceName": "MedlinePlus"
  },
  "pku": {
    "title": "Фенилкетонурия",
    "body": "Фенилкетонурия — ағзаның фенилаланин аминқышқылын ыдыратуына әсер ететін тұқым қуалайтын зат алмасу ауруы. Оны тасымалдаушылыққа тест және нәрестенің туғаннан кейінгі скринингі әртүрлі мақсатпен анықтайды. Өзіңіздің немесе отбасыңыздың тарихын дәрігермен талқылаңыз.",
    "source": "https://medlineplus.gov/genetics/condition/phenylketonuria/",
    "sourceName": "MedlinePlus"
  },
  "cf": {
    "title": "Муковисцидоз",
    "body": "Муковисцидоз — өкпе, ас қорыту және басқа жүйелерге әсер етуі мүмкін тұқым қуалайтын ауру. Ол CFTR геніндегі өзгерістермен байланысты. Тасымалдаушыда ауру белгілері болмауы мүмкін. Тест нәтижесі мен қажет болса серіктесті тексеру мәселесін генетик түсіндіреді.",
    "source": "https://medlineplus.gov/genetics/condition/cystic-fibrosis/",
    "sourceName": "MedlinePlus"
  },
  "geneticist": {
    "title": "Генетик кеңесі",
    "body": "Генетик отбасылық ауру тарихын, скрининг қорытындыларын және генетикалық тест мүмкіндіктерін талқылайды. Тасымалдаушылыққа тест ата-ананың гендік ерекшеліктерін бағалайды, ал пренаталдық зерттеулердің мақсаты басқа болуы мүмкін. Кеңеске бұрынғы қорытындыларды әкеліп, сұрақтарыңызды дайындаңыз.",
    "source": "https://medlineplus.gov/genetics/understanding/testing/uses/",
    "sourceName": "MedlinePlus"
  }
};
export function getTaskArticle(id: string | undefined) { return id && Object.hasOwn(taskArticles, id) ? taskArticles[id] : null; }
