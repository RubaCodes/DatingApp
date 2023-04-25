import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: Message[];
  @Input() username: string;
  @ViewChild('messageForm') messageForm: NgForm;
  messageContent: string = '';
  constructor(private messageSrv: MessageService) {}

  ngOnInit(): void {}
  sendMessage() {
    if (!this.username) return;
    this.messageSrv.sendMessage(this.username, this.messageContent).subscribe({
      next: (res) => {
        this.messages.push(res);
        this.messageForm.reset();
      },
    });
  }
}
