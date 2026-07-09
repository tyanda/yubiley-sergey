document.addEventListener('DOMContentLoaded', () => {

    // --- 1. АЛМАЗНАЯ ПЫЛЬ (Оптимизировано для мобильных) ---
    const createDiamondDust = () => {
        const container = document.getElementById('diamonds');
        if (!container) return;

        // Количество частиц: меньше на телефонах для производительности
        const count = window.innerWidth < 768 ? 12 : 20;

        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.classList.add('diamond-dust');

            // Случайная позиция
            dust.style.left = Math.random() * 100 + '%';
            dust.style.top = Math.random() * 100 + '%';

            // Случайная задержка и длительность для естественности
            const duration = 7 + Math.random() * 5; // от 7 до 12 сек
            const delay = Math.random() * 5;

            dust.style.animationDuration = `${duration}s`;
            dust.style.animationDelay = `-${delay}s`; // Отрицательная задержка запускает анимацию сразу

            container.appendChild(dust);
        }
    };
    createDiamondDust();

    // --- 2. ЛЕПЕСТКИ САРДААНА (Падающие) ---
    const createPetals = () => {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const count = window.innerWidth < 768 ? 12 : 20;
        const colors = ['#d92121', '#b08d2a', '#d4af37', '#ff6b6b'];

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.classList.add('particle');

            const size = Math.random() * 6 + 5; // Чуть меньше размер для аккуратности
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.5}px`;
            petal.style.background = colors[Math.floor(Math.random() * colors.length)];
            petal.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
            petal.style.opacity = Math.random() * 0.4 + 0.4;
            petal.style.left = Math.random() * 100 + 'vw';

            const duration = 15 + Math.random() * 10; // Медленное падение
            const delay = Math.random() * 10;

            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `-${delay}s`;
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(petal);
        }
    };
    createPetals();

    // --- 3. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Можно прекратить наблюдение после появления для экономии ресурсов
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ---
    const targetDate = new Date('2026-07-17T18:00:00').getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const daysEl = document.querySelector('[data-days]');
        const hoursEl = document.querySelector('[data-hours]');
        const minutesEl = document.querySelector('[data-minutes]');
        const secondsEl = document.querySelector('[data-seconds]');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (diff <= 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    setInterval(updateTimer, 1000);
    updateTimer(); // Запуск сразу, чтобы не ждать 1 сек

    // --- 5. МОДАЛЬНОЕ ОКНО RSVP ---
    const modal = document.getElementById('rsvp-modal');
    const openBtn = document.getElementById('open-rsvp');
    const closeBtns = modal ? modal.querySelectorAll('[data-close]') : [];
    const form = document.getElementById('rsvp-form');
    const toast = document.getElementById('toast');

    const openModal = () => {
        if(modal) {
            modal.classList.remove('hidden');
            // Небольшая задержка для плавного появления фона
            setTimeout(() => {
                modal.querySelector('.absolute.inset-0').classList.remove('opacity-0');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if(modal) {
            modal.querySelector('.absolute.inset-0').classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); // Ждем окончания анимации
            document.body.style.overflow = '';
        }
    };

    if(openBtn) openBtn.addEventListener('click', openModal);

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.absolute.inset-0')) {
                closeModal();
            }
        });
    }

    // Обработка формы
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Сохранение локально (эмуляция базы)
            const existing = JSON.parse(localStorage.getItem('yubiley_rsvps') || '[]');
            existing.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('yubiley_rsvps', JSON.stringify(existing));

            console.log('✅ Ответ гостя сохранен:', data);

            closeModal();

            // Показ уведомления
            if(toast) {
                toast.classList.remove('hidden');
                // Анимация появления тоста
                requestAnimationFrame(() => {
                    toast.classList.remove('translate-y-10', 'opacity-0');
                    toast.classList.add('opacity-100');
                });

                setTimeout(() => {
                    toast.classList.add('translate-y-10', 'opacity-0');
                    toast.classList.remove('opacity-100');
                    setTimeout(() => toast.classList.add('hidden'), 500);
                }, 3500);
            }

            form.reset();
        });
    }

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- 6. МУЗЫКАЛЬНЫЙ ПЛЕЕР ---
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const iconNote = document.getElementById('icon-note');
    const iconWave = document.getElementById('icon-wave');

    if (musicBtn && audio) {
        let isPlaying = false;

        // Установка громкости (не слишком громко)
        audio.volume = 0.5;

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                if(iconNote) iconNote.classList.remove('hidden');
                if(iconWave) iconWave.classList.add('hidden');
                musicBtn.classList.remove('ring-[#d92121]', 'bg-red-50');
                musicBtn.classList.add('bg-white/90');
            } else {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Автовоспроизведение заблокировано браузером или файл не найден.");
                        alert("Пожалуйста, убедитесь, что файл music.mp3 лежит в папке assets.");
                    });
                }

                if(iconNote) iconNote.classList.add('hidden');
                if(iconWave) iconWave.classList.remove('hidden');
                musicBtn.classList.remove('bg-white/90');
                musicBtn.classList.add('ring-[#d92121]', 'bg-red-50');
            }
            isPlaying = !isPlaying;
        });
    }
});
