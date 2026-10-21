import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop, Path } from 'react-native-svg';
import { useAuthSize } from '../../components/AuthUI';
import { MainIcon } from '../../components/MainIcon';
import { PickerShell } from '../../components/ProfilePickers';

type Crop = { x: number; y: number; width: number; height: number };
const categories = [
  { id: 'clothing', title: 'Жүкті әйелдер киімі', crop: { x: 42, y: 424, width: 140, height: 140 } },
  { id: 'comfort', title: 'Жеңілдік пен жайлылық', crop: { x: 42, y: 746, width: 140, height: 140 } },
  { id: 'skin', title: 'Тері күтімі', crop: { x: 42, y: 1054, width: 140, height: 140 } },
  { id: 'daily', title: 'Күнделікті күтім', crop: { x: 42, y: 1333, width: 140, height: 140 } },
];
const products = [
  { id: 'pillow', name: 'Жүктілік жастығы', sold: '46K', ratings: '3167', crop: { x: 260, y: 546, width: 190, height: 190 } },
  { id: 'belt', name: 'Pregnancy Belt', sold: '24K', ratings: '149', crop: { x: 518, y: 546, width: 190, height: 190 } },
  { id: 'stockings', name: 'Compression Stockings', sold: '2K', ratings: '23', crop: { x: 260, y: 1003, width: 190, height: 190 } },
];
type Product = typeof products[number];
function ShopPhoto({ crop, width, label }: { crop: Crop; width: number; label?: string }) {
  const factor = width / crop.width;
  return <View accessibilityLabel={label} style={{ width, height: crop.height * factor, overflow: 'hidden' }}><Image accessible={false} source={require('../../../assets/images/shop-reference.png')} resizeMode="stretch" style={{ position: 'absolute', width: 750 * factor, height: 1892 * factor, left: -crop.x * factor, top: -crop.y * factor }} /></View>;
}
function MetricIcon({ type }: { type: 'bag' | 'thumb' }) {
  return <Svg width={13} height={14} viewBox="0 0 20 22" fill="#a6a6a6"><Path d={type === 'bag' ? 'M3 7h14l1 14H2L3 7Zm4 0V5a3 3 0 0 1 6 0v6M7 7v4' : 'M2 10h4v11H2V10Zm6 0 5-8c3 1 0 7 0 7h5v5l-3 7H8V10Z'} stroke={type === 'bag' ? '#a6a6a6' : 'none'} strokeWidth={1.5} /></Svg>;
}

