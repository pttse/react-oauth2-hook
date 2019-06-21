> ## [react-oauth2-hook](README.md)

[Globals]() / [react-oauth2-hook](globals.md) /

# External module: react-oauth2-hook

> Retrieve OAuth2 implicit grant tokens purely on the client without destroying application state.

**`requires`** prop-types

**`requires`** react

**`requires`** react-dom

**`summary`** Retrieve OAuth2 implicit grant tokens purely on the client without destroying application state.

**`version`** 1.0.3

**`author`** zemnmez

**`copyright`** zemnmez 2019

**`license`** MIT
## Installation

```bash
yarn add react-oauth2-hook
```
## Overview
This package provides an entirely client-side flow to get OAuth2 implicit grant tokens.
It's implemented as a react hook, [useOAuth2Token](globals.md#const-useoauth2token), with a fairly simple API
and a react component, [OAuthCallback](globals.md#const-oauthcallback) which should be mounted at the
OAuth callback endpoint.

Take a look at the [Example](#Example) for usage information.

## Security Considerations
OAuth 2 is a very sensitive protocol. I've done my best to provide good security
guarantees with this package.

I assume that your application follows reasonable best practices like using `X-Frame-Options`
to prevent clickjacking based attacks.

### State
The State token prevents an attacker from forcing a user to sign in as the attacker's
account using a kind of CSRF. Here, I am cautious against multiple types of attacks.

My state token is not signed, it's a completely static concatenation of some entropy
generated by webcrypto and a key, composed of `JSON.stringify({ authUrl, clientID, scopes })`.
When the callback is recieved by [OAuthCallback](globals.md#const-oauthcallback), it is compared strictly
to the stored value, and otherwise rejected.

This prevents both attacks where an attacker would try to submit a token to the user's
browser without their consent, and attacks where a malicious OAuth server would
(re)use the n-once to authenticate a callback from a different server.

### Timing attacks

The state token is *not* compared using a fixed-time string comparison.
Where typically, this would lead to an attacker being able to use a lot of time
and statistics to side-channel out the state token, this
should be irrelevant in this configuration, this should be extremely difficult
to pull off accurately as any timing information would be inaccessible or heavily
diluted.

## Refresh tokens
This library in-and-of-itself does not acquire long lived refresh tokens. Though
some OAuth servers allow implicit clients to acquire refresh tokens without an
OAuth secret, this isn't part of the OAuth standard. Instead, consider
simply triggering the authorize flow when the token expires -- if the user
is still authorized, the window should almost immediately close. Otherwise,
you can use any special APIs that would let you do this, or skip this library
entirely and try PKCE.
## Example

**`example`** 

```javascript
import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { useOAuth2Token, OAuthCallback } from 'react-oauth2-hook'

// in this example, we get a Spotify OAuth
// token and use it to show a user's saved
// tracks.

export default () => <Router>
<Switch>
<Route path="/callback" component={OAuthCallback}/>
<Route component={SavedTracks}/>
</Switch>
</Router>

const SavedTracks = () => {
const [token, getToken] = useOAuth2Token({
authorizeUrl: "https://accounts.spotify.com/authorize",
scope: ["user-library-read"],
clientID: "bd9844d654f242f782509461bdba068c",
redirectUri: document.location.href+"/callback"
})

const [tracks, setTracks] = React.useState();
const [error, setError] = React.useState();

// query spotify when we get a token
React.useEffect(() => {
fetch(
'https://api.spotify.com/v1/me/tracks?limit=50'
).then(response => response.json()).then(
data => setTracks(data)
).catch(error => setError(error))
}, [token])

return <div>
{error && `Error occurred: ${error}`}
{(!token || !savedTracks) && <div
onClick={getToken}>
login with Spotify
</div>}
{savedTracks && `
Your Saved Tracks: ${JSON.stringify(savedTracks)}
`}
</div>
}
```

### Index

#### Variables

* [ErrIncorrectStateToken](globals.md#const-errincorrectstatetoken)
* [ErrNoAccessToken](globals.md#const-errnoaccesstoken)

#### Functions

* [OAuthCallback](globals.md#const-oauthcallback)
* [useOAuth2Token](globals.md#const-useoauth2token)

## Variables

### `Const` ErrIncorrectStateToken

● **ErrIncorrectStateToken**: *`Error`* =  new Error('incorrect state token')

*Defined in [index.tsx:187](https://github.com/Zemnmez/react-oauth2-hook/blob/6ed3dac/src/index.tsx#L187)*

This error is thrown by the [OAuthCallback](globals.md#const-oauthcallback)
when the state token recieved is incorrect or does not exist.

___

### `Const` ErrNoAccessToken

● **ErrNoAccessToken**: *`Error`* =  new Error('no access_token')

*Defined in [index.tsx:193](https://github.com/Zemnmez/react-oauth2-hook/blob/6ed3dac/src/index.tsx#L193)*

This error is thrown by the [OAuthCallback](globals.md#const-oauthcallback)
if no access_token is recieved.

___

## Functions

### `Const` OAuthCallback

▸ **OAuthCallback**(`__namedParameters`: object): *`Element`*

*Defined in [index.tsx:255](https://github.com/Zemnmez/react-oauth2-hook/blob/6ed3dac/src/index.tsx#L255)*

OAuthCallback is a React component that handles the callback
step of the OAuth2 protocol.

OAuth2Callback is expected to be rendered on the url corresponding
to your redirect_uri.

By default, this component will deal with errors by closing the window,
via its own React error boundary. Pass `{ errorBoundary: false }`
to handle this functionality yourself.

**Parameters:**

■` __namedParameters`: *object*

Name | Type | Default |
------ | ------ | ------ |
`errorBoundary` | boolean | true |

**Returns:** *`Element`*

___

### `Const` useOAuth2Token

▸ **useOAuth2Token**(`__namedParameters`: object): *string | function[]*

*Defined in [index.tsx:95](https://github.com/Zemnmez/react-oauth2-hook/blob/6ed3dac/src/index.tsx#L95)*

useOAuth2Token is a React hook providing an OAuth2 implicit grant token.

When useToken is called, it will attempt to retrieve an existing
token by the criteria of `{ authorizeUrl, scopes, clientID }`.
If a token by these specifications does not exist, the first
item in the returned array will be `undefined`.

If the user wishes to retrieve a new token, they can call `getToken()`,
a function returned by the second parameter. When called, the function
will open a window for the user to confirm the OAuth grant, and
pass it back as expected via the hook.

The OAuth token must be passed to a static endpoint. As
such, the `callbackUrl` must be passed with this endpoint.
The `callbackUrl` should render the `Callback` component,
which will securely verify the token and pass it back,
before closing the window.

All instances of this hook requesting the same token and scopes
from the same place are synchronised. In concrete terms,
if you have many components waiting for a Facebook OAuth token
to make a call, they will all immediately update when any component
gets a token.

Finally, in advanced cases the user can manually overwrite any
stored token by capturing and calling the third item in
the reponse array with the new value.

**Parameters:**

■` __namedParameters`: *object*

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`authorizeUrl` | string | - | The OAuth authorize URL to retrieve the token from. |
`clientID` | string | - | The OAuth `client_id` corresponding to the requesting client. |
`redirectUri` | string | - | The OAuth `redirect_uri` callback. |
`scope` | string[] |  [] | The OAuth scopes to request. |

**Returns:** *string | function[]*

___