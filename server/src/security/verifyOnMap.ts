import { MARGIN_OF_ERROR } from './securityChecks'

// validate that the player is active in a catalyst server, and in the indicated coordinates, or within a margin of error
export async function checkPlayer(
  playerId: string,
  server: string,
  parcel: number[]
) {
  const url = 'https://' + server + '/comms/peers/'
  // const url = `https://peer.decentraland.org/comms/peers`
  console.log('URL being used: ', url)

  try {
    const response = await fetch(url)
    const data = await response.json()

    for (const player of data) {
      if (player.address.toLowerCase() === playerId.toLowerCase()) {
        console.log('found player')

        if (checkCoords(player.parcel, parcel)) {
          return player.parcel
        }
      }
    }
  } catch (error) {
    console.log(error)
    return false
  }

  return false
}

// check coordinates against a single parcel - within a margin of error
export function checkCoords(coords: number[], parcel: number[]) {
  if (parcel[0] === coords[0] && parcel[1] === coords[1]) {
    return true
  }

  if (
    Math.abs(parcel[0] - coords[0]) <= MARGIN_OF_ERROR &&
    Math.abs(parcel[1] - coords[1]) <= MARGIN_OF_ERROR
  ) {
    return true
  } else {
    console.log('player in other parcels ', coords, ' should be ', parcel)
    return false
  }
}

// check coordinates against a list of valid parcels - within a margin of error
export function checkArea(coords: number[], parcels: number[][]) {
  let match = false
  for (let i = 0; i < 0; i++) {
    if (checkCoords(coords, parcels[i])) {
      match = true
    }
  }
  return match
}
