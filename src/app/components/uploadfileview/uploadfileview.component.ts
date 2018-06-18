//Angular Core Modules
import { 
    Component, 
    Output, 
    EventEmitter 
} from '@angular/core';

import { HttpEventType } from '@angular/common/http';

//Angular material modules
import { MatTooltipModule } from '@angular/material/tooltip';

//User-defined services
import { FileUploader } from '../../services/dataservice/fileuploader.service';
import { NotificationService } from '../../services/notificationservice/notification.service';



interface FileUploadInterface {
    file: any,
    fileid: number,
    file_time: string,
    value: number,
    complete: boolean,
    error: number,
    message: string
}

@Component({
    selector: "uploadfileview",
    templateUrl: "./uploadfileview.component.html",
    styleUrls: ["./uploadfileview.component.css"]
})
export class Uploadfileview {

    @Output('uploadFinishedEvent') uploadFinishedEvent = new EventEmitter<any>();
    @Output('uploadImageFinishedEvent') uploadImageFinishedEvent = new EventEmitter<any>();
    @Output('notasksevent') notasksevent =  new EventEmitter<any>();
    private fileLists: FileUploadInterface[] = [];
    private counter: number = 0;
    constructor(
        private fileuploader: FileUploader,
        private notificationservice: NotificationService
    ) { }

    dismiss(fileid) {
        for (let file of this.fileLists) {
            if (file.fileid == fileid) {
                console.log(fileid);
                let index = this.fileLists.indexOf(file);
                this.fileLists.splice(index, 1);
                console.log(this.fileLists);
            }
        }

        if(this.fileLists.length == 0){
            this.notasksevent.emit();
        }
    }

    public startuploadImage(physical_id: string){
        let fileToBeUploaded = this.fileuploader.getFiles();

        for (let file of fileToBeUploaded) {

            var datetime = new Date().toLocaleString();
            this.fileLists.push(
                {
                    file: file,
                    fileid: this.counter,
                    file_time: datetime,
                    value: 0,
                    complete: false,
                    error: 0,
                    message: 'There is no error'
                }
            )
            this.counter = this.counter + 1;
        }

        this.fileuploader.uploadImageFiles(physical_id).map(
            element => {
                element.observable.subscribe(

                    event => {

                        if (event.type == HttpEventType.DownloadProgress) {
                            //const percentDone = Math.round(100 * event.loaded / event.total);
                            for (let file of this.fileLists) {
                                if (file.fileid == element.fileid) {
                                    file.value = Math.round(100 * event.loaded / event.total);
                                }
                            }
                        }
                        else {

                            let error_message_lists: string[] = event.result.split(".");
                            let errordata = {
                                error_code: event.errorCode,
                                error_message: error_message_lists
                            }
                            if (event.error) {
                                this.notificationservice.toast(
                                    errordata,
                                    event.error
                                );
                                for (let file of this.fileLists) {
                                    if (file.fileid == element.fileid) {
                                        file.value = 100;
                                        file.complete = true;
                                        file.error = 2;
                                        file.message = errordata.error_message[0];
                                    }
                                }
                            } else {
                                this.notificationservice.toast(
                                    event.result,
                                    false
                                );
                                for (let file of this.fileLists) {
                                    if (file.fileid == element.fileid) {
                                        file.value = 100;
                                        file.complete = true;
                                        file.error = 0;
                                        file.message = "There is no error";
                                    }
                                }
                            }
                            this.uploadImageFinishedEvent.emit();
                        }
                    },

                    error => {
                        for (let file of this.fileLists) {
                            if (file.fileid == element.fileid) {
                                file.value = 0;
                                file.complete = true;
                                file.error = 1;
                            }
                        }
                    }
                )
            }
        );        
    }

    public startupload() {

        let fileToBeUploaded = this.fileuploader.getFiles();

        for (let file of fileToBeUploaded) {

            var datetime = new Date().toLocaleString();
            this.fileLists.push(
                {
                    file: file,
                    fileid: this.counter,
                    file_time: datetime,
                    value: 0,
                    complete: false,
                    error: 0,
                    message: 'There is not error'
                }
            )
            this.counter = this.counter + 1;
        }

        this.fileuploader.uploadFiles().map(
            element => {
                element.observable.subscribe(

                    event => {

                        if (event.type == HttpEventType.DownloadProgress) {
                            //const percentDone = Math.round(100 * event.loaded / event.total);
                            for (let file of this.fileLists) {
                                if (file.fileid == element.fileid) {
                                    file.value = Math.round(100 * event.loaded / event.total);
                                }
                            }
                        }
                        else {

                            let error_message_lists: string[] = event.result.split(".");
                            let errordata = {
                                error_code: event.errorCode,
                                error_message: error_message_lists
                            }
                            if (event.error) {
                                this.notificationservice.toast(
                                    errordata,
                                    event.error
                                );
                                for (let file of this.fileLists) {
                                    if (file.fileid == element.fileid) {
                                        file.value = 100;
                                        file.complete = true;
                                        file.error = 2;
                                        file.message = errordata.error_message[0];
                                    }
                                }
                            } else {
                                this.notificationservice.toast(
                                    event.result,
                                    false
                                );
                                for (let file of this.fileLists) {
                                    if (file.fileid == element.fileid) {
                                        file.value = 100;
                                        file.complete = true;
                                        file.error = 0;
                                        file.message = 'There is no error';
                                    }
                                }
                            }
                            this.uploadFinishedEvent.emit();
                        }
                    },

                    error => {
                        for (let file of this.fileLists) {
                            if (file.fileid == element.fileid) {
                                file.value = 0;
                                file.complete = true;
                                file.error = 1;
                                file.message = 'The format cannot be processed';
                            }
                        }
                    }
                )
            }
        );
    }
}