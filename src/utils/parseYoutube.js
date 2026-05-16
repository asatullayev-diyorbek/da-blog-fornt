const youtubeRegex = /\[youtube\](.*?)\[\/youtube\]/g

export function parseYoutubeEmbeds(content) {
  return content.replace(youtubeRegex, (_, videoId) => {
    return `<div class="yt-embed" data-id="${videoId.trim()}"></div>`
  })
}
