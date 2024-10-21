import Image, { StaticImageData } from 'next/image';

interface BannerProps {
  image: StaticImageData;
  label: string;
  text?: string;
}

export default function Banner({ image, label, text }: BannerProps) {
  return (
    <>
      <div
        className="relative aspect-[1.77777] h-[30vh] max-w-[100%] opacity-35"
        style={{
          backgroundImage: `url('${image.src}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <h2 className="text-[1.5em] font-[600] text-[hsl(var(--text))]">{label}</h2>
      {text ? <p className="text-center">{text}</p> : null}
    </>
  );
}
