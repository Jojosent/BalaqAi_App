import { router } from 'expo-router';
import { View } from 'react-native';
import { Text, Pressable } from '../i18n/Localized';
import { DetailPage, detailStyles as styles } from '../components/DetailPage';
export default function FeaturesScreen() {
 return <DetailPage title="Қолданба мүмкіндіктері"><Text style={styles.body}>Негізгі мүмкіндіктер тегін. Ақылы жазылым мен қолданба ішіндегі төлемдер қосылмаған.</Text>{([{ title: 'Бақылау құралдары', body: 'Салмақ, көңіл-күй және сәби қимылы күнделіктері.', route: '/tracking-tools' }, { title: 'Тапсырмалар тізімі', body: 'Дайын тізімдер мен өз тапсырмаларыңызды сақтаңыз.', route: '/tasks' }, { title: 'MomCare TV', body: 'YouTube-тағы нақты бейнелерді көріңіз.', route: '/momcare-tv' }, { title: 'Жақындармен бөлісу', body: 'Бөлісетін мәліметтерді өзіңіз таңдайсыз.', route: '/connect' }] as const).map(item => <Pressable key={item.route} accessibilityRole="button" onPress={() => router.push(item.route)} style={styles.card}><View><Text style={styles.title}>{item.title} ›</Text><Text style={styles.body}>{item.body}</Text></View></Pressable>)}</DetailPage>;
}
