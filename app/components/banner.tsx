import Image, { StaticImageData } from 'next/image';

interface BannerProps {
  image: StaticImageData;
  label: string;
  text?: string;
}

export default function Banner({ image, label, text }: BannerProps) {
  console.log(image);
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

  return (
    <div className="relative h-full w-auto max-w-[100%]">
      <Image src={image} alt={label} className="h-full w-auto opacity-35" sizes="(max-width: 600px) 100vw, 600px" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-[1.5em] font-[600] text-[#5A5A5A] dark:text-[#a3a3a3]">{label}</h2>
      </div>
    </div>
  );
}
