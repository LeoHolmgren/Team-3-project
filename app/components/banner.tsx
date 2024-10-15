import Image, { StaticImageData } from 'next/image';

interface BannerProps {
  image: StaticImageData;
  label: string;
}

export default function Banner({ image, label }: BannerProps) {
  return (
    <div className="relative h-[23.5em] max-w-[600px]">
      <Image
        src={image}
        alt={label}
        className="h-full w-auto max-w-[100%] opacity-35"
        sizes="(max-width: 600px) 100vw, 600px"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-[1.5em] font-[600] text-[#5A5A5A] dark:text-[#a3a3a3]">{label}</h2>
      </div>
    </div>
  );
}
