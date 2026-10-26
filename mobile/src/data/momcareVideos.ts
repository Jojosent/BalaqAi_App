export type VideoTrimester = 1 | 2 | 3;
export type MomcareVideo = {
  id: string; title: string; originalTitle: string; author: string;
  trimesters: VideoTrimester[]; source: string;
};
const nhsSource = 'https://northcheshireandmersey.nhs.uk/our-services/maternity-services/resources-and-services-to-support-you-and-your-family/';
const georgesSource = 'https://www.stgeorges.nhs.uk/service/maternity-services/maternity-parent-education-resources/';
// Original titles/authors checked with YouTube oEmbed. Trimester tags are editorial navigation categories.
export const momcareVideos: MomcareVideo[] = [
  { id: '2zu3rOOjsN4', title: 'Жүктілік кезіндегі тамақтану және қозғалыс', originalTitle: 'Healthy eating and movement in pregnancy - English', author: 'North Cheshire and Mersey NHS Foundation Trust', trimesters: [1, 2, 3], source: nhsSource },
  { id: 'wckRLAePu7s', title: 'Жүктілік сапары: алғашқы қадамдар', originalTitle: 'My Maternity Journey (English)', author: 'NHS South West London', trimesters: [1], source: georgesSource },
  { id: 'Au7xRUr84GU', title: 'Жүктілік кезінде дұрыс тамақтану', originalTitle: "Tommy's and Mothercare: Healthy eating in pregnancy", author: "Tommy's", trimesters: [1, 2, 3], source: 'https://www.tamesideandglossopmaternity.nhs.uk/my-pregnancy/my-healthy-pregnancy/wellbeing-and-mental-health/healthy-eating' },
  { id: 'egap7kOFp7A', title: 'Жүкті әйелдерге арналған физиотерапевт кеңестері', originalTitle: 'Antenatal Physiotherapy Advice Class', author: 'St George’s, Epsom and St Helier Hospital Group', trimesters: [2, 3], source: georgesSource },
  { id: '5sZ-V3FcDC4', title: 'Жүктілік кезіндегі дәрігер қабылдаулары', originalTitle: 'Maternity appointments - English', author: 'North Cheshire and Mersey NHS Foundation Trust', trimesters: [1, 2, 3], source: nhsSource },
  { id: 'Me-91mcJ9O8', title: 'Сәбиді тамақтандыруға дайындық', originalTitle: 'Feeding your baby - English', author: 'North Cheshire and Mersey NHS Foundation Trust', trimesters: [3], source: nhsSource },
];
export const youtubeVideoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export function filterMomcareVideos(query: string, trimester: VideoTrimester | null) {
  const q = query.trim().toLocaleLowerCase();
  return momcareVideos.filter(video => (!trimester || video.trimesters.includes(trimester)) &&
    `${video.title} ${video.originalTitle} ${video.author}`.toLocaleLowerCase().includes(q));
}
