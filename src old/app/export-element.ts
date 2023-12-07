import { drawDOM, exportPDF, DrawOptions, Group } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';
var date = new Date();
export function exportElement(element: HTMLElement, data?: string, options?: DrawOptions) {
  console.log(data);
  debugger;
  drawDOM(element, options).then((group: Group) => {
    return exportPDF(group);
  }).then((dataUri) => {
    console.log(options);
    debugger;
    // doc.save('SOPdf_' + date.getTime() + '.pdf')
    saveAs(dataUri, 'SOPdf_' + data + '.pdf')
    //saveAs(dataUri, 'export.pdf');
  });
}

export function exportOutwardElement(element: HTMLElement, data?: string, options?: DrawOptions) {
  
  console.log(data);
  console.log(element);
  debugger;
  drawDOM(element, options).then((group: Group) => {
    
    return exportPDF(group);
  }).then((dataUri) => {
    console.log(options);
    
    debugger;
    // doc.save('SOPdf_' + date.getTime() + '.pdf')
    saveAs(dataUri, 'OUTWARDPdf_' + data + '.pdf')
    //saveAs(dataUri, 'export.pdf');
  });
}
export function exportStElement(element: HTMLElement, data?: string, options?: DrawOptions) {
  console.log(data);
  console.log(element);
  debugger;
  drawDOM(element, options).then((group: Group) => {
    return exportPDF(group);
  }).then((dataUri) => {
    console.log(options);
    debugger;
    // doc.save('SOPdf_' + date.getTime() + '.pdf')
    saveAs(dataUri, 'STPdf_' + data + '.pdf')
    //saveAs(dataUri, 'export.pdf');
  });
}
export function exportDailyReport(element: HTMLElement, options?: DrawOptions) {
  drawDOM(element, options).then((group: Group) => {
    return exportPDF(group);
  }).then((dataUri) => {
    saveAs(dataUri, 'Daily_Report' + '.pdf')
  });
}

export function shareOutwardElement(element: HTMLElement, data?: string, options?: DrawOptions) {
  drawDOM(element, options).then((group: Group) => {
    return exportPDF(group);
  }).then((dataUri) => {
    console.log("dataUri", dataUri);
    var blob = dataURLtoBlob(dataUri);
    var fd = new FormData();
    fd.append("file", blob, "hello.pdf");
    // this.blobToFile(dataUri, "Daily_Report")
  });
}
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}
