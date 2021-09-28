/// --- Set up a system ---

import { signedFetch } from '@decentraland/SignedFetch'

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8)

cube.addComponent(
  new OnClick(async () => {
    let response = await signedFetch(
      'http://localhost:5001/dcl-door/us-central1/app/check-legit'
    )

    let json = await response.json()
    log(json)
    if (json.legit) {
      log('ALL GOOD')
    } else {
      ;('YOU ARE A HACKER AND WE CAUGHT YOU')
    }
  })
)