export default function ShopScreen() {
  const { s } = useAuthSize();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState('comfort');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const active = categories.find(item => item.id === category)!;
  const visible = (query.trim() || category === 'comfort' ? products : []).filter(item => item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={{ paddingTop: Math.max(s(40), insets.top + s(10)), paddingBottom: s(15), alignItems: 'center', justifyContent: 'center', minHeight: s(86) }}><Text accessibilityRole="header" style={{ fontSize: s(27), fontWeight: '500', color: '#080808' }}>Дүкен</Text><Pressable accessibilityRole="button" accessibilityLabel={searchOpen ? 'Іздеуді жабу' : 'Тауар іздеу'} onPress={() => { setSearchOpen(!searchOpen); setQuery(''); }} style={{ position: 'absolute', right: s(16), bottom: s(10), width: s(40), height: s(40), alignItems: 'center', justifyContent: 'center' }}><MainIcon name="search" color="#47bbae" size={s(24)} /></Pressable></View>
    {searchOpen ? <TextInput accessibilityLabel="Тауар атауы" placeholder="Тауар атауын енгізіңіз" autoFocus value={query} onChangeText={setQuery} style={{ padding: 13, marginHorizontal: s(12), marginBottom: 10, backgroundColor: '#f1f6f4', borderRadius: 18, fontSize: s(14), color: '#294b43' }} /> : null}
    <View style={{ marginHorizontal: s(7), height: s(94), borderRadius: s(15), overflow: 'hidden', marginBottom: s(10) }}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}><Defs><LinearGradient id="shopBanner" x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor="#afe1dc" /><Stop offset="1" stopColor="#087f70" /></LinearGradient></Defs><Rect width="100%" height="100%" fill="url(#shopBanner)" /></Svg>
      <Image source={require('../../../assets/images/shop-benefits.png')} resizeMode="contain" style={{ position: 'absolute', right: s(3), top: s(3), width: s(92), height: s(83) }} />
      <Text style={{ color: '#fff', fontSize: s(15), lineHeight: s(20), letterSpacing: s(0.6), marginLeft: s(14), marginTop: s(9), width: s(270) }}>Жазылымға қосылып, барлық{ '\n' }өнімдерге жеңілдіктер алыңыз</Text>
      <Pressable accessibilityRole="button" onPress={() => setBenefitsOpen(true)} style={{ backgroundColor: '#fff', marginLeft: s(14), marginTop: s(10), width: s(243), minHeight: s(26), borderRadius: s(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}><Text style={{ color: '#47bbae', fontSize: s(12), letterSpacing: s(0.9) }}>Мүмкіндіктерді пайдалану</Text><Text style={{ color: '#47bbae', fontSize: s(26), lineHeight: s(25), fontWeight: '700' }}>›</Text></Pressable>
    </View>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ScrollView style={{ width: s(110), flexGrow: 0 }} contentContainerStyle={{ paddingTop: s(14), paddingBottom: s(20) }} showsVerticalScrollIndicator={false}>
        {categories.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: category === item.id }} onPress={() => { setCategory(item.id); setQuery(''); }} style={{ alignItems: 'center', paddingHorizontal: s(14), marginBottom: s(16), position: 'relative' }}>
          {category === item.id ? <View style={{ position: 'absolute', right: 0, top: s(-20), bottom: s(40), width: s(4), borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: '#47bbae' }} /> : null}
          <View style={{ borderRadius: s(40), overflow: 'hidden' }}><ShopPhoto crop={item.crop} width={s(70)} /></View><Text style={{ fontSize: s(16), lineHeight: s(20), marginTop: s(17), textAlign: 'center', color: category === item.id ? '#47bbae' : '#111' }}>{item.title}</Text>
        </Pressable>)}
      </ScrollView>
      <ScrollView style={{ flex: 1, backgroundColor: '#f3f2f8' }} contentContainerStyle={{ paddingHorizontal: s(8), paddingTop: s(20), paddingBottom: s(22) }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text accessibilityRole="header" style={{ fontSize: s(19), fontWeight: '500', color: '#080808', marginBottom: s(16) }}>{query.trim() ? 'Іздеу нәтижелері' : category === 'comfort' ? 'Pain Relief' : active.title}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s(10) }}>{visible.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.name}: тауарды ашу`} onPress={() => setProduct(item)} style={{ width: s(119), minHeight: s(218), backgroundColor: '#fff', borderRadius: s(7), padding: s(12) }}>
          <ShopPhoto crop={item.crop} width={s(95)} label={item.name} /><Text style={{ color: '#080808', fontSize: s(16), lineHeight: s(20), minHeight: s(40), marginTop: s(22), marginBottom: s(8), fontWeight: '500' }}>{item.name}</Text><View style={styles.metric}><MetricIcon type="bag" /><Text style={{ color: '#b0b0b0', fontSize: s(10) }}>{item.sold} Sold</Text></View><View style={[styles.metric, { marginTop: s(4) }]}><MetricIcon type="thumb" /><Text style={{ color: '#b0b0b0', fontSize: s(10) }}>{item.ratings} Ratings</Text></View>
        </Pressable>)}</View>
        {!visible.length ? <View style={{ padding: s(14), borderRadius: s(15), backgroundColor: '#fff' }}><Text style={{ color: '#315b51', fontSize: s(15), lineHeight: s(22) }}>{query.trim() ? 'Тауар табылмады. Басқа атаумен іздеп көріңіз.' : 'Бұл санаттағы тауарлар жақында қосылады.'}</Text></View> : null}
        <Text style={{ fontSize: s(10), color: '#9ba29f', lineHeight: s(15), marginTop: s(20) }}>Демо каталог · Бағалар мен сатып алу әлі қосылмаған.</Text>
      </ScrollView>
    </View>
    {benefitsOpen ? <PickerShell title="Жазылым мүмкіндіктері" onClose={() => setBenefitsOpen(false)}><Text style={styles.body}>Жазылым мен өнімдерге жеңілдіктер мүмкіндігі әзірленуде. Қазір жазылым рәсімдеу және төлем жасау қосылмаған.</Text></PickerShell> : null}
    {product ? <PickerShell title="Тауар туралы" onClose={() => setProduct(null)}><ScrollView style={{ maxHeight: 440 }}><View style={{ alignSelf: 'center' }}><ShopPhoto crop={product.crop} width={180} label={product.name} /></View><Text style={{ fontSize: 22, color: '#243e36', fontWeight: '600', marginTop: 16 }}>{product.name}</Text><Text style={styles.body}>Демо каталогтағы тауар. Бағасы, өлшемдері және сатушы мәліметтері әлі енгізілмеген. Сатып алу қолжетімді емес.</Text><Pressable accessibilityRole="button" onPress={() => setFavourites(items => items.includes(product.id) ? items.filter(id => id !== product.id) : [...items, product.id])} style={{ borderRadius: 24, backgroundColor: '#47bbae', padding: 15, alignItems: 'center' }}><Text style={{ color: '#fff', fontWeight: '600' }}>{favourites.includes(product.id) ? 'Таңдаулылардан алып тастау' : 'Таңдаулыларға қосу'}</Text></Pressable><Text style={{ color: '#98a69f', fontSize: 11, textAlign: 'center', marginTop: 10 }}>Таңдауыңыз осы сессияда сақталады</Text></ScrollView></PickerShell> : null}
  </View>;
}
const styles = StyleSheet.create({ metric: { flexDirection: 'row', alignItems: 'center', gap: 10 }, body: { color: '#7c9189', fontSize: 15, lineHeight: 23, marginVertical: 15 } });
