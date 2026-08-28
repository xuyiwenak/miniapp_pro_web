import type { ImgHTMLAttributes } from 'react';

export type ArtworkImageName = 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8';

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  name: ArtworkImageName;
};

const ORIGINAL_EXTENSIONS: Record<ArtworkImageName, 'jpg' | 'png'> = {
  b1: 'jpg',
  b2: 'jpg',
  b3: 'png',
  b4: 'jpg',
  b5: 'jpg',
  b6: 'jpg',
  b7: 'jpg',
  b8: 'png',
};

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function ResponsiveImage({ name, alt = '', ...imageProps }: ResponsiveImageProps) {
  const optimizedBase = `${BASE_PATH}images/optimized/${name}`;
  const fallback = `${BASE_PATH}images/${name}.${ORIGINAL_EXTENSIONS[name]}`;
  return (
    <picture>
      <source srcSet={`${optimizedBase}.avif`} type="image/avif" />
      <source srcSet={`${optimizedBase}.webp`} type="image/webp" />
      <img {...imageProps} alt={alt} src={fallback} />
    </picture>
  );
}
