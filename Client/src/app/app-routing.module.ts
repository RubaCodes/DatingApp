import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "members", component: MemberListComponent, canActivate: [AuthGuard] },
  //una sorta di grouping per il middleware di auth
  {
    path: "",
    runGuardsAndResolvers: "always",
    children: [
      { path: "members/:id", component: MemberDetailComponent },
      { path: "lists", component: ListsComponent },
      { path: "messages", component: MessagesComponent },
    ]
  },
      { path: "error", component: TestErrorComponent, pathMatch: "full" },
      { path: "not-found", component: NotFoundComponent, pathMatch: "full"},
      { path: "server-error", component: ServerErrorComponent, pathMatch: "full"},
      { path: "**", component: NotFoundComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
