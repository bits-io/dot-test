const AuthGuardSetting = {
    excludedPaths: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/portal',
        '/api/auth/forgot-password',
        '/api/auth/invoice-token',
        '/api/auth/callbackportal',
        '/api/public/*',
    ],
}

export default AuthGuardSetting;