# Настройки Firebase и OAuth

## Что уже подключено

Проект `balaqaidb`, Web config, Email/Password Authentication, Node.js API и Firestore. Google provider включён, публичный Web OAuth client ID записан в `mobile/.env`, localhost есть в Authorized domains. Apple provider ещё не создан. Ключ Admin SDK используется только локальным Node.js-сервером через `GOOGLE_APPLICATION_CREDENTIALS`.

Вход выполняется по email и паролю без обязательного подтверждения почты и без SMS. Письмо при регистрации не отправляется; восстановление пароля по email сохранено. Шаблоны писем и имя отправителя настраиваются в Authentication → Templates. Письма имеют квоты; отсутствие SMS-расходов не означает неограниченное использование. [Тарифы Firebase](https://firebase.google.com/pricing).

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

## Веб-публикация без серверного ключа

Владелец выбрал не передавать Firebase Admin key в Vercel. Веб-версия использует Firebase JS SDK напрямую: файл `api.web.ts` выбирается Metro только для браузера. Разрешения проверяет Firebase на каждом запросе. Опубликованные rules разрешают только вошедшему владельцу с действующим Firebase ID token чтение и изменение своей записи, ограничивают поля и размеры; list/delete запрещены. Остальные коллекции закрыты. Native `api.ts` и локальный Node.js-сервер сохранены для будущего приложения.

`vercel.json` собирает `mobile/dist-web` и поддерживает SPA-маршруты. Секреты и локальные файлы исключены `.vercelignore`. Переменная `FIREBASE_SERVICE_ACCOUNT_JSON` в Vercel не создавалась. Для новых доменов настройте Firebase Authorized domains.

Live-тест клиентских правил создаёт временные аккаунты, проверяет собственную запись, запрет чужой записи/чтения, вход без подтверждения почты, дополнительные поля и список пользователей, затем удаляет все созданные тестовые документы и аккаунты:

```powershell
cd server
$env:FIREBASE_WEB_API_KEY='публичный-apiKey'
node --env-file=.env test-web-rules.mjs
```

## Будущий отдельный Node.js-сервер

Код готов к запуску на Node.js-хостинге. Задайте `PORT`, `HOST`, `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` (или workload identity), `ALLOWED_ORIGINS` и используйте HTTPS. В Expo укажите `EXPO_PUBLIC_API_URL` опубликованного API. Поле `EXPO_PUBLIC_*` всегда публичное — секреты туда не помещайте.

Node.js API управляет теми же профилями через Admin SDK и проверяемый `/v1/me`; UID клиента не принимается в URL/теле. Для веб-версии защищённый доступ владельца уже разрешён в Firestore rules. Не переводите базу в публичный test mode.

После подготовки OAuth проверьте на реальных устройствах: Google/Apple → анкета → сохранение → выход → повторный вход → восстановление данных. Слияние аккаунтов разных провайдеров автоматически не выполняется; при конфликте email интерфейс просит войти исходным способом. Удаление аккаунта и полный lifecycle отзыва Apple пока не реализованы — перед релизом потребуется отдельный экран удаления.


## Личные дневники и задачи

Веб- и мобильный клиент хранят сеансы движений в `users/{uid}/kickSessions/{startedAt}`, измерения веса — в `users/{uid}/weightEntries/{at}`, настройки веса — в `users/{uid}/tracking/weight`, свои задачи по разделам — в `users/{uid}/customTasks/{group}`. Каждая запись проверяется отдельно, чтобы не превышать лимит вычислений Firestore Rules. Старые задачи из анкеты копируются в новый формат до следующего сохранения. Клиент показывает последние 20 сеансов движений и 30 измерений веса; старые записи в базе не удаляются. Напоминание о весе показывается на странице, push-уведомления не подключены.

Дневник настроения: `users/{uid}/moodEntries/{at}`. Запись содержит время и один из 18 вариантов; чтение и запись доступны только владельцу. На странице показаны последние 50 записей, старые записи в базе не удаляются.
