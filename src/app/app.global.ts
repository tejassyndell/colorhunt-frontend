import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
    readonly baseAppUrl: string = 'http://localhost:57431/';
    readonly baseAPIUrl: string = 'https://api.github.com/';
}