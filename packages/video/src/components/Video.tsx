export interface VideoProps {
  src: string;
  className?: string;
  width: number;
  height: number;
}

export const Video = ({ src, width, height, className }: VideoProps) => {
  return (
    <video
      width={width}
      height={height}
      src={src}
      className={`h-full w-full object-cover ${className}`}
      controls
    ></video>
  );
};
