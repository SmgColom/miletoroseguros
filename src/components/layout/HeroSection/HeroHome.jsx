import { useState, useEffect, useRef } from 'react';
import styles from './HeroHome.module.scss';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

const slides = [
  { type: 'image', src: '/tigre.jpg', alt: 'Imagen tigre Suramericana' },
  { type: 'video', src: '/hero-video-opt.mp4' },
];

function HeroSplitSection({ title, description }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (slides[current].type !== 'image') return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  // Fuerza el play del video en móviles cuando entra en pantalla
  useEffect(() => {
    if (slides[current].type !== 'video') return;

    if (videoRef.current) {
      // Fuerza el mute a nivel DOM (Chrome iOS lo exige para el autoplay)
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el navegador bloquea el autoplay, avanzamos al siguiente slide
          // para no quedar en pantalla negra.
          setCurrent((prev) => (prev + 1) % slides.length);
        });
      }
    }

    // Respaldo: si en 10s el video no terminó (no cargó o no reprodujo), avanza igual
    const fallback = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearTimeout(fallback);
  }, [current]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <>
      <section className={styles.heroSplit}>
        <div className={styles.textContent}>
          <h1><span>{title}</span></h1>
          <p>{description}</p>
        </div>

        <div className={styles.imageSide}>
          <div className={styles.carousel}>
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`${styles.slide} ${i === current ? styles.active : ''}`}
              >
                {slide.type === 'image' ? (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className={styles.media}
                  />
                ) : (
                  i === current && (
                    <video
                      ref={videoRef}
                      className={styles.media}
                      src={slide.src}
                      autoPlay
                      muted
                      loop={false}
                      playsInline
                      preload="auto"
                      onEnded={next}
                    />
                  )
                )}
              </div>
            ))}

            <div className={styles.dots}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.button}>
        <Button onClick={() => router.push('/contact')}>
          Conversemos
        </Button>
      </div>
    </>
  );
}

export default HeroSplitSection;