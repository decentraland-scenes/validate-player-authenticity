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
const gltfShape = new GLTFShape('models/FloorFantasyRocks_03.glb')
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
swampVineTreeLamp.addComponent(new GLTFShape('models/Tree_Lamp_01.glb'))

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
curlyMagicBeanSprout.addComponent(new GLTFShape('models/Vegetation_05.glb'))

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
theFountainOfBrokenDreams.addComponent(new GLTFShape('models/Fountain_02.glb'))

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
    scale: new Vector3(2, 2, 2),
  })
)

grimReaperStatue.addComponent(new GLTFShape('models/Statue_01.glb'))

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
    scale: new Vector3(1.5, 1.5, 1.5),
  })
)

forestMaidenStatue.addComponent(new GLTFShape('models/GirlForestStatue_01.glb'))

forestMaidenStatue.getComponent(GLTFShape).visible = false
grimReaperStatue.getComponent(GLTFShape).visible = false
