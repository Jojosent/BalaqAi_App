# Настройки Firebase и OAuth

## Что уже подключено

Проект `balaqaidb`, Web config, Email/Password Authentication, Node.js API и Firestore. Google provider включён, публичный Web OAuth client ID записан в `mobile/.env`, localhost есть в Authorized domains. Apple provider ещё не создан. Ключ Admin SDK используется только локальным Node.js-сервером через `GOOGLE_APPLICATION_CREDENTIALS`.

Email подтверждается ссылкой Firebase, без SMS. Шаблоны писем и имя отправителя настраиваются в Authentication → Templates. Письма имеют квоты; отсутствие SMS-расходов не означает неограниченное использование. [Тарифы Firebase](https://firebase.google.com/pricing).

## Google на телефоне

1. Выберите постоянные Android package name и iOS bundle ID. Внесите `ANDROID_PACKAGE` и `IOS_BUNDLE_ID` в `mobile/.env`. Не используйте примерные идентификаторы для релиза.
2. Добавьте Android/iOS приложения в Firebase Project settings. Для Android зарегистрируйте SHA-1 и SHA-256 сертификатов debug/development/release. В Google Cloud OAuth Clients должны быть соответствующие Android/iOS клиенты.
3. Существующий `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` используется как server client ID. Для iOS добавьте `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` и `GOOGLE_IOS_URL_SCHEME` (`com.googleusercontent.apps.…` из reversed client ID).
4. Создайте development build после установки native modules (`npx expo run:android` или EAS development build). Expo Go не поддерживает native Google Sign-In. При смене native-конфигурации пересоберите приложение.
5. Для Web-публикации добавьте реальный домен в Firebase Authentication → Settings → Authorized domains. Не добавляйте произвольные домены. Внешний consent screen/test users настраивается в Google Cloud при необходимости.

[Expo Google authentication](https://docs.expo.dev/guides/google-authentication/), [Google Sign-In setup](https://react-native-google-signin.github.io/docs/setting-up/get-config-file).

## Apple

Понадобится Apple Developer Account с возможностью настройки Sign in with Apple. Участие в Developer Program обычно стоит 99 USD в год (либо местную стоимость); оформление и оплату выполняет владелец. [Apple Developer Program](https://developer.apple.com/programs/).

1. Зарегистрируйте App ID, совпадающий с `IOS_BUNDLE_ID`, включите Sign in with Apple.
2. Для Web зарегистрируйте Services ID, Team ID и Sign in with Apple Key. Return URL: `https://balaqaidb.firebaseapp.com/__/auth/handler`. Зарегистрируйте домены согласно Apple setup.
3. Firebase Authentication → Sign-in method → Apple: включите provider, внесите Services ID, Team ID, Key ID и private key **только в защищённые настройки Firebase**, никогда не в Expo и не в чат.
4. Соберите iOS development build с provisioning, включающим Sign in with Apple. `app.config.js` уже содержит `usesAppleSignIn` и Expo plugin. Код передаёт SHA-256 nonce Apple и raw nonce Firebase.
5. В Web используется Firebase popup. На Android Apple пока не реализован; показывается пояснение и доступны email/Google.
6. Если используется Apple Hide My Email, настройте relay для отправителя Firebase в Apple Developer; иначе письма на relay-адреса могут не доставляться.

[Firebase Apple setup](https://firebase.google.com/docs/auth/web/apple), [Expo AppleAuthentication](https://docs.expo.dev/versions/v58.0.0/sdk/apple-authentication/).

## Публикация сервера

Код готов к запуску на Node.js-хостинге. Задайте `PORT`, `HOST`, `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` (или workload identity), `ALLOWED_ORIGINS` и используйте HTTPS. В Expo укажите `EXPO_PUBLIC_API_URL` опубликованного API. Поле `EXPO_PUBLIC_*` всегда публичное — секреты туда не помещайте.

Firestore rules в репозитории — deny-all для клиентских SDK. Профилями управляет Admin SDK через проверяемый `/v1/me`; UID клиента не принимается в URL/теле. Не переводите базу в test mode. Публикация новых rules не требовалась: в существующем проекте уже проверено deny-all.

После подготовки OAuth проверьте на реальных устройствах: Google/Apple → анкета → сохранение → выход → повторный вход → восстановление данных. Слияние аккаунтов разных провайдеров автоматически не выполняется; при конфликте email интерфейс просит войти исходным способом. Удаление аккаунта и полный lifecycle отзыва Apple пока не реализованы — перед релизом потребуется отдельный экран удаления.
