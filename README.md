# Tsuki-tag

Aggregated Imageboard browser built using Electron which lets you browse multiple image sources in a combined view, search images using tags and download images into configured workspaces with filename templating support. Tsuki-tag can inject EXIF metadata information (tag, image attributes, etc.) into the images during downloading, with an additional option to convert non-JPG images to JPG images which support EXIF metadata. This could provide artists with a great way of creating and organizing a collection of images for reference, and search the local images using the tags injected into the image. Additionally, Tsuki-tag can also hold and browse a local list of your favorite images.

![Tsuki-tag main window](/docs/images/tsuki-tag-main.png)

# Features

- Browse an aggregated collection of images retrieved from a number of pre-configured image providers using either manual pagination, or endless scrolling mode.
- Fine-tune which providers are queried, along with what type of images should be shown ('safe', 'questionable', 'explicit').
- Filter images using tags. Tags seen in the current search session are suggested for auto-completion.
- View image attributes and tags on image hover.
- Keep a local list of your favorite images which can be browsed the same way as the online image providers.
- Open selected images in full window screen to view tags, metadata and download to workspaces, without interrupting your current search flow.
- Workspace support, which lets you create and manage multiple download folders. Configure all settings per workspace.
- Download images into configured workspaces, with either sample, or full image size. 
- Convert non-JPG images into JPG images for EXIF support.
- Inject EXIF metadata such as the tags assigned to the picture, along with other image attributes, directly into JPG images during downloading.
- Add, edit, or remove image tags before saving the image.
- Filename templating support.

# Current List of image providers

- Safebooru
- Gelbooru
- Danbooru
- Konachan

# Workspaces

Thuki-tag allows you to manage multiple download folders, 'workspaces', and manage a set of settings per workspace. A default workspace can be selected which will be the default download option offered.

![Tsuki-tag workspaces](/docs/images/tsuki-tag-workspaces.png)

# Image modal

Selecting an image from the collection opens up a full-sized modal with details of the image, such as tags, attributes, original source, etc. The modal also allows you to save the image to the default, or a specific workspace, along with the option to favorite an image, which will keep a local note of the image location and data. The tags shown in the modal can be freely modified, removed or added to, before downloading the image and injecting the EXIF metadata.

![Tsuki-tag image modal](/docs/images/tsuki-tag-modal.png)

# Possible future features

- Integrating more image providers.
- Browsing local workspaces the same way as the online providers.
- Image selection and mass downloading system.
- Open multiple selected images in a configurable single screen (reference mode).

# Run & build

Existing nodeJS installation is required. Yarn is advised to manage and build the project.

```
npm install yarn
yarn install && yarn run dev
```

To build an installer and portable instance of the project:
```
yarn run build
```

# License

GNU GPL v3