import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthSize } from '../components/AuthUI';
import { MainIcon } from '../components/MainIcon';
import { filterMomcareVideos, momcareVideos, youtubeThumbnail, youtubeVideoUrl, type VideoTrimester } from '../data/momcareVideos';

export default function MomcareTvScreen() {
  const { s, pageWidth } = useAuthSize();
  const insets = useSafeAreaInsets();
  const [trimester, setTrimester] = useState<VideoTrimester | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const videos = filterMomcareVideos(query, trimester);
  const featuredWidth = pageWidth - s(64);
  function open(url: string) {
    setError('');
    void Linking.openURL(url).catch(() => setError('YouTube ашылмады. Интернет байланысын тексеріп, қайталаңыз.'));
  }
  function thumbnail(id: string) {
    return failedImages.includes(id) ? <View style={{ flex: 1, backgroundColor: '#a4d9d0', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: s(32), fontWeight: '700' }}>MomCare TV</Text></View> : <Image accessible={false} source={{ uri: youtubeThumbnail(id) }} resizeMode="cover" onError={() => setFailedImages(previous => previous.includes(id) ? previous : [...previous, id])} style={{ width: '100%', height: '100%' }} />;
  }
  return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff0f0' }}><View style={{ width: pageWidth, flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: Math.max(insets.top + s(12), s(44)), paddingBottom: Math.max(insets.bottom + s(22), s(30)) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(14), gap: s(6) }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Басты бетке оралу" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={{ width: 44, height: 44, borderRadius: 25, borderWidth: 1, borderColor: '#f5d9dc', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ff777e', fontSize: 28 }}>‹</Text></Pressable>
        <View style={{ flex: 1 }}><Text accessibilityRole="header" style={{ fontSize: s(21), fontWeight: '700', textAlign: 'center', color: '#151919' }}>Дәрігер кеңестері</Text><Text style={{ textAlign: 'center', color: '#af8d91', fontSize: s(10), marginTop: 3 }}>MomCare TV</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Бейне іздеу" accessibilityState={{ expanded: searchOpen }} onPress={() => setSearchOpen(previous => !previous)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><MainIcon name="search" size={s(22)} color="#45bbae" /></Pressable>
      </View>
      {searchOpen ? <View style={{ marginHorizontal: s(23), marginTop: s(12) }}><TextInput accessibilityLabel="Бейне іздеу" placeholder="Тақырып немесе арна бойынша іздеу" value={query} onChangeText={setQuery} autoCorrect={false} style={{ backgroundColor: '#fff', borderRadius: 20, padding: 13, fontSize: 14, color: '#225c53' }} />{query ? <Pressable accessibilityRole="button" onPress={() => setQuery('')} style={{ padding: 9, alignSelf: 'flex-end' }}><Text style={{ color: '#319e8e' }}>Тазалау</Text></Pressable> : null}</View> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: s(22), gap: s(7), paddingVertical: s(16) }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Шолу: барлық бейнелер" onPress={() => { setTrimester(null); setQuery(''); }} style={{ borderRadius: 24, borderWidth: 1, borderColor: '#47b9ac', paddingHorizontal: s(12), minHeight: 36, justifyContent: 'center', backgroundColor: '#e4eeeb' }}><Text style={{ color: '#344e47', fontSize: s(13), fontWeight: '600' }}>◉  Шолу</Text></Pressable>
        {([null, 1, 2, 3] as const).map(value => <Pressable key={value ?? 'all'} accessibilityRole="button" accessibilityState={{ selected: trimester === value }} onPress={() => setTrimester(value)} style={{ backgroundColor: trimester === value ? '#48baae' : '#f0eeee', borderColor: '#48baae', borderWidth: 1, borderRadius: 22, minHeight: 36, paddingHorizontal: s(13), justifyContent: 'center' }}><Text style={{ color: trimester === value ? '#fff' : '#31413d', fontSize: s(12) }}>{value ? `${value}-триместр` : 'Барлығы'}</Text></Pressable>)}
      </ScrollView>
      {!query && trimester === null ? <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={featuredWidth + s(12)} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: s(32), gap: s(12), paddingBottom: s(21) }}>
        {momcareVideos.slice(0, 3).map(video => <Pressable key={video.id} accessibilityRole="link" accessibilityLabel={`YouTube: ${video.title}`} onPress={() => open(youtubeVideoUrl(video.id))} style={{ width: featuredWidth, height: featuredWidth * 0.6, overflow: 'hidden', borderRadius: s(17), backgroundColor: '#c6e8df' }}>
          {thumbnail(video.id)}<View style={{ position: 'absolute', bottom: s(10), left: s(10), right: s(10), flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1, backgroundColor: '#fffffff2', borderRadius: 20, padding: s(10) }}><Text numberOfLines={2} style={{ color: '#283a35', fontSize: s(11), fontWeight: '600' }}>{video.title}</Text></View><View style={{ width: 38, height: 38, backgroundColor: '#fff', borderColor: '#ff777e', borderWidth: 1, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ff777e', fontSize: 20 }}>▶</Text></View></View>
        </Pressable>)}
      </ScrollView> : null}
      <View style={{ paddingHorizontal: s(22), gap: s(22) }}>
        {error ? <Text accessibilityRole="alert" style={{ color: '#a34c52', lineHeight: 21 }}>{error}</Text> : null}
        {videos.map(video => <View key={video.id} style={{ backgroundColor: '#fff', borderRadius: s(19), overflow: 'hidden', boxShadow: '0px 5px 10px rgba(80,35,42,0.14)' }}>
          <Pressable accessibilityRole="link" accessibilityLabel={`YouTube-та көру: ${video.title}`} onPress={() => open(youtubeVideoUrl(video.id))}>
            <View style={{ height: (pageWidth - s(44)) * 9 / 16, backgroundColor: '#c6e8df' }}>{thumbnail(video.id)}<View style={{ position: 'absolute', right: s(12), bottom: s(10), backgroundColor: '#000a', borderRadius: 8, padding: 6 }}><Text style={{ color: '#fff', fontSize: s(11) }}>▶ YouTube</Text></View></View>
            <View style={{ padding: s(13), flexDirection: 'row', alignItems: 'flex-start', gap: s(10) }}><View style={{ width: s(30), height: s(30), borderRadius: 18, backgroundColor: '#e6f5f1', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#339e90', fontSize: s(10), fontWeight: '700' }}>{video.author === "Tommy's" ? 'T' : 'NHS'}</Text></View><View style={{ flex: 1 }}><Text style={{ color: '#202925', fontSize: s(14), lineHeight: s(19), fontWeight: '600' }}>{video.title}</Text><Text style={{ color: '#8b8f8d', fontSize: s(10), lineHeight: s(14), marginTop: s(4) }}>{video.originalTitle}{'\n'}{video.author} · English</Text></View></View>
          </Pressable>
          <Pressable accessibilityRole="link" accessibilityLabel={`Дереккөз: ${video.title}`} onPress={() => open(video.source)} style={{ paddingHorizontal: s(15), paddingBottom: s(12), alignSelf: 'flex-end' }}><Text style={{ color: '#3fa99a', fontSize: s(11) }}>Дереккөз ↗</Text></Pressable>
        </View>)}
        {!videos.length ? <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24 }}><Text style={{ color: '#71877f', textAlign: 'center' }}>Бейне табылмады. Басқа сөзді немесе триместрді таңдаңыз.</Text></View> : null}
      </View>
    </ScrollView>
  </View></View>;
}
