import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { EditableWidget, WIDGET_WHITEBOARD } from "../../../shared/models/widget";
import { SessionStorage } from "../../../shared/SessionStorage";
import { NameService } from "../../../shared/services/name.service";
import { FE_WhiteBoardWidget } from "../../../shared/models/integration";

@Component({
    templateUrl: "whiteboard.widget.component.html",
    styleUrls: ["whiteboard.widget.component.scss"],
})
export class WhiteboardWidgetComponent extends WidgetComponent {
    private whiteBoardWidget: FE_WhiteBoardWidget = <FE_WhiteBoardWidget>SessionStorage.editIntegration;

    constructor(private nameService: NameService) {
        super(WIDGET_WHITEBOARD, "Whiteboard", "generic", "whiteboard", "boardName");
    }
    protected OnWidgetsDiscovered(widgets: EditableWidget[]) {
        for (const widget of widgets) {
            //console.log('OnWidgetsDiscovered', widget);
            widget.url = widget.data.cloudurl;
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
        const name = this.nameService.getHumanReadableName();

        let template = "https://cloud13.de/testwhiteboard/?whiteboardid=$roomId_$boardName";
        if (this.whiteBoardWidget.options && this.whiteBoardWidget.options.defaultUrl) {
            template = this.whiteBoardWidget.options.defaultUrl;
        }

        template = template.replace("$roomId", encodeURIComponent(SessionStorage.roomId));
        template = template.replace("$boardName", encodeURIComponent(name));

        widget.dimension.newUrl = template;
        widget.dimension.newName = name;
    }
}
