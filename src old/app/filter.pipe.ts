import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    
    if(!items) return [];
    if(!searchText) return items;
    return items.filter( it => {
        //items.title.indexOf(searchText.title) !== -1
        //return it.includes(searchText);
        });
   }
}