import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments';
const BACKEND_URL = environment.apiURL + '/posts/'; // global
const DEMO_POSTS_URL = 'assets/demo-posts.json';

@Injectable({
  providedIn: 'root',
})
/**
 * handle the created post  , get post and update the post
 */
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * call the list from post post from link and tranformate the id value that
   * later can used for to indentifie the post and edite o delete
   */
  getPosts(postsPerPage: number, currentPage: number) {
    if (environment.demoMode) {
      // Demo-Modus: Lade Daten aus assets/demo-posts.json
      this.http.get<any[]>(DEMO_POSTS_URL).subscribe((demoPosts) => {
        // Simuliere Paginierung
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const pagedPosts = demoPosts.slice(start, end).map((post: any) => ({
          id: post.id || post._id,
          country: post.country,
          city: post.city,
          topic: post.topic,
          rate: post.rate,
          imagePath: post.imagePath,
          content: post.content,
          subtitel: post.subtitel,
          date: post.date,
          creator: post.creator,
          author: post.author,
        }));
        this.posts = pagedPosts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: demoPosts.length,
        });
      });
    } else {
      // Normaler Modus: Lade Daten vom Backend
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; posts: any; maxPost: number }>(
          BACKEND_URL + queryParams
        )
        .pipe(
          map((postData) => {
            return {
              posts: postData.posts.map((post: any) => {
                return {
                  id: post._id,
                  country: post.country,
                  city: post.city,
                  topic: post.topic,
                  rate: post.rate,
                  imagePath: post.imagePath,
                  content: post.content,
                  subtitel: post.subtitel,
                  date: post.date,
                  creator: post.creator, // getting this information from the serve creator id
                  author: post.author,
                };
              }),
              maxPosts: postData.maxPost,
            };
          })
        )
        .subscribe((transformedPostsData) => {
          this.posts = transformedPostsData.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: transformedPostsData.maxPosts,
          });
        });
    }
  }
  /**
   *
   * @returns the updated post list as Observable
   */
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  /**
   *
   * @param id from the post
   * @returns the post if the id existiern (generic object)
   */
  getPost(id: string | null | undefined) {
    return this.http.get<{
      _id: string;
      country: string;
      city: string;
      topic: string;
      rate: number;
      imagePath: string | null;
      content: string;
      subtitel: string;
      date: string;
      creator: string;
      author: string;
    }>(BACKEND_URL + id);
  }

  /**
   * post will be added to the server
   * @param id  from the post
   * @param country name from country and state
   * @param topic  from the post
   * @param rate  personal rate
   * @param content  coment from the user
   */
  addPost(
    country: string,
    city: string,
    topic: string,
    rate: number,
    image: File,
    content: string,
    subtitel: string,
    date: string | any
  ) {
    const postData = new FormData();
    postData.append('country', country);
    postData.append('city', city);
    postData.append('topic', topic);
    postData.append('rate', rate.toString()); // conver number into string
    postData.append('image', image, country);
    postData.append('content', content);
    postData.append('subtitel', subtitel);
    postData.append('date', date);

    // store to the server
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }
  /**                                                 Update Post  */
  /**
   *  // update the data in json
   * @param id  post
   * @param country post
   * @param city post
   * @param topic  post
   * @param rate post
   * @param content post
   */
  updatePost(
    id: string | null | undefined | any,
    country: string,
    city: string,
    topic: string,
    rate: number,
    image: File | string | null | any,
    content: string,
    subtitel: string,
    date: string | any
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('country', country);
      postData.append('city', city);
      postData.append('topic', topic);
      postData.append('rate', rate.toString()); // conver number into string
      postData.append('image', image, country);
      postData.append('content', content);
      postData.append('subtitel', subtitel);
      postData.append('date', date);
    } else {
      postData = {
        id: id,
        country: country,
        city: city,
        topic: topic,
        rate: rate,
        imagePath: image,
        content: content,
        date: date,
        subtitel: subtitel,
        creator: null,
        author: null,
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
  /**
   *
   * @param postId  from the post that is generate from the database from mongodb
   *
   * return the status of the action , true or false , message
   */
  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
