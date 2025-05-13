export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    // Going back to the standard Bearer token format with additional checks
    // Make sure the token is a string and trim any whitespace
    const token = String(user.accessToken).trim();

    // Return both headers with the properly formatted token
    return { 
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
  } else {
    return {};
  }
}
