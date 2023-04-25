import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/members';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailedResolver implements Resolve<Member> {
  constructor(private memberSrv: MembersService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberSrv.getMember(route.paramMap.get('username'));
  }
}
