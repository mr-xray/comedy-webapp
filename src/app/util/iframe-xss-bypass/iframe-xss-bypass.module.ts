import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFrameTrustedPipe } from './pipe/iframe-trusted.pipe';

@NgModule({
  declarations: [IFrameTrustedPipe],
  imports: [CommonModule],
  exports: [IFrameTrustedPipe],
})
export class IFrameXssBypassModule {}
