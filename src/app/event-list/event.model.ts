
interface IEvent {
    event?: string;
    date?: string;
    time?: string;
    alertMessage?: string;
    displayEvent?: boolean;
    editMode?: boolean;
}

export class Event {

    public event?: string;
    public date?: string;
    public time?: string;
    public alertMessage?: string;
    public editMode?: boolean;
    public displayEvent?: boolean;
    constructor(event: IEvent) {
        event.editMode = this.setState(event)
        Object.assign(this, event);
    }
    setState(event: IEvent) {
        if (event == null || Object.keys(event).length === 0) {
            return true;
        }
        let editMode = false;
        Object.keys(event).forEach((key) => {
            console.log('from setState...', event[key]);
            if (event[key] == null) {
                editMode = true;

            }
        });
        return editMode;
    }
}