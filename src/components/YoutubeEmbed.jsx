export default function YoutubeEmbed({ videoId }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden aspect-video border border-white/10">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
