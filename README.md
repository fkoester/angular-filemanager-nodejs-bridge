# angular-filemanager-nodejs-bridge

This project provides a backend for the fantastic [angular-filemanager](https://github.com/joni2back/angular-filemanager/) UI written with [Node.js](https://nodejs.org/) and [Express](http://expressjs.com/).

**CAUTION: This project is a work in progress!**

## Features

Currently the following operations are (partially) implemented:

* [Listing](https://github.com/joni2back/angular-filemanager/blob/master/API.md#listing-url-filemanagerconfiglisturl-method-post)
* [Remove](https://github.com/joni2back/angular-filemanager/blob/master/API.md#remove-url-filemanagerconfigremoveurl-method-post)
* [Create folder](https://github.com/joni2back/angular-filemanager/blob/master/API.md#create-folder-url-filemanagerconfigcreatefolderurl-method-post)
* [Upload file](https://github.com/joni2back/angular-filemanager/blob/master/API.md#upload-file-url-filemanagerconfiguploadurl-method-post-content-type-multipartform-data)
* [Download/Preview](https://github.com/joni2back/angular-filemanager/blob/master/API.md#download--preview-file-url-filemanagerconfigdownloadfileurl-method-get)

## TODO

* Proper error handling
* Missing API functions
  * [Rename/Move](https://github.com/joni2back/angular-filemanager/blob/master/API.md#rename--move-url-filemanagerconfigrenameurl-method-post)
  * [Copy](https://github.com/joni2back/angular-filemanager/blob/master/API.md#copy-url-filemanagerconfigcopyurl-method-post)
  * [Edit file](https://github.com/joni2back/angular-filemanager/blob/master/API.md#edit-file-url-filemanagerconfigediturl-method-post)
  * [Get content of a file](https://github.com/joni2back/angular-filemanager/blob/master/API.md#get-content-of-a-file-url-filemanagerconfiggetcontenturl-method-post)
  * [Set permissions](https://github.com/joni2back/angular-filemanager/blob/master/API.md#set-permissions-url-filemanagerconfigpermissionsurl-method-post)
  * [Compress file](https://github.com/joni2back/angular-filemanager/blob/master/API.md#compress-file-url-filemanagerconfigcompressurl-method-post)
  * [Extract file](https://github.com/joni2back/angular-filemanager/blob/master/API.md#extract-file-url-filemanagerconfigextracturl-method-post)

## Usage

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
      listUrl: 'http://localhost:5000/list',
      downloadFileUrl: 'http://localhost:5000/download',
      uploadUrl: 'http://localhost:5000/upload',
      removeUrl: 'http://localhost:5000/remove',
      createFolderUrl: 'http://localhost:5000/createFolder'
    });
  });
  ```

### Using Docker
You can also run this server via [Docker](https://www.docker.com/) using the image [maestroalubia/angular-filemanager-nodejs-bridge](https://hub.docker.com/r/maestroalubia/angular-filemanager-nodejs-bridge/).

The easiest way to get it up running is using [docker-compose](https://docs.docker.com/compose/), just run `docker-compose up` in the project root. This exports the host's `/tmp` directory. You can change this by changing the `docker-compose.yml` file.
