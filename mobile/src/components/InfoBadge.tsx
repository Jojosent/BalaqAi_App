import { router } from 'expo-router';
import { Pressable } from '../i18n/Localized';
import { useLanguage } from '../i18n/Language';
import { getTaskArticle } from '../data/taskArticles';
import { HorseBadge } from './MainIcon';
export function InfoBadge({ topic, from = 'tasks', title, customIndex }: { topic: string; from?: 'tasks' | 'home' | 'personal-tasks'; title?: string; customIndex?: number }) {
  const { t } = useLanguage();
  const article = getTaskArticle(topic);
  if (!article) return null;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${t('Ақпарат')}: ${title || t(article.title)}`} onPress={() => router.push({ pathname: '/task-info', params: { topic, from, ...(customIndex !== undefined ? { customIndex: String(customIndex) } : {}) } })} style={({ pressed }) => ({ width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}><HorseBadge /></Pressable>;
}
