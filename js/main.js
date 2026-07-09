document.addEventListener('DOMContentLoaded', () => {

    // --- 1. АЛМАЗНАЯ ПЫЛЬ ---
    const createDiamondDust = () => {
        const container = document.getElementById('diamonds');
        if (!container) return;

        const count = window.innerWidth < 768 ? 12 : 20;

        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.classList.add('diamond-dust');
            dust.style.left = Math.random() * 100 + '%';
            dust.style.top = Math.random() * 100 + '%';

            const duration = 7 + Math.random() * 5;
            const delay = Math.random() * 5;

            dust.style.animationDuration = `${duration}s`;
            dust.style.animationDelay = `-${delay}s`;

            container.appendChild(dust);
        }
    };
    createDiamondDust();

    // --- 2. ЛЕПЕСТКИ САРДААНА ---
    const createPetals = () => {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const count = window.innerWidth < 768 ? 12 : 20;
        const colors = ['#d92121', '#b08d2a', '#d4af37', '#ff6b6b'];

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.classList.add('particle');

            const size = Math.random() * 6 + 5;
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.5}px`;
            petal.style.background = colors[Math.floor(Math.random() * colors.length)];
            petal.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
            petal.style.opacity = Math.random() * 0.4 + 0.4;
            petal.style.left = Math.random() * 100 + 'vw';

            const duration = 15 + Math.random() * 10;
            const delay = Math.random() * 10;

            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `-${delay}s`;
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(petal);
        }
    };
    createPetals();

    // --- 3. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. ТАЙМЕР ---
    const targetDate = new Date('2026-07-17T18:00:00').getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const daysEl = document.querySelector('[data-days]');
        const hoursEl = document.querySelector('[data-hours]');
        const minutesEl = document.querySelector('[data-minutes]');
        const secondsEl = document.querySelector('[data-seconds]');

        // Проверка наличия элементов
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
    updateTimer(); // Запуск сразу

    // --- 5. МОДАЛЬНОЕ ОКНО И ВАЛИДАЦИЯ ---
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
                const overlay = modal.querySelector('.absolute.inset-0');
                if(overlay) overlay.classList.remove('opacity-0');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if(modal) {
            const overlay = modal.querySelector('.absolute.inset-0');
            if(overlay) overlay.classList.add('opacity-0');

            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);

            document.body.style.overflow = '';
        }
    };

    if(openBtn) openBtn.addEventListener('click', openModal);

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if(modal) {
        modal.addEventListener('click', (e) => {
            const overlay = modal.querySelector('.absolute.inset-0');
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Обработка формы с валидацией
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Сброс ошибок
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error', 'border-red-400', 'ring-red-200'));

            let isValid = true;
            const nameInput = form.querySelector('input[name="name"]');
            const guestsInput = form.querySelector('input[name="guests"]');

            // Валидация Имени
            if (!nameInput || !nameInput.value.trim()) {
                if(nameInput) showError(nameInput, "Пожалуйста, введите ваше имя");
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, "Имя должно быть не менее 2 символов");
                isValid = false;
            }

            // Валидация Гостей
            if (guestsInput) {
                const guestsCount = parseInt(guestsInput.value);
                if (isNaN(guestsCount) || guestsCount < 1) {
                    showError(guestsInput, "Количество гостей минимум 1");
                    isValid = false;
                } else if (guestsCount > 10) {
                    showError(guestsInput, "Максимум 10 гостей");
                    isValid = false;
                }
            }

            if (!isValid) return;

            // Сбор данных
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Сохранение локально (эмуляция)
            try {
                const existing = JSON.parse(localStorage.getItem('yubiley_rsvps') || '[]');
                existing.push({ ...data, timestamp: new Date().toISOString() });
                localStorage.setItem('yubiley_rsvps', JSON.stringify(existing));
                console.log('✅ Данные валидны и сохранены:', data);
            } catch (e) {
                console.error('Ошибка сохранения в localStorage:', e);
            }

            closeModal();

            // Уведомление
            if(toast) {
                toast.classList.remove('hidden');
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

        function showError(inputElement, message) {
            if(!inputElement) return;

            inputElement.classList.add('input-error', 'border-red-400', 'ring-red-200');

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-xs mt-1 ml-1 font-medium animate-pulse';
            errorDiv.textContent = message;

            inputElement.parentElement.appendChild(errorDiv);

            // Плавный скролл к ошибке
            inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- 6. МУЗЫКА ---
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    const iconNote = document.getElementById('icon-note');
    const iconWave = document.getElementById('icon-wave');

    if (musicBtn && audio) {
        let isPlaying = false;
        audio.volume = 0.5;

        musicBtn.addEventListener('click', async () => {
            if (isPlaying) {
                audio.pause();
                if(iconNote) iconNote.classList.remove('hidden');
                if(iconWave) iconWave.classList.add('hidden');
                musicBtn.classList.remove('ring-[#d92121]', 'bg-red-50');
                musicBtn.classList.add('bg-white/90');
            } else {
                try {
                    await audio.play();
                    if(iconNote) iconNote.classList.add('hidden');
                    if(iconWave) iconWave.classList.remove('hidden');
                    musicBtn.classList.remove('bg-white/90');
                    musicBtn.classList.add('ring-[#d92121]', 'bg-red-50');
                } catch (error) {
                    console.warn("Автовоспроизведение заблокировано или файл не найден:", error);
                    // Можно добавить визуальное уведомление пользователю
                }
            }
            isPlaying = !isPlaying;
        });

        // Обработка конца воспроизведения или ошибок загрузки
        audio.addEventListener('error', () => {
            console.error("Ошибка загрузки аудиофайла. Проверьте путь assets/music.mp3");
            musicBtn.style.display = 'none'; // Скрыть кнопку если аудио нет
        });
    }
});
