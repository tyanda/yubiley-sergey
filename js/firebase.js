// Используем глобальную переменную firebase из CDN
// Убеждаемся, что Firebase загружен перед этим скриптом

const firebaseConfig = {
    apiKey: "AIzaSyA-XjzHaGe1esBRnToRlPCkGyzBCDltvEM",
    authDomain: "yubiley-tretjakov.firebaseapp.com",
    projectId: "yubiley-tretjakov",
    storageBucket: "yubiley-tretjakov.firebasestorage.app",
    messagingSenderId: "430636457586",
    appId: "1:430636457586:web:0e47850ae22b8026692ceb"
};

let firebaseInitialized = false;

function initFirebase() {
    if (firebaseInitialized) return;

    try {
        // Инициализация приложения
        const app = firebase.initializeApp(firebaseConfig);

        // Инициализация Firestore
        const db = firebase.firestore();

        // Делаем базу данных доступной глобально для main.js
        window.fbDb = db;

        firebaseInitialized = true;
        console.log('✅ Firebase успешно инициализирован! Проект:', firebaseConfig.projectId);
    } catch (error) {
        console.error('❌ Ошибка инициализации Firebase:', error);
        // Если ошибка (например, дублирование инициализации), пробуем получить экземпляр
        if (!firebase.apps.length) {
             // Если приложений нет, но ошибка была - логируем
             console.error("Критическая ошибка конфигурации");
        } else {
            // Если приложение уже есть, просто берем его
            const db = firebase.firestore();
            window.fbDb = db;
            firebaseInitialized = true;
            console.log('✅ Firebase восстановлен из существующего экземпляра');
        }
    }
}

// Запускаем инициализацию, когда объект firebase доступен
if (typeof firebase !== 'undefined') {
    initFirebase();
} else {
    console.error('❌ SDK Firebase не найден. Проверьте подключение скрипта в HTML.');
}
