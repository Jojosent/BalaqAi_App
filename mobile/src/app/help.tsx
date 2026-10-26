import { useState } from 'react';
import { View } from 'react-native';
import { Text, Pressable } from '../i18n/Localized';
import { DetailPage, detailStyles as styles } from '../components/DetailPage';
const questions = [
 ['Тілді қалай өзгертемін?', 'Профиль бетіндегі «Қолданба тілі» бөлімінен қазақша, орысша немесе ағылшынша таңдаңыз.'],
 ['Жүктілік мерзімін қалай түзетемін?', 'Профиль → Жүктілік деректері → Мерзімді өзгерту. Жоспарлау кезеңінде жүктілік трекері көрсетілмейді.'],
 ['Деректерім сақталмаса не істеймін?', 'Интернет байланысын тексеріңіз. Қате көрсетілсе, «Қайта сақтау» батырмасын басыңыз. Сақтау аяқталғанша аккаунттан шықпаңыз.'],
 ['Жақындарым нені көреді?', 'QR шақыруда таңдаған мәліметтеріңізді ғана. Қолжетімділікті «Жақындармен бөлісу» бөлімінде тоқтатуға болады.'],
 ['Ескертулер қалай жұмыс істейді?', 'Ескертулер қолданба ішіндегі тізімге сақталады. Телефонға фондық хабарлама жіберілмейді.'],
 ['Тауарды қалай сатып аламын?', 'Каталогтан тауар түрін таңдап, сатушылардан іздеңіз. Төлем сатушының сайтында жасалады; BalaqAi төлем қабылдамайды.'],
 ['Apple арқылы кіре аламын ба?', 'Apple арқылы кіру үшін сервис параметрлері қажет. Қазір email немесе бапталған Google аккаунты арқылы кіріңіз.'],
];
export default function HelpScreen() { const [open, setOpen] = useState<number | null>(null); return <DetailPage title="Көмек және қолдау">{questions.map(([question, answer], index) => <View key={question} style={styles.card}><Pressable accessibilityRole="button" accessibilityState={{ expanded: open === index }} onPress={() => setOpen(open === index ? null : index)}><Text style={styles.title}>{question} {open === index ? '−' : '+'}</Text></Pressable>{open === index ? <Text style={styles.body}>{answer}</Text> : null}</View>)}</DetailPage>; }
