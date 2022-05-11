import { createApp, createRouter } from 'h3'

const app = createApp()
const router = createRouter()

app.use(router)

router.get('/', (req, res) => {
  return 'Hello World'
})

router.post('/demo', (req, res) => {
  res.end('my example')
})

export default app