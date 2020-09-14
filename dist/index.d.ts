/**
 * @module react-oauth2-hook
 */
/**
 *
 */
import * as React from 'react';
/**
 * useOAuth2Token is a React hook providing an OAuth2 implicit grant token.
 *
 * When useToken is called, it will attempt to retrieve an existing
 * token by the criteria of `{ authorizeUrl, scopes, clientID }`.
 * If a token by these specifications does not exist, the first
 * item in the returned array will be `undefined`.
 *
 * If the user wishes to retrieve a new token, they can call `getToken()`,
 * a function returned by the second parameter. When called, the function
 * will open a window for the user to confirm the OAuth grant, and
 * pass it back as expected via the hook.
 *
 * The OAuth token must be passed to a static endpoint. As
 * such, the `callbackUrl` must be passed with this endpoint.
 * The `callbackUrl` should render the [[OAuthCallback]] component,
 * which will securely verify the token and pass it back,
 * before closing the window.
 *
 * All instances of this hook requesting the same token and scopes
 * from the same place are synchronised. In concrete terms,
 * if you have many components waiting for a Facebook OAuth token
 * to make a call, they will all immediately update when any component
 * gets a token.
 *
 * Finally, in advanced cases the user can manually overwrite any
 * stored token by capturing and calling the third item in
 * the reponse array with the new value.
 *
 * @param authorizeUrl The OAuth authorize URL to retrieve the token from.
 * @param scope The OAuth scopes to request.
 * @param redirectUri The OAuth redirect_uri callback URL.
 * @param clientID The OAuth client_id corresponding to the requesting client.
 * @example
 *const SpotifyTracks = () => {
 * const [token, getToken] = useOAuth2Token({
 *     authorizeUrl: "https://accounts.spotify.com/authorize",
 *     scope: ["user-library-read"],
 *     clientID: "abcdefg",
 *     redirectUri: document.location.origin + "/callback"
 * })
 *
 * const [response, setResponse] = React.useState()
 * const [error, setError] = React.useState()
 *
 * // when we get a token, query spotify
 * React.useEffect(() => {
 *     if (token == undefined) {return}
 *     fetch('https://api.spotify.com/v1/me/tracks', {
 *         headers: {
 *             Authorization: `Bearer ${token}`
 *         }
 *     }).then(
 *         json => response.json()
 *     ).then(
 *         data => setResponse(data)
 *     ).catch(
 *         error => setError(error)
 *     )
 * }, [token])
 *
 * if (!token || error) return <div onClick={getToken}> login with Spotify </div>
 *
 *return <div>
 * Your saved tracks on Spotify: {JSON.stringify(response)}
 *</div>
 *}
 */
export declare const useOAuth2Token: ({ authorizeUrl, scope, redirectUri, clientID }: {
    authorizeUrl: string;
    scope: string[];
    redirectUri: string;
    clientID: string;
}) => [string | undefined, getToken, setToken];
/**
 * OAuthToken represents an OAuth2 implicit grant token.
 */
export declare type OAuthToken = string;
/**
 * getToken is returned by [[useOAuth2Token]].
 * When called, it prompts the user to authorize.
 */
export declare type getToken = () => void;
/**
 * setToken is returned by [[useOAuth2Token]].
 * When called, it overwrites any stored OAuth token.
 * `setToken(undefined)` can be used to synchronously
 * invalidate all instances of this OAuth token.
 */
export declare type setToken = (newValue: OAuthToken | undefined) => void;
/**
 * This error is thrown by the [[OAuthCallback]]
 * when the state token recieved is incorrect or does not exist.
 */
export declare const ErrIncorrectStateToken: Error;
/**
 * This error is thrown by the [[OAuthCallback]]
 * if no access_token is recieved.
 */
export declare const ErrNoAccessToken: Error;
/**
 * OAuthCallback is a React component that handles the callback
 * step of the OAuth2 protocol.
 *
 * OAuth2Callback is expected to be rendered on the url corresponding
 * to your redirect_uri.
 *
 * By default, this component will deal with errors by closing the window,
 * via its own React error boundary. Pass `{ errorBoundary: false }`
 * to handle this functionality yourself.
 *
 * @example
 * <Route exact path="/callback" component={OAuthCallback} />} />
 */
export declare const OAuthCallback: React.FunctionComponent<{
    errorBoundary?: boolean;
}>;
declare const _default: "this module has no default export.";
export default _default;
