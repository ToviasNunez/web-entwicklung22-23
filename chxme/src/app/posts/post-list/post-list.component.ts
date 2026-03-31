import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
/**
 *  will be add a post into a list
 *  using subcription
 */
export class PostListComponent implements OnInit, OnDestroy {
  userId?: string | null;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 3;
  currentPage = 1;
  userIsAuthenticated = false;
  pageSizeOption = [1, 2, 5, 10];
  private postsSub: Subscription = new Subscription();
  private authStatusSub!: Subscription;
  searchPost?: string;
  /**
   *
   * @param postsService use to get the post and to subcribe
   */
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId(); // fetch the user id
    this.postsSub = this.postsService
      .getPostsUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts.reverse(); // get the post list reverse the last post will be at the top
      });

    this.userIsAuthenticated = this.authService.getIsAuthtenticated(); // to initialized the authentification
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated; // info that get from my service
        this.userId = this.authService.getUserId(); // fetch the user id
      });
  }

  /** Pagination */
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  /**
   *
   * @param postId  unique value the identified the post on the databank
   */
  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  /**
   * unsubcribe the post subcribed
   */
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
