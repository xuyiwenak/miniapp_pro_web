import { ArrowRight, Eye, FolderHeart, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Locale } from '../i18n/copy';
import { HOME_COPY } from '../i18n/homeCopy';
import { ResponsiveImage, type ArtworkImageName } from './ResponsiveImage';

export function KeywordRail({ locale }: { locale: Locale }) {
  const words = [...HOME_COPY[locale].keywords, ...HOME_COPY[locale].keywords];
  return (
    <div className="keyword-rail" aria-label={HOME_COPY[locale].keywords.join(', ')}>
      <div className="keyword-rail__track" aria-hidden="true">
        {words.map((word, index) => <span key={`${word}-${index}`}>{word}<i>·</i></span>)}
      </div>
    </div>
  );
}

export function PhilosophySection({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];
  return (
    <section className="philosophy section-shell" id="philosophy">
      <ResponsiveImage className="philosophy__botanical" name="b3" alt="" aria-hidden="true" />
      <p className="eyebrow">{copy.philosophyLabel}</p>
      <h2>{copy.philosophyTitle}</h2>
      <div className="philosophy__rule"><span /> <p>{copy.philosophyBody}</p></div>
      <div className="freedom-story">
        <figure>
          <ResponsiveImage name="b2" loading="lazy"
            alt={locale === 'zh-CN' ? '孩子自由地用蜡笔作画' : 'A child drawing freely with crayons'} />
        </figure>
        <div className="freedom-story__copy">
          <p className="eyebrow eyebrow--rose">{copy.freedomLabel}</p>
          <h3>{copy.freedomTitle}</h3>
          <p>{copy.freedomBody}</p>
          <a className="text-link" href="#therapy">{copy.learnMore}<ArrowRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

export function JourneySection({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];
  return (
    <section className="journey section-shell" id="journey">
      <div className="journey__heading"><p className="eyebrow">{copy.journeyLabel}</p><h2>{copy.journeyTitle}</h2></div>
      <div className="journey__flow" aria-label={copy.journeyTitle}>
        {copy.journeySteps.map((step, index) => (
          <div className={`journey-step journey-step--${index + 1}`} key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>
          </div>
        ))}
        <figure className="journey__animals"><ResponsiveImage name="b4" loading="lazy"
          alt={locale === 'zh-CN' ? '色彩丰富的动物绘画' : 'A colourful drawing of animals'} /></figure>
        <figure className="journey__maker">
          <ResponsiveImage name="b8" loading="lazy"
            alt={locale === 'zh-CN'
              ? '正在使用彩色铅笔创作的人'
              : 'A person creating with coloured pencils'} />
        </figure>
      </div>
      <div className="journey__action">
        <Link className="primary-cta" to="/login">{copy.primaryAction}<ArrowRight size={18} /></Link>
        <span><LockKeyhole size={15} />{copy.privateCue}</span>
      </div>
    </section>
  );
}

export function TherapySection({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];
  return (
    <section className="therapy" id="therapy">
      <div className="therapy__art">
        <ResponsiveImage className="therapy__flowers" name="b7" loading="lazy" alt="" aria-hidden="true" />
        <figure><ResponsiveImage name="b6" loading="lazy"
          alt={locale === 'zh-CN' ? '蓝色背景上的手绘风车' : 'Hand-drawn wind turbines on blue'} /></figure>
      </div>
      <div className="therapy__copy">
        <p className="eyebrow eyebrow--teal">{copy.therapyLabel}</p><h2>{copy.therapyTitle}</h2>
        <p>{copy.therapyBody}</p><p className="therapy__disclaimer">{copy.disclaimer}</p>
        <a className="text-link text-link--light" href="#journey">{copy.learnMore}<ArrowRight size={17} /></a>
      </div>
    </section>
  );
}

const GALLERY_IMAGES: ArtworkImageName[] = ['b2', 'b4', 'b5', 'b6'];

export function GallerySection({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];
  return (
    <section className="gallery section-shell" id="gallery">
      <p className="eyebrow">{copy.galleryLabel}</p><h2>{copy.galleryTitle}</h2>
      <div className="gallery__grid">
        {GALLERY_IMAGES.map((image, index) => (
          <figure key={image} className={`gallery__item gallery__item--${index + 1}`}>
            <ResponsiveImage name={image} loading="lazy" alt={copy.galleryCaptions[index]} />
            <figcaption>{copy.galleryCaptions[index]}</figcaption>
          </figure>
        ))}
        <aside><span>06 / 08</span><p>{copy.galleryNote}</p></aside>
      </div>
    </section>
  );
}

const PRIVACY_ICONS = [Eye, FolderHeart, ShieldCheck];

export function PrivacySection({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];
  return (
    <section className="privacy">
      <div className="privacy__copy">
        <p className="eyebrow eyebrow--teal">{copy.privacyLabel}</p><h2>{copy.privacyTitle}</h2>
        <p className="privacy__body">{copy.privacyBody}</p>
        <div className="privacy__points">
          {copy.privacyPoints.map((point, index) => {
            const Icon = PRIVACY_ICONS[index];
            return <div key={point}><Icon size={24} /><span>{point}</span></div>;
          })}
        </div>
      </div>
      <figure className="privacy__image">
        <ResponsiveImage name="b1" loading="lazy"
          alt={locale === 'zh-CN' ? '彩色铅笔的细节' : 'Close detail of coloured pencils'} />
        <figcaption>{copy.privacyQuote}</figcaption>
      </figure>
    </section>
  );
}
