// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    firebaseConfig : {
    apiKey: "AIzaSyAD51RrWBl9MCSyghXzw9g01Q7E5HtrMY8",
    authDomain: "notea-fa842.firebaseapp.com",
    databaseURL: "https://notea-fa842.firebaseio.com",
    projectId: "notea-fa842",
    storageBucket: "notea-fa842.appspot.com",
    messagingSenderId: "898334937734",
    appId: "1:898334937734:web:3ec7a2d24f3bf1195e7707",
    measurementId: "G-7N600E13ME"
  },
  notasCollection:'Notas'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
