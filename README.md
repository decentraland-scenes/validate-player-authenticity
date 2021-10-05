# Validate Player Authenticity

This is a simple scene + REST server that implements a few security checks to ensure that the requests that arrive to the server are legitimate.

This example shows you:

On the scene:

- Send requests with `signedFetch`, to include headers with an ephemeral key signature in the request.

On the server:

- Check that the origin of the request, to ensure it's from a Decentraland domain
- Filter out malicious IPs that were manually identified
- Check that the headers included in the `signedFetch` are properly signed, ensuring also that the timestamp in the signature is also recent and that the ephemeral key corresponds to the player's address.
- Query the catalyst server that the player claims to be in, and ensure that the player is truly there.
- Check that the player's location when sending the request is at a specific parcel, or within a margin or error of that.

These checks together ensure that a request needs to come from inside decentraland, from a player in a deployed scene within the specified coordinates.

Through all of these checks, you can make it very hard for anyone who might want to take advantage of your scene. These security measures are especially valuable in scenes that give away tokens, or where there's some kind of monetary incentive for cheating.

### About the ephemeral key

When players log into decentraland, they sign a message using Metamask or their preferred web3 client. This signature is used to generate an ephemeral wallet that exists during that session, this address can be traced back to the player's original address. The advantage is that it can be used by the Decentraland explorer to sign messages behind the curtains, without requesting that the player manually signs every request.

When you use the `signedFetch()` function in a scene, you're sending additional metadata in the request's headers, that includes a signed message encrypted with the ephemeral key. This signed message includes a timestamp, the player's position on the map, the player's actual address, and the contents of the request itself.

## Branches

The `main` branch of this project delegates the validation of the message signature to an endpoint of a catalyst server.

The `localcheck` branch of this same repository performs the signature validation locally. It only connects to the catalyst server to check that the player is connected and near the reported position.

## Try it out

**Install the CLI**

Download and install the Decentraland CLI by running the following command:

```bash
npm i -g decentraland
```

**Previewing the scene**

Download this example and navigate to the `scene` directory, then run:

```
$:  dcl start
```

Any dependencies are installed and then the CLI opens the scene in a new browser tab.

**Run the server**

To run the server locally, on a separate command line window, navigate to the `server` directory and run the following command to install all the dependencies:

```
npm i
```

Once the dependencies are installed, run the following command to start the server:

```
npm run start
```

The server will then be listening on `localhost:8080`, the scene is already sending requests to this address.

```

socket = new WebSocket(
    'wss://localhost:8080/broadcast/' + realm.displayName
  )
```

**Scene Usage**

First run the server, then run the scene.

In the scene, simply click on the fountain, and it will send a request to the server.

The scene will tell you if you passed the validations or not.

Since you're running the scene locally on localhost, the validations that relate to the request's origin and on querying the catalyst servers are turned off. Turn them on with the `TESTS_ENABLED` flag, on `securityChecks.ts` in the server folder. Notice that once that's enabled your requests from localhost will no longer pass the validations.

By copying the `security` folder in `server`, you can use the same set of security validations on any request that was originated with `signedFetch()` in a Decentraland scene.

Simply run:

```ts
await runChecks(req)
```

Or add a set of coordinates to also validate the request's origin on the map:

```ts
await runChecks(req, VALID_PARCEL)
```

> NOTE: You can change the `MARGIN_OF_ERROR` property on `securityChecks.ts` to make the location check more or less permissive. A margin or error of 2 will allow locations at + - 2 parcels of distance on either axis from the indicated location.

Enable tests!!!!!!

Learn more about how to build your own scenes in our [documentation](https://docs.decentraland.org/) site.

If something doesn’t work, please [file an issue](https://github.com/decentraland-scenes/Awesome-Repository/issues/new).

## Copyright info

This scene is protected with a standard Apache 2 licence. See the terms and conditions in the [LICENSE](/LICENSE) file.
