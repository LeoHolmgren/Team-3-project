import Image, { StaticImageData } from 'next/image';

interface BannerProps {
  image: StaticImageData;
  label: string;
}

export default function Banner({ image, label }: BannerProps) {
  return (
    <div className="relative h-[300px] w-full max-w-[600px]">
      <Image src={image} alt={label} fill className="object-cover opacity-35" sizes="(max-width: 600px) 100vw, 600px" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="rounded bg-white/50 px-4 py-2 text-2xl font-semibold text-gray-700">{label}</h2>
      </div>
    </div>
  );
}
