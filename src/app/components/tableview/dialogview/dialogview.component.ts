//Angular core modules
import {
  Component,
  Inject,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from '@angular/core';

//Angular material modules
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

//User-defined services modules
import { mouseservice } from '../../../services/dataservice/mouseservice.service';
import { NotificationService } from '../../../services/notificationservice/notification.service';
import { FileUploader } from '../../../services/dataservice/fileuploader.service';

//User-defined constants
import { SERVER, IMAGEURL } from '../../../constants/constants';

//3rd Party module

//Used for enlarge images
import baguetteBox from 'baguettebox.js';

//Reactive modules
import { timer } from 'rxjs';

import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'dialogview',
  templateUrl: './dialogview.component.html',
  styleUrls: ['./dialogview.component.css']
})
export class DialogView {

  public imageLists: string[] = [];

  public showimageFlag: boolean = false; 
  public noimageIndicator: boolean = false;

  @Output('importImageevent') importImageevent = new EventEmitter<any>();

  @ViewChild('imagefileInput') imagefileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DialogView>,
    public mouseservicehandler: mouseservice,
    public notificationService: NotificationService,
    public fileuploader: FileUploader,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getImage();
  }

  getImage() {
    console.log(this.data.row.physical_id);
    this.mouseservicehandler.getMouseImage(this.data.row.physical_id).subscribe(
      event => {
        let error: boolean = event.error;
        let errorCode: string = event.errorCode;
        let result: string = event.result;

        if (error) {

          let error_message_lists: string[] = result.split(".");

          let errordata = {
            error_code: errorCode,
            error_message: error_message_lists
          }
          this.notificationService.toast(
            errordata,
            true
          )
          this.noimageIndicator = true;
          
        } else {

          let images: string[] = result.split(",");
          images.splice(-1, 1);
          this.imageLists = [];
          for (let image of images) {
            let imageurl = environment.baseurl + '/static/photos/' + this.data.row.physical_id + '/' + image;
            this.imageLists.push(imageurl);
          }

          this.notificationService.toast(
            "Processing images now..",
            false
          )

          //Must be delayed by one second before running initialization
          //of the baguttebox after image is downloaded
          let timer_local = timer(1000);
          let suscription = timer_local.subscribe(
            (tick) => {
              baguetteBox.run('.grid-gallery');
              this.showimageFlag = true;
              this.noimageIndicator = false;
            });
          //Run second times to make sure it runs
          let timer_local_second = timer(2000);
          let suscription_second = timer_local_second.subscribe(
            (tick) => {
              baguetteBox.run('.grid-gallery');
              this.showimageFlag = true;
              this.noimageIndicator = false;
            });
        }
      }
    )
  }
  onExitClick(): void {
    this.dialogRef.close();
  }


  onFileChange(event) {
    this.fileuploader.addFiles(event.target.files);
    console.log(event.target.files);
    this.importImageevent.emit(this.data.row.physical_id);
  }

  UploadImage() {
    this.imagefileInput.nativeElement.click();
  }

}