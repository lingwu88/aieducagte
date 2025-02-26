const api_key =  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLog6HluIzlgaUiLCJVc2VyTmFtZSI6IuiDoeW4jOWBpSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxODkyOTA2OTc5NDE2ODcxNDk0IiwiUGhvbmUiOiIxMzkyOTIwMjI0MyIsIkdyb3VwSUQiOiIxODkyOTA2OTc5NDA4NDgyODg2IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMDItMjMgMTY6NTI6MTAiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.lMYuUBtTWHZpL9oWVBQg1bPRUIK_in6xFGshqLdbexAJICFO8qQplZFlLeWjn0fKNCU2_4lwZu1PS0UXAJ9y3nlPscB-X7nYpr55GZ6pnj_7nhOPU8NlG0n8paNpCco0xqZ5yLqHOnnRBUhfZF3WRM0vxQuVckNatx0NVkusLSTYp2iDO6Q6EAQEZzUgI8tlrCuag1XKrXpS4jDZ76_WNkC0GFTQuSB50uDus-fm-gK1p9uuye7QWLQVTBxV1Yt8eNP5K9Y9faRwfjPpSg8Me_HUhUfeUZxvypSv5SODHcGe9q7TiE0TuSkvuqNLMCGxwBJw_O0GuMHbMWSDAXRVhA"
const group_id = "1892906979408482886"

function wordToVoice(text){
  const requestBody = {
    "model": "speech-01-hd",
    text,
    "timber_weights": [
      {
        "voice_id": "male-qn-qingse",
        "weight": 100
      }
    ],
    "voice_setting": {
      "voice_id": "",
      "speed": 1,
      "pitch": 0,
      "vol": 1,
      "latex_read": false
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3"
    },
    "language_boost": "auto"

    
  }

  const contentType = "application/json"

  const token = `Bearer${api_key}`

// fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId={group_id}`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer {api_key}`,
//   },
//   body: JSON.stringify(requestBody)
}