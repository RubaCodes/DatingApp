import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/members';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  members: Member[];
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 2;
  pagination: Pagination;

  constructor(private memberSrv: MembersService) {}

  ngOnInit(): void {
    this.loadLiked();
  }
  loadLiked() {
    this.memberSrv
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe({
        next: (res) => {
          this.members = res.result;
          this.pagination = res.pagination;
        },
      });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLiked();
    }
  }
}
