import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommentsSectionComponent } from './comments-section/comments-section.component';
import {MatIconModule} from '@angular/material/icon';
// Import the new comments section and icons
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommentsSectionComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'limble-project';
}
