import { Component, Input } from "@angular/core";
import { storiesOf, moduleMetadata } from "@storybook/angular";

import { action } from "@storybook/addon-actions";
import {
	withKnobs,
	boolean,
	text,
	select,
	array
} from "@storybook/addon-knobs";

import {
	FileUploaderModule,
	NotificationModule,
	ButtonModule,
	DocumentationModule
} from "../";
import { NotificationService } from "../notification/notification.service";

@Component({
	selector: "app-file-uploader",
	template: `
		<ibm-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[accept]="accept"
			[multiple]="multiple"
			[skeleton]="skeleton"
			[(files)]="files"
			[size]="size">
		</ibm-file-uploader>

		<div [id]="notificationId" style="width: 300px; margin-top: 20px"></div>
		<button ibmButton *ngIf="files && files.size > 0" (click)="onUpload()">
			Upload
		</button>
	`
})
class FileUploaderStory {
	static notificationCount = 0;

	@Input() notificationId = `notification-${FileUploaderStory.notificationCount}`;
	@Input() files = new Set();
	@Input() title;
	@Input() description;
	@Input() buttonText;
	@Input() accept;
	@Input() multiple;
	@Input() skeleton = false;
	@Input() size = "normal";

	protected maxSize = 500000;

	constructor(protected notificationService: NotificationService) {
		FileUploaderStory.notificationCount++;
	}

	onUpload() {
		this.files.forEach(fileItem => {
			if (fileItem.file.size > this.maxSize) {
				this.notificationService.showNotification({
					type: "error",
					title: `'${fileItem.file.name}' exceeds size limit`,
					message: `500kb max size. Please select a new file and try again`,
					target: `#${this.notificationId}`
				});
			}
		});

		let filesArray = Array.from<any>(this.files);
		if (filesArray.every(fileItem => fileItem.file.size <= this.maxSize)) {
            this.files.forEach(fileItem => {
                if (!fileItem.uploaded) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}
			});
		}
	}
}

@Component({
	selector: "app-ngmodel-file-uploader",
	template: `
		<ibm-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[accept]="accept"
			[multiple]="multiple"
			[size]="size"
			[(ngModel)]="model">
		</ibm-file-uploader>

		<br><div [id]="notificationId" style="width: 300px"></div>
		<button ibmButton *ngIf="model && model.size > 0" (click)="onUpload()">
			Upload
		</button>
	`
})
class NgModelFileUploaderStory {
	static notificationCount = 0;

	@Input() notificationId = `notification-${FileUploaderStory.notificationCount}`;
	@Input() title;
	@Input() description;
	@Input() buttonText;
	@Input() accept;
	@Input() multiple;
	@Input() size = "normal";

	protected model = new Set();
	protected maxSize = 500000;

	constructor(protected notificationService: NotificationService) {
		FileUploaderStory.notificationCount++;
	}

	onUpload() {
		this.model.forEach(fileItem => {
			if (fileItem.file.size > this.maxSize) {
				this.notificationService.showNotification({
					type: "error",
					title: `'${fileItem.file.name}' exceeds size limit`,
					message: `500kb max size. Please select a new file and try again`,
					target: `#${this.notificationId}`
				});
			}
		});

		let filesArray = Array.from<any>(this.model);
		if (filesArray.every(fileItem => fileItem.file.size <= this.maxSize)) {
            this.model.forEach(fileItem => {
                if (!fileItem.uploaded) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}
			});
		}
	}
}

storiesOf("File Uploader", module)
	.addDecorator(
		moduleMetadata({
			imports: [FileUploaderModule, NotificationModule, ButtonModule, DocumentationModule],
			declarations: [FileUploaderStory, NgModelFileUploaderStory]
		})
	)
	.addDecorator(withKnobs)
	.add("Basic", () => ({
		template: `
			<app-file-uploader
				[title]="title"
				[description]="description"
				[buttonText]="buttonText"
				[accept]="accept"
				[multiple]="multiple"
				[size]="size">
			</app-file-uploader>
		`,
		props: {
			title: text("The title", "Account Photo"),
			description: text("The description", "only .jpg and .png files. 500kb max file size."),
			buttonText: text("Button text", "Add files"),
			size: select("size", {Small: "sm", Normal: "normal"}, "normal"),
			accept: array("Accepted file extensions", [".png", ".jpg"], ","),
			multiple: boolean("Supports multiple files", true)
		}
	}))
	.add("Using ngModel", () => ({
		template: `
			<app-ngmodel-file-uploader
				[title]="title"
				[description]="description"
				[buttonText]="buttonText"
				[accept]="accept"
				[multiple]="multiple"
				[size]="size">
			</app-ngmodel-file-uploader>
		`,
		props: {
			title: text("The title", "Account Photo"),
			description: text("The description", "only .jpg and .png files. 500kb max file size."),
			buttonText: text("Button text", "Add files"),
			size: select("size", {Small: "sm", Normal: "normal"}, "normal"),
			accept: array("Accepted file extensions", [".png", ".jpg"], ","),
			multiple: boolean("Supports multiple files", true)
		}
	}))
	.add("Skeleton", () => ({
		template: `
			<app-file-uploader skeleton="true"></app-file-uploader>
		`
	}))
	.add("Documentation", () => ({
		template: `
			<ibm-documentation src="documentation/components/FileUploader.html"></ibm-documentation>
		`
	}));

