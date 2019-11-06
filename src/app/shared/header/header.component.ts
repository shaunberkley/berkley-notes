import { map, filter, scan, mergeMap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AngularFireAuth } from '@angular/fire/auth';
import { HeaderService } from '../../services/header.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pageTitle;

  constructor(public hs: HeaderService,  private activatedRoute: ActivatedRoute, public router: Router, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => this.pageTitle = event['title']);
  }

}
