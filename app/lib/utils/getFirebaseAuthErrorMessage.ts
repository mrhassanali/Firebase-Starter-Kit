export function getFirebaseAuthErrorMessage(errorCode: string) {
    switch (errorCode) {
      case 'auth/claims-too-large':
        return 'Claims payload too large.';
      case 'auth/email-already-in-use':
        return 'Email already in use.';
      case 'auth/id-token-expired':
        return 'ID token expired.';
      case 'auth/id-token-revoked':
        return 'ID token revoked.';
      case 'auth/insufficient-permission':
        return 'Insufficient permission.';
      case 'auth/internal-error':
        return 'Internal error.';
      case 'auth/invalid-argument':
        return 'Invalid argument.';
      case 'auth/invalid-claims':
        return 'Invalid custom claims.';
      case 'auth/invalid-continue-uri':
        return 'Invalid continue URL.';
      case 'auth/invalid-creation-time':
        return 'Invalid creation time.';
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/invalid-disabled-field':
        return 'Invalid disabled field.';
      case 'auth/invalid-display-name':
        return 'Invalid display name.';
      case 'auth/invalid-dynamic-link-domain':
        return 'Invalid dynamic link domain.';
      case 'auth/invalid-email':
        return 'Invalid email.';
      case 'auth/invalid-email-verified':
        return 'Invalid email verification status.';
      case 'auth/invalid-hash-algorithm':
        return 'Invalid hash algorithm.';
      case 'auth/invalid-hash-block-size':
        return 'Invalid hash block size.';
      case 'auth/invalid-hash-derived-key-length':
        return 'Invalid hash derived key length.';
      case 'auth/invalid-hash-key':
        return 'Invalid hash key.';
      case 'auth/invalid-hash-memory-cost':
        return 'Invalid hash memory cost.';
      case 'auth/invalid-hash-parallelization':
        return 'Invalid hash parallelization.';
      case 'auth/invalid-hash-rounds':
        return 'Invalid hash rounds.';
      case 'auth/invalid-hash-salt-separator':
        return 'Invalid hash salt separator.';
      case 'auth/invalid-id-token':
        return 'Invalid ID token.';
      case 'auth/invalid-last-sign-in-time':
        return 'Invalid last sign-in time.';
      case 'auth/invalid-page-token':
        return 'Invalid page token.';
      case 'auth/invalid-password':
        return 'Invalid password.';
      case 'auth/invalid-password-hash':
        return 'Invalid password hash.';
      case 'auth/invalid-password-salt':
        return 'Invalid password salt.';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number.';
      case 'auth/invalid-photo-url':
        return 'Invalid photo URL.';
      case 'auth/invalid-provider-data':
        return 'Invalid provider data.';
      case 'auth/invalid-provider-id':
        return 'Invalid provider ID.';
      case 'auth/invalid-oauth-responsetype':
        return 'Invalid OAuth response type.';
      case 'auth/invalid-session-cookie-duration':
        return 'Invalid session cookie duration.';
      case 'auth/invalid-uid':
        return 'Invalid UID.';
      case 'auth/invalid-user-import':
        return 'Invalid user import.';
      case 'auth/maximum-user-count-exceeded':
        return 'Maximum user count exceeded.';
      case 'auth/missing-android-pkg-name':
        return 'Missing Android package name.';
      case 'auth/missing-continue-uri':
        return 'Missing continue URL.';
      case 'auth/missing-hash-algorithm':
        return 'Missing hash algorithm.';
      case 'auth/missing-ios-bundle-id':
        return 'Missing iOS bundle ID.';
      case 'auth/missing-uid':
        return 'Missing UID.';
      case 'auth/missing-oauth-client-secret':
        return 'Missing OAuth client secret.';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed.';
      case 'auth/phone-number-already-exists':
        return 'Phone number already in use.';
      case 'auth/project-not-found':
        return 'Project not found.';
      case 'auth/reserved-claims':
        return 'Reserved claims used.';
      case 'auth/session-cookie-expired':
        return 'Session cookie expired.';
      case 'auth/session-cookie-revoked':
        return 'Session cookie revoked.';
      case 'auth/too-many-requests':
        return 'Too many requests send.';
      case 'auth/uid-already-exists':
        return 'UID already in use.';
      case 'auth/unauthorized-continue-uri':
        return 'Unauthorized continue URL.';
      case 'auth/user-not-found':
        return 'User not found.';
      default:
        return 'An unknown error occurred.';
    }
  }