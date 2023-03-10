import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogsService } from '../../services/blogs.service';
import { Blog } from 'src/app/Blog';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/services/auth-service.service';
import { Comment } from 'src/app/Comment';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})

export class BlogViewComponent implements OnInit {
  showForm: boolean = false;
  blogId: string = '';
  private userSubscription: Subscription;
  blog: Blog | undefined;
  comments: Comment[] = [];
  formData = {
    content: '',
    postedBy: '',
  }

  constructor(private route: ActivatedRoute, private blogsService: BlogsService, private authService: AuthService) {
    this.userSubscription = new Subscription();
  }
  
  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('blogId') ?? '';
    if (blogId) {
      this.blogId = blogId;
      this.blogsService.getBlog(blogId).subscribe((blog: Blog) => {
        this.blog = blog;
      });
      this.blogsService.getComments(blogId).subscribe((comment) => {
        this.comments = comment;
      });
    }

    this.userSubscription = this.authService.user$.subscribe(() => {          
      this.setPostedBy();
    });

    this.blogsService.newBlogAdded$.subscribe((blog) => {
      return;
    });
  }

  setPostedBy() {
    const user = this.authService.getUser();
    if (user) {
      return this.formData.postedBy = user.username;
    }

    return;
  }

  onFormChange(event: any) {
    const { name, value } = event.target;
    if (name in this.formData) {
      this.formData = { ...this.formData, [name]: value.trim() };
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  submitComment() {        
    this.blogsService.submitComment(this.formData, this.blogId).subscribe((comment) => {
      this.comments.unshift(comment);
    });

    this.formData.content = '';
  }
}
