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
  const [userInteracted, setUserInteracted] = useState(false);
  const videoRef = useRef(null);

  // Detecta la primera interacción del usuario (toque, scroll o click)
  useEffect(() => {
    const enableVideo = () => setUserInteracted(true);
    window.addEventListener('touchstart', enableVideo, { once: true });
    window.addEventListener('click', enableVideo, { once: true });
    window.addEventListener('scroll', enableVideo, { once: true });

    return () => {
      window.removeEventListener('touchstart', enableVideo);
      window.removeEventListener('click', enableVideo);
      window.removeEventListener('scroll', enableVideo);
    };
  }, []);

  // La imagen avanza sola tras 5s
  useEffect(() => {
    if (slides[current].type !== 'image') return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  // Cuando el slide de video está activo, intenta reproducirlo
  useEffect(() => {
    if (slides[current].type !== 'video' || !videoRef.current) return;

    videoRef.current.muted = true;
    videoRef.current.defaultMuted = true;

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado: el video espera la interacción del usuario.
        // No saltamos de vuelta a la imagen; se queda listo para reproducir.
      });
    }
  }, [current, userInteracted]);

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
                      poster="/tigre.jpg"
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