export default function ComicImage({ imageInfo }) {
  return (
    <div>
      <img src={imageInfo.src} alt={imageInfo.alt} />
    </div>
  );
}
