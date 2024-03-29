import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-base-frame',
  templateUrl: './event-base-frame.component.html',
  styleUrls: ['./event-base-frame.component.scss'],
})
export class EventBaseFrameComponent implements OnInit {
  constructor() {}
  private _eventTitle: string = '';
  private _eventDescription: string = '';
  ngOnInit(): void {}

  public get eventTitle(): string {
    return this._eventTitle;
  }

  public get eventDescription(): string {
    return this._eventDescription;
  }

  public set eventTitle(title: string) {
    this._eventTitle = title;
  }

  public set eventDescription(description: string) {
    this._eventDescription = description;
  }
}
