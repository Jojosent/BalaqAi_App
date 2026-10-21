export function authError(error: unknown) {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Дұрыс email мекенжайын енгізіңіз.',
    'auth/invalid-credential': 'Email немесе құпиясөз дұрыс емес.',
    'auth/user-not-found': 'Email немесе құпиясөз дұрыс емес.',
    'auth/wrong-password': 'Email немесе құпиясөз дұрыс емес.',
    'auth/email-already-in-use': 'Бұл email тіркелген. Аккаунтыңызға кіріңіз.',
    'auth/weak-password': 'Құпиясөз кемінде 8 таңбадан тұрсын.',
    'auth/password-does-not-meet-requirements': 'Құпиясөз Firebase қауіпсіздік талаптарына сай емес. Басқа құпиясөз таңдаңыз.',
    'auth/too-many-requests': 'Сұраныс тым көп. Біраз уақыттан кейін қайталаңыз.',
    'auth/network-request-failed': 'Интернет байланысын тексеріңіз.',
    'auth/operation-not-allowed': 'Бұл кіру тәсілі Firebase Console-да әлі қосылмаған.',
    'auth/unauthorized-domain': 'Бұл сайттың доменін Firebase Authorized domains тізіміне қосу қажет.',
    'auth/account-exists-with-different-credential': 'Бұл email басқа тәсілмен тіркелген. Алғашқы тәсілмен кіріңіз.',
    'auth/popup-blocked': 'Браузер кіру терезесін бұғаттады. Қалқымалы терезелерге рұқсат беріңіз.',
    'auth/popup-closed-by-user': '', 'auth/cancelled-popup-request': '', 'ERR_REQUEST_CANCELED': '', 'SIGN_IN_CANCELLED': '',
  };
  return code && code in messages ? messages[code] : error instanceof Error && !code ? error.message : 'Кіру орындалмады. Баптаулар мен байланысты тексеріңіз.';
}
