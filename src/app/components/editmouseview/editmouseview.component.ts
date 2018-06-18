//Angular core modules
import { 
    Component,  
    Input, 
    EventEmitter,
    Output
} from '@angular/core';

@Component({
    selector: 'editmouseview',
    templateUrl: './editmouseview.component.html',
    styleUrls: ['./editmouseview.component.css']
})
export class EditMouseView {

    @Input() mouselist;
    @Output('cancelButtonEvent') cancelButtonEvent = new EventEmitter<any>();
    @Output('updatefinishedEvent') updatefinishedEvent = new EventEmitter<any>();
    @Output('importImageevent') importImageevent = new EventEmitter<any>();
    constructor( ){
        
    }


    canceleventHandler(index){
        this.mouselist.splice(index, 1);
        this.cancelButtonEvent.emit(this.mouselist);
    }

    updatefinishedEventHandler(){
        this.updatefinishedEvent.emit();
    }

    importImageeventHandler(physical_id){
        this.importImageevent.emit(physical_id);
    }
}