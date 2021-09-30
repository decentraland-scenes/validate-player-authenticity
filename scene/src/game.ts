/// --- Set up a system ---

import { signedFetch } from '@decentraland/SignedFetch'

const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
})
_scene.addComponent(transform)

const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape = new GLTFShape(
  '7a5f2afc-ae67-4fe8-a3a1-0ef5b4ffdcd6/FloorFantasyRocks_03/FloorFantasyRocks_03.glb'
)
gltfShape.withCollisions = true
gltfShape.isPointerBlocker = true
gltfShape.visible = true
entity.addComponent(gltfShape)
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
})
entity.addComponent(transform2)

const swampVineTreeLamp = new Entity('swampVineTreeLamp')
engine.addEntity(swampVineTreeLamp)
swampVineTreeLamp.setParent(_scene)
swampVineTreeLamp.addComponent(
  new Transform({
    position: new Vector3(2.5, 0, 12.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  })
)
swampVineTreeLamp.addComponent(
  new GLTFShape(
    'ded6354e-70df-405b-9ccd-3a865e78d350/Tree_Lamp_01/Tree_Lamp_01.glb'
  )
)

const curlyMagicBeanSprout = new Entity('curlyMagicBeanSprout')
engine.addEntity(curlyMagicBeanSprout)
curlyMagicBeanSprout.setParent(_scene)

curlyMagicBeanSprout.addComponent(
  new Transform({
    position: new Vector3(2.5, 0, 2),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  })
)
curlyMagicBeanSprout.addComponent(
  new GLTFShape(
    '530c1d6f-25db-41dc-adad-887a5436c84e/Vegetation_05/Vegetation_05.glb'
  )
)

const theFountainOfBrokenDreams = new Entity('theFountainOfBrokenDreams')
engine.addEntity(theFountainOfBrokenDreams)
theFountainOfBrokenDreams.setParent(_scene)

theFountainOfBrokenDreams.addComponent(
  new Transform({
    position: new Vector3(8, 0, 7.5),
    rotation: new Quaternion(
      8.860399791456633e-16,
      0.7071068286895752,
      -8.429368847373553e-8,
      0.7071067690849304
    ),
    scale: new Vector3(1, 1, 1),
  })
)
theFountainOfBrokenDreams.addComponent(
  new GLTFShape(
    '9a320bf3-e09f-48d7-a1a5-a8052535d1f2/Fountain_02/Fountain_02.glb'
  )
)

const grimReaperStatue = new Entity('grimReaperStatue')
engine.addEntity(grimReaperStatue)
grimReaperStatue.setParent(_scene)
grimReaperStatue.addComponent(
  new Transform({
    position: new Vector3(11.5, 0, 4.5),
    rotation: new Quaternion(
      -6.607980366029839e-16,
      -0.2902846336364746,
      3.460462139059928e-8,
      0.9569403529167175
    ),
    scale: new Vector3(1, 1, 1),
  })
)

grimReaperStatue.addComponent(
  new GLTFShape('88536537-c354-498c-8091-cefc6a586522/Statue_01/Statue_01.glb')
)

const forestMaidenStatue = new Entity('forestMaidenStatue')
engine.addEntity(forestMaidenStatue)
forestMaidenStatue.setParent(_scene)

forestMaidenStatue.addComponent(
  new Transform({
    position: new Vector3(11.5, 0, 11.5),
    rotation: new Quaternion(
      7.395715713020418e-16,
      0.9238795638084412,
      -1.1013501222123523e-7,
      -0.38268348574638367
    ),
    scale: new Vector3(1.0000019073486328, 1, 1.0000019073486328),
  })
)

forestMaidenStatue.addComponent(
  new GLTFShape(
    '8e9fc52d-f3df-41be-aedd-287907fa9b90/GirlForestStatue_01/GirlForestStatue_01.glb'
  )
)

/// ----add behavior ---

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
