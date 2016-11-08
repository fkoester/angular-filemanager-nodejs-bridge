# angular-filemanager-nodejs-bridge

This project provides a backend for the fantastic [angular-filemanager](https://github.com/joni2back/angular-filemanager/) UI written with [Node.js](https://nodejs.org/) and [Express](http://expressjs.com/).

**CAUTION: This project is currently not mainted!
If you want to take over this project or you already developed a better implementation, please send me a message and I will link to your project.**

## Features

Currently the following operations are (partially) implemented:
* Implement new API for [click-changes branch of angular-filemanager](https://github.com/joni2back/angular-filemanager/tree/click-changes).
* [Copy](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#copy-url-filemanagerconfigcopyurl-method-post)
* [Create folder](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#create-folder-url-filemanagerconfigcreatefolderurl-method-post)
* [Download/Preview](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#download--preview-file-url-filemanagerconfigdownloadfileurl-method-get)
* [Edit file](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#edit-file-url-filemanagerconfigediturl-method-post)
* [Get content of a file](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#get-content-of-a-file-url-filemanagerconfiggetcontenturl-method-post)
* [Listing](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#listing-url-filemanagerconfiglisturl-method-post)
* [Remove](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#remove-url-filemanagerconfigremoveurl-method-post)
* [Rename/Move](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#rename--move-url-filemanagerconfigrenameurl-method-post)
* [Upload file](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#upload-file-url-filemanagerconfiguploadurl-method-post-content-type-multipartform-data)
* Security: Ensure users cannot access paths they are not allowed to access (e.g. passing "../../" as path)
## TODO

* Proper error handling
* Missing API functions
  * Return correct file permissions
  * [Compress file](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#compress-file-url-filemanagerconfigcompressurl-method-post)
  * [Extract file](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#extract-file-url-filemanagerconfigextracturl-method-post)
  * [Set permissions](https://github.com/joni2back/angular-filemanager/blob/click-changes/API.md#set-permissions-url-filemanagerconfigpermissionsurl-method-post)


## Usage (standalone)

1. Checkout this Git repository:

  ```
  git clone https://github.com/fkoester/angular-filemanager-nodejs-bridge.git
  ```
2. Install dependencies:

  ```
  npm install
  ```
3. run

  ```
  DATA_DIR=/tmp npm start
  ```
  *Change DATA_DIR variable to the root folder you want angular-filemanager to operate on*
4. Configure angular-filemanager in your angular app:

  ```
  app.config(function (fileManagerConfigProvider) {
    var defaults = fileManagerConfigProvider.$get();

    fileManagerConfigProvider.set({
      copyUrl: '{/files}/copy', // where {/files} is the mount path of this module.
      createFolderUrl: '{/files}/createFolder',
      downloadFileUrl: '{/files}/download',
      editUrl: '{/files}/edit',
      removeUrl: '{/files}/remove',
      renameUrl: '{/files}/rename',
      uploadUrl: '{/files}/upload',
      getContentUrl: '{/files}/getContent',
      listUrl: '{/files}/list',
    });
  });
  ```

### Using Docker
You can also run this server via [Docker](https://www.docker.com/) using the image [maestroalubia/angular-filemanager-nodejs-bridge](https://hub.docker.com/r/maestroalubia/angular-filemanager-nodejs-bridge/).

The easiest way to get it up running is using [docker-compose](https://docs.docker.com/compose/), just run `docker-compose up` in the project root. This exports the host's `/tmp` directory. You can change this by changing the `docker-compose.yml` file.

## Usage (in other express application)

If you want to integrate this bridge into your own Express application you can do so by adding it as a dependency:

1. Install via npm

   ```
   npm install --save angular-filemanager-nodejs-bridge
   ```

2. Import and configure the router

   ```
   const express = require('express');
   const filesRouter = require('angular-filemanager-nodejs-bridge').router;
   const routes = express.Router();

   routes.use('/files', filesRouter);
   ```
3. Configure a custom base dir function (optional)

  ```
  const pathresolver = require('angular-filemanager-nodejs-bridge').pathresolver;

  pathresolver.baseDir = function(req) {

    if(req.body.username = 'foo') {
      return '/foo';
    }

    return '/bar';
  };
  ```
