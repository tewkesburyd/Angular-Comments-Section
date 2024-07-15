import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
// Import icons
// Had issue with initially rendering component, had to include standalone, need to look into this more

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, MatIconModule],
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css']
})
export class CommentsSectionComponent {
  // Use to store comments
  comments: any[] = [];

  message: string = "";

  //??handle current user with auth && logged in??
  currentUser: any = { userID: 0, name: 'David' }; 

  // Users list from build instructions
  users: any[] = [
    { 'userID': 1, 'name': 'Kevin' },
    { 'userID': 2, 'name': 'Jeff' },
    { 'userID': 3, 'name': 'Bryan' },
    { 'userID': 4, 'name': 'Gabbey' },
  ];
  // Initial value for dropdown, ensure closed
  showDropdown: boolean = false;

  // Use to store filtered users
  mentionedUsers: any[] = [];

  //Clear tagged user alerts (background color alert)
  clearMentions() {
    this.mentionedUsers = [];
    this.comments.forEach(comment => {
      comment.mentionedUserID = null;
    });
  }

  //Create date/time to match comments section
  createDateTime(): string {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${this.pad(date.getMonth() + 1)}/${this.pad(date.getDate())}`;
    const hours = date.getHours();
    const formattedHours = hours<=12 ? hours : (hours - 12)
    const minutes = date.getMinutes();
    const period = hours >= 12 && hours <= 24 ? 'PM' : 'AM';
    const formattedTime = `${formattedHours}:${minutes} ${period}`;
    return `${formattedDate}  ${formattedTime}`;
  }

  //Pad single digit month and days to match example
  pad(num: number): string {
    let s = num.toString();
    while (s.length < 2) s = "0" + s;
    return s;
  }

  //Handle new comment
  addComment() {
    // Remove white spaces and ensure message isn't empty
    if (this.message.trim() !== "") {

      //If stored in a db, might be useful to save userID, type, timestamp, message, mentionedUserID
      //Hardcoded type to match example
      const newComment: any = {
        userID: this.currentUser.userID,
        type: "Systems",
        timestamp: this.createDateTime(),
        message: this.message,
        mentionedUserID: null
      };

      // Check to see if message starts with "@"
      if (this.isUserMentioned()) {
        // Find mentioned user
        const mentionedUser = this.users.find(user => this.message.startsWith(`@${user.name}`));
        // Get mentioned user id and set it in newComment
        if (mentionedUser) {
          newComment.mentionedUserID = mentionedUser.userID;
          // ??Could email using queue manager??
        } else {
          // ??Should alert or tool tip alert that there is no match??
          console.log('No mentioned user found.');
        }
      }
      //Add to comments array, reset message, ensure dropdown is closed, reset mentioned user
      // console.log('Adding comment:', newComment);
      this.comments.push(newComment);
      this.message = "";
      this.showDropdown = false;
      this.mentionedUsers = [];
    }
  }

  //Check to see if message starts "@", return bool
  isUserMentioned(): boolean {
    const mentioned = this.message.startsWith('@');
    return mentioned;
  }

  //Handle message change
  onMessageChange() {
    if (this.isUserMentioned()) {
      //Get mentioned user name
      const mentionedUserName = this.message.substring(1).toLowerCase().split(' ')[0];
      // Find matching user
      this.mentionedUsers = this.users.filter(user =>
        user.name.toLowerCase().startsWith(mentionedUserName)
      );
      this.showDropdown = this.mentionedUsers.length > 0;
    } else {
      this.showDropdown = false;
      this.mentionedUsers = [];
    }

    
    this.exitDropdownAfterMention();
  }

  //Close the dropdown after mention
  exitDropdownAfterMention() {
    const words = this.message.split(' ');
    if (words.length > 1 && this.isUserMentioned()) {
      const mentionedUser = this.users.find(user =>
        words[0].toLowerCase() === `@${user.name.toLowerCase()}`
      );
      if (mentionedUser) {
        this.showDropdown = false;
        this.mentionedUsers = [];
      }
    }
  }

  //Handle click, select user
  selectUser(user: any) {
    this.message = `@${user.name} `;
    this.showDropdown = false; 
    this.mentionedUsers = []; 
  }

  // Handle mentioned user for alerts
  isUserMentionedInComments(userID: number): boolean {
    const mentioned = this.comments.some(comment => comment.mentionedUserID === userID);
    // console.log(`UserID: ${userID}, Mentioned: ${mentioned}`);
    return mentioned;
  }
}
