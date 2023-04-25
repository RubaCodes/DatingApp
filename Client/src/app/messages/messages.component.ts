import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  constructor(private messageSrv: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    this.messageSrv
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: (res) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
      });
  }

  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadMessages;
    }
  }

  deleteMessage(id: number) {
    this.messageSrv.deleteMessage(id).subscribe({
      next: () =>
        this.messages.splice(
          this.messages.findIndex((m) => m.id),
          1
        ),
    });
  }
}
