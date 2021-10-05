/// --- Set up a system ---

import { signedFetch } from '@decentraland/SignedFetch'

theFountainOfBrokenDreams.addComponent(
  new OnPointerDown(
    async () => {
      let response = await signedFetch('http://localhost:8080/check-legit')
      log(response)

      let json
      if (response.text) {
        json = await JSON.parse(response.text)
        log(json)
      }

      if (json && json.legit === true) {
        log('ALL GOOD')
        engine.removeEntity(grimReaperStatue)
      } else {
        log('YOUR INTENTIONS ARE NOT PURE')
        engine.removeEntity(forestMaidenStatue)
      }
    },
    {
      hoverText: 'Are you pure?',
    }
  )
)
