import { Component, OnDestroy } from '@angular/core';
import { BlogsService } from '../../services/blogs.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-post-form',
  templateUrl: './blog-post-form.component.html',
  styleUrls: ['./blog-post-form.component.css'],
})
export class BlogPostFormComponent implements OnDestroy {
  private userSubscription: Subscription;
  modalOpen = false;
  formData = {
    title: '',
    content: '',
    postedBy: 'Anonymous',
  };

  constructor(
    private blogsService: BlogsService,
    private authService: AuthService
  ) {
    this.userSubscription = this.authService.user$.subscribe((user) => {        
      this.setPostedBy(user.username);
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the user$ observable to avoid memory leaks
    this.userSubscription.unsubscribe();
  }

  setPostedBy(username: string) {
    if (!username) {
      return this.formData.postedBy = 'Anonymous';
    }
    return this.formData.postedBy = username;
  }

  onFormChange(event: any) {
    const { name, value } = event.target;
    if (name in this.formData) {
      this.formData = { ...this.formData, [name]: value.trim() };
    }
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }

  submitBlog() {
    this.blogsService.submitBlog(this.formData).subscribe((blog) => {
      this.blogsService.addNewBlog(blog);
    });

    if (!this.formData.postedBy) {
      this.toggleModal();
    }

    this.formData.content = '';
    this.formData.title = '';
  }

  submitAnonymously() {
    this.submitBlog();
    this.toggleModal();
  }

  menuSelected = '';

  onMenuButtonClicked(menu: string) {
    this.menuSelected = menu;
  }

  onSignUpFormChange(event: any) {
    const { name, value } = event.target;
    if (name in this.authService.signUpData) {
      this.authService.signUpData = { ...this.authService.signUpData, [name]: value.trim() };
    }
  }

  onSignInFormChange(event: any) {
    const { name, value } = event.target;
    if (name in this.authService.signInData) {
      this.authService.signInData = { ...this.authService.signInData, [name]: value.trim() };
    }
  }

  onSignUp() {
    this.authService.submitSignUp().subscribe((user) => {
      if (user) {
        this.toggleModal();
      }
      this.authService.setUser(user.username); // call setUser() with the new username value
    });
  }
  
  onSignIn() {
    this.authService.submitSignIn().subscribe((user) => {
      if (user) {
        this.toggleModal();
      }
      this.authService.setUser(user.username); // call setUser() with the new username value
    });
  }  
}
