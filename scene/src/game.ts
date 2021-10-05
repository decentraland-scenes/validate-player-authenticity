/// --- Set up a system ---

import { signedFetch } from '@decentraland/SignedFetch'
import * as ui from '@dcl/ui-scene-utils'

theFountainOfBrokenDreams.addComponent(
  new OnPointerDown(
    async () => {
      let response = await signedFetch('http://localhost:8080/check-validity')
      log(response)

      let json
      if (response.text) {
        json = await JSON.parse(response.text)
        log(json)
      }

      if (json && json.valid === true) {
        log('All good')
        forestMaidenStatue.getComponent(GLTFShape).visible = true
        grimReaperStatue.getComponent(GLTFShape).visible = false
        ui.displayAnnouncement('Your intentions are pure')
      } else {
        log('Not valid')
        forestMaidenStatue.getComponent(GLTFShape).visible = false
        grimReaperStatue.getComponent(GLTFShape).visible = true
        ui.displayAnnouncement(
          'Your dark schemes are not welcome here, be gone!'
        )
      }
    },
    {
      hoverText: 'Is your heart pure?',
    }
  )
)
