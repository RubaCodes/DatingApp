import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';
import { PaginatedResult } from '../_models/pagination';
import { Subject, map, of, take } from 'rxjs';
import { userParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

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

    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResults<Member[]>(
      this.baseUrl + 'users',
      params
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }
  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http
      .get<T>(url, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res) => {
          if (res.body) {
            paginatedResult.result = res.body;
          }
          const pagination = res.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
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
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResults<Member[]>(this.baseUrl + 'likes', params);
  }
}
