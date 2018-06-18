//Angular core modules
import { Component, ViewChild } from '@angular/core';

//Http connectiontesting
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Model Class
import { Mouse } from '../app/components/model/mouse.component';
import { BASEURL, GETCAT } from '../app/constants/constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  //Toggling insertmouseview, if true, the view showup, if false, the view closeed
  insertmousechecked_flag = false;

  //Toggling updatefileview, if true, the view showup, if false, the view closeed
  uploadfileviewchecked_flag = false;

  //Toggling editmouse, if true, the view showup, if false, the view closeed
  editmousechecked_flag = true;

  //Used to set the setIntervel
  public timer_local;

  //Flags if connection is up
  public ifConnection = false;
  //References to each of the child view
  @ViewChild('tableview') tableview;
  @ViewChild('uploadfileview') uploadfileview;
  @ViewChild('insertmouseviewref') insertmouseviewref;

  public httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Headers': BASEURL,
        'Content-Type': 'application/json;charset=utf-8'
    })
};
  
  //Reference to the seleted mouse
  mouselist: Mouse[];


  
  constructor(private httpclient: HttpClient) { 
    
    let requesturl: string = BASEURL + GETCAT;

    //Change the status with online event triggered
    window.ononline = ()=>{
      this.ifConnection = true;
    }
    //Change the status with offline event triggered
    window.onoffline = () => {
      this.ifConnection = false;
    }


    //Check if it is online for the first time
    this.httpclient.get(requesturl).subscribe(
      success => {
        this.ifConnection = true;
      }, 
      error => {
        this.ifConnection = false;
      }
    )

  }


  //tableview related

  //It is called when insert mouse button is clicked
  insertmouseview() {
    this.insertmousechecked_flag = !this.insertmousechecked_flag;
  }

  //It is called when the confirm button is clicked during the mouse selection process
  confirmButtonEvent(mouselistparam) {
    this.mouselist = mouselistparam;
  }

  //It is called when the upload event triggers under dialog view inside the tableview, it will be called. 
  importtableImageeventHandler(physical_id){
    this.uploadfileview.startuploadImage(physical_id);

    this.uploadfileviewchecked_flag = true;
  }

  //It is called when the csv file selection is finished
  startUploading() {
    this.uploadfileview.startupload();
    this.uploadfileviewchecked_flag = true;
  }


  //EditMouse Related

  //It is pressed when editmouse cancel button is pressed
  //If all the edit view has been closed, closed the parent view
  cancelButtonEventHandler(mouselist) {
    if (mouselist.length == 0) {
      this.tableview.closeEditEnabled();
    }
  }

  //It is triggered when the image upload button is pressed and file is selected in the edit mouse view
  importImageeventHandler(physical_id){
    this.uploadfileview.startuploadImage(physical_id);
    this.uploadfileviewchecked_flag = true;
  }

  //It is triggered when the update mouse event is finished
  updatefinishedEventHandler(){
    console.log("Update Finished");
    this.tableview.getTableContent();
  }

  //InsertMouseView
  //It is triggered when the insert mouse is succeeded
  insertSuccessEventHandler() {
    this.tableview.getTableContent();
  }
  
  //It is triggered when the insertmose close buttonis pressed
  closepanel() {
    this.insertmouseview();
    this.tableview.closepanel();
  }

  //UpdateView Related


  //It is triggered when the csv upload actions is succeeds.
  //Fetched the tableview again
  uploadFinishedEventHandler() {
    this.tableview.getTableContent();

    this.insertmouseviewref.getCategoryData(false);
  }

  //Closed the parent update view when there is no tasks at all
  notaskseventHandler() {
    this.uploadfileviewchecked_flag = !this.uploadfileviewchecked_flag;
  }

  //When upload images finished, triggered get Image method in the dialog view under table view component
  uploadImageFinishedEventHandler(){
    if(this.tableview.dialogRef != null){
      this.tableview.dialogRef.componentInstance.getImage();
    }
  }

}

