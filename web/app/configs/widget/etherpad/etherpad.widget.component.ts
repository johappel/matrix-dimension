import { WidgetComponent } from "../widget.component";
import { EditableWidget, WIDGET_ETHERPAD } from "../../../shared/models/widget";
import { Component } from "@angular/core";
import { FE_EtherpadWidget } from "../../../shared/models/integration";
import { SessionStorage } from "../../../shared/SessionStorage";
import { NameService } from "../../../shared/services/name.service";
import * as url from "url";

@Component({
    templateUrl: "etherpad.widget.component.html",
    styleUrls: ["etherpad.widget.component.scss"],
})
export class EtherpadWidgetConfigComponent extends WidgetComponent {

    private etherpadWidget: FE_EtherpadWidget = <FE_EtherpadWidget>SessionStorage.editIntegration;

    constructor(private nameService: NameService) {
        super(WIDGET_ETHERPAD, "Etherpad", "generic", "etherpad", "padName");
    }

    protected generate_randomstring(length) {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    protected OnWidgetsDiscovered(widgets: EditableWidget[]): void {
        console.log(widgets);
        for (const widget of widgets) {
            if (!widget.dimension.newUrl.startsWith("http://") && !widget.dimension.newUrl.startsWith("https://")) {
                const parsedUrl = url.parse(widget.url, true);
                const padName = parsedUrl.query["padName"];

                // Set the new URL so that it unpacks correctly
                widget.url = `https://scalar.vector.im/etherpad/p/${padName}`;
            }
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
        const name = this.nameService.getHumanReadableName();

        const padid = this.generate_randomstring(20);

        let template = "https://scalar.vector.im/etherpad/p/$padName";
        if (this.etherpadWidget.options && this.etherpadWidget.options.defaultUrl) {
            template = this.etherpadWidget.options.defaultUrl;
        }

        template = template.replace("$padName", padid);

        widget.dimension.newUrl = template;
        widget.dimension.newName = name;
    }
}