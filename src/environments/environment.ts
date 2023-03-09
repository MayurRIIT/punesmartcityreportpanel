// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: `${window['ApiBaseUrl']}/admin`,
  //api: `http://3.108.74.63:3002/admin`,
  baseUrl: `${window['ApiBaseUrl']}`,
  //pdfId: '8c0cd670273d451cbc9b351b11d22318'
  pdfId: '8b7bbe140685452b980f62e3386d2c24'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
