import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { RelicComponent } from './relic/relic.component';
import { ManageService } from '../shared/manage.service';
import { KnowledgeComponent } from './knowledge/knowledge.component';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivateChild {
  constructor(
    private service: ManageService
  ) { }
  canActivateChild(_route: ActivatedRouteSnapshot) {
    if (_route.component == RelicComponent) {
      this.service.uploadType = 'relic'
    }
    else if (_route.component == KnowledgeComponent) {
      this.service.uploadType = 'knowledge'
    }
    else {
      this.service.uploadType = null
    }
    this.service.tableFolded = true
    this.service.navigationFolded = false
    return true
  }
}
