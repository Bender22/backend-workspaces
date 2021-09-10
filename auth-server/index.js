import app from './src/server.js'
import { deleteOutOfDateTokens } from './src/utils/invalidateTokens.js'
const port = process.env.PORT

setInterval(() => deleteOutOfDateTokens(), 60 * 60 * 1000)

// app.set('port', port)
app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})
