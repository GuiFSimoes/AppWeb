// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: 'AIzaSyCsMuaKhJbwEOILoZCsrkEmqQ5sWXEt_RU',
        authDomain: 'click-cidadao.firebaseapp.com',
        databaseURL: 'https://click-cidadao.firebaseio.com',
        projectId: 'click-cidadao',
        storageBucket: 'click-cidadao.appspot.com',
        messagingSenderId: '827854531922'
    },
    autenticationOneSignal: 'Basic MzFkZDU2NWQtNmJmZS00M2Y0LWJiZDQtZWY2OTFhOGNiYWU2',
    aplicationIDOneSignal: '8d6bff67-0c20-44eb-8cb4-c844bab5d3bd',
};
