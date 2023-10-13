// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.





export const environment = {

  // apiURL: 'http://localhost/colorHuntApi/public/api',
  // UploadBaseURL : 'http://localhost/colorHuntApi/public/',
  // getuploadURL: 'http://localhost/colorHuntApi/public/uploads/', 
  corsEnabled: true,


  apiURL: 'https://webportalstaging.colorhunt.in/colorHuntApiStaging/public/api',
  UploadBaseURL: 'https://webportalstaging.colorhunt.in/colorHuntApiStaging/public/',
  getuploadURL: 'https://webportalstaging.colorhunt.in/colorHuntApiStaging/public/uploads/',
  debugMode: false,

  
  // apiURL: 'https://webportal.colorhunt.in/colorHuntApi/public/api',
  // UploadBaseURL : 'https://webportal.colorhunt.in/colorHuntApi/public/',
  // getuploadURL: 'https://webportal.colorhunt.in/colorHuntApi/public/uploads/',
  // debugMode: false,


  production: true

  // apiURL: 'http://172.20.10.6/colorHuntApi/public  /api',
  // UploadBaseURL : 'http://172.20.10.6/colorHuntApi/public/',
  // getuploadURL: 'http://172.20.10.6/colorHuntApi/public/uploads/',

  // apiURL: 'https://colorhunt.in/colorHuntApiStaging/public/api',
  // UploadBaseURL : 'https://colorhunt.in/colorHuntApiStaging/public/',
  // getuploadURL: 'https://colorhunt.in/colorHuntApiStaging/public/uploads/',
  // production: false
};


/* export const environment = {
  apiURL: 'http://192.168.10.63/colorHuntApi/public/api',
  UploadBaseURL : 'http://192.168.10.63/colorHuntApi/public/',
  getuploadURL: 'http://192.168.10.63/colorHuntApi/public/uploads/',
  production: false
}; */

// export const environment = {
//   apiURL: 'http://192.168.10.69:7080/colorHuntApi/public/api',
//   UploadBaseURL : 'http://192.168.10.69:7080/colorHuntApi/public/',
//   getuploadURL: 'http://192.168.10.69:7080/colorHuntApi/public/uploads/',
//   production: false
// };
