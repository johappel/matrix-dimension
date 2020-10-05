import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { SessionStorage } from "../../../shared/SessionStorage";
import { EditableWidget, WIDGET_NEXTCLOUD } from "../../../shared/models/widget";
import { FE_NextcloudWidget } from "../../../shared/models/integration";
import { NameService } from "../../../shared/services/name.service";

@Component({
    templateUrl: "nextcloud.widget.component.html",
	styleUrls: ["nextcloud.widget.component.scss"]
})
export class NextcloudWidgetComponent extends WidgetComponent {

	private nextcloudWidget: FE_NextcloudWidget = <FE_NextcloudWidget>SessionStorage.editIntegration;

	constructor(private nameService: NameService) {
        super(WIDGET_NEXTCLOUD, "Nextcloud Widget", "generic", "nextcloud", "pass");
    }

	protected OnNewWidgetPrepared(widget: EditableWidget) {

		const name = this.nameService.getHumanReadableName();

		let template = "https://dev-tools.rpi-virtuell.de/webdav/nc-cli.php?dav=$url&pass=$pass&room=$room";

    	if (this.nextcloudWidget.options && this.nextcloudWidget.options.defaultUrl) {
			template = this.nextcloudWidget.options.defaultUrl;
		}
		template = template.replace("$room", encodeURIComponent(SessionStorage.roomId));
		template = template.replace("$boardName", encodeURIComponent(name));

        widget.dimension.newData.pass = "";
        widget.dimension.newData.cloudurl = "";
    }

	protected OnWidgetsDiscovered(widgets: EditableWidget[]) {
        for (const widget of widgets) {
            console.log('OnWidgetsDiscovered', widget);
			widget.url = widget.data.cloudurl;
			widget.dimension.newData.pass = widget.data.pass;
        }
    }


	protected OnWidgetBeforeEdit(widget: EditableWidget): void {

		console.log('OnWidgetBeforeEdit', widget);
		//widget.dimension.newUrl = widget.data.url;
		const room = SessionStorage.roomId;
		const url = widget.dimension.newUrl;
		const pass = widget.dimension.newData.pass;
		let template = "https://dev-tools.rpi-virtuell.de/webdav/nc-cli.php?dav=$url&pass=$pass&room=$room";

		template = template.replace("$url", encodeURIComponent(url));
		template = template.replace("$pass", pass);
		template = template.replace("$room", encodeURIComponent(room));

		widget.dimension.newUrl = template;
		widget.dimension.newData.cloudurl = url;
		widget.data.cloudurl = url
		widget.data.pass = pass
		widget.dimension.newTitle = widget.ownerId.replace(/@([^:]*):.*/, "$1");
	}

	protected OnWidgetAfterEdit(widget: EditableWidget): void {

		console.log('OnWidgetAfterEdit', widget);
		widget.dimension.newUrl = widget.data.cloudurl;
	}


	protected OnWidgetBeforeAdd(widget: EditableWidget): void {


		console.log('newNCWidget', widget);

		const room = SessionStorage.roomId;
		const url = widget.dimension.newUrl;
		const pass = widget.dimension.newData.pass;

		let template = "https://dev-tools.rpi-virtuell.de/webdav/nc-cli.php?dav=$url&pass=$pass&room=$room";

		template = template.replace("$url", encodeURIComponent(url));
		template = template.replace("$pass", pass);
		template = template.replace("$room", encodeURIComponent(room));

		widget.dimension.newUrl = template;
		widget.dimension.newData.cloudurl = url;
		widget.dimension.newTitle = widget.ownerId.replace(/@([^:]*):.*/, "$1");



    }

}

