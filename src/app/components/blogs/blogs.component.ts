import { Component, Output, EventEmitter } from '@angular/core';
import { BlogsService } from 'src/app/services/blogs.service';
import { Blog } from 'src/app/Blog';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})

export class BlogsComponent {
  columnFilter: boolean;
  blogs: Blog[] = [];
  leftColumn: Blog[];
  rightColumn: Blog[];
  @Output() searchObjectUpdated = new EventEmitter<any>();

  constructor(private blogService: BlogsService) {
    this.leftColumn = [];
    this.rightColumn = [];
    this.columnFilter = false;
  }

  ngOnInit(): void {

    this.blogService.newBlogAdded$.subscribe((blog) => {
      blog.createdAt = new Date(blog.createdAt).toLocaleDateString()
      if (this.columnFilter) {
        this.leftColumn.unshift(blog);
      } else {
        this.rightColumn.unshift(blog);
      }
      this.columnFilter = !this.columnFilter;
      return;
    });

    this.blogService.getBlogs().subscribe((blogs) => {
      this.blogs = blogs;            
      this.leftColumn = this.blogs.filter((_, index) => index % 2 === 0);
      this.rightColumn = this.blogs.filter((_, index) => index % 2 === 1);      
    });

    this.blogService.searchObjectUpdated$.subscribe((searchObject) => {
      const {selectedOption, searchQuery} = searchObject;

      // If search bar is empty, return back to the original view.
      if (searchQuery.trim() === '') {
        this.leftColumn = this.blogs.filter((_, index) => index % 2 === 0);
        this.rightColumn = this.blogs.filter((_, index) => index % 2 === 1);   
      }

      // Filter both columns by the criteria passed by the user.           
      this.leftColumn = this.leftColumn.filter((blog) => {
        const propertyValue = blog[selectedOption as keyof Blog];
        return propertyValue.includes(searchQuery);
      })

      this.rightColumn = this.rightColumn.filter((blog) => {
        const propertyValue = blog[selectedOption as keyof Blog];
        return propertyValue.includes(searchQuery);
      })          
    });
  }
}
