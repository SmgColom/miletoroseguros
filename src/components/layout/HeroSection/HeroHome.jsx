import { useState, useEffect } from 'react';
import styles from './HeroHome.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

const slides = [
  { type: 'image', src: '/tigre.jpg', alt: 'Imagen tigre Suramericana' },
  { type: 'video', src: '/hero-video.mp4' },
];

function HeroSplitSection({ title, description }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides[current].type !== 'image') return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
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
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={500}
                    height={300}
                    className={styles.media}
                  />
                ) : (
                  i === current && (
                    <video
                      className={styles.media}
                      src={slide.src}
                      autoPlay
                      muted
                      playsInline
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