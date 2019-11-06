import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  show = false;

  constructor() { }


  toggleMenu() {
    this.show = !this.show;
  }

  closeMenu() {
    this.show = false;
  }

  openMenu() {
    this.show = true;
  }
}
