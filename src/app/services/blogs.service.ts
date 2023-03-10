import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject, map } from 'rxjs'
import { Blog } from 'src/app/Blog';
import { Comment } from 'src/app/Comment'

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private apiUrl = 'https://angular-blog-server.herokuapp.com/api/blogs'

  constructor(private http:HttpClient) {}

  private newBlogAdded = new Subject<Blog>();
  private searchObjectUpdated = new Subject<any>();
  private newCommentAdded = new Subject<Comment>();

  newBlogAdded$ = this.newBlogAdded.asObservable();
  searchObjectUpdated$ = this.searchObjectUpdated.asObservable();

  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json')

  addNewBlog(blog: Blog) {
    this.newBlogAdded.next(blog);
  }

  onSearchObjectUpdated(searchObject: any) {
    this.searchObjectUpdated.next(searchObject);    
  }

  getBlog(id: any): Observable<Blog> {
    return this.http.get<Blog>(this.apiUrl + `/${id}`);
  }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl).pipe(
      map((blogs: Blog[]) => {
        return blogs.map((blog: Blog) => {
          return {
            ...blog,
            createdAt: new Date(blog.createdAt).toLocaleDateString(),
          };
        });
      })
    );
  }

  getComments(id: any): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + `/${id}/comments`).pipe(
      map((comments: Comment[]) => {
        return comments.map((comment: Comment) => {
          return {
            ...comment,
            createdAt: new Date(comment.createdAt).toLocaleDateString(),
          };
        });
      })
    );
  }
  
  submitBlog(blog: Blog): Observable<Blog> {    
    return this.http.post<Blog>(this.apiUrl, blog, {headers: this.headers});
  }
  
  submitComment(comment: Comment, id: string): Observable<Comment> {
    comment = {...comment, commentOn: id};    
    return this.http.post<Comment>(this.apiUrl + `/${id}`, comment, {headers: this.headers});
  }
}
