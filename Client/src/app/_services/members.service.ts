import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';
import { Subject, map, of, take } from 'rxjs';
import { userParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;

  memberCache = new Map();
  user: User;
  userParams: userParams;
  constructor(private http: HttpClient, private accountSrv: AccountService) {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.userParams = new userParams(user);
          this.user = user;
        }
      },
    });
  }
  getUserParams() {
    return this.userParams;
  }
  setUserParams(params: userParams) {
    this.userParams = params;
  }
  getMembers(userParams: userParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResults<Member[]>(
      this.baseUrl + 'users',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(userName: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((U: Member) => U.userName === userName);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }
  updateMember(member: string) {
    return this.http.put(this.baseUrl + 'users', member);
  }
  resetUserParams(): userParams {
    this.userParams = new userParams(this.user);
    return this.userParams;
  }

  //userlikes
  addLike(userName: string) {
    return this.http.post(this.baseUrl + 'likes/' + userName, {});
  }
  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResults<Member[]>(
      this.baseUrl + 'likes',
      params,
      this.http
    );
  }
}
